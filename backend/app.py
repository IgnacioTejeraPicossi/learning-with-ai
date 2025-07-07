# FastAPI app skeleton for AI Workplace Learning
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
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

class MicroLessonRequest(BaseModel):
    topic: str

class SimulationRequest(BaseModel):
    history: list  # List of dicts: [{"speaker": "Customer", "text": "...", "user_choice": "..."}]
    user_input: str  # The user's latest choice/response

@app.get("/")
def root():
    return {"message": "AI Workplace Learning API is running."}

@app.get("/concepts")
def generate_concepts():
    """Generate AI-based workplace learning concepts."""
    result = ask_openai(CONCEPT_PROMPT)
    return {"concepts": result}

@app.post("/micro-lesson")
async def generate_micro_lesson(request: MicroLessonRequest):
    prompt = MICROLESSON_PROMPT.replace("{topic}", request.topic)
    result = ask_openai(prompt)
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

@app.post("/simulation-step")
async def simulation_step(request: SimulationRequest):
    # Build conversation history as text
    history_text = ""
    for turn in request.history:
        history_text += f"{turn['speaker']}: {turn['text']}\n"
        if 'user_choice' in turn:
            history_text += f"Employee: {turn['user_choice']}\n"
    prompt = (
        f"{SIMULATION_PROMPT}\n"
        f"Conversation so far:\n{history_text}\n"
        f"Employee's next response: {request.user_input}\n"
        "Continue the scenario."
    )
    result = ask_openai(prompt)
    # Try to parse the LLM's response as JSON
    import json
    try:
        parsed = json.loads(result)
    except Exception:
        # If parsing fails, return the raw result for debugging
        parsed = {"customerText": "Sorry, could not parse AI response.", "choices": []}
    return parsed 