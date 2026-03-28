from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import joblib
import pandas as pd
import os

router = APIRouter(prefix="/prediction", tags=["Prediction"])

# Path to the models
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODEL_PATH = os.path.join(BASE_DIR, "models", "nomophobia_neural_network_model.joblib")
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

        # Let's pass the input to the main prediction logic later

        
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
        out_pred = MODEL.predict(final_input)[0]
        
        # Check if model is a classifier
        if hasattr(MODEL, "predict_proba"):
            proba = MODEL.predict_proba(final_input)[0]
            # Map class 0=Mild (3.0), 1=Moderate (7.0), 2=Severe (10.0)
            raw_score = float(proba[0] * 3.0 + proba[1] * 7.0 + proba[2] * 10.0)
            print(f"Classifier Mode - Output Class: {out_pred}")
            print(f"Probabilities: {proba}")
        else:
            # ---------------------------------------------------------
            # [จุดที่แก้ไข] 
            # สมมติฐาน: โมเดลพ่นค่า 0 (ปกติ), 1 (ปานกลาง), 2 (รุนแรง)
            # นำผลลัพธ์มาคูณ 5 เพื่อแปลงให้เป็นสเกลคะแนนเต็ม 10 สำหรับหน้า UI
            # 0 * 5 = 0.0 (ปกติ)
            # 1 * 5 = 5.0 (ปานกลาง)
            # 2 * 5 = 10.0 (รุนแรง)
            # ---------------------------------------------------------
            raw_score = float(out_pred) * 5.0
            
        print(f"Computed Score for Frontend: {raw_score}")
        
        # Clip score to 0-10 range for visual consistency
        dynamic_score = round(max(0.0, min(10.0, raw_score)), 1)
        
        # Define levels based on common interpretation of Nomophobia scores
        # Usually: 0-3 Normal, 4-7 Moderate, 8-10 Severe
        if dynamic_score < 5.0:
            label = "ปกติ (Normal)"
            msg = "พฤติกรรมการใช้งานของคุณอยู่ในเกณฑ์ปกติ ไม่พบความเสี่ยงของภาวะโนโมโฟเบีย"
            color = "green"
        elif dynamic_score < 8.0:
            label = "ปานกลาง (Moderate)"
            msg = "คุณเริ่มมีสัญญาณของการพึ่งพาโทรศัพท์มากเกินไป ควรเริ่มตั้งเป้าหมายในการลดเวลาหน้าจอลงบ้าง"
            color = "yellow"
        elif dynamic_score < 8.0:
            label = "ใกล้รุนแรง (Near Severe)"
            msg = "คุณมีพฤติกรรมเสพติดมือถือในระดับใกล้รุนแรง ควรปรับเปลี่ยนพฤติกรรมเพื่อลดความเสี่ยง"
            color = "orange"
        elif dynamic_score < 10.0:
            label = "เริ่มรุนแรง (Onset of Severe)"
            msg = "พฤติกรรมของคุณเริ่มเข้าสู่ขั้นรุนแรง ควรให้ความสำคัญกับการลดเวลาหน้าจออย่างจริงจัง"
            color = "red"
        else:
            label = "รุนแรง (Severe)"
            msg = "กรุณาปรึกษาแพทย์ คุณมีความเสี่ยงสูงต่อภาวะโนโมโฟเบีย ซึ่งอาจส่งผลต่อสุขภาพจิตและการดำเนินชีวิต"
            color = "dark-red"

        # --- Contextual Note: Education Purpose Check ---
        # Phone_Usage_Purpose == 1 หมายถึง "การศึกษา"
        education_note = None
        if input_data.Phone_Usage_Purpose == 1 and dynamic_score >= 8.0:
            education_ratio = (
                input_data.Time_on_Education / input_data.Daily_Usage_Hours
                if input_data.Daily_Usage_Hours > 0 else 0.0
            )
            print(f"Education Ratio: {education_ratio:.2%}")

            if education_ratio >= 0.6:
                # ใช้เพื่อการศึกษา > 60% → ลดความกังวล แต่ยังเตือนเรื่องปริมาณ
                education_note = (
                    "📚 หมายเหตุ: คุณใช้โทรศัพท์เพื่อการศึกษาเป็นส่วนใหญ่ "
                    f"({education_ratio:.0%} ของเวลาใช้งานทั้งหมด) "
                    "แม้จะเป็นการใช้ที่มีประโยชน์ แต่ปริมาณการใช้งานโดยรวมยังคงสูง "
                    "ควรพักสายตาทุก 20-30 นาที และหลีกเลี่ยงการใช้งานก่อนนอน"
                )
            elif education_ratio >= 0.3:
                # ใช้เพื่อการศึกษาบ้าง แต่ไม่ถึง 60% → เตือนให้สังเกตตัวเอง
                education_note = (
                    "📚 หมายเหตุ: แม้ว่าส่วนหนึ่งของการใช้งานเป็นเพื่อการศึกษา "
                    f"({education_ratio:.0%}) แต่ยังมีการใช้งานในด้านอื่นๆ ในปริมาณสูง "
                    "ควรตรวจสอบและปรับสมดุลการใช้งานในแต่ละวัน"
                )
            # ratio < 30% → ไม่เพิ่ม note เพราะ Purpose บอกว่าศึกษา แต่เวลาจริงไม่ใช่

        if education_note:
            msg = f"{msg}\n\n{education_note}"
            print(f"Education Note Added (ratio={education_ratio:.2%})")

        print(f"Final Dynamic Score: {dynamic_score} ({label})")
        print(f"------------------------")

        return {
            "prediction_score": dynamic_score,
            "prediction_label": label,
            "message": msg,
            "level_color": color,
            "model_type": "Neural Network (Auto Mode)"
        }
    except Exception as e:
        print(f"Prediction error: {e}")
        raise HTTPException(status_code=500, detail=str(e))
