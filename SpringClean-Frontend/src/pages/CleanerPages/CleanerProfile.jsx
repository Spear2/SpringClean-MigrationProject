import React, {useState, useEffect} from "react";
import "../../pages/CleanerPages/Styles/CleanerProfileStyles.css";
import NavBarCompany_Cleaner from "../../components/Navbar/NavBarCompany_Cleaner";
import useCleaner from "../../Hooks/useCleaner";
import { useAuth } from "../../auth/useAuth";

export default function CleanerProfile() {
  const { logout } = useAuth();
  const cleaner = useCleaner();
  const [cleanerBookings, setCleanerBookings] = useState([]);
  const [jobsDone, setJobsDone] = useState(0);
  const [avgRating, setAvgRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);

  // Helper to get initials (e.g., "John Doe" -> "JD")
  const getInitials = (name) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  // Fetch cleaner's rating
  // Fetch cleaner's rating
  useEffect(() => {
    if (!cleaner || !cleaner.cleanerId) {
      return;
    }

    const fetchRating = async () => {
      try {
        const ratingRes = await fetch(
          `http://localhost:8080/api/reviews/cleaner/${cleaner.cleanerId}/rating`
        );
        const ratingData = await ratingRes.json();
        
        setAvgRating(ratingData.avgRating || 0);
        setTotalReviews(ratingData.totalReviews || 0);
      } catch (err) {
        console.error("Error fetching cleaner rating:", err);
      }
    };

    fetchRating();
  }, [cleaner?.cleanerId]);

  // Fetch cleaner's bookings
  useEffect(() => {
    if (!cleaner || !cleaner.cleanerId) {
      return;
    }

    fetch(`http://localhost:8080/api/cleaners/${cleaner.cleanerId}/bookings`)
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setCleanerBookings(data);
      })
      .catch((err) => {
        console.error("Error Fetching Cleaner's Bookings: ", err);
      });
  }, [cleaner?.cleanerId]);

  // Calculate jobs done
  useEffect(() => {
    const completedCount = cleanerBookings.filter(
      (booking) => booking.status === "Completed"
    ).length;
    setJobsDone(completedCount);
  }, [cleanerBookings]);

  if (!cleaner) return <div className="loading-text">Loading Profile...</div>;

  return (
    <div className="CleanerProfile-container">
      <NavBarCompany_Cleaner />

      <div className="dashboard-header">
        <h1>My Profile</h1>
        <h1>Account</h1>
      </div>

      <div className="profile-body">
        {/* THE MAIN PROFILE CARD */}
        <div className="profile-card">
          {/* 1. Header Section: Avatar & Name */}
          <div className="profile-header-section">
            <div className="profile-avatar">
              {getInitials(cleaner.cleanerName)}
            </div>
            <h2 className="profile-name">{cleaner.cleanerName}</h2>
            <p className="profile-role">Senior Cleaner</p>

            {/* Quick Stats Row */}
            <div className="profile-stats">
              <div className="stat-box">
                <span className="stat-val">{avgRating.toFixed(1)}</span>
                <span className="stat-label">Rating ({totalReviews} reviews)</span>
              </div>
              <div className="stat-divider"></div>
              <div className="stat-box">
                <span className="stat-val">{jobsDone}</span>
                <span className="stat-label">Jobs Done</span>
              </div>
            </div>
          </div>

          <hr className="divider" />

          {/* 2. Details Section */}
          <div className="profile-details-section">
            <h3 className="section-header">Contact Information</h3>

            <div className="detail-row">
              <label>Email</label>
              <p>{cleaner.email}</p>
            </div>

            <div className="detail-row">
              <label>Phone</label>
              <p>{cleaner.phoneNumber}</p>
            </div>

            <div className="detail-row">
              <label>Address</label>
              <p>{cleaner.address}</p>
            </div>
          </div>

          {/* 3. Actions Section */}
          <div className="profile-actions">
            <button className="btn-logout" onClick={logout}>
              Log Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}