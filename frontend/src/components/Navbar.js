import React from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
    return (
        <nav>
            <ul>
                <li><Link to="/">Home</Link></li>
                <li><Link to="/create">Create Plan</Link></li>{/* Add this link */}
                <li><Link to="/generate-image">Create Travel Images</Link></li>
                <li><Link to="/search-flights">Book flights</Link> </li>
            </ul>
        </nav>
    );
}

export default Navbar;
