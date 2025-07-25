# This file will handle OpenAI GPT-4 (or Claude) configuration and integration 

import os
from dotenv import load_dotenv
import openai
from backend.prompts import CLASSIFY_UNKNOWN_INTENT, GENERATE_SCAFFOLD_PROMPT

load_dotenv()  # Loads .env file if present

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

def ask_openai(prompt=None, model="gpt-4", max_tokens=512, messages=None):
    if not OPENAI_API_KEY or OPENAI_API_KEY.strip() == "":
        # No key found, return mock response
        if prompt:
            return f"[MOCKED RESPONSE] This would be the AI's answer to: {prompt[:60]}..."
        elif messages:
            return f"[MOCKED RESPONSE] This would be the AI's answer to: {messages[-1]['content'][:60]}..."
        else:
            return "[MOCKED RESPONSE] No prompt or messages provided."
    try:
        client = openai.OpenAI(api_key=OPENAI_API_KEY)
        if messages:
            response = client.chat.completions.create(
                model=model,
                messages=messages,
                max_tokens=max_tokens,
                temperature=0.7,
            )
        else:
            response = client.chat.completions.create(
                model=model,
                messages=[{"role": "user", "content": prompt}],
                max_tokens=max_tokens,
                temperature=0.7,
            )
        return response.choices[0].message.content.strip()
    except Exception as e:
        return f"[MOCKED RESPONSE - Error: {str(e)}] This would be the AI's answer to: {prompt[:60]}..." 

def ask_openai_stream(prompt=None, model="gpt-4", max_tokens=512, messages=None):
    if not OPENAI_API_KEY or OPENAI_API_KEY.strip() == "":
        # No key found, yield a mock response
        yield "[MOCKED STREAMING RESPONSE]"
        return
    try:
        client = openai.OpenAI(api_key=OPENAI_API_KEY)
        if messages:
            response = client.chat.completions.create(
                model=model,
                messages=messages,
                max_tokens=max_tokens,
                temperature=0.7,
                stream=True,
            )
        else:
            response = client.chat.completions.create(
                model=model,
                messages=[{"role": "user", "content": prompt}],
                max_tokens=max_tokens,
                temperature=0.7,
                stream=True,
            )
        for chunk in response:
            if hasattr(chunk, 'choices') and chunk.choices:
                delta = chunk.choices[0].delta
                content = getattr(delta, 'content', None)
                if content:
                    print(f"[STREAM CHUNK] {content}", flush=True)
                    yield content
    except Exception as e:
        yield f"[MOCKED STREAMING ERROR: {str(e)}]"

def web_search_query(query):
    response = openai.chat.completions.create(
        model="gpt-4-1106-preview",  # or "gpt-4.1" if available
        messages=[{"role": "user", "content": query}],
        tools=[{"type": "web_search"}],  # or "web_search_preview" if that's the correct type
        tool_choice="auto"
    )
    return response.choices[0].message.content 

import json

ROUTER_PROMPT = """
You are an AI router in a workplace learning platform.
A user sends a free-form request. Your job is to determine which module should handle it.

Available modules:
- concepts: Generate 3 learning concepts
- microlesson: Generate a short learning module with quiz
- simulation: Create a scenario-based training simulation
- recommendation: Suggest what to learn next
- certification: Recommend and plan for official certification
- coach: Career advice and planning
- forecast: Skill prediction and development advice
- videolesson: Show a video-based lesson with quiz

Respond with:
{ \"module\": \"<module_name>\", \"reason\": \"<why this module is a good fit>\" }

User query:
\"{query}\"
"""

async def call_llm_router(query):
    # Use the classifier to get intent and confidence
    classification = classify_intent(query)
    confidence = classification.get('confidence', 'Low')
    module = classification.get('module_match')
    reason = classification.get('intent')
    if confidence == 'High' and module:
        return {"module": module, "reason": reason, "confidence": confidence}
    else:
        return {"module": None, "reason": reason, "confidence": confidence} 

def classify_intent(user_input: str) -> dict:
    """Classify a user's unknown request and return structured insight."""
    prompt = CLASSIFY_UNKNOWN_INTENT.format(user_input=user_input)
    try:
        response = ask_openai(prompt=prompt, model="gpt-4", max_tokens=512)
        import json
        return json.loads(response)
    except Exception as e:
        print("Classification error:", e)
        return {
            "intent": None,
            "module_match": None,
            "new_feature": None,
            "confidence": "Low",
            "follow_up_question": "Sorry, I didn’t quite understand that. Could you rephrase?"
        } 

def generate_scaffold(feature_name, feature_summary, scaffold_type="API Route"):
    from backend.prompts import SCAFFOLD_TYPE_PROMPT
    prompt = SCAFFOLD_TYPE_PROMPT.format(
        scaffold_type=scaffold_type,
        feature_name=feature_name,
        feature_summary=feature_summary
    )
    return ask_openai(prompt=prompt, model="gpt-4", max_tokens=800) 