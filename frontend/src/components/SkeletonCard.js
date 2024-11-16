import React from 'react';
import '../styles/SkeletonCard.css';

function SkeletonCard() {
    return (
        <div className="skeleton-card">
            <div className="skeleton-title"></div>
            <div className="skeleton-text"></div>
            <div className="skeleton-text"></div>
            <div className="skeleton-actions">
                <div className="skeleton-button"></div>
                <div className="skeleton-button"></div>
            </div>
        </div>
    );
}

export default SkeletonCard; 