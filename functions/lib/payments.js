"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleStripeWebhook = exports.createPaymentIntent = void 0;
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const stripe_1 = require("stripe");
const db = admin.firestore();
// TODO: Set your Stripe secret key in Firebase config:
// firebase functions:config:set stripe.secret_key="sk_test_..."
const stripe = new stripe_1.default(((_a = functions.config().stripe) === null || _a === void 0 ? void 0 : _a.secret_key) || '', {
    apiVersion: '2023-10-16',
});
const PLAN_AMOUNT = 5000; // £50.00 in pence
const CURRENCY = 'gbp';
/**
 * Creates a Stripe PaymentIntent for the client's subscription payment.
 * Called from the app when the client taps "Subscribe".
 */
exports.createPaymentIntent = functions.https.onCall(async (data, context) => {
    var _a;
    if (!context.auth) {
        throw new functions.https.HttpsError('unauthenticated', 'Must be logged in');
    }
    const uid = context.auth.uid;
    try {
        // Get or create Stripe customer
        const userDoc = await db.collection('users').doc(uid).get();
        const userData = userDoc.data();
        if (!userData) {
            throw new functions.https.HttpsError('not-found', 'User not found');
        }
        let customerId;
        const subDoc = await db.collection('users').doc(uid).collection('subscription').doc('current').get();
        if (subDoc.exists && ((_a = subDoc.data()) === null || _a === void 0 ? void 0 : _a.stripeCustomerId)) {
            customerId = subDoc.data().stripeCustomerId;
        }
        else {
            const customer = await stripe.customers.create({
                email: userData.email,
                name: userData.name,
                metadata: { firebaseUid: uid },
            });
            customerId = customer.id;
        }
        // Create PaymentIntent
        const paymentIntent = await stripe.paymentIntents.create({
            amount: PLAN_AMOUNT,
            currency: CURRENCY,
            customer: customerId,
            metadata: { uid, plan: 'th_training_monthly' },
        });
        return {
            clientSecret: paymentIntent.client_secret,
            customerId,
        };
    }
    catch (error) {
        console.error('Payment intent creation failed:', error);
        throw new functions.https.HttpsError('internal', error.message);
    }
});
/**
 * Stripe webhook handler to process payment events.
 * Set up webhook in Stripe Dashboard pointing to:
 * https://<your-region>-<your-project>.cloudfunctions.net/handleStripeWebhook
 */
exports.handleStripeWebhook = functions.https.onRequest(async (req, res) => {
    var _a;
    const sig = req.headers['stripe-signature'];
    const webhookSecret = ((_a = functions.config().stripe) === null || _a === void 0 ? void 0 : _a.webhook_secret) || '';
    let event;
    try {
        event = stripe.webhooks.constructEvent(req.rawBody, sig, webhookSecret);
    }
    catch (err) {
        console.error('Webhook signature verification failed:', err.message);
        res.status(400).send(`Webhook Error: ${err.message}`);
        return;
    }
    switch (event.type) {
        case 'payment_intent.succeeded': {
            const paymentIntent = event.data.object;
            const uid = paymentIntent.metadata.uid;
            if (uid) {
                const now = Date.now();
                const thirtyDaysLater = now + 30 * 24 * 60 * 60 * 1000;
                await db.collection('users').doc(uid).collection('subscription').doc('current').set({
                    status: 'active',
                    stripeCustomerId: paymentIntent.customer,
                    currentPeriodEnd: thirtyDaysLater,
                    plan: 'th_training_monthly',
                    amount: PLAN_AMOUNT,
                    lastPayment: now,
                });
                console.log(`Subscription activated for user ${uid}`);
            }
            break;
        }
        case 'payment_intent.payment_failed': {
            const paymentIntent = event.data.object;
            const uid = paymentIntent.metadata.uid;
            if (uid) {
                await db.collection('users').doc(uid).collection('subscription').doc('current').update({
                    status: 'past_due',
                });
                console.log(`Payment failed for user ${uid}`);
            }
            break;
        }
        default:
            console.log(`Unhandled event type: ${event.type}`);
    }
    res.json({ received: true });
});
//# sourceMappingURL=payments.js.map