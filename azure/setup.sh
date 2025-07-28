#!/bin/bash

# Azure deployment script for Credit Risk Prediction
# This script sets up cost-effective Azure resources

# Variables
RESOURCE_GROUP="rg-credit-risk-india"
LOCATION="Central India"  # Changed to India region
ACR_NAME="crcreditriskindia"
CONTAINER_APP_ENV="env-credit-risk-india"
API_APP_NAME="credit-risk-api"

echo "Creating resource group..."
az group create --name $RESOURCE_GROUP --location "$LOCATION"

echo "Creating Azure Container Registry..."
az acr create --resource-group $RESOURCE_GROUP --name $ACR_NAME --sku Basic

echo "Creating Container App environment..."
az containerapp env create \
  --name $CONTAINER_APP_ENV \
  --resource-group $RESOURCE_GROUP \
  --location "$LOCATION"

echo "Creating API Container App..."
az containerapp create \
  --name $API_APP_NAME \
  --resource-group $RESOURCE_GROUP \
  --environment $CONTAINER_APP_ENV \
  --image mcr.microsoft.com/azuredocs/containerapps-helloworld:latest \
  --target-port 8000 \
  --ingress 'external' \
  --query properties.configuration.ingress.fqdn \
  --min-replicas 0 \
  --max-replicas 2 \
  --cpu 0.25 \
  --memory 0.5Gi

echo "Setup complete!"
echo "API URL: https://$API_APP_NAME.azurecontainerapps.io"
echo ""
echo "Next steps:"
echo "1. Set up GitHub secrets for Azure deployment"
echo "2. Push code to trigger automated deployment"
