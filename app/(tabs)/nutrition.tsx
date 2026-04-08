import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { collection, getDocs, getDoc, doc } from 'firebase/firestore';
import { router, useFocusEffect } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../lib/firebase';
import { FoodEntry, NutritionTargets, DailyProgress, MealPlan, ExtraFoodItem } from '../../types';
import { colors, spacing, fontSize, borderRadius, shadows } from '../../components/ui/theme';
import { InactiveGate } from '../../components/ui/InactiveGate';

export default function NutritionScreen() {
  const { profile } = useAuth();
  const [entries, setEntries] = useState<FoodEntry[]>([]);
  const [targets, setTargets] = useState<NutritionTargets | null>(null);
  const [mealPlan, setMealPlan] = useState<MealPlan | null>(null);
  const [progress, setProgress] = useState<DailyProgress | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const dateStr = selectedDate.toISOString().split('T')[0];
  const isToday = dateStr === new Date().toISOString().split('T')[0];

  useEffect(() => {
    loadData();
  }, [selectedDate]);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [selectedDate, profile])
  );

  async function loadData() {
    if (!profile) return;
    setLoading(true);
    try {
      const [targetsDoc, entriesSnap, planDoc, progressDoc] = await Promise.all([
        getDoc(doc(db, 'users', profile.uid, 'settings', 'nutritionTargets')),
        getDocs(collection(db, 'users', profile.uid, 'foodLog', dateStr, 'entries')),
        getDoc(doc(db, 'users', profile.uid, 'mealPlan', 'current')),
        getDoc(doc(db, 'users', profile.uid, 'dailyProgress', dateStr)),
      ]);

      if (targetsDoc.exists()) {
        setTargets(targetsDoc.data() as NutritionTargets);
      } else {
        // Fall back to meal plan targets
        const planData = planDoc.exists() ? planDoc.data() : null;
        if (planData) {
          setTargets({
            calories: planData.calorieTarget ?? 2200,
            protein: planData.proteinTarget ?? 150,
            carbs: planData.carbsTarget ?? 250,
            fat: planData.fatTarget ?? 70,
          });
        }
      }

      if (planDoc.exists()) setMealPlan(planDoc.data() as MealPlan);
      if (progressDoc.exists()) {
        setProgress(progressDoc.data() as DailyProgress);
      } else {
        setProgress(null);
      }

      const loaded = entriesSnap.docs.map((d) => ({ id: d.id, ...d.data() } as FoodEntry));
      loaded.sort((a, b) => (a.timestamp || 0) - (b.timestamp || 0));
      setEntries(loaded);
    } catch {
      /* silent */
    } finally {
      setLoading(false);
    }
  }

  // Calculate totals from food log entries
  const totals = entries.reduce(
    (acc, e) => ({
      calories: acc.calories + (e.calories || 0),
      protein: acc.protein + (e.protein || 0),
      carbs: acc.carbs + (e.carbs || 0),
      fat: acc.fat + (e.fat || 0),
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  );

  // Also add extras from daily progress
  const extras: ExtraFoodItem[] = progress?.extras || [];
  const extraTotals = extras.reduce(
    (acc, e) => ({
      calories: acc.calories + (e.calories || 0),
      protein: acc.protein + (e.protein || 0),
      carbs: acc.carbs + (e.carbs || 0),
      fat: acc.fat + (e.fat || 0),
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  );

  const combined = {
    calories: totals.calories + extraTotals.calories,
    protein: totals.protein + extraTotals.protein,
    carbs: totals.carbs + extraTotals.carbs,
    fat: totals.fat + extraTotals.fat,
  };

  const mealsCompleted = (progress?.mealsCompleted || []).filter(Boolean).length;
  const totalMeals = mealPlan?.meals?.length || 0;

  const MacroCard = ({
    label, current, target, color, iconName, unit,
  }: {
    label: string; current: number; target: number; color: string; iconName: string; unit: string;
  }) => {
    const pct = target > 0 ? Math.min((current / target) * 100, 100) : 0;
    const over = target > 0 && current > target;
    return (
      <View style={[styles.macroCard, shadows.sm]}>
        <View style={styles.macroCardHeader}>
          <Ionicons name={iconName as any} size={16} color={color} />
          <Text style={styles.macroCardLabel}>{label}</Text>
        </View>
        <Text style={[styles.macroCardValue, over && { color: colors.error }]}>
          {Math.round(current)}
          <Text style={styles.macroCardUnit}>{unit}</Text>
        </Text>
        {target > 0 && (
          <>
            <Text style={styles.macroCardTarget}>of {target}{unit}</Text>
            <View style={styles.macroProgressBg}>
              <View
                style={[
                  styles.macroProgressFill,
                  {
                    backgroundColor: over ? colors.error : color,
                    width: `${pct}%`,
                  },
                ]}
              />
            </View>
          </>
        )}
      </View>
    );
  };

  return (
    <InactiveGate>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        {/* Header */}
        <Text style={styles.heading}>Nutrition</Text>
        <Text style={styles.subheading}>Your daily nutritional overview.</Text>

        {/* Date Navigation */}
        <View style={[styles.dateNav, shadows.sm]}>
          <TouchableOpacity
            style={styles.dateNavBtn}
            onPress={() => setSelectedDate(new Date(selectedDate.getTime() - 86400000))}
          >
            <Ionicons name="chevron-back" size={22} color={colors.text} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setSelectedDate(new Date())}>
            <Text style={styles.dateText}>
              {isToday
                ? 'Today'
                : selectedDate.toLocaleDateString('en-GB', {
                    weekday: 'short',
                    day: 'numeric',
                    month: 'short',
                  })}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.dateNavBtn, isToday && { opacity: 0.3 }]}
            onPress={() => {
              const tomorrow = new Date(selectedDate.getTime() + 86400000);
              if (tomorrow <= new Date()) setSelectedDate(tomorrow);
            }}
            disabled={isToday}
          >
            <Ionicons name="chevron-forward" size={22} color={colors.text} />
          </TouchableOpacity>
        </View>

        {loading ? (
          <View style={styles.loadingSection}>
            <ActivityIndicator size="large" color={colors.accent} />
          </View>
        ) : (
          <>
            {/* Macro Cards */}
            <View style={styles.macroGrid}>
              <MacroCard
                label="Calories"
                current={combined.calories}
                target={targets?.calories || 0}
                color={colors.accent}
                iconName="flame"
                unit="kcal"
              />
              <MacroCard
                label="Protein"
                current={combined.protein}
                target={targets?.protein || 0}
                color={colors.primary}
                iconName="fitness"
                unit="g"
              />
              <MacroCard
                label="Carbs"
                current={combined.carbs}
                target={targets?.carbs || 0}
                color={colors.warning}
                iconName="leaf"
                unit="g"
              />
              <MacroCard
                label="Fat"
                current={combined.fat}
                target={targets?.fat || 0}
                color={colors.success}
                iconName="water"
                unit="g"
              />
            </View>

            {/* Meals section */}
            <View style={[styles.mealsCard, shadows.sm]}>
              <View style={styles.mealsHeader}>
                <Text style={styles.mealsTitle}>
                  Meals ({mealsCompleted}/{totalMeals} completed)
                </Text>
                <TouchableOpacity onPress={() => router.push('/(tabs)/myplan')}>
                  <Text style={styles.goToPlanText}>Go to My Plan</Text>
                </TouchableOpacity>
              </View>

              {entries.length === 0 && extras.length === 0 ? (
                <View style={styles.emptyState}>
                  <Ionicons name="nutrition-outline" size={40} color={colors.textMuted} />
                  <Text style={styles.emptyText}>No food logged yet today</Text>
                  <Text style={styles.emptySubtext}>
                    Complete meals from My Plan to see your nutrition breakdown.
                  </Text>
                  <TouchableOpacity
                    style={styles.goToPlanBtn}
                    onPress={() => router.push('/(tabs)/myplan')}
                    activeOpacity={0.8}
                  >
                    <LinearGradient
                      colors={[colors.primary, colors.primaryDark]}
                      style={styles.goToPlanBtnGradient}
                    >
                      <Ionicons name="clipboard" size={16} color="#fff" />
                      <Text style={styles.goToPlanBtnText}>Go to My Plan</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              ) : (
                <View>
                  {entries.map((entry, i) => (
                    <View key={`entry-${i}`} style={styles.foodRow}>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.foodName}>{entry.foodName}</Text>
                        {entry.brand ? (
                          <Text style={styles.foodBrand}>{entry.brand}</Text>
                        ) : null}
                      </View>
                      <View style={styles.macroLabels}>
                        <Text style={[styles.macroLabelText, { color: colors.accent }]}>{entry.calories}kcal</Text>
                        <Text style={styles.macroLabelText}>P:{entry.protein}g</Text>
                        <Text style={styles.macroLabelText}>C:{entry.carbs}g</Text>
                        <Text style={styles.macroLabelText}>F:{entry.fat}g</Text>
                      </View>
                    </View>
                  ))}
                  {extras.map((extra, i) => (
                    <View key={`extra-${i}`} style={[styles.foodRow, styles.extraRow]}>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.foodName}>
                          {extra.name}
                          <Text style={styles.extraBadge}>  extra</Text>
                        </Text>
                      </View>
                      <View style={styles.macroLabels}>
                        <Text style={[styles.macroLabelText, { color: colors.accent }]}>{extra.calories}kcal</Text>
                        <Text style={styles.macroLabelText}>P:{extra.protein}g</Text>
                        <Text style={styles.macroLabelText}>C:{extra.carbs}g</Text>
                        <Text style={styles.macroLabelText}>F:{extra.fat}g</Text>
                      </View>
                    </View>
                  ))}
                </View>
              )}
            </View>

            {/* No targets set */}
            {!targets && (
              <View style={[styles.noTargetsCard, shadows.sm]}>
                <Text style={styles.noTargetsText}>
                  Your coach hasn't set your nutrition targets yet. Once they do, you'll see progress bars for each macro.
                </Text>
              </View>
            )}
          </>
        )}
      </ScrollView>
    </InactiveGate>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.md, paddingBottom: spacing.xxl },

  heading: { color: colors.text, fontSize: fontSize.xl, fontWeight: '700', marginBottom: spacing.xs },
  subheading: { color: colors.textSecondary, fontSize: fontSize.sm, marginBottom: spacing.md },

  dateNav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.md,
  },
  dateNavBtn: { padding: spacing.sm, borderRadius: borderRadius.sm },
  dateText: { color: colors.text, fontSize: fontSize.md, fontWeight: '600' },

  loadingSection: { alignItems: 'center', paddingVertical: spacing.xxl },

  macroGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  macroCard: {
    width: '48%' as any,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  macroCardHeader: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs, marginBottom: spacing.sm },
  macroCardLabel: { color: colors.textSecondary, fontSize: fontSize.sm, fontWeight: '500' },
  macroCardValue: { color: colors.text, fontSize: fontSize.xl, fontWeight: '700' },
  macroCardUnit: { color: colors.textMuted, fontSize: fontSize.sm, fontWeight: '400' },
  macroCardTarget: { color: colors.textMuted, fontSize: fontSize.xs, marginBottom: spacing.xs },
  macroProgressBg: {
    height: 6,
    backgroundColor: colors.surfaceLight,
    borderRadius: 3,
    overflow: 'hidden',
    marginTop: spacing.xs,
  },
  macroProgressFill: { height: '100%', borderRadius: 3 },

  mealsCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.md,
  },
  mealsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  mealsTitle: { color: colors.text, fontSize: fontSize.md, fontWeight: '600' },
  goToPlanText: { color: colors.primary, fontSize: fontSize.sm, fontWeight: '600' },

  emptyState: { alignItems: 'center', paddingVertical: spacing.lg },
  emptyText: { color: colors.textMuted, fontSize: fontSize.md, fontWeight: '600', marginTop: spacing.sm },
  emptySubtext: { color: colors.textMuted, fontSize: fontSize.sm, textAlign: 'center', marginTop: spacing.xs, marginBottom: spacing.md },

  goToPlanBtn: { borderRadius: borderRadius.md, overflow: 'hidden', marginTop: spacing.sm },
  goToPlanBtnGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm + 2,
  },
  goToPlanBtnText: { color: '#fff', fontSize: fontSize.md, fontWeight: '700' },

  foodRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    backgroundColor: colors.surfaceLight,
    borderRadius: borderRadius.md,
    padding: spacing.sm + 2,
    marginBottom: spacing.xs,
  },
  extraRow: {
    backgroundColor: colors.accent + '08',
    borderWidth: 1,
    borderColor: colors.accent + '15',
  },
  foodName: { color: colors.text, fontSize: fontSize.sm, fontWeight: '500' },
  foodBrand: { color: colors.textMuted, fontSize: fontSize.xs, marginTop: 1 },
  extraBadge: { color: colors.accent, fontSize: fontSize.xs },
  macroLabels: { flexDirection: 'row', gap: spacing.sm },
  macroLabelText: { color: colors.textSecondary, fontSize: fontSize.xs },

  noTargetsCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  noTargetsText: { color: colors.textMuted, fontSize: fontSize.sm, textAlign: 'center' },
});
