import React, { useState, useEffect } from "react";
import "./Styles/CleanerEarningsStyles.css";
import NavBarCompany_Cleaner from "../../components/Navbar/NavBarCompany_Cleaner";
import PaymentRow from "../../components/PaymentRow";
import useCleaner from "../../Hooks/useCleaner";

export default function CleanerPayments() {
  const cleaner = useCleaner();
  const [summary, setSummary] = useState(null);
  const [earnings, setEarnings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!cleaner || !cleaner.cleanerId) return;

    const fetchEarnings = async () => {
      try {
        // Fetch summary
        const summaryRes = await fetch(
          `http://localhost:8080/api/earnings/cleaner/${cleaner.cleanerId}/summary`
        );
        const summaryData = await summaryRes.json();
        setSummary(summaryData);

        // Fetch detailed earnings
        const earningsRes = await fetch(
          `http://localhost:8080/api/earnings/cleaner/${cleaner.cleanerId}`
        );
        const earningsData = await earningsRes.json();
        setEarnings(earningsData);

        setLoading(false);
      } catch (err) {
        console.error("Error fetching earnings:", err);
        setLoading(false);
      }
    };

    fetchEarnings();
  }, [cleaner?.cleanerId]);

  const formatCurrency = (amount) => {
    return `₱${amount.toFixed(2)}`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Get current month and year
  const getCurrentMonthYear = () => {
    const now = new Date();
    return now.toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    });
  };

  if (loading) {
    return <div className="loading-text">Loading Earnings...</div>;
  }

  return (
    <div className="CleanerPayments_container">
      <NavBarCompany_Cleaner />

      {/* Header */}
      <div className="dashboard-header">
        <h1>Earnings</h1>
        <h1>{getCurrentMonthYear()}</h1>
      </div>

      <div className="payments-body">
        {/* 1. TOTAL BALANCE CARD */}
        <div className="balance-card">
          <div className="balance-info">
            <p>Total Balance</p>
            <h1>{summary ? formatCurrency(summary.totalEarnings) : "₱0.00"}</h1>
            <p>
              {summary?.completedJobs || 0} completed jobs
            </p>
            <p className="balance-subtitle">
              {summary?.pendingPayments || 0} pending payment
            </p>
          </div>
          <div className="payout-btn-container">
            <button className="payout-btn">Request Payout</button>
          </div>
        </div>

        {/* 2. TRANSACTION HISTORY */}
        <h2 className="section-title">Transaction History</h2>

        <div className="history-list">
          {earnings.length === 0 ? (
            <div className="no-transactions">
              <p>No transactions yet. Complete jobs to see your earnings!</p>
            </div>
          ) : (
            earnings.map((earning) => (
              <PaymentRow
                key={earning.paymentId}
                date={formatDate(earning.paidAt)}
                customer={earning.customerName}
                service={earning.serviceType}
                amount={
                  earning.cleanerEarnings > 0
                    ? `+${formatCurrency(earning.cleanerEarnings)}`
                    : formatCurrency(earning.totalAmount)
                }
                status={earning.status}
                totalAmount={earning.totalAmount}
                cleanerEarnings={earning.cleanerEarnings}
                companyCommission={earning.companyCommission}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}