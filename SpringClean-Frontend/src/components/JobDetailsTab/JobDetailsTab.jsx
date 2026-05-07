import React from "react";

export default function JobDetailsTab({
  customerName,
  date,
  time,
  address,
  serviceType,
  price,
  status,
  assignedCleaners,
}) {
  const statusColors = {
    upcoming: "#fbc02d", // Gold/Yellow
    declined: "#d32f2f", // Red
    confirmed: "#2e7d32", // Green
    pending: "#ef6c00", // Orange
  };

  // Get the color safely (defaults to blue if status isn't found)
  const textColor = statusColors[status.toLowerCase()] || "#1c4274";
  return (
    <div className="job-card">
      {/* 1. Header: Date & Status */}
      <div className="job-card-header">
        <div className="job-date">
          <span className="date-text">{date}</span>
          <span className="time-text">{time}</span>
        </div>
        <span className={`status-badge ${status.toLowerCase()}`}>{status}</span>
      </div>

      <hr className="divider" />

      {/* 2. Main Details: Address & Service */}
      <div className="job-details-grid">
        <div className="detail-group">
          <label>Location</label>
          <p className="address-text">{address}</p>
        </div>

        <div className="detail-group">
          <label>Service Type</label>
          <p className="service-text">{serviceType}</p>
        </div>

        <div className="detail-group">
          <label>Customer</label>
          <p>{customerName}</p>
        </div>

        <div className="detail-group">
          <label>Total Payment</label>
          <p className="price-text">₱ {price}</p>
        </div>
         <div className="detail-group">
          <label>Assigned Cleaners</label>
          {assignedCleaners.map((cleaners) =>(
            <p className="price-text">{cleaners.cleanerName}</p>
          ))}
          
        </div>
        
      </div>



      {/* Action Buttons */}
      <div className="job-status">
        <p>Job Status: </p>
        {/* Apply the calculated color variable */}
        <p style={{ color: textColor, fontWeight: "bold" }}>{status}</p>
      </div>
    </div>
  );
}
