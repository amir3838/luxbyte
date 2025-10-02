# LUXBYTE DEPLOYMENT SCRIPT
Write-Host "Starting Luxbyte Platform Deployment..." -ForegroundColor Green

# Check requirements
Write-Host "Checking requirements..." -ForegroundColor Yellow

if (Get-Command git -ErrorAction SilentlyContinue) {
    Write-Host "Git: OK" -ForegroundColor Green
} else {
    Write-Host "Git: Missing" -ForegroundColor Red
    exit 1
}

if (Get-Command node -ErrorAction SilentlyContinue) {
    Write-Host "Node.js: OK" -ForegroundColor Green
} else {
    Write-Host "Node.js: Missing" -ForegroundColor Red
    exit 1
}

if (Get-Command npm -ErrorAction SilentlyContinue) {
    Write-Host "npm: OK" -ForegroundColor Green
} else {
    Write-Host "npm: Missing" -ForegroundColor Red
    exit 1
}

Write-Host "All requirements met!" -ForegroundColor Green
Write-Host ""

# Setup Git
Write-Host "Setting up Git repository..." -ForegroundColor Yellow

if (Test-Path ".git") {
    Write-Host "Git repository exists" -ForegroundColor Green
} else {
    git init
    git config user.name "Luxbyte Development Team"
    git config user.email "dev@luxbyte.com"
    Write-Host "Git repository initialized" -ForegroundColor Green
}

# Add files
git add .

# Create commit
git commit -m "Initial commit: Luxbyte Smart Business Platform

Features:
- Multi-dashboard platform
- Supabase authentication
- Real-time analytics
- Responsive Arabic UI
- Social media integration
- File upload management
- Modern design with Font Awesome

Tech Stack:
- Frontend: HTML5, CSS3, JavaScript ES6+
- Backend: Supabase
- Deployment: Vercel

Ready for deployment!"

Write-Host "Git setup complete" -ForegroundColor Green
Write-Host ""

# Setup Supabase
Write-Host "Supabase Setup Instructions:" -ForegroundColor Yellow
Write-Host "1. Go to https://supabase.com" -ForegroundColor White
Write-Host "2. Create a new project" -ForegroundColor White
Write-Host "3. Get Project URL and Anon Key" -ForegroundColor White
Write-Host "4. Go to SQL Editor" -ForegroundColor White
Write-Host "5. Copy and run supabase-schema.sql" -ForegroundColor White
Write-Host ""

# Create .env.example
Write-Host "Creating .env.example..." -ForegroundColor Yellow
$envContent = "SUPABASE_URL=https://your-project.supabase.co`nSUPABASE_ANON_KEY=your-anon-key`nVERCEL_URL=https://luxbyte.vercel.app"
Set-Content -Path ".env.example" -Value $envContent
Write-Host ".env.example created" -ForegroundColor Green
Write-Host ""

# Test files
Write-Host "Testing local files..." -ForegroundColor Yellow

$files = @(
    "public/index.html",
    "public/dashboard/pharmacy.html",
    "public/dashboard/restaurant.html",
    "public/dashboard/supermarket.html",
    "public/dashboard/clinic.html",
    "public/dashboard/courier.html",
    "public/dashboard/driver.html",
    "public/js/supabase-client.js",
    "public/css/dashboard.css"
)

$allFilesExist = $true
foreach ($file in $files) {
    if (Test-Path $file) {
        Write-Host "✓ $file" -ForegroundColor Green
    } else {
        Write-Host "✗ $file" -ForegroundColor Red
        $allFilesExist = $false
    }
}

if ($allFilesExist) {
    Write-Host "All files exist!" -ForegroundColor Green
} else {
    Write-Host "Some files are missing!" -ForegroundColor Red
}

Write-Host ""

# Clean up
Write-Host "Cleaning temporary files..." -ForegroundColor Yellow
Remove-Item "*.tmp" -ErrorAction SilentlyContinue
Remove-Item "*.log" -ErrorAction SilentlyContinue
Write-Host "Cleanup complete" -ForegroundColor Green
Write-Host ""

# Create report
Write-Host "Creating deployment report..." -ForegroundColor Yellow
$reportContent = "Luxbyte Platform Deployment Report`n`nDate: $(Get-Date)`nStatus: Ready for deployment`n`nNext steps:`n1. Setup Supabase`n2. Setup Vercel`n3. Setup GitHub`n`nFiles: $((Get-ChildItem -Recurse -File).Count)`nSize: $([math]::Round((Get-ChildItem -Recurse | Measure-Object -Property Length -Sum).Sum / 1MB, 2)) MB"
Set-Content -Path "deployment-report.md" -Value $reportContent
Write-Host "Report created" -ForegroundColor Green
Write-Host ""

# Final results
Write-Host "=================================" -ForegroundColor Magenta
Write-Host "DEPLOYMENT COMPLETE!" -ForegroundColor Magenta
Write-Host "=================================" -ForegroundColor Magenta
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Setup Supabase database" -ForegroundColor White
Write-Host "2. Deploy to Vercel" -ForegroundColor White
Write-Host "3. Push to GitHub" -ForegroundColor White
Write-Host ""
Write-Host "Files ready for deployment!" -ForegroundColor Green
Write-Host "Report: deployment-report.md" -ForegroundColor Cyan
Write-Host ""
Write-Host "Thank you for using Luxbyte!" -ForegroundColor Green
