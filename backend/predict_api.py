from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import joblib
import numpy as np
import pandas as pd

# 1. Initialize FastAPI
app = FastAPI(title="Nomophobia Prediction API")

# 2. Load the exported Model and Scaler
try:
    scaler = joblib.load('nomophobia_scaler.joblib')
    # Best model from our analysis: Neural Network
    model = joblib.load('nomophobia_neural_network_model.joblib')
    print("✅ Model and Scaler loaded successfully")
except Exception as e:
    print(f"❌ Error loading model: {e}")

# 3. Define Input Data Structure (matching your 20 features)
class NomophobiaInput(BaseModel):
    Age: float
    Gender: int  # 0 or 1
    Daily_Usage_Hours: float
    Sleep_Hours: float
    Academic_Performance: float
    Social_Interactions: float
    Exercise_Hours: float
    Anxiety_Level: float
    Depression_Level: float
    Self_Esteem: float
    Parental_Control: float
    Screen_Time_Before_Bed: float
    Phone_Checks_Per_Day: float
    Apps_Used_Daily: float
    Time_on_Social_Media: float
    Time_on_Gaming: float
    Time_on_Education: float
    Phone_Usage_Purpose: float
    Family_Communication: float
    Weekend_Usage_Hours: float

@app.get("/")
def home():
    return {"message": "Nomophobia Prediction API is running!"}

@app.post("/predict")
def predict(data: NomophobiaInput):
    try:
        # Convert input to array
        input_dict = data.model_dump()
        input_list = [list(input_dict.values())]
        
        # Scale the data
        input_scaled = scaler.transform(input_list)
        
        # Make prediction
        prediction = model.predict(input_scaled)
        
        # Map result to label
        results = {0: "Mild (น้อย)", 1: "Moderate (ปานกลาง)", 2: "Severe (รุนแรง)"}
        label = results[int(prediction[0])]
        
        return {
            "prediction_code": int(prediction[0]),
            "prediction_label": label,
            "status": "success"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    # To run: python predict_api.py
    uvicorn.run(app, host="0.0.0.0", port=8000)
