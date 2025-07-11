# Credit Risk Model
predicts the risk of giving credit to a person in 4 levels, P1 P2 P3 P4

# Directory structure

```bash
credit-risk-prediction/
├── README.md
├── data/
│   ├── raw/
│   └── processed/
├── notebooks/
│   ├── 01_EDA.ipynb
│   ├── 02_Feature_Engineering.ipynb
│   ├── 03_Model_Comparison.ipynb
│   └── 04_Hyperparameter_Tuning.ipynb
├── src/
│   ├── data/             # data ingestion & cleaning scripts
│   ├── features/         # feature engineering pipeline code
│   ├── models/           # model training, evaluation & tuning code
│   └── api/              # FastAPI application code
├── reports/
│   └── figures/          # exported plots & charts
├── model_artifacts/
│   └── credit_risk_model.pkl
├── requirements.txt
└── .github/
    └── workflows/        # CI/CD (e.g. GitHub Actions)



# How to create requirements.txt ?
`pip install Your_Libraries`
`pip freeze > requirements.txt`
