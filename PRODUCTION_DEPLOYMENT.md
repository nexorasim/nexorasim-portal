# Production Deployment Steps

## 1. Web App Deployment (IMMEDIATE)

### Upload to Hosting
```bash
# Upload dist/ folder to: public_html/
# Via FTP: ftp://app.nexorasim.com
# Username: u755220709.app.nexorasim.com
# Password: Melilite7%
```

### Web URLs
- **Main**: https://app.nexorasim.com
- **WWW**: https://www.app.nexorasim.com

## 2. WordPress Plugin Deployment

### Upload Plugin
```bash
# Upload wordpress-plugin/ to:
# public_html/wp-content/plugins/nexorasim/
```

### Activate Plugin
1. Login: https://app.nexorasim.com/wp-admin
2. Username: nexorasim@gmail.com
3. Password: Melilite7%
4. Go to Plugins → Activate "NexoraSIM eSIM Management"

## 3. Database Setup

### Create Database
- Host: localhost
- Database: u755220709_nexorasim
- Username: u755220709_nexorasim
- Password: Melilite7%

## 4. Mobile App Builds

### iOS/Android
```bash
eas build --platform all
eas submit --platform all
```

## 5. API Testing

### Test Endpoints
```bash
curl https://app.nexorasim.com/wp-json/nexorasim/v1/esim/plans
```

## 6. Go Live Checklist

- [ ] Web app uploaded
- [ ] WordPress plugin activated
- [ ] Database configured
- [ ] API endpoints working
- [ ] Mobile apps submitted
- [ ] Payment gateways configured

## Status: READY FOR IMMEDIATE DEPLOYMENT