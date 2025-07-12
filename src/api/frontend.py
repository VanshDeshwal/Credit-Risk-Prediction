import streamlit as st
import pandas as pd
import requests

st.title('Credit Risk Prediction')

uploaded_file = st.file_uploader('Upload an Excel file', type=['xlsx'])

if uploaded_file:
    # Only read for preview, do not exhaust the file object
    df = pd.read_excel(uploaded_file)
    st.write('Preview of uploaded data:')
    st.dataframe(df.head())

    # Reset file pointer to start for upload
    uploaded_file.seek(0)

    if st.button('Get Prediction'):
        files = {'file': (uploaded_file.name, uploaded_file, 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')}
        response = requests.post('http://127.0.0.1:8000/upload', files=files)
        if response.status_code == 200:
            preds = response.json()['prediction']
            st.write('Predictions:')
            st.dataframe(pd.DataFrame({'Prediction': preds}))
        else:
            st.error(f'Error: {response.text}')
