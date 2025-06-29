import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const generateBillPDF = (ride) => {
  const doc = new jsPDF();

  doc.setFontSize(16);
  doc.text('Star Enterprises - Cab Service', 15, 20);

  doc.setFontSize(10);
  doc.text('Aai Niwas, Dehuroad, Maharashtra, ', 15, 26);
  doc.text('Email: starenterprises123@gmail.com | Phone: +91-7058204660', 15, 32);

  doc.setFontSize(12);
  doc.text(`Bill No: ${ride.bill_number}`, 15, 62);
  doc.text(`Customer: ${ride.customer_name}`, 15, 50);
  doc.text(`Ride Date: ${new Date(ride.created_at).toLocaleDateString()}`, 15, 56);

  autoTable(doc, {
    startY: 64,
    head: [['Ride Info', 'Value']],
    body: [
      ['Pickup Location', ride.pickup_location],
      ['Drop Location', ride.drop_location],
      ['Start KM', ride.start_km],
      ['End KM', ride.end_km],
      ['Distance', `${ride.distance_km} km`],
    ],
  });

  autoTable(doc, {
    startY: doc.lastAutoTable.finalY + 10,
    head: [['Fare Component', 'Amount']],
    body: [
      [`Distance (${ride.distance_km} km)`, `₹ ${ride.fare_total - (ride.night_charge ? ride.distance_km * 2 : 0) - ride.toll_charge}`],
      ['Night Charge', ride.night_charge ? `₹ ${ride.distance_km * 2}` : '₹ 0'],
    //   ['Waiting Time', `₹ ${ride.waiting_time_minutes}`],
      ['Toll Charge', `₹ ${ride.toll_charge}`],
    ],
  });

  doc.text(`TOTAL: ₹ ${ride.fare_total}`, 15, doc.lastAutoTable.finalY + 12);
  const safeName = ride.customer_name?.replace(/[^a-zA-Z0-9]/g, '_') || 'Unknown';
  doc.save(`Ride-Bill-${safeName}.pdf`);


};

export default generateBillPDF;