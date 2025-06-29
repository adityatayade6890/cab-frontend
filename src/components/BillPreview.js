// components/BillPreview.js
import React from 'react';

const BillPreview = ({ bill }) => {
  if (!bill) return null; // Prevent rendering if bill is undefined

  return (
    <div className="card mt-4 p-3">
      <h5>🔍 Bill Preview</h5>
      <p><strong>Customer:</strong> {bill.customer_name || bill.customer?.name || 'N/A'}</p>
      <p><strong>Driver:</strong> {bill.driver_name || 'N/A'}</p>
      <p><strong>Pickup:</strong> {bill.pickup_location || 'N/A'}</p>
      <p><strong>Drop:</strong> {bill.drop_location || 'N/A'}</p>
      <p><strong>Distance:</strong> {bill.distance_km} km</p>
      <p><strong>Toll:</strong> ₹{bill.toll_charge}</p>
      <p><strong>Night Charge:</strong> {bill.night_charge ? 'Yes' : 'No'}</p>
      <p><strong>Fare:</strong> ₹{bill.fare_total}</p>
      <p><strong>Payment Mode:</strong> {bill.payment_mode}</p>
    </div>
  );
};

export default BillPreview;
