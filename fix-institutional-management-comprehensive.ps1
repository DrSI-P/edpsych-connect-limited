# Comprehensive fix for institutional management service TypeScript errors
# This script fixes all undefined 'id' variables by using the correct parameter names

Write-Host "Starting comprehensive institutional management fixes..."

# Fix institution-service.ts
$institutionFile = "src/services/institutional-management/institution-service.ts"
if (Test-Path $institutionFile) {
    $content = Get-Content $institutionFile -Raw
    
    # Line 73: Method signature has both 'data' and 'id' parameters, but line 78 redefines 'id'
    # Line 87: Should use 'userId' parameter instead of 'id'
    $content = $content -replace 'async createInstitution\(data: CreateInstitutionInput, id: string\)', 'async createInstitution(data: CreateInstitutionInput, userId: string)'
    $content = $content -replace '(\s+)createdBy: id,', '$1createdBy: userId,'
    $content = $content -replace '(\s+)performedById: id,', '$1performedById: userId,'
    
    # Lines 113-142: getInstitutionById should use institutionId parameter
    $content = $content -replace 'async getInstitutionById\(userId: string, institutionId: string\)', 'async getInstitutionById(institutionId: string, userId: string)'
    $content = $content -replace 'where: \{ id \},(\s+)include:', 'where: { id: institutionId },$1include:'
    $content = $content -replace 'Institution with ID \$\{id\} not found', 'Institution with ID ${institutionId} not found'
    $content = $content -replace 'await this\.verifyInstitutionAccess\(institution\.id, id\)', 'await this.verifyInstitutionAccess(userId, institutionId)'
    $content = $content -replace "logger\.error\('Error fetching institution', \{ error, id \}\)", "logger.error('Error fetching institution', { error, institutionId })"
    
    # Lines 148-227: getInstitutions should use userId parameter
    $content = $content -replace 'async getInstitutions\(options: InstitutionQueryOptions, id: string\)', 'async getInstitutions(options: InstitutionQueryOptions, userId: string)'
    $content = $content -replace 'await this\.verifyInstitutionListAccess\(id\)', 'await this.verifyInstitutionListAccess(userId)'
    
    # Lines 232-268: updateInstitution has wrong 'id' usage
    $content = $content -replace 'const institution = await prisma\.institution\.findUnique\(\{ where: \{ id \} \}\);', 'const institution = await prisma.institution.findUnique({ where: { id: institutionId } });'
    $content = $content -replace '(\s+)where: \{ id \},(\s+)data: \{', '$1where: { id: institutionId },$2data: {'
    $content = $content -replace 'entityId: id,(\s+)description: `Institution', 'entityId: institutionId,$1description: `Institution'
    $content = $content -replace 'performedById: id,(\s+)id: id,', 'performedById: userId,$1institutionId: institutionId,'
    $content = $content -replace "logger\.error\('Error updating institution', \{ error, id, data \}\)", "logger.error('Error updating institution', { error, institutionId, data })"
    
    # Lines 274-312: verifyInstitution method
    $content = $content -replace 'async verifyInstitution\(userId: string, status: VerificationStatus, institutionId: string', 'async verifyInstitution(institutionId: string, userId: string, status: VerificationStatus'
    $content = $content -replace 'await this\.verifyAdminAccess\(id\)', 'await this.verifyAdminAccess(userId)'
    
    # Lines 318-355: deactivateInstitution method
    $content = $content -replace 'async deactivateInstitution\(userId: string, institutionId: string', 'async deactivateInstitution(institutionId: string, userId: string'
    
    # Lines 361-398: reactivateInstitution method  
    $content = $content -replace 'async reactivateInstitution\(userId: string, institutionId: string', 'async reactivateInstitution(institutionId: string, userId: string'
    
    # Lines 404-455: getInstitutionStatistics
    $content = $content -replace 'async getInstitutionStatistics\(id: string\)', 'async getInstitutionStatistics(userId: string)'
    
    # Lines 461-496: addInstitutionAdmin
    $content = $content -replace 'async addInstitutionAdmin\(userId: string, institutionId: string, adminId: string\)', 'async addInstitutionAdmin(institutionId: string, userId: string, adminId: string)'
    $content = $content -replace 'if \(\!institution\) \{(\s+)throw new NotFoundError\(`Institution with ID \$\{id\}', 'if (!institution) {$1throw new NotFoundError(`Institution with ID ${institutionId}'
    $content = $content -replace 'entityId: id,(\s+)description: `User added', 'entityId: institutionId,$1description: `User added'
    $content = $content -replace 'performedById: id,(\s+)id,', 'performedById: userId,$1institutionId: institutionId,'
    $content = $content -replace "logger\.error\('Error adding institution admin', \{ error, id, adminId \}\)", "logger.error('Error adding institution admin', { error, institutionId, adminId })"
    
    # Lines 502-547: removeInstitutionAdmin
    $content = $content -replace 'async removeInstitutionAdmin\(userId: string, institutionId: string, adminId: string\)', 'async removeInstitutionAdmin(institutionId: string, userId: string, adminId: string)'
    $content = $content -replace "logger\.error\('Error removing institution admin', \{ error, id, adminId \}\)", "logger.error('Error removing institution admin', { error, institutionId, adminId })"
    
    # Lines 597-598, 611-612: Duplicate 'id' in logAuditEvent
    $content = $content -replace 'performedById: string;(\s+)id\?: string;(\s+)id\?: string;', 'performedById: string;$1institutionId?: string;$2subscriptionId?: string;'
    $content = $content -replace 'performedById: data\.performedById,(\s+)id: data\.id,(\s+)id: data\.id,', 'performedById: data.performedById,$1institutionId: data.institutionId,$2subscriptionId: data.subscriptionId,'
    
    # Lines 627-646: verifyInstitutionAccess
    $content = $content -replace 'const isAdmin = await this\.isSystemAdmin\(id\)', 'const isAdmin = await this.isSystemAdmin(userId)'
    $content = $content -replace 'where: \{(\s+)id: id,', 'where: {$1id: userId,'
    $content = $content -replace '\{ adminInstitutions: \{ some: \{ id: id \} \} \},', '{ adminInstitutions: { some: { id: institutionId } } },'
    $content = $content -replace '\{ departments: \{ some: \{ id \} \} \}', '{ departments: { some: { institutionId: institutionId } } }'
    
    # Lines 652-662: verifyInstitutionListAccess
    $content = $content -replace 'private async verifyInstitutionListAccess\(id: string\)', 'private async verifyInstitutionListAccess(userId: string)'
    $content = $content -replace 'const isAdmin = await this\.isSystemAdmin\(id\);', 'const isAdmin = await this.isSystemAdmin(userId);'
    $content = $content -replace 'const user = await prisma\.user\.findUnique\(\{ where: \{ id: institutionId \} \}\);', 'const user = await prisma.user.findUnique({ where: { id: userId } });'
    
    # Lines 668-683: verifyInstitutionAdminAccess
    $content = $content -replace 'const isAdmin = await this\.isSystemAdmin\(id\);(\s+)if \(isAdmin\) return;(\s+)(\s+)// Check if user is an admin of the institution(\s+)const isInstitutionAdmin = await prisma\.institution\.findFirst\(\{(\s+)where: \{(\s+)id: id,(\s+)admins: \{ some: \{ id: id \} \}', 'const isAdmin = await this.isSystemAdmin(userId);$1if (isAdmin) return;$2$3// Check if user is an admin of the institution$4const isInstitutionAdmin = await prisma.institution.findFirst({$5where: {$6id: institutionId,$7admins: { some: { id: userId } }'
    
    # Lines 697-702: verifyAdminAccess
    $content = $content -replace 'private async verifyAdminAccess\(id: string\)', 'private async verifyAdminAccess(userId: string)'
    $content = $content -replace 'const isAdmin = await this\.isSystemAdmin\(id\);(\s+)(\s+)if', 'const isAdmin = await this.isSystemAdmin(userId);$1$2if'
    
    # Lines 708-715: isSystemAdmin
    $content = $content -replace 'private async isSystemAdmin\(id: string\)', 'private async isSystemAdmin(userId: string)'
    $content = $content -replace 'where: \{ id: institutionId \},', 'where: { id: userId },'
    $content = $content -replace 'select: \{ role: true \}', 'select: { roles: true }'
    $content = $content -replace 'return user\?\.role === UserRole\.ADMIN;', 'return user?.roles.includes(UserRole.ADMIN);'
    
    Set-Content $institutionFile $content -NoNewline
    Write-Host "Fixed institution-service.ts"
}

Write-Host "Institutional management fixes complete!"