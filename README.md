# Travel Guide Web Application

## Overview

The **Travel Guide Web Application** is a full-stack web project that enables users to create personalized travel plans, search for flights, generate AI-powered itineraries, and generate AI-based images corresponding to their travel descriptions. It leverages the power of OpenAI’s GPT-3.5 for text generation and DALL·E for image generation, as well as Google Flights through SerpAPI for flight searches.

## Features

1. **Travel Plan Creation:**
   - Users can create travel plans by entering the destination, description, and preferences.
   - The app generates a detailed itinerary based on user preferences using AI.
   - Users can like or dislike each travel plan.

2. **AI-Powered Itineraries:**
   - OpenAI's GPT-3.5 is used to generate a custom itinerary based on the provided destination and preferences.
   - The generated itinerary is stored and displayed for the user.

3. **Flight Search:**
   - Users can search for flights between two locations for specific dates.
   - The search results include flight details like duration, price, and airlines.
   - Each result includes a direct link to book the flight.

4. **AI Image Generation:**
   - OpenAI’s DALL·E generates an image based on the travel plan’s description.
   - The generated image is displayed and used as the background for the travel plan page.

## Project Structure

The project is organized into two main parts:

- **Backend (Flask):** Provides RESTful API endpoints for creating travel plans, generating itineraries, searching for flights, and generating images.
- **Frontend (React):** Implements the user interface for creating travel plans, browsing flights, and displaying AI-generated images.

### Backend (Flask)

The backend handles API requests and integrates with external services like OpenAI and SerpAPI.

#### Key Endpoints:

- `/api/plans`: Handles creating and retrieving travel plans.
- `/api/flights`: Searches for flights using the Google Flights API through SerpAPI.
- `/api/generate_image`: Generates an image based on a prompt using OpenAI's DALL·E model.

### Frontend (React)

The frontend is built using React and Axios to interact with the Flask backend. Users can navigate between pages to create travel plans, search for flights, and view AI-generated content.

#### Key Pages:

- **Home Page:** Displays all created travel plans with options to like or dislike them.
- **Create Plan Page:** Users can create travel plans and generate itineraries and images.
- **Flight Search Page:** Allows users to search for flights between two airports with custom dates.

## Installation

### Prerequisites

- **Node.js**: Ensure Node.js and npm are installed on your machine.
- **Python 3.12**: Ensure Python and pip are installed for the backend.
- **API Keys**: You will need API keys for OpenAI (GPT-3.5 & DALL·E) and SerpAPI (Google Flights API).

### Backend Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-repository-url
   cd travel-guide/backend
2. **Install python dependencies**:
   ```bash
   pip install -r requirements.txt
3. **Set up environment variables: Create a .env file in the backend/ directory with the following content:**
   ```bash
   OPENAI_API_KEY=your_openai_api_key
   FLIGHTS_API_KEY=your_serpapi_key
4. **Run the flask server**
   ```bash
   flask run
   
 
