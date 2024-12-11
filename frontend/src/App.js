import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import PlanDetails from './pages/PlanDetails';
import CreatePlan from './pages/CreatePlan';
import ImageGenerator from "./pages/ImageGenerator";
import FlightSearch from './pages/FlightSearch';
import DestinationTinder from './pages/DestinationTinder';
import './styles/App.css';

function App() {
    return (
        <Router>
            <div className="app-container">
                <header className="app-header">
                    <h1 className="app-title">Travel Guide</h1>
                    <Navbar />
                </header>
                <main className="main-content">
                    <Routes>
                        <Route path="/" element={<Home/>}/>
                        <Route path="/plans/:id" element={<PlanDetails/>}/>
                        <Route path="/create" element={<CreatePlan/>}/>
                        <Route path="/generate-image" element={<ImageGenerator />} />
                        <Route path="/search-flights" element={<FlightSearch />}/>
                        <Route path="/destination-tinder" element={<DestinationTinder />} />
                    </Routes>
                </main>
            </div>
        </Router>
    );
}

export default App;
