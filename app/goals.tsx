import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Stack } from 'expo-router';
import { doc, getDoc, setDoc, collection, getDocs, query, orderBy } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import { db } from '../lib/firebase';
import { WeightGoal, WeeklyCheckIn } from '../types';
import { colors, spacing, fontSize, borderRadius, shadows } from '../components/ui/theme';

export default function GoalsScreen() {
  const { profile } = useAuth();
  const [goal, setGoal] = useState<WeightGoal | null>(null);
  const [weightHistory, setWeightHistory] = useState<{ date: string; weight: string }[]>([]);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);

  // Edit form
  const [targetWeight, setTargetWeight] = useState('');
  const [targetDate, setTargetDate] = useState('');
  const [startWeight, setStartWeight] = useState('');
  const [unit, setUnit] = useState<'st' | 'kg'>('st');

  useEffect(() => { loadData(); }, []);

  async function loadData() {
    if (!profile) return;
    try {
      const goalDoc = await getDoc(doc(db, 'users', profile.uid, 'goals', 'weight'));
      if (goalDoc.exists()) {
        const g = goalDoc.data() as WeightGoal;
        setGoal(g);
        setTargetWeight(g.targetWeight);
        setTargetDate(g.targetDate);
        setStartWeight(g.startWeight);
        setUnit(g.unit);
      }

      // Pull weight history from check-ins
      const checkInsSnap = await getDocs(collection(db, 'users', profile.uid, 'checkIns'));
      const history: { date: string; weight: string }[] = [];
      checkInsSnap.forEach((d) => {
        const data = d.data() as WeeklyCheckIn;
        if (data.weightCurrent) {
          history.push({ date: new Date(data.submittedAt).toISOString().split('T')[0], weight: data.weightCurrent });
        }
      });
      history.sort((a, b) => a.date.localeCompare(b.date));
      setWeightHistory(history);
    } catch { /* silent */ }
    finally { setLoading(false); }
  }

  const saveGoal = async () => {
    if (!profile || !targetWeight.trim()) { Alert.alert('Error', 'Enter a target weight'); return; }
    const today = new Date().toISOString().split('T')[0];
    const newGoal: WeightGoal = {
      targetWeight: targetWeight.trim(),
      targetDate: targetDate.trim() || '',
      startWeight: startWeight.trim() || (weightHistory.length > 0 ? weightHistory[0].weight : ''),
      startDate: goal?.startDate || today,
      unit,
    };
    try {
      await setDoc(doc(db, 'users', profile.uid, 'goals', 'weight'), newGoal);
      setGoal(newGoal);
      setEditing(false);
    } catch {
      Alert.alert('Error', 'Failed to save goal');
    }
  };

  // Calculate progress
  const parseWeight = (w: string): number => {
    // Handle "17st 13lbs" or "113kg" or "82.5"
    const stMatch = w.match(/(\d+)\s*st\s*(\d+)?/i);
    if (stMatch) return parseInt(stMatch[1]) * 14 + (parseInt(stMatch[2]) || 0); // convert to lbs
    const kgMatch = w.match(/([\d.]+)\s*kg/i);
    if (kgMatch) return parseFloat(kgMatch[1]) * 2.205; // convert to lbs
    return parseFloat(w) || 0;
  };

  const startLbs = goal ? parseWeight(goal.startWeight) : 0;
  const targetLbs = goal ? parseWeight(goal.targetWeight) : 0;
  const currentLbs = weightHistory.length > 0 ? parseWeight(weightHistory[weightHistory.length - 1].weight) : startLbs;
  const totalToLose = startLbs - targetLbs;
  const lost = startLbs - currentLbs;
  const progressPercent = totalToLose > 0 ? Math.min(Math.max(lost / totalToLose, 0), 1) : 0;

  const daysRemaining = goal?.targetDate
    ? Math.max(0, Math.ceil((new Date(goal.targetDate).getTime() - Date.now()) / 86400000))
    : null;

  return (
    <>
      <Stack.Screen options={{ headerShown: true, title: 'Goals', headerStyle: { backgroundColor: colors.secondary }, headerTintColor: colors.text }} />
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>

        {!goal && !editing ? (
          <View style={styles.emptyState}>
            <Ionicons name="trophy-outline" size={64} color={colors.textMuted} />
            <Text style={styles.emptyTitle}>Set Your Goal</Text>
            <Text style={styles.emptySubtext}>Set a weight target to track your progress</Text>
            <TouchableOpacity style={[styles.setGoalButton, shadows.md]} onPress={() => setEditing(true)} activeOpacity={0.8}>
              <LinearGradient colors={[colors.primary, colors.primaryDark]} style={styles.setGoalGradient}>
                <Text style={styles.setGoalText}>Set Weight Goal</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        ) : editing ? (
          <View style={[styles.editCard, shadows.sm]}>
            <Text style={styles.editTitle}>Set Your Weight Goal</Text>

            <View style={styles.unitToggle}>
              <TouchableOpacity style={[styles.unitBtn, unit === 'st' && styles.unitBtnActive]} onPress={() => setUnit('st')}>
                <Text style={[styles.unitText, unit === 'st' && styles.unitTextActive]}>Stone</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.unitBtn, unit === 'kg' && styles.unitBtnActive]} onPress={() => setUnit('kg')}>
                <Text style={[styles.unitText, unit === 'kg' && styles.unitTextActive]}>KG</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.label}>Current / Starting Weight</Text>
            <TextInput style={styles.input} value={startWeight} onChangeText={setStartWeight}
              placeholder={unit === 'st' ? 'e.g. 17st 13lbs' : 'e.g. 113kg'} placeholderTextColor={colors.textMuted} />

            <Text style={styles.label}>Target Weight</Text>
            <TextInput style={styles.input} value={targetWeight} onChangeText={setTargetWeight}
              placeholder={unit === 'st' ? 'e.g. 13st' : 'e.g. 82kg'} placeholderTextColor={colors.textMuted} />

            <Text style={styles.label}>Target Date (optional)</Text>
            <TextInput style={styles.input} value={targetDate} onChangeText={setTargetDate}
              placeholder="YYYY-MM-DD e.g. 2026-06-01" placeholderTextColor={colors.textMuted} />

            <View style={styles.editButtons}>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => setEditing(false)}>
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveBtn} onPress={saveGoal}>
                <Text style={styles.saveBtnText}>Save Goal</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <>
            {/* Goal Progress Card */}
            <View style={[styles.goalCard, shadows.md]}>
              <LinearGradient
                colors={[colors.primary + '30', colors.accent + '10', 'transparent']}
                style={styles.goalGradient}
              >
                <View style={styles.goalHeader}>
                  <Ionicons name="trophy" size={28} color={colors.warning} />
                  <TouchableOpacity onPress={() => setEditing(true)}>
                    <Ionicons name="create-outline" size={20} color={colors.textMuted} />
                  </TouchableOpacity>
                </View>

                <Text style={styles.goalTarget}>Target: {goal?.targetWeight}</Text>
                {daysRemaining !== null && (
                  <Text style={styles.goalDeadline}>
                    {daysRemaining > 0 ? `${daysRemaining} days remaining` : 'Target date reached!'}
                  </Text>
                )}

                {/* Progress bar */}
                <View style={styles.goalProgressSection}>
                  <View style={styles.goalProgressLabels}>
                    <Text style={styles.goalProgressStart}>{goal?.startWeight}</Text>
                    <Text style={styles.goalProgressEnd}>{goal?.targetWeight}</Text>
                  </View>
                  <View style={styles.goalProgressBarBg}>
                    <LinearGradient
                      colors={[colors.primary, colors.success]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      style={[styles.goalProgressBarFill, { width: `${progressPercent * 100}%` }]}
                    />
                  </View>
                  <Text style={styles.goalProgressPercent}>{Math.round(progressPercent * 100)}% there</Text>
                </View>
              </LinearGradient>
            </View>

            {/* Latest Weight */}
            {weightHistory.length > 0 && (
              <View style={[styles.latestCard, shadows.sm]}>
                <Ionicons name="scale" size={22} color={colors.primary} />
                <View style={{ flex: 1, marginLeft: spacing.md }}>
                  <Text style={styles.latestLabel}>Latest Weigh-In</Text>
                  <Text style={styles.latestWeight}>{weightHistory[weightHistory.length - 1].weight}</Text>
                </View>
                <Text style={styles.latestDate}>
                  {new Date(weightHistory[weightHistory.length - 1].date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                </Text>
              </View>
            )}

            {/* Weight History */}
            {weightHistory.length > 1 && (
              <>
                <Text style={styles.sectionTitle}>Weight History</Text>
                {[...weightHistory].reverse().map((entry, i) => (
                  <View key={i} style={styles.historyRow}>
                    <Text style={styles.historyDate}>
                      {new Date(entry.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                    </Text>
                    <Text style={styles.historyWeight}>{entry.weight}</Text>
                  </View>
                ))}
              </>
            )}
          </>
        )}
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.md, paddingBottom: spacing.xxl },
  emptyState: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingTop: spacing.xxl * 2 },
  emptyTitle: { color: colors.text, fontSize: fontSize.xl, fontWeight: '700', marginTop: spacing.lg },
  emptySubtext: { color: colors.textMuted, fontSize: fontSize.sm, marginTop: spacing.sm },
  setGoalButton: { borderRadius: borderRadius.md, overflow: 'hidden', marginTop: spacing.lg },
  setGoalGradient: { paddingHorizontal: spacing.xl, paddingVertical: spacing.md },
  setGoalText: { color: '#fff', fontSize: fontSize.md, fontWeight: '700' },

  editCard: { backgroundColor: colors.surface, borderRadius: borderRadius.lg, padding: spacing.lg },
  editTitle: { color: colors.text, fontSize: fontSize.lg, fontWeight: '700', marginBottom: spacing.md },
  unitToggle: { flexDirection: 'row', backgroundColor: colors.background, borderRadius: borderRadius.md, padding: spacing.xs, marginBottom: spacing.md },
  unitBtn: { flex: 1, paddingVertical: spacing.sm, alignItems: 'center', borderRadius: borderRadius.sm },
  unitBtnActive: { backgroundColor: colors.primary },
  unitText: { color: colors.textMuted, fontWeight: '600', fontSize: fontSize.sm },
  unitTextActive: { color: '#fff' },
  label: { color: colors.textSecondary, fontSize: fontSize.sm, fontWeight: '600', marginBottom: spacing.xs, marginTop: spacing.md },
  input: { backgroundColor: colors.inputBackground, borderRadius: borderRadius.md, padding: spacing.md, color: colors.text, fontSize: fontSize.md, borderWidth: 1, borderColor: colors.border },
  editButtons: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.lg },
  cancelBtn: { flex: 1, paddingVertical: spacing.md, borderRadius: borderRadius.md, borderWidth: 1, borderColor: colors.border, alignItems: 'center' },
  cancelBtnText: { color: colors.textSecondary, fontSize: fontSize.md, fontWeight: '600' },
  saveBtn: { flex: 2, paddingVertical: spacing.md, borderRadius: borderRadius.md, backgroundColor: colors.primary, alignItems: 'center' },
  saveBtnText: { color: '#fff', fontSize: fontSize.md, fontWeight: '700' },

  goalCard: { backgroundColor: colors.surface, borderRadius: borderRadius.lg, overflow: 'hidden', marginBottom: spacing.md },
  goalGradient: { padding: spacing.lg },
  goalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.md },
  goalTarget: { color: colors.text, fontSize: fontSize.xxl, fontWeight: '800' },
  goalDeadline: { color: colors.textSecondary, fontSize: fontSize.sm, marginTop: spacing.xs },
  goalProgressSection: { marginTop: spacing.lg },
  goalProgressLabels: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.xs },
  goalProgressStart: { color: colors.textMuted, fontSize: fontSize.xs },
  goalProgressEnd: { color: colors.success, fontSize: fontSize.xs, fontWeight: '700' },
  goalProgressBarBg: { height: 10, backgroundColor: colors.surfaceLight, borderRadius: 5, overflow: 'hidden' },
  goalProgressBarFill: { height: '100%', borderRadius: 5 },
  goalProgressPercent: { color: colors.text, fontSize: fontSize.sm, fontWeight: '700', marginTop: spacing.xs, textAlign: 'center' },

  latestCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface, borderRadius: borderRadius.lg, padding: spacing.lg, marginBottom: spacing.md },
  latestLabel: { color: colors.textMuted, fontSize: fontSize.xs },
  latestWeight: { color: colors.text, fontSize: fontSize.xl, fontWeight: '800' },
  latestDate: { color: colors.textMuted, fontSize: fontSize.xs },

  sectionTitle: { color: colors.text, fontSize: fontSize.lg, fontWeight: '700', marginBottom: spacing.md },
  historyRow: { flexDirection: 'row', justifyContent: 'space-between', backgroundColor: colors.surface, padding: spacing.md, borderRadius: borderRadius.sm, marginBottom: spacing.xs },
  historyDate: { color: colors.textMuted, fontSize: fontSize.sm },
  historyWeight: { color: colors.text, fontSize: fontSize.sm, fontWeight: '700' },
});
