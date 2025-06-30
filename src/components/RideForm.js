import React, { useState } from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const GenerateBillForm = () => {
  const [form, setForm] = useState({
    invoiceDate: '',
    invoiceNumber: '',
    orderBy: '',
    usedBy: '',
    tripDetails: '',
    vehicleNumber: '',
    packageQty: '',
    packageRate: '',
    extraKmQty: '',
    extraKmRate: '',
    extraTimeQty: '',
    extraTimeRate: '',
    toll: '',
    driverAllowance: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const numberToWords = (num) => {
    const a = ['', 'One','Two','Three','Four','Five','Six','Seven','Eight','Nine','Ten','Eleven','Twelve','Thirteen','Fourteen','Fifteen','Sixteen','Seventeen','Eighteen','Nineteen'];
    const b = ['', '', 'Twenty','Thirty','Forty','Fifty','Sixty','Seventy','Eighty','Ninety'];
    if ((num = num.toString()).length > 9) return 'overflow';
    let n = ('000000000' + num).substr(-9).match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
    if (!n) return;
    let str = '';
    str += n[1] != 0 ? (a[Number(n[1])] || b[n[1][0]] + ' ' + a[n[1][1]]) + ' Crore ' : '';
    str += n[2] != 0 ? (a[Number(n[2])] || b[n[2][0]] + ' ' + a[n[2][1]]) + ' Lakh ' : '';
    str += n[3] != 0 ? (a[Number(n[3])] || b[n[3][0]] + ' ' + a[n[3][1]]) + ' Thousand ' : '';
    str += n[4] != 0 ? (a[Number(n[4])] || b[n[4][0]] + ' ' + a[n[4][1]]) + ' Hundred ' : '';
    str += n[5] != 0 ? ((str != '') ? 'and ' : '') + (a[Number(n[5])] || b[n[5][0]] + ' ' + a[n[5][1]]) + ' ' : '';
    return str.trim() + ' only';
  };

  const generatePDF = (billData) => {
    const doc = new jsPDF({ unit: 'mm', format: 'a4' });

    // Header
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(20);
    doc.setTextColor(200, 0, 0);
    doc.text('STAR ENTERPRISES', 105, 15, { align: 'center' });

    doc.setFontSize(10);
    doc.setTextColor(0);
    doc.setFont('helvetica', 'normal');
    doc.text('GSTIN NO.: 27ANDPC5898G1ZR', 105, 21, { align: 'center' });
    doc.text('S.No.70, Vitthal Residency, Flat No.504, Near Ganesh Temple, Suman Clinic, Kiwale, Dehu Road, Pune - 412101', 105, 26, { align: 'center', maxWidth: 180 });
    doc.text('Email: starenterprises.bc@gmail.com', 105, 31, { align: 'center' });
    doc.line(10, 34, 200, 34);

    // Invoice Info
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text(`INVOICE NO: ${billData.invoiceNumber}`, 14, 40);
    doc.text(`DATE: ${billData.invoiceDate}`, 160, 40);

    // "TO" section
    doc.setFontSize(10);
    doc.text('TO,', 14, 47);
    doc.setFont('helvetica', 'normal');
    const toLines = [
      'FINOLEX INDUSTRIES LTD.',
      '11th Floor, IndiQube Kode, Survey No 134, Hissa No.1/38, CTS No.2265 to 2273',
      'Email: fil@finolexind.com',
      'GSTIN: 27AAACF2634A1Z9',
      'State Code: 27 (Maharashtra)',
      'SAC Code: 996601'
    ];
    toLines.forEach((line, idx) => doc.text(line, 14, 52 + idx * 5));

    // Subject & other details
    doc.setFont('helvetica', 'bold');
    doc.text(`SUB: Submission of bill for the days of – ${billData.invoiceDate}`, 14, 85);
    doc.setFont('helvetica', 'normal');
    doc.text(`Used By: ${billData.usedBy}`, 160, 85, { align: 'right' });
    doc.text(`Order By: ${billData.orderBy}`, 14, 90);
    doc.text(`Trip Details: ${billData.tripDetails}`, 14, 95);

    // Body lines
    doc.setFont('helvetica', 'bold');
    doc.text('Respected Sir/Ma\'am,', 14, 102);
    doc.setFont('helvetica', 'normal');
    doc.text('With reference to above subject, the vehicle was used for official purpose of the company.', 14, 107);
    doc.text('Please find enclosed the bill for the same.', 14, 112);

    // Vehicle No.
    doc.setFont('helvetica', 'bold');
    doc.text(`Vehicle No: ${billData.vehicleNumber}`, 14, 119);

    // Detail table
    autoTable(doc, {
      startY: 125,
      head: [['Sr. No.', 'Particular', 'Qty/Days/Hrs/KM', 'Rate (₹)', 'Amount (₹)']],
      body: [
        ['1', 'Package Per Day (300 KM)', billData.packageQty, billData.packageRate, billData.packageQty * billData.packageRate],
        ['2', 'Extra KM', billData.extraKmQty, billData.extraKmRate, billData.extraKmQty * billData.extraKmRate],
        ['3', 'Extra Time', billData.extraTimeQty, billData.extraTimeRate, billData.extraTimeQty * billData.extraTimeRate],
        ['4', 'Toll & Parking', '', '', billData.toll],
        ['5', 'Driver Allowance', '', '', billData.driverAllowance],
        ['6', 'Total Bill Amount (in Figures)', '', '', billData.totalAmount.toFixed(2)],
      ],
      theme: 'grid',
      styles: { halign: 'center', fontSize: 9 },
      headStyles: { fillColor: [52,73,94], textColor: 255, fontStyle: 'bold' },
    });

    const finalY = doc.lastAutoTable.finalY + 6;

    // Total in words
    doc.setFont('helvetica', 'bold');
    doc.text(`Total Bill Amount (in Words): ${billData.totalInWords}`, 14, finalY);

    // Closing & bank
    doc.setFont('helvetica', 'normal');
    doc.text('Kindly requested to you, please release our payment at the earliest.', 14, finalY + 6);
    doc.text('Bank A/C No: 02001119000023   |   IFSC Code: JPCB0000020', 14, finalY + 12);
    doc.text('Enclosed: Supporting Documents', 14, finalY + 18);

    // Footer with signature
    doc.setFont('helvetica', 'bold');
    doc.text('Regards,', 195, finalY + 25, { align: 'right' });
    doc.text('STAR ENTERPRISES', 195, finalY + 30, { align: 'right' });
    doc.text('Authorized Signatory', 195, finalY + 35, { align: 'right' });

    doc.save(`Bill_${billData.vehicleNumber}.pdf`);
  };

  const handleGenerateBill = () => {
    const data = {
      ...form,
      packageQty: Number(form.packageQty),
      packageRate: Number(form.packageRate),
      extraKmQty: Number(form.extraKmQty),
      extraKmRate: Number(form.extraKmRate),
      extraTimeQty: Number(form.extraTimeQty),
      extraTimeRate: Number(form.extraTimeRate),
      toll: Number(form.toll),
      driverAllowance: Number(form.driverAllowance),
    };
    const totalAmount = data.packageQty * data.packageRate +
                        data.extraKmQty * data.extraKmRate +
                        data.extraTimeQty * data.extraTimeRate +
                        data.toll + data.driverAllowance;
    data.totalAmount = totalAmount;
    data.totalInWords = numberToWords(Math.round(totalAmount));
    generatePDF(data);
  };

  return (
    <div className="container mt-4">
      <h3 className="text-center mb-4">🧾 Generate Star Enterprises Bill</h3>
      <div className="card p-4 shadow">
        <div className="row mb-3">
          {['invoiceDate','invoiceNumber','orderBy','usedBy','tripDetails','vehicleNumber'].map(f => (
            <div key={f} className="col-md-4 mb-2">
              <input
                type={f==='invoiceDate'? 'date':'text'}
                name={f}
                placeholder={f.replace(/([A-Z])/g,' $1')}
                className="form-control"
                onChange={handleChange}
              />
            </div>
          ))}
        </div>

        <div className="row g-3">
          {[
            ['packageQty','Days'],
            ['packageRate','Rate/Day'],
            ['extraKmQty','Extra KM'],
            ['extraKmRate','Rate/KM'],
            ['extraTimeQty','Extra Hrs'],
            ['extraTimeRate','Rate/Hr'],
            ['toll','Toll ₹'],
            ['driverAllowance','Driver Allowance ₹']
          ].map(([name,pl]) => (
            <div key={name} className="col-md-3">
              <input
                type="number"
                name={name}
                placeholder={pl}
                className="form-control"
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
