from database import db  # Make sure you import the `db` from `database.py`

class TravelPlan(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text, nullable=False)
    location = db.Column(db.String(100), nullable=False)
    itinerary = db.Column(db.JSON, nullable=False)  # Stores the travel plan
    likes = db.Column(db.Integer, default=0)
    dislikes = db.Column(db.Integer, default=0)
