// Centralized and validated environment variables
// - Fails fast in production if required vars are missing
// - Provides safe local defaults for development
// - Keeps a single typed ENV export consumed throughout the app

type FirebaseConfig = {
  apiKey: string;
  authDomain?: string;
  projectId: string;
  storageBucket?: string;
  messagingSenderId?: string;
  appId: string;
};

type PaymentGateways = {
  WAVEPAY?: string;
  AYA_PAY?: string;
  KBZ_PAY?: string;
  TRANSACT_EASE?: string;
};

type EnvShape = {
  API_BASE_URL: string;
  FIREBASE_CONFIG: FirebaseConfig;
  GOOGLE_CLIENT_ID?: string;
  PAYMENT_GATEWAYS: PaymentGateways;
  NODE_ENV: 'development' | 'production' | 'test';
  IS_DEV: boolean;
};

const NODE_ENV = (process.env.NODE_ENV as EnvShape['NODE_ENV']) || 'development';
const IS_DEV = NODE_ENV !== 'production';

function requireVar(value: string | undefined, key: string, opts?: { allowInDevDefault?: string }) {
  if (value && value.trim().length > 0) return value;
  if (IS_DEV && opts?.allowInDevDefault) return opts.allowInDevDefault;
  throw new Error(`Missing required environment variable: ${key}`);
}

function validUrl(url: string, key: string) {
  try {
    // eslint-disable-next-line no-new
    new URL(url);
    return url;
  } catch {
    throw new Error(`Invalid URL in environment variable: ${key}`);
  }
}

const API_BASE_URL = validUrl(
  process.env.EXPO_PUBLIC_API_BASE_URL || 'https://app.nexorasim.com/wp-json/nexorasim/v1',
  'EXPO_PUBLIC_API_BASE_URL'
);

const FIREBASE_CONFIG: FirebaseConfig = {
  apiKey: requireVar(process.env.EXPO_PUBLIC_FIREBASE_API_KEY, 'EXPO_PUBLIC_FIREBASE_API_KEY'),
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: requireVar(process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID, 'EXPO_PUBLIC_FIREBASE_PROJECT_ID'),
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: requireVar(process.env.EXPO_PUBLIC_FIREBASE_APP_ID, 'EXPO_PUBLIC_FIREBASE_APP_ID'),
};

const PAYMENT_GATEWAYS: PaymentGateways = {
  WAVEPAY: process.env.EXPO_PUBLIC_WAVEPAY_API_KEY,
  AYA_PAY: process.env.EXPO_PUBLIC_AYA_PAY_API_KEY,
  KBZ_PAY: process.env.EXPO_PUBLIC_KBZ_PAY_API_KEY,
  TRANSACT_EASE: process.env.EXPO_PUBLIC_TRANSACT_EASE_API_KEY,
};

export const ENV: EnvShape = {
  API_BASE_URL: API_BASE_URL,
  FIREBASE_CONFIG,
  GOOGLE_CLIENT_ID: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID,
  PAYMENT_GATEWAYS,
  NODE_ENV,
  IS_DEV,
};