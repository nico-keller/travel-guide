import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import '../styles/SharedStyles.css';

const API_BASE_URL = 'http://127.0.0.1:5000'

function PlanDetails() {
    const { id } = useParams();
    const [plan, setPlan] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        axios.get(`${API_BASE_URL}/api/plans/${id}`)
            .then(response => {
                setPlan(response.data);
            })
            .catch(error => {
                console.error(error);
                setError('Failed to load travel plan details.');
            });
    }, [id]);

    if (error) {
        return <div className="page-container">
            <div className="message error">{error}</div>
        </div>;
    }

    if (!plan) {
        return <div className="page-container">
            <div className="loading-spinner">Loading...</div>
        </div>;
    }

    return (
        <div className="page-container">
            <h1 className="page-title">{plan.title}</h1>

            <div className="plan-details-grid">
                <div className="card plan-overview">
                    <h2 className="section-title">Overview</h2>
                    <div className="info-group">
                        <label>Location</label>
                        <p>{plan.location}</p>
                    </div>
                    <div className="info-group">
                        <label>Description</label>
                        <p>{plan.description}</p>
                    </div>
                    <div className="info-group">
                        <label>Preferences</label>
                        <p>{plan.preferences}</p>
                    </div>
                </div>

                <div className="card plan-details">
                    <h2 className="section-title">Location Details</h2>
                    <div className="details-content">
                        {plan.location_details ? (
                            plan.location_details.split('\n').map((line, index) => (
                                <p key={index}>{line}</p>
                            ))
                        ) : (
                            <p className="no-content">No location details available</p>
                        )}
                    </div>
                </div>

                <div className="card plan-itinerary">
                    <h2 className="section-title">Itinerary</h2>
                    <div className="details-content">
                        {plan.itinerary ? (
                            plan.itinerary.split('\n').map((line, index) => (
                                <p key={index}>{line}</p>
                            ))
                        ) : (
                            <p className="no-content">No itinerary available</p>
                        )}
                    </div>
                </div>

                {plan.image_url && (
                    <div className="card plan-image">
                        <h2 className="section-title">Destination Image</h2>
                        <img 
                            src={plan.image_url} 
                            alt="Travel destination" 
                            className="destination-image"
                        />
                    </div>
                )}
            </div>
        </div>
    );
}

export default PlanDetails;
