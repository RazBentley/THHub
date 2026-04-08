import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl,
  Modal, TextInput, Alert, KeyboardAvoidingView, Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { doc, getDoc, setDoc, addDoc, collection, getDocs, deleteDoc, query, where } from 'firebase/firestore';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../lib/firebase';
import { MealPlan, DailyProgress, ExtraFoodItem } from '../../types';
import { searchFoods, getNutritionPer100g } from '../../lib/openFoodFacts';
import { OpenFoodFactsProduct } from '../../types';
import { searchFood, FoodItem } from '../../lib/foodDatabase';
import { lookupFoodWithAI } from '../../lib/ai';
import { colors, spacing, fontSize, borderRadius, shadows } from '../../components/ui/theme';
import { Button } from '../../components/ui/Button';
import { InactiveGate } from '../../components/ui/InactiveGate';

const WATER_INCREMENT = 0.5; // each tap = 0.5L

export default function MyPlanScreen() {
  const { profile } = useAuth();
  const [mealPlan, setMealPlan] = useState<MealPlan | null>(null);
  const [progress, setProgress] = useState<DailyProgress>({ mealsCompleted: [], waterGlasses: 0, extras: [] });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Add extra food modal
  const [showAddExtra, setShowAddExtra] = useState(false);
  const [extraForMeal, setExtraForMeal] = useState<string>('extra');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<OpenFoodFactsProduct[]>([]);
  const [searching, setSearching] = useState(false);

  // Manual entry modal
  const [showManual, setShowManual] = useState(false);
  const [manualName, setManualName] = useState('');
  const [manualCal, setManualCal] = useState('');
  const [manualProtein, setManualProtein] = useState('');
  const [manualCarbs, setManualCarbs] = useState('');
  const [manualFat, setManualFat] = useState('');
  const [manualGrams, setManualGrams] = useState('');
  const [foodResults, setFoodResults] = useState<FoodItem[]>([]);
  const [showFoodResults, setShowFoodResults] = useState(false);
  const [findLoading, setFindLoading] = useState(false);
  const [autoFilled, setAutoFilled] = useState(false);

  const findFood = async () => {
    if (!manualName.trim()) return;
    const localResults = searchFood(manualName.trim());
    if (localResults.length > 0) {
      setFoodResults(localResults);
      setShowFoodResults(true);
      return;
    }
    // AI fallback
    setFindLoading(true);
    setAutoFilled(false);
    try {
      const portion = manualGrams || 'standard serving';
      const result = await lookupFoodWithAI(manualName.trim(), portion);
      if (result) {
        setManualName(result.name);
        setManualCal(String(result.calories));
        setManualProtein(String(result.protein));
        setManualCarbs(String(result.carbs));
        setManualFat(String(result.fat));
        setManualGrams(result.servingSize.replace(/[^0-9.]/g, '') || '');
        setAutoFilled(true);
      }
    } catch { /* silent */ }
    finally { setFindLoading(false); }
  };

  const selectFoodResult = (food: FoodItem) => {
    setManualName(food.name);
    setManualCal(String(food.calories));
    setManualProtein(String(food.protein));
    setManualCarbs(String(food.carbs));
    setManualFat(String(food.fat));
    setManualGrams(food.servingSize);
    setShowFoodResults(false);
    setAutoFilled(false);
  };

  const dateStr = selectedDate.toISOString().split('T')[0];
  const isToday = dateStr === new Date().toISOString().split('T')[0];

  useEffect(() => { loadData(); }, [selectedDate, profile]);

  async function loadData() {
    if (!profile) return;
    try {
      const planDoc = await getDoc(doc(db, 'users', profile.uid, 'mealPlan', 'current'));
      if (planDoc.exists()) setMealPlan(planDoc.data() as MealPlan);

      const progressDoc = await getDoc(doc(db, 'users', profile.uid, 'dailyProgress', dateStr));
      if (progressDoc.exists()) {
        const data = progressDoc.data() as DailyProgress;
        setProgress({ ...data, extras: data.extras || [] });
      } else {
        setProgress({ mealsCompleted: [], waterGlasses: 0, extras: [] });
      }
    } catch (err) { /* silent */ }
    finally { setLoading(false); }
  }

  async function saveProgress(newProgress: DailyProgress) {
    setProgress(newProgress);
    if (profile) await setDoc(doc(db, 'users', profile.uid, 'dailyProgress', dateStr), newProgress);
  }

  const toggleMeal = async (index: number) => {
    if (!mealPlan || !profile) return;
    const newCompleted = [...(progress.mealsCompleted || [])];
    while (newCompleted.length < mealPlan.meals.length) newCompleted.push(false);
    const wasCompleted = newCompleted[index];
    newCompleted[index] = !wasCompleted;
    saveProgress({ ...progress, mealsCompleted: newCompleted });

    const meal = mealPlan.meals[index];

    // Auto-log or remove food entry when meal is ticked/unticked
    if (meal.estimatedCalories && meal.estimatedCalories > 0) {
      const logRef = collection(db, 'users', profile.uid, 'foodLog', dateStr, 'entries');

      if (!wasCompleted) {
        // Ticking ON - add food log entry
        await addDoc(logRef, {
          foodName: `${meal.label}: ${meal.items.join(', ')}`,
          brand: 'Meal Plan',
          calories: meal.estimatedCalories || 0,
          protein: meal.estimatedProtein || 0,
          carbs: meal.estimatedCarbs || 0,
          fat: meal.estimatedFat || 0,
          servingSize: 'As per plan',
          quantity: 1,
          timestamp: Date.now(),
          mealPlanLabel: meal.label, // tag so we can find it later
        }).catch(() => {});
      } else {
        // Ticking OFF - remove the auto-logged entry
        try {
          const snap = await getDocs(logRef);
          snap.forEach((d) => {
            if (d.data().mealPlanLabel === meal.label) {
              deleteDoc(d.ref).catch(() => {});
            }
          });
        } catch { /* silent */ }
      }
    }
  };

  const addWater = () => {
    const current = progress.waterGlasses || 0;
    if (current < 20) saveProgress({ ...progress, waterGlasses: current + 1 });
  };
  const removeWater = () => {
    if ((progress.waterGlasses || 0) > 0)
      saveProgress({ ...progress, waterGlasses: (progress.waterGlasses || 0) - 1 });
  };

  // Open "add extra" for a specific meal or as standalone
  const openAddExtra = (mealLabel: string) => {
    setExtraForMeal(mealLabel);
    setSearchQuery('');
    setSearchResults([]);
    setShowAddExtra(true);
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    setSearching(true);
    try {
      const results = await searchFoods(searchQuery);
      setSearchResults(results);
    } catch { /* silent */ }
    finally { setSearching(false); }
  };

  const addExtraFromSearch = (product: OpenFoodFactsProduct) => {
    const nutrition = getNutritionPer100g(product);
    const extra: ExtraFoodItem = {
      id: `extra-${Date.now()}`,
      name: product.product_name,
      calories: nutrition.calories,
      protein: nutrition.protein,
      carbs: nutrition.carbs,
      fat: nutrition.fat,
      servingSize: '100g',
      mealLabel: extraForMeal,
    };
    saveProgress({ ...progress, extras: [...(progress.extras || []), extra] });
    setShowAddExtra(false);
  };

  const openManualEntry = () => {
    setShowAddExtra(false);
    setManualName(searchQuery || '');
    setManualCal(''); setManualProtein(''); setManualCarbs(''); setManualFat('');
    setManualGrams('100');
    setShowManual(true);
  };

  const addManualExtra = () => {
    if (!manualName.trim()) { Alert.alert('Error', 'Enter a food name'); return; }
    const extra: ExtraFoodItem = {
      id: `extra-${Date.now()}`,
      name: manualName.trim(),
      calories: Math.round(parseFloat(manualCal) || 0),
      protein: Math.round((parseFloat(manualProtein) || 0) * 10) / 10,
      carbs: Math.round((parseFloat(manualCarbs) || 0) * 10) / 10,
      fat: Math.round((parseFloat(manualFat) || 0) * 10) / 10,
      servingSize: manualGrams?.trim() || '1 serving',
      mealLabel: extraForMeal,
    };
    saveProgress({ ...progress, extras: [...(progress.extras || []), extra] });
    setShowManual(false);
  };

  const removeExtra = (id: string) => {
    saveProgress({ ...progress, extras: (progress.extras || []).filter(e => e.id !== id) });
  };

  const onRefresh = async () => { setRefreshing(true); await loadData(); setRefreshing(false); };

  if (loading) return <View style={styles.centered}><Text style={styles.loadingText}>Loading your plan...</Text></View>;
  if (!mealPlan) return (
    <InactiveGate>
      <View style={styles.centered}>
        <Ionicons name="restaurant-outline" size={64} color={colors.textMuted} />
        <Text style={styles.emptyTitle}>No Meal Plan Yet</Text>
        <Text style={styles.emptySubtext}>Your coach will set your personalised plan soon</Text>
      </View>
    </InactiveGate>
  );

  const completedCount = (progress.mealsCompleted || []).filter(Boolean).length;
  const totalMeals = mealPlan.meals.length;
  const mealProgress = totalMeals > 0 ? completedCount / totalMeals : 0;
  const waterTargetL = mealPlan.waterTargetLitres || 3;
  const waterTaps = Math.round(waterTargetL / WATER_INCREMENT); // e.g. 6L = 12 taps
  const waterProgress = Math.min((progress.waterGlasses || 0) / waterTaps, 1);

  // Calculate extras totals
  const extras = progress.extras || [];
  const extrasTotals = extras.reduce((acc, e) => ({
    calories: acc.calories + e.calories,
    protein: acc.protein + e.protein,
    carbs: acc.carbs + e.carbs,
    fat: acc.fat + e.fat,
  }), { calories: 0, protein: 0, carbs: 0, fat: 0 });

  const getExtrasForMeal = (label: string) => extras.filter(e => e.mealLabel === label);
  const standaloneExtras = extras.filter(e => e.mealLabel === 'extra');

  return (
    <InactiveGate>
    <ScrollView style={styles.container} contentContainerStyle={styles.content}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />}>

      {/* Date Navigation */}
      <View style={styles.dateNav}>
        <TouchableOpacity onPress={() => setSelectedDate(new Date(selectedDate.getTime() - 86400000))} style={styles.dateArrow} accessibilityLabel="Previous day">
          <Ionicons name="chevron-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setSelectedDate(new Date())} style={styles.dateCenter}>
          <Text style={styles.dateText}>
            {isToday ? 'Today' : selectedDate.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })}
          </Text>
          {!isToday && <Text style={styles.dateTapBack}>Tap to go to today</Text>}
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            const tomorrow = new Date(selectedDate.getTime() + 86400000);
            if (tomorrow <= new Date()) setSelectedDate(tomorrow);
          }}
          style={styles.dateArrow}
          disabled={isToday}
          accessibilityLabel="Next day"
        >
          <Ionicons name="chevron-forward" size={24} color={isToday ? colors.textMuted : colors.text} />
        </TouchableOpacity>
      </View>

      {/* Progress Header */}
      <View style={[styles.progressCard, shadows.sm]}>
        <Text style={styles.progressTitle}>Today's Progress</Text>
        <View style={styles.progressRow}>
          <View style={styles.progressItem}>
            <Text style={styles.progressLabel}>Meals</Text>
            <Text style={[styles.progressValue, { color: colors.primary }]}>{completedCount}/{totalMeals}</Text>
            <View style={styles.progressBarBg}>
              <LinearGradient colors={[colors.primary, colors.primary + 'CC']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                style={[styles.progressBarFill, { width: `${mealProgress * 100}%` }]} />
            </View>
          </View>
          <View style={styles.progressDivider} />
          <View style={styles.progressItem}>
            <Text style={styles.progressLabel}>Water</Text>
            <Text style={[styles.progressValue, { color: colors.success }]}>
              {((progress.waterGlasses || 0) * WATER_INCREMENT).toFixed(1)}L / {waterTargetL}L
            </Text>
            <View style={styles.progressBarBg}>
              <View style={[styles.progressBarFillSolid, { backgroundColor: colors.success, width: `${waterProgress * 100}%` }]} />
            </View>
          </View>
        </View>
        {/* Extras calorie summary */}
        {extrasTotals.calories > 0 && (
          <View style={styles.extrasSummary}>
            <Ionicons name="add-circle" size={14} color={colors.accent} />
            <Text style={styles.extrasSummaryText}>
              Off-plan extras: {extrasTotals.calories} kcal | P: {extrasTotals.protein.toFixed(0)}g | C: {extrasTotals.carbs.toFixed(0)}g | F: {extrasTotals.fat.toFixed(0)}g
            </Text>
          </View>
        )}
      </View>

      {/* Free Calories */}
      {mealPlan.freeCalories > 0 && (
        <View style={styles.freeCalBadge}>
          <Ionicons name="star" size={16} color={colors.warning} />
          <Text style={styles.freeCalText}>
            {mealPlan.freeCalories - extrasTotals.calories > 0
              ? `${mealPlan.freeCalories - extrasTotals.calories} free calories remaining`
              : `${extrasTotals.calories - mealPlan.freeCalories} calories over free allowance`}
          </Text>
        </View>
      )}

      {/* Water Tracker */}
      <View style={[styles.waterCard, shadows.sm]}>
        <View style={styles.waterHeader}>
          <Ionicons name="water" size={22} color={colors.success} />
          <Text style={styles.waterTitle}>Water Intake</Text>
        </View>
        <View style={styles.waterRow}>
          <TouchableOpacity style={styles.waterBtn} onPress={removeWater} accessibilityLabel="Remove water">
            <Ionicons name="remove-circle" size={32} color={colors.textMuted} />
          </TouchableOpacity>
          <View style={styles.waterDisplay}>
            <Text style={styles.waterAmount}>{((progress.waterGlasses || 0) * WATER_INCREMENT).toFixed(1)}L</Text>
            <Text style={styles.waterTarget}>of {waterTargetL}L</Text>
          </View>
          <TouchableOpacity style={styles.waterBtn} onPress={addWater} accessibilityLabel="Add water">
            <Ionicons name="add-circle" size={32} color={colors.success} />
          </TouchableOpacity>
        </View>
        <View style={styles.waterBarBg}>
          <View style={[styles.waterBarFill, { width: `${waterProgress * 100}%` }]} />
        </View>
      </View>

      {/* Meal Cards with Extras */}
      {mealPlan.meals.map((meal, index) => {
        const completed = progress.mealsCompleted?.[index] || false;
        const mealExtras = getExtrasForMeal(meal.label);
        return (
          <View key={index}>
            <TouchableOpacity
              style={[styles.mealCard, shadows.sm, completed && styles.mealCardCompleted]}
              onPress={() => toggleMeal(index)} activeOpacity={0.7}>
              <View style={styles.mealHeader}>
                <View style={[styles.mealBadge, completed && styles.mealBadgeCompleted]}>
                  <Text style={[styles.mealBadgeText, completed && styles.mealBadgeTextCompleted]}>{meal.label}</Text>
                </View>
                <View style={[styles.checkbox, completed && styles.checkboxCompleted]}>
                  {completed && <Ionicons name="checkmark" size={18} color="#fff" />}
                </View>
              </View>
              <View style={styles.mealItems}>
                {meal.items.map((item, i) => (
                  <View key={i} style={styles.mealItemRow}>
                    <Text style={styles.mealItemBullet}>-</Text>
                    <Text style={[styles.mealItemText, completed && styles.mealItemCompleted]}>{item}</Text>
                  </View>
                ))}
              </View>
              {meal.note ? <Text style={styles.mealNote}>{meal.note}</Text> : null}
              {meal.estimatedCalories ? (
                <View style={styles.mealMacros}>
                  <Text style={[styles.mealMacroText, { color: colors.accent }]}>{meal.estimatedCalories} kcal</Text>
                  {meal.estimatedProtein ? <Text style={[styles.mealMacroText, { color: colors.primary }]}>P: {meal.estimatedProtein}g</Text> : null}
                  {meal.estimatedCarbs ? <Text style={[styles.mealMacroText, { color: colors.warning }]}>C: {meal.estimatedCarbs}g</Text> : null}
                  {meal.estimatedFat ? <Text style={[styles.mealMacroText, { color: colors.success }]}>F: {meal.estimatedFat}g</Text> : null}
                </View>
              ) : null}

              {/* Extras added to this meal */}
              {mealExtras.length > 0 && (
                <View style={styles.mealExtrasSection}>
                  {mealExtras.map((extra) => (
                    <View key={extra.id} style={styles.extraItemRow}>
                      <Ionicons name="add-circle" size={14} color={colors.accent} />
                      <Text style={styles.extraItemText}>{extra.name} ({extra.servingSize})</Text>
                      <Text style={styles.extraItemCal}>{extra.calories} kcal</Text>
                      <TouchableOpacity onPress={() => removeExtra(extra.id)} accessibilityLabel={`Remove ${extra.name}`}>
                        <Ionicons name="close-circle" size={18} color={colors.error + '80'} />
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              )}
            </TouchableOpacity>

            {/* Add extra to this meal */}
            <TouchableOpacity style={styles.addExtraButton} onPress={() => openAddExtra(meal.label)}>
              <Ionicons name="add" size={16} color={colors.accent} />
              <Text style={styles.addExtraText}>Had something extra with {meal.label}?</Text>
            </TouchableOpacity>
          </View>
        );
      })}

      {/* Optional Snack */}
      {mealPlan.optionalSnack && (
        <View style={[styles.snackCard, shadows.sm]}>
          <View style={styles.snackHeader}>
            <Ionicons name="moon" size={18} color={colors.accent} />
            <Text style={styles.snackTitle}>Optional Evening Snack</Text>
          </View>
          <Text style={styles.snackText}>{mealPlan.optionalSnack}</Text>
        </View>
      )}

      {/* Standalone Off-Plan Extras */}
      <TouchableOpacity style={[styles.addStandaloneButton, shadows.sm]} onPress={() => openAddExtra('extra')}>
        <Ionicons name="fast-food" size={22} color={colors.accent} />
        <View style={{ flex: 1, marginLeft: spacing.md }}>
          <Text style={styles.addStandaloneTitle}>Had something off-plan?</Text>
          <Text style={styles.addStandaloneSubtext}>Log it here so your coach can see</Text>
        </View>
        <Ionicons name="add-circle" size={24} color={colors.accent} />
      </TouchableOpacity>

      {standaloneExtras.length > 0 && (
        <View style={[styles.extrasCard, shadows.sm]}>
          <Text style={styles.extrasTitle}>Off-Plan Extras</Text>
          {standaloneExtras.map((extra) => (
            <View key={extra.id} style={styles.extraLogRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.extraLogName}>{extra.name}</Text>
                <Text style={styles.extraLogMacros}>
                  {extra.calories} kcal | P: {extra.protein}g | C: {extra.carbs}g | F: {extra.fat}g
                </Text>
              </View>
              <TouchableOpacity onPress={() => removeExtra(extra.id)} accessibilityLabel={`Remove ${extra.name}`}>
                <Ionicons name="trash-outline" size={18} color={colors.error} />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}

      {/* Notes & Supplements */}
      {mealPlan.notes.length > 0 && (
        <View style={[styles.notesCard, shadows.sm]}>
          <View style={styles.notesHeader}><Ionicons name="information-circle" size={20} color={colors.warning} /><Text style={styles.notesTitle}>Notes</Text></View>
          {mealPlan.notes.map((note, i) => <View key={i} style={styles.noteRow}><Text style={styles.noteBullet}>*</Text><Text style={styles.noteText}>{note}</Text></View>)}
        </View>
      )}
      {mealPlan.supplements.length > 0 && (
        <View style={[styles.supplementsCard, shadows.sm]}>
          <View style={styles.notesHeader}><Ionicons name="medkit" size={20} color={colors.success} /><Text style={styles.notesTitle}>Daily Supplements</Text></View>
          {mealPlan.supplements.map((sup, i) => <View key={i} style={styles.noteRow}><Ionicons name="checkmark-circle" size={16} color={colors.success} /><Text style={styles.noteText}>{sup}</Text></View>)}
        </View>
      )}

      {/* Check-in */}
      <TouchableOpacity style={[styles.checkInButton, shadows.md]} onPress={() => router.push('/checkin')} activeOpacity={0.8}>
        <LinearGradient colors={[colors.primary, colors.primaryDark]} style={styles.checkInGradient}>
          <Ionicons name="clipboard" size={22} color="#fff" /><Text style={styles.checkInText}>Weekly Check-In</Text>
        </LinearGradient>
      </TouchableOpacity>

      {/* ===== SEARCH EXTRA FOOD MODAL ===== */}
      <Modal visible={showAddExtra} transparent animationType="slide" onRequestClose={() => setShowAddExtra(false)}>
        <KeyboardAvoidingView style={styles.modalOverlay} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {extraForMeal === 'extra' ? 'Add Off-Plan Food' : `Add Extra to ${extraForMeal}`}
              </Text>
              <TouchableOpacity onPress={() => setShowAddExtra(false)} accessibilityLabel="Close search">
                <Ionicons name="close" size={24} color={colors.textMuted} />
              </TouchableOpacity>
            </View>

            <View style={styles.searchRow}>
              <TextInput style={styles.searchInput} value={searchQuery} onChangeText={setSearchQuery}
                placeholder="Search for food..." placeholderTextColor={colors.textMuted}
                onSubmitEditing={handleSearch} returnKeyType="search" autoFocus />
            </View>
            <View style={{ flexDirection: 'row', gap: spacing.sm }}>
              <Button title="Search" onPress={handleSearch} loading={searching} style={{ flex: 1 }} />
              <TouchableOpacity style={styles.manualBtn} onPress={openManualEntry}>
                <Ionicons name="create-outline" size={16} color={colors.success} />
                <Text style={styles.manualBtnText}>Manual</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.searchResults}>
              {searchResults.map((item) => {
                const n = getNutritionPer100g(item);
                return (
                  <TouchableOpacity key={item.code} style={styles.searchResultItem} onPress={() => addExtraFromSearch(item)}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.searchResultName} numberOfLines={1}>{item.product_name}</Text>
                      <Text style={styles.searchResultMacros}>{n.calories} kcal | P: {n.protein}g | C: {n.carbs}g | F: {n.fat}g</Text>
                    </View>
                    <Ionicons name="add-circle-outline" size={24} color={colors.success} />
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* ===== ADD EXTRA MODAL ===== */}
      <Modal visible={showManual} transparent animationType="fade" onRequestClose={() => { setShowManual(false); setShowFoodResults(false); }}>
        <KeyboardAvoidingView style={styles.modalOverlay} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add Extra</Text>

            {/* Food name + Find button */}
            <Text style={styles.manualLabel}>What did you have?</Text>
            <View style={{ flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.xs }}>
              <TextInput style={[styles.manualInput, { flex: 1, marginBottom: 0 }]} value={manualName}
                onChangeText={(v) => { setManualName(v); setAutoFilled(false); setShowFoodResults(false); }}
                placeholder="e.g. Costa latte, protein bar" placeholderTextColor={colors.textMuted} />
              <TouchableOpacity
                style={{ backgroundColor: colors.accent, borderRadius: borderRadius.sm, paddingHorizontal: spacing.md, justifyContent: 'center', opacity: findLoading || !manualName.trim() ? 0.5 : 1 }}
                onPress={findFood}
                disabled={findLoading || !manualName.trim()}
              >
                <Text style={{ color: '#fff', fontWeight: '700', fontSize: fontSize.sm }}>{findLoading ? '...' : 'Find'}</Text>
              </TouchableOpacity>
            </View>
            {autoFilled && <Text style={{ color: colors.accent, fontSize: fontSize.xs, marginBottom: spacing.sm }}>Nutrition auto-filled — check values look right</Text>}

            {/* Food search results */}
            {showFoodResults && foodResults.length > 0 && (
              <View style={{ maxHeight: 200, borderRadius: borderRadius.sm, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface, marginBottom: spacing.sm }}>
                <ScrollView nestedScrollEnabled>
                  {foodResults.map((food, i) => (
                    <TouchableOpacity
                      key={i}
                      style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: spacing.sm, borderBottomWidth: i < foodResults.length - 1 ? 1 : 0, borderBottomColor: colors.border }}
                      onPress={() => selectFoodResult(food)}
                    >
                      <View style={{ flex: 1 }}>
                        <Text style={{ color: colors.text, fontSize: fontSize.sm, fontWeight: '600' }}>{food.name}</Text>
                        <Text style={{ color: colors.textMuted, fontSize: fontSize.xs }}>{food.brand ? `${food.brand} · ` : ''}{food.servingSize}</Text>
                      </View>
                      <View style={{ alignItems: 'flex-end' }}>
                        <Text style={{ color: colors.accent, fontSize: fontSize.xs, fontWeight: '700' }}>{food.calories}kcal</Text>
                        <Text style={{ color: colors.textMuted, fontSize: fontSize.xs }}>P:{food.protein}g</Text>
                      </View>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            )}

            {/* Portion size */}
            <Text style={styles.manualLabel}>Portion Size</Text>
            <View style={{ flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.sm }}>
              {['Small', 'Medium', 'Large'].map((size) => (
                <TouchableOpacity
                  key={size}
                  style={{ flex: 1, paddingVertical: spacing.sm, borderRadius: borderRadius.sm, backgroundColor: manualGrams === size.toLowerCase() ? colors.primary : colors.surfaceLight, alignItems: 'center' }}
                  onPress={() => setManualGrams(size.toLowerCase())}
                >
                  <Text style={{ color: manualGrams === size.toLowerCase() ? '#fff' : colors.textMuted, fontSize: fontSize.sm, fontWeight: '700' }}>{size}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <TextInput style={styles.manualNumInput} value={manualGrams} onChangeText={setManualGrams}
              placeholder="Or enter g/ml" placeholderTextColor={colors.textMuted} />
            <Text style={{ color: colors.textMuted, fontSize: fontSize.xs, marginBottom: spacing.md }}>Don't know the weight? Pick a size or leave blank.</Text>

            {/* Macros */}
            <View style={styles.manualGrid}>
              <View style={styles.manualGridItem}><Text style={styles.manualLabel}>Calories</Text>
                <TextInput style={styles.manualNumInput} value={manualCal} onChangeText={setManualCal} keyboardType="numeric" placeholder="0" placeholderTextColor={colors.textMuted} /></View>
              <View style={styles.manualGridItem}><Text style={styles.manualLabel}>Protein (g)</Text>
                <TextInput style={styles.manualNumInput} value={manualProtein} onChangeText={setManualProtein} keyboardType="numeric" placeholder="0" placeholderTextColor={colors.textMuted} /></View>
              <View style={styles.manualGridItem}><Text style={styles.manualLabel}>Carbs (g)</Text>
                <TextInput style={styles.manualNumInput} value={manualCarbs} onChangeText={setManualCarbs} keyboardType="numeric" placeholder="0" placeholderTextColor={colors.textMuted} /></View>
              <View style={styles.manualGridItem}><Text style={styles.manualLabel}>Fat (g)</Text>
                <TextInput style={styles.manualNumInput} value={manualFat} onChangeText={setManualFat} keyboardType="numeric" placeholder="0" placeholderTextColor={colors.textMuted} /></View>
            </View>
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => { setShowManual(false); setShowFoodResults(false); }}><Text style={styles.cancelBtnText}>Cancel</Text></TouchableOpacity>
              <TouchableOpacity style={styles.confirmBtn} onPress={addManualExtra}><Text style={styles.confirmBtnText}>Add</Text></TouchableOpacity>
            </View>
          </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </Modal>
    </ScrollView>
    </InactiveGate>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.md, paddingBottom: spacing.xxl },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background, padding: spacing.xxl },
  loadingText: { color: colors.textMuted, fontSize: fontSize.md, marginTop: spacing.md },
  emptyTitle: { color: colors.text, fontSize: fontSize.xl, fontWeight: '700', marginTop: spacing.lg },
  emptySubtext: { color: colors.textMuted, fontSize: fontSize.sm, marginTop: spacing.sm, textAlign: 'center' },

  // Date navigation
  dateNav: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing.md, backgroundColor: colors.surface, borderRadius: borderRadius.lg, padding: spacing.sm },
  dateArrow: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center' },
  dateCenter: { alignItems: 'center', flex: 1 },
  dateText: { color: colors.text, fontSize: fontSize.md, fontWeight: '700' },
  dateTapBack: { color: colors.primary, fontSize: fontSize.xs, marginTop: 2 },

  progressCard: { backgroundColor: colors.surface, borderRadius: borderRadius.lg, padding: spacing.lg, marginBottom: spacing.md },
  progressTitle: { color: colors.text, fontSize: fontSize.lg, fontWeight: '700', marginBottom: spacing.md },
  progressRow: { flexDirection: 'row', gap: spacing.md },
  progressItem: { flex: 1 },
  progressLabel: { color: colors.textMuted, fontSize: fontSize.xs, marginBottom: 2 },
  progressValue: { fontSize: fontSize.md, fontWeight: '800', marginBottom: spacing.xs },
  progressBarBg: { height: 6, backgroundColor: colors.surfaceLight, borderRadius: 3, overflow: 'hidden' },
  progressBarFill: { height: '100%', borderRadius: 3 },
  progressBarFillSolid: { height: '100%', borderRadius: 3 },
  progressDivider: { width: 1, backgroundColor: colors.border },
  extrasSummary: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs, marginTop: spacing.md, paddingTop: spacing.sm, borderTopWidth: 1, borderTopColor: colors.border },
  extrasSummaryText: { color: colors.accent, fontSize: fontSize.xs, fontWeight: '600' },

  freeCalBadge: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: colors.warning + '15', padding: spacing.sm, borderRadius: borderRadius.full, marginBottom: spacing.md, gap: spacing.xs },
  freeCalText: { color: colors.warning, fontSize: fontSize.sm, fontWeight: '700' },

  waterCard: { backgroundColor: colors.surface, borderRadius: borderRadius.lg, padding: spacing.lg, marginBottom: spacing.md },
  waterHeader: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.md },
  waterTitle: { color: colors.text, fontSize: fontSize.md, fontWeight: '700' },
  waterRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.lg, marginBottom: spacing.md },
  waterBtn: { padding: spacing.xs },
  waterDisplay: { alignItems: 'center' },
  waterAmount: { color: colors.success, fontSize: fontSize.xxl, fontWeight: '800' },
  waterTarget: { color: colors.textMuted, fontSize: fontSize.xs },
  waterBarBg: { height: 8, backgroundColor: colors.surfaceLight, borderRadius: 4, overflow: 'hidden' },
  waterBarFill: { height: '100%', backgroundColor: colors.success, borderRadius: 4 },

  mealCard: { backgroundColor: colors.surface, borderRadius: borderRadius.lg, padding: spacing.md, marginBottom: 0, borderLeftWidth: 3, borderLeftColor: colors.primary },
  mealCardCompleted: { borderLeftColor: colors.success, opacity: 0.8 },
  mealHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.sm },
  mealBadge: { backgroundColor: colors.primary + '20', paddingHorizontal: spacing.md, paddingVertical: spacing.xs, borderRadius: borderRadius.full },
  mealBadgeCompleted: { backgroundColor: colors.success + '20' },
  mealBadgeText: { color: colors.primary, fontSize: fontSize.sm, fontWeight: '800' },
  mealBadgeTextCompleted: { color: colors.success },
  checkbox: { width: 28, height: 28, borderRadius: 14, borderWidth: 2, borderColor: colors.border, justifyContent: 'center', alignItems: 'center' },
  checkboxCompleted: { backgroundColor: colors.success, borderColor: colors.success },
  mealItems: { gap: 4 },
  mealItemRow: { flexDirection: 'row', paddingLeft: spacing.xs },
  mealItemBullet: { color: colors.textMuted, fontSize: fontSize.sm, marginRight: spacing.sm, width: 12 },
  mealItemText: { color: colors.text, fontSize: fontSize.sm, flex: 1 },
  mealItemCompleted: { textDecorationLine: 'line-through', color: colors.textMuted },
  mealNote: { color: colors.accent, fontSize: fontSize.xs, fontStyle: 'italic', marginTop: spacing.xs, paddingLeft: spacing.xs },
  mealMacros: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.sm, paddingTop: spacing.sm, borderTopWidth: 1, borderTopColor: colors.border },
  mealMacroText: { fontSize: fontSize.xs, fontWeight: '700' },

  mealExtrasSection: { marginTop: spacing.sm, paddingTop: spacing.sm, borderTopWidth: 1, borderTopColor: colors.border },
  extraItemRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs, marginBottom: 4 },
  extraItemText: { color: colors.accent, fontSize: fontSize.xs, flex: 1 },
  extraItemCal: { color: colors.textMuted, fontSize: fontSize.xs },

  addExtraButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.xs, paddingVertical: spacing.sm, marginBottom: spacing.md },
  addExtraText: { color: colors.accent, fontSize: fontSize.xs, fontWeight: '600' },

  addStandaloneButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface, borderRadius: borderRadius.lg, padding: spacing.md, marginBottom: spacing.sm, borderWidth: 1, borderColor: colors.accent + '30', borderStyle: 'dashed' },
  addStandaloneTitle: { color: colors.text, fontSize: fontSize.sm, fontWeight: '700' },
  addStandaloneSubtext: { color: colors.textMuted, fontSize: fontSize.xs, marginTop: 2 },

  extrasCard: { backgroundColor: colors.surface, borderRadius: borderRadius.lg, padding: spacing.md, marginBottom: spacing.md, borderLeftWidth: 3, borderLeftColor: colors.accent },
  extrasTitle: { color: colors.accent, fontSize: fontSize.sm, fontWeight: '700', marginBottom: spacing.sm },
  extraLogRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: spacing.xs, borderBottomWidth: 1, borderBottomColor: colors.border },
  extraLogName: { color: colors.text, fontSize: fontSize.sm, fontWeight: '600' },
  extraLogMacros: { color: colors.textMuted, fontSize: fontSize.xs, marginTop: 2 },

  snackCard: { backgroundColor: colors.surface, borderRadius: borderRadius.lg, padding: spacing.md, marginBottom: spacing.md, borderLeftWidth: 3, borderLeftColor: colors.accent },
  snackHeader: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.xs },
  snackTitle: { color: colors.accent, fontSize: fontSize.sm, fontWeight: '700' },
  snackText: { color: colors.textSecondary, fontSize: fontSize.sm, paddingLeft: spacing.xs },

  notesCard: { backgroundColor: colors.surface, borderRadius: borderRadius.lg, padding: spacing.md, marginBottom: spacing.md },
  supplementsCard: { backgroundColor: colors.surface, borderRadius: borderRadius.lg, padding: spacing.md, marginBottom: spacing.md },
  notesHeader: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.md },
  notesTitle: { color: colors.text, fontSize: fontSize.md, fontWeight: '700' },
  noteRow: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.xs, paddingLeft: spacing.xs },
  noteBullet: { color: colors.warning, fontSize: fontSize.sm, fontWeight: '700' },
  noteText: { color: colors.textSecondary, fontSize: fontSize.sm, flex: 1 },

  checkInButton: { borderRadius: borderRadius.md, overflow: 'hidden', marginTop: spacing.md },
  checkInGradient: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: spacing.md, gap: spacing.sm },
  checkInText: { color: '#fff', fontSize: fontSize.md, fontWeight: '700' },

  // Modals
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: colors.surface, borderTopLeftRadius: borderRadius.xl, borderTopRightRadius: borderRadius.xl, padding: spacing.lg, maxHeight: '80%' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.md },
  modalTitle: { color: colors.text, fontSize: fontSize.lg, fontWeight: '700' },
  modalSubtext: { color: colors.textMuted, fontSize: fontSize.xs, marginBottom: spacing.md },
  searchRow: { marginBottom: spacing.sm },
  searchInput: { backgroundColor: colors.inputBackground, borderRadius: borderRadius.md, padding: spacing.md, color: colors.text, fontSize: fontSize.md, borderWidth: 1, borderColor: colors.border },
  manualBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.xs, backgroundColor: colors.surface, paddingHorizontal: spacing.md, borderRadius: borderRadius.md, borderWidth: 1, borderColor: colors.success + '40' },
  manualBtnText: { color: colors.success, fontSize: fontSize.sm, fontWeight: '600' },
  searchResults: { maxHeight: 300, marginTop: spacing.md },
  searchResultItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.background, padding: spacing.md, borderRadius: borderRadius.sm, marginBottom: spacing.xs },
  searchResultName: { color: colors.text, fontSize: fontSize.sm, fontWeight: '600' },
  searchResultMacros: { color: colors.textMuted, fontSize: fontSize.xs, marginTop: 2 },

  manualInput: { backgroundColor: colors.inputBackground, borderRadius: borderRadius.md, padding: spacing.md, color: colors.text, fontSize: fontSize.md, borderWidth: 1, borderColor: colors.border, marginBottom: spacing.md },
  manualGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginBottom: spacing.md },
  manualGridItem: { width: '47%' },
  manualLabel: { color: colors.textSecondary, fontSize: fontSize.xs, fontWeight: '600', marginBottom: spacing.xs },
  manualNumInput: { backgroundColor: colors.inputBackground, borderRadius: borderRadius.sm, padding: spacing.sm, color: colors.text, fontSize: fontSize.md, fontWeight: '700', textAlign: 'center', borderWidth: 1, borderColor: colors.border, marginBottom: spacing.sm },
  modalButtons: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.md },
  cancelBtn: { flex: 1, paddingVertical: spacing.md, borderRadius: borderRadius.md, borderWidth: 1, borderColor: colors.border, alignItems: 'center' },
  cancelBtnText: { color: colors.textSecondary, fontSize: fontSize.md, fontWeight: '600' },
  confirmBtn: { flex: 2, paddingVertical: spacing.md, borderRadius: borderRadius.md, backgroundColor: colors.primary, alignItems: 'center' },
  confirmBtnText: { color: '#fff', fontSize: fontSize.md, fontWeight: '700' },
});
