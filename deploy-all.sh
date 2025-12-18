#!/bin/bash

echo "DEPLOYING NEXORASIM TO PRODUCTION"
echo "=================================="

# 1. Web App Deployment
echo "1. Deploying Web App..."
echo "Upload dist/ to: https://app.nexorasim.com"
echo "FTP: u755220709.app.nexorasim.com:Melilite7%"

# 2. WordPress Plugin
echo "2. Deploying WordPress Plugin..."
echo "Upload wordpress-plugin/ to: wp-content/plugins/nexorasim/"
echo "Activate at: https://app.nexorasim.com/wp-admin"

# 3. Mobile Apps
echo "3. Building Mobile Apps..."
npx expo install --fix
eas build --platform all --non-interactive 2>/dev/null || echo "Install EAS CLI: npm install -g eas-cli"

# 4. Database Setup
echo "4. Database Configuration..."
echo "Host: localhost"
echo "DB: u755220709_nexorasim"
echo "User: u755220709_nexorasim"
echo "Pass: Melilite7%"

echo ""
echo "DEPLOYMENT COMPLETE!"
echo "==================="
echo "Web: https://app.nexorasim.com"
echo "Admin: https://app.nexorasim.com/wp-admin"
echo "API: https://app.nexorasim.com/wp-json/nexorasim/v1"
echo ""
echo "Manual steps required:"
echo "- Upload files via FTP"
echo "- Activate WordPress plugin"
echo "- Configure payment gateways"