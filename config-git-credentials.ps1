# Script PowerShell pour configurer Git avec le Personal Access Token

Write-Host "=== Configuration Git avec Personal Access Token ===" -ForegroundColor Cyan
Write-Host ""

# Vérifier si Git est installé
try {
    $gitVersion = git --version
    Write-Host "✅ Git détecté: $gitVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Git n'est pas installé ou pas dans le PATH" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "📝 Instructions:" -ForegroundColor Yellow
Write-Host "1. Créez un Personal Access Token sur GitHub:" -ForegroundColor White
Write-Host "   https://github.com/settings/tokens" -ForegroundColor Cyan
Write-Host "2. Cochez la permission 'repo' (tout)" -ForegroundColor White
Write-Host "3. Copiez le token (il ressemble à: ghp_xxxxxxxxxxxx...)" -ForegroundColor White
Write-Host ""

# Configurer Git Credential Helper pour Windows
Write-Host "🔧 Configuration du credential helper..." -ForegroundColor Yellow
git config --global credential.helper manager-core

Write-Host "✅ Configuration terminée!" -ForegroundColor Green
Write-Host ""
Write-Host "💡 Maintenant, faites simplement:" -ForegroundColor Cyan
Write-Host "   git push origin main" -ForegroundColor White
Write-Host ""
Write-Host "   Quand Git vous demandera les identifiants:" -ForegroundColor Yellow
Write-Host "   - Username: borelkamsu" -ForegroundColor White
Write-Host "   - Password: [collez votre token GitHub]" -ForegroundColor White
Write-Host ""
Write-Host "   Windows sauvegardera automatiquement les identifiants!" -ForegroundColor Green


