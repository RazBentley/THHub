import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { doc, getDoc, collection, getDocs, query, where } from 'firebase/firestore';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../lib/firebase';
import { Button } from '../../components/ui/Button';
import { GradientCard } from '../../components/ui/GradientCard';
import { PLAN_NAME, PLAN_PRICE } from '../../lib/stripe';
import { Subscription } from '../../types';
import { colors, spacing, fontSize, borderRadius, shadows } from '../../components/ui/theme';

export default function PaymentsScreen() {
  const { profile, isOwner } = useAuth();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [clientSubs, setClientSubs] = useState<{ name: string; status: string; end?: number }[]>([]);

  useEffect(() => {
    loadSubscription();
  }, []);

  async function loadSubscription() {
    if (!profile) return;
    try {
      if (isOwner) {
        const clientsSnap = await getDocs(
          query(collection(db, 'users'), where('role', '==', 'client'))
        );
        const subs: { name: string; status: string; end?: number }[] = [];
        for (const clientDoc of clientsSnap.docs) {
          const subDoc = await getDoc(doc(db, 'users', clientDoc.id, 'subscription', 'current'));
          subs.push({
            name: clientDoc.data().name,
            status: subDoc.exists() ? subDoc.data().status : 'inactive',
            end: subDoc.exists() ? subDoc.data().currentPeriodEnd : undefined,
          });
        }
        setClientSubs(subs);
      } else {
        const subDoc = await getDoc(doc(db, 'users', profile.uid, 'subscription', 'current'));
        if (subDoc.exists()) {
          setSubscription(subDoc.data() as Subscription);
        }
      }
    } catch (err) {
      // handle silently
    } finally {
      setLoading(false);
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return colors.success;
      case 'past_due': return colors.warning;
      case 'cancelled': return colors.error;
      default: return colors.textMuted;
    }
  };

  // Owner view
  if (isOwner) {
    return (
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <Text style={styles.pageTitle}>Client Payments</Text>

        {clientSubs.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="card-outline" size={48} color={colors.textMuted} />
            <Text style={styles.emptyText}>No clients yet</Text>
          </View>
        ) : (
          clientSubs.map((sub, index) => (
            <View key={index} style={[styles.clientPaymentCard, shadows.sm]}>
              <View style={styles.clientPaymentHeader}>
                <View style={[styles.clientAvatar, { backgroundColor: getStatusColor(sub.status) + '20' }]}>
                  <Text style={[styles.clientAvatarText, { color: getStatusColor(sub.status) }]}>
                    {sub.name.charAt(0)}
                  </Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.clientName}>{sub.name}</Text>
                  {sub.end && (
                    <Text style={styles.renewalText}>
                      {sub.status === 'active' ? 'Renews' : 'Expired'}: {new Date(sub.end).toLocaleDateString('en-GB')}
                    </Text>
                  )}
                </View>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(sub.status) + '20' }]}>
                  <View style={[styles.statusDot, { backgroundColor: getStatusColor(sub.status) }]} />
                  <Text style={[styles.statusText, { color: getStatusColor(sub.status) }]}>
                    {sub.status}
                  </Text>
                </View>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    );
  }

  // Client view - Premium card
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <GradientCard
        gradientColors={[colors.primary, colors.accent]}
        glowColor={colors.primary}
        style={styles.planCardOuter}
      >
        {/* Premium ribbon */}
        <View style={styles.ribbon}>
          <LinearGradient
            colors={[colors.primary, colors.accent]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.ribbonGradient}
          >
            <Ionicons name="star" size={12} color="#fff" />
            <Text style={styles.ribbonText}>COACHING PLAN</Text>
          </LinearGradient>
        </View>

        <View style={styles.planHeader}>
          <Ionicons name="fitness" size={36} color={colors.primary} />
        </View>
        <Text style={styles.planName}>{PLAN_NAME}</Text>
        <Text style={styles.planPrice}>{PLAN_PRICE}<Text style={styles.perMonth}>/month</Text></Text>

        <View style={styles.divider} />

        <View style={styles.featureList}>
          {[
            { icon: 'restaurant', text: 'Personalised nutrition plan' },
            { icon: 'calendar', text: 'Weekly check-ins with your coach' },
            { icon: 'chatbubble', text: 'Direct messaging support' },
            { icon: 'nutrition', text: 'Food tracking & macro targets' },
            { icon: 'barbell', text: 'Training programme updates' },
          ].map((feature, i) => (
            <View key={i} style={styles.featureItem}>
              <View style={styles.featureIconWrap}>
                <Ionicons name={feature.icon as any} size={16} color={colors.success} />
              </View>
              <Text style={styles.featureText}>{feature.text}</Text>
            </View>
          ))}
        </View>
      </GradientCard>

      {subscription ? (
        <View style={[styles.statusCard, shadows.sm]}>
          <View style={styles.statusRow}>
            <Text style={styles.statusLabel}>Status</Text>
            <View style={[styles.statusBadge, { backgroundColor: getStatusColor(subscription.status) + '20' }]}>
              <View style={[styles.statusDot, { backgroundColor: getStatusColor(subscription.status) }]} />
              <Text style={[styles.statusText, { color: getStatusColor(subscription.status) }]}>
                {subscription.status}
              </Text>
            </View>
          </View>
          {subscription.currentPeriodEnd && (
            <View style={styles.statusRow}>
              <Text style={styles.statusLabel}>Next Renewal</Text>
              <Text style={styles.statusValue}>
                {new Date(subscription.currentPeriodEnd).toLocaleDateString('en-GB')}
              </Text>
            </View>
          )}
        </View>
      ) : null}

      <View style={[styles.contactCard, shadows.sm]}>
        <Ionicons name="chatbubble-ellipses" size={24} color={colors.primary} />
        <View style={{ flex: 1, marginLeft: spacing.md }}>
          <Text style={styles.contactTitle}>Payment & Renewals</Text>
          <Text style={styles.contactSubtext}>
            To subscribe or manage your plan, message your coach directly or contact TH Training
          </Text>
        </View>
      </View>
    </ScrollView>
  );
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
  pageTitle: {
    color: colors.text,
    fontSize: fontSize.xl,
    fontWeight: '800',
    marginBottom: spacing.lg,
  },
  planCardOuter: {
    marginBottom: spacing.lg,
  },
  ribbon: {
    position: 'absolute',
    top: -1,
    right: 16,
    zIndex: 1,
  },
  ribbonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 2,
    borderBottomLeftRadius: borderRadius.sm,
    borderBottomRightRadius: borderRadius.sm,
    gap: 4,
  },
  ribbonText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
  },
  planHeader: {
    alignItems: 'center',
    marginBottom: spacing.sm,
    marginTop: spacing.sm,
  },
  planName: {
    color: colors.text,
    fontSize: fontSize.lg,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  planPrice: {
    color: colors.text,
    fontSize: 48,
    fontWeight: '900',
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  perMonth: {
    color: colors.textMuted,
    fontSize: fontSize.lg,
    fontWeight: '400',
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginBottom: spacing.md,
  },
  featureList: {
    gap: spacing.md,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  featureIconWrap: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.success + '15',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  featureText: {
    color: colors.textSecondary,
    fontSize: fontSize.sm,
    flex: 1,
  },
  subscribeButton: {
    borderRadius: borderRadius.md,
    overflow: 'hidden',
  },
  subscribeGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md + 2,
    gap: spacing.sm,
  },
  subscribeText: {
    color: '#fff',
    fontSize: fontSize.md,
    fontWeight: '700',
  },
  statusCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  statusLabel: {
    color: colors.textSecondary,
    fontSize: fontSize.sm,
  },
  statusValue: {
    color: colors.text,
    fontSize: fontSize.sm,
    fontWeight: '600',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
    gap: 4,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusText: {
    fontSize: fontSize.xs,
    fontWeight: '700',
    textTransform: 'capitalize',
  },
  clientPaymentCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  clientPaymentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  clientAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  clientAvatarText: {
    fontSize: fontSize.md,
    fontWeight: '700',
  },
  clientName: {
    color: colors.text,
    fontSize: fontSize.md,
    fontWeight: '600',
  },
  renewalText: {
    color: colors.textMuted,
    fontSize: fontSize.xs,
    marginTop: 2,
  },
  contactCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginTop: spacing.lg,
  },
  contactTitle: {
    color: colors.text,
    fontSize: fontSize.md,
    fontWeight: '600',
  },
  contactSubtext: {
    color: colors.textMuted,
    fontSize: fontSize.sm,
    marginTop: spacing.xs,
    lineHeight: 20,
  },
  emptyState: {
    alignItems: 'center',
    padding: spacing.xxl,
  },
  emptyText: {
    color: colors.textSecondary,
    fontSize: fontSize.md,
    marginTop: spacing.md,
  },
});
