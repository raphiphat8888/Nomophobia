from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import os

# Import routes
from routes import prediction, dashboard

app = FastAPI(title="Nomophobia Analysis System", description="Nomophobia analysis and prediction API")

# Enable CORS (Cross-Origin Resource Sharing)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, specify your React URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routes
app.include_router(prediction.router)
app.include_router(dashboard.router)

@app.get("/")
def home():
    return {
        "status": "online", 
        "system": "Nomophobia Analysis API",
        "documentation": "/docs"
    }

if __name__ == "__main__":
    # Ensure this script runs from the backend root
    uvicorn.run("app:app", host="127.0.0.1", port=8000, reload=True)