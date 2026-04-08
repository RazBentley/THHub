import * as admin from 'firebase-admin';

admin.initializeApp();

export { sendCheckInNotifications } from './notifications';
export { createPaymentIntent, handleStripeWebhook } from './payments';
export { onNewMessage } from './messageNotifications';
export { lookupFoodNutrition, suggestWorkout } from './ai';
export { sendPushNotification } from './sendNotification';
export { deleteUserAccount } from './deleteAccount';
export { searchFatSecretFoods } from './fatSecretSearch';
