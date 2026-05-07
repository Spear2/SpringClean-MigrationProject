import React from "react";
import "./KPI.css";

export default function KPICard({ title, info }) {
  return (
    <div className="card-container">
      <div className="card-content">
        <h3 className="card-title">{title}</h3>
        <h2 className="card-info">{info}</h2>
      </div>
    </div>
  );
}
