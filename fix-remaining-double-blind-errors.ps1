# Fix remaining double-blind test errors
$file = "src/research/foundation/double-blind/services/double-blind-service.test.ts"

$content = Get-Content $file -Raw

# Fix line 584: role.id should be role.userId
$content = $content -replace 'expect\(role\.id\)\.toBe\(role1Id\)', 'expect(role.userId).toBe(role1Id)'

# Fix line 631: add userId property
$content = $content -replace '(\s+await blindingService\.addRole\(\s+study\.id,\s+\{\s+)id: role2Id,(\s+role: ''data_analyst'')', '$1userId: role2Id,$2'

# Fix lines 652-654 and 716-718: add userId property and remove duplicate id
$content = $content -replace '(\s+const role1: BlindedRole = \{\s+)id: role1Id,\s+studyId: study\.id,(\s+role: ''researcher'')', '$1id: role1Id,$2userId: role1Id,$2'
$content = $content -replace '(\s+id: study\.id,)\s+id: role1Id,', '$1'

Write-Host "Fixing double-blind test errors..."
Set-Content $file $content -NoNewline

Write-Host "Running TypeScript check..."
npm exec tsc --noEmit 2>&1 | Select-String "error TS" | Measure-Object | ForEach-Object { Write-Host "Remaining TypeScript errors: $($_.Count)" }
Write-Host "Done!"