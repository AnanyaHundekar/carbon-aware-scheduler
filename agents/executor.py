import os

from dotenv import load_dotenv
from google import genai

load_dotenv()

client = genai.Client(
    api_key=os.getenv("GEMINI_API_KEY"),
    http_options={
        "timeout": 30000
    }
)

def execute_task(task_description, input_data, model_name="gemini-3.5-flash-lite"):
    prompt = f"""
You are executing a user's task.

Task:
{task_description}

Input:
{input_data}

Perform the task and return the result clearly.
Do not explain how you are executing it.
Just provide the useful result.
"""

    try:
        print("Executing task with Gemini...")

        response = client.interactions.create(
            model=model_name,
            input=prompt,
            generation_config={
                "thinking_level": "minimal"
            }
        )

        result = response.output_text.strip()

        print("Task execution completed!")

        return result

    except Exception as e:
        print("Task execution failed.")
        print("Reason:", repr(e))

        return None


if __name__ == "__main__":
    selected_model = "Medium"

    result = execute_task(
        "Summarize the following text",
        "Carbon-aware scheduling reduces carbon emissions by choosing "
        "lower-carbon execution times and resources.",
        model_name="gemini-3.5-flash-lite"
    )

    print("\nSCHEDULER SELECTED:")
    print(selected_model)

    print("\nRESULT:")
    print(result)