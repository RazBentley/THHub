import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Stack, useLocalSearchParams, router } from 'expo-router';
import { doc, getDoc, collection, getDocs } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { UserProfile, MealPlan, DailyProgress, WeeklyCheckIn, WorkoutProgramme, WeightGoal, DailyCardio } from '../../types';
import { colors, spacing, fontSize, borderRadius, shadows } from '../../components/ui/theme';

export default function ClientProfileScreen() {
  const { uid } = useLocalSearchParams<{ uid: string }>();
  const [client, setClient] = useState<UserProfile | null>(null);
  const [mealPlan, setMealPlan] = useState<MealPlan | null>(null);
  const [todayProgress, setTodayProgress] = useState<DailyProgress | null>(null);
  const [latestCheckIn, setLatestCheckIn] = useState<WeeklyCheckIn | null>(null);
  const [workout, setWorkout] = useState<WorkoutProgramme | null>(null);
  const [goal, setGoal] = useState<WeightGoal | null>(null);
  const [todayCardio, setTodayCardio] = useState<DailyCardio | null>(null);
  const [subStatus, setSubStatus] = useState('inactive');
  const [photoCount, setPhotoCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const today = new Date().toISOString().split('T')[0];

  useEffect(() => { if (uid) loadClientData(); }, [uid]);

  async function loadClientData() {
    if (!uid) return;
    try {
      // Profile
      const userDoc = await getDoc(doc(db, 'users', uid));
      if (userDoc.exists()) setClient(userDoc.data() as UserProfile);

      // Meal plan
      const planDoc = await getDoc(doc(db, 'users', uid, 'mealPlan', 'current'));
      if (planDoc.exists()) setMealPlan(planDoc.data() as MealPlan);

      // Today's progress
      const progDoc = await getDoc(doc(db, 'users', uid, 'dailyProgress', today));
      if (progDoc.exists()) setTodayProgress(progDoc.data() as DailyProgress);

      // Latest check-in
      const ciSnap = await getDocs(collection(db, 'users', uid, 'checkIns'));
      let latest: WeeklyCheckIn | null = null;
      ciSnap.forEach((d) => {
        const ci = d.data() as WeeklyCheckIn;
        if (!latest || ci.submittedAt > latest.submittedAt) latest = ci;
      });
      setLatestCheckIn(latest);

      // Workout
      const workDoc = await getDoc(doc(db, 'users', uid, 'workoutProgramme', 'current'));
      if (workDoc.exists()) setWorkout(workDoc.data() as WorkoutProgramme);

      // Goal
      const goalDoc = await getDoc(doc(db, 'users', uid, 'goals', 'weight'));
      if (goalDoc.exists()) setGoal(goalDoc.data() as WeightGoal);

      // Today's cardio
      const cardioDoc = await getDoc(doc(db, 'users', uid, 'cardioLog', today));
      if (cardioDoc.exists()) setTodayCardio(cardioDoc.data() as DailyCardio);

      // Subscription
      const subDoc = await getDoc(doc(db, 'users', uid, 'subscription', 'current'));
      if (subDoc.exists()) setSubStatus(subDoc.data().status || 'inactive');

      // Photo count
      const photoSnap = await getDocs(collection(db, 'users', uid, 'progressPhotos'));
      setPhotoCount(photoSnap.size);

    } catch { /* silent */ }
    finally { setLoading(false); }
  }

  if (loading || !client) return (
    <>
      <Stack.Screen options={{ title: 'Client Profile', headerStyle: { backgroundColor: colors.secondary }, headerTintColor: colors.text }} />
      <View style={styles.centered}><Text style={styles.loadingText}>Loading...</Text></View>
    </>
  );

  const mealsCompleted = todayProgress ? (todayProgress.mealsCompleted || []).filter(Boolean).length : 0;
  const totalMeals = mealPlan ? mealPlan.meals.length : 0;
  const waterDone = todayProgress ? ((todayProgress.waterGlasses || 0) * 0.5) : 0;
  const waterTarget = mealPlan?.waterTargetLitres || 3;

  const getStatusColor = (s: string) => {
    if (s === 'active') return colors.success;
    if (s === 'past_due') return colors.warning;
    return colors.error;
  };

  return (
    <>
      <Stack.Screen options={{ title: client.name, headerStyle: { backgroundColor: colors.secondary }, headerTintColor: colors.text }} />
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>

        {/* Client Header */}
        <LinearGradient colors={[colors.primary + '25', 'transparent']} style={styles.headerGradient}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{client.name.charAt(0)}</Text>
          </View>
          <Text style={styles.clientName}>{client.name}</Text>
          <Text style={styles.clientEmail}>{client.email}</Text>
          <View style={styles.badgeRow}>
            <View style={[styles.badge, { backgroundColor: getStatusColor(subStatus) + '20' }]}>
              <View style={[styles.badgeDot, { backgroundColor: getStatusColor(subStatus) }]} />
              <Text style={[styles.badgeText, { color: getStatusColor(subStatus) }]}>{subStatus}</Text>
            </View>
            <View style={styles.badge}>
              <Ionicons name="calendar" size={12} color={colors.textMuted} />
              <Text style={styles.badgeText}>Check-in: {client.checkInDay}</Text>
            </View>
          </View>
        </LinearGradient>

        {/* Today's Snapshot */}
        <Text style={styles.sectionTitle}>Today</Text>
        <View style={styles.snapshotRow}>
          <View style={[styles.snapshotCard, shadows.sm]}>
            <Ionicons name="restaurant" size={20} color={mealsCompleted > 0 ? colors.success : colors.textMuted} />
            <Text style={styles.snapshotValue}>{mealsCompleted}/{totalMeals}</Text>
            <Text style={styles.snapshotLabel}>Meals</Text>
          </View>
          <View style={[styles.snapshotCard, shadows.sm]}>
            <Ionicons name="water" size={20} color={waterDone >= waterTarget ? colors.success : colors.textMuted} />
            <Text style={styles.snapshotValue}>{waterDone.toFixed(1)}L</Text>
            <Text style={styles.snapshotLabel}>of {waterTarget}L</Text>
          </View>
          <View style={[styles.snapshotCard, shadows.sm]}>
            <Ionicons name="footsteps" size={20} color={todayCardio ? colors.accent : colors.textMuted} />
            <Text style={styles.snapshotValue}>{todayCardio?.steps?.toLocaleString() || '—'}</Text>
            <Text style={styles.snapshotLabel}>Steps</Text>
          </View>
          <View style={[styles.snapshotCard, shadows.sm]}>
            <Ionicons name="time" size={20} color={todayCardio ? colors.accent : colors.textMuted} />
            <Text style={styles.snapshotValue}>{todayCardio?.cardioMinutes || '—'}</Text>
            <Text style={styles.snapshotLabel}>Cardio min</Text>
          </View>
        </View>

        {/* Latest Check-In Summary */}
        {latestCheckIn && (
          <>
            <Text style={styles.sectionTitle}>Latest Check-In</Text>
            <View style={[styles.checkInSummary, shadows.sm]}>
              <View style={styles.ciRow}>
                <Text style={styles.ciLabel}>Weight</Text>
                <Text style={styles.ciValue}>{latestCheckIn.weightCurrent}</Text>
              </View>
              {latestCheckIn.weightPrevious && (
                <View style={styles.ciRow}>
                  <Text style={styles.ciLabel}>Previous</Text>
                  <Text style={styles.ciValue}>{latestCheckIn.weightPrevious}</Text>
                </View>
              )}
              <View style={styles.ciRow}>
                <Text style={styles.ciLabel}>Sessions Done?</Text>
                <Text style={[styles.ciValue, { color: latestCheckIn.sessionsCompleted ? colors.success : colors.error }]}>
                  {latestCheckIn.sessionsCompleted ? 'Yes' : 'No'}
                </Text>
              </View>
              {latestCheckIn.adherence && (
                <View style={styles.ciRow}>
                  <Text style={styles.ciLabel}>Adherence</Text>
                  <Text style={styles.ciValue}>{latestCheckIn.adherence}</Text>
                </View>
              )}
              {latestCheckIn.wins && (
                <View style={styles.ciRow}>
                  <Text style={styles.ciLabel}>Wins</Text>
                  <Text style={[styles.ciValue, { color: colors.warning }]}>{latestCheckIn.wins}</Text>
                </View>
              )}
              <Text style={styles.ciDate}>
                Submitted: {new Date(latestCheckIn.submittedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
              </Text>
            </View>
          </>
        )}

        {/* Goal */}
        {goal && (
          <>
            <Text style={styles.sectionTitle}>Goal</Text>
            <View style={[styles.goalSummary, shadows.sm]}>
              <Ionicons name="trophy" size={22} color={colors.warning} />
              <View style={{ flex: 1, marginLeft: spacing.md }}>
                <Text style={styles.goalText}>Target: {goal.targetWeight}</Text>
                {goal.targetDate && <Text style={styles.goalDate}>By: {new Date(goal.targetDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</Text>}
              </View>
            </View>
          </>
        )}

        {/* Quick Actions */}
        <Text style={styles.sectionTitle}>Actions</Text>
        <View style={styles.actionsGrid}>
          {[
            { icon: 'chatbubble', color: colors.primary, label: 'Message', onPress: () => router.push('/(tabs)/messages') },
            { icon: 'restaurant', color: colors.success, label: 'Meal Plan', onPress: () => router.push('/admin/mealplans') },
            { icon: 'barbell', color: '#8b5cf6', label: 'Workouts', onPress: () => router.push('/admin/workouts') },
            { icon: 'clipboard', color: '#06b6d4', label: 'Check-Ins', onPress: () => router.push('/admin/checkins') },
            { icon: 'camera', color: colors.accent, label: `Photos (${photoCount})`, onPress: () => {} },
            { icon: 'options', color: colors.warning, label: 'Targets', onPress: () => router.push('/admin/overrides') },
          ].map((action, i) => (
            <TouchableOpacity key={i} style={[styles.actionBtn, shadows.sm]} onPress={action.onPress} activeOpacity={0.7}>
              <View style={[styles.actionIcon, { backgroundColor: action.color + '20' }]}>
                <Ionicons name={action.icon as any} size={20} color={action.color} />
              </View>
              <Text style={styles.actionLabel}>{action.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Info */}
        <View style={[styles.infoCard, shadows.sm]}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Joined</Text>
            <Text style={styles.infoValue}>{new Date(client.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Workout Programme</Text>
            <Text style={styles.infoValue}>{workout?.name || 'Not set'}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Meal Plan</Text>
            <Text style={styles.infoValue}>{mealPlan ? `${mealPlan.meals.length} meals, ${mealPlan.freeCalories} free cal` : 'Not set'}</Text>
          </View>
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { paddingBottom: spacing.xxl },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background },
  loadingText: { color: colors.textMuted, fontSize: fontSize.md },

  headerGradient: { alignItems: 'center', paddingTop: spacing.xl, paddingBottom: spacing.lg },
  avatar: { width: 72, height: 72, borderRadius: 36, backgroundColor: colors.primary, justifyContent: 'center', alignItems: 'center', marginBottom: spacing.md },
  avatarText: { color: '#fff', fontSize: fontSize.xxl, fontWeight: '800' },
  clientName: { color: colors.text, fontSize: fontSize.xl, fontWeight: '700' },
  clientEmail: { color: colors.textMuted, fontSize: fontSize.sm, marginTop: 2 },
  badgeRow: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.md },
  badge: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: colors.surface, paddingHorizontal: spacing.md, paddingVertical: spacing.xs, borderRadius: borderRadius.full },
  badgeDot: { width: 6, height: 6, borderRadius: 3 },
  badgeText: { color: colors.textMuted, fontSize: fontSize.xs, fontWeight: '600', textTransform: 'capitalize' },

  sectionTitle: { color: colors.text, fontSize: fontSize.md, fontWeight: '700', marginTop: spacing.lg, marginBottom: spacing.sm, marginHorizontal: spacing.md },

  snapshotRow: { flexDirection: 'row', gap: spacing.sm, paddingHorizontal: spacing.md },
  snapshotCard: { flex: 1, backgroundColor: colors.surface, borderRadius: borderRadius.md, padding: spacing.sm, alignItems: 'center' },
  snapshotValue: { color: colors.text, fontSize: fontSize.md, fontWeight: '800', marginTop: 4 },
  snapshotLabel: { color: colors.textMuted, fontSize: 10, marginTop: 2 },

  checkInSummary: { backgroundColor: colors.surface, borderRadius: borderRadius.lg, padding: spacing.md, marginHorizontal: spacing.md },
  ciRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: spacing.xs, borderBottomWidth: 1, borderBottomColor: colors.border },
  ciLabel: { color: colors.textMuted, fontSize: fontSize.sm },
  ciValue: { color: colors.text, fontSize: fontSize.sm, fontWeight: '600' },
  ciDate: { color: colors.textMuted, fontSize: fontSize.xs, marginTop: spacing.sm, textAlign: 'right' },

  goalSummary: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface, borderRadius: borderRadius.lg, padding: spacing.md, marginHorizontal: spacing.md },
  goalText: { color: colors.text, fontSize: fontSize.md, fontWeight: '700' },
  goalDate: { color: colors.textMuted, fontSize: fontSize.xs, marginTop: 2 },

  actionsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, paddingHorizontal: spacing.md },
  actionBtn: { width: '31%', backgroundColor: colors.surface, borderRadius: borderRadius.md, padding: spacing.sm, alignItems: 'center' },
  actionIcon: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginBottom: spacing.xs },
  actionLabel: { color: colors.text, fontSize: 10, fontWeight: '600', textAlign: 'center' },

  infoCard: { backgroundColor: colors.surface, borderRadius: borderRadius.lg, padding: spacing.md, marginHorizontal: spacing.md, marginTop: spacing.lg },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: spacing.sm, borderBottomWidth: 1, borderBottomColor: colors.border },
  infoLabel: { color: colors.textMuted, fontSize: fontSize.sm },
  infoValue: { color: colors.text, fontSize: fontSize.sm, fontWeight: '500' },
});
