import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Stack } from 'expo-router';
import { doc, getDoc, setDoc, collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import { db } from '../lib/firebase';
import { DailyCardio } from '../types';
import { colors, spacing, fontSize, borderRadius, shadows } from '../components/ui/theme';

const CARDIO_TYPES = ['Walking', 'Incline Walk', 'Running', 'Cycling', 'Swimming', 'HIIT', 'Other'];

export default function CardioScreen() {
  const { profile } = useAuth();
  const [cardioMinutes, setCardioMinutes] = useState('0');
  const [cardioType, setCardioType] = useState('Walking');
  const [steps, setSteps] = useState('0');
  const [notes, setNotes] = useState('');
  const [saved, setSaved] = useState(false);
  const [weekHistory, setWeekHistory] = useState<DailyCardio[]>([]);

  const today = new Date().toISOString().split('T')[0];

  useEffect(() => { loadData(); }, []);

  async function loadData() {
    if (!profile) return;
    try {
      const todayDoc = await getDoc(doc(db, 'users', profile.uid, 'cardioLog', today));
      if (todayDoc.exists()) {
        const data = todayDoc.data() as DailyCardio;
        setCardioMinutes(String(data.cardioMinutes || 0));
        setCardioType(data.cardioType || 'Walking');
        setSteps(String(data.steps || 0));
        setNotes(data.notes || '');
        setSaved(true);
      }

      // Load last 7 days
      const history: DailyCardio[] = [];
      for (let i = 0; i < 7; i++) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const dateStr = d.toISOString().split('T')[0];
        const dayDoc = await getDoc(doc(db, 'users', profile.uid, 'cardioLog', dateStr));
        if (dayDoc.exists()) {
          history.push({ date: dateStr, ...dayDoc.data() } as DailyCardio);
        }
      }
      setWeekHistory(history);
    } catch { /* silent */ }
  }

  const saveCardio = async () => {
    if (!profile) return;
    try {
      await setDoc(doc(db, 'users', profile.uid, 'cardioLog', today), {
        date: today,
        cardioMinutes: parseInt(cardioMinutes) || 0,
        cardioType,
        steps: parseInt(steps) || 0,
        notes: notes.trim(),
      });
      setSaved(true);
      await loadData();
    } catch {
      Alert.alert('Error', 'Failed to save');
    }
  };

  const weekTotalMinutes = weekHistory.reduce((sum, d) => sum + (d.cardioMinutes || 0), 0);
  const weekTotalSteps = weekHistory.reduce((sum, d) => sum + (d.steps || 0), 0);
  const weekAvgSteps = weekHistory.length > 0 ? Math.round(weekTotalSteps / weekHistory.length) : 0;

  return (
    <>
      <Stack.Screen options={{ headerShown: true, title: 'Cardio & Steps', headerStyle: { backgroundColor: colors.secondary }, headerTintColor: colors.text }} />
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>

        {/* Weekly Summary */}
        <View style={[styles.summaryCard, shadows.sm]}>
          <Text style={styles.summaryTitle}>This Week</Text>
          <View style={styles.summaryRow}>
            <View style={styles.summaryItem}>
              <Ionicons name="time" size={22} color={colors.accent} />
              <Text style={[styles.summaryValue, { color: colors.accent }]}>{weekTotalMinutes}</Text>
              <Text style={styles.summaryLabel}>mins cardio</Text>
            </View>
            <View style={styles.summaryDivider} />
            <View style={styles.summaryItem}>
              <Ionicons name="footsteps" size={22} color={colors.success} />
              <Text style={[styles.summaryValue, { color: colors.success }]}>{weekAvgSteps.toLocaleString()}</Text>
              <Text style={styles.summaryLabel}>avg steps/day</Text>
            </View>
          </View>
        </View>

        {/* Today's Entry */}
        <Text style={styles.sectionTitle}>Today</Text>

        {/* Cardio Type */}
        <Text style={styles.label}>Cardio Type</Text>
        <View style={styles.typeGrid}>
          {CARDIO_TYPES.map((type) => (
            <TouchableOpacity
              key={type}
              style={[styles.typeChip, cardioType === type && styles.typeChipActive]}
              onPress={() => setCardioType(type)}
            >
              <Text style={[styles.typeText, cardioType === type && styles.typeTextActive]}>{type}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Duration */}
        <Text style={styles.label}>Duration (minutes)</Text>
        <View style={styles.counterRow}>
          <TouchableOpacity onPress={() => setCardioMinutes(String(Math.max(0, (parseInt(cardioMinutes) || 0) - 5)))} accessibilityLabel="Decrease duration by 5 minutes">
            <Ionicons name="remove-circle" size={36} color={colors.textMuted} />
          </TouchableOpacity>
          <TextInput style={styles.counterInput} value={cardioMinutes} onChangeText={setCardioMinutes} keyboardType="numeric" />
          <Text style={styles.counterUnit}>mins</Text>
          <TouchableOpacity onPress={() => setCardioMinutes(String((parseInt(cardioMinutes) || 0) + 5))} accessibilityLabel="Increase duration by 5 minutes">
            <Ionicons name="add-circle" size={36} color={colors.accent} />
          </TouchableOpacity>
        </View>

        {/* Steps */}
        <Text style={styles.label}>Steps</Text>
        <TextInput style={styles.input} value={steps} onChangeText={setSteps} keyboardType="numeric" placeholder="0" placeholderTextColor={colors.textMuted} />

        {/* Notes */}
        <Text style={styles.label}>Notes (optional)</Text>
        <TextInput style={[styles.input, { minHeight: 60, textAlignVertical: 'top' }]} value={notes} onChangeText={setNotes}
          placeholder="e.g. 20 mins incline walking on treadmill" placeholderTextColor={colors.textMuted} multiline />

        <TouchableOpacity style={[styles.saveButton, shadows.md]} onPress={saveCardio} activeOpacity={0.8}>
          <LinearGradient colors={[colors.accent, '#e36414']} style={styles.saveGradient}>
            <Ionicons name={saved ? 'checkmark-circle' : 'save'} size={20} color="#fff" />
            <Text style={styles.saveText}>{saved ? 'Updated' : 'Save Today\'s Cardio'}</Text>
          </LinearGradient>
        </TouchableOpacity>

        {/* History */}
        {weekHistory.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Recent History</Text>
            {weekHistory.map((day) => (
              <View key={day.date} style={[styles.historyCard, shadows.sm]}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.historyDate}>
                    {new Date(day.date + 'T12:00:00').toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })}
                  </Text>
                  <Text style={styles.historyDetail}>
                    {day.cardioType} - {day.cardioMinutes} mins | {(day.steps || 0).toLocaleString()} steps
                  </Text>
                </View>
                {day.date === today && <Ionicons name="today" size={18} color={colors.primary} />}
              </View>
            ))}
          </>
        )}
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.md, paddingBottom: spacing.xxl },
  summaryCard: { backgroundColor: colors.surface, borderRadius: borderRadius.lg, padding: spacing.lg, marginBottom: spacing.lg },
  summaryTitle: { color: colors.text, fontSize: fontSize.lg, fontWeight: '700', marginBottom: spacing.md },
  summaryRow: { flexDirection: 'row', gap: spacing.md },
  summaryItem: { flex: 1, alignItems: 'center' },
  summaryValue: { fontSize: fontSize.xl, fontWeight: '800', marginTop: spacing.xs },
  summaryLabel: { color: colors.textMuted, fontSize: fontSize.xs, marginTop: 2 },
  summaryDivider: { width: 1, backgroundColor: colors.border },
  sectionTitle: { color: colors.text, fontSize: fontSize.lg, fontWeight: '700', marginBottom: spacing.md, marginTop: spacing.md },
  label: { color: colors.textSecondary, fontSize: fontSize.sm, fontWeight: '600', marginBottom: spacing.xs, marginTop: spacing.md },
  typeGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.xs },
  typeChip: { paddingHorizontal: spacing.md, paddingVertical: spacing.sm, borderRadius: borderRadius.full, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border },
  typeChipActive: { backgroundColor: colors.accent, borderColor: colors.accent },
  typeText: { color: colors.textMuted, fontSize: fontSize.sm, fontWeight: '600' },
  typeTextActive: { color: '#fff' },
  counterRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.md },
  counterInput: { backgroundColor: colors.inputBackground, borderRadius: borderRadius.md, padding: spacing.md, color: colors.text, fontSize: fontSize.xxl, fontWeight: '800', textAlign: 'center', width: 100, borderWidth: 1, borderColor: colors.border },
  counterUnit: { color: colors.textMuted, fontSize: fontSize.md },
  input: { backgroundColor: colors.inputBackground, borderRadius: borderRadius.md, padding: spacing.md, color: colors.text, fontSize: fontSize.md, borderWidth: 1, borderColor: colors.border },
  saveButton: { borderRadius: borderRadius.md, overflow: 'hidden', marginTop: spacing.lg },
  saveGradient: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: spacing.md, gap: spacing.sm },
  saveText: { color: '#fff', fontSize: fontSize.md, fontWeight: '700' },
  historyCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface, borderRadius: borderRadius.md, padding: spacing.md, marginBottom: spacing.sm },
  historyDate: { color: colors.text, fontSize: fontSize.sm, fontWeight: '600' },
  historyDetail: { color: colors.textMuted, fontSize: fontSize.xs, marginTop: 2 },
});
