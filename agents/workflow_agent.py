import os
import json
from dotenv import load_dotenv
from google import genai
from google.genai import types


load_dotenv()


# ---------------------------------------------------------
# Gemini setup
# ---------------------------------------------------------

API_KEY = os.getenv("GEMINI_API_KEY")

if not API_KEY:
    raise ValueError(
        "GEMINI_API_KEY not found in .env file."
    )

client = genai.Client(
    api_key=API_KEY
)

MODEL_NAME = "gemini-3.5-flash-lite"


# ---------------------------------------------------------
# Rule-based fallback
# ---------------------------------------------------------

def fallback_workflow(user_request):

    request = user_request.lower()

    tasks = []

    if "analy" in request:
        tasks.append({
            "task": "Analyze input",
            "description": "Analyze the provided input.",
            "complexity": "medium",
            "accuracy_requirement": 0.90,
            "max_latency": 5.0,
            "urgency": "normal",
            "can_defer": True
        })

    if "verif" in request or "check" in request:
        tasks.append({
            "task": "Verify results",
            "description": "Verify the generated results.",
            "complexity": "high",
            "accuracy_requirement": 0.95,
            "max_latency": 5.0,
            "urgency": "normal",
            "can_defer": True
        })

    if "summar" in request:
        tasks.append({
            "task": "Summarize findings",
            "description": "Summarize the findings clearly.",
            "complexity": "medium",
            "accuracy_requirement": 0.90,
            "max_latency": 5.0,
            "urgency": "normal",
            "can_defer": True
        })

    if not tasks:
        tasks.append({
            "task": "Process request",
            "description": user_request,
            "complexity": "medium",
            "accuracy_requirement": 0.90,
            "max_latency": 5.0,
            "urgency": "normal",
            "can_defer": True
        })

    return {
        "workflow": user_request,
        "tasks": tasks
    }


# ---------------------------------------------------------
# Normalize task fields
# ---------------------------------------------------------

def normalize_task(task):

    normalized = task.copy()

    # Old field → new field
    if (
        "accuracy_requirement" not in normalized
        and "accuracy_required" in normalized
    ):
        normalized["accuracy_requirement"] = (
            normalized["accuracy_required"]
        )

    if (
        "max_latency" not in normalized
        and "latency_limit" in normalized
    ):
        normalized["max_latency"] = (
            normalized["latency_limit"]
        )

    if (
        "urgency" not in normalized
        and "urgent" in normalized
    ):
        normalized["urgency"] = (
            "high"
            if normalized["urgent"]
            else "normal"
        )

    # Defaults
    normalized.setdefault(
        "task",
        normalized.get(
            "description",
            "Process task"
        )
    )

    normalized.setdefault(
        "description",
        normalized["task"]
    )

    normalized.setdefault(
        "complexity",
        "medium"
    )

    normalized.setdefault(
        "accuracy_requirement",
        0.90
    )

    normalized.setdefault(
        "max_latency",
        5.0
    )

    normalized.setdefault(
        "urgency",
        "normal"
    )

    normalized.setdefault(
        "can_defer",
        True
    )

    return normalized


# ---------------------------------------------------------
# Analyze workflow using Gemini
# ---------------------------------------------------------

def analyze_workflow(user_request):

    prompt = f"""
You are an AI workflow analyzer for a carbon-aware
agentic workflow scheduler.

Analyze the user's request and break it into logical
execution tasks.

User request:
{user_request}

Return ONLY valid JSON.

Required format:

{{
    "workflow": "{user_request}",
    "tasks": [
        {{
            "task": "short task name",
            "description": "what the task does",
            "complexity": "low|medium|high",
            "accuracy_requirement": 0.90,
            "max_latency": 5.0,
            "urgency": "low|normal|high",
            "can_defer": true
        }}
    ]
}}

Rules:

1. Break the request into meaningful tasks.
2. Use the exact field names shown above.
3. accuracy_requirement must be between 0 and 1.
4. max_latency must be a number in seconds.
5. urgency must be low, normal, or high.
6. can_defer must be true or false.
7. Return JSON only.
"""

    try:

        response = client.models.generate_content(
            model=MODEL_NAME,
            contents=prompt,
            config=types.GenerateContentConfig(
                automatic_function_calling=(
                    types.AutomaticFunctionCallingConfig(
                        disable=True
                    )
                )
            )
        )

        text = response.text.strip()

        # Remove markdown JSON fences
        if text.startswith("```"):
            text = text.replace(
                "```json",
                ""
            ).replace(
                "```",
                ""
            ).strip()

        workflow = json.loads(text)

        if "tasks" not in workflow:
            raise ValueError(
                "Gemini response does not contain tasks."
            )

        workflow["tasks"] = [
            normalize_task(task)
            for task in workflow["tasks"]
        ]

        return workflow

    except Exception as error:

        print(
            f"Gemini workflow analysis failed: {error}"
        )

        print(
            "Using rule-based fallback..."
        )

        return fallback_workflow(
            user_request
        )


# ---------------------------------------------------------
# Main test
# ---------------------------------------------------------

if __name__ == "__main__":

    request = (
        "Analyze customer complaints, "
        "verify the results, and summarize "
        "the findings."
    )

    result = analyze_workflow(
        request
    )

    print(
        json.dumps(
            result,
            indent=4
        )
    )