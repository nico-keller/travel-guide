import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getTravelPlans, likePlan, dislikePlan } from '../services/apiService';
import SearchBar from '../components/SearchBar';
import SkeletonCard from '../components/SkeletonCard';
import '../styles/Home.css';

function Home() {
    const [plans, setPlans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sortOption, setSortOption] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [interactions, setInteractions] = useState({}); // Track likes/dislikes

    useEffect(() => {
        // Load interactions from localStorage
        const storedInteractions = JSON.parse(localStorage.getItem('interactions')) || {};
        setInteractions(storedInteractions);

        getTravelPlans()
            .then(response => {
                setPlans(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error(error);
                setLoading(false);
            });
    }, []);

    useEffect(() => {
        // Update localStorage whenever interactions change
        localStorage.setItem('interactions', JSON.stringify(interactions));
    }, [interactions]);

    const handleLike = (id) => {
        if (interactions[id]) {
            alert('You have already liked or disliked this post.');
            return;
        }

        likePlan(id)
            .then(response => {
                setPlans(plans.map(plan =>
                    plan.id === id ? { ...plan, likes: response.data.likes } : plan
                ));
                setInteractions({ ...interactions, [id]: 'liked' });
            })
            .catch(error => console.error(error));
    };

    const handleDislike = (id) => {
        if (interactions[id]) {
            alert('You have already liked or disliked this post.');
            return;
        }

        dislikePlan(id)
            .then(response => {
                setPlans(plans.map(plan =>
                    plan.id === id ? { ...plan, dislikes: response.data.dislikes } : plan
                ));
                setInteractions({ ...interactions, [id]: 'disliked' });
            })
            .catch(error => console.error(error));
    };

    const sortAlphabetically = () => {
        const sortedPlans = [...plans].sort((a, b) => a.title.localeCompare(b.title));
        setPlans(sortedPlans);
    };

    const sortLocation = () => {
        const sortedPlans = [...plans].sort((a, b) => a.location.localeCompare(b.location));
        setPlans(sortedPlans);
    };

    const handleSortChange = (e) => {
        setSortOption(e.target.value);
        if (e.target.value === 'alphabetical') {
            sortAlphabetically();
        } else if (e.target.value === 'location') {
            sortLocation();
        }
    };

    const filteredPlans = plans.filter(plan =>
        plan.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        plan.location.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="home-container">
            <h1 className="page-title">Travel Plans</h1>
            
            <div className="controls-container">
                <SearchBar 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                
                <div className="sort-container">
                    <select 
                        value={sortOption} 
                        onChange={handleSortChange}
                        className="sort-select"
                    >
                        <option value="">🔄 Sort By </option>
                        <option value="alphabetical">A-Z</option>
                        <option value="location">Location</option>
                    </select>
                </div>
            </div>

            <div className="plans-grid">
                {loading ? (
                    Array(6).fill().map((_, index) => (
                        <SkeletonCard key={index} />
                    ))
                ) : (
                    filteredPlans.map(plan => (
                        <div key={plan.id} className="plan-card">
                            <Link to={`/plans/${plan.id}`} className="plan-title">
                                {plan.title}
                            </Link>
                            <p className="plan-location">
                                <span className="label">Location:</span> {plan.location}
                            </p>
                            <div className="interaction-buttons">
                                <button 
                                    onClick={() => handleLike(plan.id)}
                                    className={`btn btn-like ${interactions[plan.id] === 'liked' ? 'disabled' : ''}`}
                                    disabled={!!interactions[plan.id]}
                                >
                                    <span>👍 {plan.likes}</span>
                                </button>
                                <button 
                                    onClick={() => handleDislike(plan.id)}
                                    className={`btn btn-dislike ${interactions[plan.id] === 'disliked' ? 'disabled' : ''}`}
                                    disabled={!!interactions[plan.id]}
                                >
                                    <span>👎 {plan.dislikes}</span>
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

export default Home;