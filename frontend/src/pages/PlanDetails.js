import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import '../styles/SharedStyles.css';
import CommentSection from '../components/CommentSection';
import { saveAs } from 'file-saver'; // Import file-saver for downloading files

const API_BASE_URL = 'http://127.0.0.1:5000'
const WEATHER_API_KEY = 'YOUR_API_KEY_HERE';

function PlanDetails() {
    const { id } = useParams();
    const [plan, setPlan] = useState(null);
    const [error, setError] = useState(null);
    const [weather, setWeather] = useState(null);
    const [startDateTime, setStartDateTime] = useState(''); // State for the start date and time

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

    useEffect(() => {
        if (plan && plan.location) {
            axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${plan.location}&units=metric&appid=${WEATHER_API_KEY}`)
                .then(response => {
                    setWeather(response.data);
                })
                .catch(error => {
                    console.error('Weather fetch error:', error);
                });
        }
    }, [plan]);

    const handleExportToOutlook = () => {
        if (!startDateTime) {
            setError('Please set a start date to export the plan.');
            return;
        }

        let startDate = new Date(startDateTime);
        startDate.setHours(12, 0, 0); // Default to 12 PM
        const endDate = new Date(startDate.getTime() + plan.length * 24 * 60 * 60 * 1000);

        const event = `
BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Your Organization//Your Product//EN
BEGIN:VEVENT
UID:${plan.id}
DTSTAMP:${startDate.toISOString().replace(/[-:]/g, '').split('.')[0]}Z
DTSTART:${startDate.toISOString().replace(/[-:]/g, '').split('.')[0]}Z
DTEND:${endDate.toISOString().replace(/[-:]/g, '').split('.')[0]}Z
SUMMARY:${plan.title}
DESCRIPTION:${plan.itinerary.replace(/\n/g, '\\n')}
LOCATION:${plan.location}
END:VEVENT
END:VCALENDAR
        `;

        const blob = new Blob([event], { type: 'text/calendar' });
        saveAs(blob, 'travel-plan.ics');
    };

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
                    <div className="info-group">
                        <label>Length</label>
                        <p>{plan.length} days</p>
                    </div>
                </div>

                <div className="card plan-details">
                    <h2 className="section-title">Location Details</h2>
                    <div className="details-content">
                        {weather && (
                            <div className="weather-info">
                                <h3>Current Weather</h3>
                                <p>Temperature: {Math.round(weather.main.temp)}°C</p>
                                <p>Conditions: {weather.weather[0].description}</p>
                                <p>Humidity: {weather.main.humidity}%</p>
                            </div>
                        )}
                        {plan.location_details ? (
                            plan.location_details.split('\n').map((line, index) => (
                                <p key={index}>{line}</p>
                            ))
                        ) : (
                            <p className="no-content"></p>
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

            {plan && (
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
            )}

            <CommentSection planId={id} />
        </div>
    );
}

export default PlanDetails;
