Write-Host "Starting Luxbyte Deployment..." -ForegroundColor Green

# Check Git
if (Get-Command git -ErrorAction SilentlyContinue) {
    Write-Host "Git: OK" -ForegroundColor Green
} else {
    Write-Host "Git: Missing" -ForegroundColor Red
    exit 1
}

# Setup Git
if (Test-Path ".git") {
    Write-Host "Git repository exists" -ForegroundColor Green
} else {
    git init
    git config user.name "Luxbyte Team"
    git config user.email "dev@luxbyte.com"
    Write-Host "Git initialized" -ForegroundColor Green
}

# Add files
git add .
git commit -m "Initial commit: Luxbyte Platform"

Write-Host "Git setup complete" -ForegroundColor Green

# Test files
Write-Host "Testing files..." -ForegroundColor Yellow
if (Test-Path "public/index.html") {
    Write-Host "Main page: OK" -ForegroundColor Green
} else {
    Write-Host "Main page: Missing" -ForegroundColor Red
}

if (Test-Path "public/dashboard/pharmacy.html") {
    Write-Host "Pharmacy dashboard: OK" -ForegroundColor Green
} else {
    Write-Host "Pharmacy dashboard: Missing" -ForegroundColor Red
}

# Create .env.example
$envContent = "SUPABASE_URL=https://your-project.supabase.co`nSUPABASE_ANON_KEY=your-anon-key"
Set-Content -Path ".env.example" -Value $envContent
Write-Host ".env.example created" -ForegroundColor Green

# Create report
$reportContent = "Luxbyte Deployment Report`nDate: $(Get-Date)`nStatus: Ready`nFiles: $((Get-ChildItem -Recurse -File).Count)"
Set-Content -Path "deployment-report.md" -Value $reportContent
Write-Host "Report created" -ForegroundColor Green

Write-Host "Deployment setup complete!" -ForegroundColor Green
Write-Host "Next: Setup Supabase, Vercel, and GitHub" -ForegroundColor Cyan
