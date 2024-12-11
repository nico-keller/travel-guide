import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, MapPin, Loader2 } from 'lucide-react';
import { getRandomDestination } from '../services/apiService';
import '../styles/Loading.css';
import '../styles/SharedStyles.css';
import '../styles/DestinationTinder.css';

const TravelDestinationExplorer = () => {
  const [currentDestination, setCurrentDestination] = useState(null);
  const [viewedDestinations, setViewedDestinations] = useState([]);
  const [selectedTravelPlan, setSelectedTravelPlan] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDestination();
  }, []);

  const fetchDestination = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await getRandomDestination();
      setCurrentDestination(response.data);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching destination:', error);
      setError(error);
      setIsLoading(false);
    }
  };

  const handleDismiss = () => {
    if (currentDestination) {
      setViewedDestinations(prev => {
        const updated = [...prev, currentDestination];
        return updated.slice(-5);
      });
      fetchDestination();
    }
  };

  const handleGetTravelPlan = () => {
    if (currentDestination) {
      navigate(`/create?location=${encodeURIComponent(currentDestination.name)}`);
    }
  };

  const closeSelectedPlan = () => {
    setSelectedTravelPlan(null);
  };

  const renderLoadingState = () => (
    <div className="destination-image-container">
      <div className="w-full h-full flex items-center justify-center">
        <Loader2 className="spin text-black mb-4" size={48} />
        <p className="loading-text text-center">Finding your next adventure...</p>
      </div>
    </div>
  );

  const renderErrorState = () => (
    <div className="flex flex-col items-center justify-center h-full text-red-500">
      <X size={48} className="mb-4" />
      <p>Oops! Unable to fetch destinations</p>
      <button 
        onClick={fetchDestination} 
        className="btn mt-4"
      >
        Try Again
      </button>
    </div>
  );

  return (
    <div className="destination-container">
      {selectedTravelPlan && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">{selectedTravelPlan.name} Travel Plan</h2>
              <button
                onClick={closeSelectedPlan}
                className="text-gray-600 hover:text-gray-900"
              >
                <X size={24} />
              </button>
            </div>
            <p className="mb-4">{selectedTravelPlan.travelPlan}</p>
          </div>
        </div>
      )}

      <h1 className="destination-title">Explore Destinations</h1>

      {isLoading ? (
        renderLoadingState()
      ) : error ? (
        renderErrorState()
      ) : currentDestination ? (
        <>
          <div className="relative mb-4 destination-image-container" style={{ height: '600px' }}>
            {currentDestination.imageUrl ? (
              <img
                src={currentDestination.imageUrl}
                alt={currentDestination.name}
                className="destination-image"
              />
            ) : (
              <div className="w-full h-full flex justify-center bg-gray-200 rounded-lg">
                <span className="text-gray-500">Image not available</span>
              </div>
            )}
          </div>

          <div className="destination-buttons">
            <button
              onClick={handleDismiss}
              className="btn btn-dislike p-3 rounded-full transition"
            >
              <X size={24} />
            </button>
           
            <button
              onClick={handleGetTravelPlan}
              className="btn btn-like p-3 rounded-full transition flex items-center"
            >
              <MapPin size={24} className="mr-2" /> Get Travel Plan
            </button>
          </div>

          <div className="destination-description">
            <h2 className="text-lg font-semibold">{currentDestination.name}</h2>
            <p className="text-sm">{currentDestination.description}</p>
          </div>
        </>
      ) : null}

      <div className="viewed-destinations">
        <h3 className="viewed-destinations-title">Skipped Destinations</h3>
        <div className="grid grid-cols-1 gap-2">
          {viewedDestinations.map((dest, index) => (
            <p key={index} className="viewed-destination">{dest.name}</p>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TravelDestinationExplorer;