from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routes import analyze
import uvicorn
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(
    title="NLP + Image Credibility API",
    description="API service for credibility analysis, sentiment, and deepfake detection",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:8080", "http://localhost:3000", "http://localhost:5173", "http://localhost:8083"],  # Add your frontend URLs
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routes
app.include_router(analyze.router)

# Optional: For running via python main.py
if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
