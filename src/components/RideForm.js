import React, { useState } from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import axios from 'axios';

const carDetails = {
  1: { model: 'Dzire', reg: 'MH14LB8443' },
  2: { model: 'Dzire', reg: 'MH14LB6365' },
  3: { model: 'Dzire', reg: 'MH14KA9157' },
  4: { model: 'Ertiga', reg: 'MH14KQ9461' },
  5: { model: 'Ertiga', reg: 'MH09GA2901' },
  6: { model: 'Ertiga', reg: 'MH14LF7494' },
  7: { model: 'Ertiga', reg: 'MH14LL5385' },
  8: { model: 'Dzire', reg: 'MH14LB9762' }
};

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




    // ====== HEADER ======
    //doc.setFont('helvetica', 'bold');
    //doc.setFontSize(20);
    //doc.setTextColor(200, 0, 0);
   // doc.text('STAR ENTERPRISES', 105, 15, { align: 'center' });

    //doc.setFontSize(10);
    //doc.setTextColor(0);
    //doc.setFont('helvetica', 'normal');
    //doc.text('GSTIN NO.: 27ANDPC5898G1ZR', 105, 23, { align: 'center' });
    //doc.text('S.No.70, Vitthal Residency, Flat No.504, Near Ganesh Temple, Suman Clinic,', 105, 28, { align: 'center' });
    //doc.text('Bhimashankar Nagar, Kiwale, Dehu Road, Pune - 412101', 105, 33, { align: 'center' });
    //doc.text('Email: starenterprises.bc@gmail.com | Contact: 9923739944 / 8484923319', 105, 38, { align: 'center' });

    //doc.setLineWidth(0.5);
    //doc.line(10, 41, 200, 41); // horizontal separator

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

    // ====== SUBJECT + ORDER ======
    doc.setFont('helvetica', 'bold');
    doc.text(`SUB: Submission of bill for the days of ${billData.invoiceDate}`, 14, 108);
    doc.setFont('helvetica', 'normal');
    doc.text(`Order By: ${billData.orderBy}`, 14, 115);
    doc.text(`Used By: ${billData.usedBy}`, 120, 115);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10)
    doc.text(`Trip Details: ${billData.tripDetails}`, 14, 121);

    // ====== BODY ======
    doc.setFont('helvetica', 'bold');
    doc.text("Respected Sir/Ma'am,", 14, 135);
    doc.setFont('helvetica', 'normal');
    doc.text("With reference to above subject, the vehicle was used for official purpose of the company.", 14, 140);
    doc.text("Please find attached enclose bill for the same.", 14, 145);

    // ====== VEHICLE ======
    doc.setFont('helvetica', 'bold');
    doc.text(`Vehicle No: ${billData.carRegNo} ${billData.carModel}`, 14, 150);

    // ====== TABLE ======
    autoTable(doc, {
      startY: 155,
      head: [[
        'Sr. No.',
        'Particular',
        'Qty / Days / Hrs / KM',
        'Rate (in Rs.)',
        'Amount (in Rs.)'
      ]],
      body: [
        ['1', 'Package Per Day', billData.packageQty, billData.packageRate, (billData.packageQty * billData.packageRate).toFixed(2)],
        ['2', 'Extra KM', billData.extraKmQty, billData.extraKmRate, (billData.extraKmQty * billData.extraKmRate).toFixed(2)],
        ['3', 'Extra Time', billData.extraTimeQty, billData.extraTimeRate, (billData.extraTimeQty * billData.extraTimeRate).toFixed(2)],
        ['4', 'Toll & Parking', '', '', Number(billData.toll).toFixed(2)],
        ['5', 'Driver Allowance', '', '', Number(billData.driverAllowance).toFixed(2)],
        ['', 'Total Bill Amount', '', '', billData.totalAmount.toFixed(2)]
      ],
      theme: 'grid',
      headStyles: {
        fillColor: [41, 146, 185],
        textColor: 300,
        fontStyle: 'bold',
      },
      styles: {
        fontSize: 10,
        fontStyle: 'bold',
        cellPadding: 3,
        halign: 'center'
      }
    });

    const finalY = doc.lastAutoTable.finalY + 10;

    // ====== AMOUNT IN WORDS ======
    doc.setFont('helvetica', 'bold');
    doc.text(`Total Bill Amount (in Words):`, 14, finalY);
    doc.setFont('helvetica', 'normal');
    doc.text(`${billData.totalInWords}`, 65, finalY);

    // ====== FOOTER ======
    doc.setFont('helvetica', 'normal');
    doc.text('Kindly requested to you, please release our payment at the earliest.', 14, finalY + 8);
    doc.setFont('helvetica', 'bold');
    doc.text('Bank A/C No: 02001119000023   |   IFSC Code: JPCB0000020', 14, finalY + 18);
    doc.text('Enclosed:', 14, finalY + 28);

    // ====== SIGNATURE ======
    doc.setFont('helvetica', 'bold');
    doc.text('Regards,', 200, finalY + 30, { align: 'right' });
    doc.text('STAR ENTERPRISES', 200, finalY + 35, { align: 'right' });
    
    doc.text('Authorized Signatory', 200, finalY + 55, { align: 'right' });

    // ====== SAVE PDF ======
    doc.save(`BILL_${billData.usedBy}_${billData.carModel}_${billData.invoiceDate}.pdf`);
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

    const selectedCar = carDetails[parseInt(carId)];
    const carDisplayString = `${selectedCar.model} ${selectedCar.reg}`;

    const data = {
      invoice_date: invoiceDate,
      order_by: orderBy,
      used_by: usedBy,
      trip_details: tripDetails,
      car: carDisplayString,
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
        invoiceNumber,
        carModel: selectedCar.model,
        carRegNo: selectedCar.reg
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
            <select name="carId" className="form-control" onChange={handleChange} value={form.carId}>
              <option value="">Select Car</option>
              <option value="1">Dzire MH14LB8443</option>
              <option value="2">Dzire MH14LB6365</option>
              <option value="3">Dzire MH14KA9157</option>
              <option value="4">Ertiga MH14KQ9461</option>
              <option value="5">Ertiga MH09GA2901</option>
              <option value="6">Ertiga MH14LF7494</option>
              <option value="7">Ertiga MH14LL5385</option>
              <option value="8">Dizre MH14LB9762</option>
             </select>
          </div>
        </div>

        <div className="row g-3">
          {[
            ['packageQty', 'Number of KM'], ['packageRate', 'Rate/KM'],
            ['extraKmQty', 'Extra KM'], ['extraKmRate', 'Rate/KM'],
            ['extraTimeQty', 'Extra Hrs'], ['extraTimeRate', 'Rate/Hr'],
            ['toll', 'Toll & Parking ₹'], ['driverAllowance', 'Driver Allowance ₹']
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
