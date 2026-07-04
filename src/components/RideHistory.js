import React, { useEffect, useState } from 'react';
import axios from 'axios';
import generateBillPDF from '../utils/generatePdf';

const BASE_URL = process.env.REACT_APP_API_BASE_URL;

const RideHistory = () => {
  const [rides, setRides] = useState([]);
  const [filters, setFilters] = useState({
    invoice_number: "",
    company_name: "",
    vehicle: "",
    billing_type: "",
    payment_status: "",
    from_date: "",
    to_date: ""
  });

  const fetchBills = async () => {
    try {
      const res = await axios.get(
        `${BASE_URL}/api/bills`,
        {
          params: filters
        }
      );
      setRides(res.data);
    }
    catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchBills();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const applyFilters = () => {
    fetchBills();
  };

  

  // ====================================
  // CONVERT DATABASE BILL TO PDF FORMAT
  // ====================================
  
  const prepareBillForPDF = (bill) => {

    const carParts = (bill.car || "").split(" ");
  
    return {
      invoiceNumber: bill.invoice_number,
  
      invoiceDate: bill.invoice_date,
  
      useDate:
        bill.billing_type === "Daily"
          ? bill.use_date
          : `${bill.from_date} To ${bill.to_date}`,
  
      billingType: bill.billing_type,
  
      companyName: bill.company_name,
  
      orderBy: bill.order_by,
  
      usedBy: bill.used_by,
  
      tripDetails: bill.trip_details,
  
      carRegNo: carParts[1] || "",
  
      carModel: carParts[0] || "",
  
      selectedPackage: "",
  
      packageQty: Number(bill.package_qty),
  
      packageRate: Number(bill.package_rate),
  
      extraKmQty: Number(bill.extra_km_qty),
  
      extraKmRate: Number(bill.extra_km_rate),
  
      extraTimeQty: Number(bill.extra_time_qty),
  
      extraTimeRate: Number(bill.extra_time_rate),
  
      toll: Number(bill.toll),
  
      driverAllowance: Number(bill.driver_allowance),
  
      totalAmount: Number(bill.total)
    };
  };
  //==================================
  // DOWNLOAD PDF
  //==================================
  
  const downloadInvoice = (bill) => {

      const pdfData = prepareBillForPDF(bill);
  
      generateBillPDF(pdfData);
  
  };
  
  //==================================
  // MARK PAID
  //==================================
  
  const markPaid=async(id)=>{
  try{
  await axios.put(  `${BASE_URL}/api/bills/${id}/paid`  );
  fetchBills();
  }
  
  catch(err){
  console.error(err);
  }
  
  };

  return (
    <div>
        <h3 className="text-center mb-3">Ride History</h3>
  
        <div className="card p-3 mb-4">
          <div className="row g-3">
        <div className="col-md-3">
        
        <label>Invoice No</label>
        
        <input
        
        className="form-control"
        
        name="invoice_number"
        
        value={filters.invoice_number}
        
        onChange={handleFilterChange}
        
        />
        
        </div>
        
        <div className="col-md-3">
        
        <label>Company</label>
        
        <select
        
        className="form-select"
        
        name="company_name"
        
        value={filters.company_name}
        
        onChange={handleFilterChange}
        
        >
        
        <option value="">All</option>
        
        <option value="Finolex Industries">
        
        Finolex Industries
        
        </option>
        
        <option value="Company B">
        
        Company B
        
        </option>
        
        <option value="Company C">
        
        Company C
        
        </option>
        
        <option value="Company D">
        
        Company D
        
        </option>
        
        </select>
        
        </div>
        
        <div className="col-md-3">
        
        <label>Vehicle</label>
        
        <input
        
        className="form-control"
        
        name="vehicle"
        
        value={filters.vehicle}
        
        onChange={handleFilterChange}
        
        />
        
        </div>
        
        <div className="col-md-3">
        
        <label>Billing</label>
        
        <select
        
        className="form-select"
        
        name="billing_type"
        
        value={filters.billing_type}
        
        onChange={handleFilterChange}
        
        >
        
        <option value="">All</option>
        
        <option>Daily</option>
        
        <option>Weekly</option>
        
        <option>Bi-Monthly</option>
        
        <option>Monthly</option>
        
        </select>
        
        </div>
        
        <div className="col-md-3">
        
        <label>Payment</label>
        
        <select
        
        className="form-select"
        
        name="payment_status"
        
        value={filters.payment_status}
        
        onChange={handleFilterChange}
        
        >
        
        <option value="">All</option>
        
        <option>Pending</option>
        
        <option>Paid</option>
        
        </select>
        
        </div>
        
        <div className="col-md-3">
        
        <label>From Date</label>
        
        <input
        
        type="date"
        
        className="form-control"
        
        name="from_date"
        
        value={filters.from_date}
        
        onChange={handleFilterChange}
        
        />
        
        </div>
        
        <div className="col-md-3">
        
        <label>To Date</label>
        
        <input
        
        type="date"
        
        className="form-control"
        
        name="to_date"
        
        value={filters.to_date}
        
        onChange={handleFilterChange}
        
        />
        
        </div>
        
        <div className="col-md-3 d-flex align-items-end">
        
        <button
        
        className="btn btn-primary w-100"
        
        onClick={applyFilters}
        
        >
        
        🔍 Search
        
        </button>
        
        </div>
        
        <div className="col-md-3 d-flex align-items-end">
        
        <button
        
        className="btn btn-secondary w-100"
        
        onClick={async () => {
          const resetFilters = {
            invoice_number: "",
            company_name: "",
            vehicle: "",
            billing_type: "",
            payment_status: "",
            from_date: "",
            to_date: ""
          };
        
          setFilters(resetFilters);
        
          try {
            const res = await axios.get(`${BASE_URL}/api/bills`, {
              params: resetFilters
            });
        
            setRides(res.data);
          } catch (err) {
            console.error(err);
          }
        }}
        
          >
        
        Reset
        
        </button>
        
        </div>
        
        </div>
  
        <table className="table table-bordered table-hover">
          <thead className="table-dark">
            <tr>
              <th>#</th>
              <th>Invoice No</th>
              <th>Company</th>
              <th>Vehicle</th>
              <th>Billing</th>
              <th>Total</th>
              <th>Status</th>
              <th>Invoice Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {rides.length===0 && (
            <tr>
              <td colSpan="9" className="text-center">  No Bills Found </td>
            </tr>
              )}
             {rides.map((bill, index) => {
              const paymentStatus = bill.payment_status || "Pending";
            
              return (
                <tr key={bill.id}>
            
                  <td>{index + 1}</td>
            
                  <td>
                    <b>{bill.invoice_number}</b>
                  </td>
            
                  <td>{bill.company_name}</td>
            
                  <td>{bill.car}</td>
            
                  <td>{bill.billing_type}</td>
            
                  <td>₹{bill.total}</td>
            
                  <td>
                    <span
                      className={`badge rounded-pill ${
                        paymentStatus === "Paid"
                          ? "bg-success"
                          : "bg-danger"
                      }`}
                    >
                      {paymentStatus}
                    </span>
                  </td>
            
                  <td>
                    {new Date(bill.invoice_date).toLocaleDateString()}
                  </td>
            
                  <td>
                    <div className="d-flex gap-2">
            
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() => downloadInvoice(bill)}
                      >
                        📄
                      </button>
            
                      <button
                        className={
                          paymentStatus === "Paid"
                            ? "btn btn-warning btn-sm"
                            : "btn btn-success btn-sm"
                        }
                        onClick={() => markPaid(bill.id)}
                      >
                        {paymentStatus === "Paid" ? "Undo" : "Paid"}
                      </button>
            
                    </div>
                  </td>
            
                </tr>
              );
            })}
          </tbody>
        </table>
    </div>
  );
};

export default RideHistory;
