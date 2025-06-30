import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import RideForm from './components/RideForm';
import Home from './components/Home';
// import ExportDashboard from './components/ExportDashboard';
// import Navbar from './components/Navbar';
// import RideHistory from './components/RideHistory';

function App() {
  return (
    <Router>
      <Navbar />
      <div className="container mt-4">
        <h2 className="text-center mb-4">Cab Billing System</h2>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/new-ride" element={<RideForm />} />
          {/* <Route path="/export-dashboard" element={<ExportDashboard />} />
          <Route path="/ride-history" element={<RideHistory />} /> */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
