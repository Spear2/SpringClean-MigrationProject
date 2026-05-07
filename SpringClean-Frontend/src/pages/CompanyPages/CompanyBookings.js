import { useState, useEffect } from "react";
import NavbarCleaner from "../../components/Navbar/NavBarCleaner";
import "../../pages/CompanyPages/CompanyStyles/CompanyBookings.css";
import { useAuth } from "../../auth/useAuth";

export default function CompanyBookings() {
  const serviceTypes = {
    Basic: { cleaners: 1, rate: 300 },
    Standard: { cleaners: 2, rate: 400 },
    Premium: { cleaners: 3, rate: 500 },
  };

  const { user } = useAuth();
  const loggedInCompany = user?.type === "company" ? user : null;

  const [bookings, setBookings] = useState([]);
  const [cleaners, setCleaners] = useState([]);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [assignedCleaners, setAssignedCleaners] = useState([]);

  /* ==========================
      FETCH BOOKINGS
  ========================== */
  useEffect(() => {
    if (!loggedInCompany?.id) return;

    fetch(`http://localhost:8080/api/bookings/company/${loggedInCompany.id}`)
      .then((res) => res.json())
      .then((data) => {
        setBookings(
          data.map((b) => ({
            id: b.bookingId,
            customer: `${b.customerFirstName || ""} ${b.customerLastName || ""}`,
            date: b.date,
            time: b.time,
            duration: b.hours,
            serviceType: b.serviceType,
            status: b.status,
            cleanersAssigned: b.assignedCleanerIds || [],
          }))
        );
      })
      .catch((err) => console.error("Error loading bookings:", err));
  }, [loggedInCompany]);

  /* ==========================
      FETCH CLEANERS
  ========================== */
  useEffect(() => {
    if (!loggedInCompany?.id) return;

    fetch(`http://localhost:8080/api/company-cleaners/${loggedInCompany.id}/cleaners`)
      .then((res) => res.json())
      .then(setCleaners)
      .catch((err) => console.error("Error loading cleaners:", err));
  }, [loggedInCompany]);

  const toDateTime = (date, time) => {
  const [year, month, day] = date.split("-");
  const [hour, minute] = time.split(":");

  return new Date(
      Number(year),
      Number(month) - 1,
      Number(day),
      Number(hour),
      Number(minute),
      0,   // seconds
      0    // milliseconds
    );
  };
  
  const isOverlapping = (startA, endA, startB, endB) =>
    startA < endB && endA > startB;

  const isCleanerBooked = (cleanerId, date, time, duration) => {
    const start = toDateTime(date, time);
    const end = new Date(start.getTime() + parseInt(duration) * 60 * 60 * 1000);

    return bookings.some((b) => {
      const status = String(b.status || "").toLowerCase();
      if (status !== "accepted") return false;
      if (!b.cleanersAssigned?.includes(cleanerId)) return false;

      const bStart = toDateTime(b.date, b.time);
      const bEnd = new Date(
        bStart.getTime() + parseInt(b.duration) * 60 * 60 * 1000
      );

      return isOverlapping(start, end, bStart, bEnd);
    });
  };

  /* ==========================
      ACCEPT (AUTO OPEN MODAL)
  ========================== */
    const acceptBooking = (bookingId) => {
    fetch(`http://localhost:8080/api/bookings/${bookingId}/accept-only`, {
  method: "PUT",
  headers: {
    "Content-Type": "application/json",
  },
})
  .then((res) => {
    if (!res.ok) throw new Error("Accept failed");
    return res.json();
  })
  .then((updated) => {
    // update booking state with accepted status
    setBookings((prev) =>
      prev.map((b) =>
        b.id === bookingId ? { ...b, status: "Accepted" } : b
      )
    );

    // open modal for assigning cleaners
    setSelectedBooking(
      bookings.find((b) => b.id === bookingId)
    );
    setAssignedCleaners([]);
    setShowAssignModal(true);
  })
  .catch((err) => console.error("Error accepting booking:", err));
  };


  /* ==========================
      REJECT
  ========================== */
  const handleReject = (bookingId) => {
    fetch(`http://localhost:8080/api/bookings/${bookingId}/reject`, {
      method: "PUT",
    })
      .then((res) => res.json())
      .then((updated) => {
        setBookings((prev) =>
          prev.map((b) =>
            b.id === bookingId ? { ...b, status: updated.status } : b
          )
        );
      })
      .catch((err) => console.error("Error rejecting booking:", err));
  };

    /* ==========================
      AVAILABILITY CHECK
    ========================== */
    const canBook = (serviceType, date, time) => {
      if (!cleaners.length) return false;

      const required = serviceTypes[serviceType].cleaners;

      const bookedCount = bookings.reduce((count, b) => {
        if (b.status !== "Accepted") return count;

        const start = toDateTime(date, time);
        const end = new Date(start.getTime() + parseInt(b.duration) * 60 * 60 * 1000);

        const bStart = toDateTime(b.date, b.time);
        const bEnd = new Date(bStart.getTime() + parseInt(b.duration) * 60 * 60 * 1000);

        if (isOverlapping(start, end, bStart, bEnd)) {
          return count + (b.cleanersAssigned?.length || 0);
        }
        return count;
      }, 0);

      return bookedCount + required <= cleaners.filter((c) => c.available).length;
    };


  /* ==========================
      AUTO UPDATE STATUS
  ========================== */
    useEffect(() => {
      const interval = setInterval(() => {
        setBookings((prev) =>
          prev.map((b) => {
            if (!b.date || !b.time) return b;

            const start = toDateTime(b.date, b.time);
            const end = new Date(start.getTime() + parseInt(b.duration) * 60 * 60 * 1000);
            const now = new Date();

            const statusLower = String(b.status || "").toLowerCase().trim();
            let newStatus = b.status;

            // Move to In Progress
            if (statusLower === "accepted" && now >= start && now < end) {
              newStatus = "In Progress";
              fetch(`http://localhost:8080/api/bookings/${b.id}/in-progress`, { method: "PUT" });
            }

            // Move to Completed
            if ((statusLower === "in progress" || statusLower === "accepted") && now >= end) {
              newStatus = "Completed";
              fetch(`http://localhost:8080/api/bookings/${b.id}/complete`, { method: "PUT" });
            }

            return { ...b, status: newStatus };
          })
        );
      }, 5000);

      return () => clearInterval(interval);
    }, []);


  /* ==========================
      ASSIGN CLEANERS
  ========================== */
  const handleAssign = () => {
    fetch(
      `http://localhost:8080/api/bookings/${selectedBooking.id}/assign-cleaners`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cleanerIds: assignedCleaners }),
      }
    )
      .then((res) => res.json())
      .then((updated) => {
        setBookings((prev) =>
          prev.map((b) =>
            b.id === selectedBooking.id
              ? { ...b, cleanersAssigned: updated.assignedCleanerIds }
              : b
          )
        );
        setShowAssignModal(false);
        setAssignedCleaners([]);
        alert("Cleaners assigned successfully!");
      })
      .catch((err) => console.error("Error assigning cleaners:", err));
  };

  

  return (
    <div className="company-bookings-page">
      <NavbarCleaner />

      <div className="dashboard-header">
        <div>
          <h1>Booking Management</h1>
          <p>Manage requests and assign cleaners.</p>
        </div>
        <h1>{bookings.length} Total Requests</h1>
      </div>

    <div className="scrollable-list">
      <div className="bookings-body">
        <div className="table-card">
          <table className="styled-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Customer</th>
                <th>Date & Time</th>
                <th>Duration</th>
                <th>Service</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => {
              const status = String(booking.status || "").toLowerCase();
              const statusClass = status.trim().replace(/\s+/g, "-");

              return (
                <tr key={booking.id}>
                  <td>#{booking.id}</td>
                  <td>{booking.customer}</td>
                  <td>
                    {booking.date}
                    <div>{booking.time}</div>
                  </td>
                  <td>{booking.duration} hrs</td>
                  <td>{booking.serviceType}</td>
                  <td>
                    <span className={`status-badge ${statusClass}`}>
                      {booking.status}
                    </span>
                  </td>
                    <td>
                      {status === "paid" && (
                      <div className="action-buttons">
                        <button
                          className="btn-accept"
                          onClick={() => acceptBooking(booking.id)}
                        >
                          Accept
                        </button>
                        <button className="btn-reject" onClick={() => handleReject(booking.id)}>
                          Reject
                        </button>
                      </div>
                    )}

                      {status === "accepted" && booking.cleanersAssigned?.length === 0 && (
                        <button
                          className="btn-assign"
                          onClick={() => {
                            setSelectedBooking(booking);
                            setAssignedCleaners([]);
                            setShowAssignModal(true);
                          }}
                        >
                          Assign
                        </button>
                      )}

                      {["accepted", "in progress", "completed"].includes(status) &&
                        booking.cleanersAssigned?.length > 0 && (
                          <span className="assigned-label">Assigned</span>
                      )}


                      {status === "rejected" && <span className="rejected-label">Rejected</span>}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>

      {/* ==========================
           ASSIGN MODAL
      ========================== */}
      {showAssignModal && selectedBooking && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h2>Assign Cleaners</h2>
            <p>
              Select exactly {serviceTypes[selectedBooking.serviceType].cleaners} cleaner(s)
            </p>

            <div className="cleaner-selection-list">
              {cleaners.map((cleaner) => {
                const booked = isCleanerBooked(
                  cleaner.cleanerId,
                  selectedBooking.date,
                  selectedBooking.time,
                  selectedBooking.duration
                );

                const isSelected = assignedCleaners.includes(cleaner.cleanerId);
                const maxSelected =
                  assignedCleaners.length >=
                  serviceTypes[selectedBooking.serviceType].cleaners;

                return (
                  <label
                    key={cleaner.cleanerId}
                    className={`cleaner-option ${booked ? "disabled" : ""}`}
                  >
                    <input
                      type="checkbox"
                      disabled={booked || (!isSelected && maxSelected)}
                      checked={isSelected}
                      onChange={() => {
                        if (isSelected) {
                          setAssignedCleaners(
                            assignedCleaners.filter((id) => id !== cleaner.cleanerId)
                          );
                        } else {
                          setAssignedCleaners([
                            ...assignedCleaners,
                            cleaner.cleanerId,
                          ]);
                        }
                      }}
                    />
                    {cleaner.cleanerName} {booked && "(Booked)"}
                  </label>
                );
              })}
            </div>

            <div className="modal-actions">
              <button className="btn-cancel" onClick={() => setShowAssignModal(false)}>
                Cancel
              </button>
              <button
                className="btn-confirm"
                onClick={handleAssign}
                disabled={
                  assignedCleaners.length !==
                  serviceTypes[selectedBooking.serviceType].cleaners
                }
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
