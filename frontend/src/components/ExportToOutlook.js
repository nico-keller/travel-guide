
import React, { useState } from 'react';
import axios from 'axios';
import { saveAs } from 'file-saver';

const API_BASE_URL = 'http://127.0.0.1:5000';

function ExportToOutlook({ planId }) {
    const [startDateTime, setStartDateTime] = useState('');
    const [error, setError] = useState(null);

    const handleExportToOutlook = () => {
        if (!startDateTime) {
            setError('Please set a start date to export the plan.');
            return;
        }

        axios.post(`${API_BASE_URL}/api/plans/${planId}/export`, { startDateTime })
            .then(response => {
                const blob = new Blob([response.data], { type: 'text/calendar' });
                saveAs(blob, 'travel-plan.ics');
            })
            .catch(error => {
                console.error('Export error:', error);
                setError('Failed to export travel plan.');
            });
    };

    return (
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
            {error && <div className="message error">{error}</div>}
        </div>
    );
}

export default ExportToOutlook;