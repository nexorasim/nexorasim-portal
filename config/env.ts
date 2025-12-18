export const ENV = {
  API_BASE_URL: 'https://app.nexorasim.com/wp-json/nexorasim/v1',
  FIREBASE_CONFIG: {
    apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
  },
  GOOGLE_CLIENT_ID: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID,
  PAYMENT_GATEWAYS: {
    WAVEPAY: process.env.EXPO_PUBLIC_WAVEPAY_API_KEY,
    AYA_PAY: process.env.EXPO_PUBLIC_AYA_PAY_API_KEY,
    KBZ_PAY: process.env.EXPO_PUBLIC_KBZ_PAY_API_KEY,
    TRANSACT_EASE: process.env.EXPO_PUBLIC_TRANSACT_EASE_API_KEY,
  },
};