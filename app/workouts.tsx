import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Stack } from 'expo-router';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import { db } from '../lib/firebase';
import { WorkoutProgramme, WorkoutDay, WorkoutProgress, ExerciseLog } from '../types';
import { colors, spacing, fontSize, borderRadius, shadows } from '../components/ui/theme';
import { InactiveGate } from '../components/ui/InactiveGate';
import { getLocalDateStr, getWeekStartStr } from '../lib/dates';

export default function WorkoutsScreen() {
  const { profile } = useAuth();
  const [programme, setProgramme] = useState<WorkoutProgramme | null>(null);
  const [selectedDay, setSelectedDay] = useState<number>(0);
  const [progress, setProgress] = useState<WorkoutProgress | null>(null);
  const [loading, setLoading] = useState(true);

  const weekKey = getWeekStartStr(); // Workouts reset Sunday-to-Sunday

  useEffect(() => { loadData(); }, [profile]);

  async function loadData() {
    if (!profile) return;
    try {
      const progDoc = await getDoc(doc(db, 'users', profile.uid, 'workoutProgramme', 'current'));
      if (progDoc.exists()) setProgramme(progDoc.data() as WorkoutProgramme);

      const progressDoc = await getDoc(doc(db, 'users', profile.uid, 'workoutProgress', weekKey));
      if (progressDoc.exists()) {
        const data = progressDoc.data() as WorkoutProgress;
        setProgress(data);
        // Select the day they started
        if (progDoc.exists()) {
          const prog = progDoc.data() as WorkoutProgramme;
          const dayIdx = prog.days.findIndex(d => d.label === data.dayLabel);
          if (dayIdx >= 0) setSelectedDay(dayIdx);
        }
      }
    } catch { /* silent */ }
    finally { setLoading(false); }
  }

  const startWorkout = async (dayIndex: number) => {
    if (!profile || !programme) return;
    const day = programme.days[dayIndex];
    const newProgress: WorkoutProgress = {
      date: weekKey,
      dayLabel: day.label,
      exercisesCompleted: new Array(day.exercises.length).fill(false),
      exerciseLogs: new Array(day.exercises.length).fill({ weight: '', notes: '' }),
    };
    setProgress(newProgress);
    setSelectedDay(dayIndex);
    await setDoc(doc(db, 'users', profile.uid, 'workoutProgress', weekKey), newProgress);
  };

  const saveProgress = async (newProgress: WorkoutProgress) => {
    setProgress(newProgress);
    if (profile) await setDoc(doc(db, 'users', profile.uid, 'workoutProgress', weekKey), newProgress);
  };

  const toggleExercise = async (exerciseIndex: number) => {
    if (!profile || !progress) return;
    const newCompleted = [...(progress.exercisesCompleted || [])];
    newCompleted[exerciseIndex] = !newCompleted[exerciseIndex];

    const allDone = newCompleted.length > 0 && newCompleted.every(Boolean);
    const newProgress: WorkoutProgress = {
      ...progress,
      exercisesCompleted: newCompleted,
      completedAt: allDone ? Date.now() : null,
    };
    await saveProgress(newProgress);

    if (allDone) {
      Alert.alert('Workout Complete!', 'Great session! Keep pushing.');
    }
  };

  const updateExerciseLog = (index: number, field: keyof ExerciseLog, value: string) => {
    if (!progress) return;
    const logs = [...(progress.exerciseLogs || [])];
    while (logs.length <= index) logs.push({ weight: '', notes: '' });
    logs[index] = { ...logs[index], [field]: value };
    saveProgress({ ...progress, exerciseLogs: logs });
  };

  if (loading) return <View style={styles.centered}><Text style={styles.loadingText}>Loading...</Text></View>;

  if (!programme) {
    return (
      <>
        <Stack.Screen options={{ headerBackTitle: ' ', headerShown: true, title: 'Workouts', headerStyle: { backgroundColor: colors.secondary }, headerTintColor: colors.text }} />
        <View style={styles.centered}>
          <Ionicons name="barbell-outline" size={64} color={colors.textMuted} />
          <Text style={styles.emptyTitle}>No Programme Yet</Text>
          <Text style={styles.emptySubtext}>Your coach will set your workout programme soon</Text>
        </View>
      </>
    );
  }

  const currentDay = programme.days[selectedDay];
  const completedCount = progress?.dayLabel === currentDay?.label
    ? (progress.exercisesCompleted || []).filter(Boolean).length : 0;
  const totalExercises = currentDay?.exercises.length || 0;
  const isActiveWorkout = progress?.dayLabel === currentDay?.label;

  return (
    <InactiveGate>
    <>
      <Stack.Screen options={{ headerBackTitle: ' ', headerShown: true, title: programme.name, headerStyle: { backgroundColor: colors.secondary }, headerTintColor: colors.text }} />
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>

        {/* Day Selector */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.dayScroller}>
          {programme.days.map((day, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.dayTab, selectedDay === index && styles.dayTabActive]}
              onPress={() => setSelectedDay(index)}
            >
              <Text style={[styles.dayTabText, selectedDay === index && styles.dayTabTextActive]}>{day.label}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Progress */}
        {isActiveWorkout && (
          <View style={[styles.progressCard, shadows.sm]}>
            <Text style={styles.progressText}>
              {completedCount}/{totalExercises} exercises done
            </Text>
            <View style={styles.progressBarBg}>
              <LinearGradient
                colors={[colors.primary, colors.accent]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={[styles.progressBarFill, { width: `${totalExercises > 0 ? (completedCount / totalExercises) * 100 : 0}%` }]}
              />
            </View>
            {progress.completedAt && (
              <View style={styles.completedBadge}>
                <Ionicons name="checkmark-circle" size={16} color={colors.success} />
                <Text style={styles.completedText}>Workout Complete!</Text>
              </View>
            )}
          </View>
        )}

        {/* Start Workout Button */}
        {!isActiveWorkout && (
          <TouchableOpacity style={[styles.startButton, shadows.md]} onPress={() => startWorkout(selectedDay)} activeOpacity={0.8}>
            <LinearGradient colors={[colors.primary, colors.primaryDark]} style={styles.startGradient}>
              <Ionicons name="play" size={22} color="#fff" />
              <Text style={styles.startText}>Start {currentDay?.label} Workout</Text>
            </LinearGradient>
          </TouchableOpacity>
        )}

        {/* Exercise List */}
        {currentDay?.exercises.map((exercise, index) => {
          const completed = isActiveWorkout && progress.exercisesCompleted?.[index];
          const log = progress?.exerciseLogs?.[index];
          return (
            <View key={index}>
              <TouchableOpacity
                style={[styles.exerciseCard, shadows.sm, completed && styles.exerciseCompleted]}
                onPress={() => isActiveWorkout && toggleExercise(index)}
                disabled={!isActiveWorkout}
                activeOpacity={0.7}
              >
                <View style={styles.exerciseLeft}>
                  <View style={[styles.exerciseNumber, completed && styles.exerciseNumberDone]}>
                    {completed
                      ? <Ionicons name="checkmark" size={16} color="#fff" />
                      : <Text style={styles.exerciseNumberText}>{index + 1}</Text>}
                  </View>
                </View>
                <View style={styles.exerciseContent}>
                  <Text style={[styles.exerciseName, completed && styles.exerciseNameDone]}>{exercise.name}</Text>
                  <View style={styles.exerciseMeta}>
                    <View style={styles.metaChip}>
                      <Text style={styles.metaText}>{exercise.sets} sets</Text>
                    </View>
                    <View style={styles.metaChip}>
                      <Text style={styles.metaText}>{exercise.reps} reps</Text>
                    </View>
                    <View style={styles.metaChip}>
                      <Ionicons name="time-outline" size={12} color={colors.textMuted} />
                      <Text style={styles.metaText}>{exercise.restSeconds}s rest</Text>
                    </View>
                  </View>
                  {exercise.notes ? <Text style={styles.exerciseNotes}>{exercise.notes}</Text> : null}
                </View>
              </TouchableOpacity>
              {isActiveWorkout && (
                <View style={styles.logRow}>
                  <View style={styles.logField}>
                    <Text style={styles.logLabel}>Weight</Text>
                    <TextInput
                      style={styles.logInput}
                      value={log?.weight || ''}
                      onChangeText={(v) => updateExerciseLog(index, 'weight', v)}
                      placeholder="e.g. 40kg"
                      placeholderTextColor={colors.textMuted}
                    />
                  </View>
                  <View style={styles.logField}>
                    <Text style={styles.logLabel}>Notes</Text>
                    <TextInput
                      style={styles.logInput}
                      value={log?.notes || ''}
                      onChangeText={(v) => updateExerciseLog(index, 'notes', v)}
                      placeholder="e.g. felt easy"
                      placeholderTextColor={colors.textMuted}
                    />
                  </View>
                </View>
              )}
            </View>
          );
        })}

        {/* Programme Notes */}
        {programme.notes.length > 0 && (
          <View style={[styles.notesCard, shadows.sm]}>
            <Text style={styles.notesTitle}>Coach Notes</Text>
            {programme.notes.map((note, i) => (
              <Text key={i} style={styles.noteText}>- {note}</Text>
            ))}
          </View>
        )}
      </ScrollView>
    </>
    </InactiveGate>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.md, paddingBottom: spacing.xxl },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background, padding: spacing.xxl },
  loadingText: { color: colors.textMuted, fontSize: fontSize.md },
  emptyTitle: { color: colors.text, fontSize: fontSize.xl, fontWeight: '700', marginTop: spacing.lg },
  emptySubtext: { color: colors.textMuted, fontSize: fontSize.sm, marginTop: spacing.sm, textAlign: 'center' },

  dayScroller: { marginBottom: spacing.md },
  dayTab: { paddingHorizontal: spacing.lg, paddingVertical: spacing.sm, borderRadius: borderRadius.full, backgroundColor: colors.surface, marginRight: spacing.sm },
  dayTabActive: { backgroundColor: colors.primary },
  dayTabText: { color: colors.textMuted, fontSize: fontSize.sm, fontWeight: '700' },
  dayTabTextActive: { color: '#fff' },

  progressCard: { backgroundColor: colors.surface, borderRadius: borderRadius.lg, padding: spacing.md, marginBottom: spacing.md },
  progressText: { color: colors.text, fontSize: fontSize.sm, fontWeight: '700', marginBottom: spacing.sm },
  progressBarBg: { height: 8, backgroundColor: colors.surfaceLight, borderRadius: 4, overflow: 'hidden' },
  progressBarFill: { height: '100%', borderRadius: 4 },
  completedBadge: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs, marginTop: spacing.sm },
  completedText: { color: colors.success, fontSize: fontSize.sm, fontWeight: '700' },

  startButton: { borderRadius: borderRadius.md, overflow: 'hidden', marginBottom: spacing.md },
  startGradient: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: spacing.md, gap: spacing.sm },
  startText: { color: '#fff', fontSize: fontSize.md, fontWeight: '700' },

  exerciseCard: { flexDirection: 'row', backgroundColor: colors.surface, borderRadius: borderRadius.lg, padding: spacing.md, marginBottom: spacing.sm },
  exerciseCompleted: { opacity: 0.7, borderLeftWidth: 3, borderLeftColor: colors.success },
  exerciseLeft: { marginRight: spacing.md, justifyContent: 'flex-start', paddingTop: 2 },
  exerciseNumber: { width: 30, height: 30, borderRadius: 15, backgroundColor: colors.surfaceLight, justifyContent: 'center', alignItems: 'center' },
  exerciseNumberDone: { backgroundColor: colors.success },
  exerciseNumberText: { color: colors.textMuted, fontSize: fontSize.sm, fontWeight: '700' },
  exerciseContent: { flex: 1 },
  exerciseName: { color: colors.text, fontSize: fontSize.md, fontWeight: '700' },
  exerciseNameDone: { textDecorationLine: 'line-through', color: colors.textMuted },
  exerciseMeta: { flexDirection: 'row', gap: spacing.xs, marginTop: spacing.xs },
  metaChip: { flexDirection: 'row', alignItems: 'center', gap: 2, backgroundColor: colors.surfaceLight, paddingHorizontal: spacing.sm, paddingVertical: 2, borderRadius: borderRadius.sm },
  metaText: { color: colors.textMuted, fontSize: fontSize.xs, fontWeight: '600' },
  exerciseNotes: { color: colors.accent, fontSize: fontSize.xs, fontStyle: 'italic', marginTop: spacing.xs },

  notesCard: { backgroundColor: colors.surface, borderRadius: borderRadius.lg, padding: spacing.md, marginTop: spacing.md },
  notesTitle: { color: colors.text, fontSize: fontSize.md, fontWeight: '700', marginBottom: spacing.sm },
  noteText: { color: colors.textSecondary, fontSize: fontSize.sm, marginBottom: spacing.xs },

  logRow: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.sm, paddingHorizontal: spacing.xs },
  logField: { flex: 1 },
  logLabel: { color: colors.textMuted, fontSize: fontSize.xs, fontWeight: '600', marginBottom: 2 },
  logInput: { backgroundColor: colors.inputBackground, borderRadius: borderRadius.sm, paddingHorizontal: spacing.sm, paddingVertical: spacing.xs, color: colors.text, fontSize: fontSize.sm, borderWidth: 1, borderColor: colors.border },
});
