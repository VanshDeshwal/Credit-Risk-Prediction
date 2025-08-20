// Configuration
// Dynamically select API base URL: if served locally (file:// or localhost), use local FastAPI, else use deployed URL.
const DEPLOYED_API_URL = 'https://credit-risk-api.azurecontainerapps.io';
const LOCAL_API_URL = 'http://127.0.0.1:8000';
let API_BASE_URL = DEPLOYED_API_URL;
let API_DOCS_URL = `${DEPLOYED_API_URL}/docs`;
try {
    const isLocalFrontEnd = ['localhost', '127.0.0.1'].includes(location.hostname) || location.protocol === 'file:';
    if (isLocalFrontEnd) {
        API_BASE_URL = LOCAL_API_URL;
        API_DOCS_URL = `${LOCAL_API_URL}/docs`;
    }
} catch (e) { /* ignore */ }
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

// DOM Elements
const uploadArea = document.getElementById('uploadArea');
const fileInput = document.getElementById('fileInput');
const fileInfo = document.getElementById('fileInfo');
const fileName = document.getElementById('fileName');
const fileSize = document.getElementById('fileSize');
const removeFile = document.getElementById('removeFile');
const predictBtn = document.getElementById('predictBtn');
const loading = document.getElementById('loading');
const resultsSection = document.getElementById('resultsSection');
const errorModal = document.getElementById('errorModal');
const closeModal = document.getElementById('closeModal');
const errorMessage = document.getElementById('errorMessage');
const resetBtn = document.getElementById('resetBtn');
const exportCSV = document.getElementById('exportCSV');
const exportJSON = document.getElementById('exportJSON');
const apiStatus = document.getElementById('apiStatus');

// Global variables
let currentFile = null;
let currentResults = null;
let riskChart = null;

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeEventListeners();
    checkApiHealth();
});

// Initialize event listeners
function initializeEventListeners() {
    // Upload area events
    uploadArea.addEventListener('click', () => fileInput.click());
    uploadArea.addEventListener('dragover', handleDragOver);
    uploadArea.addEventListener('dragleave', handleDragLeave);
    uploadArea.addEventListener('drop', handleDrop);

    // File input change
    fileInput.addEventListener('change', handleFileSelect);

    // Remove file
    removeFile.addEventListener('click', removeSelectedFile);

    // Predict button
    predictBtn.addEventListener('click', predictRisk);

    // Modal close
    closeModal.addEventListener('click', hideErrorModal);
    errorModal.addEventListener('click', (e) => {
        if (e.target === errorModal) hideErrorModal();
    });

    // Reset button
    resetBtn.addEventListener('click', resetApplication);

    // Export buttons
    exportCSV.addEventListener('click', () => exportResults('csv'));
    exportJSON.addEventListener('click', () => exportResults('json'));

    // Smooth scrolling for navigation
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
}

// Check API health
async function checkApiHealth() {
    if (!apiStatus) return;
    apiStatus.classList.remove('connected','disconnected','partial');
    apiStatus.classList.add('partial');
    apiStatus.textContent = 'Checking';
    apiStatus.href = '#';
    try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 4000);
        const response = await fetch(`${API_BASE_URL}/health`, { signal: controller.signal });
        clearTimeout(timeout);
        if (!response.ok) throw new Error('bad status');
        const health = await response.json();
        const ok = health?.status === 'OK' && health?.model_loaded;
        apiStatus.classList.remove('partial');
        apiStatus.classList.add(ok ? 'connected' : 'partial');
    apiStatus.textContent = ok ? 'Online' : 'Degraded';
        apiStatus.href = API_DOCS_URL;
        apiStatus.title = ok ? 'View API docs' : 'API reachable but may be degraded';
    } catch (err) {
        apiStatus.classList.remove('partial');
        apiStatus.classList.add('disconnected');
    apiStatus.textContent = 'Offline';
        // If frontend is remote and local API offline, keep docs link to deployed if any
        apiStatus.href = API_DOCS_URL;
        apiStatus.title = 'API not reachable';
        console.warn('API health check failed:', err);
    }
}

// periodic health refresh every 60s
setInterval(checkApiHealth, 60000);

// Drag and drop handlers
function handleDragOver(e) {
    e.preventDefault();
    uploadArea.classList.add('dragover');
}

function handleDragLeave(e) {
    e.preventDefault();
    uploadArea.classList.remove('dragover');
}

function handleDrop(e) {
    e.preventDefault();
    uploadArea.classList.remove('dragover');
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
        handleFileSelection(files[0]);
    }
}

// File selection handlers
function handleFileSelect(e) {
    const files = e.target.files;
    if (files.length > 0) {
        handleFileSelection(files[0]);
    }
}

function handleFileSelection(file) {
    // Validate file type
    if (!file.name.toLowerCase().endsWith('.xlsx')) {
        showError('Please select a valid Excel file (.xlsx)');
        return;
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
        showError('File size must be less than 10MB');
        return;
    }

    // Store the file and update UI
    currentFile = file;
    updateFileInfo(file);
    showFileInfo();
    enablePredictButton();
}

function updateFileInfo(file) {
    fileName.textContent = file.name;
    fileSize.textContent = formatFileSize(file.size);
}

function showFileInfo() {
    uploadArea.style.display = 'none';
    fileInfo.style.display = 'block';
}

function removeSelectedFile() {
    currentFile = null;
    fileInput.value = '';
    fileInfo.style.display = 'none';
    uploadArea.style.display = 'block';
    disablePredictButton();
}

function enablePredictButton() {
    predictBtn.disabled = false;
}

function disablePredictButton() {
    predictBtn.disabled = true;
}

// Format file size
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Predict risk
async function predictRisk() {
    if (!currentFile) {
        showError('Please select a file first');
        return;
    }

    showLoading();

    try {
        const formData = new FormData();
        formData.append('file', currentFile);

        const response = await fetch(`${API_BASE_URL}/predict`, {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        currentResults = result;
        
        hideLoading();
        displayResults(result);
        
    } catch (error) {
        hideLoading();
        console.error('Prediction error:', error);
        showError('Failed to process the file. Please check your internet connection and try again.');
    }
}

// Display results
function displayResults(result) {
    const { prediction, counts } = result;
    
    // Update summary cards
    updateSummaryCards(counts);
    
    // Create chart
    createRiskChart(counts);
    
    // Populate results table
    populateResultsTable(prediction);
    
    // Show results section
    resultsSection.style.display = 'block';
    resultsSection.scrollIntoView({ behavior: 'smooth' });
}

function updateSummaryCards(counts) {
    document.getElementById('p1Count').textContent = counts.P1 || 0;
    document.getElementById('p2Count').textContent = counts.P2 || 0;
    document.getElementById('p3Count').textContent = counts.P3 || 0;
    document.getElementById('p4Count').textContent = counts.P4 || 0;
}

function createRiskChart(counts) {
    const ctx = document.getElementById('riskChart').getContext('2d');
    
    // Destroy existing chart if it exists
    if (riskChart) {
        riskChart.destroy();
    }
    
    const data = [counts.P1 || 0, counts.P2 || 0, counts.P3 || 0, counts.P4 || 0];
    const labels = ['P1 - Low Risk', 'P2 - Medium Risk', 'P3 - High Risk', 'P4 - Very High Risk'];
    const colors = ['#22c55e', '#f59e0b', '#f97316', '#ef4444'];
    
    riskChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: colors,
                borderWidth: 2,
                borderColor: '#ffffff'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        padding: 20,
                        usePointStyle: true
                    }
                },
                title: {
                    display: true,
                    text: 'Risk Distribution',
                    font: {
                        size: 16,
                        weight: 'bold'
                    },
                    padding: 20
                }
            }
        }
    });
}

function populateResultsTable(predictions) {
    const tableBody = document.getElementById('tableBody');
    tableBody.innerHTML = '';
    
    predictions.forEach((prediction, index) => {
        const row = document.createElement('tr');
        
        const riskInfo = getRiskInfo(prediction);
        
        row.innerHTML = `
            <td>${index + 1}</td>
            <td><span class="risk-badge ${riskInfo.class}">${prediction}</span></td>
            <td>${riskInfo.level}</td>
            <td>${riskInfo.recommendation}</td>
        `;
        
        tableBody.appendChild(row);
    });
}

function getRiskInfo(prediction) {
    const riskMap = {
        'P1': {
            level: 'Low Risk',
            class: 'low',
            recommendation: 'Approve with standard terms'
        },
        'P2': {
            level: 'Medium Risk',
            class: 'medium',
            recommendation: 'Approve with monitoring'
        },
        'P3': {
            level: 'High Risk',
            class: 'high',
            recommendation: 'Approve with strict conditions'
        },
        'P4': {
            level: 'Very High Risk',
            class: 'very-high',
            recommendation: 'Reject or require collateral'
        }
    };
    
    return riskMap[prediction] || {
        level: 'Unknown',
        class: 'medium',
        recommendation: 'Manual review required'
    };
}

// Export functions
function exportResults(format) {
    if (!currentResults) {
        showError('No results to export');
        return;
    }
    
    const { prediction, counts } = currentResults;
    
    if (format === 'csv') {
        exportToCSV(prediction, counts);
    } else if (format === 'json') {
        exportToJSON(currentResults);
    }
}

function exportToCSV(predictions, counts) {
    let csvContent = 'Record Number,Risk Category,Risk Level,Recommendation\n';
    
    predictions.forEach((prediction, index) => {
        const riskInfo = getRiskInfo(prediction);
        csvContent += `${index + 1},${prediction},${riskInfo.level},"${riskInfo.recommendation}"\n`;
    });
    
    // Add summary
    csvContent += '\n\nSummary\n';
    csvContent += 'Risk Category,Count\n';
    csvContent += `P1 - Low Risk,${counts.P1 || 0}\n`;
    csvContent += `P2 - Medium Risk,${counts.P2 || 0}\n`;
    csvContent += `P3 - High Risk,${counts.P3 || 0}\n`;
    csvContent += `P4 - Very High Risk,${counts.P4 || 0}\n`;
    
    downloadFile(csvContent, 'credit_risk_predictions.csv', 'text/csv');
}

function exportToJSON(results) {
    const jsonContent = JSON.stringify(results, null, 2);
    downloadFile(jsonContent, 'credit_risk_predictions.json', 'application/json');
}

function downloadFile(content, filename, mimeType) {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// Utility functions
function showLoading() {
    loading.style.display = 'flex';
}

function hideLoading() {
    loading.style.display = 'none';
}

function showError(message) {
    errorMessage.textContent = message;
    errorModal.style.display = 'flex';
}

function hideErrorModal() {
    errorModal.style.display = 'none';
}

function resetApplication() {
    // Reset file selection
    removeSelectedFile();
    
    // Hide results
    resultsSection.style.display = 'none';
    
    // Reset variables
    currentResults = null;
    
    // Destroy chart
    if (riskChart) {
        riskChart.destroy();
        riskChart = null;
    }
    
    // Scroll to upload section
    document.getElementById('upload').scrollIntoView({ behavior: 'smooth' });
}
