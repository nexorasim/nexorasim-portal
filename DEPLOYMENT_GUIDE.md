# NexoraSIM Deployment Guide

Complete production deployment guide for the enhanced NexoraSIM system with all advanced features.

## 🚀 Production Features Deployed

### ✅ **Advanced Features Implemented**
- **Offline QR Access**: Cached QR codes for offline viewing
- **3D Plan Selection**: Interactive 3D plan browsing with gestures
- **Real-time Analytics**: Live dashboard with Firebase integration
- **Multi-currency Support**: Dynamic currency conversion with live rates
- **Advanced Fraud Detection**: ML-based risk scoring and device fingerprinting
- **AI Customer Support**: Intelligent chatbot with contextual responses

## 📱 **Mobile App Deployment**

### **1. Build Configuration**
```bash
# Install EAS CLI
npm install -g eas-cli

# Login to Expo
eas login

# Configure build profiles
eas build:configure
```

### **2. Production Builds**
```bash
# iOS Production Build
eas build --platform ios --profile production

# Android Production Build  
eas build --platform android --profile production

# Web Build
npm run build:web
```

### **3. App Store Submission**
```bash
# iOS App Store
eas submit --platform ios --profile production

# Google Play Store
eas submit --platform android --profile production
```

## 🌐 **Web Deployment**

### **Firebase Hosting**
```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize hosting
firebase init hosting

# Deploy
firebase deploy --only hosting
```

### **Vercel Deployment**
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel --prod
```

## 🔧 **Backend Deployment**

### **WordPress Production Setup**
```bash
# 1. Server Requirements
- PHP 8.0+
- MySQL 8.0+
- WordPress 6.4+
- SSL Certificate
- CDN (CloudFlare)

# 2. Upload Plugin
scp -r wordpress-plugin/ user@server:/var/www/html/wp-content/plugins/nexorasim

# 3. Set Permissions
chmod -R 755 /var/www/html/wp-content/plugins/nexorasim
chown -R www-data:www-data /var/www/html/wp-content/plugins/nexorasim
```

### **Database Optimization**
```sql
-- Performance indexes
ALTER TABLE wp_nexorasim_orders ADD INDEX idx_user_status (user_id, status);
ALTER TABLE wp_nexorasim_orders ADD INDEX idx_created_at (created_at);
ALTER TABLE wp_nexorasim_analytics ADD INDEX idx_event_timestamp (event_type, timestamp);
ALTER TABLE wp_nexorasim_fraud_logs ADD INDEX idx_risk_score (risk_score);

-- Analytics table
CREATE TABLE wp_nexorasim_analytics (
    id bigint(20) NOT NULL AUTO_INCREMENT,
    event_type varchar(50) NOT NULL,
    user_id bigint(20),
    data text,
    ip_address varchar(45),
    user_agent text,
    timestamp datetime DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    INDEX idx_event_timestamp (event_type, timestamp)
);

-- Fraud detection table
CREATE TABLE wp_nexorasim_fraud_logs (
    id bigint(20) NOT NULL AUTO_INCREMENT,
    user_id bigint(20) NOT NULL,
    amount decimal(10,2) NOT NULL,
    payment_method varchar(50),
    risk_score decimal(3,2),
    features text,
    ip_address varchar(45),
    user_agent text,
    timestamp datetime DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    INDEX idx_risk_score (risk_score)
);
```

## 🔐 **Security Configuration**

### **SSL/HTTPS Setup**
```bash
# Let's Encrypt SSL
certbot --nginx -d app.nexorasim.com

# Force HTTPS in WordPress
define('FORCE_SSL_ADMIN', true);
```

### **Security Headers**
```nginx
# Nginx security headers
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-XSS-Protection "1; mode=block" always;
add_header X-Content-Type-Options "nosniff" always;
add_header Referrer-Policy "no-referrer-when-downgrade" always;
add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;
```

### **Rate Limiting**
```nginx
# Rate limiting configuration
limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;
limit_req_zone $binary_remote_addr zone=login:10m rate=1r/s;

location /wp-json/nexorasim/ {
    limit_req zone=api burst=20 nodelay;
}
```

## 📊 **Analytics & Monitoring**

### **Google Analytics 4**
```javascript
// GA4 Configuration
gtag('config', 'GA_MEASUREMENT_ID', {
  custom_map: {
    'custom_parameter_1': 'esim_plan_id',
    'custom_parameter_2': 'payment_method'
  }
});

// Track eSIM purchases
gtag('event', 'purchase', {
  transaction_id: order_id,
  value: amount,
  currency: 'USD',
  items: [{
    item_id: plan_id,
    item_name: plan_name,
    category: 'eSIM',
    quantity: 1,
    price: amount
  }]
});
```

### **Firebase Analytics**
```typescript
// Enhanced event tracking
import { logEvent } from 'firebase/analytics';

// Track plan views with enhanced data
logEvent(analytics, 'view_item', {
  currency: 'USD',
  value: plan.price,
  items: [{
    item_id: plan.id,
    item_name: plan.name,
    item_category: 'eSIM',
    item_variant: plan.country,
    price: plan.price,
    quantity: 1
  }]
});
```

## 🔄 **CI/CD Pipeline**

### **GitHub Actions Workflow**
```yaml
# .github/workflows/deploy.yml
name: Deploy NexoraSIM
on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm test
      - run: npm run lint

  build-mobile:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: eas build --platform all --non-interactive
        env:
          EXPO_TOKEN: ${{ secrets.EXPO_TOKEN }}

  deploy-web:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm run build:web
      - uses: FirebaseExtended/action-hosting-deploy@v0
        with:
          repoToken: '${{ secrets.GITHUB_TOKEN }}'
          firebaseServiceAccount: '${{ secrets.FIREBASE_SERVICE_ACCOUNT }}'
          projectId: nexorasim
```

## 🌍 **CDN & Performance**

### **CloudFlare Configuration**
```javascript
// CloudFlare Workers for API caching
addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  const cache = caches.default
  const cacheKey = new Request(request.url, request)
  
  // Check cache first
  let response = await cache.match(cacheKey)
  
  if (!response) {
    response = await fetch(request)
    
    // Cache API responses for 5 minutes
    if (request.url.includes('/wp-json/nexorasim/')) {
      const headers = new Headers(response.headers)
      headers.set('Cache-Control', 'max-age=300')
      response = new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers: headers
      })
      event.waitUntil(cache.put(cacheKey, response.clone()))
    }
  }
  
  return response
}
```

## 📱 **App Store Optimization**

### **iOS App Store**
```json
{
  "name": "NexoraSIM - Global eSIM",
  "subtitle": "Instant eSIM for 200+ Countries",
  "keywords": "eSIM,travel,data,roaming,international",
  "description": "Get instant eSIM data plans for 200+ countries. No physical SIM needed. Activate in seconds with QR code.",
  "categories": ["Travel", "Utilities"],
  "screenshots": {
    "6.5": ["screenshot1.png", "screenshot2.png"],
    "5.5": ["screenshot1_55.png", "screenshot2_55.png"]
  }
}
```

### **Google Play Store**
```xml
<!-- Play Store listing -->
<title>NexoraSIM - Global eSIM Data Plans</title>
<short_description>Instant eSIM activation for global travel</short_description>
<full_description>
Transform your travel experience with NexoraSIM - the ultimate eSIM solution for global connectivity.

🌍 200+ Countries Supported
📱 Instant QR Code Activation  
💳 Secure Payment Options
🔒 Biometric Security
🌐 Multi-language Support

Perfect for business travelers, tourists, and digital nomads who need reliable data connectivity worldwide.
</full_description>
```

## 🔍 **SEO & Marketing**

### **Website SEO**
```html
<!-- Meta tags for nexorasim.web.app -->
<title>NexoraSIM - Global eSIM Data Plans | Instant Activation</title>
<meta name="description" content="Get instant eSIM data plans for 200+ countries. No physical SIM card needed. Activate with QR code in seconds. Perfect for travel and business.">
<meta name="keywords" content="eSIM, travel data, international roaming, digital SIM, mobile data">

<!-- Open Graph -->
<meta property="og:title" content="NexoraSIM - Global eSIM Solutions">
<meta property="og:description" content="Instant eSIM activation for global travel">
<meta property="og:image" content="https://nexorasim.web.app/og-image.jpg">
<meta property="og:url" content="https://nexorasim.web.app">

<!-- Schema.org -->
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "NexoraSIM",
  "applicationCategory": "TravelApplication",
  "operatingSystem": "iOS, Android, Web",
  "offers": {
    "@type": "Offer",
    "price": "15.00",
    "priceCurrency": "USD"
  }
}
</script>
```

## 📈 **Performance Monitoring**

### **Application Performance**
```typescript
// Performance monitoring setup
import { getPerformance } from 'firebase/performance';

const perf = getPerformance();

// Custom traces
const trace = perf.trace('esim_purchase_flow');
trace.start();
// ... purchase logic
trace.stop();

// Network monitoring
const networkTrace = perf.trace('api_call');
networkTrace.putAttribute('endpoint', '/esim/purchase');
networkTrace.putMetric('response_size', responseSize);
```

### **Error Tracking**
```typescript
// Sentry integration
import * as Sentry from '@sentry/react-native';

Sentry.init({
  dsn: 'YOUR_SENTRY_DSN',
  environment: 'production'
});

// Custom error boundaries
class ErrorBoundary extends React.Component {
  componentDidCatch(error, errorInfo) {
    Sentry.captureException(error, { extra: errorInfo });
  }
}
```

## 🔧 **Maintenance & Updates**

### **Automated Backups**
```bash
#!/bin/bash
# Daily backup script
DATE=$(date +%Y%m%d)
mysqldump -u root -p nexorasim_db > /backups/nexorasim_$DATE.sql
aws s3 cp /backups/nexorasim_$DATE.sql s3://nexorasim-backups/
```

### **Health Checks**
```bash
#!/bin/bash
# Health check script
curl -f https://app.nexorasim.com/wp-json/nexorasim/v1/health || exit 1
curl -f https://nexorasim.web.app/health || exit 1
```

## 📊 **Success Metrics**

### **KPIs to Track**
- **User Acquisition**: Daily/Monthly Active Users
- **Conversion Rate**: Plan view to purchase
- **Revenue Metrics**: Daily/Monthly revenue, ARPU
- **Technical Metrics**: App crash rate, API response time
- **User Experience**: App store ratings, support tickets

### **Analytics Dashboard**
- Real-time user activity
- Revenue trends and forecasting  
- Geographic usage patterns
- Payment method preferences
- Fraud detection alerts

## 🎯 **Go-Live Checklist**

### **Pre-Launch**
- [ ] All payment gateways tested in production
- [ ] SSL certificates installed and verified
- [ ] Database backups configured
- [ ] Monitoring and alerting set up
- [ ] App store listings approved
- [ ] Legal pages (Privacy, Terms) published
- [ ] Customer support channels ready

### **Launch Day**
- [ ] Deploy latest code to production
- [ ] Verify all services are running
- [ ] Monitor error rates and performance
- [ ] Test critical user flows
- [ ] Announce launch on social media
- [ ] Monitor customer feedback

### **Post-Launch**
- [ ] Daily monitoring of key metrics
- [ ] Weekly performance reviews
- [ ] Monthly feature updates
- [ ] Quarterly security audits
- [ ] Continuous user feedback collection

---

**Production URLs:**
- **Mobile Apps**: Available on App Store & Google Play
- **Web App**: https://nexorasim.web.app
- **Admin Panel**: https://app.nexorasim.com/wp-admin
- **API Base**: https://app.nexorasim.com/wp-json/nexorasim/v1

**Support Channels:**
- Email: support@nexorasim.com
- Live Chat: Available in mobile app
- Documentation: https://docs.nexorasim.com

The complete NexoraSIM system is now production-ready with all advanced features deployed! 🚀