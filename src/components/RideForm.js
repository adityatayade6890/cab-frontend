import React, { useState } from 'react';
import axios from 'axios';
// import BillPreview from './BillPreview';

const BASE_URL = process.env.REACT_APP_API_BASE_URL;

const RideForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    pickup: '',
    drop: '',
    distanceSource: 'manual',
    startKm: '',
    endKm: '',
    distanceKm: '',
    nightCharge: false,
    tollCharge: 0,
    paymentMode: 'Cash',
    driverName: '',
  });

  const [fare, setFare] = useState(null);
  // const [bill, setBill] = useState(null);
  // const [rideId, setRideId] = useState(null);
  // const [billNumber, setBillNumber] = useState(null);
  const [calculatedDistance, setCalculatedDistance] = useState(0);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => {
      const updatedForm = {
        ...prev,
        [name]: type === 'checkbox' ? checked : value,
      };

      if (
        updatedForm.distanceSource === 'manual' &&
        (name === 'startKm' || name === 'endKm')
      ) {
        const start = parseFloat(updatedForm.startKm || 0);
        const end = parseFloat(updatedForm.endKm || 0);
        const dist = end - start;
        setCalculatedDistance(dist > 0 ? dist : 0);
      }

      if (updatedForm.distanceSource === 'maps' && name === 'distanceKm') {
        const dist = parseFloat(value);
        setCalculatedDistance(dist > 0 ? dist : 0);
      }

      return updatedForm;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const distance =
      formData.distanceSource === 'manual'
        ? parseFloat(formData.endKm || 0) - parseFloat(formData.startKm || 0)
        : parseFloat(formData.distanceKm || 0);

    if (distance <= 0 || isNaN(distance)) {
      alert('Invalid distance. Please check odometer values.');
      return;
    }

    const payload = {
      customer: {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
      },
      pickup_location: formData.pickup,
      drop_location: formData.drop,
      distance_km: distance,
      distance_source: formData.distanceSource,
      start_km: parseInt(formData.startKm) || null,
      end_km: parseInt(formData.endKm) || null,
      night_charge: formData.nightCharge,
      toll_charge: parseFloat(formData.tollCharge),
      payment_mode: formData.paymentMode,
      driver_name: formData.driverName,
    };

    try {
      const res = await axios.post(`${BASE_URL}/api/rides`, payload);

      setFare(res.data.fare);
      // setBillNumber(res.data.billNumber);
      setRideId(res.data.rideId);

      setBill({
        customer_name: formData.name,
        pickup_location: formData.pickup,
        drop_location: formData.drop,
        distance_km: distance,
        night_charge: formData.nightCharge,
        toll_charge: parseFloat(formData.tollCharge),
        fare_total: res.data.fare,
        payment_mode: formData.paymentMode,
        driver_name: formData.driverName,
        bill_number: res.data.billNumber,
        created_at: new Date().toISOString(),
      });

      alert('✅ Ride added successfully!');
    } catch (err) {
      alert('❌ Failed to add ride');
      console.error(err);
    }
  };

  // const previewBill = () => {
  //   if (!rideId) return alert('No ride created yet');
  //   window.open(`${BASE_URL}/api/rides/${rideId}/preview`, '_blank');
  // };

  // const sendEmail = async () => {
  //   if (!rideId) return alert('No ride created yet');
  //   try {
  //     const res = await axios.post(`${BASE_URL}/api/rides/${rideId}/send`);
  //     if (res.data.success) {
  //       alert('📧 Invoice sent to customer email!');
  //     } else {
  //       alert('⚠️ Failed to send email: ' + res.data.error);
  //     }
  //   } catch (err) {
  //     console.error('Email error:', err);
  //     alert('❌ Email sending failed');
  //   }
  // };

  return (
    <form onSubmit={handleSubmit} className="card p-4">
      <h5>Customer Info</h5>
      <input className="form-control mb-2" name="name" placeholder="Name" onChange={handleChange} />
      <input className="form-control mb-2" name="email" placeholder="Email" onChange={handleChange} />
      <input className="form-control mb-3" name="phone" placeholder="Phone" onChange={handleChange} />

      <h5>Ride Info</h5>
      <input className="form-control mb-2" name="pickup" placeholder="Pickup Location" onChange={handleChange} />
      <input className="form-control mb-3" name="drop" placeholder="Drop Location" onChange={handleChange} />

      <div className="mb-3">
        <label><b>Distance Input:</b></label>
        <select name="distanceSource" className="form-select" onChange={handleChange}>
          <option value="manual">Manual KM Entry</option>
          <option value="maps">Google Maps</option>
        </select>
      </div>

      {formData.distanceSource === 'manual' ? (
        <>
          <input className="form-control" name="startKm" placeholder="Start KM" type="number" onChange={handleChange} />
          <input className="form-control mb-3" name="endKm" placeholder="End KM" type="number" onChange={handleChange} />
        </>
      ) : (
        <input className="form-control mb-3" name="distanceKm" placeholder="Distance (KM)" type="number" onChange={handleChange} />
      )}

      <div className="alert alert-info">
        <strong>Calculated Distance:</strong> {calculatedDistance} km
      </div>

      <div className="form-check mb-2">
        <input className="form-check-input" type="checkbox" name="nightCharge" onChange={handleChange} />
        <label className="form-check-label">Night Charge</label>
      </div>

      <input className="form-control mb-2" name="tollCharge" placeholder="Toll Charges (₹)" type="number" onChange={handleChange} />
      <input className="form-control mb-2" name="driverName" placeholder="Driver Name" onChange={handleChange} />

      <select className="form-select mb-3" name="paymentMode" onChange={handleChange}>
        <option value="Cash">Cash</option>
        <option value="UPI">UPI</option>
        <option value="Card">Card</option>
      </select>

      <button className="btn btn-primary">Submit Ride</button>

      {fare && (
        <div className="alert alert-success mt-3">
          <strong>Total Fare:</strong> ₹{fare.toFixed(2)}
        </div>
      )}

      {/* {rideId && (
        <div className="mt-3">
          <h6>🧾 Bill: {billNumber}</h6>
          <button className="btn btn-outline-dark me-2" onClick={previewBill}>🔍 Preview Bill</button>
          <button className="btn btn-success" onClick={sendEmail}>📧 Send Email</button>
        </div>
      )} */}

      {/* <BillPreview bill={bill} /> */}
    </form>
  );
};

export default RideForm;
