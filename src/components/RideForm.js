import React, { useState, useEffect } from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import axios from 'axios';

const GenerateBillForm = () => {
  const [form, setForm] = useState({
    invoiceDate: '',
    orderBy: '',
    usedBy: '',
    tripDetails: '',
    carId: '',
    packageQty: '',
    packageRate: '',
    extraKmQty: '',
    extraKmRate: '',
    extraTimeQty: '',
    extraTimeRate: '',
    toll: '',
    driverAllowance: ''
  });

  const [cars, setCars] = useState([]);

  // 🔄 Fetch Cars
  useEffect(() => {
    axios.get('/api/bills/cars')
      .then(res => {
        setCars(res.data); // ✅ assume res.data is already an array
      })
      .catch(err => {
        console.error('❌ Error fetching cars:', err);
        setCars([]);
      });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const numberToWords = (num) => {
    const a = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten',
      'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
    const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
    if ((num = num.toString()).length > 9) return 'overflow';
    const n = ('000000000' + num).substr(-9).match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
    if (!n) return;
    let str = '';
    str += n[1] !== '00' ? (a[+n[1]] || b[n[1][0]] + ' ' + a[n[1][1]]) + ' Crore ' : '';
    str += n[2] !== '00' ? (a[+n[2]] || b[n[2][0]] + ' ' + a[n[2][1]]) + ' Lakh ' : '';
    str += n[3] !== '00' ? (a[+n[3]] || b[n[3][0]] + ' ' + a[n[3][1]]) + ' Thousand ' : '';
    str += n[4] !== '0' ? (a[+n[4]] || b[n[4][0]] + ' ' + a[n[4][1]]) + ' Hundred ' : '';
    str += n[5] !== '00' ? ((str !== '') ? 'and ' : '') + (a[+n[5]] || b[n[5][0]] + ' ' + a[n[5][1]]) + ' ' : '';
    return str.trim() + ' only';
  };

  const generatePDF = (billData) => {
    const doc = new jsPDF('p', 'mm', 'a4');
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(200, 0, 0);
    doc.setFontSize(20);
    doc.text('STAR ENTERPRISES', 105, 15, { align: 'center' });

    doc.setFontSize(10);
    doc.setTextColor(0);
    doc.setFont('helvetica', 'normal');
    doc.text('GSTIN NO.: 27ANDPC5898G1ZR', 105, 20, { align: 'center' });
    doc.text('Vitthal Residency, Kiwale, Pune - 412101', 105, 25, { align: 'center' });
    doc.text('Email: starenterprises.bc@gmail.com', 105, 30, { align: 'center' });
    doc.line(10, 35, 200, 35);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.text(`INVOICE NO: ${billData.invoiceNumber}`, 14, 42);
    doc.text(`DATE: ${billData.invoiceDate}`, 160, 42);

    doc.setFontSize(10);
    doc.text('TO,', 14, 50);
    doc.setFont('helvetica', 'normal');
    doc.text('FINOLEX INDUSTRIES LTD.', 14, 55);
    doc.text('Survey No 134, IndiQube, Pune', 14, 60);
    doc.text('Email: fil@finolexind.com', 14, 65);

    doc.setFont('helvetica', 'bold');
    doc.text(`SUB: Submission of bill for the days of – ${billData.invoiceDate}`, 14, 72);
    doc.setFont('helvetica', 'normal');
    doc.text(`Used By: ${billData.usedBy}`, 160, 72, { align: 'right' });
    doc.text(`Order By: ${billData.orderBy}`, 14, 77);
    doc.text(`Trip: ${billData.tripDetails}`, 14, 82);
    doc.setFont('helvetica', 'bold');
    doc.text(`Vehicle: ${billData.carModel} (${billData.carRegNo})`, 14, 88);

    autoTable(doc, {
      startY: 95,
      head: [['Sr.', 'Particular', 'Qty', 'Rate ₹', 'Amount ₹']],
      body: [
        ['1', 'Package', billData.packageQty, billData.packageRate, billData.packageQty * billData.packageRate],
        ['2', 'Extra KM', billData.extraKmQty, billData.extraKmRate, billData.extraKmQty * billData.extraKmRate],
        ['3', 'Extra Time', billData.extraTimeQty, billData.extraTimeRate, billData.extraTimeQty * billData.extraTimeRate],
        ['4', 'Toll', '', '', billData.toll],
        ['5', 'Driver Allowance', '', '', billData.driverAllowance],
        ['6', 'Total Amount', '', '', billData.totalAmount.toFixed(2)]
      ],
      theme: 'grid',
      headStyles: { fillColor: [60, 60, 60], textColor: 255 },
      styles: { halign: 'center', fontSize: 10 }
    });

    const finalY = doc.lastAutoTable.finalY + 10;
    doc.setFont('helvetica', 'bold');
    doc.text(`Total Amount (in Words): ${billData.totalInWords}`, 14, finalY);
    doc.text('STAR ENTERPRISES', 195, finalY + 20, { align: 'right' });

    doc.save(`Bill_${billData.carRegNo}.pdf`);
  };

  const handleGenerateBill = async () => {
    const {
      invoiceDate, orderBy, usedBy, tripDetails, carId,
      packageQty, packageRate, extraKmQty, extraKmRate,
      extraTimeQty, extraTimeRate, toll, driverAllowance
    } = form;

    if (!invoiceDate || !orderBy || !usedBy || !tripDetails || !carId) {
      alert('⚠️ Please fill all required fields.');
      return;
    }

    const data = {
      invoice_date: invoiceDate,
      order_by: orderBy,
      used_by: usedBy,
      trip_details: tripDetails,
      car_id: carId,
      package_qty: +packageQty,
      package_rate: +packageRate,
      extra_km_qty: +extraKmQty,
      extra_km_rate: +extraKmRate,
      extra_time_qty: +extraTimeQty,
      extra_time_rate: +extraTimeRate,
      toll: +toll,
      driver_allowance: +driverAllowance
    };

    try {
      const res = await axios.post('/api/bills', data);
      const invoiceNumber = res.data.invoice_number;

      const selectedCar = cars.find(c => String(c.id) === String(carId));
      const totalAmount =
        data.package_qty * data.package_rate +
        data.extra_km_qty * data.extra_km_rate +
        data.extra_time_qty * data.extra_time_rate +
        data.toll + data.driver_allowance;

      const pdfData = {
        ...form,
        totalAmount,
        totalInWords: numberToWords(Math.round(totalAmount)),
        invoiceNumber,
        carModel: selectedCar.model_name,
        carRegNo: selectedCar.vehicle_number
      };

      generatePDF(pdfData);
    } catch (err) {
      alert('❌ Failed to generate bill.');
      console.error(err);
    }
  };

  return (
    <div className="container mt-4">
      <h3 className="text-center">🧾 Generate Bill</h3>
      <div className="card p-4">
        <div className="row mb-3">
          <div className="col-md-4">
            <label>Date</label>
            <input type="date" name="invoiceDate" className="form-control" value={form.invoiceDate} onChange={handleChange} />
          </div>
          <div className="col-md-4">
            <label>Order By</label>
            <input name="orderBy" className="form-control" value={form.orderBy} onChange={handleChange} />
          </div>
          <div className="col-md-4">
            <label>Used By</label>
            <input name="usedBy" className="form-control" value={form.usedBy} onChange={handleChange} />
          </div>
        </div>

        <div className="row mb-3">
          <div className="col-md-6">
            <label>Trip Details</label>
            <input name="tripDetails" className="form-control" value={form.tripDetails} onChange={handleChange} />
          </div>
          <div className="col-md-6">
            <label>Vehicle</label>
            <select
              name="carId"
              className="form-control"
              onChange={handleChange}
              value={form.carId}
              disabled={cars.length === 0}
            >
              <option value="">Select Car</option>
              {Array.isArray(cars) && cars.map(car => (
                <option key={car.id} value={car.id}>
                  {car.model_name} - {car.vehicle_number}
                </option>
              ))}

            </select>
          </div>
        </div>

        <div className="row g-3">
          {[
            ['packageQty', 'Days'], ['packageRate', 'Rate/Day'],
            ['extraKmQty', 'Extra KM'], ['extraKmRate', 'Rate/KM'],
            ['extraTimeQty', 'Extra Hrs'], ['extraTimeRate', 'Rate/Hr'],
            ['toll', 'Toll ₹'], ['driverAllowance', 'Driver Allowance ₹']
          ].map(([name, placeholder]) => (
            <div className="col-md-3" key={name}>
              <input
                name={name}
                placeholder={placeholder}
                className="form-control"
                value={form[name]}
                onChange={handleChange}
              />
            </div>
          ))}
        </div>

        <button className="btn btn-success mt-4" onClick={handleGenerateBill}>
          📄 Generate PDF
        </button>
      </div>
    </div>
  );
};

export default GenerateBillForm;
