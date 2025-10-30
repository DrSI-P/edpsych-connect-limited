# Fix undefined 'id' variables in institutional management services
# All locations where 'id' is undefined need to use proper parameter names

$files = @(
    "src/services/institutional-management/institution-service.ts",
    "src/services/institutional-management/subscription-service.ts",
    "src/services/institutional-management/permission-service.ts",
    "src/services/institutional-management/professional-development-service.ts"
)

foreach ($file in $files) {
    if (Test-Path $file) {
        $content = Get-Content $file -Raw
        
        # Pattern 1: where: { id } -> where: { id: institutionId }
        $content = $content -replace '(?m)^(\s+)where:\s*\{\s*id\s*\}', '$1where: { id: institutionId }'
        
        # Pattern 2: filter.institutionId ? { institutionId } -> filter.institutionId ? { id: filter.institutionId }
        $content = $content -replace 'filter\.institutionId\s*\?\s*\{\s*id\s*\}', 'filter.institutionId ? { id: filter.institutionId }'
        
        # Pattern 3: if (id) checks -> if (institutionId) or if (userId)
        $content = $content -replace '(?m)if\s*\(\s*!?id\s*\)', 'if (!institutionId)'
        
        # Pattern 4: throw new Error(`...${id}...`) -> throw new Error(`...${institutionId}...`)
        $content = $content -replace 'throw new Error\(`([^`]*)\$\{id\}', 'throw new Error(`$1${institutionId}'
        
        # Pattern 5: institutionId || id -> just institutionId (remove fallback)
        $content = $content -replace 'institutionId\s*\|\|\s*id', 'institutionId'
        
        # Pattern 6: const id = ... in object shorthand -> use full property syntax
        $content = $content -replace '(?m)^\s*const\s+id\s*=\s*([^;]+);?\r?\n\s+where:\s*\{\s*id\s*\}', "where: { id: `$1 }"
        
        Set-Content $file $content -NoNewline
        Write-Host "Fixed $file"
    }
}

Write-Host "Pattern fixes complete. Review and test the changes."