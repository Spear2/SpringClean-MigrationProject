import React, { useState, useEffect } from "react";
import NavbarCleaner from "../../components/Navbar/NavBarCleaner"; // Or your specific Company Navbar
import "../../pages/CompanyPages/CompanyStyles/CompanyDashboard.css";
import useCompany from "../../Hooks/useCompany";
import {
  BarChart,
  Bar,
  XAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

export default function CompanyDashboard() {
  const [bookings, setBookings] = useState([]);
  const company = useCompany();

  // --- 1. FETCH DATA ---
  const fetchBookings = async () => {
    if (!company || !company.companyCleanerId) return;

    try {
      const res = await fetch(
        `http://localhost:8080/api/bookings/company/${company.companyCleanerId}/bookings`
      );
      if (!res.ok) {
        throw new Error("Network error while fetching bookings");
      }
      const data = await res.json();
      setBookings(data);
    } catch (error) {
      console.error("Failed to fetch bookings:", error);
    }
  };

  useEffect(() => {
    if (company && company.companyCleanerId) {
      fetchBookings();
    }
  }, [company]);

  // --- 2. CALCULATE KPIs (Dynamic) ---
  const totalBookings = bookings.length;

  // Calculate Active (Pending or In Progress)
  const activeBookings = bookings.filter(
    (b) => b.status === "Pending" || b.status === "In Progress"
  ).length;

  // Mock Revenue Calculation (Assuming avg $120 per booking if price is missing)
  const totalRevenue = bookings.reduce(
  (acc, curr) => acc + ((curr.price || 120) * 0.20),
  0
  );


  const kpiData = [
    { title: "Total Revenue", info: `₱${totalRevenue.toLocaleString()}` },
    { title: "Total Bookings", info: totalBookings },
    { title: "Active Jobs", info: activeBookings },
  ];

  // --- 3. PREPARE CHART DATA (Group by Service Type) ---
  const serviceStats = bookings.reduce((acc, curr) => {
    const service = curr.serviceType || "Other";
    acc[service] = (acc[service] || 0) + 1;
    return acc;
  }, {});

  // Convert to array for Recharts + Add some mock data if empty so chart looks good
  const chartData =
    Object.keys(serviceStats).length > 0
      ? Object.keys(serviceStats).map((key) => ({
          name: key,
          count: serviceStats[key],
        }))
      : [
          { name: "Deep Clean", count: 4 },
          { name: "Standard", count: 8 },
          { name: "Office", count: 3 },
        ];

  return (
    <div className="company-dashboard-container">
      <NavbarCleaner />

      {/* HEADER */}
      <div className="dashboard-header">
        <div>
          <h1>
            Welcome,{" "}
            <span className="highlight">
              {company?.companyName || "Company"}
            </span>
          </h1>
          <p style={{ margin: 0, opacity: 0.7 }}>
            Here is your daily overview.
          </p>
        </div>
        <div>
          <h1 style={{ fontSize: "1rem", opacity: 0.8 }}>
            {new Date().toDateString()}
          </h1>
        </div>
      </div>

      <div className="dashboard-body">
        {/* TOP ROW: KPIs */}
        <div className="kpi-sidebar">
          {kpiData.map((item, index) => (
            <div key={index} className="kpi-card">
              <h3 className="kpi-title">{item.title}</h3>
              <p className="kpi-info">{item.info}</p>
            </div>
          ))}
        </div>

        {/* BOTTOM ROW: SPLIT CONTENT */}
        <div className="dashboard-content">
          {/* LEFT: Recent Bookings List */}
          <div className="half-section">
            <h2 className="section-header">Recent Bookings</h2>

            <div className="scrollable-list">
              <table className="styled-table">
                <thead>
                  <tr>
                    <th>Client</th>
                    <th>Service</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.length > 0 ? (
                    bookings.map((booking, index) => (
                      <tr key={index}>
                        <td>
                          <div style={{ fontWeight: "bold" }}>
                            {booking.customerFirstName}{" "}
                            {booking.customerLastName}
                          </div>
                          <div style={{ fontSize: "12px", color: "#666" }}>
                            {booking.date}
                          </div>
                        </td>
                        <td>{booking.serviceType}</td>
                        <td>
                          <span
                            className={`status-badge ${
                              booking.status?.toLowerCase().replace(" ", "-") ||
                              "pending"
                            }`}
                          >
                            {booking.status || "Pending"}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="3"
                        style={{ textAlign: "center", padding: "20px" }}
                      >
                        No bookings found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* RIGHT: Service Analytics Chart */}
          <div className="half-section">
            <h2 className="section-header">Service Popularity</h2>

            <div style={{ width: "100%", height: "100%", minHeight: "300px" }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid vertical={false} stroke="#e0e0e0" />
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#666", fontSize: 12 }}
                  />
                  <Tooltip
                    cursor={{ fill: "transparent" }}
                    contentStyle={{
                      borderRadius: "10px",
                      border: "none",
                      boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
                    }}
                  />
                  <Bar
                    name="Bookings"
                    dataKey="count"
                    fill="#1c4274"
                    radius={[10, 10, 0, 0]}
                    barSize={40}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
