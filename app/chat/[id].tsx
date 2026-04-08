import React, { useEffect, useState, useRef } from 'react';
import {
  View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity,
  KeyboardAvoidingView, Platform, Image, ActivityIndicator, Dimensions, Alert,
} from 'react-native';
import { useLocalSearchParams, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { Audio } from 'expo-av';
import {
  collection, query, orderBy, onSnapshot, addDoc, doc,
  updateDoc, getDoc, getDocs, deleteDoc,
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useAuth } from '../../context/AuthContext';
import { db, storage } from '../../lib/firebase';
import { Message } from '../../types';
import { colors, spacing, fontSize, borderRadius } from '../../components/ui/theme';

const screenWidth = Dimensions.get('window').width;

export default function ChatScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { profile } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [chatName, setChatName] = useState('Chat');
  const [uploading, setUploading] = useState(false);
  const [editingMessage, setEditingMessage] = useState<Message | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [otherTyping, setOtherTyping] = useState(false);
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [playingAudio, setPlayingAudio] = useState<string | null>(null);
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const recordingTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const soundRef = useRef<Audio.Sound | null>(null);
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    if (!id) return;

    getDoc(doc(db, 'chats', id)).then((chatDoc) => {
      if (chatDoc.exists()) {
        setChatName(chatDoc.data().clientName || 'Chat');
        // Clear unread count when opening chat
        updateDoc(doc(db, 'chats', id), { unreadCount: 0 }).catch(() => {});
      }
    });

    // Mark unread messages as read
    const markRead = async () => {
      try {
        const msgsSnap = await getDocs(collection(db, 'chats', id, 'messages'));
        msgsSnap.forEach((msgDoc) => {
          const msg = msgDoc.data();
          if (!msg.read && msg.senderId !== profile?.uid) {
            updateDoc(doc(db, 'chats', id, 'messages', msgDoc.id), { read: true }).catch(() => {});
          }
        });
      } catch { /* silent */ }
    };
    markRead();

    const messagesQuery = query(
      collection(db, 'chats', id, 'messages'),
      orderBy('timestamp', 'asc')
    );

    const unsubscribe = onSnapshot(messagesQuery, (snapshot) => {
      const msgs: Message[] = [];
      snapshot.forEach((d) => {
        msgs.push({ id: d.id, ...d.data() } as Message);
      });
      setMessages(msgs);

      // Mark unread messages from other person as read
      msgs.forEach((msg) => {
        if (msg.senderId !== profile?.uid && !msg.read) {
          updateDoc(doc(db, 'chats', id, 'messages', msg.id), { read: true }).catch(() => {});
        }
      });
    });

    // Listen for typing indicator
    const typingUnsub = onSnapshot(doc(db, 'chats', id), (snap) => {
      if (snap.exists()) {
        const data = snap.data();
        const typingUid = data.typingUid;
        const typingAt = data.typingAt || 0;
        // Show typing if someone else is typing and it was within last 5 seconds
        setOtherTyping(typingUid && typingUid !== profile?.uid && Date.now() - typingAt < 5000);
      }
    });

    return () => { unsubscribe(); typingUnsub(); };
  }, [id]);

  const handleTyping = (text: string) => {
    setInputText(text);
    if (!id || !profile) return;

    // Update typing indicator
    updateDoc(doc(db, 'chats', id), { typingUid: profile.uid, typingAt: Date.now() }).catch(() => {});

    // Clear typing after 3 seconds of no input
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      updateDoc(doc(db, 'chats', id), { typingUid: null, typingAt: 0 }).catch(() => {});
    }, 3000);
  };

  const sendMessage = async () => {
    if (!inputText.trim() || !profile || !id) return;

    const text = inputText.trim();
    setInputText('');

    try {
      await addDoc(collection(db, 'chats', id, 'messages'), {
        senderId: profile.uid,
        text,
        timestamp: Date.now(),
        read: false,
      });

      await updateDoc(doc(db, 'chats', id), {
        lastMessage: text,
        lastMessageTime: Date.now(),
        typingUid: null,
        typingAt: 0,
      });
    } catch (err) {
      // handle silently
    }
  };

  const pickImage = async () => {
    if (!profile || !id) return;

    const permResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permResult.granted) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.7,
      allowsEditing: true,
      maxWidth: 1080,
      maxHeight: 1440,
    } as any);

    if (result.canceled || !result.assets[0]) return;

    await uploadAndSendImage(result.assets[0].uri);
  };

  const takePhoto = async () => {
    if (!profile || !id) return;

    const permResult = await ImagePicker.requestCameraPermissionsAsync();
    if (!permResult.granted) return;

    const result = await ImagePicker.launchCameraAsync({
      quality: 0.7,
      allowsEditing: true,
      maxWidth: 1080,
      maxHeight: 1440,
    } as any);

    if (result.canceled || !result.assets[0]) return;

    await uploadAndSendImage(result.assets[0].uri);
  };

  const uploadAndSendImage = async (uri: string) => {
    if (!profile || !id) return;
    setUploading(true);

    try {
      // Fetch image as blob
      const response = await fetch(uri);
      const blob = await response.blob();

      // Upload to Firebase Storage
      const filename = `chat-images/${id}/${Date.now()}_${profile.uid}.jpg`;
      const storageRef = ref(storage, filename);
      await uploadBytes(storageRef, blob);
      const downloadUrl = await getDownloadURL(storageRef);

      // Send message with image
      await addDoc(collection(db, 'chats', id, 'messages'), {
        senderId: profile.uid,
        text: '',
        imageUrl: downloadUrl,
        timestamp: Date.now(),
        read: false,
      });

      await updateDoc(doc(db, 'chats', id), {
        lastMessage: 'Sent a photo',
        lastMessageTime: Date.now(),
      });
    } catch (err) {
      // Image upload failed - silent for UX
    } finally {
      setUploading(false);
    }
  };

  // Voice recording
  const startRecording = async () => {
    try {
      const permission = await Audio.requestPermissionsAsync();
      if (!permission.granted) return;

      await Audio.setAudioModeAsync({ allowsRecordingIOS: true, playsInSilentModeIOS: true });

      const { recording: newRecording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      setRecording(newRecording);
      setIsRecording(true);
      setRecordingDuration(0);

      recordingTimerRef.current = setInterval(() => {
        setRecordingDuration((d) => d + 1);
      }, 1000);
    } catch {
      Alert.alert('Error', 'Could not start recording');
    }
  };

  const cancelRecording = async () => {
    if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);
    setIsRecording(false);
    setRecordingDuration(0);
    try {
      await recording?.stopAndUnloadAsync();
    } catch { /* silent */ }
    setRecording(null);
  };

  const sendVoiceMessage = async () => {
    if (!recording || !profile || !id) return;
    if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);
    setIsRecording(false);
    const duration = recordingDuration;
    setRecordingDuration(0);

    try {
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      setRecording(null);
      if (!uri) return;

      setUploading(true);
      const response = await fetch(uri);
      const blob = await response.blob();

      const filename = `voice-messages/${id}/${Date.now()}_${profile.uid}.m4a`;
      const storageRef = ref(storage, filename);
      await uploadBytes(storageRef, blob);
      const downloadUrl = await getDownloadURL(storageRef);

      await addDoc(collection(db, 'chats', id, 'messages'), {
        senderId: profile.uid,
        text: '',
        audioUrl: downloadUrl,
        audioDuration: duration,
        timestamp: Date.now(),
        read: false,
      });

      await updateDoc(doc(db, 'chats', id), {
        lastMessage: 'Voice message',
        lastMessageTime: Date.now(),
      });
    } catch {
      Alert.alert('Error', 'Failed to send voice message');
    } finally {
      setUploading(false);
    }
  };

  const playAudio = async (url: string) => {
    try {
      if (soundRef.current) {
        await soundRef.current.unloadAsync();
      }
      if (playingAudio === url) {
        setPlayingAudio(null);
        return;
      }

      await Audio.setAudioModeAsync({ allowsRecordingIOS: false, playsInSilentModeIOS: true });
      const { sound } = await Audio.Sound.createAsync({ uri: url });
      soundRef.current = sound;
      setPlayingAudio(url);

      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded && status.didJustFinish) {
          setPlayingAudio(null);
        }
      });

      await sound.playAsync();
    } catch {
      Alert.alert('Error', 'Could not play audio');
    }
  };

  const formatDuration = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const handleLongPress = (message: Message) => {
    const isMe = message.senderId === profile?.uid;
    if (!isMe) return; // can only edit/delete own messages

    const options: { text: string; onPress?: () => void; style?: 'cancel' | 'destructive' }[] = [];

    if (message.text && !message.imageUrl) {
      options.push({
        text: 'Edit',
        onPress: () => {
          setEditingMessage(message);
          setInputText(message.text);
        },
      });
    }

    options.push({
      text: 'Delete',
      style: 'destructive',
      onPress: () => deleteMessage(message),
    });

    options.push({ text: 'Cancel', style: 'cancel' });

    Alert.alert('Message Options', undefined, options);
  };

  const deleteMessage = async (message: Message) => {
    if (!id) return;
    try {
      await deleteDoc(doc(db, 'chats', id, 'messages', message.id));
    } catch {
      Alert.alert('Error', 'Failed to delete message');
    }
  };

  const saveEdit = async () => {
    if (!editingMessage || !id || !inputText.trim()) return;
    try {
      await updateDoc(doc(db, 'chats', id, 'messages', editingMessage.id), {
        text: inputText.trim(),
      });
      setEditingMessage(null);
      setInputText('');
    } catch {
      Alert.alert('Error', 'Failed to edit message');
    }
  };

  const cancelEdit = () => {
    setEditingMessage(null);
    setInputText('');
  };

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const renderMessage = ({ item }: { item: Message }) => {
    const isMe = item.senderId === profile?.uid;
    return (
      <TouchableOpacity
        style={[styles.messageBubbleRow, isMe && styles.messageBubbleRowRight]}
        onLongPress={() => handleLongPress(item)}
        activeOpacity={0.8}
        delayLongPress={400}
      >
        <View style={[styles.messageBubble, isMe ? styles.myMessage : styles.theirMessage, item.imageUrl && styles.imageBubble]}>
          {item.imageUrl && (
            <Image
              source={{ uri: item.imageUrl }}
              style={styles.chatImage}
              resizeMode="cover"
            />
          )}
          {item.audioUrl && (
            <TouchableOpacity style={styles.voiceBubble} onPress={() => playAudio(item.audioUrl!)}>
              <Ionicons
                name={playingAudio === item.audioUrl ? 'pause' : 'play'}
                size={22}
                color={isMe ? '#fff' : colors.primary}
              />
              <View style={styles.voiceWaveform}>
                {Array.from({ length: 12 }).map((_, i) => (
                  <View
                    key={i}
                    style={[
                      styles.voiceBar,
                      { height: 6 + Math.random() * 14, backgroundColor: isMe ? 'rgba(255,255,255,0.5)' : colors.primary + '50' },
                      playingAudio === item.audioUrl && i < 6 && { backgroundColor: isMe ? '#fff' : colors.primary },
                    ]}
                  />
                ))}
              </View>
              <Text style={[styles.voiceDuration, isMe && { color: 'rgba(255,255,255,0.7)' }]}>
                {formatDuration(item.audioDuration || 0)}
              </Text>
            </TouchableOpacity>
          )}
          {item.text ? (
            <Text style={[styles.messageText, isMe && styles.myMessageText]}>{item.text}</Text>
          ) : null}
          <View style={styles.messageFooter}>
            <Text style={[styles.messageTime, isMe && styles.myMessageTime]}>
              {formatTime(item.timestamp)}
            </Text>
            {isMe && (
              <Ionicons
                name={item.read ? 'checkmark-done' : 'checkmark'}
                size={14}
                color={item.read ? '#4FC3F7' : 'rgba(255,255,255,0.5)'}
                style={{ marginLeft: 4 }}
              />
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          title: chatName,
          headerStyle: { backgroundColor: colors.secondary },
          headerTintColor: colors.text,
        }}
      />
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={90}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={renderMessage}
          contentContainerStyle={styles.messagesList}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
          ListEmptyComponent={
            <View style={styles.emptyChat}>
              <Ionicons name="chatbubble-ellipses-outline" size={48} color={colors.textMuted} />
              <Text style={styles.emptyChatText}>Send a message to start the conversation</Text>
            </View>
          }
        />

        {/* Upload indicator */}
        {uploading && (
          <View style={styles.uploadingBar}>
            <ActivityIndicator size="small" color={colors.primary} />
            <Text style={styles.uploadingText}>Sending image...</Text>
          </View>
        )}

        {/* Recording UI */}
        {isRecording && (
          <View style={styles.recordingBar}>
            <View style={styles.recordingPulse} />
            <Text style={styles.recordingText}>Recording... {formatDuration(recordingDuration)}</Text>
            <View style={styles.recordingActions}>
              <TouchableOpacity style={styles.cancelRecordBtn} onPress={cancelRecording} accessibilityLabel="Cancel recording">
                <Ionicons name="trash" size={20} color={colors.error} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.sendRecordBtn} onPress={sendVoiceMessage} accessibilityLabel="Send voice message">
                <Ionicons name="send" size={20} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Typing indicator */}
        {otherTyping && (
          <View style={styles.typingBar}>
            <View style={styles.typingDots}>
              <View style={[styles.typingDot, { opacity: 0.4 }]} />
              <View style={[styles.typingDot, { opacity: 0.7 }]} />
              <View style={[styles.typingDot, { opacity: 1 }]} />
            </View>
            <Text style={styles.typingText}>typing...</Text>
          </View>
        )}

        {/* Edit mode banner */}
        {editingMessage && (
          <View style={styles.editBanner}>
            <Ionicons name="create" size={16} color={colors.primary} />
            <Text style={styles.editBannerText}>Editing message</Text>
            <TouchableOpacity onPress={cancelEdit} accessibilityLabel="Cancel edit">
              <Ionicons name="close" size={20} color={colors.textMuted} />
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.inputBar}>
          {/* Camera & Gallery - hide during edit */}
          {!editingMessage && (
            <>
              <TouchableOpacity style={styles.mediaButton} onPress={takePhoto} accessibilityLabel="Take photo">
                <Ionicons name="camera" size={22} color={colors.textSecondary} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.mediaButton} onPress={pickImage} accessibilityLabel="Choose from gallery">
                <Ionicons name="image" size={22} color={colors.textSecondary} />
              </TouchableOpacity>
            </>
          )}

          <TextInput
            style={styles.textInput}
            value={inputText}
            onChangeText={editingMessage ? setInputText : handleTyping}
            placeholder={editingMessage ? "Edit your message..." : "Type a message..."}
            placeholderTextColor={colors.textMuted}
            multiline
            maxLength={1000}
          />
          {inputText.trim() ? (
            <TouchableOpacity
              style={styles.sendButton}
              onPress={editingMessage ? saveEdit : sendMessage}
              accessibilityLabel={editingMessage ? "Save edit" : "Send message"}
            >
              <Ionicons name={editingMessage ? "checkmark" : "send"} size={20} color="#fff" />
            </TouchableOpacity>
          ) : !editingMessage ? (
            <TouchableOpacity
              style={styles.micButton}
              onPress={startRecording}
              accessibilityLabel="Record voice message"
            >
              <Ionicons name="mic" size={22} color={colors.primary} />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.sendButtonDisabled} disabled>
              <Ionicons name="checkmark" size={20} color={colors.textMuted} />
            </TouchableOpacity>
          )}
        </View>
      </KeyboardAvoidingView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  messagesList: {
    padding: spacing.md,
    flexGrow: 1,
    justifyContent: 'flex-end',
  },
  messageBubbleRow: {
    flexDirection: 'row',
    marginBottom: spacing.sm,
  },
  messageBubbleRowRight: {
    justifyContent: 'flex-end',
  },
  messageBubble: {
    maxWidth: '78%',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.lg,
  },
  imageBubble: {
    padding: 4,
    paddingBottom: spacing.xs,
  },
  myMessage: {
    backgroundColor: colors.primary,
    borderBottomRightRadius: 4,
  },
  theirMessage: {
    backgroundColor: colors.surface,
    borderBottomLeftRadius: 4,
  },
  chatImage: {
    width: screenWidth * 0.55,
    height: screenWidth * 0.55,
    borderRadius: borderRadius.md,
    marginBottom: 4,
  },
  messageText: {
    color: colors.text,
    fontSize: fontSize.md,
    lineHeight: 22,
  },
  myMessageText: {
    color: '#fff',
  },
  messageTime: {
    color: colors.textMuted,
    fontSize: fontSize.xs,
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  myMessageTime: {
    color: 'rgba(255,255,255,0.7)',
  },
  uploadingBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.sm,
    backgroundColor: colors.surface,
    gap: spacing.sm,
  },
  uploadingText: {
    color: colors.textSecondary,
    fontSize: fontSize.sm,
  },
  messageFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: 4,
  },
  typingBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    gap: spacing.xs,
  },
  typingDots: {
    flexDirection: 'row',
    gap: 3,
  },
  typingDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.textMuted,
  },
  typingText: {
    color: colors.textMuted,
    fontSize: fontSize.xs,
    fontStyle: 'italic',
  },
  editBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.sm,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.primary + '15',
    borderTopWidth: 1,
    borderTopColor: colors.primary + '30',
    gap: spacing.sm,
  },
  editBannerText: {
    color: colors.primary,
    fontSize: fontSize.sm,
    fontWeight: '600',
    flex: 1,
  },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: spacing.sm,
    paddingBottom: spacing.lg,
    backgroundColor: colors.secondary,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  mediaButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textInput: {
    flex: 1,
    backgroundColor: colors.inputBackground,
    borderRadius: borderRadius.xl,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    color: colors.text,
    fontSize: fontSize.md,
    maxHeight: 100,
    marginRight: spacing.sm,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.surfaceLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  micButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primary + '20',
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Voice message bubble
  voiceBubble: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    minWidth: 180,
  },
  voiceWaveform: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    flex: 1,
  },
  voiceBar: {
    width: 3,
    borderRadius: 1.5,
  },
  voiceDuration: {
    color: colors.textMuted,
    fontSize: fontSize.xs,
    fontWeight: '600',
  },
  // Recording UI
  recordingBar: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    backgroundColor: colors.error + '15',
    borderTopWidth: 1,
    borderTopColor: colors.error + '30',
    gap: spacing.sm,
  },
  recordingPulse: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.error,
  },
  recordingText: {
    color: colors.error,
    fontSize: fontSize.sm,
    fontWeight: '600',
    flex: 1,
  },
  recordingActions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  cancelRecordBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.error + '20',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendRecordBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyChat: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing.xxl,
  },
  emptyChatText: {
    color: colors.textMuted,
    fontSize: fontSize.sm,
    marginTop: spacing.md,
    textAlign: 'center',
  },
});
