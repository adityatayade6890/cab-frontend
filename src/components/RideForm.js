import React, { useState } from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import axios from 'axios';

// ✅ Package & Car Data
const packageOptions = {
  'Dzire Local (80 KM/8 Hr)': { model: 'Dzire', baseKm: 80, baseRate: 1800 },
  'Ertiga Local (80 KM/8 Hr)': { model: 'Ertiga', baseKm: 80, baseRate: 2600 },
  'Dzire Outstation (300 KM/Day)': { model: 'Dzire', baseKm: 300, baseRate: 4200 },
  'Ertiga Outstation (300 KM/Day)': { model: 'Ertiga', baseKm: 300, baseRate: 4500 },
  'Toyota Local (80 KM/8 Hr)': { model: 'Innova', baseKm: 80, baseRate: 3500 },
  'Toyota Local (300 KM/Day)': { model: 'Innova', baseKm: 300, baseRate: 6000 },
  
};

// ✅ Car Details (Reg Numbers)
const carDetails = {
  Dzire: ['MH14LB8443', 'MH14LB6365', 'MH14KA9157', 'MH14LB9762', 'MH14LL6227', 'MH14LL7500'],
  Ertiga: ['MH14KQ9461', 'MH09GA2901', 'MH14LF7494', 'MH14LL5385'],
  Innova: ['MH14LL0444'],
};

const GenerateBillForm = () => {
  const [form, setForm] = useState({
    invoiceDate: '',
    orderBy: '',
    usedBy: '',
    tripDetails: '',
    selectedPackage: '',
    carModel: '',
    carRegNo: '',
    packageQty: 1,
    packageRate: '',
    extraKmQty: '',
    extraKmRate: '',
    extraTimeQty: '',
    extraTimeRate: '',
    toll: '',
    driverAllowance: ''
  });

  // Handle Input Change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Auto-fill fields on package selection
  const handlePackageSelect = (e) => {
    const pkgName = e.target.value;
    setForm((prev) => ({
      ...prev,
      selectedPackage: pkgName,
      carModel: packageOptions[pkgName]?.model || '',
      packageRate: packageOptions[pkgName]?.baseRate || '',
      packageQty: 1,
      carRegNo: ''
    }));
  };

  // Convert number to words
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

  // ✅ Generate PDF with full professional structure
  const generatePDF = (billData) => {
    const doc = new jsPDF('p', 'mm', 'a4');

    // ====== HEADER ======
    /*doc.setFont('helvetica', 'bold');
    doc.setFontSize(20);
    doc.setTextColor(200, 0, 0);
    doc.text('STAR ENTERPRISES', 105, 15, { align: 'center' });

    doc.setFontSize(10);
    doc.setTextColor(0);
    doc.setFont('helvetica', 'normal');
    doc.text('GSTIN NO.: 27ANDPC5898G1ZR', 105, 20, { align: 'center' });
    doc.text('S.No.70, Vitthal Residency, Flat No.504, Near Ganesh Temple, Bhimashankar Nagar,', 105, 25, { align: 'center' });
    doc.text('Kiwale, Dehu Road, Pune - 412101', 105, 30, { align: 'center' });
    doc.text('Email: starenterprises.bc@gmail.com | Contact: 9923739944 / 8484923319', 105, 35, { align: 'center' });
    doc.line(10, 38, 200, 38); */

    // ====== INVOICE INFO ======
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.text(`INVOICE NO: ${billData.invoiceNumber}`, 14, 64);
    doc.text(`DATE: ${billData.invoiceDate}`, 180, 64, { align: 'right' });

    // ====== TO Section ======
    doc.setFontSize(10);
    doc.text('TO,', 14, 70);
    doc.setFont('helvetica', 'normal');
    doc.text('FINOLEX INDUSTRIES LTD.', 14, 75);
    doc.text('11th Floor, IndiQube Kode, Survey No 134, Hissa No.1/38, CTS No.2265 to 2273', 14, 80);
    doc.text('Email: fil@finolexind.com', 14, 85);
    doc.text('GSTIN: 27AAACF2634A1Z9', 14, 90);
    doc.text('State Code: 27 (Maharashtra)', 14, 95);
    doc.text('SAC Code: 996601', 14, 100);

    // ====== SUBJECT ======
    doc.setFont('helvetica', 'bold');
    doc.text(`SUB: Submission of bill for the days of – ${billData.invoiceDate}`, 14, 108);
    doc.setFont('helvetica', 'normal');
    doc.text(`Order By: ${billData.orderBy}`, 14, 115);
    doc.text(`Used By: ${billData.usedBy}`, 120, 115);
    doc.text(`Trip Details: ${billData.tripDetails}`, 14, 120);

    // ====== BODY ======
    doc.setFont('helvetica', 'bold');
    doc.text("Respected Sir/Ma'am,", 14, 135);
    doc.setFont('helvetica', 'normal');
    doc.text("With reference to above subject, the vehicle was used for official purpose of the company.", 14, 140);
    doc.text("Please find enclosed the bill for the same.", 14, 145);

    // ====== VEHICLE ======
    doc.setFont('helvetica', 'bold');
    doc.text(`Vehicle No: ${billData.carRegNo} (${billData.carModel}) | Package: ${billData.selectedPackage}`, 14, 150);

    // ====== TABLE ======
    autoTable(doc, {
      startY: 155,
      head: [['Sr. No.', 'Particular', 'Qty/Days/Hrs/KM', 'Rate (Rs.)', 'Amount (Rs.)']],
      body: [
        ['1', 'Package Per Day', billData.packageQty, billData.packageRate, billData.packageQty * billData.packageRate],
        ['2', 'Extra KM', billData.extraKmQty, billData.extraKmRate, billData.extraKmQty * billData.extraKmRate],
        ['3', 'Extra Time', billData.extraTimeQty, billData.extraTimeRate, billData.extraTimeQty * billData.extraTimeRate],
        ['4', 'Toll & Parking', '', '', billData.toll],
        ['5', 'Driver Allowance', '', '', billData.driverAllowance],
        ['', 'Total Bill Amount', '', '', billData.totalAmount.toFixed(2)]
      ],
      theme: 'grid',
      headStyles: { fillColor: [41, 146, 185], textColor: 255, fontStyle: 'bold' },
      styles: { fontSize: 12, cellPadding: 3, halign: 'center', fontStyle: 'bold' }
    });

    const finalY = doc.lastAutoTable.finalY + 10;
    doc.setFont('helvetica', 'bold');
    doc.text(`Total Bill Amount (in Words): ${billData.totalInWords}`, 14, finalY);
    doc.setFont('helvetica', 'bold');
    doc.text('Kindly requested to you, please release our payment at the earliest.', 14, finalY + 8);
    doc.text('Bank A/C No: 02001119000023 | IFSC: JPCB0000020', 14, finalY + 18);
    doc.text('Enclosed: Supporting Documents', 14, finalY + 28);

    // ====== SIGNATURE ======
    doc.setFont('helvetica', 'bold');
    doc.text('Regards,', 200, finalY + 28, { align: 'right' });
    doc.text('STAR ENTERPRISES', 200, finalY + 33, { align: 'right' });
    doc.text('Authorized Signatory', 200, finalY + 50, { align: 'right' });

    doc.save(`Bill_${billData.carRegNo}.pdf`);
  };

  // ====== Handle Bill Generation ======
  const handleGenerateBill = async () => {
    const { invoiceDate, orderBy, usedBy, tripDetails, carModel, carRegNo } = form;
    if (!invoiceDate || !orderBy || !usedBy || !tripDetails || !form.selectedPackage || !carRegNo) {
      alert('⚠️ Please fill all required fields.');
      return;
    }

    const carDisplayString = `${carModel} ${carRegNo}`;
    const data = {
      invoice_date: invoiceDate,
      order_by: orderBy,
      used_by: usedBy,
      trip_details: tripDetails,
      car: carDisplayString,
      package_qty: +form.packageQty,
      package_rate: +form.packageRate,
      extra_km_qty: +form.extraKmQty,
      extra_km_rate: +form.extraKmRate,
      extra_time_qty: +form.extraTimeQty,
      extra_time_rate: +form.extraTimeRate,
      toll: +form.toll,
      driver_allowance: +form.driverAllowance
    };

    try {
      const baseUrl = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';
      const res = await axios.post(`${baseUrl}/api/bills`, data);
      const invoiceNumber = res.data.invoice_number;

      const totalAmount =
        data.package_qty * data.package_rate +
        data.extra_km_qty * data.extra_km_rate +
        data.extra_time_qty * data.extra_time_rate +
        data.toll + data.driver_allowance;

      const pdfData = {
        ...form,
        totalAmount,
        totalInWords: numberToWords(Math.round(totalAmount)),
        invoiceNumber
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
        {/* Header Inputs */}
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

        {/* Package & Vehicle */}
        <div className="row mb-3">
          <div className="col-md-6">
            <label>Package</label>
            <select className="form-control" name="selectedPackage" value={form.selectedPackage} onChange={handlePackageSelect}>
              <option value="">Select Package</option>
              {Object.keys(packageOptions).map(pkg => (
                <option key={pkg} value={pkg}>{pkg}</option>
              ))}
            </select>
          </div>
          <div className="col-md-6">
            <label>Vehicle (Reg. No)</label>
            <select className="form-control" name="carRegNo" value={form.carRegNo} onChange={handleChange} disabled={!form.carModel}>
              <option value="">Select Vehicle</option>
              {form.carModel && carDetails[form.carModel]?.map(reg => (
                <option key={reg} value={reg}>{reg}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Trip Details */}
        <div className="row mb-3">
          <div className="col-md-12">
            <label>Trip Details</label>
            <input name="tripDetails" className="form-control" value={form.tripDetails} onChange={handleChange} />
          </div>
        </div>

        {/* Charges */}
        <div className="row g-3">
          {[
            ['packageQty', 'Days'],
            ['packageRate', 'Rate/Day'],
            ['extraKmQty', 'Extra KM'],
            ['extraKmRate', 'Rate/KM'],
            ['extraTimeQty', 'Extra Hrs'],
            ['extraTimeRate', 'Rate/Hr'],
            ['toll', 'Toll ₹'],
            ['driverAllowance', 'Driver Allowance ₹']
          ].map(([name, placeholder]) => (
            <div className="col-md-3" key={name}>
              <input name={name} placeholder={placeholder} className="form-control" value={form[name]} onChange={handleChange} />
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
