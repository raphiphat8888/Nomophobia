from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
import pandas as pd
from sklearn.ensemble import RandomForestRegressor
import os
import joblib
from contextlib import asynccontextmanager

from sklearn.svm import SVR
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler

# Constants
FEATURES = [
    'Age', 'Gender', 'Daily_Usage_Hours', 'Sleep_Hours', 'Academic_Performance',
    'Social_Interactions', 'Exercise_Hours', 'Anxiety_Level', 'Depression_Level',
    'Self_Esteem', 'Parental_Control', 'Screen_Time_Before_Bed', 'Phone_Checks_Per_Day',
    'Apps_Used_Daily', 'Time_on_Social_Media', 'Time_on_Gaming', 'Time_on_Education',
    'Phone_Usage_Purpose', 'Family_Communication', 'Weekend_Usage_Hours'
]
MODEL_PATH = os.path.join(os.path.dirname(__file__), 'models', 'nomophobia_svm_model.joblib')
DATA_PATH = os.path.join(os.path.dirname(__file__), 'teen_phone_New.csv')

# Global variables
MODEL = None
DATA = None

def train_or_load_model():
    global MODEL, DATA
    try:
        # Load data for stats and training
        if os.path.exists(DATA_PATH):
            DATA = pd.read_csv(DATA_PATH)
        else:
            print(f"⚠️ Warning: Dataset not found at {DATA_PATH}")

        # Try to load existing model
        if os.path.exists(MODEL_PATH):
            MODEL = joblib.load(MODEL_PATH)
            print("✅ Model loaded from disk")
        elif DATA is not None:
            print("⏳ Training new SVM model with scaling (this may take a moment)...")
            X = DATA[FEATURES]
            y = DATA['Addiction_Level']
            
            # Create a pipeline with Scaling + SVR (Linear)
            # Linear kernel is better at extrapolating outside the biased 8-10 range of the training data
            MODEL = Pipeline([
                ('scaler', StandardScaler()),
                ('svr', SVR(kernel='linear', C=0.2, epsilon=0.1))
            ])
            MODEL.fit(X, y)
            
            # Ensure models directory exists
            os.makedirs(os.path.dirname(MODEL_PATH), exist_ok=True)
            joblib.dump(MODEL, MODEL_PATH)
            print("✅ Model trained with Linear Scaling and saved to disk")
    except Exception as e:
        print(f"❌ Error in train_or_load_model: {e}")

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup logic
    train_or_load_model()
    yield
    # Shutdown logic (optional)

app = FastAPI(title="Nomophobia Analysis System", lifespan=lifespan)

# Enable CORS for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, specify your React URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)




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

@app.get("/")
def read_root():
    return {
        "status": "online", 
        "message": "Nomophobia Research API is active",
        "model_loaded": MODEL is not None
    }

@app.get("/stats")
def get_stats():
    if DATA is None:
        raise HTTPException(status_code=503, detail="Stats data not available")
    
    try:
        return {
            "total_respondents": len(DATA),
            "avg_usage": round(float(DATA['Daily_Usage_Hours'].mean()), 1),
            "avg_checks": int(DATA['Phone_Checks_Per_Day'].mean()),
            "avg_addiction": round(float(DATA['Addiction_Level'].mean()), 1)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/chart-data")
def get_chart_data():
    if DATA is None:
        raise HTTPException(status_code=503, detail="Data not loaded")
    
    try:
        # Group by rounded Daily Usage
        usage_data = DATA.groupby(DATA['Daily_Usage_Hours'].apply(lambda x: round(x * 2) / 2))['Addiction_Level'].mean().reset_index()
        usage_chart = [{"usage": float(row['Daily_Usage_Hours']), "addiction": round(float(row['Addiction_Level']), 1)} for _, row in usage_data.iterrows()]
        
        # Group by Anxiety Level
        anxiety_data = DATA.groupby(DATA['Anxiety_Level'].round())['Addiction_Level'].mean().reset_index()
        anxiety_chart = [{"anxiety": int(row['Anxiety_Level']), "addiction": round(float(row['Addiction_Level']), 1)} for _, row in anxiety_data.iterrows()]
        
        return {
            "usage_chart": usage_chart,
            "anxiety_chart": anxiety_chart
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/predict")
def predict(input_data: NomophobiaInput):
    if MODEL is None:
        train_or_load_model()
        if MODEL is None:
            raise HTTPException(status_code=503, detail="Model not ready")
    
    try:
        # Prepare data for prediction explicitly to match FEATURE order
        input_dict = input_data.model_dump()
        input_list = [input_dict[feat] for feat in FEATURES]
        input_df = pd.DataFrame([input_list], columns=FEATURES)
        
        # HEURISTIC GUARD: If usage is minimal, addiction must be low
        # The dataset is 99% high-addiction samples, so the model over-predicts by default
        if input_dict['Daily_Usage_Hours'] < 0.5 and input_dict['Phone_Checks_Per_Day'] < 5:
            score = 1.0 # Baseline Mild
        else:
            score_raw = MODEL.predict(input_df)[0]
            # Even with linear kernel, apply a slight adjustment for low usage
            if input_dict['Daily_Usage_Hours'] < 2:
                 score_raw = score_raw * 0.5 # Scale down for low usage to counter bias
            
            score = round(min(max(float(score_raw), 1.0), 10.0), 1)
        
        # Diagnostic mapping
        if score >= 8.0:
            label = "รุนแรง (Severe)"
            risk = "High"
            message = "SVM model detects high correlation with clinical nomophobia. Personal intervention is highly recommended."
        elif score >= 5.0:
            label = "ปานกลาง (Moderate)"
            risk = "Medium"
            message = "Warning: Digital habits are trending towards dependency. Consider implementing digital boundaries."
        else:
            label = "ปกติ (Normal)"
            risk = "Low"
            message = "Digital usage levels are within a healthy range compared to research benchmarks."
        
        return {
            "prediction_score": score,
            "prediction_label": label,
            "risk_level": risk,
            "message": message,
            "model_type": "Support Vector Machine (SVM)",
            "status": "success"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    print("\n🚀 Nomophobia API is starting at http://localhost:8000")
    uvicorn.run("app:app", host="127.0.0.1", port=8000, reload=True)
