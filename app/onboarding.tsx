import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Pressable, TextInput, Image, Platform, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Stack, router, Redirect } from 'expo-router';
import { doc, updateDoc } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import { db } from '../lib/firebase';
import { OnboardingInfo } from '../types';
import { colors, spacing, fontSize, borderRadius, shadows } from '../components/ui/theme';

const GOALS = ['Lose weight', 'Build muscle', 'Get fitter & healthier', 'Improve nutrition', 'Body recomposition', 'Other'];
const MOTIVATIONS = ['Improve my health', 'Feel more confident', 'Get in shape for an event', 'Holiday coming up', 'Mental wellbeing', 'Sports performance', 'Just want to look & feel better', 'Other'];
const EXPERIENCE = [
  { value: 'beginner', label: 'Beginner', desc: 'New to training or coming back after a long break' },
  { value: 'intermediate', label: 'Intermediate', desc: 'Been training for a while, know the basics' },
  { value: 'advanced', label: 'Advanced', desc: 'Experienced lifter looking to level up' },
];
const DAYS = ['2 days', '3 days', '4 days', '5 days', '6+ days'];
const GENDERS = [
  { value: 'male', label: 'Male', icon: 'man-outline' as const },
  { value: 'female', label: 'Female', icon: 'woman-outline' as const },
  { value: 'prefer-not-to-say', label: 'Prefer not to say', icon: 'person-outline' as const },
];

export default function OnboardingScreen() {
  const { profile } = useAuth();
  const [step, setStep] = useState(0);
  const [saving, setSaving] = useState(false);

  const [gender, setGender] = useState('');
  const [mainGoal, setMainGoal] = useState('');
  const [motivation, setMotivation] = useState('');
  const [experience, setExperience] = useState('');
  const [trainingDays, setTrainingDays] = useState('');
  const [healthConditions, setHealthConditions] = useState('');
  const [dietaryRequirements, setDietaryRequirements] = useState('');
  const [additionalNotes, setAdditionalNotes] = useState('');

  // Redirect if already completed onboarding
  if (profile?.onboarding?.completedAt) {
    return <Redirect href="/(tabs)/dashboard" />;
  }

  const handleSave = async () => {
    if (!profile) {
      Alert.alert('Error', 'Profile not loaded yet. Please wait a moment and try again.');
      return;
    }
    setSaving(true);
    try {
      const onboarding: OnboardingInfo = {
        mainGoal: mainGoal || undefined,
        motivation: motivation || undefined,
        experience: experience || undefined,
        trainingDays: trainingDays || undefined,
        healthConditions: healthConditions || undefined,
        dietaryRequirements: dietaryRequirements || undefined,
        additionalNotes: additionalNotes || undefined,
        completedAt: Date.now(),
      };
      const updates: Record<string, any> = { onboarding };
      if (gender) updates.gender = gender;
      await updateDoc(doc(db, 'users', profile.uid), updates);
      router.replace('/(tabs)/dashboard');
    } catch (err: any) {
      Alert.alert('Error', err?.message || 'Failed to save onboarding data');
    } finally {
      setSaving(false);
    }
  };

  const handleSkip = async () => {
    if (!profile) {
      Alert.alert('Error', 'Profile not loaded yet. Please wait a moment and try again.');
      return;
    }
    try {
      await updateDoc(doc(db, 'users', profile.uid), { onboarding: { completedAt: Date.now() } });
      router.replace('/(tabs)/dashboard');
    } catch (err: any) {
      Alert.alert('Error', err?.message || 'Failed to skip onboarding');
    }
  };

  const Chip = ({ label, selected, onPress }: { label: string; selected: boolean; onPress: () => void }) => (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.chip, selected && styles.chipSelected]}
      activeOpacity={0.7}
    >
      <Text style={[styles.chipText, selected && styles.chipTextSelected]}>{label}</Text>
    </TouchableOpacity>
  );

  const totalSteps = 8; // Welcome(0), Gender(1), Goal(2), Motivation(3), Experience(4), Days(5), Health(6), Notes(7)
  const lastStep = totalSteps - 1;

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <ScrollView style={styles.container} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">

        {/* Progress */}
        {step > 0 && (
          <View style={styles.progressRow}>
            <View style={styles.progressBg}>
              <View style={[styles.progressFill, { width: `${(step / lastStep) * 100}%` }]} />
            </View>
            <Text style={styles.progressText}>{step}/{lastStep}</Text>
          </View>
        )}

        {/* Step 0: Welcome */}
        {step === 0 && (
          <View style={styles.welcomeSection}>
            <View style={styles.logoContainer}>
              <Image source={require('../assets/logo.png')} style={styles.logo} resizeMode="contain" />
            </View>
            <Text style={styles.welcomeTitle}>Welcome to TH Hub, {profile?.name?.split(' ')[0]}!</Text>
            <Text style={styles.welcomeSubtext}>
              Let's get to know you a bit better so Tom can create the perfect plan for you. This only takes a minute.
            </Text>
            <Text style={styles.optionalText}>All questions are optional — skip anything you're not sure about.</Text>
          </View>
        )}

        {/* Step 1: Gender */}
        {step === 1 && (
          <View>
            <View style={styles.stepIconRow}>
              <View style={styles.stepIconCircle}>
                <Ionicons name="person" size={24} color={colors.primary} />
              </View>
            </View>
            <Text style={styles.stepTitle}>About You</Text>
            <Text style={styles.stepSubtext}>
              This helps us personalise your experience and give you access to the right community groups.
            </Text>
            <View style={styles.genderOptions}>
              {GENDERS.map((g) => (
                <TouchableOpacity
                  key={g.value}
                  style={[styles.genderCard, gender === g.value && styles.genderCardSelected]}
                  onPress={() => setGender(g.value)}
                  activeOpacity={0.7}
                >
                  <View style={[styles.genderIconCircle, gender === g.value && styles.genderIconCircleSelected]}>
                    <Ionicons name={g.icon} size={28} color={gender === g.value ? colors.primary : colors.textMuted} />
                  </View>
                  <Text style={[styles.genderLabel, gender === g.value && { color: colors.primary }]}>{g.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Step 2: Goal */}
        {step === 2 && (
          <View>
            <Text style={styles.stepTitle}>What's your main goal?</Text>
            <View style={styles.chipGrid}>
              {GOALS.map(g => <Chip key={g} label={g} selected={mainGoal === g} onPress={() => setMainGoal(g)} />)}
            </View>
          </View>
        )}

        {/* Step 3: Motivation */}
        {step === 3 && (
          <View>
            <Text style={styles.stepTitle}>What's driving you to make a change?</Text>
            <Text style={styles.stepSubtext}>Understanding your "why" helps Tom keep you motivated.</Text>
            <View style={styles.chipGrid}>
              {MOTIVATIONS.map(m => <Chip key={m} label={m} selected={motivation === m} onPress={() => setMotivation(m)} />)}
            </View>
          </View>
        )}

        {/* Step 4: Experience */}
        {step === 4 && (
          <View>
            <Text style={styles.stepTitle}>What's your training experience?</Text>
            {EXPERIENCE.map(e => (
              <TouchableOpacity
                key={e.value}
                style={[styles.optionCard, experience === e.value && styles.optionCardSelected]}
                onPress={() => setExperience(e.value)}
                activeOpacity={0.7}
              >
                <Text style={[styles.optionTitle, experience === e.value && { color: colors.primary }]}>{e.label}</Text>
                <Text style={styles.optionDesc}>{e.desc}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Step 5: Training days */}
        {step === 5 && (
          <View>
            <Text style={styles.stepTitle}>How many days a week can you train?</Text>
            <View style={styles.chipRow}>
              {DAYS.map(d => <Chip key={d} label={d} selected={trainingDays === d} onPress={() => setTrainingDays(d)} />)}
            </View>
          </View>
        )}

        {/* Step 6: Health & diet */}
        {step === 6 && (
          <View>
            <Text style={styles.stepTitle}>Any injuries or health conditions?</Text>
            <Text style={styles.stepSubtext}>This helps Tom programme safely around any limitations.</Text>
            <TextInput
              style={styles.textArea}
              value={healthConditions}
              onChangeText={setHealthConditions}
              placeholder="e.g. Bad knee, asthma — or 'none'"
              placeholderTextColor={colors.textMuted}
              multiline
            />
            <Text style={[styles.stepTitle, { marginTop: spacing.lg }]}>Any dietary requirements?</Text>
            <TextInput
              style={styles.textArea}
              value={dietaryRequirements}
              onChangeText={setDietaryRequirements}
              placeholder="e.g. Vegetarian, lactose intolerant — or 'none'"
              placeholderTextColor={colors.textMuted}
              multiline
            />
          </View>
        )}

        {/* Step 7: Anything else */}
        {step === 7 && (
          <View>
            <Text style={styles.stepTitle}>Anything else you'd like Tom to know?</Text>
            <Text style={styles.stepSubtext}>Your schedule, preferences, past coaching experience — anything useful.</Text>
            <TextInput
              style={[styles.textArea, { minHeight: 120 }]}
              value={additionalNotes}
              onChangeText={setAdditionalNotes}
              placeholder="Tell Tom anything that might help..."
              placeholderTextColor={colors.textMuted}
              multiline
            />
          </View>
        )}

        {/* Navigation */}
        <View style={styles.navRow}>
          {step === 0 ? (
            <>
              <Pressable onPress={handleSkip} hitSlop={12}>
                <Text style={styles.skipText}>Skip for now</Text>
              </Pressable>
              <Pressable style={styles.primaryBtn} onPress={() => setStep(1)}>
                <LinearGradient colors={[colors.primary, colors.primaryDark]} style={styles.primaryBtnGradient} pointerEvents="none">
                  <Text style={styles.primaryBtnText}>Let's Go</Text>
                  <Ionicons name="arrow-forward" size={18} color="#fff" />
                </LinearGradient>
              </Pressable>
            </>
          ) : (
            <>
              <Pressable onPress={() => setStep(step - 1)} hitSlop={12}>
                <Text style={styles.backText}>Back</Text>
              </Pressable>
              <View style={{ flexDirection: 'row', gap: spacing.md, alignItems: 'center' }}>
                <Pressable onPress={() => step === lastStep ? handleSave() : setStep(step + 1)} hitSlop={12}>
                  <Text style={styles.skipText}>Skip</Text>
                </Pressable>
                <Pressable
                  style={({ pressed }) => [styles.primaryBtn, pressed && { opacity: 0.8 }]}
                  onPress={() => step === lastStep ? handleSave() : setStep(step + 1)}
                  disabled={saving}
                >
                  <LinearGradient colors={[colors.primary, colors.primaryDark]} style={styles.primaryBtnGradient} pointerEvents="none">
                    <Text style={styles.primaryBtnText}>{step === lastStep ? (saving ? 'Saving...' : 'Finish') : 'Next'}</Text>
                    {step < lastStep && <Ionicons name="arrow-forward" size={16} color="#fff" />}
                  </LinearGradient>
                </Pressable>
              </View>
            </>
          )}
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg, paddingBottom: spacing.xxl },

  progressRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.lg },
  progressBg: { flex: 1, height: 6, backgroundColor: colors.border, borderRadius: 3, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: colors.primary, borderRadius: 3 },
  progressText: { color: colors.textMuted, fontSize: fontSize.xs },

  welcomeSection: { alignItems: 'center', paddingVertical: spacing.xl },
  logoContainer: { marginBottom: spacing.lg },
  logo: { width: 80, height: 80 },
  welcomeTitle: { color: colors.text, fontSize: fontSize.xl, fontWeight: '700', textAlign: 'center', marginBottom: spacing.sm },
  welcomeSubtext: { color: colors.textSecondary, fontSize: fontSize.md, textAlign: 'center', marginBottom: spacing.md, lineHeight: 22 },
  optionalText: { color: colors.textMuted, fontSize: fontSize.sm, textAlign: 'center' },

  stepTitle: { color: colors.text, fontSize: fontSize.lg, fontWeight: '700', marginBottom: spacing.sm },
  stepSubtext: { color: colors.textMuted, fontSize: fontSize.sm, marginBottom: spacing.md },

  stepIconRow: { alignItems: 'center', marginBottom: spacing.md },
  stepIconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary + '15',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Gender step styles
  genderOptions: { gap: spacing.sm },
  genderCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing.md,
  },
  genderCardSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primary + '10',
  },
  genderIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.surfaceLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  genderIconCircleSelected: {
    backgroundColor: colors.primary + '20',
  },
  genderLabel: {
    color: colors.text,
    fontSize: fontSize.md,
    fontWeight: '600',
  },

  chipGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  chip: { paddingHorizontal: spacing.md, paddingVertical: spacing.sm, borderRadius: borderRadius.md, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border },
  chipSelected: { backgroundColor: colors.primary + '20', borderColor: colors.primary },
  chipText: { color: colors.textSecondary, fontSize: fontSize.sm, fontWeight: '600' },
  chipTextSelected: { color: colors.primary },

  optionCard: { backgroundColor: colors.surface, borderRadius: borderRadius.md, padding: spacing.md, marginBottom: spacing.sm, borderWidth: 1, borderColor: colors.border },
  optionCardSelected: { borderColor: colors.primary, backgroundColor: colors.primary + '10' },
  optionTitle: { color: colors.text, fontSize: fontSize.md, fontWeight: '700' },
  optionDesc: { color: colors.textMuted, fontSize: fontSize.sm, marginTop: 2 },

  textArea: { backgroundColor: colors.inputBackground, borderRadius: borderRadius.md, padding: spacing.md, color: colors.text, fontSize: fontSize.sm, borderWidth: 1, borderColor: colors.border, minHeight: 80, textAlignVertical: 'top' },

  navRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: spacing.xl },
  skipText: { color: colors.textMuted, fontSize: fontSize.sm, fontWeight: '600' },
  backText: { color: colors.textSecondary, fontSize: fontSize.sm, fontWeight: '600' },
  primaryBtn: { borderRadius: borderRadius.md, overflow: 'hidden' },
  primaryBtnGradient: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, paddingHorizontal: spacing.lg, paddingVertical: spacing.sm + 2 },
  primaryBtnText: { color: '#fff', fontSize: fontSize.md, fontWeight: '700' },
});
