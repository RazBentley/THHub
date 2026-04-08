import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

const db = admin.firestore();
const storage = admin.storage();

const SUBCOLLECTIONS = [
  'foodLog',
  'subscription',
  'settings',
  'mealPlan',
  'dailyProgress',
  'cardioLog',
  'workoutProgramme',
  'workoutProgress',
  'goals',
  'progressPhotos',
  'checkIns',
];

async function deleteCollection(collectionRef: FirebaseFirestore.CollectionReference) {
  const snapshot = await collectionRef.get();
  if (snapshot.empty) return;
  const batch = db.batch();
  for (const doc of snapshot.docs) {
    // Check for nested subcollections (e.g. foodLog/{date}/entries)
    const subcolls = await doc.ref.listCollections();
    for (const sub of subcolls) {
      await deleteCollection(sub);
    }
    batch.delete(doc.ref);
  }
  await batch.commit();
}

export const deleteUserAccount = functions.https.onCall(async (_data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Must be signed in');
  }

  const uid = context.auth.uid;

  // Delete all subcollections under the user document
  for (const sub of SUBCOLLECTIONS) {
    const collRef = db.collection(`users/${uid}/${sub}`);
    await deleteCollection(collRef);
  }

  // Delete the user document itself
  await db.doc(`users/${uid}`).delete();

  // Delete profile photos from Storage
  try {
    const [files] = await storage.bucket().getFiles({ prefix: `profile-photos/${uid}/` });
    for (const file of files) {
      await file.delete();
    }
  } catch {
    // Storage files may not exist, continue
  }

  // Delete progress photos from Storage
  try {
    const [files] = await storage.bucket().getFiles({ prefix: `progress-photos/${uid}/` });
    for (const file of files) {
      await file.delete();
    }
  } catch {
    // Continue even if no photos exist
  }

  // Remove user from any chat participant lists
  try {
    const chats = await db.collection('chats')
      .where('participants', 'array-contains', uid)
      .get();
    for (const chat of chats.docs) {
      const participants: string[] = chat.data().participants || [];
      await chat.ref.update({
        participants: participants.filter((p: string) => p !== uid),
      });
    }
  } catch {
    // Continue
  }

  return { success: true };
});
