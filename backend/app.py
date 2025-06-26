# FastAPI app skeleton for AI Workplace Learning
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.prompts import CONCEPT_PROMPT, MICROLESSON_PROMPT, SIMULATION_PROMPT, RECOMMENDATION_PROMPT
from backend.llm import ask_openai

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Or specify ["http://localhost:3000"] for more security
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"message": "AI Workplace Learning API is running."}

@app.get("/concepts")
def generate_concepts():
    """Generate AI-based workplace learning concepts."""
    result = ask_openai(CONCEPT_PROMPT)
    return {"concepts": result}

@app.get("/micro-lesson")
def generate_micro_lesson():
    """Generate a personalized micro-lesson."""
    result = ask_openai(MICROLESSON_PROMPT)
    return {"micro_lesson": result}

@app.get("/simulation")
def generate_simulation():
    """Generate a customer conversation simulation."""
    result = ask_openai(SIMULATION_PROMPT)
    return {"simulation": result}

@app.get("/recommendation")
def generate_recommendation():
    """Generate learning analysis and recommendations."""
    result = ask_openai(RECOMMENDATION_PROMPT)
    return {"recommendation": result} 