// src/components/Home.js
import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css'; // Optional: For custom styling if needed

const Home = () => (
  <div className="home-page">
    <header className="hero bg-dark text-white py-5 text-center">
      <div className="container">
        <h1 className="display-4 fw-bold">🚖 Star Enterprises Cab Billing</h1>
        <p className="lead">Seamless ride management, billing, and reports — all in one place.</p>
        <Link to="/new-ride" className="btn btn-warning btn-lg mt-3 shadow">
          Book a New Ride 🚗
        </Link>
      </div>
    </header>

    <section className="features container py-5">
      <div className="row text-center g-4">
        <div className="col-md-4">
          <div className="card h-100 shadow-sm">
            <div className="card-body">
              <h5 className="card-title">📄 Generate Bills</h5>
              <p className="card-text">Create professional PDF bills instantly for your rides.</p>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card h-100 shadow-sm">
            <div className="card-body">
              <h5 className="card-title">📋 Ride History</h5>
              <p className="card-text">View and filter past ride details for any date or driver.</p>
              <Link to="/ride-history" className="btn btn-outline-primary mt-2">View Rides</Link>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card h-100 shadow-sm">
            <div className="card-body">
              <h5 className="card-title">📊 Export Reports</h5>
              <p className="card-text">Download Excel reports with date-wise filtering.</p>
              <Link to="/export" className="btn btn-outline-success mt-2">Export</Link>
            </div>
          </div>
        </div>
      </div>
    </section>

    <footer className="bg-light text-center py-3 border-top mt-5">
      <p className="mb-0">&copy; {new Date().getFullYear()} Star Enterprises. All rights reserved.</p>
    </footer>
  </div>
);

export default Home;
