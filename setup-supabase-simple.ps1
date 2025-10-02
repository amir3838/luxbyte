Write-Host "Setting up Supabase..." -ForegroundColor Green

if (Test-Path "supabase-schema.sql") {
    Write-Host "SQL schema file found" -ForegroundColor Green
    Write-Host ""
    Write-Host "Supabase Setup Instructions:" -ForegroundColor Yellow
    Write-Host "1. Go to https://supabase.com" -ForegroundColor White
    Write-Host "2. Create a new project" -ForegroundColor White
    Write-Host "3. Get Project URL and Anon Key" -ForegroundColor White
    Write-Host "4. Go to SQL Editor" -ForegroundColor White
    Write-Host "5. Copy and run supabase-schema.sql" -ForegroundColor White
    Write-Host ""

    # Show first 500 characters of SQL
    $sqlContent = Get-Content "supabase-schema.sql" -Raw
    Write-Host "SQL Schema Preview:" -ForegroundColor Cyan
    Write-Host $sqlContent.Substring(0, [Math]::Min(500, $sqlContent.Length)) -ForegroundColor White
    if ($sqlContent.Length -gt 500) {
        Write-Host "... (truncated for display)" -ForegroundColor Gray
    }
    Write-Host ""
} else {
    Write-Host "SQL schema file not found" -ForegroundColor Red
}

# Create .env.example
Write-Host "Creating .env.example..." -ForegroundColor Yellow
$envContent = @"
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
VERCEL_URL=https://luxbyte.vercel.app
"@

Set-Content -Path ".env.example" -Value $envContent
Write-Host ".env.example created" -ForegroundColor Green

Write-Host "Supabase setup instructions ready!" -ForegroundColor Green
Write-Host "Next: Copy .env.example to .env and add your Supabase credentials" -ForegroundColor Cyan
