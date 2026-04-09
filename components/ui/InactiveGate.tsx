import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import { useSubscription } from '../../hooks/useSubscription';
import { colors, spacing, fontSize, borderRadius, shadows } from './theme';

const lockedFeatures = [
  { icon: 'restaurant-outline' as const, label: 'Meal Plan', desc: 'Custom meals with macros' },
  { icon: 'barbell-outline' as const, label: 'Workouts', desc: 'Structured training plan' },
  { icon: 'heart-outline' as const, label: 'Cardio', desc: 'Track activity & steps' },
  { icon: 'clipboard-outline' as const, label: 'Check-ins', desc: 'Weekly progress updates' },
  { icon: 'flag-outline' as const, label: 'Goals', desc: 'Weight goal tracking' },
  { icon: 'camera-outline' as const, label: 'Photos', desc: 'Progress photo timeline' },
];

export function InactiveGate({ children }: { children: React.ReactNode }) {
  const { profile, isOwner } = useAuth();
  const { isActive, loading } = useSubscription();

  if (loading) return null;
  if (isOwner || isActive) return <>{children}</>;

  return (
    <View style={styles.container}>
      {/* Welcome Card */}
      <LinearGradient
        colors={[colors.primary + '30', colors.accent + '10', 'transparent']}
        style={styles.welcomeGradient}
      >
        <Image source={require('../../assets/logo.png')} style={styles.logo} resizeMode="contain" />
        <Text style={styles.welcomeTitle}>
          Welcome to TH Hub, {profile?.name?.split(' ')[0] || 'there'}!
        </Text>
        <Text style={styles.welcomeText}>
          Thanks for signing up. Your coach will review your profile and set up your personalised plan. Once your coaching begins, you'll unlock full access to all features below.
        </Text>

        {/* CTA - prominent, right after welcome */}
        <TouchableOpacity
          style={styles.ctaButton}
          onPress={() => router.push('/(tabs)/messages')}
          activeOpacity={0.8}
        >
          <LinearGradient colors={[colors.primary, colors.primaryDark]} style={styles.ctaButtonGradient}>
            <Ionicons name="chatbubble" size={18} color="#fff" />
            <Text style={styles.ctaButtonText}>Message Your Coach</Text>
          </LinearGradient>
        </TouchableOpacity>
      </LinearGradient>

      {/* Locked Features Preview */}
      <Text style={styles.sectionTitle}>What You'll Get</Text>
      <View style={styles.featureGrid}>
        {lockedFeatures.map((feature) => (
          <View key={feature.label} style={[styles.featureCard, shadows.sm]}>
            <View style={styles.lockBadge}>
              <Ionicons name="lock-closed" size={10} color={colors.textMuted} />
            </View>
            <View style={styles.featureIcon}>
              <Ionicons name={feature.icon} size={20} color={colors.primary} />
            </View>
            <Text style={styles.featureLabel}>{feature.label}</Text>
            <Text style={styles.featureDesc}>{feature.desc}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: spacing.md },

  welcomeGradient: { borderRadius: borderRadius.lg, padding: spacing.lg, alignItems: 'center', marginBottom: spacing.lg },
  logo: { width: 64, height: 64, marginBottom: spacing.md },
  welcomeTitle: { color: colors.text, fontSize: fontSize.xl, fontWeight: '700', textAlign: 'center', marginBottom: spacing.sm },
  welcomeText: { color: colors.textSecondary, fontSize: fontSize.sm, textAlign: 'center', lineHeight: 20 },

  sectionTitle: { color: colors.text, fontSize: fontSize.lg, fontWeight: '700', marginBottom: spacing.md },

  featureGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginBottom: spacing.lg },
  featureCard: { width: '48%' as any, backgroundColor: colors.surface, borderRadius: borderRadius.md, padding: spacing.md, opacity: 0.75 },
  lockBadge: { position: 'absolute', top: spacing.sm, right: spacing.sm, backgroundColor: colors.border, borderRadius: 10, width: 20, height: 20, justifyContent: 'center', alignItems: 'center' },
  featureIcon: { backgroundColor: colors.primary + '15', borderRadius: borderRadius.sm, width: 36, height: 36, justifyContent: 'center', alignItems: 'center', marginBottom: spacing.sm },
  featureLabel: { color: colors.text, fontSize: fontSize.sm, fontWeight: '700', marginBottom: 2 },
  featureDesc: { color: colors.textMuted, fontSize: fontSize.xs },

  ctaCard: { backgroundColor: colors.surface, borderRadius: borderRadius.lg, padding: spacing.lg, alignItems: 'center' },
  ctaTitle: { color: colors.text, fontSize: fontSize.lg, fontWeight: '700', marginBottom: spacing.xs },
  ctaText: { color: colors.textSecondary, fontSize: fontSize.sm, textAlign: 'center', marginBottom: spacing.md },
  ctaButton: { borderRadius: borderRadius.md, overflow: 'hidden', width: '100%' as any },
  ctaButtonGradient: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.sm, paddingVertical: spacing.md },
  ctaButtonText: { color: '#fff', fontSize: fontSize.md, fontWeight: '700' },
});
