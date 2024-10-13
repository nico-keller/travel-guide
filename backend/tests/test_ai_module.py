import pytest
from unittest.mock import patch, MagicMock
from backend.ai_module import generate_itinerary


# Test generate_itinerary function
@patch('backend.ai_module.client.chat.completions.create')
def test_generate_itinerary(mock_create):
    # Create a mock response that simulates the structure of the OpenAI API response
    mock_openai_response = MagicMock()
    mock_openai_response.choices = [
        MagicMock(message=MagicMock(content="Mock itinerary: Day 1 - Visit Paris"))
    ]

    # Mock the OpenAI API call to return the mock response
    mock_create.return_value = mock_openai_response

    location = "Paris"
    preferences = "museums, cafes"

    # Call the function
    itinerary = generate_itinerary(location, preferences)

    # Assert that the function returns the correct itinerary
    assert itinerary == 'Mock itinerary: Day 1 - Visit Paris'

    # Ensure the OpenAI API was called with the correct parameters
    mock_create.assert_called_once_with(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "system", "content": "You are a helpful travel assistant."},
            {"role": "user",
             "content": f"Create a travel itinerary for a trip to {location} considering the following preferences: {preferences}"}
        ]
    )
