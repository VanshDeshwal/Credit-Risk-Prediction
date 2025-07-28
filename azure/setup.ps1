# Azure deployment script for Credit Risk Prediction (PowerShell)
# This script sets up cost-effective Azure resources

# Variables
$RESOURCE_GROUP = "rg-credit-risk-india"
$LOCATION = "Central India"  # Changed to India region
$ACR_NAME = "crcreditriskindia"
$CONTAINER_APP_ENV = "env-credit-risk-india"
$API_APP_NAME = "credit-risk-api"

Write-Host "Creating resource group..." -ForegroundColor Green
az group create --name $RESOURCE_GROUP --location $LOCATION

Write-Host "Creating Azure Container Registry..." -ForegroundColor Green
az acr create --resource-group $RESOURCE_GROUP --name $ACR_NAME --sku Basic

Write-Host "Creating Container App environment..." -ForegroundColor Green
az containerapp env create `
  --name $CONTAINER_APP_ENV `
  --resource-group $RESOURCE_GROUP `
  --location $LOCATION

Write-Host "Creating API Container App..." -ForegroundColor Green
az containerapp create `
  --name $API_APP_NAME `
  --resource-group $RESOURCE_GROUP `
  --environment $CONTAINER_APP_ENV `
  --image mcr.microsoft.com/azuredocs/containerapps-helloworld:latest `
  --target-port 8000 `
  --ingress 'external' `
  --query properties.configuration.ingress.fqdn `
  --min-replicas 0 `
  --max-replicas 2 `
  --cpu 0.25 `
  --memory 0.5Gi

Write-Host "Setup complete!" -ForegroundColor Green
Write-Host "API URL: https://$API_APP_NAME.azurecontainerapps.io" -ForegroundColor Yellow
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Set up GitHub secrets for Azure deployment" -ForegroundColor White
Write-Host "2. Push code to trigger automated deployment" -ForegroundColor White
