import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:5000'; // Your backend URL

function PlanDetails() {
    const { id } = useParams(); // Get the plan ID from the URL
    const [plan, setPlan] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Fetch the travel plan details from the API
        axios.get(`${API_BASE_URL}/api/plans/${id}`)
            .then(response => {
                console.log("Plan data:", response.data); // Log the response data
                setPlan(response.data);
            })
            .catch(error => {
                console.error(error);
                setError('Failed to load travel plan details.');
            });
    }, [id]);

    if (error) {
        return <div>{error}</div>;
    }

    if (!plan) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h1>{plan.title}</h1>
            <p><strong>Trip description:</strong> {plan.description}</p>
            <p><strong>Location:</strong> {plan.location}</p>
            <p><strong>Preferences:</strong> {plan.preferences}</p>

            <h3>Details:</h3>
            <div>
                {plan.location_details ? (
                    plan.location_details.split('\n').map((line, index) => (
                        <p key={index}>{line}</p>
                    ))
                ) : (
                    <p>No location details available</p>
                )}
            </div>

            <h3>Itinerary:</h3>
            <div>
                {plan.itinerary ? (
                    plan.itinerary.split('\n').map((line, index) => (
                        <p key={index}>{line}</p>
                    ))
                ) : (
                    <p>No itinerary available</p>
                )}
            </div>
            {plan.image_url && (
                <div>
                    <img src={plan.image_url} alt="Generated AI" style={{ maxWidth: '100%' }} />
                </div>
            )}
        </div>
    );
}

export default PlanDetails;
