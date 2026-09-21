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

print("Testing Gemini 3.5 Flash-Lite...")

try:

    response = client.interactions.create(
        model="gemini-3.5-flash-lite",
        input="Reply with exactly: LOWER MODEL WORKS",
        generation_config={
            "thinking_level": "minimal"
        }
    )

    print("Response:")
    print(response.output_text)

except Exception as e:

    print("ERROR:")
    print(repr(e))