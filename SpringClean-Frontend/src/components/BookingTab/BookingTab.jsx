import React from "react";
import "./BookingTab.css";

export default function BookingTab({ customer, date, status }) {
  return (
    <div className="bookingTab_container">
      <div className="booking-details">
        <div className="customer-info">
          <h3>Customer: {customer}</h3>
          <p>Date: {date}</p>
          <p>Status: {status}</p>
        </div>
        <div className="booking-actions">
          <button className="booking-button">View Details</button>
        </div>
      </div>
    </div>
  );
}
