import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, Alert } from 'react-native';
import { Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { UserProfile } from '../../types';
import { Button } from '../../components/ui/Button';
import { colors, spacing, fontSize, borderRadius } from '../../components/ui/theme';

export default function NotificationsScreen() {
  const [clients, setClients] = useState<UserProfile[]>([]);
  const [selectedClients, setSelectedClients] = useState<string[]>([]);
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);

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
      // handle silently
    }
  }

  const toggleClient = (uid: string) => {
    setSelectedClients((prev) =>
      prev.includes(uid) ? prev.filter((id) => id !== uid) : [...prev, uid]
    );
  };

  const selectAll = () => {
    if (selectedClients.length === clients.length) {
      setSelectedClients([]);
    } else {
      setSelectedClients(clients.map((c) => c.uid));
    }
  };

  const sendNotification = async () => {
    if (!title.trim() || !message.trim()) {
      Alert.alert('Error', 'Please enter a title and message');
      return;
    }
    if (selectedClients.length === 0) {
      Alert.alert('Error', 'Please select at least one client');
      return;
    }

    setSending(true);
    try {
      // In production, this would call a Firebase Cloud Function
      // that sends push notifications via FCM to selected clients' tokens
      const selectedNames = clients
        .filter((c) => selectedClients.includes(c.uid))
        .map((c) => c.name);

      Alert.alert(
        'Notification Preview',
        `To: ${selectedNames.join(', ')}\n\nTitle: ${title}\nMessage: ${message}\n\n` +
        'To send real notifications, deploy the Firebase Cloud Function for push notifications.',
        [{ text: 'OK' }]
      );
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      <Stack.Screen options={{ title: 'Send Notifications' }} />
      <View style={styles.container}>
        <View style={styles.formSection}>
          <Text style={styles.label}>Notification Title</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. Check-in Reminder"
            placeholderTextColor={colors.textMuted}
            value={title}
            onChangeText={setTitle}
          />

          <Text style={styles.label}>Message</Text>
          <TextInput
            style={[styles.input, styles.messageInput]}
            placeholder="Write your notification message..."
            placeholderTextColor={colors.textMuted}
            value={message}
            onChangeText={setMessage}
            multiline
            numberOfLines={3}
          />
        </View>

        <View style={styles.clientsHeader}>
          <Text style={styles.label}>
            Select Clients ({selectedClients.length}/{clients.length})
          </Text>
          <TouchableOpacity onPress={selectAll}>
            <Text style={styles.selectAllText}>
              {selectedClients.length === clients.length ? 'Deselect All' : 'Select All'}
            </Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={clients}
          keyExtractor={(item) => item.uid}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => {
            const selected = selectedClients.includes(item.uid);
            return (
              <TouchableOpacity
                style={[styles.clientItem, selected && styles.clientItemSelected]}
                onPress={() => toggleClient(item.uid)}
              >
                <Ionicons
                  name={selected ? 'checkbox' : 'square-outline'}
                  size={22}
                  color={selected ? colors.primary : colors.textMuted}
                />
                <Text style={styles.clientName}>{item.name}</Text>
                {item.fcmToken && (
                  <Ionicons name="notifications" size={16} color={colors.success} />
                )}
              </TouchableOpacity>
            );
          }}
        />

        <View style={styles.footer}>
          <Button
            title={`Send to ${selectedClients.length} Client${selectedClients.length !== 1 ? 's' : ''}`}
            onPress={sendNotification}
            loading={sending}
            disabled={selectedClients.length === 0 || !title.trim() || !message.trim()}
          />
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  formSection: {
    padding: spacing.md,
  },
  label: {
    color: colors.textSecondary,
    fontSize: fontSize.sm,
    fontWeight: '600',
    marginBottom: spacing.xs,
    marginTop: spacing.sm,
  },
  input: {
    backgroundColor: colors.inputBackground,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    color: colors.text,
    fontSize: fontSize.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  messageInput: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  clientsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    marginTop: spacing.md,
  },
  selectAllText: {
    color: colors.primary,
    fontSize: fontSize.sm,
    fontWeight: '600',
  },
  list: {
    padding: spacing.md,
    paddingTop: spacing.sm,
  },
  clientItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: borderRadius.sm,
    marginBottom: spacing.xs,
    gap: spacing.sm,
  },
  clientItemSelected: {
    borderWidth: 1,
    borderColor: colors.primary + '40',
  },
  clientName: {
    color: colors.text,
    fontSize: fontSize.md,
    flex: 1,
  },
  footer: {
    padding: spacing.md,
    paddingBottom: spacing.lg,
  },
});
