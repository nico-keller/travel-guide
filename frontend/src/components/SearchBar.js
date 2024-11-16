import React from 'react';
import '../styles/SearchBar.css';

function SearchBar({ value, onChange }) {
    return (
        <div className="search-container">
            <input
                type="text"
                className="search-input"
                placeholder="Search travel plans..."
                value={value}
                onChange={onChange}
            />
            <span className="search-icon">🔍</span>
        </div>
    );
}

export default SearchBar; 