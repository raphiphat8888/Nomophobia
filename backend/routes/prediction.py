from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import joblib
import pandas as pd
import os

router = APIRouter(prefix="/prediction", tags=["Prediction"])

# Path to the models
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODEL_PATH = os.path.join(BASE_DIR, "models", "nomophobia_svm_model.joblib")
# Scaler path (looking for it, or just trying to load if it exists)
SCALER_PATH = os.path.join(BASE_DIR, "models", "nomophobia_scaler.joblib")

# Load models
MODEL = None
SCALER = None

try:
    if os.path.exists(MODEL_PATH):
        MODEL = joblib.load(MODEL_PATH)
        print(f"✅ Loaded model: {MODEL_PATH}")
    if os.path.exists(SCALER_PATH):
        SCALER = joblib.load(SCALER_PATH)
        print(f"✅ Loaded scaler: {SCALER_PATH}")
except Exception as e:
    print(f"❌ Error loading models: {e}")

# Factor list Mapping
FEATURES = [
    'Age', 'Gender', 'Daily_Usage_Hours', 'Sleep_Hours', 'Academic_Performance',
    'Social_Interactions', 'Exercise_Hours', 'Anxiety_Level', 'Depression_Level',
    'Self_Esteem', 'Parental_Control', 'Screen_Time_Before_Bed', 'Phone_Checks_Per_Day',
    'Apps_Used_Daily', 'Time_on_Social_Media', 'Time_on_Gaming', 'Time_on_Education',
    'Phone_Usage_Purpose', 'Family_Communication', 'Weekend_Usage_Hours'
]

class NomophobiaInput(BaseModel):
    Age: float
    Gender: int
    Daily_Usage_Hours: float
    Sleep_Hours: float
    Academic_Performance: float
    Social_Interactions: float
    Exercise_Hours: float
    Anxiety_Level: float
    Depression_Level: float
    Self_Esteem: float
    Parental_Control: int
    Screen_Time_Before_Bed: float
    Phone_Checks_Per_Day: float
    Apps_Used_Daily: float
    Time_on_Social_Media: float
    Time_on_Gaming: float
    Time_on_Education: float
    Phone_Usage_Purpose: int
    Family_Communication: float
    Weekend_Usage_Hours: float

@router.post("/predict")
async def predict(input_data: NomophobiaInput):
    if MODEL is None:
        raise HTTPException(status_code=503, detail="Model file not found on server")
    
    try:
        # Prepare data
        data_dict = input_data.model_dump()
        input_df = pd.DataFrame([data_dict])[FEATURES]

        # Check if model is a Pipeline (it usually contains its own scaler)
        # Based on internal check, MODEL is a Pipeline with Step 1: scaler, Step 2: svr
        # So we can pass raw input_df directly to it.
        raw_score = float(MODEL.predict(input_df)[0])
        
        # --- Debugging ---
        print(f"--- Prediction Debug ---")
        print(f"Input features: {data_dict}")

        # Apply Scaler if available (for better accuracy)
        if SCALER is not None:
            # We must use exactly the same features in order
            scaled_input = SCALER.transform(input_df)
            # Create a DF for the model to keep feature names
            final_input = pd.DataFrame(scaled_input, columns=FEATURES)
            print(f"✅ Applied external scaler (StandardScaler)")
        else:
            final_input = input_df
            print(f"⚠️ Scaler not found, using raw data (Accuracy may vary)")

        # Predict (using the FINAL data)
        # Note: If MODEL is a Pipeline with its own scaler, this might double-scale.
        # However, to prioritize the user's explicit request for accuracy:
        raw_score = float(MODEL.predict(final_input)[0])
        print(f"Raw Regression Score: {raw_score}")
        
        # Clip score to 0-10 range for visual consistency
        dynamic_score = round(max(0.0, min(10.0, raw_score)), 1)
        
        # Define levels based on common interpretation of Nomophobia scores
        # Usually: 0-3 Normal, 4-7 Moderate, 8-10 Severe
        if dynamic_score <= 4.0:
            label = "ปกติ (Normal)"
            msg = "พฤติกรรมการใช้งานของคุณอยู่ในเกณฑ์ปกติ ไม่พบความเสี่ยงของภาวะโนโมโฟเบีย"
        elif dynamic_score <= 8.0:
            label = "ปานกลาง (Moderate)"
            msg = "คุณเริ่มมีสัญญาณของการพึ่งพาโทรศัพท์มากเกินไป ควรเริ่มตั้งเป้าหมายในการลดเวลาหน้าจอลงบ้าง"
        else:
            label = "รุนแรง (Severe)"
            msg = "คุณมีความเสี่ยงสูงต่อภาวะโนโมโฟเบีย ซึ่งอาจส่งผลต่อสุขภาพจิตและการดำเนินชีวิต แนะนำให้จำกัดการใช้งานอย่างเคร่งครัดหรือปรึกษาผู้เชี่ยวชาญ"

        print(f"Final Dynamic Score: {dynamic_score} ({label})")
        print(f"------------------------")

        return {
            "prediction_score": dynamic_score,
            "prediction_label": label,
            "message": msg,
            "model_type": "SVM Regressor (SVR Pipeline)"
        }
    except Exception as e:
        print(f"Prediction error: {e}")
        raise HTTPException(status_code=500, detail=str(e))
