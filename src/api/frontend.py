import streamlit as st
import pandas as pd
import requests

st.title('Credit Risk Prediction')

uploaded_file = st.file_uploader('Upload an Excel file', type=['xlsx'])

if uploaded_file:
    try:
        df = pd.read_excel(uploaded_file)
        st.write('Preview of uploaded data:')
        st.dataframe(df.head())
    except Exception as e:
        st.error(f"Failed to read the Excel file. Please check the file format.\nError: {e}")
        st.stop()

    # Reset file pointer to start for upload
    try:
        uploaded_file.seek(0)
    except Exception:
        st.warning("Could not reset file pointer. If you encounter upload issues, please re-upload the file.")

    if st.button('Get Prediction'):
        with st.spinner('Getting predictions from API...'):
            files = {'file': (uploaded_file.name, uploaded_file, 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')}
            try:
                response = requests.post('http://127.0.0.1:8000/predict', files=files, timeout=60)
            except requests.exceptions.ConnectionError:
                st.error('Could not connect to the prediction API. Please ensure the FastAPI server is running.')
                st.stop()
            except requests.exceptions.Timeout:
                st.error('The request to the API timed out. Please try again later.')
                st.stop()
            except Exception as e:
                st.error(f'Unexpected error while contacting API: {e}')
                st.stop()

            if response.status_code == 200:
                try:
                    result = response.json()
                    preds = result['prediction']
                    counts = result.get('counts', {})
                    st.write('Predictions:')
                    st.dataframe(pd.DataFrame({'Prediction': preds}))
                    st.markdown('---')
                    st.markdown('### Prediction Counts')
                    count_df = pd.DataFrame([
                        {'Class': 'P1', 'Count': counts.get('P1', 0)},
                        {'Class': 'P2', 'Count': counts.get('P2', 0)},
                        {'Class': 'P3', 'Count': counts.get('P3', 0)},
                        {'Class': 'P4', 'Count': counts.get('P4', 0)},
                    ])
                    st.table(count_df.style.format({'Count': '{:d}'}).set_properties(**{'text-align': 'center'}))
                except Exception as e:
                    st.error(f'Error parsing API response: {e}\nRaw response: {response.text}')
                except Exception as e:
                    st.error(f'Error parsing API response: {e}\nRaw response: {response.text}')
            elif response.status_code == 422:
                st.error('Invalid input. Please check that your Excel file has all required columns and correct data types.')
            elif response.status_code == 500:
                st.error('Internal server error in the API. Please check the FastAPI logs for details.')
            else:
                st.error(f'API returned error {response.status_code}: {response.text}')
