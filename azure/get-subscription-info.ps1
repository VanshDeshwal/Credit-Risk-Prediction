# Helper script to get Azure subscription info
Write-Host "Getting Azure subscription information..." -ForegroundColor Green

# Check if logged in to Azure
$account = az account show 2>$null | ConvertFrom-Json
if (-not $account) {
    Write-Host "Please log in to Azure first:" -ForegroundColor Red
    Write-Host "az login" -ForegroundColor Yellow
    exit 1
}

Write-Host "Current Azure Account:" -ForegroundColor Cyan
Write-Host "Subscription ID: $($account.id)" -ForegroundColor Yellow
Write-Host "Subscription Name: $($account.name)" -ForegroundColor Yellow
Write-Host "Tenant ID: $($account.tenantId)" -ForegroundColor Yellow

Write-Host "`nTo create the service principal for GitHub Actions, run:" -ForegroundColor Green
Write-Host "az ad sp create-for-rbac --name `"credit-risk-github-actions`" --role contributor --scopes /subscriptions/$($account.id)/resourceGroups/rg-credit-risk --sdk-auth" -ForegroundColor White
