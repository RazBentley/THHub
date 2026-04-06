import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Stack } from 'expo-router';
import { suggestWorkoutWithAI, AIWorkoutResult } from '../lib/ai';
import { colors, spacing, fontSize, borderRadius, shadows } from '../components/ui/theme';

const QUICK_SEARCHES = [
  { label: 'Upper body', query: 'upper body workout', icon: 'body-outline' },
  { label: 'Lower body', query: 'lower body workout', icon: 'footsteps-outline' },
  { label: 'Full body', query: 'full body workout', icon: 'fitness-outline' },
  { label: 'HIIT', query: 'HIIT cardio workout', icon: 'flash-outline' },
  { label: 'Core & Abs', query: 'core and abs workout', icon: 'ellipse-outline' },
  { label: 'Chest & Triceps', query: 'chest and triceps workout', icon: 'barbell-outline' },
  { label: 'Back & Biceps', query: 'back and biceps workout', icon: 'barbell-outline' },
  { label: 'Shoulders', query: 'shoulder workout', icon: 'body-outline' },
  { label: 'Legs', query: 'leg day workout', icon: 'footsteps-outline' },
];

export default function WorkoutIdeasScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [location, setLocation] = useState<'gym' | 'home'>('gym');
  const [loading, setLoading] = useState(false);
  const [workout, setWorkout] = useState<AIWorkoutResult | null>(null);

  const handleSearch = async (query?: string) => {
    const q = query || searchQuery;
    if (!q.trim()) return;
    setLoading(true);
    setWorkout(null);
    try {
      const result = await suggestWorkoutWithAI(q + (location === 'home' ? ' at home no equipment' : ''), location);
      setWorkout(result);
    } catch { /* silent */ }
    finally { setLoading(false); }
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: true, title: 'Workout Ideas', headerStyle: { backgroundColor: colors.secondary }, headerTintColor: colors.text }} />
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>

        {/* Location toggle */}
        <View style={styles.toggleRow}>
          <TouchableOpacity
            style={[styles.toggleBtn, location === 'gym' && styles.toggleBtnActive]}
            onPress={() => setLocation('gym')}
          >
            <Ionicons name="barbell" size={16} color={location === 'gym' ? '#fff' : colors.textMuted} />
            <Text style={[styles.toggleText, location === 'gym' && styles.toggleTextActive]}>Gym</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.toggleBtn, location === 'home' && styles.toggleBtnActive]}
            onPress={() => setLocation('home')}
          >
            <Ionicons name="home" size={16} color={location === 'home' ? '#fff' : colors.textMuted} />
            <Text style={[styles.toggleText, location === 'home' && styles.toggleTextActive]}>Home</Text>
          </TouchableOpacity>
        </View>

        {/* Search */}
        <View style={styles.searchRow}>
          <View style={styles.searchInput}>
            <Ionicons name="search" size={18} color={colors.textMuted} />
            <TextInput
              style={styles.searchText}
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="e.g. quick HIIT, beginner full body..."
              placeholderTextColor={colors.textMuted}
              onSubmitEditing={() => handleSearch()}
              returnKeyType="search"
            />
          </View>
          <TouchableOpacity
            style={[styles.searchBtn, (!searchQuery.trim() || loading) && { opacity: 0.5 }]}
            onPress={() => handleSearch()}
            disabled={loading || !searchQuery.trim()}
          >
            <Text style={styles.searchBtnText}>{loading ? '...' : 'Go'}</Text>
          </TouchableOpacity>
        </View>

        {/* Quick searches */}
        {!workout && !loading && (
          <>
            <Text style={styles.sectionTitle}>Quick Ideas</Text>
            <View style={styles.chipGrid}>
              {QUICK_SEARCHES.map((s) => (
                <TouchableOpacity
                  key={s.label}
                  style={styles.chip}
                  onPress={() => { setSearchQuery(s.query); handleSearch(s.query); }}
                  disabled={loading}
                  activeOpacity={0.7}
                >
                  <Ionicons name={s.icon as any} size={16} color={colors.primary} />
                  <Text style={styles.chipText}>{s.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </>
        )}

        {/* Loading */}
        {loading && (
          <View style={styles.loadingSection}>
            <ActivityIndicator size="large" color={colors.accent} />
            <Text style={styles.loadingText}>Generating your workout...</Text>
          </View>
        )}

        {/* Result */}
        {workout && !loading && (
          <>
            <View style={[styles.workoutHeader, shadows.sm]}>
              <Text style={styles.workoutName}>{workout.name}</Text>
              {workout.duration && (
                <View style={styles.durationBadge}>
                  <Ionicons name="time-outline" size={14} color={colors.textMuted} />
                  <Text style={styles.durationText}>~{workout.duration} min</Text>
                </View>
              )}
              <Text style={styles.workoutDesc}>{workout.description}</Text>
            </View>

            {workout.exercises.map((exercise, index) => (
              <View key={index} style={[styles.exerciseCard, shadows.sm]}>
                <View style={styles.exerciseNumber}>
                  <Text style={styles.exerciseNumberText}>{index + 1}</Text>
                </View>
                <View style={styles.exerciseContent}>
                  <Text style={styles.exerciseName}>{exercise.name}</Text>
                  <View style={styles.metaRow}>
                    <View style={styles.metaChip}>
                      <Text style={styles.metaText}>{exercise.sets} sets</Text>
                    </View>
                    <View style={styles.metaChip}>
                      <Text style={styles.metaText}>{exercise.reps}</Text>
                    </View>
                    <View style={styles.metaChip}>
                      <Ionicons name="time-outline" size={10} color={colors.textMuted} />
                      <Text style={styles.metaText}>{exercise.restSeconds}s rest</Text>
                    </View>
                  </View>
                  {exercise.notes && <Text style={styles.exerciseNotes}>{exercise.notes}</Text>}
                </View>
              </View>
            ))}

            {workout.tips && workout.tips.length > 0 && (
              <View style={[styles.tipsCard, shadows.sm]}>
                <Text style={styles.tipsTitle}>Tips</Text>
                {workout.tips.map((tip, i) => (
                  <Text key={i} style={styles.tipText}>- {tip}</Text>
                ))}
              </View>
            )}

            <Text style={styles.disclaimer}>
              Generated by AI — always check exercises are suitable for your ability level. Your coach's personalised programme takes priority.
            </Text>

            <TouchableOpacity
              style={styles.newSearchBtn}
              onPress={() => { setWorkout(null); setSearchQuery(''); }}
              activeOpacity={0.7}
            >
              <Ionicons name="refresh" size={18} color={colors.primary} />
              <Text style={styles.newSearchText}>Search Again</Text>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.md, paddingBottom: spacing.xxl },

  toggleRow: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.md },
  toggleBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.xs, paddingVertical: spacing.sm + 2, borderRadius: borderRadius.full, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border },
  toggleBtnActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  toggleText: { color: colors.textMuted, fontSize: fontSize.sm, fontWeight: '700' },
  toggleTextActive: { color: '#fff' },

  searchRow: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.lg },
  searchInput: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: spacing.sm, backgroundColor: colors.surface, borderRadius: borderRadius.md, paddingHorizontal: spacing.md, borderWidth: 1, borderColor: colors.border },
  searchText: { flex: 1, color: colors.text, fontSize: fontSize.sm, paddingVertical: spacing.sm + 2 },
  searchBtn: { backgroundColor: colors.primary, borderRadius: borderRadius.md, paddingHorizontal: spacing.lg, justifyContent: 'center' },
  searchBtnText: { color: '#fff', fontWeight: '700', fontSize: fontSize.md },

  sectionTitle: { color: colors.textMuted, fontSize: fontSize.sm, fontWeight: '700', marginBottom: spacing.sm },

  chipGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  chip: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs, paddingHorizontal: spacing.md, paddingVertical: spacing.sm, backgroundColor: colors.surface, borderRadius: borderRadius.full, borderWidth: 1, borderColor: colors.border },
  chipText: { color: colors.textSecondary, fontSize: fontSize.sm, fontWeight: '600' },

  loadingSection: { alignItems: 'center', paddingVertical: spacing.xxl },
  loadingText: { color: colors.textSecondary, fontSize: fontSize.sm, marginTop: spacing.md },

  workoutHeader: { backgroundColor: colors.surface, borderRadius: borderRadius.lg, padding: spacing.md, marginBottom: spacing.md },
  workoutName: { color: colors.text, fontSize: fontSize.xl, fontWeight: '700', marginBottom: spacing.xs },
  durationBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: spacing.sm },
  durationText: { color: colors.textMuted, fontSize: fontSize.xs },
  workoutDesc: { color: colors.textSecondary, fontSize: fontSize.sm, lineHeight: 20 },

  exerciseCard: { flexDirection: 'row', backgroundColor: colors.surface, borderRadius: borderRadius.lg, padding: spacing.md, marginBottom: spacing.sm },
  exerciseNumber: { width: 30, height: 30, borderRadius: 15, backgroundColor: colors.primary + '20', justifyContent: 'center', alignItems: 'center', marginRight: spacing.md },
  exerciseNumberText: { color: colors.primary, fontSize: fontSize.sm, fontWeight: '700' },
  exerciseContent: { flex: 1 },
  exerciseName: { color: colors.text, fontSize: fontSize.md, fontWeight: '700', marginBottom: spacing.xs },
  metaRow: { flexDirection: 'row', gap: spacing.xs },
  metaChip: { flexDirection: 'row', alignItems: 'center', gap: 2, backgroundColor: colors.surfaceLight, paddingHorizontal: spacing.sm, paddingVertical: 2, borderRadius: borderRadius.sm },
  metaText: { color: colors.textMuted, fontSize: fontSize.xs, fontWeight: '600' },
  exerciseNotes: { color: colors.accent, fontSize: fontSize.xs, fontStyle: 'italic', marginTop: spacing.xs },

  tipsCard: { backgroundColor: colors.surface, borderRadius: borderRadius.lg, padding: spacing.md, marginTop: spacing.sm, marginBottom: spacing.md },
  tipsTitle: { color: colors.text, fontSize: fontSize.md, fontWeight: '700', marginBottom: spacing.sm },
  tipText: { color: colors.textSecondary, fontSize: fontSize.sm, marginBottom: spacing.xs },

  disclaimer: { color: colors.textMuted, fontSize: fontSize.xs, textAlign: 'center', marginVertical: spacing.md, lineHeight: 16 },

  newSearchBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.sm, paddingVertical: spacing.md, backgroundColor: colors.surface, borderRadius: borderRadius.md },
  newSearchText: { color: colors.primary, fontWeight: '700', fontSize: fontSize.sm },
});
