import os
from dotenv import load_dotenv
from openai import OpenAI

load_dotenv()

key = os.getenv("OPENROUTER_API_KEY")

print("Key loaded:", bool(key))

client = OpenAI(
    base_url="https://openrouter.ai/api/v1",
    api_key=key
)

print("Calling OpenRouter...")

try:
    response = client.chat.completions.create(
        model="google/gemma-4-26b-a4b-it:free",
        messages=[
            {
                "role": "user",
                "content": "Reply with exactly: OPENROUTER WORKS"
            }
        ],
        max_tokens=20
    )

    print("SUCCESS!")
    print(response.choices[0].message.content)

except Exception as e:
    print("ERROR:")
    print(repr(e))