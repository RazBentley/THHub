import React, { useState, useCallback, useEffect } from 'react';
import {
  View, Text, StyleSheet, TextInput, FlatList, TouchableOpacity,
  Alert, Modal, Keyboard, TouchableWithoutFeedback,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { collection, addDoc, getDocs, deleteDoc, doc, getDoc } from 'firebase/firestore';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../lib/firebase';
import { searchFoods, getNutritionPer100g, getProductByBarcode, saveToSharedDatabase } from '../../lib/openFoodFacts';
import { OpenFoodFactsProduct, FoodEntry } from '../../types';
import { colors, spacing, fontSize, borderRadius, shadows } from '../../components/ui/theme';
import { Button } from '../../components/ui/Button';
import { InactiveGate } from '../../components/ui/InactiveGate';

export default function NutritionScreen() {
  const { profile } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<OpenFoodFactsProduct[]>([]);
  const [searching, setSearching] = useState(false);
  const [todayEntries, setTodayEntries] = useState<FoodEntry[]>([]);
  const [showSearch, setShowSearch] = useState(false);

  // Nutrition targets (loaded from Firestore, with sensible defaults)
  const [targets, setTargets] = useState({ calories: 2200, protein: 150, carbs: 250, fat: 70 });

  // Gram input modal state
  const [selectedProduct, setSelectedProduct] = useState<OpenFoodFactsProduct | null>(null);
  const [gramsInput, setGramsInput] = useState('100');
  const [unit, setUnit] = useState<'g' | 'ml'>('g');

  // Barcode scanner state
  const [showScanner, setShowScanner] = useState(false);
  const [scanningBarcode, setScanningBarcode] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();

  // Custom food modal state
  const [showCustomFood, setShowCustomFood] = useState(false);
  const [customName, setCustomName] = useState('');
  const [customCalories, setCustomCalories] = useState('');
  const [customProtein, setCustomProtein] = useState('');
  const [customCarbs, setCustomCarbs] = useState('');
  const [customFat, setCustomFat] = useState('');

  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    loadTodayEntries();
    loadNutritionTargets();
  }, []);

  async function loadNutritionTargets() {
    if (!profile) return;
    try {
      // Try user-specific settings first
      const settingsDoc = await getDoc(doc(db, 'users', profile.uid, 'settings', 'nutritionTargets'));
      if (settingsDoc.exists()) {
        const data = settingsDoc.data();
        setTargets((prev) => ({
          calories: data.calories ?? prev.calories,
          protein: data.protein ?? prev.protein,
          carbs: data.carbs ?? prev.carbs,
          fat: data.fat ?? prev.fat,
        }));
        return;
      }

      // Fall back to meal plan targets
      const planDoc = await getDoc(doc(db, 'users', profile.uid, 'mealPlan', 'current'));
      if (planDoc.exists()) {
        const plan = planDoc.data();
        setTargets((prev) => ({
          calories: plan.calorieTarget ?? prev.calories,
          protein: plan.proteinTarget ?? prev.protein,
          carbs: plan.carbsTarget ?? prev.carbs,
          fat: plan.fatTarget ?? prev.fat,
        }));
      }
    } catch {
      // Keep defaults on error
    }
  }

  async function loadTodayEntries() {
    if (!profile) return;
    try {
      const snap = await getDocs(
        collection(db, 'users', profile.uid, 'foodLog', today, 'entries')
      );
      const entries: FoodEntry[] = [];
      snap.forEach((doc) => entries.push({ id: doc.id, ...doc.data() } as FoodEntry));
      entries.sort((a, b) => b.timestamp - a.timestamp);
      setTodayEntries(entries);
    } catch (err) {
      // handle error silently
    }
  }

  const handleSearch = useCallback(async () => {
    if (!searchQuery.trim()) return;
    setSearching(true);
    try {
      const results = await searchFoods(searchQuery);
      setSearchResults(results);
    } catch (err: any) {
      console.error('Food search error:', err?.message || err);
      Alert.alert('Search Error', err?.message || 'Failed to search foods');
    } finally {
      setSearching(false);
    }
  }, [searchQuery]);

  const openScanner = async () => {
    if (!permission?.granted) {
      const result = await requestPermission();
      if (!result.granted) {
        Alert.alert('Permission Required', 'Camera access is needed to scan barcodes.');
        return;
      }
    }
    setShowScanner(true);
  };

  const handleBarcodeScan = async ({ data }: { data: string }) => {
    if (scanningBarcode) return;
    setScanningBarcode(true);
    // Close scanner immediately to prevent duplicate scans
    setShowScanner(false);

    try {
      const product = await getProductByBarcode(data);
      if (product && product.product_name) {
        selectProduct(product);
      } else {
        Alert.alert('Not Found', `No product found for barcode: ${data}`, [
          { text: 'Scan Again', onPress: () => { setScanningBarcode(false); setShowScanner(true); } },
          { text: 'Add Manually', onPress: () => { setScanningBarcode(false); openCustomFood(); } },
          { text: 'Cancel', onPress: () => setScanningBarcode(false) },
        ]);
      }
    } catch {
      Alert.alert('Error', 'Failed to look up barcode. Check your connection.', [
        { text: 'Try Again', onPress: () => { setScanningBarcode(false); setShowScanner(true); } },
        { text: 'Cancel', onPress: () => setScanningBarcode(false) },
      ]);
    }
  };

  const selectProduct = (product: OpenFoodFactsProduct) => {
    setSelectedProduct(product);
    setGramsInput('100');
    // Auto-detect drinks and default to ml
    const name = (product.product_name || '').toLowerCase();
    const drinkKeywords = ['milk', 'juice', 'water', 'cola', 'coke', 'pepsi', 'drink', 'smoothie', 'shake', 'squash', 'coffee', 'tea', 'latte', 'cappuccino', 'soda', 'lemonade', 'beer', 'wine', 'spirit', 'vodka', 'gin', 'rum', 'whisky', 'oat milk', 'almond milk', 'protein shake'];
    const isDrink = drinkKeywords.some(k => name.includes(k)) ||
      (product.serving_size || '').toLowerCase().includes('ml');
    setUnit(isDrink ? 'ml' : 'g');
  };

  const confirmAddFood = async () => {
    if (!profile || !selectedProduct) return;
    const grams = parseFloat(gramsInput) || 100;
    const multiplier = grams / 100;
    const nutrition = getNutritionPer100g(selectedProduct);

    const entry: Omit<FoodEntry, 'id'> = {
      foodName: selectedProduct.product_name,
      brand: selectedProduct.brands,
      calories: Math.round(nutrition.calories * multiplier),
      protein: Math.round(nutrition.protein * multiplier * 10) / 10,
      carbs: Math.round(nutrition.carbs * multiplier * 10) / 10,
      fat: Math.round(nutrition.fat * multiplier * 10) / 10,
      servingSize: `${grams}${unit}`,
      quantity: 1,
      timestamp: Date.now(),
    };

    try {
      await addDoc(
        collection(db, 'users', profile.uid, 'foodLog', today, 'entries'),
        entry
      );
      // Save to shared database so other clients can find this food
      saveToSharedDatabase(selectedProduct);
      await loadTodayEntries();
      setSelectedProduct(null);
      setShowSearch(false);
      setSearchQuery('');
      setSearchResults([]);
    } catch (err) {
      Alert.alert('Error', 'Failed to log food');
    }
  };

  const removeEntry = async (entryId: string) => {
    if (!profile) return;
    try {
      await deleteDoc(doc(db, 'users', profile.uid, 'foodLog', today, 'entries', entryId));
      setTodayEntries((prev) => prev.filter((e) => e.id !== entryId));
    } catch (err) {
      Alert.alert('Error', 'Failed to remove entry');
    }
  };

  const openCustomFood = () => {
    setCustomName(searchQuery || '');
    setCustomCalories('');
    setCustomProtein('');
    setCustomCarbs('');
    setCustomFat('');
    setShowCustomFood(true);
  };

  const saveCustomFood = () => {
    if (!customName.trim()) {
      Alert.alert('Error', 'Please enter a food name');
      return;
    }
    const product: OpenFoodFactsProduct = {
      code: `manual-${Date.now()}`,
      product_name: customName.trim(),
      brands: 'Manual Entry',
      serving_size: '100g',
      nutriments: {
        'energy-kcal_100g': parseFloat(customCalories) || 0,
        proteins_100g: parseFloat(customProtein) || 0,
        carbohydrates_100g: parseFloat(customCarbs) || 0,
        fat_100g: parseFloat(customFat) || 0,
      },
    };
    setShowCustomFood(false);
    selectProduct(product);
  };

  const totals = todayEntries.reduce(
    (acc, entry) => ({
      calories: acc.calories + entry.calories,
      protein: acc.protein + entry.protein,
      carbs: acc.carbs + entry.carbs,
      fat: acc.fat + entry.fat,
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  );

  // Preview macros based on current gram input
  const previewGrams = parseFloat(gramsInput) || 0;
  const previewMultiplier = previewGrams / 100;
  const previewNutrition = selectedProduct
    ? getNutritionPer100g(selectedProduct)
    : { calories: 0, protein: 0, carbs: 0, fat: 0 };

  return (
    <InactiveGate>
    <View style={styles.container}>
      {/* Daily Summary with Progress Bars */}
      <View style={[styles.summary, shadows.sm]}>
        <Text style={styles.date}>{new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })}</Text>

        {/* Calorie bar */}
        <View style={styles.macroBarRow}>
          <View style={styles.macroBarInfo}>
            <Ionicons name="flame" size={16} color={colors.accent} />
            <Text style={[styles.macroBarValue, { color: colors.accent }]}>{Math.round(totals.calories)}</Text>
            <Text style={styles.macroBarTarget}>/ {targets.calories} kcal</Text>
          </View>
          <View style={styles.progressBarBg}>
            <LinearGradient
              colors={[colors.accent, colors.accent + 'CC']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={[styles.progressBarFill, { width: `${Math.min((totals.calories / targets.calories) * 100, 100)}%` }]}
            />
          </View>
        </View>

        {/* Macro bars row */}
        <View style={styles.macroRow}>
          <View style={styles.macroItem}>
            <View style={styles.macroBarInfo}>
              <Text style={[styles.macroSmallValue, { color: colors.primary }]}>{totals.protein.toFixed(0)}g</Text>
              <Text style={styles.macroSmallLabel}>Protein</Text>
            </View>
            <View style={styles.progressBarSmallBg}>
              <View style={[styles.progressBarSmallFill, { backgroundColor: colors.primary, width: `${Math.min((totals.protein / targets.protein) * 100, 100)}%` }]} />
            </View>
          </View>
          <View style={styles.macroItem}>
            <View style={styles.macroBarInfo}>
              <Text style={[styles.macroSmallValue, { color: colors.warning }]}>{totals.carbs.toFixed(0)}g</Text>
              <Text style={styles.macroSmallLabel}>Carbs</Text>
            </View>
            <View style={styles.progressBarSmallBg}>
              <View style={[styles.progressBarSmallFill, { backgroundColor: colors.warning, width: `${Math.min((totals.carbs / targets.carbs) * 100, 100)}%` }]} />
            </View>
          </View>
          <View style={styles.macroItem}>
            <View style={styles.macroBarInfo}>
              <Text style={[styles.macroSmallValue, { color: colors.success }]}>{totals.fat.toFixed(0)}g</Text>
              <Text style={styles.macroSmallLabel}>Fat</Text>
            </View>
            <View style={styles.progressBarSmallBg}>
              <View style={[styles.progressBarSmallFill, { backgroundColor: colors.success, width: `${Math.min((totals.fat / targets.fat) * 100, 100)}%` }]} />
            </View>
          </View>
        </View>
      </View>

      {/* Add Food Buttons */}
      {!showSearch && (
        <View style={styles.addButtonRow}>
          <TouchableOpacity style={styles.addButton} onPress={() => setShowSearch(true)}>
            <Ionicons name="search" size={22} color={colors.primary} />
            <Text style={styles.addButtonText}>Search Food</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.scanButton} onPress={openScanner}>
            <Ionicons name="barcode-outline" size={22} color={colors.accent} />
            <Text style={styles.scanButtonText}>Scan Barcode</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Search Section */}
      {showSearch && (
        <View style={styles.searchSection}>
          <View style={styles.searchBar}>
            <Ionicons name="search" size={20} color={colors.textMuted} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search for food..."
              placeholderTextColor={colors.textMuted}
              value={searchQuery}
              onChangeText={setSearchQuery}
              onSubmitEditing={handleSearch}
              returnKeyType="search"
              autoFocus
            />
            <TouchableOpacity onPress={() => { setShowSearch(false); setSearchResults([]); setSearchQuery(''); }} accessibilityLabel="Close search">
              <Ionicons name="close" size={22} color={colors.textMuted} />
            </TouchableOpacity>
          </View>
          <View style={{ flexDirection: 'row', gap: spacing.sm, marginTop: spacing.sm }}>
            <Button title="Search" onPress={handleSearch} loading={searching} style={{ flex: 1 }} />
            <TouchableOpacity style={styles.manualButton} onPress={openCustomFood}>
              <Ionicons name="create-outline" size={18} color={colors.success} />
              <Text style={styles.manualButtonText}>Manual</Text>
            </TouchableOpacity>
          </View>

          {searchResults.length > 0 && (
            <FlatList
              data={searchResults}
              keyExtractor={(item) => item.code}
              style={styles.resultsList}
              renderItem={({ item }) => {
                const nutrition = getNutritionPer100g(item);
                return (
                  <TouchableOpacity style={styles.resultItem} onPress={() => selectProduct(item)}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.foodName} numberOfLines={1}>{item.product_name}</Text>
                      {item.brands && <Text style={styles.brandText}>{item.brands}</Text>}
                      <Text style={styles.nutritionText}>
                        Per 100g: {nutrition.calories} kcal | P: {nutrition.protein}g | C: {nutrition.carbs}g | F: {nutrition.fat}g
                      </Text>
                    </View>
                    <Ionicons name="add-circle-outline" size={28} color={colors.success} />
                  </TouchableOpacity>
                );
              }}
            />
          )}
        </View>
      )}

      {/* Today's Food Log */}
      {!showSearch && (
        <FlatList
          data={todayEntries}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.logList}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Ionicons name="nutrition-outline" size={48} color={colors.textMuted} />
              <Text style={styles.emptyText}>No food logged today</Text>
              <Text style={styles.emptySubtext}>Tap "Add Food" to start tracking</Text>
            </View>
          }
          renderItem={({ item }) => (
            <View style={styles.logEntry}>
              <View style={{ flex: 1 }}>
                <Text style={styles.foodName}>{item.foodName}</Text>
                <Text style={styles.servingText}>{item.servingSize}</Text>
                <Text style={styles.nutritionText}>
                  {item.calories} kcal | P: {item.protein}g | C: {item.carbs}g | F: {item.fat}g
                </Text>
              </View>
              <TouchableOpacity onPress={() => removeEntry(item.id)} accessibilityLabel={`Remove ${item.foodName}`}>
                <Ionicons name="trash-outline" size={20} color={colors.error} />
              </TouchableOpacity>
            </View>
          )}
        />
      )}

      {/* Custom Food Modal */}
      <Modal
        visible={showCustomFood}
        transparent
        animationType="fade"
        onRequestClose={() => setShowCustomFood(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add Custom Food</Text>
            <Text style={styles.modalBrand}>Enter the nutritional info per 100g (check the label)</Text>

            <Text style={styles.modalLabel}>Food Name</Text>
            <TextInput
              style={styles.customInput}
              value={customName}
              onChangeText={setCustomName}
              placeholder="e.g. Frylight Olive Oil Spray"
              placeholderTextColor={colors.textMuted}
              autoFocus
            />

            <View style={styles.customMacroGrid}>
              <View style={styles.customMacroItem}>
                <Text style={[styles.customMacroLabel, { color: colors.accent }]}>Calories</Text>
                <TextInput
                  style={styles.customMacroInput}
                  value={customCalories}
                  onChangeText={setCustomCalories}
                  placeholder="0"
                  placeholderTextColor={colors.textMuted}
                  keyboardType="numeric"
                />
              </View>
              <View style={styles.customMacroItem}>
                <Text style={[styles.customMacroLabel, { color: colors.primary }]}>Protein (g)</Text>
                <TextInput
                  style={styles.customMacroInput}
                  value={customProtein}
                  onChangeText={setCustomProtein}
                  placeholder="0"
                  placeholderTextColor={colors.textMuted}
                  keyboardType="numeric"
                />
              </View>
              <View style={styles.customMacroItem}>
                <Text style={[styles.customMacroLabel, { color: colors.warning }]}>Carbs (g)</Text>
                <TextInput
                  style={styles.customMacroInput}
                  value={customCarbs}
                  onChangeText={setCustomCarbs}
                  placeholder="0"
                  placeholderTextColor={colors.textMuted}
                  keyboardType="numeric"
                />
              </View>
              <View style={styles.customMacroItem}>
                <Text style={[styles.customMacroLabel, { color: colors.success }]}>Fat (g)</Text>
                <TextInput
                  style={styles.customMacroInput}
                  value={customFat}
                  onChangeText={setCustomFat}
                  placeholder="0"
                  placeholderTextColor={colors.textMuted}
                  keyboardType="numeric"
                />
              </View>
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.cancelButton} onPress={() => setShowCustomFood(false)}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.confirmButton} onPress={saveCustomFood}>
                <Text style={styles.confirmButtonText}>Next</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Barcode Scanner Modal */}
      <Modal
        visible={showScanner}
        animationType="slide"
        onRequestClose={() => { setShowScanner(false); setScanningBarcode(false); }}
      >
        <View style={styles.scannerContainer}>
          <CameraView
            style={styles.camera}
            barcodeScannerSettings={{
              barcodeTypes: ['ean13', 'ean8', 'upc_a', 'upc_e', 'code128'],
            }}
            onBarcodeScanned={scanningBarcode ? undefined : handleBarcodeScan}
          >
            <View style={styles.scannerOverlay}>
              <View style={styles.scannerHeader}>
                <TouchableOpacity
                  style={styles.scannerCloseButton}
                  onPress={() => { setShowScanner(false); setScanningBarcode(false); }}
                  accessibilityLabel="Close barcode scanner"
                >
                  <Ionicons name="close" size={28} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.scannerTitle}>Scan Barcode</Text>
                <View style={{ width: 40 }} />
              </View>
              <View style={styles.scannerFrame}>
                <View style={styles.scannerCornerTL} />
                <View style={styles.scannerCornerTR} />
                <View style={styles.scannerCornerBL} />
                <View style={styles.scannerCornerBR} />
              </View>
              <Text style={styles.scannerHint}>
                Point your camera at a food product barcode
              </Text>
            </View>
          </CameraView>
        </View>
      </Modal>

      {/* Gram/ml Input Modal */}
      <Modal
        visible={selectedProduct !== null}
        transparent
        animationType="fade"
        onRequestClose={() => setSelectedProduct(null)}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{selectedProduct?.product_name}</Text>
            {selectedProduct?.brands && (
              <Text style={styles.modalBrand}>{selectedProduct.brands}</Text>
            )}

            {/* g/ml toggle */}
            <View style={styles.unitToggle}>
              <TouchableOpacity
                style={[styles.unitBtn, unit === 'g' && styles.unitBtnActive]}
                onPress={() => setUnit('g')}
              >
                <Text style={[styles.unitBtnText, unit === 'g' && styles.unitBtnTextActive]}>Grams (g)</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.unitBtn, unit === 'ml' && styles.unitBtnActive]}
                onPress={() => setUnit('ml')}
              >
                <Text style={[styles.unitBtnText, unit === 'ml' && styles.unitBtnTextActive]}>Millilitres (ml)</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.modalLabel}>How much ({unit})?</Text>
            <View style={styles.gramsInputRow}>
              <TextInput
                style={styles.gramsInput}
                value={gramsInput}
                onChangeText={setGramsInput}
                keyboardType="numeric"
                selectTextOnFocus
                placeholder="100"
                placeholderTextColor={colors.textMuted}
              />
            </View>

            {/* Quick amount buttons */}
            <View style={styles.quickGrams}>
              {(unit === 'ml' ? ['100', '200', '250', '330', '500'] : ['50', '100', '150', '200', '250']).map((g) => (
                <TouchableOpacity
                  key={g}
                  style={[styles.quickGramButton, gramsInput === g && styles.quickGramActive]}
                  onPress={() => { setGramsInput(g); Keyboard.dismiss(); }}
                >
                  <Text style={[styles.quickGramText, gramsInput === g && styles.quickGramTextActive]}>
                    {g}{unit}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Live preview of macros */}
            <View style={styles.previewCard}>
              <Text style={styles.previewTitle}>Nutritional breakdown</Text>
              <View style={styles.previewRow}>
                <View style={styles.previewItem}>
                  <Text style={[styles.previewValue, { color: colors.accent }]}>
                    {Math.round(previewNutrition.calories * previewMultiplier)}
                  </Text>
                  <Text style={styles.previewLabel}>kcal</Text>
                </View>
                <View style={styles.previewItem}>
                  <Text style={[styles.previewValue, { color: colors.primary }]}>
                    {(previewNutrition.protein * previewMultiplier).toFixed(1)}g
                  </Text>
                  <Text style={styles.previewLabel}>Protein</Text>
                </View>
                <View style={styles.previewItem}>
                  <Text style={[styles.previewValue, { color: colors.warning }]}>
                    {(previewNutrition.carbs * previewMultiplier).toFixed(1)}g
                  </Text>
                  <Text style={styles.previewLabel}>Carbs</Text>
                </View>
                <View style={styles.previewItem}>
                  <Text style={[styles.previewValue, { color: colors.success }]}>
                    {(previewNutrition.fat * previewMultiplier).toFixed(1)}g
                  </Text>
                  <Text style={styles.previewLabel}>Fat</Text>
                </View>
              </View>
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setSelectedProduct(null)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.confirmButton}
                onPress={confirmAddFood}
              >
                <Text style={styles.confirmButtonText}>Add to Log</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
    </InactiveGate>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  summary: {
    backgroundColor: colors.surface,
    padding: spacing.lg,
    margin: spacing.md,
    borderRadius: borderRadius.lg,
  },
  date: {
    color: colors.textSecondary,
    fontSize: fontSize.sm,
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  macroBarRow: {
    marginBottom: spacing.md,
  },
  macroBarInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: spacing.xs,
  },
  macroBarValue: {
    fontSize: fontSize.lg,
    fontWeight: '800',
  },
  macroBarTarget: {
    color: colors.textMuted,
    fontSize: fontSize.sm,
  },
  progressBarBg: {
    height: 8,
    backgroundColor: colors.surfaceLight,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  macroRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  macroItem: {
    flex: 1,
  },
  macroSmallValue: {
    fontSize: fontSize.sm,
    fontWeight: '800',
  },
  macroSmallLabel: {
    color: colors.textMuted,
    fontSize: fontSize.xs,
  },
  progressBarSmallBg: {
    height: 4,
    backgroundColor: colors.surfaceLight,
    borderRadius: 2,
    overflow: 'hidden',
    marginTop: 4,
  },
  progressBarSmallFill: {
    height: '100%',
    borderRadius: 2,
  },
  addButtonRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginHorizontal: spacing.md,
    marginTop: 0,
  },
  addButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.primary + '40',
    borderStyle: 'dashed',
  },
  addButtonText: {
    color: colors.primary,
    fontSize: fontSize.sm,
    fontWeight: '600',
    marginLeft: spacing.xs,
  },
  scanButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.accent + '40',
    borderStyle: 'dashed',
  },
  scanButtonText: {
    color: colors.accent,
    fontSize: fontSize.sm,
    fontWeight: '600',
    marginLeft: spacing.xs,
  },
  searchSection: {
    padding: spacing.md,
    paddingTop: 0,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.inputBackground,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  searchInput: {
    flex: 1,
    color: colors.text,
    fontSize: fontSize.md,
    paddingVertical: spacing.md,
    marginLeft: spacing.sm,
  },
  resultsList: {
    maxHeight: 300,
    marginTop: spacing.sm,
  },
  resultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: borderRadius.sm,
    marginBottom: spacing.xs,
  },
  foodName: {
    color: colors.text,
    fontSize: fontSize.md,
    fontWeight: '600',
  },
  brandText: {
    color: colors.textMuted,
    fontSize: fontSize.xs,
    marginTop: 2,
  },
  servingText: {
    color: colors.accent,
    fontSize: fontSize.xs,
    fontWeight: '600',
    marginTop: 2,
  },
  nutritionText: {
    color: colors.textSecondary,
    fontSize: fontSize.xs,
    marginTop: spacing.xs,
  },
  logList: {
    padding: spacing.md,
    paddingTop: 0,
  },
  logEntry: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    marginBottom: spacing.sm,
  },
  emptyState: {
    alignItems: 'center',
    padding: spacing.xxl,
  },
  emptyText: {
    color: colors.textSecondary,
    fontSize: fontSize.md,
    fontWeight: '600',
    marginTop: spacing.md,
  },
  emptySubtext: {
    color: colors.textMuted,
    fontSize: fontSize.sm,
    marginTop: spacing.xs,
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.md,
  },
  modalContent: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    width: '100%',
    maxWidth: 360,
  },
  modalTitle: {
    color: colors.text,
    fontSize: fontSize.lg,
    fontWeight: '700',
  },
  modalBrand: {
    color: colors.textMuted,
    fontSize: fontSize.sm,
    marginTop: 2,
  },
  unitToggle: { flexDirection: 'row', backgroundColor: colors.background, borderRadius: borderRadius.md, padding: spacing.xs, marginTop: spacing.md },
  unitBtn: { flex: 1, paddingVertical: spacing.sm, alignItems: 'center', borderRadius: borderRadius.sm },
  unitBtnActive: { backgroundColor: colors.primary },
  unitBtnText: { color: colors.textMuted, fontSize: fontSize.sm, fontWeight: '600' },
  unitBtnTextActive: { color: '#fff' },
  modalLabel: {
    color: colors.textSecondary,
    fontSize: fontSize.sm,
    fontWeight: '600',
    marginTop: spacing.md,
    marginBottom: spacing.xs,
  },
  gramsInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.inputBackground,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.primary,
    paddingHorizontal: spacing.sm,
  },
  gramsInput: {
    flex: 1,
    color: colors.text,
    fontSize: fontSize.xl,
    fontWeight: '800',
    textAlign: 'center',
    paddingVertical: spacing.sm,
  },
  quickGrams: {
    flexDirection: 'row',
    gap: spacing.xs,
    marginTop: spacing.sm,
  },
  quickGramButton: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    backgroundColor: colors.surfaceLight,
  },
  quickGramActive: {
    backgroundColor: colors.primary,
  },
  quickGramText: {
    color: colors.textMuted,
    fontSize: fontSize.sm,
    fontWeight: '600',
  },
  quickGramTextActive: {
    color: '#fff',
  },
  previewCard: {
    backgroundColor: colors.background,
    borderRadius: borderRadius.md,
    padding: spacing.sm,
    marginTop: spacing.md,
  },
  previewTitle: {
    color: colors.textMuted,
    fontSize: fontSize.xs,
    textAlign: 'center',
    marginBottom: spacing.sm,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  previewRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  previewItem: {
    alignItems: 'center',
  },
  previewValue: {
    fontSize: fontSize.lg,
    fontWeight: '800',
  },
  previewLabel: {
    color: colors.textMuted,
    fontSize: fontSize.xs,
    marginTop: 2,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: colors.textSecondary,
    fontSize: fontSize.md,
    fontWeight: '600',
  },
  confirmButton: {
    flex: 2,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    backgroundColor: colors.primary,
    alignItems: 'center',
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: fontSize.md,
    fontWeight: '700',
  },
  // Manual entry button
  manualButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.success + '40',
    gap: spacing.xs,
  },
  manualButtonText: {
    color: colors.success,
    fontSize: fontSize.sm,
    fontWeight: '600',
  },
  // Custom food modal
  customInput: {
    backgroundColor: colors.inputBackground,
    borderRadius: borderRadius.md,
    padding: spacing.sm,
    color: colors.text,
    fontSize: fontSize.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  customMacroGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginTop: spacing.md,
    marginBottom: spacing.md,
  },
  customMacroItem: {
    width: '47%',
  },
  customMacroLabel: {
    fontSize: fontSize.xs,
    fontWeight: '600',
    marginBottom: spacing.xs,
  },
  customMacroInput: {
    backgroundColor: colors.inputBackground,
    borderRadius: borderRadius.sm,
    padding: spacing.sm,
    color: colors.text,
    fontSize: fontSize.md,
    fontWeight: '700',
    textAlign: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  // Scanner styles
  scannerContainer: {
    flex: 1,
    backgroundColor: '#000',
  },
  camera: {
    flex: 1,
  },
  scannerOverlay: {
    flex: 1,
    justifyContent: 'space-between',
    padding: spacing.lg,
  },
  scannerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: spacing.xxl,
  },
  scannerCloseButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scannerTitle: {
    color: '#fff',
    fontSize: fontSize.lg,
    fontWeight: '700',
  },
  scannerFrame: {
    width: 250,
    height: 250,
    alignSelf: 'center',
    position: 'relative',
  },
  scannerCornerTL: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 40,
    height: 40,
    borderTopWidth: 3,
    borderLeftWidth: 3,
    borderColor: colors.primary,
    borderTopLeftRadius: 8,
  },
  scannerCornerTR: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 40,
    height: 40,
    borderTopWidth: 3,
    borderRightWidth: 3,
    borderColor: colors.primary,
    borderTopRightRadius: 8,
  },
  scannerCornerBL: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: 40,
    height: 40,
    borderBottomWidth: 3,
    borderLeftWidth: 3,
    borderColor: colors.primary,
    borderBottomLeftRadius: 8,
  },
  scannerCornerBR: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 40,
    height: 40,
    borderBottomWidth: 3,
    borderRightWidth: 3,
    borderColor: colors.primary,
    borderBottomRightRadius: 8,
  },
  scannerHint: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: fontSize.sm,
    textAlign: 'center',
    paddingBottom: spacing.xxl,
  },
});
