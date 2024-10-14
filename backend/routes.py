from flask import request, jsonify
from models import db, TravelPlan
from ai_module import generate_itinerary

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
            'likes': plan.likes,
            'dislikes': plan.dislikes
        } for plan in plans])

    @app.route('/api/plans/<int:id>', methods=['GET'])
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
            'likes': plan.likes,
            'dislikes': plan.dislikes
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

            location = data['location']
            preferences = data['preferences']
            itinerary = generate_itinerary(location, preferences)

            # Ensure itinerary is a string
            if not isinstance(itinerary, str):
                itinerary = str(itinerary)

            new_plan = TravelPlan(
                title=data['title'],
                description=data['description'],
                location=location,
                itinerary=itinerary
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


