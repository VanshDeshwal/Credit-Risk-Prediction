# CreditPredict AI

A modern, responsive web application for AI-powered credit risk assessment. Built with vanilla HTML, CSS, and JavaScript.

## Features

- **Drag & Drop File Upload**: Easy Excel file upload with validation
- **Real-time Processing**: Get instant risk predictions in under 10 seconds
- **Interactive Visualizations**: Beautiful charts showing risk distribution
- **Detailed Results**: Comprehensive table with recommendations
- **Export Functionality**: Download results in CSV or JSON format
- **Responsive Design**: Works perfectly on desktop and mobile devices

## Risk Categories

- **P1 - Low Risk**: Approve with standard terms
- **P2 - Medium Risk**: Approve with monitoring
- **P3 - High Risk**: Approve with strict conditions
- **P4 - Very High Risk**: Reject or require collateral

## Technology Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Charts**: Chart.js
- **Icons**: Font Awesome
- **Fonts**: Inter (Google Fonts)
- **Backend API**: FastAPI (Python)

## File Requirements

- File format: Excel (.xlsx) only
- Maximum file size: 10MB
- Required columns: As per your ML model requirements

## API Integration

The frontend connects to a FastAPI backend that provides:
- `/health` - API health check
- `/predict` - Credit risk prediction endpoint

## Browser Support

- Chrome/Edge 88+
- Firefox 85+
- Safari 14+

## Development

To run locally:
1. Serve the files using any local server
2. Update the API_BASE_URL in script.js to point to your backend
3. Open index.html in your browser

## Deployment

This application is optimized for GitHub Pages deployment with custom domain support.
