# This file will handle OpenAI GPT-4 (or Claude) configuration and integration 

import os
from dotenv import load_dotenv
import openai

load_dotenv()  # Loads .env file if present

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

def ask_openai(prompt, model="gpt-4", max_tokens=512):
    if not OPENAI_API_KEY or OPENAI_API_KEY.strip() == "":
        # No key found, return mock response
        return f"[MOCKED RESPONSE] This would be the AI's answer to: {prompt[:60]}..."
    try:
        client = openai.OpenAI(api_key=OPENAI_API_KEY)
        response = client.chat.completions.create(
            model=model,
            messages=[{"role": "user", "content": prompt}],
            max_tokens=max_tokens,
            temperature=0.7,
        )
        return response.choices[0].message.content.strip()
    except Exception as e:
        # If the key is invalid or any error occurs, return a mock response
        return f"[MOCKED RESPONSE - Error: {str(e)}] This would be the AI's answer to: {prompt[:60]}..." 

def web_search_query(query):
    response = openai.chat.completions.create(
        model="gpt-4-1106-preview",  # or "gpt-4.1" if available
        messages=[{"role": "user", "content": query}],
        tools=[{"type": "web_search"}],  # or "web_search_preview" if that's the correct type
        tool_choice="auto"
    )
    return response.choices[0].message.content 