param(
    [string]$Path = ".",
    [switch]$Force
)

$ErrorActionPreference = "Stop"
$Full = (Resolve-Path -LiteralPath $Path).Path

if (-not $Force) {
    Write-Host "This will grant FULL control to the current user on:`n$Full`nContinue? (y/N)" -ForegroundColor Yellow
    $c = Read-Host
    if ($c -ne 'y') { Write-Host "Aborted."; exit 1 }
}

# 1) إزالة الـ Read-Only و Unblock (بدون المساس بـ .git)
Get-ChildItem -LiteralPath $Full -Recurse -Force -File |
Where-Object { $_.FullName -notmatch '\\\.git\\' } |
ForEach-Object {
    try { Unblock-File -Path $_.FullName -ErrorAction SilentlyContinue } catch {}
    try { attrib -r $_.FullName } catch {}
}

# 2) منح تحكم كامل للمستخدم الحالي (وراثة للمجلدات والملفات)
icacls $Full /grant "$env:USERNAME:(OI)(CI)F" /T | Out-Null

# 3) إعدادات Git (safe.directory + longpaths + filemode)
if (Test-Path -LiteralPath (Join-Path $Full ".git")) {
    git config --global --add safe.directory "$Full" 2>$null
    Push-Location $Full
    git config core.filemode false 2>$null
    Pop-Location
}

# (اختياري) دعم المسارات الطويلة على ويندوز
try { git config --global core.longpaths true 2>$null } catch {}

Write-Host "✅ Cursor now has full write access to: $Full" -ForegroundColor Green
Write-Host "Tip: To undo ACL changes later:  icacls `"$Full`" /reset /T" -ForegroundColor DarkGray
