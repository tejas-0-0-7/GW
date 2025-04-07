from fastapi import FastAPI
from app.routes import analyze
import uvicorn
from dotenv import load_dotenv

load_dotenv()


app = FastAPI(
    title="NLP + Image Credibility API",
    description="API service for credibility analysis, sentiment, and deepfake detection",
    version="1.0.0"
)

# Register routes
app.include_router(analyze.router)

# Optional: For running via python main.py
if __name__ == "__main__":
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
