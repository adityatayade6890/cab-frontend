import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => (
  <div className="text-center">
    <h1>🚖 Welcome to Star Enterprises Cab Billing System</h1>
    <p className="lead mt-3">Easily generate bills, manage rides, and export reports.</p>
    <Link to="/new-ride" className="btn btn-primary mt-3">Book a Ride</Link>
  </div>
);

export default Home;
