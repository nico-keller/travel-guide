from database import db  # Make sure you import the `db` from `database.py`
from datetime import datetime

class TravelPlan(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text, nullable=False)
    location = db.Column(db.String(100), nullable=False)
    itinerary = db.Column(db.JSON, nullable=False)  # Stores the travel plan
    preferences = db.Column(db.String(100), nullable=True)
    likes = db.Column(db.Integer, default=0)
    dislikes = db.Column(db.Integer, default=0)
    location_details = db.Column(db.JSON, nullable=False)
    image_url = db.Column(db.String(100), nullable=False)
    comments = db.relationship('Comment', backref='travel_plan', lazy=True, cascade="all, delete-orphan")

class Comment(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    content = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    travel_plan_id = db.Column(db.Integer, db.ForeignKey('travel_plan.id'), nullable=False)
    author = db.Column(db.String(100), nullable=False)
