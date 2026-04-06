import React, { useState, useMemo, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput,
  ActivityIndicator, Modal, Alert, FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Stack } from 'expo-router';
import { collection, getDocs, query, where, doc, setDoc } from 'firebase/firestore';
import { suggestWorkoutWithAI, AIWorkoutResult } from '../lib/ai';
import { searchWorkouts, WORKOUT_CATEGORIES, LibraryWorkout } from '../lib/workoutLibrary';
import { getExerciseInfo, ExerciseInfo } from '../lib/exerciseDatabase';
import { useAuth } from '../context/AuthContext';
import { db } from '../lib/firebase';
import { UserProfile, WorkoutProgramme } from '../types';
import { colors, spacing, fontSize, borderRadius, shadows } from '../components/ui/theme';

export default function WorkoutIdeasScreen() {
  const { isOwner } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [location, setLocation] = useState<'gym' | 'home'>('gym');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [expandedWorkout, setExpandedWorkout] = useState<string | null>(null);

  // AI fallback state
  const [loading, setLoading] = useState(false);
  const [aiWorkout, setAiWorkout] = useState<AIWorkoutResult | null>(null);

  // Exercise info modal
  const [exerciseModal, setExerciseModal] = useState<ExerciseInfo & { name: string } | null>(null);

  // Coach: assign to client
  const [showAssign, setShowAssign] = useState(false);
  const [assignWorkout, setAssignWorkout] = useState<{ name: string; exercises: any[] } | null>(null);
  const [clients, setClients] = useState<UserProfile[]>([]);
  const [selectedClient, setSelectedClient] = useState('');
  const [assigning, setAssigning] = useState(false);

  const openAssign = (workout: { name: string; exercises: any[] }) => {
    setAssignWorkout(workout);
    setSelectedClient('');
    setShowAssign(true);
    if (clients.length === 0) {
      getDocs(query(collection(db, 'users'), where('role', '==', 'client')))
        .then(snap => setClients(snap.docs.map(d => d.data() as UserProfile).sort((a, b) => a.name.localeCompare(b.name))))
        .catch(() => {});
    }
  };

  const assignToClient = async () => {
    if (!selectedClient || !assignWorkout) return;
    setAssigning(true);
    try {
      const programme: WorkoutProgramme = {
        name: assignWorkout.name,
        days: [{ label: assignWorkout.name, exercises: assignWorkout.exercises }],
        notes: ['Assigned from Workout Ideas'],
        updatedAt: Date.now(),
      };
      await setDoc(doc(db, 'users', selectedClient, 'workoutProgramme', 'current'), programme);
      Alert.alert('Sent!', `${assignWorkout.name} has been assigned.`);
      setShowAssign(false);
    } catch {
      Alert.alert('Error', 'Failed to assign programme.');
    } finally {
      setAssigning(false);
    }
  };

  // Filter workouts from local library
  const filteredWorkouts = useMemo(() => {
    let results: LibraryWorkout[];

    if (searchQuery.trim()) {
      results = searchWorkouts(searchQuery, location);
    } else if (selectedCategory) {
      results = searchWorkouts(selectedCategory, location);
    } else {
      results = searchWorkouts('', location);
    }

    // Additionally filter by selected category if both search and category are active
    if (selectedCategory && searchQuery.trim()) {
      results = results.filter((w) => w.category === selectedCategory);
    }

    return results;
  }, [searchQuery, location, selectedCategory]);

  const handleAISearch = async () => {
    const q = searchQuery.trim() || (selectedCategory || 'workout');
    setLoading(true);
    setAiWorkout(null);
    try {
      const result = await suggestWorkoutWithAI(
        q + (location === 'home' ? ' at home no equipment' : ''),
        location,
      );
      setAiWorkout(result);
    } catch { /* silent */ }
    finally { setLoading(false); }
  };

  const showExerciseInfo = (name: string) => {
    const info = getExerciseInfo(name);
    if (info) {
      setExerciseModal({ ...info, name });
    }
  };

  const toggleExpand = (id: string) => {
    setExpandedWorkout(expandedWorkout === id ? null : id);
  };

  return (
    <>
      <Stack.Screen options={{ headerBackTitle: ' ', headerShown: true, title: 'Workout Ideas', headerStyle: { backgroundColor: colors.secondary }, headerTintColor: colors.text }} />
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>

        {/* Location toggle */}
        <View style={styles.toggleRow}>
          <TouchableOpacity
            style={[styles.toggleBtn, location === 'gym' && styles.toggleBtnActive]}
            onPress={() => { setLocation('gym'); setAiWorkout(null); }}
          >
            <Ionicons name="barbell" size={16} color={location === 'gym' ? '#fff' : colors.textMuted} />
            <Text style={[styles.toggleText, location === 'gym' && styles.toggleTextActive]}>Gym</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.toggleBtn, location === 'home' && styles.toggleBtnActive]}
            onPress={() => { setLocation('home'); setAiWorkout(null); }}
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
              onChangeText={(t) => { setSearchQuery(t); setAiWorkout(null); }}
              placeholder="Search workouts..."
              placeholderTextColor={colors.textMuted}
              returnKeyType="search"
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => { setSearchQuery(''); setAiWorkout(null); }}>
                <Ionicons name="close-circle" size={18} color={colors.textMuted} />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Category filter pills */}
        {!aiWorkout && (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll} contentContainerStyle={styles.categoryRow}>
            <TouchableOpacity
              style={[styles.categoryChip, !selectedCategory && styles.categoryChipActive]}
              onPress={() => { setSelectedCategory(null); setAiWorkout(null); }}
            >
              <Text style={[styles.categoryChipText, !selectedCategory && styles.categoryChipTextActive]}>All</Text>
            </TouchableOpacity>
            {WORKOUT_CATEGORIES.map((cat) => (
              <TouchableOpacity
                key={cat}
                style={[styles.categoryChip, selectedCategory === cat && styles.categoryChipActive]}
                onPress={() => { setSelectedCategory(selectedCategory === cat ? null : cat); setAiWorkout(null); }}
              >
                <Text style={[styles.categoryChipText, selectedCategory === cat && styles.categoryChipTextActive]}>{cat}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}

        {/* AI result */}
        {aiWorkout && !loading && (
          <>
            <View style={styles.aiLabel}>
              <Ionicons name="sparkles" size={14} color={colors.accent} />
              <Text style={styles.aiLabelText}>AI Generated</Text>
            </View>
            <View style={[styles.workoutHeader, shadows.sm]}>
              <Text style={styles.workoutName}>{aiWorkout.name}</Text>
              {aiWorkout.duration && (
                <View style={styles.durationBadge}>
                  <Ionicons name="time-outline" size={14} color={colors.textMuted} />
                  <Text style={styles.durationText}>~{aiWorkout.duration} min</Text>
                </View>
              )}
              <Text style={styles.workoutDesc}>{aiWorkout.description}</Text>
            </View>

            {aiWorkout.exercises.map((exercise, index) => (
              <View key={index} style={[styles.exerciseCard, shadows.sm]}>
                <View style={styles.exerciseNumber}>
                  <Text style={styles.exerciseNumberText}>{index + 1}</Text>
                </View>
                <View style={styles.exerciseContent}>
                  <View style={styles.exerciseNameRow}>
                    <Text style={styles.exerciseName}>{exercise.name}</Text>
                    <TouchableOpacity onPress={() => showExerciseInfo(exercise.name)} style={styles.infoBtn}>
                      <Ionicons name="help-circle-outline" size={18} color={colors.textMuted} />
                    </TouchableOpacity>
                  </View>
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

            {aiWorkout.tips && aiWorkout.tips.length > 0 && (
              <View style={[styles.tipsCard, shadows.sm]}>
                <Text style={styles.tipsTitle}>Tips</Text>
                {aiWorkout.tips.map((tip, i) => (
                  <Text key={i} style={styles.tipText}>- {tip}</Text>
                ))}
              </View>
            )}

            <Text style={styles.disclaimer}>
              Generated by AI — always check exercises are suitable for your ability level. Your coach's personalised programme takes priority.
            </Text>

            <TouchableOpacity
              style={styles.newSearchBtn}
              onPress={() => { setAiWorkout(null); setSearchQuery(''); }}
              activeOpacity={0.7}
            >
              <Ionicons name="arrow-back" size={18} color={colors.primary} />
              <Text style={styles.newSearchText}>Back to Library</Text>
            </TouchableOpacity>
          </>
        )}

        {/* Loading */}
        {loading && (
          <View style={styles.loadingSection}>
            <ActivityIndicator size="large" color={colors.accent} />
            <Text style={styles.loadingText}>Generating your workout...</Text>
          </View>
        )}

        {/* Local library results */}
        {!aiWorkout && !loading && (
          <>
            <Text style={styles.sectionTitle}>
              {filteredWorkouts.length} workout{filteredWorkouts.length !== 1 ? 's' : ''} found
            </Text>

            {filteredWorkouts.length === 0 ? (
              <View style={styles.emptyState}>
                <Ionicons name="search-outline" size={40} color={colors.textMuted} />
                <Text style={styles.emptyText}>No workouts found in the library</Text>
                <Text style={styles.emptySubtext}>Try a different search or ask AI to generate one.</Text>
                <TouchableOpacity
                  style={styles.askAiBtn}
                  onPress={handleAISearch}
                  activeOpacity={0.7}
                >
                  <Ionicons name="sparkles" size={16} color="#fff" />
                  <Text style={styles.askAiBtnText}>Ask AI</Text>
                </TouchableOpacity>
              </View>
            ) : (
              filteredWorkouts.map((workout) => {
                const isExpanded = expandedWorkout === workout.id;
                return (
                  <View key={workout.id} style={[styles.libraryCard, shadows.sm]}>
                    <TouchableOpacity
                      style={styles.libraryCardHeader}
                      onPress={() => toggleExpand(workout.id)}
                      activeOpacity={0.7}
                    >
                      <View style={{ flex: 1 }}>
                        <Text style={styles.libraryWorkoutName}>{workout.name}</Text>
                        <View style={styles.libraryMeta}>
                          <View style={styles.metaChip}>
                            <Ionicons name="time-outline" size={10} color={colors.textMuted} />
                            <Text style={styles.metaText}>{workout.duration} min</Text>
                          </View>
                          <View style={styles.metaChip}>
                            <Text style={styles.metaText}>{workout.difficulty}</Text>
                          </View>
                          <View style={styles.metaChip}>
                            <Text style={styles.metaText}>{workout.category}</Text>
                          </View>
                        </View>
                        <Text style={styles.libraryDesc} numberOfLines={isExpanded ? undefined : 2}>
                          {workout.description}
                        </Text>
                      </View>
                      <Ionicons
                        name={isExpanded ? 'chevron-up' : 'chevron-down'}
                        size={20}
                        color={colors.textMuted}
                      />
                    </TouchableOpacity>

                    {isExpanded && (
                      <View style={styles.expandedSection}>
                        {workout.exercises.map((exercise, idx) => (
                          <View key={idx} style={styles.libraryExerciseRow}>
                            <View style={styles.exerciseNumber}>
                              <Text style={styles.exerciseNumberText}>{idx + 1}</Text>
                            </View>
                            <View style={styles.exerciseContent}>
                              <View style={styles.exerciseNameRow}>
                                <Text style={styles.exerciseName}>{exercise.name}</Text>
                                <TouchableOpacity onPress={() => showExerciseInfo(exercise.name)} style={styles.infoBtn}>
                                  <Ionicons name="help-circle-outline" size={18} color={colors.textMuted} />
                                </TouchableOpacity>
                              </View>
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

                        {workout.tips.length > 0 && (
                          <View style={styles.tipsSection}>
                            <Text style={styles.tipsTitle}>Tips</Text>
                            {workout.tips.map((tip, i) => (
                              <Text key={i} style={styles.tipText}>- {tip}</Text>
                            ))}
                          </View>
                        )}
                        {isOwner && (
                          <TouchableOpacity
                            style={{ backgroundColor: colors.primary, borderRadius: borderRadius.md, paddingVertical: spacing.sm + 2, alignItems: 'center', marginTop: spacing.md }}
                            onPress={() => openAssign({ name: workout.name, exercises: workout.exercises })}
                            activeOpacity={0.8}
                          >
                            <Text style={{ color: '#fff', fontWeight: '700', fontSize: fontSize.sm }}>Assign to Client</Text>
                          </TouchableOpacity>
                        )}
                      </View>
                    )}
                  </View>
                );
              })
            )}

            {/* Ask AI fallback button when there are results but user wants more */}
            {filteredWorkouts.length > 0 && (searchQuery.trim() || selectedCategory) && (
              <TouchableOpacity
                style={styles.askAiBtnOutline}
                onPress={handleAISearch}
                activeOpacity={0.7}
              >
                <Ionicons name="sparkles" size={16} color={colors.accent} />
                <Text style={styles.askAiBtnOutlineText}>Want something different? Ask AI</Text>
              </TouchableOpacity>
            )}
          </>
        )}
      </ScrollView>

      {/* Exercise Info Modal */}
      <Modal
        visible={exerciseModal !== null}
        transparent
        animationType="fade"
        onRequestClose={() => setExerciseModal(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{exerciseModal?.name}</Text>
              <TouchableOpacity onPress={() => setExerciseModal(null)}>
                <Ionicons name="close" size={24} color={colors.textMuted} />
              </TouchableOpacity>
            </View>

            <Text style={styles.modalSectionTitle}>How To</Text>
            <Text style={styles.modalText}>{exerciseModal?.howTo}</Text>

            <Text style={styles.modalSectionTitle}>Muscles Worked</Text>
            <View style={styles.muscleChips}>
              {exerciseModal?.muscles.map((muscle, i) => (
                <View key={i} style={styles.muscleChip}>
                  <Text style={styles.muscleChipText}>{muscle}</Text>
                </View>
              ))}
            </View>

            <TouchableOpacity
              style={styles.modalCloseBtn}
              onPress={() => setExerciseModal(null)}
              activeOpacity={0.7}
            >
              <Text style={styles.modalCloseBtnText}>Got it</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Assign to Client Modal */}
      <Modal visible={showAssign} transparent animationType="fade" onRequestClose={() => setShowAssign(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Assign to Client</Text>
              <TouchableOpacity onPress={() => setShowAssign(false)}>
                <Ionicons name="close" size={22} color={colors.textMuted} />
              </TouchableOpacity>
            </View>
            <Text style={{ color: colors.textSecondary, fontSize: fontSize.sm, marginBottom: spacing.md }}>
              Assign "{assignWorkout?.name}" ({assignWorkout?.exercises.length} exercises) as a client's workout programme.
            </Text>
            <Text style={{ color: colors.textMuted, fontSize: fontSize.xs, marginBottom: spacing.sm }}>Select Client</Text>
            <ScrollView style={{ maxHeight: 200, marginBottom: spacing.md }}>
              {clients.map((c) => (
                <TouchableOpacity
                  key={c.uid}
                  style={{ flexDirection: 'row', alignItems: 'center', padding: spacing.sm, borderRadius: borderRadius.sm, backgroundColor: selectedClient === c.uid ? colors.primary + '20' : 'transparent', marginBottom: spacing.xs }}
                  onPress={() => setSelectedClient(c.uid)}
                >
                  <View style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: selectedClient === c.uid ? colors.primary : colors.surfaceLight, justifyContent: 'center', alignItems: 'center', marginRight: spacing.sm }}>
                    <Text style={{ color: selectedClient === c.uid ? '#fff' : colors.textMuted, fontWeight: '700', fontSize: fontSize.sm }}>{c.name.charAt(0)}</Text>
                  </View>
                  <Text style={{ color: selectedClient === c.uid ? colors.primary : colors.text, fontWeight: '600', fontSize: fontSize.sm }}>{c.name}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <Text style={{ color: colors.warning, fontSize: fontSize.xs, marginBottom: spacing.md }}>This will replace the client's current programme.</Text>
            <TouchableOpacity
              style={{ backgroundColor: colors.primary, borderRadius: borderRadius.md, paddingVertical: spacing.sm + 2, alignItems: 'center', opacity: assigning || !selectedClient ? 0.5 : 1 }}
              onPress={assignToClient}
              disabled={assigning || !selectedClient}
            >
              <Text style={{ color: '#fff', fontWeight: '700', fontSize: fontSize.md }}>{assigning ? 'Sending...' : 'Assign Programme'}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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

  searchRow: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.sm },
  searchInput: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: spacing.sm, backgroundColor: colors.surface, borderRadius: borderRadius.md, paddingHorizontal: spacing.md, borderWidth: 1, borderColor: colors.border },
  searchText: { flex: 1, color: colors.text, fontSize: fontSize.sm, paddingVertical: spacing.sm + 2 },

  categoryScroll: { marginBottom: spacing.md },
  categoryRow: { flexDirection: 'row', gap: spacing.xs, paddingRight: spacing.md },
  categoryChip: { paddingHorizontal: spacing.md, paddingVertical: spacing.xs + 2, borderRadius: borderRadius.full, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border },
  categoryChipActive: { backgroundColor: colors.primary + '20', borderColor: colors.primary },
  categoryChipText: { color: colors.textSecondary, fontSize: fontSize.xs, fontWeight: '600' },
  categoryChipTextActive: { color: colors.primary },

  sectionTitle: { color: colors.textMuted, fontSize: fontSize.sm, fontWeight: '700', marginBottom: spacing.sm },

  emptyState: { alignItems: 'center', paddingVertical: spacing.xl },
  emptyText: { color: colors.textMuted, fontSize: fontSize.md, fontWeight: '600', marginTop: spacing.sm },
  emptySubtext: { color: colors.textMuted, fontSize: fontSize.sm, marginTop: spacing.xs, marginBottom: spacing.md, textAlign: 'center' },

  askAiBtn: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, backgroundColor: colors.accent, borderRadius: borderRadius.md, paddingHorizontal: spacing.lg, paddingVertical: spacing.sm + 2 },
  askAiBtnText: { color: '#fff', fontWeight: '700', fontSize: fontSize.sm },

  askAiBtnOutline: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.sm, paddingVertical: spacing.md, backgroundColor: colors.surface, borderRadius: borderRadius.md, borderWidth: 1, borderColor: colors.accent + '40', marginTop: spacing.sm },
  askAiBtnOutlineText: { color: colors.accent, fontWeight: '600', fontSize: fontSize.sm },

  // Library workout card
  libraryCard: { backgroundColor: colors.surface, borderRadius: borderRadius.lg, marginBottom: spacing.sm, overflow: 'hidden' },
  libraryCardHeader: { flexDirection: 'row', alignItems: 'center', padding: spacing.md },
  libraryWorkoutName: { color: colors.text, fontSize: fontSize.md, fontWeight: '700', marginBottom: spacing.xs },
  libraryMeta: { flexDirection: 'row', gap: spacing.xs, marginBottom: spacing.xs },
  libraryDesc: { color: colors.textSecondary, fontSize: fontSize.sm, lineHeight: 20 },

  expandedSection: { paddingHorizontal: spacing.md, paddingBottom: spacing.md, borderTopWidth: 1, borderTopColor: colors.border, paddingTop: spacing.sm },
  libraryExerciseRow: { flexDirection: 'row', marginBottom: spacing.sm },

  // AI label
  aiLabel: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs, marginBottom: spacing.sm },
  aiLabelText: { color: colors.accent, fontSize: fontSize.xs, fontWeight: '700' },

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
  exerciseNameRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  exerciseName: { color: colors.text, fontSize: fontSize.md, fontWeight: '700', marginBottom: spacing.xs, flex: 1 },
  infoBtn: { padding: spacing.xs },
  metaRow: { flexDirection: 'row', gap: spacing.xs },
  metaChip: { flexDirection: 'row', alignItems: 'center', gap: 2, backgroundColor: colors.surfaceLight, paddingHorizontal: spacing.sm, paddingVertical: 2, borderRadius: borderRadius.sm },
  metaText: { color: colors.textMuted, fontSize: fontSize.xs, fontWeight: '600' },
  exerciseNotes: { color: colors.accent, fontSize: fontSize.xs, fontStyle: 'italic', marginTop: spacing.xs },

  tipsCard: { backgroundColor: colors.surface, borderRadius: borderRadius.lg, padding: spacing.md, marginTop: spacing.sm, marginBottom: spacing.md },
  tipsSection: { marginTop: spacing.sm, paddingTop: spacing.sm, borderTopWidth: 1, borderTopColor: colors.border },
  tipsTitle: { color: colors.text, fontSize: fontSize.md, fontWeight: '700', marginBottom: spacing.sm },
  tipText: { color: colors.textSecondary, fontSize: fontSize.sm, marginBottom: spacing.xs },

  disclaimer: { color: colors.textMuted, fontSize: fontSize.xs, textAlign: 'center', marginVertical: spacing.md, lineHeight: 16 },

  newSearchBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.sm, paddingVertical: spacing.md, backgroundColor: colors.surface, borderRadius: borderRadius.md },
  newSearchText: { color: colors.primary, fontWeight: '700', fontSize: fontSize.sm },

  // Exercise Info Modal
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', padding: spacing.lg },
  modalContent: { backgroundColor: colors.surface, borderRadius: borderRadius.lg, padding: spacing.lg },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.md },
  modalTitle: { color: colors.text, fontSize: fontSize.lg, fontWeight: '700', flex: 1 },
  modalSectionTitle: { color: colors.primary, fontSize: fontSize.sm, fontWeight: '700', marginBottom: spacing.xs, marginTop: spacing.sm },
  modalText: { color: colors.textSecondary, fontSize: fontSize.sm, lineHeight: 20 },
  muscleChips: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.xs },
  muscleChip: { backgroundColor: colors.primary + '20', paddingHorizontal: spacing.sm, paddingVertical: spacing.xs, borderRadius: borderRadius.full },
  muscleChipText: { color: colors.primary, fontSize: fontSize.xs, fontWeight: '600' },
  modalCloseBtn: { marginTop: spacing.lg, backgroundColor: colors.primary, borderRadius: borderRadius.md, paddingVertical: spacing.sm + 2, alignItems: 'center' },
  modalCloseBtnText: { color: '#fff', fontWeight: '700', fontSize: fontSize.md },
});
