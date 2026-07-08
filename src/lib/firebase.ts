// Firebase Client Configuration
// Firebase is optional. Without config the app runs with no persistence —
// favourites and recently-viewed return empty; add .env.local to enable it.

import { initializeApp, getApps, type FirebaseApp } from 'firebase/app';
import { getDatabase, type Database } from 'firebase/database';
import { getAuth, type Auth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const isConfigured = Boolean(firebaseConfig.databaseURL && firebaseConfig.apiKey);

const app: FirebaseApp | null = isConfigured
  ? getApps().length
    ? getApps()[0]
    : initializeApp(firebaseConfig)
  : null;

// ponytail: cast the possibly-null handles to non-null so callers stay unchanged.
// Every firebaseService function already try/catches, so a null database throws
// into that catch and returns a safe empty result. Configure Firebase to persist.
export const database = (app ? getDatabase(app) : null) as Database;
export const auth = (app ? getAuth(app) : null) as Auth;

export default app;
