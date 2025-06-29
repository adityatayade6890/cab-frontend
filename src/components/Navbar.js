// src/components/Navbar.js
import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => (
  <nav className="navbar navbar-expand-lg navbar-dark bg-dark mb-4">
    <div className="container-fluid">
      <Link className="navbar-brand" to="/">🚖 Star Enterprises</Link>

      <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
        <span className="navbar-toggler-icon"></span>
      </button>

      <div className="collapse navbar-collapse" id="navbarNav">
        <ul className="navbar-nav ms-auto">
          <li className="nav-item">
            <Link className="nav-link" to="/new-ride">New Ride</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/ride-history">Ride History</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/export-dashboard">Export</Link>
          </li>
        </ul>
      </div>
    </div>
  </nav>
);

export default Navbar;
