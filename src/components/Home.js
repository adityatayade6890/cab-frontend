import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css'; // You can create this file for extra styling if needed

const Home = () => {
  return (
    <div className="home-container d-flex flex-column align-items-center justify-content-center text-center py-5">
      <div className="bg-light rounded p-5 shadow-lg" style={{ maxWidth: '800px' }}>
        <h1 className="display-5 fw-bold mb-3 text-primary">
          🚖 Star Enterprises Cab Billing System
        </h1>
        <p className="lead text-secondary">
          Manage rides, generate professional bills, and export your reports—all in one place.
        </p>

        <div className="d-flex flex-column flex-md-row gap-3 justify-content-center mt-4">
          <Link to="/new-ride" className="btn btn-success btn-lg px-4">
            🚗 Book a Ride
          </Link>
          <Link to="/ride-history" className="btn btn-outline-primary btn-lg px-4">
            📜 View Ride History
          </Link>
          <Link to="/export" className="btn btn-outline-secondary btn-lg px-4">
            📤 Export Reports
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
