import React, { useState } from 'react';
import axios from 'axios';
import '../styles/SharedStyles.css';

function FlightSearch() {
    const [departure, setDeparture] = useState('');
    const [arrival, setArrival] = useState('');
    const [outboundDate, setOutboundDate] = useState('');
    const [returnDate, setReturnDate] = useState('');
    const [flights, setFlights] = useState(null);
    const [error, setError] = useState(null);

    const handleSearch = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://127.0.0.1:5000/api/flights', {
                departure_id: departure,
                arrival_id: arrival,
                outbound_date: outboundDate,
                return_date: returnDate
            });
            setFlights(response.data);
            setError(null);
        } catch (error) {
            setError('Error fetching flight details');
            console.error(error);
        }
    };

    return (
        <div className="page-container">
            <h1 className="page-title">Search Flights</h1>
            
            {error && <div className="message error">{error}</div>}

            <div className="form-container">
                <form onSubmit={handleSearch}>
                    <div className="form-group">
                        <label className="form-label">Departure Airport</label>
                        <input
                            type="text"
                            className="form-input"
                            value={departure}
                            onChange={(e) => setDeparture(e.target.value)}
                            placeholder="e.g., LAX"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Arrival Airport</label>
                        <input
                            type="text"
                            className="form-input"
                            value={arrival}
                            onChange={(e) => setArrival(e.target.value)}
                            placeholder="e.g., JFK"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Outbound Date</label>
                        <input
                            type="date"
                            className="form-input"
                            value={outboundDate}
                            onChange={(e) => setOutboundDate(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Return Date</label>
                        <input
                            type="date"
                            className="form-input"
                            value={returnDate}
                            onChange={(e) => setReturnDate(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="btn">Search Flights</button>
                </form>
            </div>

            {flights && <FlightResults flights={flights.best_flights} bookingLink={flights.search_metadata.google_flights_url} />}
        </div>
    );
}

function FlightResults({ flights, bookingLink }) {
    if (flights.length === 0) return <div className="message">No flights found.</div>;

    return (
        <div className="results-container">
            <h2 className="section-title">Flight Results</h2>
            {flights.map((flight, index) => (
                <div key={index} className="card flight-card">
                    <div className="flight-header">
                        <img src={flight.airline_logo} alt="Airline Logo" className="airline-logo" />
                        <h3>{flight.flights[0].airline} - {flight.flights[0].flight_number}</h3>
                    </div>

                    <div className="flight-details">
                        <div className="flight-info">
                            <div className="departure">
                                <h4>Departure</h4>
                                <p>{flight.flights[0].departure_airport.name}</p>
                                <p className="time">{flight.flights[0].departure_airport.time}</p>
                            </div>
                            <div className="flight-duration">
                                <span className="duration-line"></span>
                                <p>{flight.total_duration} min</p>
                            </div>
                            <div className="arrival">
                                <h4>Arrival</h4>
                                <p>{flight.flights[0].arrival_airport.name}</p>
                                <p className="time">{flight.flights[0].arrival_airport.time}</p>
                            </div>
                        </div>

                        <div className="flight-meta">
                            <p><span>Legroom:</span> {flight.flights[0].legroom}</p>
                            <p><span>Carbon Emissions:</span> {(flight.carbon_emissions.this_flight / 1000).toFixed(2)} kg</p>
                            <p className="price"><span>Price:</span> ${flight.price}</p>
                        </div>

                        <a href={bookingLink} target="_blank" rel="noopener noreferrer" className="btn book-btn">
                            Book this flight
                        </a>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default FlightSearch;
