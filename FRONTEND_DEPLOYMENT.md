# Frontend Deployment Guide

## 🌐 Custom Subdomain Suggestions for vanshdeshwal.dev

Here are some great subdomain options for your credit risk prediction application:

### 🎯 **Recommended Options:**
1. **`creditpredict.vanshdeshwal.dev`** ⭐ (Currently configured)
2. **`riskassess.vanshdeshwal.dev`** - Clean and professional
3. **`creditai.vanshdeshwal.dev`** - Emphasizes AI aspect
4. **`riskanalyzer.vanshdeshwal.dev`** - Descriptive and clear

### 🏢 **Business-Focused:**
- `creditscore.vanshdeshwal.dev`
- `riskeval.vanshdeshwal.dev`
- `creditcheck.vanshdeshwal.dev`
- `lendingai.vanshdeshwal.dev`

### 🤖 **AI/Tech-Focused:**
- `mlpredict.vanshdeshwal.dev`
- `airisks.vanshdeshwal.dev`
- `smartcredit.vanshdeshwal.dev`
- `predictive.vanshdeshwal.dev`

### 📊 **Analytics-Focused:**
- `riskanalytics.vanshdeshwal.dev`
- `creditinsights.vanshdeshwal.dev`
- `riskmetrics.vanshdeshwal.dev`
- `creditdata.vanshdeshwal.dev`

## 🚀 Deployment Steps

### Step 1: DNS Configuration

1. **Add CNAME Record** in your DNS provider (where vanshdeshwal.dev is hosted):
   ```
   Type: CNAME
   Name: creditpredict (or your chosen subdomain)
   Value: vanshdeshwal.github.io
   TTL: 300 (or default)
   ```

2. **Alternative: A Records** (if CNAME doesn't work):
   ```
   Type: A
   Name: creditpredict
   Value: 185.199.108.153
   
   Type: A
   Name: creditpredict
   Value: 185.199.109.153
   
   Type: A
   Name: creditpredict
   Value: 185.199.110.153
   
   Type: A
   Name: creditpredict
   Value: 185.199.111.153
   ```

### Step 2: GitHub Repository Setup

1. **Create a new repository** for the frontend:
   ```
   Repository name: creditpredict-frontend
   Visibility: Public
   ```

2. **Upload frontend files** to the repository:
   ```bash
   git init
   git add .
   git commit -m "Initial commit: CreditPredict AI frontend"
   git branch -M main
   git remote add origin https://github.com/VanshDeshwal/creditpredict-frontend.git
   git push -u origin main
   ```

### Step 3: GitHub Pages Configuration

1. **Enable GitHub Pages**:
   - Go to repository Settings
   - Scroll to "Pages" section
   - Source: "Deploy from a branch"
   - Branch: "main"
   - Folder: "/ (root)"

2. **Custom Domain**:
   - Enter your chosen subdomain in the custom domain field
   - GitHub will automatically create/update the CNAME file

### Step 4: API Configuration

Update the API URL in `frontend/script.js`:

```javascript
// For development/testing (if API is running locally)
const API_BASE_URL = 'http://localhost:8000';

// For production (if you deploy the API)
const API_BASE_URL = 'https://your-api-domain.com';

// Current placeholder
const API_BASE_URL = 'https://credit-risk-api.azurecontainerapps.io';
```

### Step 5: SSL Certificate

GitHub Pages automatically provides SSL certificates for custom domains. Wait 10-15 minutes after DNS propagation for the certificate to be issued.

## 📁 Project Structure

```
frontend/
├── index.html          # Main HTML file
├── styles.css          # CSS styles
├── script.js           # JavaScript functionality
├── CNAME              # Custom domain configuration
└── README.md          # Frontend documentation
```

## 🔧 Features Implemented

### ✅ **Complete API Integration:**
- Health check endpoint (`/health`)
- File upload and prediction (`/predict`)
- Error handling and validation

### ✅ **User Interface:**
- Drag & drop file upload
- File validation (Excel .xlsx only, 10MB max)
- Loading states and progress indicators
- Responsive design for all devices

### ✅ **Data Visualization:**
- Summary cards for each risk category (P1-P4)
- Interactive doughnut chart using Chart.js
- Detailed results table with recommendations

### ✅ **Export Functionality:**
- Export results to CSV format
- Export results to JSON format
- Downloadable files with proper formatting

### ✅ **User Experience:**
- Smooth scrolling navigation
- Error modals with clear messages
- Reset functionality for new analyses
- Professional design with animations

## 🌐 Live URL

Once deployed, your application will be available at:
**https://creditpredict.vanshdeshwal.dev**

## 🔒 Security Features

- File type validation (only .xlsx files)
- File size limits (10MB maximum)
- Client-side validation before API calls
- Error handling for API failures
- HTTPS encryption via GitHub Pages

## 📱 Mobile Responsive

The application is fully responsive and works seamlessly on:
- Desktop computers
- Tablets
- Mobile phones
- All modern browsers

## 🎨 Design Highlights

- **Modern UI**: Clean, professional interface
- **Color Scheme**: Blue primary with semantic colors for risk levels
- **Typography**: Inter font for excellent readability
- **Icons**: Font Awesome for consistent iconography
- **Animations**: Smooth transitions and hover effects

## 🔄 Future Enhancements

Consider adding these features later:
- User authentication
- History of previous analyses
- Batch file processing
- API rate limiting display
- More detailed analytics
- Print functionality
- Dark mode toggle

## 🐛 Troubleshooting

### Common Issues:

1. **DNS Not Propagating**: Wait 24-48 hours for global propagation
2. **SSL Certificate Issues**: GitHub takes 10-15 minutes to issue certificates
3. **API Errors**: Check if the backend API is running and accessible
4. **File Upload Issues**: Ensure file is .xlsx format and under 10MB

### Testing Locally:

```bash
# Using Python
python -m http.server 8080

# Using Node.js
npx serve .

# Using PHP
php -S localhost:8080
```

Then visit `http://localhost:8080` to test the application.
