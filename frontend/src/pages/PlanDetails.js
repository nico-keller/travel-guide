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
            <p>{plan.description}</p>
            <p><strong>Location:</strong> {plan.location}</p>
            <h3>Itinerary:</h3>
            <div>
                {plan.itinerary.split('\n').map((line, index) => (
                    <p key={index}>{line}</p>
                ))}
            </div>
        </div>
    );
}

export default PlanDetails;
