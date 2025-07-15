# FastAPI app skeleton for AI Workplace Learning
from fastapi import FastAPI, Request, Body, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from backend.prompts import CONCEPT_PROMPT, MICROLESSON_PROMPT, SIMULATION_PROMPT, RECOMMENDATION_PROMPT, PROMPTS
from backend.llm import ask_openai, web_search_query
from typing import List
from fastapi.staticfiles import StaticFiles
import os
import datetime
from backend.db import lessons_collection, career_coach_sessions, skills_forecasts
from bson import ObjectId

import firebase_admin
from firebase_admin import credentials
from firebase_admin import auth as firebase_auth

cred = credentials.Certificate("serviceAccountKey.json")  # Path from root
firebase_admin.initialize_app(cred)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],  # Add both!
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

import os
from fastapi.staticfiles import StaticFiles

static_dir = os.path.join(os.path.dirname(__file__), "static")
app.mount("/static", StaticFiles(directory=static_dir), name="static")

from fastapi.responses import FileResponse

@app.get("/favicon.ico")
async def favicon():
    favicon_path = os.path.join("static", "favicon.ico")
    return FileResponse(favicon_path)

async def verify_token(request: Request):
    auth_header = request.headers.get("Authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Missing or invalid auth header")
    id_token = auth_header.split(" ")[1]
    try:
        decoded_token = firebase_auth.verify_id_token(id_token)
        return decoded_token
    except Exception:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")

class MicroLessonRequest(BaseModel):
    topic: str

class SimulationRequest(BaseModel):
    history: list  # List of dicts: [{"speaker": "Customer", "text": "...", "user_choice": "..."}]
    user_input: str  # The user's latest choice/response

class RecommendationRequest(BaseModel):
    skill_gap: str

class Turn(BaseModel):
    speaker: str
    text: str

class SimulationStepRequest(BaseModel):
    history: List[Turn]
    # ... other fields

@app.get("/")
def root():
    return {"message": "AI Workplace Learning API is running."}


@app.get("/concepts")
async def generate_concepts(user=Depends(verify_token)):
    """Generate AI-based workplace learning concepts."""
    result = ask_openai(CONCEPT_PROMPT)
    return {"concepts": result}

def generate_micro_lesson(topic: str) -> str:
    prompt = f"Write a concise, practical micro-lesson for the following workplace topic: {topic}"
    return ask_openai(prompt)

@app.post("/micro-lesson")
async def micro_lesson(request: Request, user=Depends(verify_token)):
    data = await request.json()
    topic = data.get("topic", "default topic")
    lesson_text = generate_micro_lesson(topic)
    # Save to MongoDB with user ID
    await lessons_collection.insert_one({
        "topic": topic, 
        "lesson": lesson_text,
        "user_id": user["uid"],  # Add user ID
        "user_email": user.get("email", ""),  # Optional: store email for reference
        "created_at": datetime.datetime.utcnow()  # Add timestamp
    })
    return {"lesson": lesson_text}

@app.get("/simulation")
async def generate_simulation(user=Depends(verify_token)):
    """Generate a customer conversation simulation."""
    result = ask_openai(SIMULATION_PROMPT)
    return {"simulation": result}

@app.post("/recommendation")
async def generate_recommendation(request: RecommendationRequest, user=Depends(verify_token)):
    prompt = RECOMMENDATION_PROMPT.replace("{skill_gap}", request.skill_gap)
    result = ask_openai(prompt)
    return {"recommendation": result}

@app.post("/simulation-step")
async def simulation_step(request: SimulationRequest, user=Depends(verify_token)):
    # Build conversation history as text
    history_text = ""
    for turn in request.history:
        if not isinstance(turn, dict) or 'speaker' not in turn or 'text' not in turn:
            print("Malformed turn in history:", turn)
            continue  # or raise an error, or handle as needed
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
    print("LLM raw response:", result)
    # Try to parse the LLM's response as JSON
    import json
    try:
        parsed = json.loads(result)
    except Exception:
        # If parsing fails, return the raw result for debugging
        parsed = {"customerText": "Sorry, could not parse AI response.", "choices": []}
    return parsed 

@app.post("/web-search")
async def web_search(request: Request):
    data = await request.json()
    query = data.get("query")
    if not query:
        return {"error": "No query provided"}
    result = web_search_query(query)
    return {"result": result} 

@app.get("/lessons")
async def get_lessons(user=Depends(verify_token)):
    lessons = []
    async for lesson in lessons_collection.find({"user_id": user["uid"]}):
        lesson["_id"] = str(lesson["_id"])
        lessons.append(lesson)
    return {"lessons": lessons} 

@app.delete("/lessons/{lesson_id}")
async def delete_lesson(lesson_id: str, user=Depends(verify_token)):
    # Only delete lessons owned by the authenticated user
    result = await lessons_collection.delete_one({
        "_id": ObjectId(lesson_id),
        "user_id": user["uid"]  # Ensure user owns this lesson
    })
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Lesson not found")
    return {"success": True}

@app.put("/lessons/{lesson_id}")
async def update_lesson(lesson_id: str, data: dict = Body(...), user=Depends(verify_token)):
    # Only update lessons owned by the authenticated user
    result = await lessons_collection.update_one(
        {
            "_id": ObjectId(lesson_id),
            "user_id": user["uid"]  # Ensure user owns this lesson
        },
        {"$set": {"topic": data.get("topic"), "lesson": data.get("lesson")}}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Lesson not found")
    return {"success": True} 

@app.post("/career-coach")
async def career_coach(request: Request, user=Depends(verify_token)):
    data = await request.json()
    history = data.get("history", [])
    # If no history, start with the system prompt
    if not history:
        messages = [{"role": "system", "content": PROMPTS["career_coach"]}]
    else:
        messages = history
    result = ask_openai(messages=messages)
    
    # Optionally save the session for the user
    try:
        await career_coach_sessions.insert_one({
            "user_id": user["uid"],
            "user_email": user.get("email", ""),
            "history": history,
            "response": result,
            "created_at": datetime.datetime.utcnow()
        })
    except Exception as e:
        print(f"Failed to save career coach session: {e}")
    
    return {"response": result} 

@app.post("/skills-forecast")
async def skills_forecast(request: Request, user=Depends(verify_token)):
    data = await request.json()
    history = data.get("history", "")
    keywords = data.get("keywords", "")
    context = f"User history:\n{history}\n\nTranscript keywords:\n{keywords}\n\n"
    prompt = PROMPTS["skills_forecast"] + "\n" + context
    result = ask_openai(prompt)
    
    # Optionally save the forecast for the user
    try:
        await skills_forecasts.insert_one({
            "user_id": user["uid"],
            "user_email": user.get("email", ""),
            "history": history,
            "keywords": keywords,
            "forecast": result,
            "created_at": datetime.datetime.utcnow()
        })
    except Exception as e:
        print(f"Failed to save skills forecast: {e}")
    
    return {"forecast": result}

@app.get("/user/career-sessions")
async def get_career_sessions(user=Depends(verify_token)):
    """Get user's career coach sessions."""
    sessions = []
    async for session in career_coach_sessions.find({"user_id": user["uid"]}).sort("created_at", -1):
        session["_id"] = str(session["_id"])
        sessions.append(session)
    return {"sessions": sessions}

@app.get("/user/skills-forecasts")
async def get_skills_forecasts(user=Depends(verify_token)):
    """Get user's skills forecasts."""
    forecasts = []
    async for forecast in skills_forecasts.find({"user_id": user["uid"]}).sort("created_at", -1):
        forecast["_id"] = str(forecast["_id"])
        forecasts.append(forecast)
    return {"forecasts": forecasts} 