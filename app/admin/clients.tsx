import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Stack, router } from 'expo-router';
import { collection, query, where, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { UserProfile } from '../../types';
import { colors, spacing, fontSize, borderRadius } from '../../components/ui/theme';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export default function ClientsScreen() {
  const [clients, setClients] = useState<UserProfile[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadClients();
  }, []);

  async function loadClients() {
    try {
      const snap = await getDocs(
        query(collection(db, 'users'), where('role', '==', 'client'))
      );
      const list: UserProfile[] = [];
      snap.forEach((doc) => list.push(doc.data() as UserProfile));
      list.sort((a, b) => a.name.localeCompare(b.name));
      setClients(list);
    } catch (err) {
      Alert.alert('Error', 'Failed to load clients');
    } finally {
      setLoading(false);
    }
  }

  const updateCheckInDay = async (uid: string, day: string) => {
    try {
      await updateDoc(doc(db, 'users', uid), { checkInDay: day });
      setClients((prev) =>
        prev.map((c) => (c.uid === uid ? { ...c, checkInDay: day } : c))
      );
    } catch (err) {
      Alert.alert('Error', 'Failed to update check-in day');
    }
  };

  const filteredClients = clients.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <Stack.Screen options={{ title: 'Manage Clients' }} />
      <View style={styles.container}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color={colors.textMuted} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search clients..."
            placeholderTextColor={colors.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        <Text style={styles.count}>{filteredClients.length} client{filteredClients.length !== 1 ? 's' : ''}</Text>

        <FlatList
          data={filteredClients}
          keyExtractor={(item) => item.uid}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.clientCard} onPress={() => router.push(`/admin/client-profile?uid=${item.uid}`)} activeOpacity={0.7}>
              <View style={styles.clientHeader}>
                <View style={styles.clientAvatar}>
                  <Text style={styles.avatarText}>{item.name.charAt(0).toUpperCase()}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.clientName}>{item.name}</Text>
                  <Text style={styles.clientEmail}>{item.email}</Text>
                </View>
                {/* Navigates to the chat list rather than a specific chat because
                   the chat ID is not available from the client profile alone --
                   the coach can then select the correct conversation from the list. */}
                <TouchableOpacity
                  onPress={() => {
                    router.push('/(tabs)/messages');
                  }}
                >
                  <Ionicons name="chatbubble" size={22} color={colors.primary} />
                </TouchableOpacity>
              </View>

              <View style={styles.checkInSection}>
                <Text style={styles.checkInLabel}>Check-in Day:</Text>
                <View style={styles.dayChips}>
                  {DAYS.map((day) => (
                    <TouchableOpacity
                      key={day}
                      style={[styles.dayChip, item.checkInDay === day && styles.dayChipActive]}
                      onPress={() => updateCheckInDay(item.uid, day)}
                    >
                      <Text style={[styles.dayChipText, item.checkInDay === day && styles.dayChipTextActive]}>
                        {day.slice(0, 2)}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <Text style={styles.joinDate}>
                Joined: {new Date(item.createdAt).toLocaleDateString('en-GB')}
              </Text>
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>No clients found</Text>
            </View>
          }
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.inputBackground,
    margin: spacing.md,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  searchInput: {
    flex: 1,
    color: colors.text,
    fontSize: fontSize.md,
    paddingVertical: spacing.md,
    marginLeft: spacing.sm,
  },
  count: {
    color: colors.textMuted,
    fontSize: fontSize.sm,
    marginHorizontal: spacing.md,
    marginBottom: spacing.sm,
  },
  list: {
    padding: spacing.md,
    paddingTop: 0,
  },
  clientCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  clientHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  clientAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  avatarText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: fontSize.md,
  },
  clientName: {
    color: colors.text,
    fontSize: fontSize.md,
    fontWeight: '600',
  },
  clientEmail: {
    color: colors.textMuted,
    fontSize: fontSize.xs,
    marginTop: 2,
  },
  checkInSection: {
    marginBottom: spacing.sm,
  },
  checkInLabel: {
    color: colors.textSecondary,
    fontSize: fontSize.xs,
    marginBottom: spacing.xs,
  },
  dayChips: {
    flexDirection: 'row',
    gap: spacing.xs,
  },
  dayChip: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.surfaceLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dayChipActive: {
    backgroundColor: colors.primary,
  },
  dayChipText: {
    color: colors.textMuted,
    fontSize: fontSize.xs,
    fontWeight: '600',
  },
  dayChipTextActive: {
    color: '#fff',
  },
  joinDate: {
    color: colors.textMuted,
    fontSize: fontSize.xs,
  },
  emptyState: {
    alignItems: 'center',
    padding: spacing.xxl,
  },
  emptyText: {
    color: colors.textMuted,
    fontSize: fontSize.md,
  },
});
