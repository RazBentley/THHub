"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendCheckInNotifications = void 0;
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const db = admin.firestore();
const messaging = admin.messaging();
const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
/**
 * Scheduled function that runs daily at 9:00 AM UTC.
 * Checks which clients have their check-in day today and sends push notifications.
 */
exports.sendCheckInNotifications = functions.pubsub
    .schedule('0 9 * * *')
    .timeZone('Europe/London')
    .onRun(async () => {
    const today = DAYS[new Date().getDay()];
    try {
        const usersSnap = await db
            .collection('users')
            .where('role', '==', 'client')
            .where('checkInDay', '==', today)
            .get();
        if (usersSnap.empty) {
            console.log(`No check-ins scheduled for ${today}`);
            return;
        }
        const tokens = [];
        usersSnap.forEach((doc) => {
            const data = doc.data();
            if (data.fcmToken) {
                tokens.push(data.fcmToken);
            }
        });
        if (tokens.length === 0) {
            console.log('No FCM tokens found for check-in users');
            return;
        }
        const message = {
            tokens,
            notification: {
                title: 'TH Hub - Check-in Day!',
                body: "It's your weekly check-in day! Time to update your progress with your coach.",
            },
            data: {
                type: 'check_in',
                day: today,
            },
            apns: {
                payload: {
                    aps: {
                        sound: 'default',
                        badge: 1,
                    },
                },
            },
        };
        const response = await messaging.sendEachForMulticast(message);
        console.log(`Sent ${response.successCount} check-in notifications for ${today}`);
        // Clean up invalid tokens
        response.responses.forEach((resp, index) => {
            if (resp.error) {
                console.error(`Failed to send to token index ${index}:`, resp.error);
            }
        });
    }
    catch (error) {
        console.error('Error sending check-in notifications:', error);
    }
});
//# sourceMappingURL=notifications.js.map