import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getTravelPlans, likePlan, dislikePlan } from '../services/apiService';

function Home() {
    const [plans, setPlans] = useState([]);
    const [sortOption, setSortOption] = useState('');  // Add state for sorting option

    useEffect(() => {
        getTravelPlans()
            .then(response => {
                setPlans(response.data);
            })
            .catch(error => console.error(error));
    }, []);

    // Function to sort plans alphabetically by title
    const sortAlphabetically = () => {
        const sortedPlans = [...plans].sort((a, b) => a.title.localeCompare(b.title));
        setPlans(sortedPlans);
    };


    const handleLike = (id) => {
        likePlan(id)
            .then(response => {
                setPlans(plans.map(plan =>
                    plan.id === id ? { ...plan, likes: response.data.likes } : plan
                ));
            })
            .catch(error => console.error(error));
    };

    const handleDislike = (id) => {
        dislikePlan(id)
            .then(response => {
                setPlans(plans.map(plan =>
                    plan.id === id ? { ...plan, dislikes: response.data.dislikes } : plan
                ));
            })
            .catch(error => console.error(error));
    };

    // Handle sorting selection change
    const handleSortChange = (e) => {
        setSortOption(e.target.value);

        if (e.target.value === 'alphabetical') {
            sortAlphabetically();
        }
    };

    return (
        <div>
            <h1>Travel Plans</h1>
            <div>
                <label htmlFor="sort">Sort By:</label>
                <select id="sort" value={sortOption} onChange={handleSortChange}>
                    <option value="">Select an option</option>
                    <option value="alphabetical">Alphabetically</option>
                </select>
            </div>
            <ul>
                {plans.map(plan => (
                    <li key={plan.id}>
                        <Link to={`/plans/${plan.id}`}>{plan.title}</Link>
                        <p><strong>Location:</strong> {plan.location}</p>
                        <div>
                            <button onClick={() => handleLike(plan.id)}>Like</button>
                            <button onClick={() => handleDislike(plan.id)}>Dislike</button>
                            <p>Likes: {plan.likes} | Dislikes: {plan.dislikes}</p>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default Home;
