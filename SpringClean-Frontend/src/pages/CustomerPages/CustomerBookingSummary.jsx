import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import HomeBar from "../../components/Navbar/NavBarCustomer";
import BookingCard from "../../components/CustomerBookingSummary/BookingCard";
import "../../CustomersStyles/CustomerBookingSummary.css";
import useCustomer from "../../Hooks/useCustomer";

export default function CustomerBookingSummary() {
  const navigate = useNavigate();
  const location = useLocation();

  const customer = useCustomer();

  const newBooking = location.state?.newBooking || null;

  const [summary, setSummary] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- UI State Management (REQUIRED) ---
  const [showEditModal, setShowEditModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false); // Used for viewing history
  const [selectedBookingId, setSelectedBookingId] = useState(null);
  const [newDate, setNewDate] = useState("");
  const [newTime, setNewTime] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");

  // Fetch bookings from backend
  const fetchBookings = async () => {
    if (!customer || !customer.customerId) return;

    try {
      const res = await fetch(
        `http://localhost:8080/api/bookings/customers/${customer.customerId}/bookings`
      );
      if (!res.ok) {
        throw new Error("Network error while fetching bookings");
      }
      const data = await res.json();
      setSummary(data);
    } catch (error) {
      console.error("Failed to fetch bookings:", error);
    } finally {
      setLoading(false);
    }
  };

  // ---- UPDATE BOOKING ----
  const saveEdit = async () => {
    try {
      // Assuming selectedBookingId is set
      await fetch(`http://localhost:8080/api/bookings/${selectedBookingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookingDate: newDate,
          bookingTime: newTime,
        }),
      });

      fetchBookings();
      setShowEditModal(false);
    } catch (error) {
      console.error("Error updating booking:", error);
    }
  };

  // ---- CANCEL BOOKING ----
  const confirmCancel = async () => {
    if (!customer || !customer.customerId) {
      console.log("Customer ID: ", customer.customerId);
      return;
    }
    try {
      // API call using DELETE
      await fetch(
        `http://localhost:8080/api/bookings/${selectedBookingId}/${customer.customerId}`,
        {
          method: "DELETE",
        }
      );

      fetchBookings();
      setShowCancelModal(false);
    } catch (error) {
      console.error("Error deleting booking:", error);
    }
  };

  useEffect(() => {
    if (customer && customer.customerId) {
      fetchBookings();
    }
  }, [customer]);

  useEffect(() => {
    if (newBooking && customer?.customerId) {
      fetchBookings();
    }
  }, [newBooking, customer]);

  // Filter logic is correct
  const filteredBookings = summary
    .filter(b => filterStatus === "All" || b.status === filterStatus)
    .sort((a, b) => {
      const dateA = new Date(`${a.date} ${a.time}`);
      const dateB = new Date(`${b.date} ${b.time}`);
      return dateA - dateB;
    });


  if (!customer) return <p>Loading customer...</p>;
  if (loading) return <p>Loading bookings...</p>;

  return (
    <>
      <HomeBar />

      <div className="main-wrappers cbc-booking-page">
        {" "}
        {/* Added cbc-booking-page class to main wrapper */}
        <header className="cbc-page-header">
          <button
            className="cbc-btn-back-arrow"
            onClick={() => navigate("/customer")}
          >
            &larr;
          </button>
          <div className="cbc-header-text">
            <h1>Booking History</h1>
            <p>View and manage all your past and upcoming bookings.</p>
          </div>
        </header>
        <div className="cbc-booking-summary-container">
          <div className="cbc-filter-container">
            <label>Filter by Status:</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="All">All</option>
              <option value="Pending">Pending</option>
              <option value="Accepted">Accepted</option>{" "}
              {/* Correct status name based on company flow */}
              <option value="Paid">Paid</option>
              <option value="Accepted">Accepted</option>
              <option value="In progress">In Progress</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
              <option value="Rejected">Rejected</option>{" "}
              {/* Added Rejected status */}
            </select>
          </div>

          <div className="cbc-summary-list">
            {filteredBookings.length === 0 ? (
              <p className="cbc-no-bookings">
                No bookings found for the selected filter.
              </p>
            ) : (
              filteredBookings.map((item) => (
                <BookingCard
                  key={item.bookingId}
                  status={item.status}
                  date={`${item.date} - ${item.time}`}
                  companyCleaner={item.companyName}
                  cleaner={item.assignedCleanerNames} // Pass assigned cleaners list
                  location={item.address}
                  onEdit={() => {
                    // Set current values for pre-filling the modal
                    setNewDate(item.date);
                    setNewTime(item.time);
                    setSelectedBookingId(item.bookingId);
                    setShowEditModal(true);
                  }}
                  onCancel={() => {
                    setSelectedBookingId(item.bookingId);
                    setShowCancelModal(true);
                  }}
                  onPay={() =>
                    navigate("/customer/payments", {
                      state: { newBooking: item },
                    })
                  }
                  onViewHistory={() => {
                    setSelectedBookingId(item.bookingId);
                    setShowHistoryModal(true);
                  }}
                />
              ))
            )}
          </div>
        </div>
        {/* EDIT MODAL */}
        {showEditModal && (
          <div className="cbc-modal-overlay">
            <div className="cbc-modal-content">
              <h2>Edit Booking</h2>
              <p>Change your preferred date and time.</p>
              <label>Date:</label>
              <input
                type="date"
                value={newDate}
                onChange={(e) => setNewDate(e.target.value)}
              />
              <label>Time:</label>
              <input
                type="time"
                value={newTime}
                onChange={(e) => setNewTime(e.target.value)}
              />

              <div className="cbc-modal-actions">
                <button className="cbc-btn-save" onClick={saveEdit}>
                  Save Changes
                </button>
                <button
                  className="cbc-btn-close-modal"
                  onClick={() => setShowEditModal(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
        {/* CANCEL MODAL */}
        {showCancelModal && (
          <div className="cbc-modal-overlay">
            <div className="cbc-modal-content">
              <h2>Confirm Cancellation</h2>
              <p>
                Are you sure you want to cancel this booking? This action cannot
                be undone.
              </p>
              <div className="cbc-modal-actions">
                <button className="cbc-btn-danger" onClick={confirmCancel}>
                  Yes, Cancel
                </button>
                <button
                  className="cbc-btn-close-modal"
                  onClick={() => setShowCancelModal(false)}
                >
                  No, Keep It
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
