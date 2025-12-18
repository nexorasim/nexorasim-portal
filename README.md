# NexoraSIM - Complete eSIM Management System

A comprehensive cross-platform eSIM management and sales system with WordPress backend and React Native (Expo) frontend.

## Features

### Mobile App (React Native + Expo)
- **Multi-platform**: iOS, Android, and Web from single codebase
- **Authentication**: Email/password, phone OTP, Google Sign-In, biometrics
- **eSIM Management**: Browse plans, instant purchase, QR code activation
- **Payment Integration**: Myanmar gateways (WavePay, AYA Pay, KBZ Pay, TransactEase) + Visa/Mastercard
- **Wallet System**: Credit top-up and balance management
- **Multi-language**: English and Burmese support
- **Real-time**: Push notifications and live updates

### WordPress Backend
- **WooCommerce Integration**: Complete e-commerce functionality
- **REST API**: Secure JWT-based authentication
- **Admin Dashboard**: User management, sales analytics, eSIM provisioning
- **Payment Processing**: PCI-compliant secure transactions
- **Order Management**: Complete order lifecycle tracking

## Tech Stack

### Frontend
- React Native + Expo SDK 54
- Redux Toolkit for state management
- React Native Paper for UI components
- Firebase for authentication and notifications
- i18next for internationalization

### Backend
- WordPress + WooCommerce
- Custom REST API endpoints
- MySQL database
- JWT authentication
- Payment gateway integrations

## Installation

### Prerequisites
- Node.js 18+
- Expo CLI
- WordPress 6.0+
- WooCommerce 8.0+

### Mobile App Setup

1. **Clone and install dependencies**
```bash
git clone <repository>
cd nexorasim
npm install
```

2. **Environment Configuration**
```bash
cp .env.example .env
# Edit .env with your configuration
```

3. **Start development server**
```bash
# iOS
npm run ios

# Android
npm run android

# Web
npm run web
```

### WordPress Plugin Setup

1. **Upload plugin**
```bash
cp -r wordpress-plugin /path/to/wordpress/wp-content/plugins/nexorasim
```

2. **Activate plugin**
- Go to WordPress Admin → Plugins
- Activate "NexoraSIM eSIM Management"

3. **Configure settings**
- Navigate to NexoraSIM settings
- Add payment gateway API keys
- Configure eSIM plans

## Configuration

### Firebase Setup
1. Create Firebase project
2. Enable Authentication, Firestore, and Cloud Messaging
3. Download configuration files:
   - `google-services.json` (Android)
   - `GoogleService-Info.plist` (iOS)
4. Update environment variables

### Payment Gateways
Configure API keys in WordPress admin:
- WavePay API Key
- AYA Pay API Key
- KBZ Pay API Key
- TransactEase API Key

## API Endpoints

### Authentication
- `POST /wp-json/nexorasim/v1/auth/login`
- `POST /wp-json/nexorasim/v1/auth/register`
- `POST /wp-json/nexorasim/v1/auth/verify-otp`

### eSIM Management
- `GET /wp-json/nexorasim/v1/esim/plans`
- `POST /wp-json/nexorasim/v1/esim/purchase`
- `GET /wp-json/nexorasim/v1/esim/orders`

### Payment Processing
- `GET /wp-json/nexorasim/v1/payment/methods`
- `POST /wp-json/nexorasim/v1/payment/process`
- `POST /wp-json/nexorasim/v1/payment/add-funds`

## Security Features

- JWT token-based authentication
- Encrypted API communication
- PCI-compliant payment processing
- Biometric authentication support
- Secure credential storage

## Internationalization

The app supports multiple languages:
- English (default)
- Burmese (Myanmar)

Add new languages by creating translation files in `/locales/`

## Deployment

### Mobile App
```bash
# Build for production
eas build --platform all

# Submit to app stores
eas submit --platform all
```

### Web App
```bash
# Build web version
npm run build:web

# Deploy to hosting service
# (Firebase Hosting, Vercel, etc.)
```

## Testing

```bash
# Run tests
npm test

# Run linting
npm run lint

# Type checking
npm run type-check
```

## Analytics Integration

The system supports:
- Google Analytics
- Firebase Analytics
- Custom event tracking
- Revenue analytics

## UI/UX Features

- Material Design 3 components
- Dark/Light mode support
- Smooth animations
- Responsive design
- Accessibility compliance

## State Management

Redux Toolkit slices:
- `authSlice`: User authentication
- `esimSlice`: eSIM plans and orders
- `paymentSlice`: Payment methods and transactions

## Support

For technical support:
- Create GitHub issues
- Email: support@nexorasim.com
- Documentation: [docs.nexorasim.com]

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contributing

1. Fork the repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Create Pull Request

## Roadmap

- [ ] Offline QR code access
- [ ] 3D plan selection interface
- [ ] Real-time analytics dashboard
- [ ] Multi-currency support
- [ ] Advanced fraud detection
- [ ] AI-powered customer support

---

Built by the NexoraSIM Team