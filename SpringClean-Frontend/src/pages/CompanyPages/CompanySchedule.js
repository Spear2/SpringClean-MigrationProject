import React, { useState, useEffect } from "react";
import NavbarCleaner from "../../components/Navbar/NavBarCleaner";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { parse, format, startOfWeek, getDay } from "date-fns";
import "../../pages/CompanyPages/CompanyStyles/CompanySchedule.css";
import useCompany from "../../Hooks/useCompany";

export default function CompanySchedule() {
  const company = useCompany();
  const [bookings, setBookings] = useState([]);
  const [view, setView] = useState("month");
  const [date, setDate] = useState(new Date());
  const [selectedBooking, setSelectedBooking] = useState(null); // For preview modal

  // LOCALIZER
  const locales = { "en-US": require("date-fns/locale/en-US") };
  const localizer = dateFnsLocalizer({ format, parse, startOfWeek, getDay, locales });

  // FETCH BOOKINGS
  useEffect(() => {
    if (!company?.companyCleanerId) return;

    const fetchBookings = async () => {
      try {
        const res = await fetch(
          `http://localhost:8080/api/bookings/company/${company.companyCleanerId}/bookings`
        );
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        setBookings(data);
      } catch (error) {
        console.error("Error loading schedule:", error);
      }
    };

    fetchBookings();
  }, [company]);

  // CONVERT BOOKINGS TO EVENTS
  const events = bookings.map((b) => {
    const start = new Date(`${b.date}T${b.time}`);
    const end = new Date(start.getTime() + parseInt(b.hours || 2) * 60 * 60 * 1000);
    return {
      id: b.bookingId,
      title: `${b.serviceType} - ${b.customerFirstName} ${b.customerLastName}`,
      start,
      end,
      status: b.status,
      cleaners: b.assignedCleanerNames || [],
      bookingData: b, // keep original booking for preview
    };
  });

  // EVENT COLOR STYLES
  const eventStyleGetter = (event) => {
    let backgroundColor = "#1c4274"; // Default
    if (event.status === "Accepted") backgroundColor = "#2e7d32";
    if (event.status === "Completed") backgroundColor = "#12360e";
    if (event.status === "Rejected") backgroundColor = "#c62828";
    if (event.status === "In Progress") backgroundColor = "#f2e6ff";
    if (event.status === "Paid") backgroundColor = "#d6f0ff";
    if (event.status === "Cancelled") backgroundColor = "#f0f0f0";

    return {
      style: {
        backgroundColor,
        borderRadius: "8px",
        opacity: 0.9,
        color: ["Completed", "In Progress", "Paid"].includes(event.status) ? "#1c4274" : "white",
        border: "0px",
        display: "block",
        fontSize: "12px",
        padding: "4px",
      },
    };
  };

  return (
    <div className="company-schedule-page">
      <NavbarCleaner />

      {/* HEADER */}
      <div className="dashboard-header">
        <div>
          <h1>Schedule</h1>
          <p style={{ margin: 0, opacity: 0.7 }}>View all upcoming jobs.</p>
        </div>
        <div>
          <h1 style={{ fontSize: "1rem", opacity: 0.8 }}>
            {events.length} Events Found
          </h1>
        </div>
      </div>

      {/* CALENDAR */}
      <div className="schedule-body">
        <div className="calendar-card">
          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            views={["month", "week", "day"]}
            view={view}
            onView={setView}
            date={date}
            onNavigate={setDate}
            style={{ flex: 1, width: "100%", height: "100%" }}
            eventPropGetter={eventStyleGetter}
            onSelectEvent={(event) => setSelectedBooking(event.bookingData)}
            components={{
              event: ({ event }) => (
                <div title={event.title}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <strong>{event.title}</strong>
                    <span className={`status-badge ${event.status.toLowerCase().replace(" ", "-")}`}>
                      {event.status}
                    </span>
                  </div>
                  {event.cleaners.length > 0 && (
                    <div style={{ fontSize: "10px", marginTop: "2px", opacity: 0.9 }}>
                      {event.cleaners.length} Cleaner(s)
                    </div>
                  )}
                </div>
              ),
            }}
          />
        </div>
      </div>

      {/* BOOKING PREVIEW MODAL */}
      {selectedBooking && (
        <div className="booking-modal" onClick={() => setSelectedBooking(null)}>
          <div className="booking-modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Booking Details</h2>
            <p><strong>Customer:</strong> {selectedBooking.customerFirstName} {selectedBooking.customerLastName}</p>
            <p><strong>Service:</strong> {selectedBooking.serviceType}</p>
            <p><strong>Date:</strong> {selectedBooking.date}</p>
            <p><strong>Time:</strong> {selectedBooking.time}</p>
            <p><strong>Hours:</strong> {selectedBooking.hours || 2}</p>
            <p>
              <strong>Status:</strong>{" "}
              <span className={`status-badge ${selectedBooking.status.toLowerCase().replace(" ", "-")}`}>
                {selectedBooking.status}
              </span>
            </p>
            <p><strong>Cleaners Assigned:</strong> {selectedBooking.assignedCleanerNames?.join(", ") || "None"}</p>
            <button onClick={() => setSelectedBooking(null)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}
