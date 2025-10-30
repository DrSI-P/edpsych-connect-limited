# Fix Critical TypeScript Errors
# This script addresses the most common TypeScript errors in the codebase

Write-Host "Fixing critical TypeScript errors..." -ForegroundColor Cyan

# 1. Fix jest.setup.ts - NODE_ENV is read-only
$jestSetupPath = "src/components/error-handling/__tests__/jest.setup.ts"
if (Test-Path $jestSetupPath) {
    Write-Host "Fixing NODE_ENV assignment in $jestSetupPath..." -ForegroundColor Yellow
    $content = Get-Content $jestSetupPath -Raw
    $content = $content -replace "process\.env\.NODE_ENV = process\.env\.NODE_ENV \|\| 'test';", "if (!process.env.NODE_ENV) { Object.defineProperty(process.env, 'NODE_ENV', { value: 'test', writable: false }); }"
    Set-Content $jestSetupPath $content -NoNewline
}

# 2. Fix double-blind test - replace all 'id:' with 'userId:'
$doubleBlindTestPath = "src/research/foundation/double-blind/services/double-blind-service.test.ts"
if (Test-Path $doubleBlindTestPath) {
    Write-Host "Fixing userId properties in $doubleBlindTestPath..." -ForegroundColor Yellow
    $content = Get-Content $doubleBlindTestPath -Raw
    
    # Fix role objects - replace "id: 'role-X',\n        id," with "id: 'role-X',\n        userId,"
    $content = $content -replace "(\s+id:\s+'role-\d+',\r?\n\s+)id,", '$1userId,'
    
    # Fix audit log objects - replace "id," with "performedBy,"
    $content = $content -replace "(\s+action:\s+'[^']+',\r?\n\s+)id,", '$1performedBy,'
    
    Set-Content $doubleBlindTestPath $content -NoNewline
}

# 3. Fix institutional management services - remove duplicate 'id' declarations
$institutionServicePath = "src/services/institutional-management/institution-service.ts"
if (Test-Path $institutionServicePath) {
    Write-Host "Fixing institution-service.ts..." -ForegroundColor Yellow
    # This file has many errors - marking it for manual review
    Write-Host "  ⚠️  institution-service.ts requires manual review" -ForegroundColor Red
}

# 4. Fix subscription service - SubscriptionPlan enum vs type issue
$subscriptionServicePath = "src/services/institutional-management/subscription-service.ts"
if (Test-Path $subscriptionServicePath) {
    Write-Host "Fixing subscription-service.ts..." -ForegroundColor Yellow
    # This file has enum/type confusion - marking it for manual review
    Write-Host "  ⚠️  subscription-service.ts requires manual review" -ForegroundColor Red
}

Write-Host "`nCritical fixes applied. Running TypeScript check..." -ForegroundColor Cyan
npx tsc --noEmit 2>&1 | Select-String "error TS" | Measure-Object -Line | Select-Object -ExpandProperty Lines | ForEach-Object {
    Write-Host "Remaining errors: $_" -ForegroundColor $(if ($_ -lt 300) { "Yellow" } else { "Red" })
}

Write-Host "`nDone!" -ForegroundColor Green