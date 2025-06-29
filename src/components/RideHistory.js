import React, { useEffect, useState } from 'react';
import axios from 'axios';
import generateBillPDF from '../utils/generatePdf';

const BASE_URL = process.env.REACT_APP_API_BASE_URL;

const RideHistory = () => {
  const [rides, setRides] = useState([]);
  const [filters, setFilters] = useState({
    driver: '',
    pickup: '',
    drop: '',
    payment_mode: '',
    from_date: '',
    to_date: ''
  });

  const fetchRides = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/rides`, { params: filters });
      setRides(res.data);
    } catch (err) {
      console.error('Error fetching rides:', err);
    }
  };

  useEffect(() => {
    fetchRides();
  }, [fetchRides]);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const applyFilters = () => {
    fetchRides();
  };

  return (
    <div>
      <h3 className="text-center mb-3">Ride History</h3>

      <div className="card p-3 mb-4">
        <div className="row g-3">
          <div className="col-md-3">
            <input
              name="driver"
              className="form-control"
              placeholder="Driver Name"
              onChange={handleFilterChange}
            />
          </div>
          <div className="col-md-3">
            <input
              name="pickup"
              className="form-control"
              placeholder="Pickup Location"
              onChange={handleFilterChange}
            />
          </div>
          <div className="col-md-3">
            <input
              name="drop"
              className="form-control"
              placeholder="Drop Location"
              onChange={handleFilterChange}
            />
          </div>
          <div className="col-md-3">
            <select
              name="payment_mode"
              className="form-select"
              onChange={handleFilterChange}
            >
              <option value="">Payment Mode</option>
              <option value="Cash">Cash</option>
              <option value="UPI">UPI</option>
              <option value="Card">Card</option>
            </select>
          </div>

          <div className="col-md-3">
            <label className="form-label">From Date</label>
            <input
              name="from_date"
              type="date"
              className="form-control"
              onChange={handleFilterChange}
            />
          </div>

          <div className="col-md-3">
            <label className="form-label">To Date</label>
            <input
              name="to_date"
              type="date"
              className="form-control"
              onChange={handleFilterChange}
            />
          </div>

          <div className="col-md-3 d-flex align-items-end">
            <button className="btn btn-primary w-100" onClick={applyFilters}>
              🔍 Apply Filters
            </button>
          </div>

          <div className="col-md-3 d-flex align-items-end">
            <button
              className="btn btn-secondary w-100"
              onClick={() => {
                setFilters({
                  driver: '', pickup: '', drop: '', payment_mode: '', from_date: '', to_date: ''
                });
                fetchRides(); // Refresh list
              }}
            >
              🔄 Reset
            </button>
          </div>
        </div>
      </div>

      <table className="table table-bordered table-striped">
        <thead className="table-dark">
          <tr>
            <th>#</th>
            <th>Customer</th>
            <th>Driver</th>
            <th>Pickup</th>
            <th>Drop</th>
            <th>Distance (km)</th>
            <th>Fare (₹)</th>
            <th>Payment</th>
            <th>Date</th>
            <th>PDF</th>
          </tr>
        </thead>
        <tbody>
          {rides.length === 0 && (
            <tr>
              <td colSpan="10" className="text-center">No rides found</td>
            </tr>
          )}
          {rides.map((ride, i) => (
            <tr key={ride.id}>
              <td>{i + 1}</td>
              <td>{ride.customer_name} ({ride.phone})</td>
              <td>{ride.driver_name}</td>
              <td>{ride.pickup_location}</td>
              <td>{ride.drop_location}</td>
              <td>{ride.distance_km}</td>
              <td>₹{ride.fare_total}</td>
              <td>{ride.payment_mode}</td>
              <td>{new Date(ride.created_at).toLocaleString()}</td>
              <td>
                <button
                  className="btn btn-sm btn-outline-primary"
                  onClick={() => generateBillPDF(ride)}
                >
                  📄 PDF
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RideHistory;
