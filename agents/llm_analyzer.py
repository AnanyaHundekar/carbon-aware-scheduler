import os
import json

from dotenv import load_dotenv
from google import genai

load_dotenv()

client = genai.Client(
    api_key=os.getenv("GEMINI_API_KEY"),
    http_options={
        "timeout": 30000
    }
)


def analyze_with_llm(user_request):

    prompt = f"""
Analyze this user request and break it into executable workflow tasks.

For every task determine:

- task_id
- description
- accuracy_required from 0 to 1
- latency_limit in minutes
- urgent
- can_defer

Also determine the workflow deadline in minutes.

Return ONLY valid JSON.

Use exactly this structure:

{{
    "tasks": [
        {{
            "task_id": 1,
            "description": "task description",
            "accuracy_required": 0.8,
            "latency_limit": 10,
            "urgent": false,
            "can_defer": true
        }}
    ],
    "workflow_deadline": 30
}}

User request:
{user_request}
"""

    try:

        print("Calling Gemini 3.5 Flash-Lite...")

        response = client.interactions.create(
            model="gemini-3.5-flash-lite",
            input=prompt,
            generation_config={
                "thinking_level": "minimal"
            }
        )

        text = response.output_text.strip()

        print("Gemini response received!")
        print("AI output:")
        print(text)

        # Handle accidental markdown code fences
        if text.startswith("```"):
            text = text.replace("```json", "")
            text = text.replace("```", "")
            text = text.strip()

        result = json.loads(text)

        print("Gemini analysis successful!")

        return result

    except Exception as e:

        print("Gemini unavailable. Using rule-based fallback.")
        print("Reason:", repr(e))

        return None