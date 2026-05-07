import React, { useState, useEffect } from "react";
import NavbarCleaner from "../../components/Navbar/NavBarCleaner";
import "../../pages/CompanyPages/CompanyStyles/CompanyPayments.css";
import useCompany from "../../Hooks/useCompany";

export default function CompanyPayments() {
  const [paymentList, setPaymentList] = useState([]);
  const company = useCompany();

  // --- FETCH PAYMENTS ---
  const fetchPayments = async () => {
    if (!company?.companyCleanerId) return;

    try {
      const res = await fetch(
        `http://localhost:8080/api/payments/company/${company.companyCleanerId}/payments`
      );
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setPaymentList(data);
    } catch (error) {
      console.error("Failed to fetch payments:", error);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, [company]);

  // --- CALCULATE TOTALS ---
  // Assuming 'Completed' or 'Paid' status means money is in.
  const totalEarnings = paymentList
    .filter((p) => p.status === "Paid" || p.status === "Completed")
    .reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="company-payments-page">
      <NavbarCleaner />

      {/* HEADER */}
      <div className="dashboard-header">
        <div>
          <h1>Financial Overview</h1>
          <p style={{ margin: 0, opacity: 0.7 }}>
            Track earnings and transactions.
          </p>
        </div>
        <div>
          {/* Mock Export Button */}
          <button className="export-btn">Download Report</button>
        </div>
      </div>

      <div className="payments-body">
        {/* TOP: BALANCE CARD */}
        <div className="balance-section">
          <div className="balance-card">
            <div className="balance-label">Total Revenue</div>
            <div className="balance-amount">
              ₱{totalEarnings.toLocaleString()}
            </div>
            <div className="balance-sub">
              Lifetime earnings from all bookings
            </div>
          </div>

          {/* You can add more summary cards here later (e.g. Pending Payouts) */}
        </div>

        {/* BOTTOM: TRANSACTION TABLE */}
        <div className="table-card">
          <h2 className="section-header">Transaction History</h2>

          <div className="table-wrapper">
            <table className="styled-table">
              <thead>
                <tr>
                  <th>Transaction ID</th>
                  <th>Customer</th>
                  <th>Date</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {paymentList.length > 0 ? (
                  paymentList.map((pay) => (
                    <tr key={pay.paymentId || pay.id}>
                      <td style={{ fontWeight: "bold" }}>
                        #{pay.paymentId || pay.id}
                      </td>
                      <td>
                        {pay.customerFirstName
                          ? `${pay.customerFirstName} ${pay.customerLastName}`
                          : pay.customer}
                      </td>
                      <td>
                        {pay.paidAt ? pay.paidAt.split("T")[0] : pay.date}
                      </td>
                      <td style={{ fontWeight: "bold", color: "#2e7d32" }}>
                        +₱{pay.amount.toLocaleString()}
                      </td>
                      <td>
                        <span
                          className={`status-badge ${pay.status.toLowerCase()}`}
                        >
                          {pay.status}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="5"
                      style={{ textAlign: "center", padding: "30px" }}
                    >
                      No payments found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
