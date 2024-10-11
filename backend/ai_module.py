import os
import openai
from openai import OpenAI
from dotenv import load_dotenv
# Load environment variables
load_dotenv()

# Create an OpenAI client
api_key = os.getenv("OPENAI_API_KEY")
if not api_key:
    raise ValueError("OPENAI_API_KEY is not set in the environment variables")

client = OpenAI(api_key=api_key)

def generate_itinerary(location, preferences):
    try:
        prompt = f"Create a travel itinerary for a trip to {location} considering the following preferences: {preferences}"
        # Use the new client.chat.completions.create method
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a helpful travel assistant."},
                {"role": "user", "content": prompt}
            ]
        )
        # Extract the generated content
        itinerary = response.choices[0].message.content
        return itinerary
    except Exception as e:
        print(e)



