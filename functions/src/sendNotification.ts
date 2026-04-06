import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

const db = admin.firestore();
const messaging = admin.messaging();

/**
 * Send a push notification to specific clients.
 * Called from the coach notifications page.
 */
export const sendPushNotification = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Must be logged in');
  }

  const { title, message, clientUids } = data;

  if (!title || !message || !clientUids || !Array.isArray(clientUids)) {
    throw new functions.https.HttpsError('invalid-argument', 'Title, message, and clientUids required');
  }

  // Verify caller is an owner
  const callerDoc = await db.collection('users').doc(context.auth.uid).get();
  if (!callerDoc.exists || callerDoc.data()?.role !== 'owner') {
    throw new functions.https.HttpsError('permission-denied', 'Only coaches can send notifications');
  }

  const tokens: string[] = [];
  for (const uid of clientUids) {
    const userDoc = await db.collection('users').doc(uid).get();
    if (userDoc.exists && userDoc.data()?.fcmToken) {
      tokens.push(userDoc.data()!.fcmToken);
    }
  }

  if (tokens.length === 0) {
    return { success: true, sent: 0, message: 'No clients have push tokens registered' };
  }

  try {
    const result = await messaging.sendEachForMulticast({
      tokens,
      notification: { title, body: message },
      data: { type: 'coach_notification' },
      apns: { payload: { aps: { sound: 'default', badge: 1 } } },
      android: { notification: { sound: 'default' } },
    });

    return {
      success: true,
      sent: result.successCount,
      failed: result.failureCount,
    };
  } catch (error: any) {
    console.error('Failed to send notifications:', error);
    throw new functions.https.HttpsError('internal', 'Failed to send notifications');
  }
});
