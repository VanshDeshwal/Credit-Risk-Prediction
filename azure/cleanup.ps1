# Cleanup script to remove Azure resources

Write-Host "This will delete all Azure resources for the Credit Risk Prediction project." -ForegroundColor Red
Write-Host "This action cannot be undone!" -ForegroundColor Red
Write-Host ""

$confirmation = Read-Host "Are you sure you want to continue? Type 'DELETE' to confirm"

if ($confirmation -eq "DELETE") {
    Write-Host "Deleting Azure resources..." -ForegroundColor Yellow
    az group delete --name rg-credit-risk-india --yes --no-wait
    Write-Host "Deletion initiated. Resources will be removed in the background." -ForegroundColor Green
    Write-Host "You can check the status in the Azure portal." -ForegroundColor Yellow
} else {
    Write-Host "Cleanup cancelled." -ForegroundColor Green
}
