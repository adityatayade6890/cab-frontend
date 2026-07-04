import React, { useState } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import axios from "axios";


// =============================
// PACKAGE DATA
// =============================
const packageOptions = {
  "Dzire Local (80 KM/8 Hr)": {
    model: "Dzire",
    baseKm: 80,
    baseRate: 1800,
  },
  "Ertiga Local (80 KM/8 Hr)": {
    model: "Ertiga",
    baseKm: 80,
    baseRate: 2600,
  },
  "Dzire Outstation (300 KM/Day)": {
    model: "Dzire",
    baseKm: 300,
    baseRate: 4200,
  },
  "Ertiga Outstation (300 KM/Day)": {
    model: "Ertiga",
    baseKm: 300,
    baseRate: 4500,
  },
  "Innova Local (80 KM/8 Hr)": {
    model: "Innova",
    baseKm: 80,
    baseRate: 3500,
  },
  "Innova Outstation (300 KM/Day)": {
    model: "Innova",
    baseKm: 300,
    baseRate: 6000,
  },
};

// =============================
// VEHICLES
// =============================
const carDetails = {
  Dzire: [
    "MH14LB8443",
    "MH14LB6365",
    "MH14KA9157",
    "MH14LB9762",
    "MH14LL6227",
    "MH14LL7500",
    "MH08BK0040",
    "MH14LB4247",
  ],
  Ertiga: [
    "MH14KQ9461",
    "MH09GA2901",
    "MH14LF7494",
    "MH14LL5385",
    "MH14LE4071",
    "MH12XM9829",
    "MH12WX2034",
  ],
  Innova: [
    "MH14LL0444",
    "MH14LB9055",
    "MH14HG0999",
    "MH14LL8288",
    "MH12WJ4768",
  ],
};

// =============================
// COMPANY MASTER
// =============================
const companyMaster = {
  "Finolex Industries": {
    name: "FINOLEX INDUSTRIES LTD.",
    gst: "27AAACF2634A1Z9",
    state: "27 (Maharashtra)",
    email: "fil@finolexind.com",
    address:
      "11th Floor, IndiQube Kode, Survey No 134, Hissa No.1/38, CTS No.2265 to 2273",
    sac: "996601",
  },

  "Company B": {
    name: "COMPANY B",
    gst: "",
    state: "",
    email: "",
    address: "",
    sac: "996601",
  },

  "Company C": {
    name: "COMPANY C",
    gst: "",
    state: "",
    email: "",
    address: "",
    sac: "996601",
  },

  "Company D": {
    name: "COMPANY D",
    gst: "",
    state: "",
    email: "",
    address: "",
    sac: "996601",
  },
};

// =============================
// COMPONENT
// =============================
const GenerateBillForm = () => {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    invoiceDate: "",
    useDate: "",

    fromDate: "",
    toDate: "",

    billingType: "Daily",

    companyName: "Finolex Industries",

    orderBy: "",
    usedBy: "",
    tripDetails: "",

    selectedPackage: "",

    carModel: "",
    carRegNo: "",

    packageQty: 1,
    packageRate: "",

    extraKmQty: "",
    extraKmRate: "",

    extraTimeQty: "",
    extraTimeRate: "",

    toll: "",
    driverAllowance: "",
  });

  // =============================
  // INPUT CHANGE
  // =============================
  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =============================
  // PACKAGE SELECT
  // =============================
  const handlePackageSelect = (e) => {
    const pkgName = e.target.value;

    setForm((prev) => ({
      ...prev,
      selectedPackage: pkgName,
      carModel: packageOptions[pkgName]?.model || "",
      packageRate: packageOptions[pkgName]?.baseRate || "",
      packageQty: 1,
      carRegNo: "",
    }));
  };

  // =============================
  // BILLING TYPE CHANGE
  // =============================
  const handleBillingType = (e) => {
    const value = e.target.value;

    setForm((prev) => ({
      ...prev,
      billingType: value,
      useDate: value === "Daily" ? prev.useDate : "",
      fromDate : value === "Daily" ? "" : prev.fromDate,
      toDate : value === "Daily" ? "" : prev.toDate,
    }));
  };

  // =============================
  // NUMBER TO WORDS
  // =============================
  const numberToWords = (num) => {
    const a = [
      "",
      "One",
      "Two",
      "Three",
      "Four",
      "Five",
      "Six",
      "Seven",
      "Eight",
      "Nine",
      "Ten",
      "Eleven",
      "Twelve",
      "Thirteen",
      "Fourteen",
      "Fifteen",
      "Sixteen",
      "Seventeen",
      "Eighteen",
      "Nineteen",
    ];

    const b = [
      "",
      "",
      "Twenty",
      "Thirty",
      "Forty",
      "Fifty",
      "Sixty",
      "Seventy",
      "Eighty",
      "Ninety",
    ];

    if ((num = num.toString()).length > 9) return "overflow";

    const n = ("000000000" + num)
      .substr(-9)
      .match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);

    if (!n) return;

    let str = "";

    str +=
      n[1] !== "00"
        ? (a[+n[1]] || b[n[1][0]] + " " + a[n[1][1]]) + " Crore "
        : "";

    str +=
      n[2] !== "00"
        ? (a[+n[2]] || b[n[2][0]] + " " + a[n[2][1]]) + " Lakh "
        : "";

    str +=
      n[3] !== "00"
        ? (a[+n[3]] || b[n[3][0]] + " " + a[n[3][1]]) + " Thousand "
        : "";

    str +=
      n[4] !== "0"
        ? (a[+n[4]] || b[n[4][0]] + " " + a[n[4][1]]) + " Hundred "
        : "";

    str +=
      n[5] !== "00"
        ? (str !== "" ? "and " : "") +
          (a[+n[5]] || b[n[5][0]] + " " + a[n[5][1]]) +
          " "
        : "";

    return str.trim() + " only";
  };

  // =============================
// GENERATE PDF
// =============================
const generatePDF = (billData) => {

  const company = companyMaster[billData.companyName] || companyMaster["Finolex Industries"];

  const doc = new jsPDF("p", "mm", "a4");

  // ==========================================
  // HEADER
  // ==========================================

  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);

  doc.text(
    `INVOICE NO : ${billData.invoiceNumber}`,
    14,
    18
  );

  doc.text(
    `DATE : ${billData.invoiceDate}`,
    190,
    18,
    { align: "right" }
  );

  // ==========================================
  // TO
  // ==========================================

  doc.setFontSize(10);

  doc.text("TO,", 14, 28);

  doc.setFont("helvetica", "bold");
  doc.text(company.name, 14, 34);

  doc.setFont("helvetica", "normal");

  const address = doc.splitTextToSize( company.address, 170);
  doc.text(address, 14, 40);
  const addressHeight = address.length * 5;  
  const companyY = 40 + addressHeight + 2;

  if (company.email)
    doc.text(`Email : ${company.email}`, 14, companyY);

  if (company.gst)
      doc.text(`GSTIN : ${company.gst}`, 14, companyY + 6);
  
  if (company.state)
      doc.text(`State Code : ${company.state}`, 14, companyY + 12);
  
  doc.text(`SAC Code : ${company.sac}`, 14, companyY + 18);

  // ==========================================
  // SUBJECT
  // ==========================================

  doc.setFont("helvetica", "bold");

  if (billData.billingType === "Daily") {

    doc.text(
      `SUB : Submission of bill for ${billData.useDate}`,
      14,
      74
    );

  } else {

    doc.text(
      `SUB : ${billData.billingType} Transport Bill`,
      14,
      74
    );

  }

  doc.setFont("helvetica", "normal");

  doc.text(
    `Order By : ${billData.orderBy}`,
    14,
    82
  );

  doc.text(
    `Used By : ${billData.usedBy}`,
    120,
    82
  );
  
  const trip = doc.splitTextToSize( billData.tripDetails, 170);
  doc.text(trip, 14, 88);
  const tripHeight = trip.length * 5;  
  const nextY = 88 + tripHeight + 4;

  if (billData.billingType === "Daily") {

    doc.text(
      `Use Date : ${billData.useDate}`,
      14, nextY
    );

  } else {

    doc.text(
      `Billing Period : ${billData.fromDate}  To  ${billData.toDate}`,
      14,
      nextY
    );

  }

  // ==========================================
  // BODY
  // ==========================================

  doc.setFont("helvetica", "bold");

  const bodyY = nextY + 12;

  doc.text("Respected Sir/Madam,", 14, bodyY);
  
  doc.text(
    "With reference to the above subject, kindly find enclosed our transport bill.",
    14,
    bodyY + 7
  );
  
  doc.text(
    "Please release our payment at the earliest.",
    14,
    bodyY + 13
  );

  // ==========================================
  // VEHICLE
  // ==========================================

  doc.setFont("helvetica", "bold");
  const vehicleY = bodyY + 10
  doc.text(
    `Vehicle : ${billData.carRegNo} (${billData.carModel})`,
    14,
    vehicleY + 5
  );

  const packageLabel = billData.billingType === "Daily" ? billData.selectedPackage : `${billData.billingType} Transport Package`;
  const packageY = vehicleY + 5
  doc.text(
    `Package : ${packageLabel}`,
    14,
    packageY + 5
  );

  const billingY = packageY + 5
  doc.text(
    `Billing Type : ${billData.billingType}`,
    14,
    billingY 
  );
  const tableStartY = billingY + 10;

  // ==========================================
  // TABLE
  // ==========================================

  autoTable(doc, {

    startY: tableStartY,

    head: [[
      "Sr",
      "Particular",
      "Qty",
      "Rate",
      "Amount"
    ]],

    body: [

      [
        "1",
        "Package",
        billData.packageQty,
        billData.packageRate,
        billData.packageQty * billData.packageRate
      ],

      [
        "2",
        "Extra KM",
        billData.extraKmQty,
        billData.extraKmRate,
        billData.extraKmQty * billData.extraKmRate
      ],

      [
        "3",
        "Extra Time",
        billData.extraTimeQty,
        billData.extraTimeRate,
        billData.extraTimeQty * billData.extraTimeRate
      ],

      [
        "4",
        "Toll & Parking",
        "",
        "",
        billData.toll
      ],

      [
        "5",
        "Driver Allowance",
        "",
        "",
        billData.driverAllowance
      ],

      [
        "",
        "TOTAL",
        "",
        "",
        Number( billData.totalAmount || 0 ).toFixed(2)
      ]

    ],

    theme: "grid",

    headStyles: {

      fillColor: [41,146,185],

      textColor:255,

      fontStyle:"bold"

    },

    styles:{

      fontSize:11,

      cellPadding:3,

      halign:"center"

    }

  });

  const finalY = doc.lastAutoTable.finalY + 10;

  // ==========================================
  // AMOUNT IN WORDS
  // ==========================================

  doc.setFont("helvetica","bold");

  doc.text(
    `Amount In Words : ${numberToWords(
      Math.round(Number(billData.totalAmount || 0))
    )}`,
    14,
    finalY
  );

  doc.text(

    "Kindly release our payment at the earliest.",

    14,

    finalY + 10

  );

  doc.text(

    "Bank A/C No : 02001119000023",

    14,

    finalY + 18

  );

  doc.text(

    "IFSC : JPCB0000020",

    14,

    finalY + 24

  );

  doc.text(

    "Enclosed : Supporting Documents",

    14,

    finalY + 32

  );

  // ==========================================
  // SIGNATURE
  // ==========================================

  doc.text(

    "Regards,",

    190,

    finalY + 18,

    { align:"right" }

  );

  doc.text(

    "STAR ENTERPRISES",

    190,

    finalY + 26,

    { align:"right" }

  );

  doc.text(

    "Authorized Signatory",

    190,

    finalY + 42,

    { align:"right" }

  );

  doc.save(

    `${billData.companyName}_${billData.carRegNo}_${billData.invoiceNumber}.pdf`

  );

};
 // ==========================================
// GENERATE BILL
// ==========================================
const handleGenerateBill = async () => {
  if (loading) return;
  setLoading(true);

  const {
    invoiceDate,
    useDate,
    fromDate,
    toDate,
    billingType,
    companyName,
    orderBy,
    usedBy,
    tripDetails,
    carModel,
    carRegNo
  } = form;

  // ==========================
  // VALIDATION
  // ==========================

  if (
    !invoiceDate ||
    !orderBy ||
    !usedBy ||
    !tripDetails ||
    !form.selectedPackage ||
    !carRegNo
  ) {
    alert("⚠ Please fill all required fields.");
    setLoading(false);
    return;
  }

  if (billingType === "Daily" && !useDate) {
    alert("Please select Use Date.");
    setLoading(false);
    return;
  }

  if (
    billingType !== "Daily" &&
    (!fromDate || !toDate)
  ) {
    alert("Please select Billing Period.");
    setLoading(false);
    return;
  }

  // ==========================
  // VEHICLE
  // ==========================

  const carDisplayString = `${carModel} ${carRegNo}`;

  // ==========================
  // DATA FOR BACKEND
  // ==========================

  const data = {

    invoice_date: invoiceDate,

    use_date:
      billingType === "Daily"
        ? useDate
        : null,

    from_date:
      billingType === "Daily"
        ? null
        : fromDate,

    to_date:
      billingType === "Daily"
        ? null
        : toDate,

    billing_type: billingType,

    company_name: companyName,

    order_by: orderBy,

    used_by: usedBy,

    trip_details: tripDetails,

    car: carDisplayString,

    package_qty: Number(form.packageQty || 0),

    package_rate: Number(form.packageRate || 0),

    extra_km_qty: Number(form.extraKmQty || 0),

    extra_km_rate: Number(form.extraKmRate || 0),

    extra_time_qty: Number(form.extraTimeQty || 0),

    extra_time_rate: Number(form.extraTimeRate || 0),

    toll: Number(form.toll || 0),

    driver_allowance: Number(form.driverAllowance || 0)

  };

  try {

    const baseUrl = process.env.REACT_APP_API_BASE_URL || "http://localhost:5000";

    const res = await axios.post(
      `${baseUrl}/api/bills`,
      data
    );

    const invoiceNumber = res.data.invoice_number;

    // ==========================
    // TOTAL
    // ==========================

    const totalAmount =

      data.package_qty * data.package_rate +

      data.extra_km_qty * data.extra_km_rate +

      data.extra_time_qty * data.extra_time_rate +

      data.toll +

      data.driver_allowance;

    // ==========================
    // PDF DATA
    // ==========================

    const pdfData = {

      ...form,

      invoiceNumber,

      totalAmount,

      totalInWords: numberToWords(
        Math.round(totalAmount)
      )

    };

    generatePDF(pdfData);
    setForm({
      invoiceDate: "",
      useDate: "",
      fromDate: "",
      toDate: "",
      billingType: "Daily",
      companyName: "Finolex Industries",
      orderBy: "",
      usedBy: "",
      tripDetails: "",
      selectedPackage: "",
      carModel: "",
      carRegNo: "",
      packageQty: 1,
      packageRate: "",
      extraKmQty: "",
      extraKmRate: "",
      extraTimeQty: "",
      extraTimeRate: "",
      toll: "",
      driverAllowance: "",
    });

    alert("✅ Invoice Generated Successfully");

  } catch (err) {
    
    console.error(err);

    alert("❌ Failed to Generate Invoice");

  }
  finally {
    setLoading(false);
  }

};
 return (
  <div className="container mt-4">

    <h3 className="text-center mb-4">
      🧾 Generate Bill
    </h3>

    <div className="card shadow p-4">

      {/* ========================= */}
      {/* BASIC DETAILS */}
      {/* ========================= */}

      <div className="row g-3">

        <div className="col-md-3">
          <label>Invoice Date</label>

          <input
            type="date"
            className="form-control"
            name="invoiceDate"
            value={form.invoiceDate}
            onChange={handleChange}
          />
        </div>

        <div className="col-md-3">
          <label>Company</label>

          <select
            className="form-control"
            name="companyName"
            value={form.companyName}
            onChange={handleChange}
          >

            {Object.keys(companyMaster).map(company => (

              <option
                key={company}
                value={company}
              >
                {company}
              </option>

            ))}

          </select>
        </div>

        <div className="col-md-3">

          <label>Billing Type</label>

          <select
            name="billingType"
            className="form-control"
            value={form.billingType}
            onChange={handleBillingType}
          >

            <option value="Daily">Daily</option>

            <option value="Weekly">Weekly</option>

            <option value="Bi-Monthly">Bi-Monthly</option>

            <option value="Monthly">Monthly</option>

          </select>

        </div>

        <div className="col-md-3">

          <label>Order By</label>

          <input
            className="form-control"
            name="orderBy"
            value={form.orderBy}
            onChange={handleChange}
          />

        </div>

      </div>

      {/* ========================= */}
      {/* DATE SECTION */}
      {/* ========================= */}

      <div className="row mt-3">

        {form.billingType === "Daily" ? (

          <>

            <div className="col-md-4">

              <label>Use Date</label>

              <input
                type="date"
                className="form-control"
                name="useDate"
                value={form.useDate}
                onChange={handleChange}
              />

            </div>

          </>

        ) : (

          <>

            <div className="col-md-3">

              <label>From Date</label>

              <input
                type="date"
                className="form-control"
                name="fromDate"
                value={form.fromDate}
                onChange={handleChange}
              />

            </div>

            <div className="col-md-3">

              <label>To Date</label>

              <input
                type="date"
                className="form-control"
                name="toDate"
                value={form.toDate}
                onChange={handleChange}
              />

            </div>

          </>

        )}

        <div className="col-md-3">

          <label>Used By</label>

          <input
            className="form-control"
            name="usedBy"
            value={form.usedBy}
            onChange={handleChange}
          />

        </div>

      </div>

      {/* ========================= */}
      {/* PACKAGE */}
      {/* ========================= */}

      <div className="row mt-4">

        <div className="col-md-6">

          <label>Package</label>

          <select
            className="form-control"
            name="selectedPackage"
            value={form.selectedPackage}
            onChange={handlePackageSelect}
          >

            <option value="">
              Select Package
            </option>

            {Object.keys(packageOptions).map(pkg => (

              <option
                key={pkg}
                value={pkg}
              >
                {pkg}
              </option>

            ))}

          </select>

        </div>

        <div className="col-md-6">

          <label>Vehicle</label>

          <select
            className="form-control"
            name="carRegNo"
            value={form.carRegNo}
            onChange={handleChange}
            disabled={!form.carModel}
          >

            <option value="">
              Select Vehicle
            </option>

            {form.carModel &&
              carDetails[form.carModel]?.map(car => (

                <option
                  key={car}
                  value={car}
                >
                  {car}
                </option>

              ))}

          </select>

        </div>

      </div>

      {/* ========================= */}
      {/* TRIP DETAILS */}
      {/* ========================= */}

      <div className="row mt-3">

        <div className="col-md-12">

          <label>Trip Details</label>

          <textarea
            rows="2"
            className="form-control"
            name="tripDetails"
            value={form.tripDetails}
            onChange={handleChange}
          />

        </div>

      </div>

      {/* ========================= */}
      {/* CHARGES */}
      {/* ========================= */}

      <div className="row mt-4">

        {[
          ["packageQty", "Days"],
          ["packageRate", "Rate / Day"],
          ["extraKmQty", "Extra KM"],
          ["extraKmRate", "Rate / KM"],
          ["extraTimeQty", "Extra Hours"],
          ["extraTimeRate", "Rate / Hour"],
          ["toll", "Toll"],
          ["driverAllowance", "Driver Allowance"],
        ].map(([name, label]) => (

          <div
            className="col-md-3 mb-3"
            key={name}
          >

            <label>{label}</label>

            <input
              type="number"
              min="0"
              step="0.01"
              className="form-control"
              name={name}
              value={form[name]}
              onChange={handleChange}
            />

          </div>

        ))}

      </div>

      {/* ========================= */}
      {/* BUTTON */}
      {/* ========================= */}

      <div className="text-center mt-4">

        <button
          className="btn btn-success btn-lg"
          onClick={handleGenerateBill}
          disabled={loading}
        >
          {loading ? "Generating..." : "📄 Generate Invoice"}
        </button>

      </div>

    </div>

  </div>
);
};
export default GenerateBillForm;
