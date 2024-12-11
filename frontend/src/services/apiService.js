import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:5000'; // Your backend URL

export const getTravelPlans = () =>
    axios.get(`${API_BASE_URL}/api/plans`);

export const createTravelPlan = (data) =>
    axios.post(`${API_BASE_URL}/api/plans`, data);

export const likePlan = (id) => {
    return axios.post(`${API_BASE_URL}/api/plans/${id}/like`);
};

export const dislikePlan = (id) => {
    return axios.post(`${API_BASE_URL}/api/plans/${id}/dislike`);
};

// Removed the old function for fetching 10 destinations
// export const getRandomDestinations = async () => {
//   return await axios.get(`${API_BASE_URL}/api/random-destinations`);
// };

export const getRandomDestination = async () => {
  return await axios.get(`${API_BASE_URL}/api/random-destination`);
};
