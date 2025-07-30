# FastAPI app skeleton for AI Workplace Learning
from fastapi import FastAPI, Request, Body, HTTPException, Depends, status, UploadFile, Form, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, FileResponse
from pydantic import BaseModel
from pathlib import Path
import json
import os
from datetime import datetime
import uuid
from typing import List, Optional, Dict, Any
from backend.prompts import CONCEPT_PROMPT, MICROLESSON_PROMPT, SIMULATION_PROMPT, RECOMMENDATION_PROMPT, PROMPTS, CERTIFICATION_RECOMMENDATION_PROMPT, CERTIFICATION_STUDY_PLAN_PROMPT, CERTIFICATION_SIMULATION_PROMPT, CERTIFICATION_CAREER_COACH_PROMPT, video_quiz_prompt, video_summary_prompt
from backend.llm import ask_openai, web_search_query, classify_intent, generate_scaffold
from backend.db import lessons_collection, career_coach_sessions, skills_forecasts, teams_collection, team_members_collection, team_analytics_collection, certifications_collection, study_plans_collection, certification_simulations_collection, unknown_intents_collection, scaffold_history_collection
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
from fastapi.responses import StreamingResponse
from backend.llm import ask_openai_stream

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

# Team Management Models
class TeamMember(BaseModel):
    name: str
    role: str
    email: str
    skills: List[str]
    performance_score: Optional[float] = None

class TeamCreateRequest(BaseModel):
    name: str
    description: str
    members: List[TeamMember]

class TeamUpdateRequest(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None

class TeamMemberUpdateRequest(BaseModel):
    name: Optional[str] = None
    role: Optional[str] = None
    skills: Optional[List[str]] = None
    performance_score: Optional[float] = None

class TeamAnalyticsRequest(BaseModel):
    team_id: str
    metrics: List[str]  # e.g., ["collaboration", "productivity", "communication"]

# Certification Models
class CertificationProfile(BaseModel):
    role: str
    skills: List[str]
    goals: str
    experience_level: str

class CertificationStudyPlan(BaseModel):
    certification_name: str
    current_skills: List[str]
    study_time: int  # hours per week
    target_date: str

class CertificationSimulation(BaseModel):
    certification_name: str
    user_responses: List[str] = []

class LLMStreamRequest(BaseModel):
    prompt: str = None
    messages: list = None
    model: str = "gpt-4"
    max_tokens: int = 512

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
    lesson_text = data.get("lesson")
    if not lesson_text:
        lesson_text = generate_micro_lesson(topic)
    # Save to MongoDB with user ID
    await lessons_collection.insert_one({
        "topic": topic,
        "lesson": lesson_text,
        "user_id": user["uid"],
        "user_email": user.get("email", ""),
        "created_at": datetime.utcnow()
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
            "created_at": datetime.utcnow()
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
            "created_at": datetime.utcnow()
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

# Team Management Endpoints
@app.post("/teams")
async def create_team(request: TeamCreateRequest, user=Depends(verify_token)):
    """Create a new team."""
    team_data = {
        "name": request.name,
        "description": request.description,
        "created_by": user["uid"],
        "created_by_email": user.get("email", ""),
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow()
    }
    
    # Insert team
    team_result = await teams_collection.insert_one(team_data)
    team_id = str(team_result.inserted_id)
    
    # Insert team members
    member_docs = []
    for member in request.members:
        member_doc = {
            "team_id": team_id,
            "name": member.name,
            "role": member.role,
            "email": member.email,
            "skills": member.skills,
            "performance_score": member.performance_score,
            "created_at": datetime.utcnow()
        }
        member_docs.append(member_doc)
    
    if member_docs:
        await team_members_collection.insert_many(member_docs)
    
    return {"team_id": team_id, "message": "Team created successfully"}

@app.get("/teams")
async def get_teams(user=Depends(verify_token)):
    """Get all teams created by the user."""
    teams = []
    async for team in teams_collection.find({"created_by": user["uid"]}):
        team["_id"] = str(team["_id"])
        # Get member count for each team
        member_count = await team_members_collection.count_documents({"team_id": team["_id"]})
        team["member_count"] = member_count
        teams.append(team)
    return {"teams": teams}

@app.get("/teams/{team_id}")
async def get_team(team_id: str, user=Depends(verify_token)):
    """Get specific team details with members."""
    # Verify team ownership
    team = await teams_collection.find_one({
        "_id": ObjectId(team_id),
        "created_by": user["uid"]
    })
    
    if not team:
        raise HTTPException(status_code=404, detail="Team not found")
    
    team["_id"] = str(team["_id"])
    
    # Get team members
    members = []
    async for member in team_members_collection.find({"team_id": team_id}):
        member["_id"] = str(member["_id"])
        members.append(member)
    
    team["members"] = members
    return {"team": team}

@app.put("/teams/{team_id}")
async def update_team(team_id: str, request: TeamUpdateRequest, user=Depends(verify_token)):
    """Update team details."""
    # Verify team ownership
    team = await teams_collection.find_one({
        "_id": ObjectId(team_id),
        "created_by": user["uid"]
    })
    
    if not team:
        raise HTTPException(status_code=404, detail="Team not found")
    
    # Prepare update data
    update_data = {"updated_at": datetime.utcnow()}
    if request.name is not None:
        update_data["name"] = request.name
    if request.description is not None:
        update_data["description"] = request.description
    
    await teams_collection.update_one(
        {"_id": ObjectId(team_id)},
        {"$set": update_data}
    )
    
    return {"message": "Team updated successfully"}

@app.delete("/teams/{team_id}")
async def delete_team(team_id: str, user=Depends(verify_token)):
    """Delete a team and all its members."""
    # Verify team ownership
    team = await teams_collection.find_one({
        "_id": ObjectId(team_id),
        "created_by": user["uid"]
    })
    
    if not team:
        raise HTTPException(status_code=404, detail="Team not found")
    
    # Delete team members first
    await team_members_collection.delete_many({"team_id": team_id})
    
    # Delete team
    await teams_collection.delete_one({"_id": ObjectId(team_id)})
    
    return {"message": "Team deleted successfully"}

@app.post("/teams/{team_id}/members")
async def add_team_member(team_id: str, member: TeamMember, user=Depends(verify_token)):
    """Add a new member to a team."""
    # Verify team ownership
    team = await teams_collection.find_one({
        "_id": ObjectId(team_id),
        "created_by": user["uid"]
    })
    
    if not team:
        raise HTTPException(status_code=404, detail="Team not found")
    
    member_doc = {
        "team_id": team_id,
        "name": member.name,
        "role": member.role,
        "email": member.email,
        "skills": member.skills,
        "performance_score": member.performance_score,
        "created_at": datetime.utcnow()
    }
    
    result = await team_members_collection.insert_one(member_doc)
    member_doc["_id"] = str(result.inserted_id)
    
    return {"member": member_doc, "message": "Member added successfully"}

@app.put("/teams/{team_id}/members/{member_id}")
async def update_team_member(
    team_id: str, 
    member_id: str, 
    request: TeamMemberUpdateRequest, 
    user=Depends(verify_token)
):
    """Update a team member's details."""
    # Verify team ownership
    team = await teams_collection.find_one({
        "_id": ObjectId(team_id),
        "created_by": user["uid"]
    })
    
    if not team:
        raise HTTPException(status_code=404, detail="Team not found")
    
    # Prepare update data
    update_data = {}
    if request.name is not None:
        update_data["name"] = request.name
    if request.role is not None:
        update_data["role"] = request.role
    if request.skills is not None:
        update_data["skills"] = request.skills
    if request.performance_score is not None:
        update_data["performance_score"] = request.performance_score
    
    if not update_data:
        raise HTTPException(status_code=400, detail="No fields to update")
    
    result = await team_members_collection.update_one(
        {"_id": ObjectId(member_id), "team_id": team_id},
        {"$set": update_data}
    )
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Member not found")
    
    return {"message": "Member updated successfully"}

@app.delete("/teams/{team_id}/members/{member_id}")
async def remove_team_member(team_id: str, member_id: str, user=Depends(verify_token)):
    """Remove a member from a team."""
    # Verify team ownership
    team = await teams_collection.find_one({
        "_id": ObjectId(team_id),
        "created_by": user["uid"]
    })
    
    if not team:
        raise HTTPException(status_code=404, detail="Team not found")
    
    result = await team_members_collection.delete_one({
        "_id": ObjectId(member_id),
        "team_id": team_id
    })
    
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Member not found")
    
    return {"message": "Member removed successfully"}

@app.post("/teams/{team_id}/analytics")
async def generate_team_analytics(team_id: str, request: TeamAnalyticsRequest, user=Depends(verify_token)):
    """Generate AI-powered team analytics."""
    # Verify team ownership
    team = await teams_collection.find_one({
        "_id": ObjectId(team_id),
        "created_by": user["uid"]
    })
    
    if not team:
        raise HTTPException(status_code=404, detail="Team not found")
    
    # Get team members
    members = []
    async for member in team_members_collection.find({"team_id": team_id}):
        members.append(member)
    
    # Prepare data for AI analysis
    team_data = {
        "team_name": team["name"],
        "team_description": team["description"],
        "members": members,
        "metrics": request.metrics
    }
    
    # Generate AI analysis
    analysis_prompt = f"""
    Analyze the following team data and provide insights on the requested metrics:
    
    Team: {team_data['team_name']}
    Description: {team_data['team_description']}
    
    Team Members:
    {chr(10).join([f"- {m['name']} ({m['role']}): Skills: {', '.join(m['skills'])}" for m in members])}
    
    Requested Metrics: {', '.join(request.metrics)}
    
    Please provide:
    1. Overall team assessment
    2. Individual member analysis
    3. Recommendations for improvement
    4. Collaboration insights
    """
    
    analysis_result = ask_openai(analysis_prompt)
    
    # Save analytics
    analytics_doc = {
        "team_id": team_id,
        "user_id": user["uid"],
        "metrics": request.metrics,
        "analysis": analysis_result,
        "created_at": datetime.utcnow()
    }
    
    await team_analytics_collection.insert_one(analytics_doc)
    
    return {"analysis": analysis_result}

@app.get("/teams/{team_id}/analytics")
async def get_team_analytics(team_id: str, user=Depends(verify_token)):
    """Get historical analytics for a team."""
    # Verify team ownership
    team = await teams_collection.find_one({
        "_id": ObjectId(team_id),
        "created_by": user["uid"]
    })
    
    if not team:
        raise HTTPException(status_code=404, detail="Team not found")
    
    analytics = []
    async for analysis in team_analytics_collection.find({"team_id": team_id}).sort("created_at", -1):
        analysis["_id"] = str(analysis["_id"])
        analytics.append(analysis)
    
    return {"analytics": analytics}

# Certification Endpoints
@app.post("/certifications/save-profile")
async def save_user_profile(request: CertificationProfile, user=Depends(verify_token)):
    """Save user profile for auto-fill functionality."""
    try:
        print(f"Saving profile for user {user['uid']}: {request.dict()}")
        
        # Save or update user profile
        result = await certifications_collection.update_one(
            {"user_id": user["uid"], "type": "profile"},
            {
                "$set": {
                    "user_id": user["uid"],
                    "user_email": user.get("email", ""),
                    "type": "profile",
                    "profile": request.dict(),
                    "updated_at": datetime.utcnow()
                }
            },
            upsert=True
        )
        
        print(f"Profile save result: {result.modified_count} modified, {result.upserted_id} upserted")
        return {"message": "Profile saved successfully"}
    except Exception as e:
        print(f"Failed to save user profile: {e}")
        raise HTTPException(status_code=500, detail="Failed to save profile")

@app.get("/certifications/user-profile")
async def get_user_profile(user=Depends(verify_token)):
    """Get user's latest profile for auto-fill."""
    try:
        print(f"Getting profile for user {user['uid']}")
        
        profile_doc = await certifications_collection.find_one({
            "user_id": user["uid"],
            "type": "profile"
        })
        
        print(f"Found profile doc: {profile_doc}")
        
        if profile_doc and profile_doc.get("profile"):
            return {"profile": profile_doc["profile"]}
        return {"profile": None}
    except Exception as e:
        print(f"Failed to get user profile: {e}")
        return {"profile": None}

@app.post("/certifications/recommend")
async def recommend_certifications(request: CertificationProfile, user=Depends(verify_token)):
    """Generate AI-powered certification recommendations based on user profile."""
    prompt = CERTIFICATION_RECOMMENDATION_PROMPT.format(
        role=request.role,
        skills=", ".join(request.skills),
        goals=request.goals,
        experience_level=request.experience_level
    )
    
    result = ask_openai(prompt)
    
    # Save recommendation for user
    try:
        await certifications_collection.insert_one({
            "user_id": user["uid"],
            "user_email": user.get("email", ""),
            "profile": request.dict(),
            "recommendation": result,
            "created_at": datetime.utcnow()
        })
    except Exception as e:
        print(f"Failed to save certification recommendation: {e}")
    
    return {"recommendation": result}

@app.post("/certifications/study-plan")
async def generate_study_plan(request: CertificationStudyPlan, user=Depends(verify_token)):
    """Generate a personalized study plan for a specific certification."""
    prompt = CERTIFICATION_STUDY_PLAN_PROMPT.format(
        certification_name=request.certification_name,
        current_skills=", ".join(request.current_skills),
        study_time=request.study_time,
        target_date=request.target_date
    )
    
    result = ask_openai(prompt)
    
    # Save study plan for user
    try:
        await study_plans_collection.insert_one({
            "user_id": user["uid"],
            "user_email": user.get("email", ""),
            "certification_name": request.certification_name,
            "study_plan": result,
            "created_at": datetime.utcnow()
        })
    except Exception as e:
        print(f"Failed to save study plan: {e}")
    
    return {"study_plan": result}

@app.post("/certifications/simulate")
async def certification_simulation(request: CertificationSimulation, user=Depends(verify_token)):
    """Generate certification interview simulation."""
    prompt = CERTIFICATION_SIMULATION_PROMPT.format(
        certification_name=request.certification_name
    )
    
    result = ask_openai(prompt)
    
    # Save simulation for user
    try:
        await certification_simulations_collection.insert_one({
            "user_id": user["uid"],
            "user_email": user.get("email", ""),
            "certification_name": request.certification_name,
            "simulation": result,
            "created_at": datetime.utcnow()
        })
    except Exception as e:
        print(f"Failed to save certification simulation: {e}")
    
    return {"simulation": result}

@app.get("/certifications/user-recommendations")
async def get_user_certifications(user=Depends(verify_token)):
    """Get user's certification recommendations and study plans."""
    recommendations = []
    async for rec in certifications_collection.find({"user_id": user["uid"]}).sort("created_at", -1):
        rec["_id"] = str(rec["_id"])
        recommendations.append(rec)
    
    study_plans = []
    async for plan in study_plans_collection.find({"user_id": user["uid"]}).sort("created_at", -1):
        plan["_id"] = str(plan["_id"])
        study_plans.append(plan)
    
    simulations = []
    async for sim in certification_simulations_collection.find({"user_id": user["uid"]}).sort("created_at", -1):
        sim["_id"] = str(sim["_id"])
        simulations.append(sim)
    
    return {
        "recommendations": recommendations,
        "study_plans": study_plans,
        "simulations": simulations
    } 

from backend.llm import call_llm_router

class RouteRequest(BaseModel):
    prompt: str

@app.post("/route")
async def route_prompt(request: RouteRequest):
    result = await call_llm_router(request.prompt)
    return result 

@app.post("/llm-stream")
async def llm_stream(request: LLMStreamRequest):
    print(f"[LLM STREAM] New request: {request}", flush=True)
    def event_stream():
        for chunk in ask_openai_stream(
            prompt=request.prompt,
            model=request.model,
            max_tokens=request.max_tokens,
            messages=request.messages
        ):
            print(f"[LLM STREAM] Sending chunk: {chunk}", flush=True)
            yield chunk
    return StreamingResponse(event_stream(), media_type="text/plain")

@app.post("/video-quiz")
async def video_quiz(request: Request):
    try:
        data = await request.json()
        summary = data.get("summary", "")
        if not summary:
            return {"error": "Summary is required"}
        
        prompt = video_quiz_prompt.format(summary=summary)
        result = ask_openai(prompt)
        
        try:
            questions = json.loads(result)
            if not isinstance(questions, list):
                questions = [{"question": "Failed to parse quiz", "options": [], "answer": "", "explanation": ""}]
        except json.JSONDecodeError:
            questions = [{"question": "Failed to parse quiz", "options": [], "answer": "", "explanation": ""}]
        
        return {"quiz": questions}
    except Exception as e:
        print(f"Video quiz error: {e}")
        return {"error": "Failed to generate quiz", "quiz": []} 

@app.post("/video-summary")
async def video_summary(request: Request):
    data = await request.json()
    transcript = data.get("transcript", "")
    prompt = video_summary_prompt.format(transcript=transcript)
    summary = ask_openai(prompt)
    return {"summary": summary} 

class IntentInput(BaseModel):
    query: str

@app.post("/classify-intent")
async def handle_intent(input_data: IntentInput):
    result = classify_intent(input_data.query)
    # Log to database
    await unknown_intents_collection.insert_one({
        "user_input": input_data.query,
        "classification": result,
        "created_at": datetime.utcnow()
    })
    return result 

@app.get("/admin/unknown-intents")
async def get_unknown_intents():
    ideas = []
    async for idea in unknown_intents_collection.find().sort("created_at", -1):
        idea["_id"] = str(idea["_id"])
        ideas.append(idea)
    return {"ideas": ideas} 

@app.post("/admin/unknown-intents/{idea_id}/upvote")
async def upvote_idea(idea_id: str):
    result = await unknown_intents_collection.update_one(
        {"_id": ObjectId(idea_id)},
        {"$inc": {"upvotes": 1}}
    )
    return {"success": result.modified_count == 1}

@app.post("/admin/unknown-intents/{idea_id}/subscribe")
async def subscribe_idea(idea_id: str, data: dict = Body(...)):
    email = data.get("email")
    if not email:
        return {"success": False, "error": "Email required"}
    result = await unknown_intents_collection.update_one(
        {"_id": ObjectId(idea_id)},
        {"$addToSet": {"subscribers": email}}
    )
    return {"success": result.modified_count == 1}

@app.post("/admin/unknown-intents/{idea_id}/status")
async def update_idea_status(idea_id: str, data: dict = Body(...)):
    status_val = data.get("status")
    if not status_val:
        return {"success": False, "error": "Status required"}
    result = await unknown_intents_collection.update_one(
        {"_id": ObjectId(idea_id)},
        {"$set": {"status": status_val}}
    )
    return {"success": result.modified_count == 1} 

@app.delete("/admin/unknown-intents/{idea_id}")
async def delete_unknown_intent(idea_id: str):
    result = await unknown_intents_collection.delete_one({"_id": ObjectId(idea_id)})
    return {"success": result.deleted_count == 1}

class ScaffoldRequest(BaseModel):
    feature_name: str
    feature_summary: str
    scaffold_type: str = "API Route"

@app.post("/generate-scaffold")
async def generate_scaffold_endpoint(req: ScaffoldRequest, user: Optional[str] = None):
    code = generate_scaffold(req.feature_name, req.feature_summary, req.scaffold_type)
    # Save scaffold history
    await scaffold_history_collection.insert_one({
        "idea": req.feature_name,
        "feature_summary": req.feature_summary,
        "scaffold_type": req.scaffold_type,
        "code": code,
        "created_at": datetime.utcnow(),
        "user": user or "anonymous"
    })
    return {"code": code} 

@app.get("/scaffold-history/{idea}")
async def get_scaffold_history(idea: str):
    history = []
    async for entry in scaffold_history_collection.find({"idea": idea}).sort("created_at", -1):
        entry["_id"] = str(entry["_id"])
        history.append(entry)
    return {"history": history} 

@app.patch("/scaffold-history/{scaffold_id}/approve")
async def approve_scaffold(scaffold_id: str, data: dict = Body(...)):
    admin_comment = data.get("admin_comment", "")
    approved_by = data.get("approved_by", "admin")
    result = await scaffold_history_collection.update_one(
        {"_id": ObjectId(scaffold_id)},
        {"$set": {
            "approved": True,
            "admin_comment": admin_comment,
            "approved_at": datetime.utcnow(),
            "approved_by": approved_by
        }}
    )
    return {"success": result.modified_count == 1} 

# Import voice cloning
from voice_cloning import voice_cloning_manager

# Voice Cloning Endpoints
@app.post("/voice-cloning/upload-sample")
async def upload_voice_sample(
    file: UploadFile = File(...),
    user_id: str = Form(...)
):
    """Upload voice sample for training"""
    try:
        # Read audio file
        audio_data = await file.read()
        
        # Save voice sample
        result = await voice_cloning_manager.save_voice_sample(
            user_id=user_id,
            audio_data=audio_data,
            filename=file.filename
        )
        
        if result["success"]:
            return {
                "success": True,
                "message": "Voice sample uploaded successfully",
                "audio_path": result["audio_path"]
            }
        else:
            return JSONResponse(
                status_code=400,
                content={"success": False, "error": result["error"]}
            )
            
    except Exception as e:
        return JSONResponse(
            status_code=500,
            content={"success": False, "error": str(e)}
        )

@app.post("/voice-cloning/train")
async def train_voice_model(
    user_id: str = Form(...),
    audio_path: str = Form(...)
):
    """Train voice model for user"""
    try:
        result = await voice_cloning_manager.train_voice_model(
            user_id=user_id,
            audio_path=audio_path
        )
        
        if result["success"]:
            return {
                "success": True,
                "message": "Voice training started",
                "training_id": result["training_id"]
            }
        else:
            return JSONResponse(
                status_code=400,
                content={"success": False, "error": result["error"]}
            )
            
    except Exception as e:
        return JSONResponse(
            status_code=500,
            content={"success": False, "error": str(e)}
        )

@app.get("/voice-cloning/training-status/{training_id}")
async def get_training_status(training_id: str):
    """Get voice training status"""
    try:
        status = await voice_cloning_manager.get_training_status(training_id)
        return {"success": True, "status": status}
    except Exception as e:
        return JSONResponse(
            status_code=500,
            content={"success": False, "error": str(e)}
        )

@app.post("/voice-cloning/synthesize")
async def synthesize_speech(
    user_id: str = Form(...),
    text: str = Form(...),
    language: str = Form(default="en")
):
    """Synthesize speech using trained voice"""
    try:
        result = await voice_cloning_manager.synthesize_speech(
            user_id=user_id,
            text=text,
            language=language
        )
        
        if result["success"]:
            # Return audio file
            audio_path = Path(result["audio_path"])
            if audio_path.exists():
                return FileResponse(
                    path=str(audio_path),
                    media_type="audio/wav",
                    filename=result["filename"]
                )
            else:
                return JSONResponse(
                    status_code=404,
                    content={"success": False, "error": "Generated audio not found"}
                )
        else:
            return JSONResponse(
                status_code=400,
                content={"success": False, "error": result["error"]}
            )
            
    except Exception as e:
        return JSONResponse(
            status_code=500,
            content={"success": False, "error": str(e)}
        )

@app.get("/voice-cloning/user-models/{user_id}")
async def get_user_voice_models(user_id: str):
    """Get all voice models for a user"""
    try:
        result = await voice_cloning_manager.get_user_voice_models(user_id)
        return {"success": True, "voice_models": result.get("voice_models", [])}
    except Exception as e:
        return JSONResponse(
            status_code=500,
            content={"success": False, "error": str(e)}
        )

@app.delete("/voice-cloning/user-models/{user_id}")
async def delete_voice_model(user_id: str):
    """Delete user's voice model"""
    try:
        result = await voice_cloning_manager.delete_voice_model(user_id)
        return {"success": True, "message": result.get("message", "Voice model deleted")}
    except Exception as e:
        return JSONResponse(
            status_code=500,
            content={"success": False, "error": str(e)}
        ) 