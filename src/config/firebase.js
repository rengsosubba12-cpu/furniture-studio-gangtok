/**
 * Firebase SDK Configuration — FURNITURE STUDIO GANGTOK
 *
 * Phase 1: Identity & Security (Auth, Firestore Rules)
 * Phase 2: Real Phone Auth (RecaptchaVerifier, signInWithPhoneNumber)
 *
 * Replace the placeholder config below with your Firebase project credentials.
 */

import { initializeApp } from 'firebase/app';
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// ── Firebase project configuration (replace with real values) ──────────
const firebaseConfig = {
  apiKey: 'YOUR_API_KEY',
  authDomain: 'YOUR_PROJECT.firebaseapp.com',
  projectId: 'YOUR_PROJECT_ID',
  storageBucket: 'YOUR_PROJECT.appspot.com',
  messagingSenderId: 'YOUR_SENDER_ID',
  appId: 'YOUR_APP_ID',
};

// ── Initialize Firebase ────────────────────────────────────────────────
const app = initializeApp(firebaseConfig);

// Phase 1 — Auth & Firestore
export const auth = getAuth(app);
export const db = getFirestore(app);

// Phase 2 — Phone Auth helpers
export const setupRecaptcha = (elementId) => {
  return new RecaptchaVerifier(auth, elementId, {
    size: 'invisible',
    callback: () => {
      // reCAPTCHA solved — allow signInWithPhoneNumber
    },
  });
};

export const phoneSignIn = async (phoneNumber, appVerifier) => {
  try {
    const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
    return confirmationResult;
  } catch (error) {
    console.error('Phone auth error:', error);
    throw error;
  }
};

export default app;
