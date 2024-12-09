import React, { useState } from 'react';
import { createTravelPlan } from '../services/apiService';
import '../styles/SharedStyles.css';
import { saveAs } from 'file-saver'; // Import file-saver for downloading files

function CreatePlan() {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [location, setLocation] = useState('');
    const [preferences, setPreferences] = useState('');
    const [length, setLength] = useState('');
    const [message, setMessage] = useState('');
    const [createdPlan, setCreatedPlan] = useState(null);
    const [imageUrl, setImageUrl] = useState(null); // State for the generated image URL
    const [loading, setLoading] = useState(false); // State for loading
    const [startDateTime, setStartDateTime] = useState(''); // State for the start date and time

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isNaN(length) || length <= 0) {
            setMessage('Length must be a positive number.');
            return;
        }
        setLoading(true); // Set loading to true when request starts
        try {
            const newPlan = {
                title,
                description,
                location,
                preferences,
                length
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
            setLength('');
        } catch (error) {
            console.error(error);
            setMessage('Error creating travel plan. Please try again.');
        } finally {
            setLoading(false); // Set loading to false when request completes
        }
    };

    const handleExportToOutlook = () => {
        if (!startDateTime) {
            setMessage('Please set a start date to export the plan.');
            return;
        }

        let startDate = new Date(startDateTime);
        startDate.setHours(12, 0, 0); // Default to 12 PM
        const endDate = new Date(startDate.getTime() + createdPlan.length * 24 * 60 * 60 * 1000);

        const event = `
BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Your Organization//Your Product//EN
BEGIN:VEVENT
UID:${createdPlan.id}
DTSTAMP:${startDate.toISOString().replace(/[-:]/g, '').split('.')[0]}Z
DTSTART:${startDate.toISOString().replace(/[-:]/g, '').split('.')[0]}Z
DTEND:${endDate.toISOString().replace(/[-:]/g, '').split('.')[0]}Z
SUMMARY:${createdPlan.title}
DESCRIPTION:${createdPlan.itinerary.replace(/\n/g, '\\n')}
LOCATION:${createdPlan.location}
END:VEVENT
END:VCALENDAR
    `;

        const blob = new Blob([event], { type: 'text/calendar' });
        saveAs(blob, 'travel-plan.ics');
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

            {loading && (
                <div className="loading-notification">Creating travel plan, please wait...</div>
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
                            placeholder="Vienna Music Tour"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Description</label>
                        <textarea
                            className="form-textarea"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="A tour exploring the musical heritage of Vienna."
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
                            placeholder="Vienna, Austria"
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
                            placeholder="Classical music, historical sites"
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Length (days)</label>
                        <input
                            type="number"
                            className="form-input"
                            value={length}
                            onChange={(e) => setLength(e.target.value)}
                            placeholder="5"
                            required
                        />
                    </div>

                    <button type="submit" className="btn" disabled={loading}>
                        {loading ? 'Creating...' : 'Create Travel Plan'}
                    </button>
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
                        <p><strong>Length:</strong> {createdPlan.length} days</p>
                        
                        <h3>Details:</h3>
                        <div className="details-section">
                            {renderJsonData(createdPlan.location_details)}
                        </div>
                        
                        <h3>Itinerary:</h3>
                        <div className="details-section">
                            {renderJsonData(createdPlan.itinerary)}
                        </div>
                    </div>
                    <div className="export-section">
                        <label className="form-label">Start Date</label>
                        <input
                            type="date"
                            className="form-input"
                            value={startDateTime}
                            onChange={(e) => setStartDateTime(e.target.value)}
                        />
                        <button className="btn" onClick={handleExportToOutlook} disabled={!startDateTime}>
                            Export to Outlook
                        </button>
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
