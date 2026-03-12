from fastapi import APIRouter, HTTPException
import pandas as pd
import os

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])

# Path to the dataset
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_PATH = os.path.join(BASE_DIR, "data", "teen_phone_New.csv")

def get_data():
    if os.path.exists(DATA_PATH):
        try:
            return pd.read_csv(DATA_PATH)
        except Exception as e:
            print(f"Error reading CSV: {e}")
            return None
    return None

@router.get("/stats")
async def get_dashboard_stats():
    df = get_data()
    if df is None:
        raise HTTPException(status_code=404, detail="Dataset not found in data/ folder")

    try:
        # 1. Summary Metrics
        total_users = len(df)
        avg_usage = float(df['Daily_Usage_Hours'].mean())
        avg_checks = float(df['Phone_Checks_Per_Day'].mean())
        avg_addiction = float(df['Addiction_Level'].mean())

        # 2. Gender Distribution (1: Male, 2: Female)
        gender_counts = df['Gender'].value_counts().to_dict()
        gender_labels = {1: "Male", 2: "Female"}
        gender_dist = {gender_labels.get(k, f"Other({k})"): int(v) for k, v in gender_counts.items()}

        # 3. Risk Level Distribution (Based on Addiction_Level score)
        # Assuming: 0-4=Normal, 4-7=Moderate, 7-10=Severe
        risk_dist = [
            {"label": "Normal", "value": int(len(df[df['Addiction_Level'] <= 4])), "color": "#10b981"},
            {"label": "Moderate", "value": int(len(df[(df['Addiction_Level'] > 4) & (df['Addiction_Level'] <= 7)])), "color": "#f59e0b"},
            {"label": "Severe", "value": int(len(df[df['Addiction_Level'] > 7])), "color": "#ef4444"}
        ]

        # 4. Usage Purposes Distribution
        purpose_counts = df['Phone_Usage_Purpose'].value_counts().sort_index().to_dict()
        purpose_labels = {
            0: "Social Media", 
            1: "Gaming", 
            2: "Education", 
            3: "Work", 
            4: "Entertainment"
        }
        usage_purposes = [
            {"label": purpose_labels.get(k, f"Other({k})"), "value": int(v)} 
            for k, v in purpose_counts.items()
        ]

        # 5. Age vs Usage Hours (Trend Data)
        age_usage_mean = df.groupby('Age')['Daily_Usage_Hours'].mean().sort_index()
        age_trend = [
            {"age": int(age), "avg_hours": round(float(usage), 1)} 
            for age, usage in age_usage_mean.items()
        ]

        # 6. Detailed Data Sample (Top 5 most severe cases)
        high_risk_sample = df.sort_values('Addiction_Level', ascending=False).head(5)
        high_risk_list = high_risk_sample[['Age', 'Gender', 'Daily_Usage_Hours', 'Addiction_Level']].to_dict('records')

        return {
            "total_respondents": total_users,
            "avg_usage": round(avg_usage, 1),
            "avg_checks": int(avg_checks),
            "avg_addiction": round(avg_addiction, 1),
            "gender_distribution": gender_dist,
            "risk_distribution": risk_dist,
            "usage_purposes": usage_purposes,
            "age_trend": age_trend,
            "high_risk_cases": high_risk_list
        }
    except Exception as e:
        print(f"Stats Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/chart-data")
async def get_chart_data():
    df = get_data()
    if df is None:
        return {"usage_chart": [], "anxiety_chart": []}
    
    try:
        # Create usage vs addiction correlation chart data
        usage_chart = df.groupby('Daily_Usage_Hours')['Addiction_Level'].mean().reset_index()
        usage_chart.columns = ['usage', 'addiction']
        usage_chart = usage_chart.sort_values('usage').to_dict('records')

        # Create anxiety vs addiction correlation chart data
        anxiety_chart = df.groupby('Anxiety_Level')['Addiction_Level'].mean().reset_index()
        anxiety_chart.columns = ['anxiety', 'addiction']
        anxiety_chart = anxiety_chart.sort_values('anxiety').to_dict('records')

        return {
            "usage_chart": usage_chart,
            "anxiety_chart": anxiety_chart
        }
    except Exception as e:
        print(f"Chart Data Error: {e}")
        return {"usage_chart": [], "anxiety_chart": []}
