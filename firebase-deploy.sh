#!/bin/bash
# Firebase deployment script for LUXBYTE

echo "🚀 Starting Firebase deployment..."

# Check if Firebase CLI is installed
if ! command -v firebase &> /dev/null; then
    echo "❌ Firebase CLI not found. Installing..."
    npm install -g firebase-tools
fi

# Login to Firebase (interactive)
echo "🔐 Please login to Firebase..."
firebase login

# Set project
echo "📁 Setting Firebase project..."
firebase use studio-1f95z

# Deploy Firestore rules
echo "📊 Deploying Firestore rules..."
firebase deploy --only firestore:rules

# Deploy Storage rules
echo "💾 Deploying Storage rules..."
firebase deploy --only storage

# Deploy hosting (if needed)
echo "🌐 Deploying hosting..."
firebase deploy --only hosting

echo "✅ Firebase deployment complete!"
