import React, { useState } from 'react';
import axios from 'axios';

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
            setError(null);  // Reset error if search is successful
        } catch (error) {
            setError('Error fetching flight details');
            console.error(error);
        }
    };

    return (
        <div>
            <h1>Search Flights</h1>
            <form onSubmit={handleSearch}>
                <div>
                    <label>Departure Airport:</label>
                    <input
                        type="text"
                        value={departure}
                        onChange={(e) => setDeparture(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Arrival Airport:</label>
                    <input
                        type="text"
                        value={arrival}
                        onChange={(e) => setArrival(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Outbound Date:</label>
                    <input
                        type="date"
                        value={outboundDate}
                        onChange={(e) => setOutboundDate(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Return Date:</label>
                    <input
                        type="date"
                        value={returnDate}
                        onChange={(e) => setReturnDate(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Search Flights</button>
            </form>

            {/* Display error if exists */}
            {error && <p>{error}</p>}

            {/* Display flight results using the FlightResults component */}
            {flights && <FlightResults flights={flights.best_flights} />}
        </div>
    );
}

function FlightResults({ flights }) {
    if (flights.length === 0) return <p>No flights found.</p>;

    // Find the flight with the lowest price
    const cheapestFlight = flights.reduce((prev, curr) => {
        return prev.price < curr.price ? prev : curr;
    });

    return (
        <div>
            <h2>Cheapest Flight</h2>
            <div style={styles.flightCard}>
                <div style={styles.flightHeader}>
                    <img src={cheapestFlight.airline_logo} alt="Airline Logo" style={styles.logo} />
                    <h3>{cheapestFlight.flights[0].airline} - {cheapestFlight.flights[0].flight_number}</h3>
                </div>

                <div style={styles.flightInfo}>
                    <p><strong>Departure:</strong> {cheapestFlight.flights[0].departure_airport.name} at {cheapestFlight.flights[0].departure_airport.time}</p>
                    <p><strong>Arrival:</strong> {cheapestFlight.flights[0].arrival_airport.name} at {cheapestFlight.flights[0].arrival_airport.time}</p>
                    <p><strong>Duration:</strong> {cheapestFlight.total_duration} minutes</p>
                    <p><strong>Price:</strong> ${cheapestFlight.price}</p>
                </div>

                <div style={styles.extraInfo}>
                    <p><strong>Legroom:</strong> {cheapestFlight.flights[0].legroom}</p>
                    <p><strong>Carbon Emissions:</strong> {cheapestFlight.carbon_emissions.this_flight / 1000} kg</p>
                </div>
            </div>
        </div>
    );
}


const styles = {
    flightCard: {
        border: '1px solid #ddd',
        borderRadius: '8px',
        padding: '16px',
        margin: '16px 0',
        backgroundColor: '#f9f9f9',
    },
    flightHeader: {
        display: 'flex',
        alignItems: 'center',
    },
    logo: {
        height: '40px',
        marginRight: '16px',
    },
    flightInfo: {
        marginTop: '8px',
    },
    extraInfo: {
        marginTop: '16px',
        fontStyle: 'italic',
    }
};

export default FlightSearch;
