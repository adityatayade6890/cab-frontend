import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const generateBillPDF = (bill) => {
  const doc = new jsPDF();
  const left = 15;

  // Header
  doc.setFontSize(18);
  doc.setTextColor(200, 0, 0);
  doc.text('STAR ENTERPRISES', left, 20);

  doc.setFontSize(10);
  doc.setTextColor(0);
  doc.text('GSTIN No.: 27ANDPC5898G1ZR', left, 25);
  doc.text('S.No.70, Vitthal Residency, Flat No.504, Near Ganesh Temple,', left, 30);
  doc.text('Suman Clinic, Bhimashankar Nagar, Kiwale, Dehu Road, Pune - 412101', left, 35);
  doc.text('Email ID: starenterprises.bc@gmail.com', left, 40);

  // Invoice Info
  doc.setFontSize(11);
  doc.text(`INVOICE NO.: ${bill.invoice_no}`, left, 50);
  doc.text(`INV DATE: ${bill.invoice_date}`, left, 55);

  // Client Info
  doc.text('TO,', left, 65);
  doc.setFontSize(10);
  doc.text(bill.client_name, left, 70);
  doc.text(bill.client_address, left, 75);
  doc.text(`Email: ${bill.client_email}`, left, 80);
  doc.text(`GSTIN: ${bill.client_gstin}`, left, 85);
  doc.text(`STATE CODE: ${bill.state_code}`, left, 90);
  doc.text(`SAC CODE: ${bill.sac_code}`, left, 95);

  // Subject Line
  doc.setFontSize(11);
  doc.text(`SUB- Submission of bill for the days of – ${bill.bill_date}`, left, 105);

  doc.setFontSize(10);
  doc.text(`Order By– ${bill.ordered_by}`, left, 110);
  doc.text(`Used By– ${bill.used_by}`, left + 90, 110);
  doc.text(`Trip– ${bill.trip_details}`, left, 115);

  // Body Content
  doc.text('Respected Sir/Madam,', left, 125);
  doc.text('With reference to above subject, the vehicle used for official purpose of', left, 130);
  doc.text('Company. Please find attached herewith the bill as below.', left, 135);

  doc.setFontSize(11);
  doc.text(`Vehicle No. ${bill.vehicle_number}`, left, 145);

  // Table
  autoTable(doc, {
    startY: 150,
    head: [['Sr.', 'Particular', 'Qty/Days/Hrs/KM', 'Rate Per Day/KM/Hrs', 'Total Amt']],
    body: bill.items.map((item, i) => [
      i + 1,
      item.particular,
      item.qty,
      item.rate,
      item.total
    ]),
    styles: { fontSize: 9 },
  });

  // Total Section
  const totalY = doc.lastAutoTable.finalY + 10;
  doc.text(`Total Bill Amount in– (Words): ${bill.total_in_words}`, left, totalY);
  doc.setFontSize(11);
  doc.text(`Total Bill Amount in (Figures): ₹ ${bill.total_amount}`, left, totalY + 6);

  // Bank Details
  doc.setFontSize(10);
  doc.text('Kindly requested to you, please release our payment at earliest,', left, totalY + 15);
  doc.text(`A/C No. ${bill.account_no}   IFSC Code: ${bill.ifsc_code}`, left, totalY + 20);

  // Footer
  doc.text('Regards,', left + 130, totalY + 30);
  doc.text('Star Enterprises', left + 115, totalY + 35);
  doc.text('Authorized Signatory', left + 110, totalY + 40);

  // Save file
  const safeName = bill.client_name?.replace(/[^a-zA-Z0-9]/g, '_') || 'Client';
  doc.save(`Invoice-${safeName}.pdf`);
};

export default generateBillPDF;
