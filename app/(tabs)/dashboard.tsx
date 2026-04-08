import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useFocusEffect } from 'expo-router';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../lib/firebase';
import { GradientCard } from '../../components/ui/GradientCard';
import { ProgressRing } from '../../components/ui/ProgressRing';
import { InactiveGate } from '../../components/ui/InactiveGate';
import { colors, spacing, fontSize, borderRadius, shadows, gradients } from '../../components/ui/theme';

const DEFAULT_CALORIE_TARGET = 2200;

export default function DashboardScreen() {
  const { profile, isOwner } = useAuth();
  const [refreshing, setRefreshing] = useState(false);
  const [clientCount, setClientCount] = useState(0);
  const [todayCalories, setTodayCalories] = useState(0);
  const [todayProtein, setTodayProtein] = useState(0);
  const [mealsCompleted, setMealsCompleted] = useState(0);
  const [totalMeals, setTotalMeals] = useState(0);
  const [waterProgress, setWaterProgress] = useState(0);
  const [calorieTarget, setCalorieTarget] = useState(DEFAULT_CALORIE_TARGET);
  const [clientStatuses, setClientStatuses] = useState<{ name: string; mealsCompleted: number; totalMeals: number; waterDone: boolean; checkedIn: boolean }[]>([]);

  const today = new Date().toISOString().split('T')[0];
  const greeting = getGreeting();

  useFocusEffect(
    useCallback(() => {
      loadDashboardData();
    }, [profile])
  );

  async function loadDashboardData() {
    try {
      if (isOwner) {
        const usersSnap = await getDocs(
          query(collection(db, 'users'), where('role', '==', 'client'))
        );
        setClientCount(usersSnap.size);
      }

      if (profile) {
        const entriesSnap = await getDocs(
          collection(db, 'users', profile.uid, 'foodLog', today, 'entries')
        );
        let totalCal = 0;
        let totalPro = 0;
        entriesSnap.forEach((doc) => {
          totalCal += doc.data().calories || 0;
          totalPro += doc.data().protein || 0;
        });
        setTodayCalories(totalCal);
        setTodayProtein(totalPro);

        // Load calorie target from user settings or meal plan
        try {
          const settingsDoc = await getDoc(doc(db, 'users', profile.uid, 'settings', 'nutritionTargets'));
          if (settingsDoc.exists() && settingsDoc.data().calories) {
            setCalorieTarget(settingsDoc.data().calories);
          } else {
            const planDoc = await getDoc(doc(db, 'users', profile.uid, 'mealPlan', 'current'));
            if (planDoc.exists() && planDoc.data().calorieTarget) {
              setCalorieTarget(planDoc.data().calorieTarget);
            }
          }
        } catch { /* keep default */ }

        // Load meal plan progress
        try {
          const planDoc = await getDoc(doc(db, 'users', profile.uid, 'mealPlan', 'current'));
          const progressDoc = await getDoc(doc(db, 'users', profile.uid, 'dailyProgress', today));
          if (planDoc.exists()) {
            const plan = planDoc.data();
            setTotalMeals(plan.meals?.length || 0);
          }
          if (progressDoc.exists()) {
            const prog = progressDoc.data();
            setMealsCompleted((prog.mealsCompleted || []).filter(Boolean).length);
            const waterTarget = Math.round((planDoc.exists() ? planDoc.data().waterTargetLitres || 3 : 3) / 0.5);
            setWaterProgress((prog.waterGlasses || 0) / waterTarget);
          }
        } catch { /* silent */ }
      }

      // Coach: load all client statuses
      if (isOwner) {
        try {
          const usersSnap = await getDocs(query(collection(db, 'users'), where('role', '==', 'client')));
          const statuses: typeof clientStatuses = [];
          for (const userDoc of usersSnap.docs) {
            const userData = userDoc.data();
            let mc = 0, tm = 0, wd = false, ci = false;
            try {
              const planDoc = await getDoc(doc(db, 'users', userDoc.id, 'mealPlan', 'current'));
              const progDoc = await getDoc(doc(db, 'users', userDoc.id, 'dailyProgress', today));
              if (planDoc.exists()) tm = planDoc.data().meals?.length || 0;
              if (progDoc.exists()) {
                mc = (progDoc.data().mealsCompleted || []).filter(Boolean).length;
                const wTarget = Math.round((planDoc.exists() ? planDoc.data().waterTargetLitres || 3 : 3) / 0.5);
                wd = (progDoc.data().waterGlasses || 0) >= wTarget;
              }
            } catch { /* silent */ }
            statuses.push({ name: userData.name, mealsCompleted: mc, totalMeals: tm, waterDone: wd, checkedIn: ci });
          }
          setClientStatuses(statuses);
        } catch { /* silent */ }
      }
    } catch (err) {
      // Silently handle
    }
  }

  const onRefresh = async () => {
    setRefreshing(true);
    await loadDashboardData();
    setRefreshing(false);
  };

  const calorieProgress = Math.min(todayCalories / calorieTarget, 1);

  return (
    <InactiveGate>
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />}
    >
      {/* Welcome Header */}
      <View style={styles.welcomeRow}>
        <View style={{ flex: 1 }}>
          <Text style={styles.greeting}>{greeting}</Text>
          <Text style={styles.name}>{profile?.name || 'User'}</Text>
        </View>
        <Image
          source={require('../../assets/logo.png')}
          style={styles.headerLogo}
          resizeMode="contain"
        />
      </View>

      {/* Motivational Status Banner (Client) */}
      {!isOwner && totalMeals > 0 && (
        <View style={[styles.motivationBanner, shadows.sm]}>
          <LinearGradient
            colors={mealsCompleted >= totalMeals && waterProgress >= 1
              ? [colors.success + '30', colors.success + '10']
              : [colors.primary + '20', colors.accent + '10']}
            style={styles.motivationGradient}
          >
            <Text style={styles.motivationEmoji}>
              {mealsCompleted >= totalMeals && waterProgress >= 1 ? '🏆' :
               mealsCompleted >= totalMeals ? '💪' :
               mealsCompleted > 0 ? '🔥' : '👋'}
            </Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.motivationText}>
                {mealsCompleted >= totalMeals && waterProgress >= 1
                  ? "Amazing! You've smashed today's plan!"
                  : mealsCompleted >= totalMeals
                  ? 'All meals done! Just hit your water target!'
                  : mealsCompleted > 0
                  ? `${mealsCompleted}/${totalMeals} meals done - keep going!`
                  : "Let's get started - tick off your first meal!"}
              </Text>
            </View>
          </LinearGradient>
        </View>
      )}

      {/* Coach Client Overview */}
      {isOwner && clientStatuses.length > 0 && (
        <View style={[styles.coachOverview, shadows.sm]}>
          <Text style={styles.coachOverviewTitle}>Today's Client Activity</Text>
          {clientStatuses.map((client, i) => (
            <View key={i} style={styles.clientStatusRow}>
              <View style={styles.clientStatusAvatar}>
                <Text style={styles.clientStatusAvatarText}>{client.name.charAt(0)}</Text>
              </View>
              <Text style={styles.clientStatusName} numberOfLines={1}>{client.name}</Text>
              <View style={styles.clientStatusBadges}>
                <View style={[styles.statusMini, { backgroundColor: client.mealsCompleted > 0 ? colors.success + '20' : colors.surfaceLight }]}>
                  <Text style={[styles.statusMiniText, { color: client.mealsCompleted > 0 ? colors.success : colors.textMuted }]}>
                    {client.mealsCompleted}/{client.totalMeals}
                  </Text>
                </View>
                <Ionicons
                  name={client.waterDone ? 'water' : 'water-outline'}
                  size={16}
                  color={client.waterDone ? colors.success : colors.textMuted}
                />
              </View>
            </View>
          ))}
        </View>
      )}

      {/* Main Calorie Card */}
      <GradientCard
        gradientColors={[colors.primary + '80', colors.accent + '60']}
        glowColor={colors.primary}
        style={styles.calorieCard}
      >
        <View style={styles.calorieContent}>
          <ProgressRing
            progress={calorieProgress}
            size={110}
            strokeWidth={10}
            color={calorieProgress >= 1 ? colors.success : colors.primary}
            value={String(todayCalories)}
            label="kcal"
          />
          <View style={styles.calorieInfo}>
            <Text style={styles.calorieTitle}>Daily Calories</Text>
            <View style={styles.calorieRow}>
              <Text style={styles.calorieTarget}>Target: {calorieTarget}</Text>
            </View>
            <View style={styles.calorieRow}>
              <Text style={styles.calorieRemaining}>
                {calorieTarget - todayCalories > 0
                  ? `${calorieTarget - todayCalories} remaining`
                  : 'Target reached!'}
              </Text>
            </View>
            <View style={styles.proteinBadge}>
              <Ionicons name="fitness" size={14} color={colors.primary} />
              <Text style={styles.proteinText}>{todayProtein.toFixed(0)}g protein</Text>
            </View>
          </View>
        </View>
      </GradientCard>

      {/* Stats Row */}
      <View style={styles.statsRow}>
        <View style={[styles.statCard, shadows.sm]}>
          <LinearGradient
            colors={[colors.success + '20', 'transparent']}
            style={styles.statGradient}
          >
            <Ionicons name="calendar" size={24} color={colors.success} />
            <Text style={styles.statValue}>{profile?.checkInDay?.slice(0, 3) || 'Mon'}</Text>
            <Text style={styles.statLabel}>Check-in</Text>
          </LinearGradient>
        </View>

        {isOwner && (
          <TouchableOpacity
            style={[styles.statCard, shadows.sm]}
            onPress={() => router.push('/admin/clients')}
          >
            <LinearGradient
              colors={[colors.primary + '20', 'transparent']}
              style={styles.statGradient}
            >
              <Ionicons name="people" size={24} color={colors.primary} />
              <Text style={styles.statValue}>{clientCount}</Text>
              <Text style={styles.statLabel}>Clients</Text>
            </LinearGradient>
          </TouchableOpacity>
        )}

        {!isOwner && (
          <View style={[styles.statCard, shadows.sm]}>
            <LinearGradient
              colors={[colors.accent + '20', 'transparent']}
              style={styles.statGradient}
            >
              <Ionicons name="flame" size={24} color={colors.accent} />
              <Text style={styles.statValue}>{Math.round(calorieProgress * 100)}%</Text>
              <Text style={styles.statLabel}>Goal</Text>
            </LinearGradient>
          </View>
        )}
      </View>

      {/* Quick Actions */}
      <Text style={styles.sectionTitle}>Quick Actions</Text>

      <View style={styles.actionsGrid}>
        <TouchableOpacity
          style={[styles.actionCard, shadows.sm]}
          onPress={() => router.push('/(tabs)/myplan')}
          activeOpacity={0.7}
        >
          <LinearGradient
            colors={[colors.success + '25', colors.success + '05']}
            style={styles.actionGradient}
          >
            <View style={styles.actionIconWrap}>
              <Ionicons name="clipboard" size={26} color={colors.success} />
            </View>
            <Text style={styles.actionText}>My Plan</Text>
            <Text style={styles.actionSubtext}>Today's meals</Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionCard, shadows.sm]}
          onPress={() => router.push('/workouts')}
          activeOpacity={0.7}
        >
          <LinearGradient
            colors={[colors.primary + '25', colors.primary + '05']}
            style={styles.actionGradient}
          >
            <View style={styles.actionIconWrap}>
              <Ionicons name="barbell" size={26} color={colors.primary} />
            </View>
            <Text style={styles.actionText}>Workouts</Text>
            <Text style={styles.actionSubtext}>Training programme</Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionCard, shadows.sm]}
          onPress={() => router.push('/cardio')}
          activeOpacity={0.7}
        >
          <LinearGradient
            colors={[colors.accent + '25', colors.accent + '05']}
            style={styles.actionGradient}
          >
            <View style={styles.actionIconWrap}>
              <Ionicons name="footsteps" size={26} color={colors.accent} />
            </View>
            <Text style={styles.actionText}>Cardio & Steps</Text>
            <Text style={styles.actionSubtext}>Log activity</Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionCard, shadows.sm]}
          onPress={() => router.push('/goals')}
          activeOpacity={0.7}
        >
          <LinearGradient
            colors={[colors.warning + '25', colors.warning + '05']}
            style={styles.actionGradient}
          >
            <View style={styles.actionIconWrap}>
              <Ionicons name="trophy" size={26} color={colors.warning} />
            </View>
            <Text style={styles.actionText}>Goals</Text>
            <Text style={styles.actionSubtext}>Weight target</Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionCard, shadows.sm]}
          onPress={() => router.push('/(tabs)/messages')}
          activeOpacity={0.7}
        >
          <LinearGradient
            colors={['#8b5cf6' + '25', '#8b5cf6' + '05']}
            style={styles.actionGradient}
          >
            <View style={styles.actionIconWrap}>
              <Ionicons name="chatbubble" size={26} color="#8b5cf6" />
            </View>
            <Text style={styles.actionText}>Messages</Text>
            <Text style={styles.actionSubtext}>Chat with coach</Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionCard, shadows.sm]}
          onPress={() => router.push('/progress-photos')}
          activeOpacity={0.7}
        >
          <LinearGradient
            colors={[colors.success + '15', colors.success + '05']}
            style={styles.actionGradient}
          >
            <View style={styles.actionIconWrap}>
              <Ionicons name="camera" size={26} color={colors.success} />
            </View>
            <Text style={styles.actionText}>Photos</Text>
            <Text style={styles.actionSubtext}>Track progress</Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionCard, shadows.sm]}
          onPress={() => router.push('/communities')}
          activeOpacity={0.7}
        >
          <LinearGradient
            colors={[colors.primary + '20', colors.accent + '10']}
            style={styles.actionGradient}
          >
            <View style={styles.actionIconWrap}>
              <Ionicons name="people" size={26} color={colors.primary} />
            </View>
            <Text style={styles.actionText}>Communities</Text>
            <Text style={styles.actionSubtext}>Group chats</Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionCard, shadows.sm]}
          onPress={() => router.push('/workout-ideas')}
          activeOpacity={0.7}
        >
          <LinearGradient
            colors={[colors.warning + '20', colors.accent + '10']}
            style={styles.actionGradient}
          >
            <View style={styles.actionIconWrap}>
              <Ionicons name="sparkles" size={26} color={colors.warning} />
            </View>
            <Text style={styles.actionText}>Workout Ideas</Text>
            <Text style={styles.actionSubtext}>Browse workouts</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {isOwner && (
        <>
          <Text style={styles.sectionTitle}>Admin</Text>
          <TouchableOpacity
            style={[styles.adminCard, shadows.md]}
            onPress={() => router.push('/admin/clients')}
            activeOpacity={0.7}
          >
            <LinearGradient
              colors={[colors.primary + '30', colors.accent + '15']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.adminGradient}
            >
              <Ionicons name="shield-checkmark" size={32} color={colors.primary} />
              <View style={{ flex: 1, marginLeft: spacing.md }}>
                <Text style={styles.adminTitle}>Coach Panel</Text>
                <Text style={styles.adminSubtext}>View progress, set targets, send notifications</Text>
              </View>
              <Ionicons name="chevron-forward" size={22} color={colors.textMuted} />
            </LinearGradient>
          </TouchableOpacity>
        </>
      )}
    </ScrollView>
    </InactiveGate>
  );
}

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good Morning';
  if (hour < 18) return 'Good Afternoon';
  return 'Good Evening';
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  welcomeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  greeting: {
    color: colors.textSecondary,
    fontSize: fontSize.md,
  },
  name: {
    color: colors.text,
    fontSize: fontSize.hero,
    fontWeight: '800',
    marginTop: spacing.xs,
  },
  headerLogo: {
    width: 56,
    height: 56,
  },
  // Motivation banner
  motivationBanner: { borderRadius: borderRadius.lg, overflow: 'hidden', marginBottom: spacing.md },
  motivationGradient: { flexDirection: 'row', alignItems: 'center', padding: spacing.md, gap: spacing.md },
  motivationEmoji: { fontSize: 28 },
  motivationText: { color: colors.text, fontSize: fontSize.sm, fontWeight: '600', lineHeight: 20 },

  // Coach overview
  coachOverview: { backgroundColor: colors.surface, borderRadius: borderRadius.lg, padding: spacing.md, marginBottom: spacing.md },
  coachOverviewTitle: { color: colors.text, fontSize: fontSize.md, fontWeight: '700', marginBottom: spacing.md },
  clientStatusRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: spacing.sm, borderBottomWidth: 1, borderBottomColor: colors.border },
  clientStatusAvatar: { width: 28, height: 28, borderRadius: 14, backgroundColor: colors.primary + '30', justifyContent: 'center', alignItems: 'center', marginRight: spacing.sm },
  clientStatusAvatarText: { color: colors.primary, fontSize: fontSize.xs, fontWeight: '700' },
  clientStatusName: { flex: 1, color: colors.text, fontSize: fontSize.sm, fontWeight: '500' },
  clientStatusBadges: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  statusMini: { paddingHorizontal: spacing.sm, paddingVertical: 2, borderRadius: borderRadius.sm },
  statusMiniText: { fontSize: fontSize.xs, fontWeight: '700' },

  calorieCard: {
    marginBottom: spacing.md,
  },
  calorieContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  calorieInfo: {
    flex: 1,
    marginLeft: spacing.lg,
  },
  calorieTitle: {
    color: colors.text,
    fontSize: fontSize.lg,
    fontWeight: '700',
    marginBottom: spacing.xs,
  },
  calorieRow: {
    marginBottom: 4,
  },
  calorieTarget: {
    color: colors.textSecondary,
    fontSize: fontSize.sm,
  },
  calorieRemaining: {
    color: colors.textMuted,
    fontSize: fontSize.sm,
  },
  proteinBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary + '15',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
    alignSelf: 'flex-start',
    marginTop: spacing.sm,
    gap: 4,
  },
  proteinText: {
    color: colors.primary,
    fontSize: fontSize.xs,
    fontWeight: '700',
  },
  statsRow: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
  },
  statGradient: {
    padding: spacing.md,
    alignItems: 'center',
  },
  statValue: {
    color: colors.text,
    fontSize: fontSize.xl,
    fontWeight: '800',
    marginTop: spacing.xs,
  },
  statLabel: {
    color: colors.textMuted,
    fontSize: fontSize.xs,
    marginTop: 2,
  },
  sectionTitle: {
    color: colors.text,
    fontSize: fontSize.lg,
    fontWeight: '700',
    marginTop: spacing.md,
    marginBottom: spacing.md,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  actionCard: {
    width: '47%',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
  },
  actionGradient: {
    padding: spacing.lg,
    alignItems: 'center',
  },
  actionIconWrap: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  actionText: {
    color: colors.text,
    fontSize: fontSize.sm,
    fontWeight: '700',
  },
  actionSubtext: {
    color: colors.textMuted,
    fontSize: fontSize.xs,
    marginTop: 2,
  },
  adminCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
  },
  adminGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.lg,
  },
  adminTitle: {
    color: colors.text,
    fontSize: fontSize.md,
    fontWeight: '700',
  },
  adminSubtext: {
    color: colors.textMuted,
    fontSize: fontSize.xs,
    marginTop: 2,
  },
});
