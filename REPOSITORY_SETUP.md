# NexoraSIM Repository Setup

## 🚀 Repository Ready for GitHub

The complete NexoraSIM system has been prepared for the GitHub repository: `git@github.com:nexorasim/nexorasim-portal.git`

### 📁 **Repository Structure**
```
nexorasim-portal/
├── .github/workflows/     # CI/CD pipelines
├── app/                   # Expo Router screens
├── components/            # React Native components
├── config/               # Environment configuration
├── services/             # API and Firebase services
├── store/                # Redux state management
├── types/                # TypeScript definitions
├── utils/                # Utility functions
├── locales/              # Internationalization
├── wordpress-plugin/     # Complete WordPress backend
├── .env.example          # Environment template
├── eas.json             # Expo build configuration
├── firebase.json        # Firebase hosting config
└── README.md            # Project documentation
```

### 🔧 **Setup Instructions**

1. **Clone Repository**
```bash
git clone git@github.com:nexorasim/nexorasim-portal.git
cd nexorasim-portal
```

2. **Install Dependencies**
```bash
npm install
```

3. **Environment Setup**
```bash
cp .env.example .env
# Edit .env with your Firebase and API keys
```

4. **Start Development**
```bash
npm start          # Expo development server
npm run ios        # iOS simulator
npm run android    # Android emulator
npm run web        # Web browser
```

### 🚀 **Deployment Commands**

**Mobile Apps:**
```bash
eas build --platform all          # Build for all platforms
eas submit --platform all         # Submit to app stores
```

**Web App:**
```bash
npm run build:web                  # Build web version
firebase deploy --only hosting    # Deploy to Firebase
```

### 📊 **Features Included**

✅ **Complete eSIM Management System**
- Cross-platform mobile app (iOS/Android/Web)
- WordPress backend with REST API
- Real-time analytics dashboard
- Multi-currency support (6 currencies)
- Advanced fraud detection with ML
- AI-powered customer support
- Offline QR code access
- 3D interactive plan selection
- Biometric authentication
- Push notifications
- Multi-language support (English/Burmese)

✅ **Payment Integration**
- Myanmar gateways (WavePay, AYA Pay, KBZ Pay, TransactEase)
- International cards (Visa/Mastercard)
- Wallet system with top-up
- PCI-compliant processing

✅ **Production Ready**
- CI/CD pipelines with GitHub Actions
- Automated testing and deployment
- Performance monitoring
- Error tracking
- Security best practices
- SEO optimization

### 🔐 **Required Secrets**

Add these secrets to your GitHub repository:

```
EXPO_TOKEN                    # Expo account token
FIREBASE_SERVICE_ACCOUNT      # Firebase service account JSON
GITHUB_TOKEN                  # Automatically provided
```

### 📱 **App Store Information**

**iOS App Store:**
- Bundle ID: `com.nexorasim.app`
- App Name: "NexoraSIM - Global eSIM"
- Category: Travel, Utilities

**Google Play Store:**
- Package Name: `com.nexorasim.app`
- App Name: "NexoraSIM - Global eSIM Data Plans"
- Category: Travel & Local

### 🌐 **Live URLs**

Once deployed:
- **Web App**: https://nexorasim.web.app
- **Admin Panel**: https://app.nexorasim.com/wp-admin
- **API Base**: https://app.nexorasim.com/wp-json/nexorasim/v1

### 📞 **Support**

- **Documentation**: Complete setup guides included
- **Issues**: Use GitHub Issues for bug reports
- **Features**: Use GitHub Discussions for feature requests

---

**Status**: ✅ Repository ready for immediate deployment
**Last Updated**: December 2024
**Version**: 1.0.0 (Production Ready)