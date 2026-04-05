import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, Alert, ScrollView, Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Stack } from 'expo-router';
import { collection, query, where, getDocs, doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { UserProfile, MealPlan, MealItem } from '../../types';
import { Button } from '../../components/ui/Button';
import { colors, spacing, fontSize, borderRadius, shadows } from '../../components/ui/theme';

export default function MealPlansScreen() {
  const [clients, setClients] = useState<UserProfile[]>([]);
  const [selectedClient, setSelectedClient] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Meal plan editor state
  const [freeCalories, setFreeCalories] = useState('200');
  const [meals, setMeals] = useState<MealItem[]>([
    { label: 'M1', items: [''], note: '' },
    { label: 'M2', items: [''], note: '' },
    { label: 'M3', items: [''], note: '' },
    { label: 'M4', items: [''], note: '' },
    { label: 'M5', items: [''], note: '' },
    { label: 'M6', items: [''], note: '' },
  ]);
  const [optionalSnack, setOptionalSnack] = useState('');
  const [notesText, setNotesText] = useState('');
  const [waterTarget, setWaterTarget] = useState('3');
  const [supplementsText, setSupplementsText] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadClients();
  }, []);

  async function loadClients() {
    try {
      const snap = await getDocs(
        query(collection(db, 'users'), where('role', '==', 'client'))
      );
      const list: UserProfile[] = [];
      snap.forEach((d) => list.push(d.data() as UserProfile));
      list.sort((a, b) => a.name.localeCompare(b.name));
      setClients(list);
    } catch (err) {
      Alert.alert('Error', 'Failed to load clients');
    } finally {
      setLoading(false);
    }
  }

  const selectClient = async (client: UserProfile) => {
    setSelectedClient(client);
    // Load existing meal plan if any
    try {
      const planDoc = await getDoc(doc(db, 'users', client.uid, 'mealPlan', 'current'));
      if (planDoc.exists()) {
        const plan = planDoc.data() as MealPlan;
        setFreeCalories(String(plan.freeCalories || 200));
        setWaterTarget(String(plan.waterTargetLitres || 3));
        setMeals(plan.meals.length > 0 ? plan.meals : getDefaultMeals());
        setOptionalSnack(plan.optionalSnack || '');
        setNotesText(plan.notes.join('\n'));
        setSupplementsText(plan.supplements.join('\n'));
      } else {
        // Reset to defaults
        setFreeCalories('200');
        setWaterTarget('3');
        setMeals(getDefaultMeals());
        setOptionalSnack('');
        setNotesText('drink at least 3 litres of water a day\nall food is uncooked weight (except rice, that\'s cooked)\nhave an off plan meal every Saturday night\nadd salad and greens to any meal\nlow calorie sauces ok');
        setSupplementsText('good multi vitamin tab\n1000mg vitC\nomega 3,6,9 tab\ncod liver oil tab');
      }
    } catch {
      // use defaults
    }
  };

  const getDefaultMeals = (): MealItem[] => [
    { label: 'M1', items: [''], note: '' },
    { label: 'M2', items: [''], note: '' },
    { label: 'M3', items: [''], note: '' },
    { label: 'M4', items: [''], note: '' },
    { label: 'M5', items: [''], note: '' },
    { label: 'M6', items: [''], note: '' },
  ];

  const updateMealItem = (mealIndex: number, itemIndex: number, value: string) => {
    const newMeals = [...meals];
    newMeals[mealIndex] = { ...newMeals[mealIndex], items: [...newMeals[mealIndex].items] };
    newMeals[mealIndex].items[itemIndex] = value;
    setMeals(newMeals);
  };

  const addMealItem = (mealIndex: number) => {
    const newMeals = [...meals];
    newMeals[mealIndex] = { ...newMeals[mealIndex], items: [...newMeals[mealIndex].items, ''] };
    setMeals(newMeals);
  };

  const removeMealItem = (mealIndex: number, itemIndex: number) => {
    const newMeals = [...meals];
    newMeals[mealIndex] = {
      ...newMeals[mealIndex],
      items: newMeals[mealIndex].items.filter((_, i) => i !== itemIndex),
    };
    if (newMeals[mealIndex].items.length === 0) {
      newMeals[mealIndex].items = [''];
    }
    setMeals(newMeals);
  };

  const updateMealNote = (mealIndex: number, note: string) => {
    const newMeals = [...meals];
    newMeals[mealIndex] = { ...newMeals[mealIndex], note };
    setMeals(newMeals);
  };

  const updateMealMacro = (mealIndex: number, field: string, value: string) => {
    const newMeals = [...meals];
    newMeals[mealIndex] = { ...newMeals[mealIndex], [field]: parseInt(value) || 0 };
    setMeals(newMeals);
  };

  const saveMealPlan = async () => {
    if (!selectedClient) return;
    setSaving(true);

    try {
      const plan: MealPlan = {
        freeCalories: parseInt(freeCalories) || 0,
        waterTargetLitres: parseFloat(waterTarget) || 3,
        meals: meals.map(m => ({
          ...m,
          items: m.items.filter(i => i.trim() !== ''),
        })).filter(m => m.items.length > 0),
        optionalSnack: optionalSnack.trim(),
        notes: notesText.split('\n').filter(n => n.trim()),
        supplements: supplementsText.split('\n').filter(s => s.trim()),
        updatedAt: Date.now(),
      };

      await setDoc(doc(db, 'users', selectedClient.uid, 'mealPlan', 'current'), plan);
      Alert.alert('Saved!', `Meal plan updated for ${selectedClient.name}`);
    } catch (err) {
      Alert.alert('Error', 'Failed to save meal plan');
    } finally {
      setSaving(false);
    }
  };

  // Client list view
  if (!selectedClient) {
    return (
      <>
        <Stack.Screen options={{ title: 'Set Meal Plans' }} />
        <FlatList
          style={styles.container}
          data={clients}
          keyExtractor={(item) => item.uid}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[styles.clientCard, shadows.sm]}
              onPress={() => selectClient(item)}
              activeOpacity={0.7}
            >
              <View style={styles.clientAvatar}>
                <Text style={styles.avatarText}>{item.name.charAt(0)}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.clientName}>{item.name}</Text>
                <Text style={styles.clientEmail}>{item.email}</Text>
              </View>
              <Ionicons name="create-outline" size={22} color={colors.primary} />
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Text style={styles.emptyText}>{loading ? 'Loading...' : 'No clients'}</Text>
            </View>
          }
        />
      </>
    );
  }

  // Meal plan editor view
  return (
    <>
      <Stack.Screen options={{ title: `Plan: ${selectedClient.name}` }} />
      <ScrollView style={styles.container} contentContainerStyle={styles.editorContent}>
        <TouchableOpacity style={styles.backButton} onPress={() => setSelectedClient(null)}>
          <Ionicons name="arrow-back" size={20} color={colors.primary} />
          <Text style={styles.backText}>Back to clients</Text>
        </TouchableOpacity>

        {/* Free Calories */}
        <View style={styles.fieldRow}>
          <Text style={styles.fieldLabel}>Free Calories Daily</Text>
          <TextInput
            style={styles.smallInput}
            value={freeCalories}
            onChangeText={setFreeCalories}
            keyboardType="numeric"
            placeholder="200"
            placeholderTextColor={colors.textMuted}
          />
        </View>

        {/* Water Target */}
        <View style={styles.fieldRow}>
          <Text style={styles.fieldLabel}>Daily Water Target (litres)</Text>
          <TextInput
            style={styles.smallInput}
            value={waterTarget}
            onChangeText={setWaterTarget}
            keyboardType="numeric"
            placeholder="3"
            placeholderTextColor={colors.textMuted}
          />
        </View>

        {/* Meals */}
        {meals.map((meal, mealIndex) => (
          <View key={mealIndex} style={styles.mealEditor}>
            <Text style={styles.mealLabel}>{meal.label}</Text>
            {meal.items.map((item, itemIndex) => (
              <View key={itemIndex} style={styles.itemRow}>
                <TextInput
                  style={styles.itemInput}
                  value={item}
                  onChangeText={(v) => updateMealItem(mealIndex, itemIndex, v)}
                  placeholder={`Food item ${itemIndex + 1}`}
                  placeholderTextColor={colors.textMuted}
                />
                {meal.items.length > 1 && (
                  <TouchableOpacity onPress={() => removeMealItem(mealIndex, itemIndex)}>
                    <Ionicons name="close-circle" size={22} color={colors.error} />
                  </TouchableOpacity>
                )}
              </View>
            ))}
            <TouchableOpacity style={styles.addItemButton} onPress={() => addMealItem(mealIndex)}>
              <Ionicons name="add" size={16} color={colors.success} />
              <Text style={styles.addItemText}>Add item</Text>
            </TouchableOpacity>
            <TextInput
              style={styles.noteInput}
              value={meal.note || ''}
              onChangeText={(v) => updateMealNote(mealIndex, v)}
              placeholder="Note (optional)"
              placeholderTextColor={colors.textMuted}
            />
            {/* Estimated macros for this meal */}
            <View style={styles.mealMacroRow}>
              <View style={styles.mealMacroItem}>
                <Text style={[styles.mealMacroLabel, { color: colors.accent }]}>kcal</Text>
                <TextInput style={styles.mealMacroInput} value={String(meal.estimatedCalories || '')}
                  onChangeText={(v) => updateMealMacro(mealIndex, 'estimatedCalories', v)}
                  keyboardType="numeric" placeholder="0" placeholderTextColor={colors.textMuted} />
              </View>
              <View style={styles.mealMacroItem}>
                <Text style={[styles.mealMacroLabel, { color: colors.primary }]}>P</Text>
                <TextInput style={styles.mealMacroInput} value={String(meal.estimatedProtein || '')}
                  onChangeText={(v) => updateMealMacro(mealIndex, 'estimatedProtein', v)}
                  keyboardType="numeric" placeholder="0" placeholderTextColor={colors.textMuted} />
              </View>
              <View style={styles.mealMacroItem}>
                <Text style={[styles.mealMacroLabel, { color: colors.warning }]}>C</Text>
                <TextInput style={styles.mealMacroInput} value={String(meal.estimatedCarbs || '')}
                  onChangeText={(v) => updateMealMacro(mealIndex, 'estimatedCarbs', v)}
                  keyboardType="numeric" placeholder="0" placeholderTextColor={colors.textMuted} />
              </View>
              <View style={styles.mealMacroItem}>
                <Text style={[styles.mealMacroLabel, { color: colors.success }]}>F</Text>
                <TextInput style={styles.mealMacroInput} value={String(meal.estimatedFat || '')}
                  onChangeText={(v) => updateMealMacro(mealIndex, 'estimatedFat', v)}
                  keyboardType="numeric" placeholder="0" placeholderTextColor={colors.textMuted} />
              </View>
            </View>
          </View>
        ))}

        {/* Optional Snack */}
        <Text style={styles.sectionLabel}>Optional Evening Snack</Text>
        <TextInput
          style={styles.fullInput}
          value={optionalSnack}
          onChangeText={setOptionalSnack}
          placeholder="e.g. 150g cottage cheese or 20g Dark Chocolate"
          placeholderTextColor={colors.textMuted}
        />

        {/* Notes */}
        <Text style={styles.sectionLabel}>Notes (one per line)</Text>
        <TextInput
          style={[styles.fullInput, styles.multiline]}
          value={notesText}
          onChangeText={setNotesText}
          placeholder="Add plan notes..."
          placeholderTextColor={colors.textMuted}
          multiline
          numberOfLines={5}
        />

        {/* Supplements */}
        <Text style={styles.sectionLabel}>Supplements (one per line)</Text>
        <TextInput
          style={[styles.fullInput, styles.multiline]}
          value={supplementsText}
          onChangeText={setSupplementsText}
          placeholder="Add supplements..."
          placeholderTextColor={colors.textMuted}
          multiline
          numberOfLines={4}
        />

        <Button
          title={saving ? 'Saving...' : 'Save Meal Plan'}
          onPress={saveMealPlan}
          loading={saving}
          style={{ marginTop: spacing.lg }}
        />
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  list: { padding: spacing.md },
  editorContent: { padding: spacing.md, paddingBottom: spacing.xxl },
  empty: { alignItems: 'center', padding: spacing.xxl },
  emptyText: { color: colors.textMuted, fontSize: fontSize.md },

  clientCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface, padding: spacing.md, borderRadius: borderRadius.lg, marginBottom: spacing.sm },
  clientAvatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.primary, justifyContent: 'center', alignItems: 'center', marginRight: spacing.md },
  avatarText: { color: '#fff', fontWeight: '700', fontSize: fontSize.md },
  clientName: { color: colors.text, fontSize: fontSize.md, fontWeight: '600' },
  clientEmail: { color: colors.textMuted, fontSize: fontSize.xs, marginTop: 2 },

  backButton: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs, marginBottom: spacing.lg },
  backText: { color: colors.primary, fontSize: fontSize.sm, fontWeight: '600' },

  fieldRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.md },
  fieldLabel: { color: colors.text, fontSize: fontSize.md, fontWeight: '600' },
  smallInput: { backgroundColor: colors.inputBackground, borderRadius: borderRadius.sm, padding: spacing.sm, color: colors.text, fontSize: fontSize.md, fontWeight: '700', textAlign: 'center', width: 80, borderWidth: 1, borderColor: colors.border },

  mealEditor: { backgroundColor: colors.surface, borderRadius: borderRadius.md, padding: spacing.md, marginBottom: spacing.md, borderLeftWidth: 3, borderLeftColor: colors.primary },
  mealLabel: { color: colors.primary, fontSize: fontSize.md, fontWeight: '800', marginBottom: spacing.sm },
  itemRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.xs },
  itemInput: { flex: 1, backgroundColor: colors.inputBackground, borderRadius: borderRadius.sm, padding: spacing.sm, color: colors.text, fontSize: fontSize.sm, borderWidth: 1, borderColor: colors.border },
  addItemButton: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs, marginTop: spacing.xs, marginBottom: spacing.sm },
  addItemText: { color: colors.success, fontSize: fontSize.xs, fontWeight: '600' },
  noteInput: { backgroundColor: colors.inputBackground, borderRadius: borderRadius.sm, padding: spacing.sm, color: colors.accent, fontSize: fontSize.xs, fontStyle: 'italic', borderWidth: 1, borderColor: colors.border },

  mealMacroRow: { flexDirection: 'row', gap: spacing.xs, marginTop: spacing.sm },
  mealMacroItem: { flex: 1 },
  mealMacroLabel: { fontSize: 10, fontWeight: '700', textAlign: 'center', marginBottom: 2 },
  mealMacroInput: { backgroundColor: colors.inputBackground, borderRadius: borderRadius.sm, padding: spacing.xs, color: colors.text, fontSize: fontSize.sm, fontWeight: '700', textAlign: 'center', borderWidth: 1, borderColor: colors.border },
  sectionLabel: { color: colors.text, fontSize: fontSize.md, fontWeight: '600', marginBottom: spacing.xs, marginTop: spacing.md },
  fullInput: { backgroundColor: colors.inputBackground, borderRadius: borderRadius.md, padding: spacing.md, color: colors.text, fontSize: fontSize.sm, borderWidth: 1, borderColor: colors.border },
  multiline: { minHeight: 100, textAlignVertical: 'top' },
});
