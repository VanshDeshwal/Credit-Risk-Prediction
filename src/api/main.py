
from fastapi import FastAPI, UploadFile
from fastapi.responses import JSONResponse
from pydantic import BaseModel
import pickle
import pandas as pd
from io import BytesIO

# import the ml model
with open('model.pkl', 'rb') as f:
    model = pickle.load(f)

app = FastAPI()

# machine readable
@app.get("/health")
def health_check():
    return {
        'status': 'OK',
        'version': '1.0.0',
        'model_loaded': model is not None
    }

class PredictRequest(BaseModel):
    data: list
    columns: list

@app.post("/predict")
async def predict(file: UploadFile):
    content = await file.read()
    df = pd.read_excel(BytesIO(content))
    df.loc[df['EDUCATION'] == 'SSC',['EDUCATION']]              = 1
    df.loc[df['EDUCATION'] == '12TH',['EDUCATION']]             = 2
    df.loc[df['EDUCATION'] == 'GRADUATE',['EDUCATION']]         = 3
    df.loc[df['EDUCATION'] == 'UNDER GRADUATE',['EDUCATION']]   = 3
    df.loc[df['EDUCATION'] == 'POST-GRADUATE',['EDUCATION']]    = 4
    df.loc[df['EDUCATION'] == 'OTHERS',['EDUCATION']]           = 1
    df.loc[df['EDUCATION'] == 'PROFESSIONAL',['EDUCATION']]     = 3
    df['EDUCATION'] = df['EDUCATION'].astype(int)
    df_encoded = pd.get_dummies(df, columns=['MARITALSTATUS','GENDER', 'last_prod_enq2' ,'first_prod_enq2'])
    prediction = model.predict(df_encoded)
    mapping = {0: 'P1', 1: 'P2', 2: 'P3', 3: 'P4'}
    mapped_preds = [mapping.get(int(x), str(x)) for x in prediction]
    from collections import Counter
    counts = Counter(mapped_preds)
    return JSONResponse(
        status_code=200,
        content={
            "prediction": mapped_preds,
            "counts": {
                "P1": counts.get("P1", 0),
                "P2": counts.get("P2", 0),
                "P3": counts.get("P3", 0),
                "P4": counts.get("P4", 0),
            }
        }
    )

@app.get("/")
def hello_func():
    return {'message': 'Hello World!!'}

