import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput,
  FlatList, Modal, KeyboardAvoidingView, Platform, ActivityIndicator, Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Stack, router } from 'expo-router';
import {
  collection, query, orderBy, onSnapshot, addDoc, updateDoc, deleteDoc, doc,
} from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import { db } from '../lib/firebase';
import { Community, CommunityMessage } from '../types';
import { colors, spacing, fontSize, borderRadius, shadows } from '../components/ui/theme';

const COMMUNITY_ICONS = ['💪', '🏋️', '🔥', '👯‍♀️', '🏃', '🥗', '🧘', '⭐', '🎯', '💬', '🏆', '❤️'];

export default function CommunitiesScreen() {
  const { profile, isOwner } = useAuth();
  const [communities, setCommunities] = useState<Community[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCommunity, setActiveCommunity] = useState<Community | null>(null);
  const [messages, setMessages] = useState<CommunityMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  // Create form state
  const [createName, setCreateName] = useState('');
  const [createDesc, setCreateDesc] = useState('');
  const [createIcon, setCreateIcon] = useState('💪');
  const [createRestriction, setCreateRestriction] = useState<'none' | 'female-only' | 'male-only'>('none');
  const [creating, setCreating] = useState(false);

  // Load communities (real-time)
  useEffect(() => {
    const unsub = onSnapshot(
      query(collection(db, 'communities'), orderBy('lastMessageTime', 'desc')),
      (snap) => {
        const list = snap.docs.map((d) => ({ id: d.id, ...d.data() } as Community));
        setCommunities(list);
        setLoading(false);
      },
    );
    return unsub;
  }, []);

  // Load messages for active community (real-time)
  useEffect(() => {
    if (!activeCommunity) return;
    const unsub = onSnapshot(
      query(
        collection(db, 'communities', activeCommunity.id, 'messages'),
        orderBy('timestamp', 'asc'),
      ),
      (snap) => {
        setMessages(
          snap.docs.map((d) => ({ id: d.id, ...d.data() } as CommunityMessage)),
        );
        setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
      },
    );
    return unsub;
  }, [activeCommunity]);

  const canJoin = (community: Community) => {
    if (!community.restriction || community.restriction === 'none') return true;
    if (isOwner) return true;
    if (!profile?.gender) return false; // Gender not set — can't join restricted communities
    if (community.restriction === 'female-only' && profile.gender === 'female') return true;
    if (community.restriction === 'male-only' && profile.gender === 'male') return true;
    return false;
  };

  const sendMessage = async () => {
    if (!profile || !activeCommunity || !newMessage.trim()) return;
    if (newMessage.length > 1000) { Alert.alert('Message too long', 'Please keep messages under 1000 characters.'); return; }
    setSending(true);
    try {
      await addDoc(
        collection(db, 'communities', activeCommunity.id, 'messages'),
        {
          senderId: profile.uid,
          senderName: profile.name,
          senderPhotoURL: profile.photoURL || '',
          text: newMessage.trim(),
          timestamp: Date.now(),
        },
      );
      await updateDoc(doc(db, 'communities', activeCommunity.id), {
        lastMessage: newMessage.trim(),
        lastMessageTime: Date.now(),
      });
      setNewMessage('');
    } catch { /* silent */ }
    finally { setSending(false); }
  };

  const createCommunity = async () => {
    if (!profile || !createName.trim()) return;
    setCreating(true);
    try {
      await addDoc(collection(db, 'communities'), {
        name: createName.trim(),
        description: createDesc.trim(),
        icon: createIcon,
        createdBy: profile.uid,
        createdAt: Date.now(),
        memberCount: 0,
        restriction: createRestriction,
        lastMessage: '',
        lastMessageTime: Date.now(),
      });
      setShowCreate(false);
      setCreateName('');
      setCreateDesc('');
      setCreateIcon('💪');
      setCreateRestriction('none');
    } catch { /* silent */ }
    finally { setCreating(false); }
  };

  const deleteCommunity = (communityId: string, communityName: string) => {
    Alert.alert(
      'Delete Community',
      `Are you sure you want to delete "${communityName}"? This cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteDoc(doc(db, 'communities', communityId));
            } catch { /* silent */ }
          },
        },
      ]
    );
  };

  const formatTime = (ts: number) => {
    const d = new Date(ts);
    const now = new Date();
    const diff = now.getTime() - d.getTime();
    if (diff < 86400000)
      return d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
    if (diff < 604800000)
      return d.toLocaleDateString('en-GB', { weekday: 'short' });
    return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
  };

  // ── Chat View ──
  if (activeCommunity) {
    return (
      <>
        <Stack.Screen
          options={{
            headerShown: true,
            title: '',
            headerStyle: { backgroundColor: colors.secondary },
            headerTintColor: colors.text,
            headerLeft: () => (
              <TouchableOpacity
                style={styles.chatHeaderLeft}
                onPress={() => { setActiveCommunity(null); setMessages([]); }}
              >
                <Ionicons name="arrow-back" size={22} color={colors.text} />
                <Text style={styles.chatHeaderIcon}>{activeCommunity.icon}</Text>
                <View>
                  <Text style={styles.chatHeaderTitle}>{activeCommunity.name}</Text>
                  {activeCommunity.restriction && activeCommunity.restriction !== 'none' && (
                    <View style={styles.restrictionBadgeSmall}>
                      <Ionicons name="lock-closed" size={8} color={colors.primary} />
                      <Text style={styles.restrictionBadgeSmallText}>
                        {activeCommunity.restriction === 'female-only' ? 'Ladies Only' : 'Men Only'}
                      </Text>
                    </View>
                  )}
                </View>
              </TouchableOpacity>
            ),
          }}
        />
        <KeyboardAvoidingView
          style={styles.chatContainer}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={90}
        >
          {/* Messages */}
          <FlatList
            ref={flatListRef}
            data={messages}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.messagesList}
            onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: false })}
            ListEmptyComponent={
              <View style={styles.emptyMessages}>
                <Ionicons name="chatbubbles-outline" size={48} color={colors.textMuted} />
                <Text style={styles.emptyMessagesText}>No messages yet</Text>
                <Text style={styles.emptyMessagesSubtext}>Be the first to say something!</Text>
              </View>
            }
            renderItem={({ item: msg }) => {
              const isMe = msg.senderId === profile?.uid;
              return (
                <View style={[styles.messageRow, isMe && styles.messageRowMe]}>
                  {!isMe && (
                    <View style={styles.avatar}>
                      <Text style={styles.avatarText}>
                        {msg.senderName?.charAt(0)?.toUpperCase() || '?'}
                      </Text>
                    </View>
                  )}
                  <View style={[styles.messageBubble, isMe ? styles.messageBubbleMe : styles.messageBubbleOther]}>
                    {!isMe && (
                      <Text style={styles.senderName}>{msg.senderName}</Text>
                    )}
                    <Text style={[styles.messageText, isMe && { color: '#fff' }]}>{msg.text}</Text>
                    <Text style={[styles.messageTime, isMe && { color: 'rgba(255,255,255,0.6)' }]}>
                      {formatTime(msg.timestamp)}
                    </Text>
                  </View>
                </View>
              );
            }}
          />

          {/* Input */}
          <View style={styles.inputRow}>
            <TextInput
              style={styles.messageInput}
              value={newMessage}
              onChangeText={setNewMessage}
              placeholder="Type a message..."
              placeholderTextColor={colors.textMuted}
              multiline
              maxLength={1000}
            />
            <TouchableOpacity
              style={[styles.sendBtn, (!newMessage.trim() || sending) && { opacity: 0.5 }]}
              onPress={sendMessage}
              disabled={sending || !newMessage.trim()}
            >
              <Ionicons name="send" size={18} color="#fff" />
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </>
    );
  }

  // ── Community List View ──
  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          title: 'Communities',
          headerStyle: { backgroundColor: colors.secondary },
          headerTintColor: colors.text,
          headerBackTitle: ' ',
          headerRight: () => (
            <TouchableOpacity
              onPress={() => setShowCreate(true)}
              style={{ marginRight: spacing.sm }}
            >
              <Ionicons name="add" size={20} color="#fff" />
            </TouchableOpacity>
          ),
        }}
      />
      <View style={styles.container}>
        {loading ? (
          <View style={styles.loadingSection}>
            <ActivityIndicator size="large" color={colors.accent} />
          </View>
        ) : communities.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="people-outline" size={64} color={colors.textMuted} />
            <Text style={styles.emptyTitle}>No Communities Yet</Text>
            <Text style={styles.emptySubtext}>
              Create the first community group to get the conversation started.
            </Text>
            <TouchableOpacity
              style={styles.createFirstBtn}
              onPress={() => setShowCreate(true)}
              activeOpacity={0.7}
            >
              <Ionicons name="add" size={18} color="#fff" />
              <Text style={styles.createFirstBtnText}>New Group</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <FlatList
            data={communities}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
            renderItem={({ item: community }) => {
              const accessible = canJoin(community);
              return (
                <TouchableOpacity
                  style={[styles.communityCard, shadows.sm, !accessible && styles.communityCardDisabled]}
                  onPress={() => accessible && setActiveCommunity(community)}
                  disabled={!accessible}
                  activeOpacity={0.7}
                >
                  <View style={styles.communityIcon}>
                    <Text style={styles.communityIconText}>{community.icon}</Text>
                  </View>
                  <View style={styles.communityInfo}>
                    <View style={styles.communityNameRow}>
                      <Text style={styles.communityName}>{community.name}</Text>
                      {community.restriction && community.restriction !== 'none' && (
                        <View style={styles.restrictionBadge}>
                          <Ionicons name="lock-closed" size={8} color={colors.primary} />
                          <Text style={styles.restrictionBadgeText}>
                            {community.restriction === 'female-only' ? 'Ladies' : 'Men'}
                          </Text>
                        </View>
                      )}
                    </View>
                    <Text style={styles.communityLastMsg} numberOfLines={1}>
                      {community.lastMessage || community.description}
                    </Text>
                  </View>
                  <View style={styles.communityRight}>
                    {community.lastMessageTime && community.lastMessage ? (
                      <Text style={styles.communityTime}>{formatTime(community.lastMessageTime)}</Text>
                    ) : null}
                    {!accessible && (
                      <Text style={styles.restrictedText}>Restricted</Text>
                    )}
                    {(isOwner || community.createdBy === profile?.uid) && (
                      <TouchableOpacity
                        onPress={(e) => {
                          e.stopPropagation?.();
                          deleteCommunity(community.id, community.name);
                        }}
                        style={{ marginTop: 4 }}
                      >
                        <Ionicons name="trash-outline" size={16} color={colors.error + '80'} />
                      </TouchableOpacity>
                    )}
                  </View>
                </TouchableOpacity>
              );
            }}
          />
        )}

        {/* Create Community Modal */}
        <Modal
          visible={showCreate}
          transparent
          animationType="fade"
          onRequestClose={() => setShowCreate(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Create Community</Text>
                <TouchableOpacity onPress={() => setShowCreate(false)}>
                  <Ionicons name="close" size={24} color={colors.textMuted} />
                </TouchableOpacity>
              </View>

              {/* Icon picker */}
              <Text style={styles.modalLabel}>Choose an Icon</Text>
              <View style={styles.iconGrid}>
                {COMMUNITY_ICONS.map((icon) => (
                  <TouchableOpacity
                    key={icon}
                    style={[styles.iconBtn, createIcon === icon && styles.iconBtnSelected]}
                    onPress={() => setCreateIcon(icon)}
                  >
                    <Text style={styles.iconBtnText}>{icon}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Name */}
              <Text style={styles.modalLabel}>Group Name *</Text>
              <TextInput
                style={styles.modalInput}
                value={createName}
                onChangeText={setCreateName}
                placeholder="e.g. Ladies Club, Leg Day Crew"
                placeholderTextColor={colors.textMuted}
              />

              {/* Description */}
              <Text style={styles.modalLabel}>Description</Text>
              <TextInput
                style={styles.modalInput}
                value={createDesc}
                onChangeText={setCreateDesc}
                placeholder="What's this group about?"
                placeholderTextColor={colors.textMuted}
              />

              {/* Access restriction */}
              <Text style={styles.modalLabel}>Access</Text>
              <View style={styles.accessRow}>
                {([
                  { value: 'none' as const, label: 'Everyone' },
                  { value: 'female-only' as const, label: 'Ladies Only' },
                  { value: 'male-only' as const, label: 'Men Only' },
                ]).map((opt) => (
                  <TouchableOpacity
                    key={opt.value}
                    style={[styles.accessBtn, createRestriction === opt.value && styles.accessBtnActive]}
                    onPress={() => setCreateRestriction(opt.value)}
                  >
                    <Text style={[styles.accessBtnText, createRestriction === opt.value && styles.accessBtnTextActive]}>
                      {opt.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Create button */}
              <TouchableOpacity
                style={[styles.createBtn, (!createName.trim() || creating) && { opacity: 0.5 }]}
                onPress={createCommunity}
                disabled={creating || !createName.trim()}
                activeOpacity={0.8}
              >
                <Text style={styles.createBtnText}>{creating ? 'Creating...' : 'Create Group'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  listContent: { padding: spacing.md, paddingBottom: spacing.xxl },

  loadingSection: { flex: 1, justifyContent: 'center', alignItems: 'center' },

  // Empty state
  emptyState: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: spacing.lg },
  emptyTitle: { color: colors.text, fontSize: fontSize.xl, fontWeight: '700', marginTop: spacing.md },
  emptySubtext: { color: colors.textSecondary, fontSize: fontSize.sm, textAlign: 'center', marginTop: spacing.xs, marginBottom: spacing.lg },
  createFirstBtn: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs, backgroundColor: colors.primary, borderRadius: borderRadius.md, paddingHorizontal: spacing.lg, paddingVertical: spacing.sm + 2 },
  createFirstBtnText: { color: '#fff', fontWeight: '700', fontSize: fontSize.sm },

  // New Group header button
  newGroupBtn: { backgroundColor: colors.primary, borderRadius: borderRadius.sm, width: 32, height: 32, justifyContent: 'center', alignItems: 'center', marginRight: spacing.sm },

  // Community card
  communityCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  communityCardDisabled: { opacity: 0.5 },
  communityIcon: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.md,
    backgroundColor: colors.surfaceLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.sm,
  },
  communityIconText: { fontSize: 24 },
  communityInfo: { flex: 1, marginRight: spacing.sm },
  communityNameRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs, marginBottom: 2 },
  communityName: { color: colors.text, fontSize: fontSize.md, fontWeight: '600' },
  communityLastMsg: { color: colors.textSecondary, fontSize: fontSize.sm },
  communityRight: { alignItems: 'flex-end' },
  communityTime: { color: colors.textMuted, fontSize: fontSize.xs },
  restrictedText: { color: colors.error, fontSize: fontSize.xs, marginTop: 2 },

  restrictionBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    backgroundColor: colors.primary + '15',
    paddingHorizontal: spacing.xs + 2,
    paddingVertical: 1,
    borderRadius: borderRadius.full,
  },
  restrictionBadgeText: { color: colors.primary, fontSize: 10, fontWeight: '600' },

  // Chat view
  chatContainer: { flex: 1, backgroundColor: colors.background },
  chatHeaderLeft: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  chatHeaderIcon: { fontSize: 24 },
  chatHeaderTitle: { color: colors.text, fontSize: fontSize.md, fontWeight: '600' },
  restrictionBadgeSmall: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  restrictionBadgeSmallText: { color: colors.primary, fontSize: fontSize.xs },

  messagesList: { padding: spacing.md, paddingBottom: spacing.sm },
  emptyMessages: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: spacing.xxl * 2 },
  emptyMessagesText: { color: colors.textMuted, fontSize: fontSize.md, fontWeight: '600', marginTop: spacing.sm },
  emptyMessagesSubtext: { color: colors.textMuted, fontSize: fontSize.sm, marginTop: spacing.xs },

  messageRow: { flexDirection: 'row', marginBottom: spacing.sm, alignItems: 'flex-end', gap: spacing.xs },
  messageRowMe: { justifyContent: 'flex-end' },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primary + '20',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: { color: colors.primary, fontSize: fontSize.xs, fontWeight: '700' },
  messageBubble: { maxWidth: '75%' as any, borderRadius: borderRadius.lg, paddingHorizontal: spacing.md, paddingVertical: spacing.sm },
  messageBubbleMe: { backgroundColor: colors.primary, borderBottomRightRadius: borderRadius.xs || 4 },
  messageBubbleOther: { backgroundColor: colors.surface, borderBottomLeftRadius: borderRadius.xs || 4 },
  senderName: { color: colors.primary, fontSize: fontSize.xs, fontWeight: '600', marginBottom: 2 },
  messageText: { color: colors.text, fontSize: fontSize.sm, lineHeight: 20 },
  messageTime: { color: colors.textMuted, fontSize: 10, marginTop: 2 },

  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: spacing.sm,
    padding: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.secondary,
  },
  messageInput: {
    flex: 1,
    backgroundColor: colors.inputBackground,
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    color: colors.text,
    fontSize: fontSize.sm,
    borderWidth: 1,
    borderColor: colors.border,
    maxHeight: 100,
  },
  sendBtn: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Create community modal
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', padding: spacing.lg },
  modalContent: { backgroundColor: colors.surface, borderRadius: borderRadius.lg, padding: spacing.lg },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.md },
  modalTitle: { color: colors.text, fontSize: fontSize.lg, fontWeight: '700' },
  modalLabel: { color: colors.textSecondary, fontSize: fontSize.sm, fontWeight: '500', marginBottom: spacing.xs, marginTop: spacing.sm },

  iconGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.xs },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.sm,
    backgroundColor: colors.surfaceLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconBtnSelected: { backgroundColor: colors.primary + '20', borderWidth: 2, borderColor: colors.primary },
  iconBtnText: { fontSize: 20 },

  modalInput: {
    backgroundColor: colors.inputBackground,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    color: colors.text,
    fontSize: fontSize.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },

  accessRow: { flexDirection: 'row', gap: spacing.xs },
  accessBtn: {
    flex: 1,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
    backgroundColor: colors.surfaceLight,
    alignItems: 'center',
  },
  accessBtnActive: { backgroundColor: colors.primary },
  accessBtnText: { color: colors.textSecondary, fontSize: fontSize.sm, fontWeight: '600' },
  accessBtnTextActive: { color: '#fff' },

  createBtn: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.sm + 2,
    alignItems: 'center',
    marginTop: spacing.lg,
  },
  createBtnText: { color: '#fff', fontWeight: '700', fontSize: fontSize.md },
});
