# Firebase deployment script for LUXBYTE (PowerShell)

Write-Host "🚀 Starting Firebase deployment..." -ForegroundColor Green

# Check if Firebase CLI is installed
try {
    $firebaseVersion = npx firebase --version
    Write-Host "✅ Firebase CLI found: $firebaseVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Firebase CLI not found. Installing..." -ForegroundColor Yellow
    npm install -g firebase-tools
}

# Set project
Write-Host "📁 Setting Firebase project..." -ForegroundColor Blue
npx firebase use studio-1f95z

# Deploy Firestore rules
Write-Host "📊 Deploying Firestore rules..." -ForegroundColor Blue
npx firebase deploy --only firestore:rules

# Deploy Storage rules
Write-Host "💾 Deploying Storage rules..." -ForegroundColor Blue
npx firebase deploy --only storage

# Deploy hosting (if needed)
Write-Host "🌐 Deploying hosting..." -ForegroundColor Blue
npx firebase deploy --only hosting

Write-Host "✅ Firebase deployment complete!" -ForegroundColor Green
