# Credit Risk Model
predicts the risk of giving credit to a person in 4 levels, P1 P2 P3 P4

# Directory structure

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


# How to create requirements.txt ?
`pip install Your_Libraries`
`pip freeze > requirements.txt`
