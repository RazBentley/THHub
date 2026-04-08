import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import Stripe from 'stripe';

const db = admin.firestore();

// Stripe secret key from Firebase config
const stripe = new Stripe(functions.config().stripe?.secret_key || '', {
  apiVersion: '2023-10-16' as any,
});

const PLAN_AMOUNT = 5000; // £50.00 in pence
const CURRENCY = 'gbp';

/**
 * Creates a Stripe PaymentIntent for the client's subscription payment.
 * Called from the app when the client taps "Subscribe".
 */
export const createPaymentIntent = functions.https.onCall(async (data, context) => {
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

    let customerId: string;
    const subDoc = await db.collection('users').doc(uid).collection('subscription').doc('current').get();

    if (subDoc.exists && subDoc.data()?.stripeCustomerId) {
      customerId = subDoc.data()!.stripeCustomerId;
    } else {
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
  } catch (error: any) {
    console.error('Payment intent creation failed:', error);
    throw new functions.https.HttpsError('internal', error.message);
  }
});

/**
 * Stripe webhook handler to process payment events.
 * Set up webhook in Stripe Dashboard pointing to:
 * https://<your-region>-<your-project>.cloudfunctions.net/handleStripeWebhook
 */
export const handleStripeWebhook = functions.https.onRequest(async (req, res) => {
  const sig = req.headers['stripe-signature'] as string;
  const webhookSecret = functions.config().stripe?.webhook_secret || '';

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(req.rawBody, sig, webhookSecret);
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message);
    res.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  switch (event.type) {
    case 'payment_intent.succeeded': {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      const uid = paymentIntent.metadata.uid;

      if (uid) {
        const now = Date.now();
        const thirtyDaysLater = now + 30 * 24 * 60 * 60 * 1000;

        await db.collection('users').doc(uid).collection('subscription').doc('current').set({
          status: 'active',
          stripeCustomerId: paymentIntent.customer as string,
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
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
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
