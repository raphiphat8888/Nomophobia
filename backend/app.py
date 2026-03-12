from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pandas as pd
from sklearn.ensemble import RandomForestRegressor
import os
import joblib
from contextlib import asynccontextmanager

# Constants
FEATURES = ['Age', 'Daily_Usage_Hours', 'Phone_Checks_Per_Day', 'Screen_Time_Before_Bed', 'Anxiety_Level', 'Social_Interactions']
MODEL_PATH = os.path.join(os.path.dirname(__file__), 'models', 'nomophobia_rf_model.joblib')
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
            print("⏳ Training new model (this may take a moment)...")
            X = DATA[FEATURES]
            y = DATA['Addiction_Level']
            MODEL = RandomForestRegressor(n_estimators=100, random_state=42)
            MODEL.fit(X, y)
            
            # Ensure models directory exists
            os.makedirs(os.path.dirname(MODEL_PATH), exist_ok=True)
            joblib.dump(MODEL, MODEL_PATH)
            print("✅ Model trained and saved to disk")
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
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class NomophobiaInput(BaseModel):
    age: float
    dailyUsage: float
    phoneChecks: float
    screenTimeBed: float
    anxiety: float
    social: float

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
        # Prepare data for prediction
        input_df = pd.DataFrame([[
            input_data.age,
            input_data.dailyUsage,
            input_data.phoneChecks,
            input_data.screenTimeBed,
            input_data.anxiety,
            input_data.social
        ]], columns=FEATURES)
        
        score_raw = MODEL.predict(input_df)[0]
        score = round(min(max(float(score_raw), 1.0), 10.0), 1)
        
        # Diagnostic mapping
        if score >= 8.0:
            label = "Severe (รุนแรงมาก)"
            risk = "High"
        elif score >= 5.0:
            label = "Moderate (ปานกลาง)"
            risk = "Medium"
        else:
            label = "Mild (น้อย)"
            risk = "Low"
        
        return {
            "prediction_score": score,
            "prediction_label": label,
            "risk_level": risk,
            "status": "success"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app:app", host="0.0.0.0", port=8000, reload=True)
