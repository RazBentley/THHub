import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Alert,
  Dimensions, ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Stack } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { doc, getDoc, setDoc, collection, getDocs } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import { db, storage } from '../lib/firebase';
import { colors, spacing, fontSize, borderRadius, shadows } from '../components/ui/theme';

const screenWidth = Dimensions.get('window').width;
const photoSize = (screenWidth - spacing.md * 4) / 3;

interface ProgressPhotoSet {
  date: string;
  front?: string;
  side?: string;
  back?: string;
  submittedAt: number;
}

type PhotoAngle = 'front' | 'side' | 'back';

export default function ProgressPhotosScreen() {
  const { profile, isOwner } = useAuth();
  const [photoSets, setPhotoSets] = useState<ProgressPhotoSet[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState<PhotoAngle | null>(null);
  const [currentSet, setCurrentSet] = useState<ProgressPhotoSet | null>(null);
  const [compareMode, setCompareMode] = useState(false);
  const [compareIndex1, setCompareIndex1] = useState(0);
  const [compareIndex2, setCompareIndex2] = useState(0);

  const today = new Date().toISOString().split('T')[0];

  useEffect(() => { loadPhotos(); }, []);

  async function loadPhotos() {
    if (!profile) return;
    try {
      const snap = await getDocs(collection(db, 'users', profile.uid, 'progressPhotos'));
      const sets: ProgressPhotoSet[] = [];
      snap.forEach((d) => sets.push(d.data() as ProgressPhotoSet));
      sets.sort((a, b) => (b.submittedAt || 0) - (a.submittedAt || 0));
      setPhotoSets(sets);

      // Find or create today's set
      const todaySet = sets.find(s => s.date === today);
      setCurrentSet(todaySet || { date: today, submittedAt: Date.now() });

      if (sets.length >= 2) {
        setCompareIndex1(sets.length - 1); // oldest
        setCompareIndex2(0); // newest
      }
    } catch { /* silent */ }
    finally { setLoading(false); }
  }

  const takePhoto = async (angle: PhotoAngle) => {
    if (!profile) return;

    const permResult = await ImagePicker.requestCameraPermissionsAsync();
    if (!permResult.granted) return;

    const result = await ImagePicker.launchCameraAsync({
      quality: 0.7,
      allowsEditing: true,
      aspect: [3, 4],
    });

    if (result.canceled || !result.assets[0]) return;

    setUploading(angle);
    try {
      const response = await fetch(result.assets[0].uri);
      const blob = await response.blob();

      const filename = `progress-photos/${profile.uid}/${today}_${angle}.jpg`;
      const storageRef = ref(storage, filename);
      await uploadBytes(storageRef, blob);
      const downloadUrl = await getDownloadURL(storageRef);

      const updatedSet: ProgressPhotoSet = {
        ...currentSet!,
        [angle]: downloadUrl,
        submittedAt: Date.now(),
      };
      setCurrentSet(updatedSet);

      await setDoc(doc(db, 'users', profile.uid, 'progressPhotos', today), updatedSet);
      await loadPhotos();
    } catch (err) {
      Alert.alert('Error', 'Failed to upload photo');
    } finally {
      setUploading(null);
    }
  };

  const pickPhoto = async (angle: PhotoAngle) => {
    if (!profile) return;

    const permResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permResult.granted) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      quality: 0.7,
      allowsEditing: true,
      aspect: [3, 4],
    });

    if (result.canceled || !result.assets[0]) return;

    setUploading(angle);
    try {
      const response = await fetch(result.assets[0].uri);
      const blob = await response.blob();

      const filename = `progress-photos/${profile.uid}/${today}_${angle}.jpg`;
      const storageRef = ref(storage, filename);
      await uploadBytes(storageRef, blob);
      const downloadUrl = await getDownloadURL(storageRef);

      const updatedSet: ProgressPhotoSet = {
        ...currentSet!,
        [angle]: downloadUrl,
        submittedAt: Date.now(),
      };
      setCurrentSet(updatedSet);

      await setDoc(doc(db, 'users', profile.uid, 'progressPhotos', today), updatedSet);
      await loadPhotos();
    } catch (err) {
      Alert.alert('Error', 'Failed to upload photo');
    } finally {
      setUploading(null);
    }
  };

  const showPhotoOptions = (angle: PhotoAngle) => {
    Alert.alert(
      `${angle.charAt(0).toUpperCase() + angle.slice(1)} Photo`,
      'How would you like to add this photo?',
      [
        { text: 'Take Photo', onPress: () => takePhoto(angle) },
        { text: 'Choose from Gallery', onPress: () => pickPhoto(angle) },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const renderPhotoSlot = (angle: PhotoAngle, url?: string) => (
    <TouchableOpacity
      style={styles.photoSlot}
      onPress={() => showPhotoOptions(angle)}
      activeOpacity={0.7}
    >
      {uploading === angle ? (
        <View style={styles.photoUploading}>
          <ActivityIndicator color={colors.primary} />
          <Text style={styles.uploadingText}>Uploading...</Text>
        </View>
      ) : url ? (
        <Image source={{ uri: url }} style={styles.photoImage} resizeMode="cover" />
      ) : (
        <View style={styles.photoEmpty}>
          <Ionicons name="camera" size={28} color={colors.textMuted} />
          <Text style={styles.photoLabel}>{angle.charAt(0).toUpperCase() + angle.slice(1)}</Text>
        </View>
      )}
      <View style={styles.photoAngleBadge}>
        <Text style={styles.photoAngleText}>{angle.charAt(0).toUpperCase() + angle.slice(1)}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <>
      <Stack.Screen options={{ headerBackTitle: ' ', headerShown: true, title: 'Progress Photos', headerStyle: { backgroundColor: colors.secondary }, headerTintColor: colors.text }} />
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>

        {/* Today's Photos */}
        <Text style={styles.sectionTitle}>Today's Photos</Text>
        <Text style={styles.sectionSubtext}>Take front, side, and back photos to track your transformation</Text>

        <View style={styles.photoRow}>
          {renderPhotoSlot('front', currentSet?.front)}
          {renderPhotoSlot('side', currentSet?.side)}
          {renderPhotoSlot('back', currentSet?.back)}
        </View>

        {/* Compare Mode */}
        {photoSets.length >= 2 && (
          <>
            <TouchableOpacity
              style={[styles.compareButton, shadows.sm]}
              onPress={() => setCompareMode(!compareMode)}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={compareMode ? [colors.success, colors.success + 'CC'] : [colors.primary, colors.primaryDark]}
                style={styles.compareGradient}
              >
                <Ionicons name={compareMode ? 'close' : 'git-compare'} size={20} color="#fff" />
                <Text style={styles.compareText}>{compareMode ? 'Close Comparison' : 'Compare Progress'}</Text>
              </LinearGradient>
            </TouchableOpacity>

            {compareMode && (
              <View style={[styles.compareSection, shadows.sm]}>
                <Text style={styles.compareTitle}>Before & After</Text>

                {/* Date selectors */}
                <View style={styles.compareDates}>
                  <View style={styles.compareDatePicker}>
                    <Text style={styles.compareDateLabel}>Before</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                      {photoSets.map((set, i) => (
                        <TouchableOpacity
                          key={i}
                          style={[styles.compareDateChip, compareIndex1 === i && styles.compareDateChipActive]}
                          onPress={() => setCompareIndex1(i)}
                        >
                          <Text style={[styles.compareDateChipText, compareIndex1 === i && { color: '#fff' }]}>
                            {new Date(set.date + 'T12:00:00').toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                  </View>
                  <View style={styles.compareDatePicker}>
                    <Text style={styles.compareDateLabel}>After</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                      {photoSets.map((set, i) => (
                        <TouchableOpacity
                          key={i}
                          style={[styles.compareDateChip, compareIndex2 === i && styles.compareDateChipActive]}
                          onPress={() => setCompareIndex2(i)}
                        >
                          <Text style={[styles.compareDateChipText, compareIndex2 === i && { color: '#fff' }]}>
                            {new Date(set.date + 'T12:00:00').toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                  </View>
                </View>

                {/* Side by side comparison */}
                {['front', 'side', 'back'].map((angle) => {
                  const before = photoSets[compareIndex1]?.[angle as PhotoAngle];
                  const after = photoSets[compareIndex2]?.[angle as PhotoAngle];
                  if (!before && !after) return null;
                  return (
                    <View key={angle} style={styles.compareRow}>
                      <Text style={styles.compareAngle}>{angle.charAt(0).toUpperCase() + angle.slice(1)}</Text>
                      <View style={styles.compareImages}>
                        <View style={styles.compareImageWrap}>
                          {before ? (
                            <Image source={{ uri: before }} style={styles.compareImage} resizeMode="cover" />
                          ) : (
                            <View style={styles.compareNoImage}><Text style={styles.compareNoImageText}>No photo</Text></View>
                          )}
                          <Text style={styles.compareImageDate}>
                            {new Date(photoSets[compareIndex1]?.date + 'T12:00:00').toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                          </Text>
                        </View>
                        <Ionicons name="arrow-forward" size={20} color={colors.textMuted} />
                        <View style={styles.compareImageWrap}>
                          {after ? (
                            <Image source={{ uri: after }} style={styles.compareImage} resizeMode="cover" />
                          ) : (
                            <View style={styles.compareNoImage}><Text style={styles.compareNoImageText}>No photo</Text></View>
                          )}
                          <Text style={styles.compareImageDate}>
                            {new Date(photoSets[compareIndex2]?.date + 'T12:00:00').toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                          </Text>
                        </View>
                      </View>
                    </View>
                  );
                })}
              </View>
            )}
          </>
        )}

        {/* Photo History */}
        {photoSets.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Photo History</Text>
            {photoSets.map((set, i) => (
              <View key={i} style={[styles.historyCard, shadows.sm]}>
                <Text style={styles.historyDate}>
                  {new Date(set.date + 'T12:00:00').toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                </Text>
                <View style={styles.historyPhotos}>
                  {set.front && <Image source={{ uri: set.front }} style={styles.historyThumb} resizeMode="cover" />}
                  {set.side && <Image source={{ uri: set.side }} style={styles.historyThumb} resizeMode="cover" />}
                  {set.back && <Image source={{ uri: set.back }} style={styles.historyThumb} resizeMode="cover" />}
                  {!set.front && !set.side && !set.back && <Text style={styles.noPhotosText}>No photos</Text>}
                </View>
              </View>
            ))}
          </>
        )}
      </ScrollView>
    </>
  );
}

const compareImageWidth = (screenWidth - spacing.md * 4 - 40) / 2;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.md, paddingBottom: spacing.xxl },

  sectionTitle: { color: colors.text, fontSize: fontSize.lg, fontWeight: '700', marginTop: spacing.md, marginBottom: spacing.xs },
  sectionSubtext: { color: colors.textMuted, fontSize: fontSize.sm, marginBottom: spacing.md },

  // Photo slots
  photoRow: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.md },
  photoSlot: { flex: 1, aspectRatio: 3 / 4, borderRadius: borderRadius.lg, overflow: 'hidden', backgroundColor: colors.surface, position: 'relative' },
  photoImage: { width: '100%', height: '100%' },
  photoEmpty: { flex: 1, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: colors.border, borderStyle: 'dashed', borderRadius: borderRadius.lg },
  photoLabel: { color: colors.textMuted, fontSize: fontSize.xs, marginTop: spacing.xs },
  photoUploading: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  uploadingText: { color: colors.textMuted, fontSize: fontSize.xs, marginTop: spacing.xs },
  photoAngleBadge: { position: 'absolute', bottom: 6, left: 6, backgroundColor: 'rgba(0,0,0,0.6)', paddingHorizontal: spacing.sm, paddingVertical: 2, borderRadius: borderRadius.sm },
  photoAngleText: { color: '#fff', fontSize: 10, fontWeight: '700' },

  // Compare button
  compareButton: { borderRadius: borderRadius.md, overflow: 'hidden', marginBottom: spacing.md },
  compareGradient: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: spacing.md, gap: spacing.sm },
  compareText: { color: '#fff', fontSize: fontSize.md, fontWeight: '700' },

  // Compare section
  compareSection: { backgroundColor: colors.surface, borderRadius: borderRadius.lg, padding: spacing.md, marginBottom: spacing.md },
  compareTitle: { color: colors.text, fontSize: fontSize.md, fontWeight: '700', marginBottom: spacing.md },
  compareDates: { gap: spacing.sm, marginBottom: spacing.lg },
  compareDatePicker: {},
  compareDateLabel: { color: colors.textMuted, fontSize: fontSize.xs, fontWeight: '600', marginBottom: spacing.xs },
  compareDateChip: { paddingHorizontal: spacing.md, paddingVertical: spacing.xs, borderRadius: borderRadius.full, backgroundColor: colors.surfaceLight, marginRight: spacing.xs },
  compareDateChipActive: { backgroundColor: colors.primary },
  compareDateChipText: { color: colors.textMuted, fontSize: fontSize.xs, fontWeight: '600' },
  compareRow: { marginBottom: spacing.lg },
  compareAngle: { color: colors.textSecondary, fontSize: fontSize.xs, fontWeight: '700', textTransform: 'uppercase', marginBottom: spacing.sm },
  compareImages: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.sm },
  compareImageWrap: { alignItems: 'center' },
  compareImage: { width: compareImageWidth, height: compareImageWidth * 1.33, borderRadius: borderRadius.md },
  compareNoImage: { width: compareImageWidth, height: compareImageWidth * 1.33, borderRadius: borderRadius.md, backgroundColor: colors.surfaceLight, justifyContent: 'center', alignItems: 'center' },
  compareNoImageText: { color: colors.textMuted, fontSize: fontSize.xs },
  compareImageDate: { color: colors.textMuted, fontSize: fontSize.xs, marginTop: spacing.xs },

  // History
  historyCard: { backgroundColor: colors.surface, borderRadius: borderRadius.lg, padding: spacing.md, marginBottom: spacing.sm },
  historyDate: { color: colors.text, fontSize: fontSize.sm, fontWeight: '600', marginBottom: spacing.sm },
  historyPhotos: { flexDirection: 'row', gap: spacing.sm },
  historyThumb: { width: 70, height: 93, borderRadius: borderRadius.sm },
  noPhotosText: { color: colors.textMuted, fontSize: fontSize.xs },
});
