#!/bin/bash

echo "NexoraSIM Deployment Script"
echo "============================"

# Build mobile apps
echo "Building mobile apps..."
eas build --platform all --non-interactive

# Build web app
echo "Building web app..."
npm run build:web

# Deploy to Firebase
echo "Deploying to Firebase..."
firebase deploy --only hosting

echo "Deployment complete!"