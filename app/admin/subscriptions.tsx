import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Stack } from 'expo-router';
import { collection, query, where, getDocs, doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { UserProfile, Subscription } from '../../types';
import { Button } from '../../components/ui/Button';
import { colors, spacing, fontSize, borderRadius, shadows } from '../../components/ui/theme';

interface ClientSub {
  client: UserProfile;
  subscription: Subscription | null;
}

const STATUSES: Subscription['status'][] = ['active', 'inactive', 'past_due', 'cancelled'];

export default function SubscriptionsScreen() {
  const [clientSubs, setClientSubs] = useState<ClientSub[]>([]);
  const [editing, setEditing] = useState<ClientSub | null>(null);
  const [status, setStatus] = useState<Subscription['status']>('active');
  const [renewalDate, setRenewalDate] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => { loadData(); }, []);

  async function loadData() {
    try {
      const clientSnap = await getDocs(query(collection(db, 'users'), where('role', '==', 'client')));
      const results: ClientSub[] = [];

      for (const clientDoc of clientSnap.docs) {
        const client = clientDoc.data() as UserProfile;
        const subDoc = await getDoc(doc(db, 'users', client.uid, 'subscription', 'current'));
        results.push({
          client,
          subscription: subDoc.exists() ? subDoc.data() as Subscription : null,
        });
      }

      results.sort((a, b) => a.client.name.localeCompare(b.client.name));
      setClientSubs(results);
    } catch { Alert.alert('Error', 'Failed to load'); }
    finally { setLoading(false); }
  }

  const openEdit = (cs: ClientSub) => {
    setEditing(cs);
    setStatus(cs.subscription?.status || 'inactive');
    if (cs.subscription?.currentPeriodEnd) {
      setRenewalDate(new Date(cs.subscription.currentPeriodEnd).toISOString().split('T')[0]);
    } else {
      // Default to 30 days from now
      const d = new Date();
      d.setDate(d.getDate() + 30);
      setRenewalDate(d.toISOString().split('T')[0]);
    }
  };

  const saveSub = async () => {
    if (!editing) return;
    setSaving(true);
    try {
      const renewalTimestamp = renewalDate ? new Date(renewalDate + 'T23:59:59').getTime() : null;
      await setDoc(doc(db, 'users', editing.client.uid, 'subscription', 'current'), {
        status,
        plan: 'th_training_monthly',
        amount: 5000,
        currentPeriodEnd: renewalTimestamp,
        lastUpdated: Date.now(),
      });
      Alert.alert('Saved', `${editing.client.name}'s subscription updated`);
      setEditing(null);
      await loadData();
    } catch { Alert.alert('Error', 'Failed to save'); }
    finally { setSaving(false); }
  };

  const getStatusColor = (s: string) => {
    switch (s) {
      case 'active': return colors.success;
      case 'past_due': return colors.warning;
      case 'cancelled': return colors.error;
      default: return colors.textMuted;
    }
  };

  // Edit view
  if (editing) {
    return (
      <>
        <Stack.Screen options={{ title: `Subscription: ${editing.client.name}` }} />
        <View style={styles.container}>
          <View style={styles.editContent}>
            <TouchableOpacity style={styles.backButton} onPress={() => setEditing(null)}>
              <Ionicons name="arrow-back" size={20} color={colors.primary} />
              <Text style={styles.backText}>Back</Text>
            </TouchableOpacity>

            <View style={[styles.editCard, shadows.sm]}>
              <View style={styles.editHeader}>
                <View style={styles.editAvatar}>
                  <Text style={styles.editAvatarText}>{editing.client.name.charAt(0)}</Text>
                </View>
                <Text style={styles.editName}>{editing.client.name}</Text>
              </View>

              <Text style={styles.label}>Status</Text>
              <View style={styles.statusGrid}>
                {STATUSES.map((s) => (
                  <TouchableOpacity
                    key={s}
                    style={[styles.statusChip, status === s && { backgroundColor: getStatusColor(s), borderColor: getStatusColor(s) }]}
                    onPress={() => setStatus(s)}
                  >
                    <Text style={[styles.statusChipText, status === s && { color: '#fff' }]}>
                      {s.charAt(0).toUpperCase() + s.slice(1).replace('_', ' ')}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={styles.label}>Renewal Date</Text>
              <TextInput
                style={styles.input}
                value={renewalDate}
                onChangeText={setRenewalDate}
                placeholder="YYYY-MM-DD"
                placeholderTextColor={colors.textMuted}
              />

              {/* Quick date buttons */}
              <View style={styles.quickDates}>
                {[
                  { label: '+30 days', days: 30 },
                  { label: '+60 days', days: 60 },
                  { label: '+90 days', days: 90 },
                ].map((q) => (
                  <TouchableOpacity
                    key={q.label}
                    style={styles.quickDateBtn}
                    onPress={() => {
                      const d = new Date();
                      d.setDate(d.getDate() + q.days);
                      setRenewalDate(d.toISOString().split('T')[0]);
                    }}
                  >
                    <Text style={styles.quickDateText}>{q.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Button title={saving ? 'Saving...' : 'Save Subscription'} onPress={saveSub} loading={saving} style={{ marginTop: spacing.lg }} />
            </View>
          </View>
        </View>
      </>
    );
  }

  // List view
  return (
    <>
      <Stack.Screen options={{ title: 'Manage Subscriptions' }} />
      <FlatList
        style={styles.container}
        data={clientSubs}
        keyExtractor={(item) => item.client.uid}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => {
          const sub = item.subscription;
          const statusColor = getStatusColor(sub?.status || 'inactive');
          return (
            <TouchableOpacity style={[styles.clientCard, shadows.sm]} onPress={() => openEdit(item)} activeOpacity={0.7}>
              <View style={styles.clientAvatar}>
                <Text style={styles.avatarText}>{item.client.name.charAt(0)}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.clientName}>{item.client.name}</Text>
                {sub?.currentPeriodEnd && (
                  <Text style={styles.renewalText}>
                    {sub.status === 'active' ? 'Renews' : 'Expired'}: {new Date(sub.currentPeriodEnd).toLocaleDateString('en-GB')}
                  </Text>
                )}
              </View>
              <View style={[styles.statusBadge, { backgroundColor: statusColor + '20' }]}>
                <View style={[styles.statusDot, { backgroundColor: statusColor }]} />
                <Text style={[styles.statusBadgeText, { color: statusColor }]}>
                  {(sub?.status || 'inactive').replace('_', ' ')}
                </Text>
              </View>
            </TouchableOpacity>
          );
        }}
        ListEmptyComponent={
          <View style={styles.empty}><Text style={styles.emptyText}>{loading ? 'Loading...' : 'No clients'}</Text></View>
        }
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  list: { padding: spacing.md },
  editContent: { padding: spacing.md },

  backButton: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs, marginBottom: spacing.lg },
  backText: { color: colors.primary, fontSize: fontSize.sm, fontWeight: '600' },

  clientCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface, borderRadius: borderRadius.lg, padding: spacing.md, marginBottom: spacing.sm },
  clientAvatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.primary, justifyContent: 'center', alignItems: 'center', marginRight: spacing.md },
  avatarText: { color: '#fff', fontWeight: '700', fontSize: fontSize.md },
  clientName: { color: colors.text, fontSize: fontSize.md, fontWeight: '600' },
  renewalText: { color: colors.textMuted, fontSize: fontSize.xs, marginTop: 2 },
  statusBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: spacing.sm, paddingVertical: spacing.xs, borderRadius: borderRadius.full },
  statusDot: { width: 6, height: 6, borderRadius: 3 },
  statusBadgeText: { fontSize: fontSize.xs, fontWeight: '700', textTransform: 'capitalize' },

  editCard: { backgroundColor: colors.surface, borderRadius: borderRadius.lg, padding: spacing.lg },
  editHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.lg },
  editAvatar: { width: 48, height: 48, borderRadius: 24, backgroundColor: colors.primary, justifyContent: 'center', alignItems: 'center', marginRight: spacing.md },
  editAvatarText: { color: '#fff', fontSize: fontSize.lg, fontWeight: '800' },
  editName: { color: colors.text, fontSize: fontSize.lg, fontWeight: '700' },

  label: { color: colors.textSecondary, fontSize: fontSize.sm, fontWeight: '600', marginBottom: spacing.sm, marginTop: spacing.md },
  input: { backgroundColor: colors.inputBackground, borderRadius: borderRadius.md, padding: spacing.md, color: colors.text, fontSize: fontSize.md, borderWidth: 1, borderColor: colors.border },

  statusGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  statusChip: { paddingHorizontal: spacing.md, paddingVertical: spacing.sm, borderRadius: borderRadius.full, borderWidth: 1, borderColor: colors.border },
  statusChipText: { color: colors.textMuted, fontSize: fontSize.sm, fontWeight: '600' },

  quickDates: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.sm },
  quickDateBtn: { paddingHorizontal: spacing.md, paddingVertical: spacing.xs, borderRadius: borderRadius.full, backgroundColor: colors.surfaceLight },
  quickDateText: { color: colors.textSecondary, fontSize: fontSize.xs, fontWeight: '600' },

  empty: { alignItems: 'center', padding: spacing.xxl },
  emptyText: { color: colors.textMuted, fontSize: fontSize.md },
});
