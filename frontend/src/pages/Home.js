import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getTravelPlans, likePlan, dislikePlan } from '../services/apiService';  // Assume these functions are in your apiService

function Home() {
    const [plans, setPlans] = useState([]);

    useEffect(() => {
    getTravelPlans()
        .then(response => {
            setPlans(response.data);
        })
        .catch(error => console.error(error));
}, []);


    const handleLike = (id) => {
    likePlan(id)
        .then(response => {
            // Update the plan with the fresh data from the response
            setPlans(plans.map(plan =>
                plan.id === id ? { ...plan, likes: response.data.likes } : plan
            ));
        })
        .catch(error => console.error(error));
};

const handleDislike = (id) => {
    dislikePlan(id)
        .then(response => {
            // Update the plan with the fresh data from the response
            setPlans(plans.map(plan =>
                plan.id === id ? { ...plan, dislikes: response.data.dislikes } : plan
            ));
        })
        .catch(error => console.error(error));
};


    return (
        <div>
            <h1>Travel Plans</h1>
            <ul>
                {plans.map(plan => (
                    <li key={plan.id}>
                        <Link to={`/plans/${plan.id}`}>{plan.title}</Link>
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
