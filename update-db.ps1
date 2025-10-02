# Update Supabase Database
$REF = "qjsvgpvbtrcnbhcjdcci"
$DBHOST = "db.$REF.supabase.co"
$USER = "postgres"
$PASS = "A01065452921%A"
$DB = "postgres"

# Encode password for URL
$ENC = [System.Uri]::EscapeDataString($PASS)

# Build correct connection URL
$URL = "postgresql://$USER`:$ENC@$DBHOST`:5432/$DB`?sslmode=require"

Write-Host "Database URL: $URL" -ForegroundColor Green

# Execute database reset
Write-Host "Resetting database..." -ForegroundColor Yellow
npx supabase db reset --db-url $URL
$REF = "qjsvgpvbtrcnbhcjdcci"
$DBHOST = "db.$REF.supabase.co"
$USER = "postgres"
$PASS = "A01065452921%A"
$DB = "postgres"

# Encode password for URL
$ENC = [System.Uri]::EscapeDataString($PASS)

# Build correct connection URL
$URL = "postgresql://$USER`:$ENC@$DBHOST`:5432/$DB`?sslmode=require"

Write-Host "Database URL: $URL" -ForegroundColor Green

# Execute database reset
Write-Host "Resetting database..." -ForegroundColor Yellow
npx supabase db reset --db-url $URL
