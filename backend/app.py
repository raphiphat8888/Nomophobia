from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
import pandas as pd
from sklearn.ensemble import RandomForestRegressor
import os

app = FastAPI()

# Enable CORS for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "*",  # Allow all origins
        "https://nomophobia-6haf.vercel.app",
        "https://*.vercel.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)



# Global variables for model and data
MODEL = None
DATA = None
FEATURES = ['Age', 'Daily_Usage_Hours', 'Phone_Checks_Per_Day', 'Screen_Time_Before_Bed', 'Anxiety_Level', 'Social_Interactions']

def get_db_path():
    return os.path.join(os.path.dirname(__file__), 'teen_phone_New.csv')

def train_model():
    global MODEL, DATA
    try:
        DATA = pd.read_csv(get_db_path())
        X = DATA[FEATURES]
        y = DATA['Addiction_Level']
        MODEL = RandomForestRegressor(n_estimators=100, random_state=42)
        MODEL.fit(X, y)
        print("Model trained successfully on startup")
    except Exception as e:
        print(f"Error training model: {e}")

@app.on_event("startup")
async def startup_event():
    train_model()

class NomophobiaInput(BaseModel):
    age: float
    dailyUsage: float
    phoneChecks: float
    screenTimeBed: float
    anxiety: float
    social: float

@app.get("/")
def read_root():
    return {"status": "online", "message": "Nomophobia API is running"}

@app.get("/stats")
def get_stats():
    if DATA is None:
        return {"error": "Data not loaded"}
    
    return {
        "total_respondents": len(DATA),
        "avg_usage": round(DATA['Daily_Usage_Hours'].mean(), 1),
        "avg_checks": int(DATA['Phone_Checks_Per_Day'].mean()),
        "avg_addiction": round(DATA['Addiction_Level'].mean(), 1)
    }

@app.get("/chart-data")
def get_chart_data():
    if DATA is None:
        return {"error": "Data not loaded"}
    
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

@app.post("/predict")
def predict(input_data: NomophobiaInput):
    if MODEL is None:
        train_model()
    
    try:
        # Prepare data for prediction (matching feature names in order)
        input_df = pd.DataFrame([[
            input_data.age,
            input_data.dailyUsage,
            input_data.phoneChecks,
            input_data.screenTimeBed,
            input_data.anxiety,
            input_data.social
        ]], columns=FEATURES)
        
        prediction = MODEL.predict(input_df)[0]
        prediction = min(float(prediction), 10.0)
        
        return {
            "prediction_score": round(prediction, 1),
            "status": "success"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)