import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

const db = admin.firestore();
const messaging = admin.messaging();

/**
 * Triggered when a new message is created in any chat.
 * Sends a push notification to the other participant.
 */
export const onNewMessage = functions.firestore
  .document('chats/{chatId}/messages/{messageId}')
  .onCreate(async (snap, context) => {
    const { chatId } = context.params;
    const message = snap.data();

    if (!message) return;

    const senderId = message.senderId;
    const messageText = message.text || '';

    try {
      // Get the chat document to find participants
      const chatDoc = await db.collection('chats').doc(chatId).get();
      if (!chatDoc.exists) return;

      const chatData = chatDoc.data();
      if (!chatData) return;

      const participants: string[] = chatData.participants || [];

      // Find the recipient (the other participant)
      const recipientId = participants.find((uid: string) => uid !== senderId);
      if (!recipientId) return;

      // Get recipient's FCM token
      const recipientDoc = await db.collection('users').doc(recipientId).get();
      if (!recipientDoc.exists) return;

      const recipientData = recipientDoc.data();
      if (!recipientData?.fcmToken) return;

      // Get sender's name
      const senderDoc = await db.collection('users').doc(senderId).get();
      const senderName = senderDoc.exists ? senderDoc.data()?.name || 'Someone' : 'Someone';

      // Send push notification
      const notification: admin.messaging.Message = {
        token: recipientData.fcmToken,
        notification: {
          title: `${senderName}`,
          body: messageText.length > 100
            ? messageText.substring(0, 100) + '...'
            : messageText || 'Sent you a message',
        },
        data: {
          type: 'message',
          chatId: chatId,
          senderId: senderId,
        },
        apns: {
          payload: {
            aps: {
              sound: 'default',
              badge: 1,
            },
          },
        },
        android: {
          notification: {
            sound: 'default',
            channelId: 'messages',
          },
        },
      };

      await messaging.send(notification);
      console.log(`Message notification sent to ${recipientId} from ${senderName}`);

      // Update unread count on the chat
      await db.collection('chats').doc(chatId).update({
        unreadCount: admin.firestore.FieldValue.increment(1),
      });
    } catch (error) {
      console.error('Error sending message notification:', error);
    }
  });
