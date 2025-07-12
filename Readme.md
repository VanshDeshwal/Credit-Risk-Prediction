# Credit Risk Model
predicts the risk of giving credit to a person in 4 levels, P1 P2 P3 P4

# Directory structure

```bash
credit-risk-prediction/
├── README.md
├── data/                    # raw & processed sample data
│   ├── raw/                 
│   └── processed/           
├── notebooks/               # Jupyter notebooks for exploration
│   ├── 01_EDA.ipynb
│   ├── 02_Feature_Engineering.ipynb
│   ├── 03_Model_Comparison.ipynb
│   └── 04_Hyperparameter_Tuning.ipynb
├── src/                     
│   ├── data/                # data loading & cleaning scripts
│   ├── features/            # transformation pipeline code
│   ├── models/              # training, evaluation, tuning code
│   └── api/                 # FastAPI app
├── reports/                 # auto‑exported HTML or PDF of notebooks
│   └── figures/             # plots, model comparison charts
├── requirements.txt
├── model_artifacts/         
│   └── credit_risk_model.pkl
└── .github/                 # CI (e.g. GitHub Actions) for tests & notebooks to HTML
    └── workflows/
```

# How to create requirements.txt ?
`pip install Your_Libraries`
`pip freeze > requirements.txt`

# Setup Instructions

## 1. Environment Setup
- Clone the repository and navigate to the project directory.
- Create a virtual environment (recommended):
  ```bash
  python -m venv .venv
  # On Windows:
  .venv\Scripts\activate
  # On Mac/Linux:
  source .venv/bin/activate
  ```
- Install dependencies:
  ```bash
  pip install -r requirements.txt
  ```

## 2. Data Preparation
- Place your raw Excel files in `data/raw/`.
- Processed data should be in `data/processed/` (e.g., `df_encoded.csv`).

## 3. Model Training & Saving
- Use the scripts in `src/models/` to train your model.
- Save the trained model as `model.pkl` (or `credit_risk_model.pkl`) in the `model_artifacts/` directory.
- Example (Python):
  ```python
  import pickle
  # model = ... (your trained model)
  with open('model_artifacts/model.pkl', 'wb') as f:
      pickle.dump(model, f)
  ```

# API Usage (FastAPI)

## 1. Start the API Server
```bash
uvicorn src.api.main:app --reload
```
- The API will be available at `http://127.0.0.1:8000`.
- Interactive docs: `http://127.0.0.1:8000/docs`

## 2. API Endpoints

### `/upload` (POST)
- Accepts: Excel file upload (`.xlsx`)
- Returns: JSON with predictions
- Example (Python):
  ```python
  import requests
  files = {'file': open('yourfile.xlsx', 'rb')}
  r = requests.post('http://127.0.0.1:8000/upload', files=files)
  print(r.json())
  ```

### `/predict` (POST)
- Accepts: JSON with `data` (list of rows) and `columns` (list of column names)
- Returns: JSON with predictions
- Example (Python):
  ```python
  import requests
  import pandas as pd
  df = pd.read_excel('yourfile.xlsx')
  payload = {'data': df.values.tolist(), 'columns': df.columns.tolist()}
  r = requests.post('http://127.0.0.1:8000/predict', json=payload)
  print(r.json())
  ```

# Streamlit Frontend

- File: `src/api/frontend.py`
- Usage:
  ```bash
  streamlit run src/api/frontend.py
  ```
- Features:
  - Upload an Excel file
  - Preview data
  - Click 'Get Prediction' to send file to API and display results

# Docker Deployment

## 1. Build Docker Image
```bash
docker build -t credit-risk-api .
```

## 2. Run Docker Container
```bash
docker run -p 8000:8000 credit-risk-api
```

- The API will be available at `http://127.0.0.1:8000` inside the container.

# AWS Deployment (EC2 Example)
1. Launch an EC2 instance with Docker installed.
2. Clone this repository to the instance.
3. Build and run the Docker image as above.
4. Open port 8000 in your EC2 security group.
5. Access the API via your EC2 public IP.

# Troubleshooting
- **Internal Server Error (500):**
  - Ensure the uploaded file is a valid Excel file and matches expected columns.
  - Check FastAPI logs for detailed error messages.
  - Make sure `model.pkl` exists in `model_artifacts/` and is compatible with the code.
- **ModuleNotFoundError:**
  - Activate your virtual environment and install all dependencies.
- **CORS Issues:**
  - If using the API from a browser or another server, add CORS middleware to FastAPI.

# Contributing
- Fork the repo and create a feature branch.
- Submit a pull request with a clear description of your changes.

# License
- See `LICENSE` file for details.
