// src/context/ItineraryContext.js
import React, { createContext, useState } from 'react';

// Create the Itinerary context
export const ItineraryContext = createContext();

// Provider component to wrap around the app
export const ItineraryProvider = ({ children }) => {
  const [itineraries, setItineraries] = useState([]);

  // Function to add an itinerary to the list
  const addItinerary = (newItinerary) => {
    setItineraries([...itineraries, newItinerary]);
  };

  return (
    <ItineraryContext.Provider value={{ itineraries, addItinerary }}>
      {children}
    </ItineraryContext.Provider>
  );
};

