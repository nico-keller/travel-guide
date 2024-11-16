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

    useEffect(() => {
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

    const sortAlphabetically = () => {
        const sortedPlans = [...plans].sort((a, b) => a.title.localeCompare(b.title));
        setPlans(sortedPlans);
    };

    const handleSortChange = (e) => {
        setSortOption(e.target.value);
        if (e.target.value === 'alphabetical') {
            sortAlphabetically();
        }
    };

    return (
        <div className="home-container">
            <h1 className="page-title">Travel Plans</h1>
            
            <div className="controls-container">
                <SearchBar 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                
                <div className="sort-container">
                    <div className="sort-wrapper">
                        <span className="sort-icon">🔄</span>
                        <select 
                            id="sort" 
                            value={sortOption} 
                            onChange={handleSortChange}
                            className="sort-select"
                        >
                            <option value="">Sort By</option>
                            <option value="alphabetical">A-Z</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className="plans-grid">
                {loading ? (
                    Array(6).fill().map((_, index) => (
                        <SkeletonCard key={index} />
                    ))
                ) : (
                    plans.map(plan => (
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
                                    className="btn btn-like"
                                >
                                    <span>👍 {plan.likes}</span>
                                </button>
                                <button 
                                    onClick={() => handleDislike(plan.id)}
                                    className="btn btn-dislike"
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
