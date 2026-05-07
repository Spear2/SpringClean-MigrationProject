import React, {useState, useEffect} from "react";
import "../CleanerPages/Styles/CleanerDashboard.css";
import NavBarCompany_Cleaner from "../../components/Navbar/NavBarCompany_Cleaner";
import KPI from "../../components/KPI/KPICard";
import useCleaner from "../../Hooks/useCleaner";
import BookingTab from "../../components/BookingTab/BookingTab";
import {
  BarChart,
  Bar,
  XAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";

export default function CleanerDashboard() {

  const cleaner = useCleaner();
  const [cleanerBookings, setCleanerBookings] = useState([]);
  const [summary, setSummary] = useState(null);
    const [earnings, setEarnings] = useState([]);
    const [loading, setLoading] = useState(true);

  useEffect(() => {
    if(!cleaner?.cleanerId) return;

    fetch(`http://localhost:8080/api/cleaners/${cleaner.cleanerId}/bookings`)
      .then((res) => res.json())
      .then((data) => {

        setCleanerBookings(data);
      })
      .catch((err) => console.error("Error Fetching Cleaner's Bookings:", err));
  }, [cleaner?.cleanerId]);

  // -------------------------------
  // COMPUTE KPI VALUES
  // -------------------------------

  // KPI 1: Total Earnings (only completed jobs)
  const totalEarnings = cleanerBookings
    .filter(b => b.status === "Done" || b.status === "Completed")
    .reduce((sum, b) => sum + (b.totalPrice || 0), 0);

  // KPI 2: Attendance (completed jobs / all)
  const completedJobs = cleanerBookings.filter(b => b.status === "Done" || b.status === "Completed").length;
  const attendance = cleanerBookings.length > 0
    ? Math.round((completedJobs / cleanerBookings.length) * 100)
    : 0;

  // KPI 3: Pending Jobs (Accepted or Pending)
  const pendingJobs = cleanerBookings.filter(b => b.status === "Accepted" || b.status === "Pending").length;

  

  // -------------------------------
  // WEEKLY CHART → Count bookings by day
  // -------------------------------
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const chartData = days.map(day => ({
    day: day,
    jobs: cleanerBookings.filter(b => {
      const date = new Date(b.bookingDate);
      return date.getDay() === days.indexOf(day);
    }).length
  }));

  
  
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
    const kpiData = summary
  ? [
      { title: "Total Earnings", info: `${formatCurrency(summary.totalEarnings)}` },
      { title: "Attendance", info: `${attendance}%` },
      { title: "Pending Jobs", info: pendingJobs },
    ]
  : [];

  if (!cleaner) return <p>Loading...</p>;

  return (
    <div className="CleanerDashboard-container">
      <NavBarCompany_Cleaner />

      <div className="dashboard-header">
        <h1>Welcome back, {cleaner.cleanerName}</h1>
        <h1>Dashboard</h1>
      </div>

      <div className="dashboard-body">
        {/* TOP: KPIs */}
        <div className="kpi-sidebar">
          {kpiData.map((item, index) => (
            <KPI key={index} title={item.title} info={item.info} />
          ))}
        </div>

        {/* Body Content */}
        <div className="dashboard-content">

          {/* LEFT SIDE: BOOKING LIST */}
          <div className="half-section">
            <h2 className="booking-tab-header">Pending Bookings</h2>

            <div className="scrollable-list">
              {cleanerBookings.map((items) => (
                <BookingTab
                  key={items.bookingId}
                  customer={`${items.customer?.firstName ?? ""} ${items.customer?.lastName ?? ""}`}
                  date={items.bookingDate}
                  status={items.status}
                />
              ))}
            </div>
          </div>

          <div style={{ width: "1px", backgroundColor: "#e0e0e0" }}></div>

          {/* RIGHT SIDE: WEEKLY ACTIVITY CHART */}
          <div className="half-section">
            <h2 className="booking-tab-header">Weekly Activity</h2>

            <div style={{ width: "100%", height: "100%", minHeight: "300px" }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid vertical={false} stroke="#e0e0e0" />
                  <XAxis
                    dataKey="day"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#666" }}
                  />
                  <Tooltip cursor={{ fill: "transparent" }} />
                  <Legend />

                  <Bar
                    name="Jobs Assigned"
                    dataKey="jobs"
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
