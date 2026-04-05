import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, Alert, ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Stack } from 'expo-router';
import { collection, query, where, getDocs, doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { UserProfile, WorkoutProgramme, WorkoutDay, WorkoutExercise } from '../../types';
import { Button } from '../../components/ui/Button';
import { colors, spacing, fontSize, borderRadius, shadows } from '../../components/ui/theme';

const DEFAULT_DAYS: WorkoutDay[] = [
  { label: 'Push', exercises: [{ name: '', sets: 4, reps: '10', restSeconds: 90, notes: '' }] },
  { label: 'Pull', exercises: [{ name: '', sets: 4, reps: '10', restSeconds: 90, notes: '' }] },
  { label: 'Legs', exercises: [{ name: '', sets: 4, reps: '10', restSeconds: 90, notes: '' }] },
];

export default function AdminWorkoutsScreen() {
  const [clients, setClients] = useState<UserProfile[]>([]);
  const [selectedClient, setSelectedClient] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Editor state
  const [programmeName, setProgrammeName] = useState('Push Pull Legs');
  const [days, setDays] = useState<WorkoutDay[]>(DEFAULT_DAYS);
  const [notesText, setNotesText] = useState('');
  const [saving, setSaving] = useState(false);
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);

  useEffect(() => { loadClients(); }, []);

  async function loadClients() {
    try {
      const snap = await getDocs(query(collection(db, 'users'), where('role', '==', 'client')));
      const list: UserProfile[] = [];
      snap.forEach((d) => list.push(d.data() as UserProfile));
      list.sort((a, b) => a.name.localeCompare(b.name));
      setClients(list);
    } catch { Alert.alert('Error', 'Failed to load clients'); }
    finally { setLoading(false); }
  }

  const selectClient = async (client: UserProfile) => {
    setSelectedClient(client);
    try {
      const progDoc = await getDoc(doc(db, 'users', client.uid, 'workoutProgramme', 'current'));
      if (progDoc.exists()) {
        const prog = progDoc.data() as WorkoutProgramme;
        setProgrammeName(prog.name || 'Push Pull Legs');
        setDays(prog.days.length > 0 ? prog.days : DEFAULT_DAYS);
        setNotesText(prog.notes.join('\n'));
      } else {
        setProgrammeName('Push Pull Legs');
        setDays(DEFAULT_DAYS.map(d => ({ ...d, exercises: [{ name: '', sets: 4, reps: '10', restSeconds: 90, notes: '' }] })));
        setNotesText('Warm up properly before each session\nFocus on form over weight\nRest 48-72 hours between same muscle groups');
      }
      setSelectedDayIndex(0);
    } catch { /* defaults */ }
  };

  // Day management
  const addDay = () => {
    setDays([...days, { label: `Day ${days.length + 1}`, exercises: [{ name: '', sets: 4, reps: '10', restSeconds: 90, notes: '' }] }]);
    setSelectedDayIndex(days.length);
  };

  const removeDay = (index: number) => {
    if (days.length <= 1) return;
    const newDays = days.filter((_, i) => i !== index);
    setDays(newDays);
    setSelectedDayIndex(Math.min(selectedDayIndex, newDays.length - 1));
  };

  const updateDayLabel = (index: number, label: string) => {
    const newDays = [...days];
    newDays[index] = { ...newDays[index], label };
    setDays(newDays);
  };

  // Exercise management
  const addExercise = () => {
    const newDays = [...days];
    newDays[selectedDayIndex] = {
      ...newDays[selectedDayIndex],
      exercises: [...newDays[selectedDayIndex].exercises, { name: '', sets: 4, reps: '10', restSeconds: 90, notes: '' }],
    };
    setDays(newDays);
  };

  const removeExercise = (exIndex: number) => {
    const newDays = [...days];
    const exercises = newDays[selectedDayIndex].exercises.filter((_, i) => i !== exIndex);
    newDays[selectedDayIndex] = { ...newDays[selectedDayIndex], exercises: exercises.length > 0 ? exercises : [{ name: '', sets: 4, reps: '10', restSeconds: 90, notes: '' }] };
    setDays(newDays);
  };

  const updateExercise = (exIndex: number, field: keyof WorkoutExercise, value: string | number) => {
    const newDays = [...days];
    const exercises = [...newDays[selectedDayIndex].exercises];
    exercises[exIndex] = { ...exercises[exIndex], [field]: value };
    newDays[selectedDayIndex] = { ...newDays[selectedDayIndex], exercises };
    setDays(newDays);
  };

  const saveProgramme = async () => {
    if (!selectedClient) return;
    setSaving(true);
    try {
      const programme: WorkoutProgramme = {
        name: programmeName.trim() || 'Workout Programme',
        days: days.map(d => ({
          ...d,
          exercises: d.exercises.filter(e => e.name.trim() !== ''),
        })).filter(d => d.exercises.length > 0),
        notes: notesText.split('\n').filter(n => n.trim()),
        updatedAt: Date.now(),
      };
      await setDoc(doc(db, 'users', selectedClient.uid, 'workoutProgramme', 'current'), programme);
      Alert.alert('Saved!', `Workout programme updated for ${selectedClient.name}`);
    } catch { Alert.alert('Error', 'Failed to save'); }
    finally { setSaving(false); }
  };

  // Client list
  if (!selectedClient) {
    return (
      <>
        <Stack.Screen options={{ title: 'Set Workouts' }} />
        <FlatList style={styles.container} data={clients} keyExtractor={(item) => item.uid}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <TouchableOpacity style={[styles.clientCard, shadows.sm]} onPress={() => selectClient(item)} activeOpacity={0.7}>
              <View style={styles.clientAvatar}><Text style={styles.avatarText}>{item.name.charAt(0)}</Text></View>
              <View style={{ flex: 1 }}><Text style={styles.clientName}>{item.name}</Text><Text style={styles.clientEmail}>{item.email}</Text></View>
              <Ionicons name="barbell-outline" size={22} color={colors.primary} />
            </TouchableOpacity>
          )}
          ListEmptyComponent={<View style={styles.empty}><Text style={styles.emptyText}>{loading ? 'Loading...' : 'No clients'}</Text></View>}
        />
      </>
    );
  }

  const currentDay = days[selectedDayIndex];

  // Programme editor
  return (
    <>
      <Stack.Screen options={{ title: `Workout: ${selectedClient.name}` }} />
      <ScrollView style={styles.container} contentContainerStyle={styles.editorContent}>
        <TouchableOpacity style={styles.backButton} onPress={() => setSelectedClient(null)}>
          <Ionicons name="arrow-back" size={20} color={colors.primary} />
          <Text style={styles.backText}>Back to clients</Text>
        </TouchableOpacity>

        {/* Programme Name */}
        <Text style={styles.label}>Programme Name</Text>
        <TextInput style={styles.input} value={programmeName} onChangeText={setProgrammeName}
          placeholder="e.g. Push Pull Legs" placeholderTextColor={colors.textMuted} />

        {/* Day Tabs */}
        <Text style={styles.label}>Training Days</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.dayScroller}>
          {days.map((day, index) => (
            <TouchableOpacity key={index}
              style={[styles.dayTab, selectedDayIndex === index && styles.dayTabActive]}
              onPress={() => setSelectedDayIndex(index)}>
              <Text style={[styles.dayTabText, selectedDayIndex === index && styles.dayTabTextActive]}>{day.label}</Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity style={styles.addDayTab} onPress={addDay}>
            <Ionicons name="add" size={18} color={colors.success} />
          </TouchableOpacity>
        </ScrollView>

        {/* Day Label */}
        <View style={styles.dayLabelRow}>
          <Text style={styles.label}>Day Name</Text>
          <TextInput style={[styles.input, { flex: 1, marginLeft: spacing.md }]}
            value={currentDay?.label || ''} onChangeText={(v) => updateDayLabel(selectedDayIndex, v)}
            placeholder="e.g. Push" placeholderTextColor={colors.textMuted} />
          {days.length > 1 && (
            <TouchableOpacity onPress={() => removeDay(selectedDayIndex)} style={{ marginLeft: spacing.sm }}>
              <Ionicons name="trash-outline" size={20} color={colors.error} />
            </TouchableOpacity>
          )}
        </View>

        {/* Exercises */}
        {currentDay?.exercises.map((exercise, exIndex) => (
          <View key={exIndex} style={[styles.exerciseEditor, shadows.sm]}>
            <View style={styles.exerciseEditorHeader}>
              <Text style={styles.exerciseEditorNum}>Exercise {exIndex + 1}</Text>
              {currentDay.exercises.length > 1 && (
                <TouchableOpacity onPress={() => removeExercise(exIndex)}>
                  <Ionicons name="close-circle" size={20} color={colors.error} />
                </TouchableOpacity>
              )}
            </View>

            <TextInput style={styles.exerciseNameInput}
              value={exercise.name} onChangeText={(v) => updateExercise(exIndex, 'name', v)}
              placeholder="Exercise name e.g. Bench Press" placeholderTextColor={colors.textMuted} />

            <View style={styles.exerciseMetaRow}>
              <View style={styles.metaField}>
                <Text style={styles.metaLabel}>Sets</Text>
                <TextInput style={styles.metaInput} value={String(exercise.sets)}
                  onChangeText={(v) => updateExercise(exIndex, 'sets', parseInt(v) || 0)} keyboardType="numeric" />
              </View>
              <View style={styles.metaField}>
                <Text style={styles.metaLabel}>Reps</Text>
                <TextInput style={styles.metaInput} value={exercise.reps}
                  onChangeText={(v) => updateExercise(exIndex, 'reps', v)} placeholder="10" placeholderTextColor={colors.textMuted} />
              </View>
              <View style={styles.metaField}>
                <Text style={styles.metaLabel}>Rest (s)</Text>
                <TextInput style={styles.metaInput} value={String(exercise.restSeconds)}
                  onChangeText={(v) => updateExercise(exIndex, 'restSeconds', parseInt(v) || 0)} keyboardType="numeric" />
              </View>
            </View>

            <TextInput style={styles.exerciseNoteInput}
              value={exercise.notes || ''} onChangeText={(v) => updateExercise(exIndex, 'notes', v)}
              placeholder="Notes (optional) e.g. superset with next" placeholderTextColor={colors.textMuted} />
          </View>
        ))}

        <TouchableOpacity style={styles.addExerciseBtn} onPress={addExercise}>
          <Ionicons name="add-circle" size={20} color={colors.success} />
          <Text style={styles.addExerciseText}>Add Exercise</Text>
        </TouchableOpacity>

        {/* Notes */}
        <Text style={styles.label}>Programme Notes (one per line)</Text>
        <TextInput style={[styles.input, { minHeight: 80, textAlignVertical: 'top' }]}
          value={notesText} onChangeText={setNotesText} multiline numberOfLines={4}
          placeholder="General notes for the client..." placeholderTextColor={colors.textMuted} />

        <Button title={saving ? 'Saving...' : 'Save Programme'} onPress={saveProgramme} loading={saving} style={{ marginTop: spacing.lg }} />
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

  label: { color: colors.textSecondary, fontSize: fontSize.sm, fontWeight: '600', marginBottom: spacing.xs, marginTop: spacing.md },
  input: { backgroundColor: colors.inputBackground, borderRadius: borderRadius.md, padding: spacing.md, color: colors.text, fontSize: fontSize.md, borderWidth: 1, borderColor: colors.border },

  dayScroller: { marginBottom: spacing.md },
  dayTab: { paddingHorizontal: spacing.lg, paddingVertical: spacing.sm, borderRadius: borderRadius.full, backgroundColor: colors.surface, marginRight: spacing.sm },
  dayTabActive: { backgroundColor: colors.primary },
  dayTabText: { color: colors.textMuted, fontSize: fontSize.sm, fontWeight: '700' },
  dayTabTextActive: { color: '#fff' },
  addDayTab: { width: 36, height: 36, borderRadius: 18, backgroundColor: colors.success + '20', justifyContent: 'center', alignItems: 'center' },

  dayLabelRow: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.md },

  exerciseEditor: { backgroundColor: colors.surface, borderRadius: borderRadius.md, padding: spacing.md, marginBottom: spacing.sm, borderLeftWidth: 3, borderLeftColor: colors.primary },
  exerciseEditorHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.sm },
  exerciseEditorNum: { color: colors.primary, fontSize: fontSize.xs, fontWeight: '800', textTransform: 'uppercase' },
  exerciseNameInput: { backgroundColor: colors.inputBackground, borderRadius: borderRadius.sm, padding: spacing.sm, color: colors.text, fontSize: fontSize.md, fontWeight: '600', borderWidth: 1, borderColor: colors.border, marginBottom: spacing.sm },
  exerciseMetaRow: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.sm },
  metaField: { flex: 1 },
  metaLabel: { color: colors.textMuted, fontSize: fontSize.xs, marginBottom: 2 },
  metaInput: { backgroundColor: colors.inputBackground, borderRadius: borderRadius.sm, padding: spacing.sm, color: colors.text, fontSize: fontSize.md, fontWeight: '700', textAlign: 'center', borderWidth: 1, borderColor: colors.border },
  exerciseNoteInput: { backgroundColor: colors.inputBackground, borderRadius: borderRadius.sm, padding: spacing.sm, color: colors.accent, fontSize: fontSize.xs, fontStyle: 'italic', borderWidth: 1, borderColor: colors.border },

  addExerciseBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.xs, paddingVertical: spacing.md },
  addExerciseText: { color: colors.success, fontSize: fontSize.sm, fontWeight: '700' },
});
