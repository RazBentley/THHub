import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, Modal, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { collection, query, where, onSnapshot, orderBy, getDocs, addDoc } from 'firebase/firestore';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../lib/firebase';
import { Chat, UserProfile } from '../../types';
import { colors, spacing, fontSize, borderRadius } from '../../components/ui/theme';

export default function MessagesScreen() {
  const { profile, isOwner } = useAuth();
  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!profile) return;

    const chatsQuery = query(
      collection(db, 'chats'),
      where('participants', 'array-contains', profile.uid)
    );

    const unsubscribe = onSnapshot(chatsQuery, (snapshot) => {
      const chatList: Chat[] = [];
      snapshot.forEach((doc) => {
        chatList.push({ id: doc.id, ...doc.data() } as Chat);
      });
      // Sort client-side to avoid needing a composite index
      chatList.sort((a, b) => (b.lastMessageTime || 0) - (a.lastMessageTime || 0));
      setChats(chatList);
      setLoading(false);

      // Auto-create chat with coach for clients with no chats
      if (!isOwner && chatList.length === 0) {
        autoCreateChat();
      }
    }, (error) => {
      // Chat query failed
      setLoading(false);
    });

    return unsubscribe;
  }, [profile]);

  // Coach new chat state
  const [showNewChat, setShowNewChat] = useState(false);
  const [allClients, setAllClients] = useState<UserProfile[]>([]);
  const [clientSearch, setClientSearch] = useState('');

  const openNewChatModal = async () => {
    setShowNewChat(true);
    setClientSearch('');
    try {
      const snap = await getDocs(query(collection(db, 'users'), where('role', '==', 'client')));
      setAllClients(snap.docs.map(d => d.data() as UserProfile).sort((a, b) => a.name.localeCompare(b.name)));
    } catch { /* silent */ }
  };

  const startChatWithClient = async (client: UserProfile) => {
    if (!profile) return;
    // Check if chat already exists
    const existing = chats.find(c => c.participants.includes(client.uid));
    if (existing) {
      setShowNewChat(false);
      router.push(`/chat/${existing.id}`);
      return;
    }
    try {
      const newChat = await addDoc(collection(db, 'chats'), {
        participants: [profile.uid, client.uid],
        clientName: client.name,
        lastMessage: '',
        lastMessageTime: Date.now(),
        unreadCount: 0,
      });
      setShowNewChat(false);
      router.push(`/chat/${newChat.id}`);
    } catch { /* silent */ }
  };

  const autoCreateChat = async () => {
    if (!profile || isOwner) return;
    try {
      const ownerQuery = query(collection(db, 'users'), where('role', '==', 'owner'));
      const ownerSnap = await getDocs(ownerQuery);
      if (ownerSnap.empty) return;
      const ownerDoc = ownerSnap.docs[0];
      await addDoc(collection(db, 'chats'), {
        participants: [ownerDoc.id, profile.uid],
        clientName: profile.name,
        lastMessage: '',
        lastMessageTime: Date.now(),
        unreadCount: 0,
      });
    } catch { /* silent */ }
  };

  const startNewChat = async () => {
    // For clients: create or find chat with owner
    if (!profile || isOwner) return;
    try {
      // Check if chat already exists
      const existingQuery = query(
        collection(db, 'chats'),
        where('participants', 'array-contains', profile.uid)
      );
      const existing = await getDocs(existingQuery);
      if (!existing.empty) {
        router.push(`/chat/${existing.docs[0].id}`);
        return;
      }

      // Find owner
      const ownerQuery = query(collection(db, 'users'), where('role', '==', 'owner'));
      const ownerSnap = await getDocs(ownerQuery);
      if (ownerSnap.empty) return;

      const ownerDoc = ownerSnap.docs[0];
      const newChat = await addDoc(collection(db, 'chats'), {
        participants: [ownerDoc.id, profile.uid],
        clientName: profile.name,
        lastMessage: '',
        lastMessageTime: Date.now(),
        unreadCount: 0,
      });

      router.push(`/chat/${newChat.id}`);
    } catch (err) {
      // handle silently
    }
  };

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();

    if (diff < 86400000) {
      return date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
    }
    if (diff < 604800000) {
      return date.toLocaleDateString('en-GB', { weekday: 'short' });
    }
    return date.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit' });
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {chats.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="chatbubbles-outline" size={64} color={colors.textMuted} />
          <Text style={styles.emptyText}>No conversations yet</Text>
          {!isOwner && (
            <TouchableOpacity style={styles.startChatButton} onPress={startNewChat}>
              <Text style={styles.startChatText}>Message Your Coach</Text>
            </TouchableOpacity>
          )}
        </View>
      ) : (
        <FlatList
          data={chats}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.chatItem}
              onPress={() => router.push(`/chat/${item.id}`)}
            >
              <View style={styles.chatAvatar}>
                <Text style={styles.chatAvatarText}>
                  {item.clientName?.charAt(0).toUpperCase() || '?'}
                </Text>
              </View>
              <View style={styles.chatContent}>
                <View style={styles.chatHeader}>
                  <Text style={styles.chatName}>{item.clientName}</Text>
                  <Text style={styles.chatTime}>{formatTime(item.lastMessageTime)}</Text>
                </View>
                <Text style={styles.chatMessage} numberOfLines={1}>
                  {item.lastMessage || 'Start a conversation'}
                </Text>
              </View>
              {item.unreadCount > 0 && (
                <View style={styles.unreadBadge}>
                  <Text style={styles.unreadText}>{item.unreadCount}</Text>
                </View>
              )}
            </TouchableOpacity>
          )}
        />
      )}

      {/* FAB for clients with no chats */}
      {!isOwner && chats.length === 0 && (
        <TouchableOpacity style={styles.fab} onPress={startNewChat} accessibilityLabel="New chat">
          <Ionicons name="chatbubble" size={24} color="#fff" />
        </TouchableOpacity>
      )}

      {/* FAB for coach - new chat */}
      {isOwner && (
        <TouchableOpacity style={styles.fab} onPress={openNewChatModal} accessibilityLabel="New chat">
          <Ionicons name="add" size={28} color="#fff" />
        </TouchableOpacity>
      )}

      {/* Coach new chat modal */}
      <Modal visible={showNewChat} animationType="slide" transparent>
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end' }}>
          <View style={{ backgroundColor: colors.background, borderTopLeftRadius: borderRadius.lg, borderTopRightRadius: borderRadius.lg, padding: spacing.lg, maxHeight: '70%' }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.md }}>
              <Text style={{ color: colors.text, fontSize: fontSize.lg, fontWeight: '700' }}>New Conversation</Text>
              <TouchableOpacity onPress={() => setShowNewChat(false)}>
                <Ionicons name="close" size={24} color={colors.textMuted} />
              </TouchableOpacity>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface, borderRadius: borderRadius.md, paddingHorizontal: spacing.md, marginBottom: spacing.md }}>
              <Ionicons name="search" size={18} color={colors.textMuted} />
              <TextInput
                style={{ flex: 1, color: colors.text, paddingVertical: spacing.sm, paddingLeft: spacing.sm, fontSize: fontSize.sm }}
                placeholder="Search clients..."
                placeholderTextColor={colors.textMuted}
                value={clientSearch}
                onChangeText={setClientSearch}
              />
            </View>
            <FlatList
              data={allClients.filter(c => c.name.toLowerCase().includes(clientSearch.toLowerCase()))}
              keyExtractor={item => item.uid}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={{ flexDirection: 'row', alignItems: 'center', padding: spacing.md, borderBottomWidth: 1, borderBottomColor: colors.border }}
                  onPress={() => startChatWithClient(item)}
                >
                  <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: colors.primary + '30', justifyContent: 'center', alignItems: 'center', marginRight: spacing.md }}>
                    <Text style={{ color: colors.primary, fontWeight: '700' }}>{item.name.charAt(0).toUpperCase()}</Text>
                  </View>
                  <View>
                    <Text style={{ color: colors.text, fontWeight: '600', fontSize: fontSize.sm }}>{item.name}</Text>
                    <Text style={{ color: colors.textMuted, fontSize: fontSize.xs }}>{item.email}</Text>
                  </View>
                </TouchableOpacity>
              )}
              ListEmptyComponent={
                <Text style={{ color: colors.textMuted, textAlign: 'center', padding: spacing.xl }}>No clients found.</Text>
              }
            />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  list: {
    padding: spacing.md,
  },
  chatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    marginBottom: spacing.sm,
  },
  chatAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chatAvatarText: {
    color: '#fff',
    fontSize: fontSize.lg,
    fontWeight: '700',
  },
  chatContent: {
    flex: 1,
    marginLeft: spacing.md,
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  chatName: {
    color: colors.text,
    fontSize: fontSize.md,
    fontWeight: '600',
  },
  chatTime: {
    color: colors.textMuted,
    fontSize: fontSize.xs,
  },
  chatMessage: {
    color: colors.textSecondary,
    fontSize: fontSize.sm,
    marginTop: 2,
  },
  unreadBadge: {
    backgroundColor: colors.primary,
    width: 22,
    height: 22,
    borderRadius: 11,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: spacing.sm,
  },
  unreadText: {
    color: '#fff',
    fontSize: fontSize.xs,
    fontWeight: '700',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xxl,
  },
  emptyText: {
    color: colors.textSecondary,
    fontSize: fontSize.lg,
    fontWeight: '600',
    marginTop: spacing.md,
  },
  startChatButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    marginTop: spacing.lg,
  },
  startChatText: {
    color: '#fff',
    fontSize: fontSize.md,
    fontWeight: '700',
  },
  fab: {
    position: 'absolute',
    bottom: spacing.lg,
    right: spacing.lg,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
});
