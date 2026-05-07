import React from "react";
import "../pages/CleanerPages/Styles/CleanerEarningsStyles.css"; // We will create this below

export default function PaymentRow({
  date,
  customer,
  service,
  amount,
  status,
}) {
  // Logic for status colors
  const statusColors = {
    paid: "#2e7d32", // Green
    pending: "#fbc02d", // Yellow/Gold
    failed: "#d32f2f", // Red
  };

  const statusColor = statusColors[status.toLowerCase()] || "#1c4274";

  return (
    <div className="payment-row">
      {/* LEFT: Date & Info */}
      <div className="payment-info">
        <div className="payment-icon">$</div>
        <div className="payment-text">
          <h3>{service}</h3>
          <p>
            {customer} • {date}
          </p>
        </div>
      </div>

      {/* RIGHT: Amount & Status */}
      <div className="payment-status-box">
        <span className="payment-amount">{amount}</span>
        <span
          className="payment-badge"
          style={{
            color: statusColor,
            borderColor: statusColor,
            background: status === "Paid" ? "#e8f5e9" : "#fffde7",
          }}
        >
          {status}
        </span>
      </div>
    </div>
  );
}
