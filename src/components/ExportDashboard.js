import React, { useState } from 'react';
import axios from 'axios';

const BASE_URL = process.env.REACT_APP_API_BASE_URL;

const ExportDashboard = () => {
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  const handleExport = async () => {
    if (!fromDate || !toDate) {
      alert('Please select both dates');
      return;
    }

    try {
      const response = await axios.get(`${BASE_URL}/api/rides/export`, {
        params: { from: fromDate, to: toDate },
        responseType: 'blob', // For Excel file download
      });

      const blob = new Blob([response.data], {
        type: response.headers['content-type'],
      });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `Ride_Report_${fromDate}_to_${toDate}.xlsx`;
      link.click();
    } catch (error) {
      alert('❌ Export failed');
      console.error(error);
    }
  };

  return (
    <div className="container mt-4 card p-4">
      <h4>📤 Export Rides to Excel</h4>
      <div className="mb-3">
        <label>From:</label>
        <input
          type="date"
          className="form-control"
          value={fromDate}
          onChange={(e) => setFromDate(e.target.value)}
        />
      </div>
      <div className="mb-3">
        <label>To:</label>
        <input
          type="date"
          className="form-control"
          value={toDate}
          onChange={(e) => setToDate(e.target.value)}
        />
      </div>
      <button className="btn btn-success" onClick={handleExport}>
        📁 Export to Excel
      </button>
    </div>
  );
};

export default ExportDashboard;
