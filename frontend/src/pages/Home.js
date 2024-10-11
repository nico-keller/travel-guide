import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getTravelPlans } from '../services/apiService';

function Home() {
    const [plans, setPlans] = useState([]);

    useEffect(() => {
        getTravelPlans()
            .then(response => setPlans(response.data))
            .catch(error => console.error(error));
    }, []);

    return (
        <div>
            <h1>Travel Plans</h1>
            <ul>
                {plans.map(plan => (
                    <li key={plan.id}>
                        <Link to={`/plans/${plan.id}`}>{plan.title}</Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default Home;
