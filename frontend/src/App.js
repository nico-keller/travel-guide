import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import PlanDetails from './pages/PlanDetails';
import CreatePlan from './pages/CreatePlan'; // Import the CreatePlan component
import FlightSearch from './components/FlightSearch';

function App() {
    return (
        <Router>
            <div>
                <h1>Welcome to Travel Guide</h1>
                <Navbar/>
                <FlightSearch/>
                <Routes>
                    <Route path="/" element={<Home/>}/>
                    <Route path="/plans/:id" element={<PlanDetails/>}/>
                    <Route path="/create" element={<CreatePlan/>}/> {/* New route */}
                </Routes>
            </div>
        </Router>
    );
}

export default App;
