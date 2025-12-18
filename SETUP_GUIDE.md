# NexoraSIM Setup Guide

Complete step-by-step guide to set up the NexoraSIM eSIM management system.

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Backend Setup (WordPress)](#backend-setup)
3. [Frontend Setup (React Native)](#frontend-setup)
4. [Firebase Configuration](#firebase-configuration)
5. [Payment Gateway Setup](#payment-gateway-setup)
6. [Deployment](#deployment)

---

## Prerequisites

### Required Software
- Node.js 18+ and npm
- Expo CLI: `npm install -g expo-cli`
- WordPress 6.0+
- WooCommerce 8.0+
- MySQL 5.7+
- PHP 7.4+

### Required Accounts
- Firebase account
- Google Cloud Console (for Google Sign-In)
- Payment gateway accounts (WavePay, AYA Pay, KBZ Pay, TransactEase)
- Apple Developer account (for iOS)
- Google Play Console account (for Android)

---

## Backend Setup (WordPress)

### Step 1: Install WordPress
```bash
# Download WordPress
wget https://wordpress.org/latest.zip
unzip latest.zip
mv wordpress /var/www/html/nexorasim

# Configure database
mysql -u root -p
CREATE DATABASE nexorasim_db;
CREATE USER 'nexorasim_user'@'localhost' IDENTIFIED BY 'your_password';
GRANT ALL PRIVILEGES ON nexorasim_db.* TO 'nexorasim_user'@'localhost';
FLUSH PRIVILEGES;
```

### Step 2: Install WooCommerce
1. Login to WordPress admin
2. Navigate to Plugins → Add New
3. Search for "WooCommerce"
4. Install and activate

### Step 3: Install NexoraSIM Plugin
```bash
# Copy plugin to WordPress
cp -r wordpress-plugin /var/www/html/nexorasim/wp-content/plugins/nexorasim

# Set permissions
chmod -R 755 /var/www/html/nexorasim/wp-content/plugins/nexorasim
```

1. Go to WordPress Admin → Plugins
2. Find "NexoraSIM eSIM Management"
3. Click "Activate"

### Step 4: Configure Plugin
1. Navigate to NexoraSIM → Settings
2. Configure:
   - API Secret Key
   - Payment Gateway Keys
   - Email Settings
   - SMS Provider (for OTP)

### Step 5: Add eSIM Plans
1. Go to NexoraSIM → Plans
2. Click "Add New Plan"
3. Fill in:
   - Plan Name
   - Country
   - Data Amount
   - Validity Days
   - Price
   - Description

---

## Frontend Setup (React Native)

### Step 1: Clone and Install
```bash
git clone <repository-url>
cd nexorasim
npm install
```

### Step 2: Environment Configuration
```bash
cp .env.example .env
```

Edit `.env` file:
```env
EXPO_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
EXPO_PUBLIC_FIREBASE_APP_ID=your_app_id
EXPO_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id
EXPO_PUBLIC_WAVEPAY_API_KEY=your_wavepay_key
EXPO_PUBLIC_AYA_PAY_API_KEY=your_aya_pay_key
EXPO_PUBLIC_KBZ_PAY_API_KEY=your_kbz_pay_key
EXPO_PUBLIC_TRANSACT_EASE_API_KEY=your_transact_ease_key
```

### Step 3: Update API Base URL
Edit `config/env.ts`:
```typescript
export const ENV = {
  API_BASE_URL: 'https://app.nexorasim.com/wp-json/nexorasim/v1',
  // ... rest of config
};
```

### Step 4: Start Development Server
```bash
# Start Expo
npm start

# Or specific platform
npm run ios      # iOS
npm run android  # Android
npm run web      # Web
```

---

## Firebase Configuration

### Step 1: Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Click "Add Project"
3. Enter project name: "NexoraSIM"
4. Enable Google Analytics (optional)

### Step 2: Add Apps
**For iOS:**
1. Click iOS icon
2. Enter bundle ID: `com.nexorasim.app`
3. Download `GoogleService-Info.plist`
4. Place in project root

**For Android:**
1. Click Android icon
2. Enter package name: `com.nexorasim.app`
3. Download `google-services.json`
4. Place in project root

**For Web:**
1. Click Web icon
2. Register app
3. Copy config to `.env`

### Step 3: Enable Authentication
1. Go to Authentication → Sign-in method
2. Enable:
   - Email/Password
   - Google
   - Phone

### Step 4: Configure Firestore
1. Go to Firestore Database
2. Create database (start in production mode)
3. Set up security rules:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    match /orders/{orderId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null;
    }
  }
}
```

### Step 5: Enable Cloud Messaging
1. Go to Cloud Messaging
2. Generate server key
3. Add to WordPress plugin settings

---

## Payment Gateway Setup

### WavePay
1. Register at [WavePay Developer Portal](https://wavepay.com.mm)
2. Create application
3. Get API credentials
4. Add to WordPress settings

### AYA Pay
1. Contact AYA Bank for merchant account
2. Get API credentials
3. Configure in WordPress

### KBZ Pay
1. Register at KBZ Pay merchant portal
2. Complete verification
3. Get API keys
4. Add to settings

### TransactEase
1. Sign up at TransactEase
2. Complete KYC
3. Get API credentials
4. Configure in WordPress

### International Cards (Stripe)
1. Create Stripe account
2. Get publishable and secret keys
3. Add to WordPress settings
4. Configure webhooks

---

## Deployment

### Mobile App Deployment

#### iOS (App Store)
```bash
# Install EAS CLI
npm install -g eas-cli

# Login to Expo
eas login

# Configure build
eas build:configure

# Build for iOS
eas build --platform ios

# Submit to App Store
eas submit --platform ios
```

#### Android (Play Store)
```bash
# Build for Android
eas build --platform android

# Submit to Play Store
eas submit --platform android
```

#### Web Deployment
```bash
# Build web version
npm run build:web

# Deploy to Firebase Hosting
firebase deploy --only hosting

# Or deploy to Vercel
vercel deploy
```

### Backend Deployment

#### WordPress Hosting
1. Choose hosting provider (AWS, DigitalOcean, etc.)
2. Install WordPress
3. Configure SSL certificate
4. Set up CDN (CloudFlare)
5. Configure backups

#### Database Optimization
```sql
-- Add indexes for performance
ALTER TABLE wp_nexorasim_orders ADD INDEX idx_user_id (user_id);
ALTER TABLE wp_nexorasim_orders ADD INDEX idx_status (status);
ALTER TABLE wp_nexorasim_plans ADD INDEX idx_country (country);
```

---

## Testing

### Test User Accounts
Create test accounts for each payment method:
```bash
# Test credentials
Email: test@nexorasim.com
Password: Test123!@#
Phone: +959123456789
```

### Test eSIM Plans
Add test plans with $0.01 price for testing

### Payment Testing
Use sandbox/test credentials for all payment gateways

---

## Monitoring & Analytics

### Google Analytics
1. Create GA4 property
2. Add tracking ID to app
3. Configure events

### Firebase Analytics
Automatically enabled with Firebase SDK

### Error Tracking
Consider adding:
- Sentry for error tracking
- LogRocket for session replay

---

## Security Checklist

- [ ] Enable HTTPS/SSL
- [ ] Configure CORS properly
- [ ] Set up rate limiting
- [ ] Enable WordPress security plugins
- [ ] Configure firewall rules
- [ ] Set up automated backups
- [ ] Enable two-factor authentication
- [ ] Regular security audits
- [ ] PCI compliance for payments
- [ ] GDPR compliance for EU users

---

## Troubleshooting

### Common Issues

**Issue: Firebase not connecting**
- Check API keys in `.env`
- Verify Firebase config files are in place
- Check network connectivity

**Issue: API requests failing**
- Verify WordPress REST API is enabled
- Check CORS settings
- Verify JWT token generation

**Issue: Payment gateway errors**
- Verify API keys are correct
- Check sandbox vs production mode
- Review gateway documentation

**Issue: Build failures**
- Clear cache: `expo start -c`
- Delete node_modules and reinstall
- Check Expo SDK compatibility

---

## Support

For technical support:
- Documentation: https://docs.nexorasim.com
- Email: support@nexorasim.com
- GitHub Issues: https://github.com/nexorasim/issues

---

## Next Steps

After setup:
1. Test all features thoroughly
2. Configure analytics
3. Set up monitoring
4. Create user documentation
5. Plan marketing strategy
6. Prepare for launch

---

**Last Updated:** December 2024
**Version:** 1.0.0