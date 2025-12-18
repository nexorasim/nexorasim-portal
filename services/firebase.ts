import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getMessaging, isSupported } from 'firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import { ENV } from '../config/env';

const firebaseConfig = ENV.FIREBASE_CONFIG;

// Ensure singleton initialization across hot reloads and multiple imports
export const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

export const auth = Platform.OS === 'web'
  ? getAuth(app)
  : (() => {
      // initializeAuth must be called only once on native
      try {
        return getAuth(app);
      } catch (e) {
        return initializeAuth(app, { persistence: getReactNativePersistence(AsyncStorage) });
      }
    })();

export const db = getFirestore(app);

export const messaging = Platform.OS === 'web' && typeof window !== 'undefined'
  ? (await isSupported().catch(() => false)) ? getMessaging(app) : null
  : null;