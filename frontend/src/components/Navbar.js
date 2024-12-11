import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Navbar.css';

function Navbar() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <nav className="navbar">
            <Link to="/" className="nav-brand">
                🏠 Home
            </Link>
            
            <button 
                className={`mobile-menu-btn ${isOpen ? 'open' : ''}`}
                onClick={() => setIsOpen(!isOpen)}
            >
                <span></span>
                <span></span>
                <span></span>
            </button>

            <ul className={`nav-links ${isOpen ? 'active' : ''}`}>
                <li>
                    <Link to="/create" className="nav-link">
                        ✏️ Create Plan
                    </Link>
                </li>
                <li>
                    <Link to="/generate-image" className="nav-link">
                        🎨 Travel Images
                    </Link>
                </li>
                <li>
                    <Link to="/search-flights" className="nav-link">
                        ✈️ Book Flights
                    </Link>
                </li>
                <li>
                    <Link to="/destination-tinder" className="nav-link">
                        🌍 Explore Destinations
                    </Link>
                </li>
            </ul>
        </nav>
    );
}

export default Navbar;
