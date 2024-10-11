from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

def init_db(app):
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///travel_ai.db'  # Database configuration
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    db.init_app(app)