# Local testing script for the Credit Risk Prediction application

Write-Host "Starting local testing environment..." -ForegroundColor Green

# Function to check if Docker is running
function Test-DockerRunning {
    try {
        docker version | Out-Null
        return $true
    }
    catch {
        return $false
    }
}

# Check if Docker is available
if (-not (Test-DockerRunning)) {
    Write-Host "Docker is not running or not installed. Please install and start Docker Desktop." -ForegroundColor Red
    exit 1
}

Write-Host "Building API Docker image..." -ForegroundColor Yellow
docker build -f Dockerfile.api -t credit-risk-api .

Write-Host "Building Frontend Docker image..." -ForegroundColor Yellow
docker build -f Dockerfile.frontend -t credit-risk-frontend .

Write-Host "Starting API container..." -ForegroundColor Yellow
docker run -d -p 8000:8000 --name credit-risk-api-test credit-risk-api | Out-Null

Write-Host "Waiting for API to start..." -ForegroundColor Yellow
Start-Sleep -Seconds 10

Write-Host "Starting Frontend container..." -ForegroundColor Yellow
docker run -d -p 8501:8501 -e API_URL=http://localhost:8000 --name credit-risk-frontend-test credit-risk-frontend | Out-Null

Write-Host "Applications are starting up..." -ForegroundColor Green
Write-Host "API URL: http://localhost:8000" -ForegroundColor Cyan
Write-Host "Frontend URL: http://localhost:8501" -ForegroundColor Cyan
Write-Host ""
Write-Host "To stop the containers, run:" -ForegroundColor Yellow
Write-Host "docker stop credit-risk-api-test credit-risk-frontend-test" -ForegroundColor White
Write-Host "docker rm credit-risk-api-test credit-risk-frontend-test" -ForegroundColor White
