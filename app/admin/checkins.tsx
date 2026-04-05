import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity, ScrollView, RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Stack } from 'expo-router';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { UserProfile, WeeklyCheckIn } from '../../types';
import { colors, spacing, fontSize, borderRadius, shadows } from '../../components/ui/theme';

interface ClientCheckIn {
  client: UserProfile;
  checkIn: WeeklyCheckIn;
}

export default function AdminCheckInsScreen() {
  const [clients, setClients] = useState<UserProfile[]>([]);
  const [allCheckIns, setAllCheckIns] = useState<ClientCheckIn[]>([]);
  const [selectedCheckIn, setSelectedCheckIn] = useState<ClientCheckIn | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => { loadData(); }, []);

  async function loadData() {
    try {
      const clientSnap = await getDocs(query(collection(db, 'users'), where('role', '==', 'client')));
      const clientList: UserProfile[] = [];
      clientSnap.forEach((d) => clientList.push(d.data() as UserProfile));

      const checkIns: ClientCheckIn[] = [];
      for (const client of clientList) {
        const ciSnap = await getDocs(collection(db, 'users', client.uid, 'checkIns'));
        ciSnap.forEach((d) => {
          checkIns.push({ client, checkIn: d.data() as WeeklyCheckIn });
        });
      }

      // Sort by most recent first
      checkIns.sort((a, b) => (b.checkIn.submittedAt || 0) - (a.checkIn.submittedAt || 0));
      setClients(clientList);
      setAllCheckIns(checkIns);
    } catch { /* silent */ }
    finally { setLoading(false); }
  }

  const onRefresh = async () => { setRefreshing(true); await loadData(); setRefreshing(false); };

  // Detail view
  if (selectedCheckIn) {
    const { client, checkIn } = selectedCheckIn;
    return (
      <>
        <Stack.Screen options={{ title: `${client.name} - Check-In` }} />
        <ScrollView style={styles.container} contentContainerStyle={styles.detailContent}>
          <TouchableOpacity style={styles.backButton} onPress={() => setSelectedCheckIn(null)}>
            <Ionicons name="arrow-back" size={20} color={colors.primary} />
            <Text style={styles.backText}>Back to all check-ins</Text>
          </TouchableOpacity>

          {/* Header */}
          <View style={[styles.detailHeader, shadows.sm]}>
            <View style={styles.detailAvatar}>
              <Text style={styles.detailAvatarText}>{client.name.charAt(0)}</Text>
            </View>
            <View>
              <Text style={styles.detailName}>{client.name}</Text>
              <Text style={styles.detailDate}>
                {checkIn.weekId} - {new Date(checkIn.submittedAt).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })}
              </Text>
            </View>
          </View>

          {/* Body Metrics */}
          <Section icon="scale" color={colors.primary} title="Body Metrics">
            <Field label="Current Weight" value={checkIn.weightCurrent} />
            <Field label="Previous Weight" value={checkIn.weightPrevious} />
            <Field label="Goal" value={checkIn.goal} />
          </Section>

          {/* Recovery */}
          <Section icon="bed" color={colors.success} title="Recovery & Wellness">
            <Field label="Sleep" value={checkIn.sleep} />
            <Field label="Appetite & Digestion" value={checkIn.appetite} />
            <Field label="Energy Levels" value={checkIn.energy} />
            <Field label="Stress" value={checkIn.stress} />
          </Section>

          {/* Training */}
          <Section icon="barbell" color={colors.accent} title="Training">
            <Field label="Gym Performance" value={checkIn.gymPerformance} />
            <Field label="Recovery" value={checkIn.recovery} />
            <View style={styles.fieldRow}>
              <Text style={styles.fieldLabel}>All Sessions Completed?</Text>
              <View style={[styles.yesNoBadge, { backgroundColor: checkIn.sessionsCompleted ? colors.success + '20' : colors.error + '20' }]}>
                <Text style={[styles.yesNoText, { color: checkIn.sessionsCompleted ? colors.success : colors.error }]}>
                  {checkIn.sessionsCompleted ? 'Yes' : 'No'}
                </Text>
              </View>
            </View>
            <Field label="Cardio" value={checkIn.cardio} />
            <Field label="Steps" value={checkIn.steps} />
          </Section>

          {/* Nutrition */}
          <Section icon="nutrition" color={colors.warning} title="Adherence & Nutrition">
            <Field label="Plan Adherence" value={checkIn.adherence} />
            <Field label="Cheat Meal" value={checkIn.cheatMeal} />
          </Section>

          {/* Coaching */}
          <Section icon="chatbubble" color={colors.primary} title="Coaching">
            <Field label="Questions" value={checkIn.questions} />
            <Field label="Other Notes" value={checkIn.otherNotes} />
          </Section>

          {/* Reflection */}
          <Section icon="star" color={colors.warning} title="Reflection">
            <Field label="Wins" value={checkIn.wins} highlight />
            <Field label="Goals Next Week" value={checkIn.goalsNextWeek} />
          </Section>
        </ScrollView>
      </>
    );
  }

  // List view
  return (
    <>
      <Stack.Screen options={{ title: 'Client Check-Ins' }} />
      <FlatList
        style={styles.container}
        data={allCheckIns}
        keyExtractor={(item, i) => `${item.client.uid}-${item.checkIn.weekId}-${i}`}
        contentContainerStyle={styles.list}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="clipboard-outline" size={64} color={colors.textMuted} />
            <Text style={styles.emptyTitle}>{loading ? 'Loading...' : 'No Check-Ins Yet'}</Text>
            <Text style={styles.emptySubtext}>Check-ins from clients will appear here</Text>
          </View>
        }
        renderItem={({ item }) => {
          const { client, checkIn } = item;
          const weightChange = checkIn.weightCurrent && checkIn.weightPrevious
            ? `${checkIn.weightCurrent} (prev: ${checkIn.weightPrevious})`
            : checkIn.weightCurrent || 'Not recorded';

          return (
            <TouchableOpacity
              style={[styles.checkInCard, shadows.sm]}
              onPress={() => setSelectedCheckIn(item)}
              activeOpacity={0.7}
            >
              <View style={styles.cardHeader}>
                <View style={styles.cardAvatar}>
                  <Text style={styles.cardAvatarText}>{client.name.charAt(0)}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.cardName}>{client.name}</Text>
                  <Text style={styles.cardDate}>
                    {new Date(checkIn.submittedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                    {' '}- {checkIn.weekId}
                  </Text>
                </View>
                <View style={[styles.sessionsBadge, { backgroundColor: checkIn.sessionsCompleted ? colors.success + '20' : colors.error + '20' }]}>
                  <Ionicons name={checkIn.sessionsCompleted ? 'checkmark' : 'close'} size={14}
                    color={checkIn.sessionsCompleted ? colors.success : colors.error} />
                </View>
              </View>

              <View style={styles.cardPreview}>
                <View style={styles.previewItem}>
                  <Ionicons name="scale-outline" size={14} color={colors.textMuted} />
                  <Text style={styles.previewText}>{weightChange}</Text>
                </View>
                {checkIn.wins && (
                  <View style={styles.previewItem}>
                    <Ionicons name="star" size={14} color={colors.warning} />
                    <Text style={styles.previewText} numberOfLines={1}>{checkIn.wins}</Text>
                  </View>
                )}
              </View>

              <View style={styles.cardFooter}>
                <Text style={styles.tapToView}>Tap to view full check-in</Text>
                <Ionicons name="chevron-forward" size={16} color={colors.textMuted} />
              </View>
            </TouchableOpacity>
          );
        }}
      />
    </>
  );
}

function Section({ icon, color, title, children }: { icon: string; color: string; title: string; children: React.ReactNode }) {
  return (
    <View style={[sectionStyles.card, shadows.sm]}>
      <View style={sectionStyles.header}>
        <Ionicons name={icon as any} size={20} color={color} />
        <Text style={sectionStyles.title}>{title}</Text>
      </View>
      {children}
    </View>
  );
}

function Field({ label, value, highlight }: { label: string; value?: string; highlight?: boolean }) {
  if (!value) return null;
  return (
    <View style={sectionStyles.field}>
      <Text style={sectionStyles.fieldLabel}>{label}</Text>
      <Text style={[sectionStyles.fieldValue, highlight && { color: colors.warning }]}>{value}</Text>
    </View>
  );
}

const sectionStyles = StyleSheet.create({
  card: { backgroundColor: colors.surface, borderRadius: borderRadius.lg, padding: spacing.md, marginBottom: spacing.md },
  header: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.md, paddingBottom: spacing.sm, borderBottomWidth: 1, borderBottomColor: colors.border },
  title: { color: colors.text, fontSize: fontSize.md, fontWeight: '700' },
  field: { marginBottom: spacing.md },
  fieldLabel: { color: colors.textMuted, fontSize: fontSize.xs, fontWeight: '600', marginBottom: spacing.xs, textTransform: 'uppercase', letterSpacing: 0.5 },
  fieldValue: { color: colors.text, fontSize: fontSize.sm, lineHeight: 22 },
});

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  list: { padding: spacing.md },
  detailContent: { padding: spacing.md, paddingBottom: spacing.xxl },

  backButton: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs, marginBottom: spacing.lg },
  backText: { color: colors.primary, fontSize: fontSize.sm, fontWeight: '600' },

  detailHeader: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface, borderRadius: borderRadius.lg, padding: spacing.lg, marginBottom: spacing.md },
  detailAvatar: { width: 48, height: 48, borderRadius: 24, backgroundColor: colors.primary, justifyContent: 'center', alignItems: 'center', marginRight: spacing.md },
  detailAvatarText: { color: '#fff', fontSize: fontSize.lg, fontWeight: '800' },
  detailName: { color: colors.text, fontSize: fontSize.lg, fontWeight: '700' },
  detailDate: { color: colors.textMuted, fontSize: fontSize.xs, marginTop: 2 },

  fieldRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.md },
  fieldLabel: { color: colors.textMuted, fontSize: fontSize.xs, fontWeight: '600', textTransform: 'uppercase' },
  yesNoBadge: { paddingHorizontal: spacing.md, paddingVertical: spacing.xs, borderRadius: borderRadius.full },
  yesNoText: { fontSize: fontSize.sm, fontWeight: '700' },

  emptyState: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingTop: spacing.xxl * 2 },
  emptyTitle: { color: colors.text, fontSize: fontSize.xl, fontWeight: '700', marginTop: spacing.lg },
  emptySubtext: { color: colors.textMuted, fontSize: fontSize.sm, marginTop: spacing.sm },

  checkInCard: { backgroundColor: colors.surface, borderRadius: borderRadius.lg, padding: spacing.md, marginBottom: spacing.md },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.sm },
  cardAvatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.primary, justifyContent: 'center', alignItems: 'center', marginRight: spacing.md },
  cardAvatarText: { color: '#fff', fontWeight: '700', fontSize: fontSize.md },
  cardName: { color: colors.text, fontSize: fontSize.md, fontWeight: '600' },
  cardDate: { color: colors.textMuted, fontSize: fontSize.xs, marginTop: 2 },
  sessionsBadge: { width: 28, height: 28, borderRadius: 14, justifyContent: 'center', alignItems: 'center' },

  cardPreview: { gap: spacing.xs, marginBottom: spacing.sm },
  previewItem: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  previewText: { color: colors.textSecondary, fontSize: fontSize.xs, flex: 1 },

  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: spacing.sm, borderTopWidth: 1, borderTopColor: colors.border },
  tapToView: { color: colors.textMuted, fontSize: fontSize.xs },
});
