import React, { useState } from 'react';
import { createTravelPlan } from '../services/apiService';

function CreatePlan() {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [location, setLocation] = useState('');
    const [preferences, setPreferences] = useState('');
    const [message, setMessage] = useState('');
    const [createdPlan, setCreatedPlan] = useState(null); // State to store the created plan

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const newPlan = {
                title,
                description,
                location,
                preferences
            };
            // Make the API request to create the travel plan
            const response = await createTravelPlan(newPlan);
            setMessage('Travel plan created successfully!');
            setCreatedPlan(response.data); // Store the created plan data
            // Clear the form fields
            setTitle('');
            setDescription('');
            setLocation('');
            setPreferences('');
        } catch (error) {
            console.error(error);
            setMessage('Error creating travel plan. Please try again.');
        }
    };

    return (
        <div>
            <h1>Create a New Travel Plan</h1>
            {message && <p>{message}</p>}
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Title:</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Description:</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Location:</label>
                    <input
                        type="text"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Preferences:</label>
                    <input
                        type="text"
                        value={preferences}
                        onChange={(e) => setPreferences(e.target.value)}
                    />
                </div>
                <button type="submit">Create Travel Plan</button>
            </form>

            {/* Display the created plan if available */}
            {createdPlan && (
                <div>
                    <h2>Created Travel Plan</h2>
                    <p><strong>Title:</strong> {createdPlan.title}</p>
                    <p><strong>Description:</strong> {createdPlan.description}</p>
                    <p><strong>Location:</strong> {createdPlan.location}</p>
                    <p><strong>Preferences:</strong> {createdPlan.preferences}</p>
                    <h3>Itinerary:</h3>
                    <pre>{createdPlan.itinerary}</pre>
                </div>
            )}
        </div>
    );
}

export default CreatePlan;
