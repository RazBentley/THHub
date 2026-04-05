import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert, Switch,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Stack, router } from 'expo-router';
import { doc, setDoc } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import { db } from '../lib/firebase';
import { colors, spacing, fontSize, borderRadius, shadows } from '../components/ui/theme';

function getWeekId(): string {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 1);
  const diff = now.getTime() - start.getTime();
  const week = Math.ceil((diff / 86400000 + start.getDay() + 1) / 7);
  return `${now.getFullYear()}-W${String(week).padStart(2, '0')}`;
}

export default function CheckInScreen() {
  const { profile } = useAuth();
  const [submitting, setSubmitting] = useState(false);

  // Form state
  const [weightCurrent, setWeightCurrent] = useState('');
  const [weightPrevious, setWeightPrevious] = useState('');
  const [goal, setGoal] = useState('');
  const [sleep, setSleep] = useState('');
  const [appetite, setAppetite] = useState('');
  const [energy, setEnergy] = useState('');
  const [stress, setStress] = useState('');
  const [gymPerformance, setGymPerformance] = useState('');
  const [recoveryNotes, setRecoveryNotes] = useState('');
  const [sessionsCompleted, setSessionsCompleted] = useState(true);
  const [cardio, setCardio] = useState('');
  const [steps, setSteps] = useState('');
  const [adherence, setAdherence] = useState('');
  const [cheatMeal, setCheatMeal] = useState('');
  const [questions, setQuestions] = useState('');
  const [otherNotes, setOtherNotes] = useState('');
  const [wins, setWins] = useState('');
  const [goalsNextWeek, setGoalsNextWeek] = useState('');

  const handleSubmit = async () => {
    if (!profile) return;
    if (!weightCurrent.trim()) {
      Alert.alert('Required', 'Please enter your current weight');
      return;
    }

    setSubmitting(true);
    const weekId = getWeekId();

    try {
      await setDoc(doc(db, 'users', profile.uid, 'checkIns', weekId), {
        submittedAt: Date.now(),
        weekId,
        weightCurrent, weightPrevious, goal,
        sleep, appetite, energy, stress,
        gymPerformance, recovery: recoveryNotes, sessionsCompleted,
        cardio, steps,
        adherence, cheatMeal,
        questions, otherNotes,
        wins, goalsNextWeek,
      });

      Alert.alert(
        'Check-In Submitted!',
        'Your weekly check-in has been sent to your coach.',
        [{ text: 'OK', onPress: () => router.back() }]
      );
    } catch (err) {
      Alert.alert('Error', 'Failed to submit check-in. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          title: 'Weekly Check-In',
          headerStyle: { backgroundColor: colors.secondary },
          headerTintColor: colors.text,
        }}
      />
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <Text style={styles.intro}>
          Take a few minutes to reflect honestly - this helps your coach support your progress.
        </Text>

        {/* Body Metrics */}
        <SectionHeader icon="scale" color={colors.primary} title="Body Metrics" />
        <FormField label="Current Weight (Today)" value={weightCurrent} onChange={setWeightCurrent} placeholder="e.g. 17st 13lbs or 113kg" />
        <FormField label="Previous Week's Weight" value={weightPrevious} onChange={setWeightPrevious} placeholder="e.g. 18st 0lbs" />
        <FormField label="Current Goal" value={goal} onChange={setGoal} placeholder="e.g. Fat loss, getting to 13 stone by June" multiline />

        {/* Recovery & Wellness */}
        <SectionHeader icon="bed" color={colors.success} title="Recovery & Wellness" />
        <FormField label="Sleep Quality (hours + quality)" value={sleep} onChange={setSleep} placeholder="e.g. 7-8 hours, good quality" />
        <FormField label="Appetite & Digestion" value={appetite} onChange={setAppetite} placeholder="How has your appetite been?" />
        <FormField label="Energy Levels & General Wellbeing" value={energy} onChange={setEnergy} placeholder="How are your energy levels?" />
        <FormField label="Stress Levels This Week" value={stress} onChange={setStress} placeholder="Low / Medium / High + details" />

        {/* Training & Performance */}
        <SectionHeader icon="barbell" color={colors.accent} title="Training & Performance" />
        <FormField label="Gym Performance Feedback" value={gymPerformance} onChange={setGymPerformance} placeholder="Strength, endurance, mindset..." multiline />
        <FormField label="Recovery Between Sessions" value={recoveryNotes} onChange={setRecoveryNotes} placeholder="Soreness, readiness..." />

        <View style={styles.switchRow}>
          <Text style={styles.switchLabel}>Completed All Training Sessions?</Text>
          <View style={styles.switchContainer}>
            <Text style={[styles.switchValue, !sessionsCompleted && { color: colors.error }]}>
              {sessionsCompleted ? 'Yes' : 'No'}
            </Text>
            <Switch
              value={sessionsCompleted}
              onValueChange={setSessionsCompleted}
              trackColor={{ false: colors.surfaceLight, true: colors.success + '60' }}
              thumbColor={sessionsCompleted ? colors.success : colors.textMuted}
            />
          </View>
        </View>

        <FormField label="Cardio Completed (type, duration)" value={cardio} onChange={setCardio} placeholder="e.g. 20 mins incline walking" />
        <FormField label="Steps (daily/weekly average)" value={steps} onChange={setSteps} placeholder="e.g. 8,000 average" />

        {/* Adherence & Nutrition */}
        <SectionHeader icon="nutrition" color={colors.warning} title="Adherence & Nutrition" />
        <FormField label="Adherence to Your Plan" value={adherence} onChange={setAdherence} placeholder="How well did you stick to the plan?" />
        <FormField label="Cheat Meal Details" value={cheatMeal} onChange={setCheatMeal} placeholder="What did you have?" />

        {/* Coaching Communication */}
        <SectionHeader icon="chatbubble" color={colors.primary} title="Coaching Communication" />
        <FormField label="Questions for Your Coach" value={questions} onChange={setQuestions} placeholder="Diet changes, mindset, schedule..." multiline />
        <FormField label="Other Notes" value={otherNotes} onChange={setOtherNotes} placeholder="Anything else relevant..." multiline />

        {/* Reflection */}
        <SectionHeader icon="star" color={colors.warning} title="Reflection" />
        <FormField label="Wins & Positives (big or small!)" value={wins} onChange={setWins} placeholder="What went well this week?" multiline />
        <FormField label="Goals for the Coming Week" value={goalsNextWeek} onChange={setGoalsNextWeek} placeholder="What do you want to achieve?" multiline />

        {/* Submit */}
        <TouchableOpacity
          style={[styles.submitButton, shadows.md]}
          onPress={handleSubmit}
          disabled={submitting}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={[colors.primary, colors.primaryDark]}
            style={styles.submitGradient}
          >
            {submitting ? (
              <Text style={styles.submitText}>Submitting...</Text>
            ) : (
              <>
                <Ionicons name="send" size={20} color="#fff" />
                <Text style={styles.submitText}>Submit Check-In</Text>
              </>
            )}
          </LinearGradient>
        </TouchableOpacity>
      </ScrollView>
    </>
  );
}

function SectionHeader({ icon, color, title }: { icon: string; color: string; title: string }) {
  return (
    <View style={styles.sectionHeader}>
      <Ionicons name={icon as any} size={20} color={color} />
      <Text style={styles.sectionTitle}>{title}</Text>
    </View>
  );
}

function FormField({ label, value, onChange, placeholder, multiline }: {
  label: string; value: string; onChange: (v: string) => void; placeholder: string; multiline?: boolean;
}) {
  return (
    <View style={styles.fieldContainer}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <TextInput
        style={[styles.fieldInput, multiline && styles.fieldMultiline]}
        value={value}
        onChangeText={onChange}
        placeholder={placeholder}
        placeholderTextColor={colors.textMuted}
        multiline={multiline}
        numberOfLines={multiline ? 3 : 1}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.md, paddingBottom: spacing.xxl },
  intro: { color: colors.textSecondary, fontSize: fontSize.sm, textAlign: 'center', marginBottom: spacing.lg, fontStyle: 'italic' },

  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginTop: spacing.lg, marginBottom: spacing.md, paddingBottom: spacing.xs, borderBottomWidth: 1, borderBottomColor: colors.border },
  sectionTitle: { color: colors.text, fontSize: fontSize.lg, fontWeight: '700' },

  fieldContainer: { marginBottom: spacing.md },
  fieldLabel: { color: colors.textSecondary, fontSize: fontSize.sm, fontWeight: '600', marginBottom: spacing.xs },
  fieldInput: { backgroundColor: colors.inputBackground, borderRadius: borderRadius.md, padding: spacing.md, color: colors.text, fontSize: fontSize.md, borderWidth: 1, borderColor: colors.border },
  fieldMultiline: { minHeight: 80, textAlignVertical: 'top' },

  switchRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: colors.surface, padding: spacing.md, borderRadius: borderRadius.md, marginBottom: spacing.md },
  switchLabel: { color: colors.text, fontSize: fontSize.sm, fontWeight: '600', flex: 1 },
  switchContainer: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  switchValue: { color: colors.success, fontSize: fontSize.sm, fontWeight: '700' },

  submitButton: { borderRadius: borderRadius.md, overflow: 'hidden', marginTop: spacing.lg },
  submitGradient: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: spacing.md + 2, gap: spacing.sm },
  submitText: { color: '#fff', fontSize: fontSize.md, fontWeight: '700' },
});
