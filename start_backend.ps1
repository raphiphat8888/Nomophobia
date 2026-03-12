# ============================================
# Nomophobia Backend Starter Script
# รันด้วย: .\start_backend.ps1
# ============================================

Write-Host "🚀 Starting Nomophobia Backend..." -ForegroundColor Cyan

# Activate virtual environment
& "$PSScriptRoot\.venv\Scripts\activate.ps1"

# Move to backend directory
Set-Location "$PSScriptRoot\backend"

Write-Host "✅ Virtual environment activated" -ForegroundColor Green
Write-Host "📡 Starting FastAPI on http://localhost:8000" -ForegroundColor Yellow
Write-Host "📖 API Docs: http://localhost:8000/docs" -ForegroundColor Yellow
Write-Host "Press CTRL+C to stop" -ForegroundColor Red
Write-Host ""

# Run uvicorn
uvicorn app:app --host 0.0.0.0 --port 8000 --reload
