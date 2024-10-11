from flask import Flask
from routes import configure_routes
from database import init_db, db  # Import `db` here to initialize it
from flask_cors import CORS
app = Flask(__name__)
CORS(app)

# Initialize the database
init_db(app)

# Make sure the database is set up correctly
with app.app_context():
    db.create_all()

# Configure routes
configure_routes(app)

if __name__ == '__main__':
    app.run(debug=False)
