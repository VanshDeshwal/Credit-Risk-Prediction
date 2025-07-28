# Azure Deployment Guide - Credit Risk Prediction API

This guide will help you deploy your Credit Risk Prediction API to Azure using a cost-effective architecture with automatic deployment from GitHub.

## Architecture Overview

- **API**: Azure Container Apps (FastAPI backend)
- **Registry**: Azure Container Registry
- **CI/CD**: GitHub Actions
- **Cost**: Minimal with scale-to-zero capability

## Prerequisites

1. Azure CLI installed and logged in
2. Azure subscription
3. GitHub repository with the code

## Step 1: Set Up Azure Resources

Run the setup script to create Azure resources:

### Windows (PowerShell):
```powershell
cd azure
.\setup.ps1
```

### Linux/Mac (Bash):
```bash
cd azure
chmod +x setup.sh
./setup.sh
```

## Step 2: Configure GitHub Secrets

1. Create a service principal for GitHub Actions:
```bash
az ad sp create-for-rbac --name "credit-risk-github-actions" --role contributor --scopes /subscriptions/{subscription-id}/resourceGroups/rg-credit-risk --sdk-auth
```

2. Copy the JSON output and add it as a secret named `AZURE_CREDENTIALS` in your GitHub repository:
   - Go to your GitHub repository
   - Navigate to Settings > Secrets and variables > Actions
   - Click "New repository secret"
   - Name: `AZURE_CREDENTIALS`
   - Value: Paste the JSON from step 1

## Step 3: Update Configuration

1. If you need to change resource names, update them in:
   - `.github/workflows/deploy-api.yml`
   - `azure/setup.ps1` or `azure/setup.sh`

## Step 4: Deploy

1. Push your code to the main branch:
```bash
git add .
git commit -m "Add Azure deployment configuration"
git push origin main
```

2. GitHub Actions will automatically build and deploy both applications.

## Step 5: Verify Deployment

1. Check the GitHub Actions workflow in the "Actions" tab of your repository
2. Once completed, visit your API:
   - API: https://credit-risk-api.azurecontainerapps.io

## Cost Optimization Features

- **Scale to Zero**: The API will scale down to 0 instances when not in use
- **Minimal Resources**: 0.25 CPU and 0.5Gi memory allocated
- **Basic Tier ACR**: Lowest cost container registry option
- **Pay-per-use**: Only pay when the API is running

## Automatic Updates

The deployment is configured to automatically update when you push changes to:
- API: Changes to `src/api/`, `model_artifacts/`, or `api_requirements.txt`

## Managing Multiple Applications

Since you mentioned having other applications on Azure:

1. **Resource Group Isolation**: This setup uses `rg-credit-risk` resource group to keep it separate
2. **Unique Naming**: All resources have `credit-risk` prefix to avoid conflicts
3. **Shared Environment**: You can optionally share the Container App Environment with other apps to reduce costs

## Monitoring and Troubleshooting

1. **View logs**:
```bash
az containerapp logs show --name credit-risk-api --resource-group rg-credit-risk --follow
```

2. **Check app status**:
```bash
az containerapp show --name credit-risk-api --resource-group rg-credit-risk --query properties.provisioningState
```

3. **Scale manually if needed**:
```bash
az containerapp update --name credit-risk-api --resource-group rg-credit-risk --min-replicas 1 --max-replicas 3
```

## Cleanup

To remove all resources:
```bash
az group delete --name rg-credit-risk --yes --no-wait
```

## Security Notes

- API is accessible over HTTPS only
- Container registry access is restricted to Azure resources
- GitHub Actions use service principal with minimal required permissions

## Estimated Monthly Costs

With scale-to-zero configuration and assuming moderate usage:
- Container Apps: $0-15/month (depending on usage)
- Container Registry: ~$5/month
- Total: ~$5-20/month for demonstration purposes
