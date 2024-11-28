from flask import request, jsonify
from models import db, TravelPlan, Comment
from ai_module import generate_itinerary, generate_image, generate_loc_details
from serpapi import GoogleSearch
import os
from dotenv import load_dotenv
from datetime import datetime

# Load environment variables
load_dotenv()


def configure_routes(app):
    @app.route('/', methods=['GET'])
    def home():
        return "Welcome to Travel AI!", 200

    @app.route('/api/plans', methods=['GET'])
    def get_plans():
        plans = TravelPlan.query.all()
        return jsonify([{
            'id': plan.id,
            'title': plan.title,
            'description': plan.description,
            'location': plan.location,
            'itinerary': plan.itinerary,
            'preferences': plan.preferences,
            'location_details': plan.location_details,
            'likes': plan.likes,
            'dislikes': plan.dislikes,
            'image_url': plan.image_url
        } for plan in plans])

    @app.route('/api/plans/<id>', methods=['GET'])
    def get_plan_by_id(id):
        plan = TravelPlan.query.get(id)
        if not plan:
            return jsonify({'error': 'Plan not found'}), 404
        return jsonify({
            'id': plan.id,
            'title': plan.title,
            'description': plan.description,
            'location': plan.location,
            'itinerary': plan.itinerary,
            'preferences': plan.preferences,
            'location_details': plan.location_details,
            'likes': plan.likes,
            'dislikes': plan.dislikes,
            'image_url': plan.image_url
        })

    @app.route('/api/plans', methods=['POST'])
    def create_plan():
        try:
            data = request.json
            if not data:
                return jsonify({'error': 'No data provided'}), 400

            # Check if all required fields are present
            required_fields = ['title', 'description', 'location', 'preferences']
            for field in required_fields:
                if field not in data:
                    return jsonify({'error': f'Missing field: {field}'}), 400

            title = data['title']
            description = data['description']
            location = data['location']
            preferences = data['preferences']
            itinerary = generate_itinerary(title, description, location, preferences)
            location_details = generate_loc_details(location)

            # Ensure itinerary is a string
            if not isinstance(itinerary, str):
                itinerary = str(itinerary)
            if not isinstance(location_details, str):
                location_details = str(location_details)

            # Generate the image based on the travel plan description
            image_prompt = f"A beautiful scene at {location}. Description: {description}"
            image_url = generate_image(image_prompt)

            new_plan = TravelPlan(
                title=title,
                description=description,
                location=location,
                itinerary=itinerary,
                preferences=preferences,
                location_details=location_details,
                image_url=image_url
            )

            # Save to the database
            db.session.add(new_plan)
            db.session.commit()

            # Return the created plan details
            return jsonify({
                'id': new_plan.id,
                'title': new_plan.title,
                'description': new_plan.description,
                'location': new_plan.location,
                'itinerary': new_plan.itinerary,
                'preferences': new_plan.preferences,
                'image_url': new_plan.image_url,
                'location_details': new_plan.location_details

            }), 201
        except Exception as e:
            # Log the exception for debugging
            app.logger.error(f"Error creating travel plan: {e}")
            return jsonify({'error': 'Failed to create travel plan'}), 500

    @app.route('/api/plans/<int:id>/like', methods=['POST'])
    def like_plan(id):
        plan = TravelPlan.query.get(id)
        if not plan:
            return jsonify({'error': 'Plan not found'}), 404

        # Increment the likes count
        plan.likes += 1
        db.session.commit()

        return jsonify({
            'id': plan.id,
            'likes': plan.likes,
            'dislikes': plan.dislikes
        }), 200

    @app.route('/api/plans/<int:id>/dislike', methods=['POST'])
    def dislike_plan(id):
        plan = TravelPlan.query.get(id)
        if not plan:
            return jsonify({'error': 'Plan not found'}), 404

        # Increment the dislikes count
        plan.dislikes += 1
        db.session.commit()

        return jsonify({
            'id': plan.id,
            'likes': plan.likes,
            'dislikes': plan.dislikes
        }), 200

    @app.route('/api/generate_image', methods=['POST'])
    def generate_image_api():
        data = request.json
        if 'prompt' not in data:
            return jsonify({'error': 'No prompt provided'}), 400

        prompt = data['prompt']
        image_url = generate_image(prompt)

        if image_url:
            return jsonify({'image_url': image_url}), 200
        else:
            return jsonify({'error': 'Failed to generate image'}), 500


    @app.route('/api/flights', methods=['POST'])
    def get_flights():
        try:
            # Retrieve API key
            api_key = os.getenv("FLIGHTS_API_KEY")
            if not api_key:
                return jsonify({"error": "FLIGHTS_API_KEY is not set in environment variables"}), 500

            # Get the data from the request
            data = request.json
            departure_id = data.get('departure_id')
            arrival_id = data.get('arrival_id')
            outbound_date = data.get('outbound_date')
            return_date = data.get('return_date')
            currency = data.get('currency', 'USD')  # Default to USD

            # Set up the parameters for the API call
            params = {
                "engine": "google_flights",
                "departure_id": departure_id,
                "arrival_id": arrival_id,
                "outbound_date": outbound_date,
                "return_date": return_date,
                "currency": currency,
                "hl": "en",
                "api_key": api_key
            }

            # Perform the search using SerpAPI
            search = GoogleSearch(params)
            results = search.get_dict()

            return jsonify(results), 200

        except Exception as e:
            print(f"Error occurred: {e}")
            return jsonify({"error": "Failed to fetch flight details"}), 500

    @app.route('/api/plans/<int:plan_id>/comments', methods=['GET'])
    def get_comments(plan_id):
        comments = Comment.query.filter_by(travel_plan_id=plan_id)\
            .order_by(Comment.created_at.desc()).all()
        return jsonify([{
            'id': comment.id,
            'content': comment.content,
            'author': comment.author,
            'created_at': comment.created_at.isoformat(),
        } for comment in comments])

    @app.route('/api/plans/<int:plan_id>/comments', methods=['POST'])
    def add_comment(plan_id):
        data = request.json
        if not data or 'content' not in data or 'author' not in data:
            return jsonify({'error': 'Missing required fields'}), 400

        new_comment = Comment(
            content=data['content'],
            author=data['author'],
            travel_plan_id=plan_id,
            created_at=datetime.utcnow()
        )
        db.session.add(new_comment)
        db.session.commit()

        return jsonify({
            'id': new_comment.id,
            'content': new_comment.content,
            'author': new_comment.author,
            'created_at': new_comment.created_at.isoformat()
        }), 201



