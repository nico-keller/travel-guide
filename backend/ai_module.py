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

def generate_itinerary(title, description, location, preferences, length):
    try:
        prompt = (f"{title} Short travel plan description: {description}. Create a travel itinerary for this trip to {location}."
                  f" Consider the following preferences when creating the travel plan: {preferences}. The trip will be {length} days long.")
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a helpful travel assistant."},
                {"role": "user", "content": prompt}
            ]
        )
        itinerary = response.choices[0].message.content
        return itinerary
    except Exception as e:
        print(e)
        return "Error generating itinerary."

def generate_image(prompt):
    try:
        photorealistic_prompt = f"Create a photorealistic image of {prompt}."
        response = client.images.generate(
            model="dall-e-3",
            prompt=photorealistic_prompt,
            size="1024x1024",
            quality="standard",
            n=1,
        )
        # Get the URL of the generated image
        image_url = response.data[0].url
        return image_url
    except Exception as e:
        print(f"Error generating image: {e}")
        return None

def generate_loc_details(location):
    try:
        prompt = (f"Provide detailed travel information for {location}, including: "
                  f"\n- Currency used "
                  f"\n- Official languages spoken "
                  f"\n- Time zone "
                  f"\n- Best methods of transportation "
                  f"\n- Capital city "
                  f"\n- Currency conversion from 1 Swiss Franc "
                  f"\nProvide the information as bullet points.")
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a helpful travel assistant."},
                {"role": "user", "content": prompt}
            ]
        )
        itinerary = response.choices[0].message.content
        return itinerary
    except Exception as e:
        print(e)
        return "Error generating itinerary."

def generate_random_destination():
    try:
        prompt = (
            "Provide a popular travel destination starting with a random letter, "
            "along with a brief description. Respond only with a JSON object containing "
            "the 'name' and 'description' fields without any additional text."
        )
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a helpful travel assistant."},
                {"role": "user", "content": prompt}
            ]
        )
        destination_json = response.choices[0].message.content
        # Extract JSON object using regex
        import re
        json_match = re.search(r'\{.*\}', destination_json, re.DOTALL)
        if json_match:
            json_str = json_match.group()
            # Parse the JSON string into a Python dictionary
            import json
            destination = json.loads(json_str.strip())
            return destination
        else:
            print("JSON object not found in the response.")
            return None
    except Exception as e:
        print(f"Error generating random destination: {e}")
        return None

