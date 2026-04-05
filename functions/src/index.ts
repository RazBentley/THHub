import * as admin from 'firebase-admin';

admin.initializeApp();

export { sendCheckInNotifications } from './notifications';
export { createPaymentIntent, handleStripeWebhook } from './payments';
