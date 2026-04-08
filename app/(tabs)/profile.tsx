import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Image, Linking, TextInput, Modal, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { doc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import * as ImagePicker from 'expo-image-picker';
import { useAuth } from '../../context/AuthContext';
import { db, storage } from '../../lib/firebase';
import { OnboardingInfo } from '../../types';
import { Button } from '../../components/ui/Button';
import { colors, spacing, fontSize, borderRadius, shadows, gradients } from '../../components/ui/theme';
import { scheduleWeeklyCheckIn, getDayNumber } from '../../lib/notifications';
import { useTheme } from '../../context/ThemeContext';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export default function ProfileScreen() {
  const { profile, isOwner, signOut, deleteAccount } = useAuth();
  const { mode, toggleTheme, isDark } = useTheme();
  const [selectedDay, setSelectedDay] = useState(profile?.checkInDay || 'Monday');
  const [photoURL, setPhotoURL] = useState(profile?.photoURL || '');
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletePassword, setDeletePassword] = useState('');
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  const handlePhotoUpload = async () => {
    if (!profile) return;
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });
    if (result.canceled || !result.assets[0]) return;
    setUploadingPhoto(true);
    try {
      const resp = await fetch(result.assets[0].uri);
      const blob = await resp.blob();
      const path = `profile-photos/${profile.uid}/avatar.jpg`;
      const storageRef = ref(storage, path);
      await uploadBytes(storageRef, blob);
      const url = await getDownloadURL(storageRef);
      await updateDoc(doc(db, 'users', profile.uid), { photoURL: url });
      setPhotoURL(url);
    } catch { /* silent */ }
    finally { setUploadingPhoto(false); }
  };

  const handleDayChange = async (day: string) => {
    setSelectedDay(day);
    if (profile) {
      try {
        await updateDoc(doc(db, 'users', profile.uid), { checkInDay: day });
        await scheduleWeeklyCheckIn(getDayNumber(day));
      } catch (err) {
        // handle error silently
      }
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      router.replace('/(auth)/login');
    } catch (err) {
      Alert.alert('Error', 'Failed to sign out');
    }
  };

  const handleDeleteAccount = async () => {
    if (!deletePassword.trim()) {
      setDeleteError('Please enter your password');
      return;
    }
    setDeleting(true);
    setDeleteError('');
    try {
      await deleteAccount(deletePassword);
      setShowDeleteModal(false);
      router.replace('/(auth)/login');
    } catch (err: any) {
      if (err?.code === 'auth/wrong-password' || err?.code === 'auth/invalid-credential') {
        setDeleteError('Incorrect password. Please try again.');
      } else {
        setDeleteError('Failed to delete account. Please try again.');
      }
    } finally {
      setDeleting(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Profile Header with Gradient */}
      <LinearGradient
        colors={[colors.primary + '30', colors.accent + '10', 'transparent']}
        style={styles.headerGradient}
      >
        <TouchableOpacity onPress={handlePhotoUpload} activeOpacity={0.8} style={styles.avatarRing}>
          {photoURL ? (
            <Image source={{ uri: photoURL }} style={{ width: 80, height: 80, borderRadius: 40 }} />
          ) : (
            <LinearGradient
              colors={[colors.primary, colors.accent]}
              style={styles.avatarGradient}
            >
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>
                  {profile?.name?.charAt(0).toUpperCase() || '?'}
                </Text>
              </View>
            </LinearGradient>
          )}
          <View style={{ position: 'absolute', bottom: 0, right: 0, backgroundColor: colors.primary, borderRadius: 12, width: 24, height: 24, justifyContent: 'center', alignItems: 'center' }}>
            <Ionicons name={uploadingPhoto ? 'hourglass' : 'camera'} size={12} color="#fff" />
          </View>
        </TouchableOpacity>
        <Text style={styles.name}>{profile?.name}</Text>
        <Text style={styles.email}>{profile?.email}</Text>
        <View style={styles.roleBadge}>
          <Ionicons
            name={isOwner ? 'shield-checkmark' : 'fitness'}
            size={12}
            color={colors.primary}
          />
          <Text style={styles.roleText}>
            {isOwner ? 'Coach' : 'Client'}
          </Text>
        </View>
      </LinearGradient>

      {/* Check-in Day */}
      <View style={[styles.section, shadows.sm]}>
        <View style={styles.sectionHeader}>
          <Ionicons name="notifications" size={20} color={colors.success} />
          <Text style={styles.sectionTitle}>Check-in Day</Text>
        </View>
        <Text style={styles.sectionSubtitle}>
          Weekly reminder on this day
        </Text>
        <View style={styles.dayGrid}>
          {DAYS.map((day) => (
            <TouchableOpacity
              key={day}
              style={[styles.dayChip, selectedDay === day && styles.dayChipActive]}
              onPress={() => handleDayChange(day)}
            >
              <Text style={[styles.dayText, selectedDay === day && styles.dayTextActive]}>
                {day.slice(0, 3)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* About Me */}
      {!isOwner && <AboutMeSection />}

      {/* Appearance */}
      <View style={[styles.section, shadows.sm]}>
        <View style={styles.sectionHeader}>
          <Ionicons name={isDark ? 'moon' : 'sunny'} size={20} color={colors.accent} />
          <Text style={styles.sectionTitle}>Appearance</Text>
        </View>
        <TouchableOpacity style={styles.themeToggle} onPress={toggleTheme}>
          <Text style={styles.themeToggleLabel}>{isDark ? 'Dark Mode' : 'Light Mode'}</Text>
          <View style={[styles.toggleTrack, !isDark && styles.toggleTrackLight]}>
            <View style={[styles.toggleThumb, !isDark && styles.toggleThumbLight]}>
              <Ionicons name={isDark ? 'moon' : 'sunny'} size={14} color={isDark ? colors.accent : '#f59e0b'} />
            </View>
          </View>
        </TouchableOpacity>
      </View>

      {/* Quick Links */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Ionicons name="grid" size={20} color={colors.primary} />
          <Text style={styles.sectionTitle}>Quick Links</Text>
        </View>
        {[
          { icon: 'card', color: colors.accent, title: 'Payments & Plan', sub: 'Manage your subscription', route: '/(tabs)/payments' },
          { icon: 'clipboard', color: colors.success, title: 'Weekly Check-In', sub: 'Submit your progress', route: '/checkin' },
        ].map((item, i) => (
          <TouchableOpacity
            key={i}
            style={[styles.menuItem, shadows.sm]}
            onPress={() => router.push(item.route as any)}
            activeOpacity={0.7}
          >
            <LinearGradient
              colors={[item.color + '20', 'transparent']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.menuGradient}
            >
              <View style={[styles.menuIcon, { backgroundColor: item.color + '20' }]}>
                <Ionicons name={item.icon as any} size={20} color={item.color} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.menuText}>{item.title}</Text>
                <Text style={styles.menuSubtext}>{item.sub}</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
            </LinearGradient>
          </TouchableOpacity>
        ))}
      </View>

      {/* Coach Tools */}
      {isOwner && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="settings" size={20} color={colors.accent} />
            <Text style={styles.sectionTitle}>Coach Tools</Text>
          </View>

          {[
            { icon: 'people', color: colors.primary, title: 'Manage Clients', sub: 'View & edit client profiles', route: '/admin/clients' },
            { icon: 'restaurant', color: colors.success, title: 'Set Meal Plans', sub: 'Create client diet plans', route: '/admin/mealplans' },
            { icon: 'barbell', color: '#8b5cf6', title: 'Set Workouts', sub: 'Create training programmes', route: '/admin/workouts' },
            { icon: 'clipboard', color: '#06b6d4', title: 'View Check-Ins', sub: 'Review client submissions', route: '/admin/checkins' },
            { icon: 'card', color: colors.accent, title: 'Subscriptions', sub: 'Set status & renewal dates', route: '/admin/subscriptions' },
            { icon: 'options', color: colors.accent, title: 'Nutrition Overrides', sub: 'Set macro targets', route: '/admin/overrides' },
            { icon: 'notifications', color: colors.warning, title: 'Send Notifications', sub: 'Push messages to clients', route: '/admin/notifications' },
          ].map((item, i) => (
            <TouchableOpacity
              key={i}
              style={[styles.menuItem, shadows.sm]}
              onPress={() => router.push(item.route as any)}
              activeOpacity={0.7}
            >
              <LinearGradient
                colors={[item.color + '20', 'transparent']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.menuGradient}
              >
                <View style={[styles.menuIcon, { backgroundColor: item.color + '20' }]}>
                  <Ionicons name={item.icon as any} size={20} color={item.color} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.menuText}>{item.title}</Text>
                  <Text style={styles.menuSubtext}>{item.sub}</Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
              </LinearGradient>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Legal */}
      <TouchableOpacity
        style={styles.legalLink}
        onPress={() => Linking.openURL('https://thtraining.com/privacy')}
      >
        <Ionicons name="shield-checkmark-outline" size={16} color={colors.textMuted} />
        <Text style={styles.legalText}>Privacy Policy</Text>
      </TouchableOpacity>

      <Button
        title="Sign Out"
        variant="outline"
        onPress={handleSignOut}
        style={{ marginTop: spacing.md }}
      />

      {/* Delete Account */}
      <TouchableOpacity
        style={styles.deleteLink}
        onPress={() => {
          setDeletePassword('');
          setDeleteError('');
          setShowDeleteModal(true);
        }}
      >
        <Ionicons name="trash-outline" size={16} color={colors.error} />
        <Text style={styles.deleteText}>Delete Account</Text>
      </TouchableOpacity>

      <Text style={styles.version}>TH Hub v1.0.0</Text>

      {/* Delete Account Modal */}
      <Modal visible={showDeleteModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalIconRow}>
              <View style={styles.modalIconCircle}>
                <Ionicons name="warning" size={28} color={colors.error} />
              </View>
            </View>
            <Text style={styles.modalTitle}>Delete Account</Text>
            <Text style={styles.modalDesc}>
              This will permanently delete your account and all associated data including meal plans, progress photos, check-ins, and workout history. This action cannot be undone.
            </Text>
            <TextInput
              style={styles.modalInput}
              value={deletePassword}
              onChangeText={setDeletePassword}
              placeholder="Enter your password to confirm"
              placeholderTextColor={colors.textMuted}
              secureTextEntry
              autoCapitalize="none"
              editable={!deleting}
            />
            {deleteError ? <Text style={styles.modalError}>{deleteError}</Text> : null}
            <TouchableOpacity
              style={[styles.deleteBtn, deleting && { opacity: 0.5 }]}
              onPress={handleDeleteAccount}
              disabled={deleting}
              activeOpacity={0.8}
            >
              {deleting ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <Text style={styles.deleteBtnText}>Permanently Delete Account</Text>
              )}
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalCancel}
              onPress={() => setShowDeleteModal(false)}
              disabled={deleting}
            >
              <Text style={styles.modalCancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

function AboutMeSection() {
  const { profile } = useAuth();
  const [expanded, setExpanded] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const existing = profile?.onboarding || {};
  const [mainGoal, setMainGoal] = useState(existing.mainGoal || '');
  const [motivation, setMotivation] = useState(existing.motivation || '');
  const [experience, setExperience] = useState(existing.experience || '');
  const [trainingDays, setTrainingDays] = useState(existing.trainingDays || '');
  const [healthConditions, setHealthConditions] = useState(existing.healthConditions || '');
  const [dietaryRequirements, setDietaryRequirements] = useState(existing.dietaryRequirements || '');
  const [additionalNotes, setAdditionalNotes] = useState(existing.additionalNotes || '');

  const hasInfo = existing.mainGoal || existing.motivation || existing.experience;

  const handleSave = async () => {
    if (!profile) return;
    setSaving(true);
    try {
      const onboarding: Record<string, any> = { completedAt: Date.now() };
      if (mainGoal) onboarding.mainGoal = mainGoal;
      if (motivation) onboarding.motivation = motivation;
      if (experience) onboarding.experience = experience;
      if (trainingDays) onboarding.trainingDays = trainingDays;
      if (healthConditions) onboarding.healthConditions = healthConditions;
      if (dietaryRequirements) onboarding.dietaryRequirements = dietaryRequirements;
      if (additionalNotes) onboarding.additionalNotes = additionalNotes;
      await updateDoc(doc(db, 'users', profile.uid), { onboarding });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err: any) {
      Alert.alert('Error', err?.message || 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const AboutField = ({ label, value, onChangeText, placeholder, multiline }: {
    label: string; value: string; onChangeText: (v: string) => void; placeholder: string; multiline?: boolean;
  }) => (
    <View style={{ marginBottom: spacing.md }}>
      <Text style={{ color: colors.textSecondary, fontSize: fontSize.sm, fontWeight: '600', marginBottom: 4 }}>{label}</Text>
      <TextInput
        style={{ backgroundColor: colors.inputBackground, borderRadius: borderRadius.sm, padding: spacing.sm, color: colors.text, fontSize: fontSize.sm, borderWidth: 1, borderColor: colors.border, ...(multiline ? { minHeight: 70, textAlignVertical: 'top' as const } : {}) }}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.textMuted}
        multiline={multiline}
      />
    </View>
  );

  return (
    <View style={[aboutStyles.container, shadows.sm]}>
      <TouchableOpacity style={aboutStyles.header} onPress={() => setExpanded(!expanded)} activeOpacity={0.7}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}>
          <Ionicons name="person-circle" size={20} color={colors.primary} />
          <Text style={aboutStyles.title}>About Me</Text>
          {!hasInfo && (
            <View style={{ backgroundColor: colors.accent + '30', paddingHorizontal: spacing.sm, paddingVertical: 2, borderRadius: borderRadius.full }}>
              <Text style={{ color: colors.accent, fontSize: fontSize.xs, fontWeight: '700' }}>Not filled in</Text>
            </View>
          )}
        </View>
        <Ionicons name={expanded ? 'chevron-up' : 'chevron-down'} size={18} color={colors.textMuted} />
      </TouchableOpacity>

      {expanded && (
        <View style={aboutStyles.body}>
          <Text style={{ color: colors.textMuted, fontSize: fontSize.xs, marginBottom: spacing.md }}>
            This info helps your coach create the best plan for you.
          </Text>
          <AboutField label="Main Goal" value={mainGoal} onChangeText={setMainGoal} placeholder="e.g. Lose weight, build muscle" />
          <AboutField label="What's Driving You?" value={motivation} onChangeText={setMotivation} placeholder="e.g. Health, confidence, holiday" />
          <AboutField label="Training Experience" value={experience} onChangeText={setExperience} placeholder="e.g. Beginner, intermediate" />
          <AboutField label="Training Days per Week" value={trainingDays} onChangeText={setTrainingDays} placeholder="e.g. 4 days" />
          <AboutField label="Injuries or Health Conditions" value={healthConditions} onChangeText={setHealthConditions} placeholder="e.g. Bad knee — or 'none'" multiline />
          <AboutField label="Dietary Requirements" value={dietaryRequirements} onChangeText={setDietaryRequirements} placeholder="e.g. Vegetarian — or 'none'" multiline />
          <AboutField label="Anything Else for Your Coach" value={additionalNotes} onChangeText={setAdditionalNotes} placeholder="Schedule, preferences..." multiline />
          <TouchableOpacity
            style={{ backgroundColor: colors.primary, borderRadius: borderRadius.md, paddingVertical: spacing.sm + 2, alignItems: 'center', opacity: saving ? 0.5 : 1 }}
            onPress={handleSave}
            disabled={saving}
            activeOpacity={0.8}
          >
            <Text style={{ color: '#fff', fontWeight: '700', fontSize: fontSize.md }}>
              {saved ? 'Saved!' : saving ? 'Saving...' : 'Save'}
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const aboutStyles = StyleSheet.create({
  container: { backgroundColor: colors.surface, borderRadius: borderRadius.lg, marginHorizontal: spacing.md, marginBottom: spacing.md, overflow: 'hidden' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: spacing.md },
  title: { color: colors.text, fontSize: fontSize.md, fontWeight: '700' },
  body: { borderTopWidth: 1, borderTopColor: colors.border, padding: spacing.md },
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    paddingBottom: spacing.xxl,
  },
  headerGradient: {
    alignItems: 'center',
    paddingTop: spacing.xl,
    paddingBottom: spacing.xl,
    paddingHorizontal: spacing.lg,
  },
  avatarRing: {
    marginBottom: spacing.md,
  },
  avatarGradient: {
    width: 96,
    height: 96,
    borderRadius: 48,
    padding: 3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#fff',
    fontSize: fontSize.xxl,
    fontWeight: '800',
  },
  name: {
    color: colors.text,
    fontSize: fontSize.xl,
    fontWeight: '700',
  },
  email: {
    color: colors.textSecondary,
    fontSize: fontSize.sm,
    marginTop: spacing.xs,
  },
  roleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary + '20',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
    marginTop: spacing.sm,
    gap: 4,
  },
  roleText: {
    color: colors.primary,
    fontSize: fontSize.xs,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  section: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.lg,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.xs,
  },
  sectionTitle: {
    color: colors.text,
    fontSize: fontSize.lg,
    fontWeight: '700',
  },
  sectionSubtitle: {
    color: colors.textMuted,
    fontSize: fontSize.sm,
    marginBottom: spacing.md,
    marginLeft: spacing.xl + spacing.sm,
  },
  dayGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  dayChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    backgroundColor: colors.surfaceLight,
    borderWidth: 1,
    borderColor: colors.border,
  },
  dayChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  dayText: {
    color: colors.textMuted,
    fontSize: fontSize.sm,
    fontWeight: '600',
  },
  dayTextActive: {
    color: '#fff',
  },
  menuItem: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    overflow: 'hidden',
    marginBottom: spacing.sm,
  },
  menuGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
  },
  menuIcon: {
    width: 38,
    height: 38,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  menuText: {
    color: colors.text,
    fontSize: fontSize.md,
    fontWeight: '600',
  },
  menuSubtext: {
    color: colors.textMuted,
    fontSize: fontSize.xs,
    marginTop: 1,
  },
  themeToggle: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  themeToggleLabel: { color: colors.text, fontSize: fontSize.md, fontWeight: '500' },
  toggleTrack: { width: 52, height: 30, borderRadius: 15, backgroundColor: colors.surfaceLight, justifyContent: 'center', paddingHorizontal: 3 },
  toggleTrackLight: { backgroundColor: '#fef3c7' },
  toggleThumb: { width: 24, height: 24, borderRadius: 12, backgroundColor: colors.surface, justifyContent: 'center', alignItems: 'center', alignSelf: 'flex-end' },
  toggleThumbLight: { alignSelf: 'flex-start', backgroundColor: '#fff' },
  legalLink: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    marginTop: spacing.lg,
    paddingVertical: spacing.sm,
  },
  legalText: {
    color: colors.textMuted,
    fontSize: fontSize.sm,
  },
  version: {
    color: colors.textMuted,
    fontSize: fontSize.xs,
    textAlign: 'center',
    marginTop: spacing.md,
    marginBottom: spacing.lg,
  },
  deleteLink: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    marginTop: spacing.lg,
    paddingVertical: spacing.sm,
  },
  deleteText: {
    color: colors.error,
    fontSize: fontSize.sm,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  modalContent: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.xl,
    width: '100%',
    maxWidth: 400,
  },
  modalIconRow: {
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  modalIconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: (colors.error) + '15',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalTitle: {
    color: colors.text,
    fontSize: fontSize.lg,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  modalDesc: {
    color: colors.textMuted,
    fontSize: fontSize.sm,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: spacing.lg,
  },
  modalInput: {
    backgroundColor: colors.inputBackground,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    color: colors.text,
    fontSize: fontSize.sm,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.sm,
  },
  modalError: {
    color: colors.error,
    fontSize: fontSize.xs,
    marginBottom: spacing.sm,
  },
  deleteBtn: {
    backgroundColor: colors.error,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.sm + 4,
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  deleteBtnText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: fontSize.md,
  },
  modalCancel: {
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  modalCancelText: {
    color: colors.textMuted,
    fontSize: fontSize.sm,
    fontWeight: '600',
  },
});
