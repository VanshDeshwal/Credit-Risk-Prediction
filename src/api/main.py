
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

class PredictRequest(BaseModel):
    data: list
    columns: list

@app.post("/predict")
def predict_json(request: PredictRequest):
    df = pd.DataFrame(request.data, columns=request.columns)
    # --- Preprocessing block (same as in /upload) ---
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
    return JSONResponse(status_code=200, content={"prediction": prediction.tolist()})

@app.post("/upload")
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
    return JSONResponse(status_code=200, content={"prediction": prediction.tolist()})

@app.get("/")
def hello_func():
    return {'message': 'Hello World!!'}

