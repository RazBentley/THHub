import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
// @ts-ignore - React Native persistence
import { getReactNativePersistence, initializeAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: 'AIzaSyBZ2kqpAfNoC_vcjttZubNIja-gdmG_2UQ',
  authDomain: 'th-hub-5883e.firebaseapp.com',
  projectId: 'th-hub-5883e',
  storageBucket: 'th-hub-5883e.firebasestorage.app',
  messagingSenderId: '114911097865',
  appId: '1:114911097865:web:777ec6a91d11f2922ab4d8',
};

const app = initializeApp(firebaseConfig);

// Use initializeAuth with AsyncStorage persistence for React Native
let auth: ReturnType<typeof getAuth>;
try {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
} catch {
  // If auth is already initialized (hot reload), just get the instance
  auth = getAuth(app);
}

export { auth };
export const db = getFirestore(app);
export const storage = getStorage(app);
export default app;
