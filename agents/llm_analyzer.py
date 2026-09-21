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
- task: short task name
- description: detailed task description
- complexity: "low", "medium", or "high"
- accuracy_requirement: number from 0 to 1
- max_latency: maximum acceptable latency in minutes
- urgency: "high", "normal", or "low"
- can_defer: true or false

Also determine the workflow deadline in minutes.

Return ONLY valid JSON.

Use exactly this structure:

{{
    "tasks": [
        {{
            "task_id": 1,
            "task": "Analyze customer complaints",
            "description": "Analyze customer complaints",
            "complexity": "medium",
            "accuracy_requirement": 0.80,
            "max_latency": 5,
            "urgency": "high",
            "can_defer": false
        }}
    ],
    "workflow_deadline": 30
}}

Do not use these old field names:
- accuracy_required
- latency_limit
- urgent

Use only:
- accuracy_requirement
- max_latency
- urgency

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