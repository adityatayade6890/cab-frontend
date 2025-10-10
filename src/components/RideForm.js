import React, { useState } from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import axios from 'axios';

// ✅ Package & Car Data
const packageOptions = {
  'Dzire Local (80 KM/8 Hr)': {
    model: 'Dzire',
    baseKm: 80,
    baseRate: 1400
  },
  'Ertiga Local (80 KM/8 Hr)': {
    model: 'Ertiga',
    baseKm: 80,
    baseRate: 1800
  },
  'Dzire Outstation (300 KM/Day)': {
    model: 'Dzire',
    baseKm: 300,
    baseRate: 2200
  },
  'Ertiga Outstation (300 KM/Day)': {
    model: 'Ertiga',
    baseKm: 300,
    baseRate: 2600
  }
};

// ✅ Car Details (Reg No.)
const carDetails = {
  Dzire: ['MH14LB8443', 'MH14LB6365', 'MH14KA9157', 'MH14LB9762'],
  Ertiga: ['MH14KQ9461', 'MH09GA2901', 'MH14LF7494', 'MH14LL5385']
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // 🧠 When package is selected, auto-fill model and base rate
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

  const numberToWords = (num) => {
    const a = [
      '',
      'One',
      'Two',
      'Three',
      'Four',
      'Five',
      'Six',
      'Seven',
      'Eight',
      'Nine',
      'Ten',
      'Eleven',
      'Twelve',
      'Thirteen',
      'Fourteen',
      'Fifteen',
      'Sixteen',
      'Seventeen',
      'Eighteen',
      'Nineteen'
    ];
    const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
    if ((num = num.toString()).length > 9) return 'overflow';
    const n = ('000000000' + num).substr(-9).match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
    if (!n) return;
    let str = '';
    str += n[1] !== '00' ? (a[+n[1]] || b[n[1][0]] + ' ' + a[n[1][1]]) + ' Crore ' : '';
    str += n[2] !== '00' ? (a[+n[2]] || b[n[2][0]] + ' ' + a[n[2][1]]) + ' Lakh ' : '';
    str += n[3] !== '00' ? (a[+n[3]] || b[n[3][0]] + ' ' + a[n[3][1]]) + ' Thousand ' : '';
    str += n[4] !== '0' ? (a[+n[4]] || b[n[4][0]] + ' ' + a[n[4][1]]) + ' Hundred ' : '';
    str +=
      n[5] !== '00'
        ? (str !== '' ? 'and ' : '') + (a[+n[5]] || b[n[5][0]] + ' ' + a[n[5][1]]) + ' '
        : '';
    return str.trim() + ' only';
  };

  // ✅ Generate PDF
  const generatePDF = (billData) => {
    const doc = new jsPDF('p', 'mm', 'a4');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.text(`INVOICE NO: ${billData.invoiceNumber}`, 14, 64);
    doc.text(`DATE: ${billData.invoiceDate}`, 180, 64, { align: 'right' });

    doc.setFontSize(10);
    doc.text('TO,', 14, 70);
    doc.setFont('helvetica', 'normal');
    doc.text('FINOLEX INDUSTRIES LTD.', 14, 75);
    doc.text('Email: fil@finolexind.com', 14, 80);

    doc.setFont('helvetica', 'bold');
    doc.text(`SUB: Bill for the days of ${billData.invoiceDate}`, 14, 90);
    doc.setFont('helvetica', 'normal');
    doc.text(`Order By: ${billData.orderBy}`, 14, 97);
    doc.text(`Used By: ${billData.usedBy}`, 120, 97);
    doc.text(`Trip: ${billData.tripDetails}`, 14, 103);
    doc.setFont('helvetica', 'bold');
    doc.text(`Vehicle: ${billData.carModel} (${billData.carRegNo})`, 14, 109);

    autoTable(doc, {
      startY: 120,
      head: [['Sr.', 'Particular', 'Qty', 'Rate ₹', 'Amount ₹']],
      body: [
        ['1', 'Package', billData.packageQty, billData.packageRate, billData.packageQty * billData.packageRate],
        ['2', 'Extra KM', billData.extraKmQty, billData.extraKmRate, billData.extraKmQty * billData.extraKmRate],
        ['3', 'Extra Time', billData.extraTimeQty, billData.extraTimeRate, billData.extraTimeQty * billData.extraTimeRate],
        ['4', 'Toll & Parking', '', '', billData.toll],
        ['5', 'Driver Allowance', '', '', billData.driverAllowance],
        ['6', 'Total Amount', '', '', billData.totalAmount.toFixed(2)]
      ],
      theme: 'grid',
      headStyles: { fillColor: [41, 146, 185], textColor: 255, fontStyle: 'bold' },
      styles: { halign: 'center', fontSize: 10 }
    });

    const finalY = doc.lastAutoTable.finalY + 10;
    doc.setFont('helvetica', 'bold');
    doc.text(`Total in Words: ${billData.totalInWords}`, 14, finalY);
    doc.text('STAR ENTERPRISES', 195, finalY + 20, { align: 'right' });
    doc.save(`Bill_${billData.carRegNo}.pdf`);
  };

  // ✅ Handle Bill Generation
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
        data.toll +
        data.driver_allowance;

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
        {/* Top Inputs */}
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

        {/* Package + Car */}
        <div className="row mb-3">
          <div className="col-md-6">
            <label>Package</label>
            <select className="form-control" name="selectedPackage" value={form.selectedPackage} onChange={handlePackageSelect}>
              <option value="">Select Package</option>
              {Object.keys(packageOptions).map((pkg) => (
                <option key={pkg} value={pkg}>
                  {pkg}
                </option>
              ))}
            </select>
          </div>
          <div className="col-md-6">
            <label>Vehicle (Reg. No)</label>
            <select className="form-control" name="carRegNo" value={form.carRegNo} onChange={handleChange} disabled={!form.carModel}>
              <option value="">Select Vehicle</option>
              {form.carModel &&
                carDetails[form.carModel]?.map((reg) => (
                  <option key={reg} value={reg}>
                    {reg}
                  </option>
                ))}
            </select>
          </div>
        </div>

        {/* Trip & Amounts */}
        <div className="row mb-3">
          <div className="col-md-12">
            <label>Trip Details</label>
            <input name="tripDetails" className="form-control" value={form.tripDetails} onChange={handleChange} />
          </div>
        </div>

        {/* Financial Inputs */}
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
