import React, { useState } from 'react';
import { createTravelPlan } from '../services/apiService';
import '../styles/SharedStyles.css';

function CreatePlan() {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [location, setLocation] = useState('');
    const [preferences, setPreferences] = useState('');
    const [message, setMessage] = useState('');
    const [createdPlan, setCreatedPlan] = useState(null);
    const [imageUrl, setImageUrl] = useState(null); // State for the generated image URL

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
            setImageUrl(response.data.image_url); // Store the generated image URL
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

    const renderJsonData = (data) => {
        if (typeof data === 'object') {
            return <pre>{JSON.stringify(data, null, 2)}</pre>;
        }
        return <pre>{data}</pre>;
    };

    return (
        <div className="page-container">
            <h1 className="page-title">Create a New Travel Plan</h1>
            
            {message && (
                <div className={`message ${message.includes('success') ? 'success' : 'error'}`}>
                    {message}
                </div>
            )}

            <div className="form-container">
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">Title</label>
                        <input
                            type="text"
                            className="form-input"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Description</label>
                        <textarea
                            className="form-textarea"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Location</label>
                        <input
                            type="text"
                            className="form-input"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Preferences</label>
                        <input
                            type="text"
                            className="form-input"
                            value={preferences}
                            onChange={(e) => setPreferences(e.target.value)}
                        />
                    </div>

                    <button type="submit" className="btn">Create Travel Plan</button>
                </form>
            </div>

            {createdPlan && (
                <div className="card">
                    <h2>Created Travel Plan</h2>
                    <div className="plan-details">
                        <p><strong>Title:</strong> {createdPlan.title}</p>
                        <p><strong>Description:</strong> {createdPlan.description}</p>
                        <p><strong>Location:</strong> {createdPlan.location}</p>
                        <p><strong>Preferences:</strong> {createdPlan.preferences}</p>
                        
                        <h3>Details:</h3>
                        <div className="details-section">
                            {renderJsonData(createdPlan.location_details)}
                        </div>
                        
                        <h3>Itinerary:</h3>
                        <div className="details-section">
                            {renderJsonData(createdPlan.itinerary)}
                        </div>
                    </div>
                </div>
            )}

            {imageUrl && (
                <div className="card">
                    <h2>Generated Image</h2>
                    <img src={imageUrl} alt="Generated AI" style={{ maxWidth: '100%', borderRadius: 'var(--radius)' }} />
                </div>
            )}
        </div>
    );
}

export default CreatePlan;
