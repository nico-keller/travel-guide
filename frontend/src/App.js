import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import PlanDetails from './pages/PlanDetails';
import CreatePlan from './pages/CreatePlan'; // Import the CreatePlan component

function App() {
    return (
        <Router>
            <div>
                <Navbar />
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/plans/:id" element={<PlanDetails />} />
                    <Route path="/create" element={<CreatePlan />} /> {/* New route */}
                </Routes>
            </div>
        </Router>
    );
}

export default App;
