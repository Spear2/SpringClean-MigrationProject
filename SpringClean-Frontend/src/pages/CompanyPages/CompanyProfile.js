import React, { useEffect, useState } from "react";
import NavbarCleaner from "../../components/Navbar/NavBarCleaner";
import "../../pages/CompanyPages/CompanyStyles/CompanyProfile.css";
import { useAuth } from "../../auth/useAuth";
import {
  Building,
  MapPin,
  Phone,
  Mail,
  Edit,
  LogOut,
  Star,
  Check,
  X,
} from "lucide-react";

export default function CompanyProfile() {
  const { user, logout } = useAuth();
  const companyId = user?.id;

  const [company, setCompany] = useState(null);
  const [ratingData, setRatingData] = useState({
    avgRating: 0,
    totalReviews: 0,
  });
  const [reviews, setReviews] = useState([]);

  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({});

  useEffect(() => {
    if (!companyId) return;

    // Fetch company info
    fetch(`http://localhost:8080/api/company-cleaners/${companyId}`)
      .then((res) => res.json())
      .then((data) => {
        setCompany(data);
        setEditData(data);
      })
      .catch((err) => console.error("Error loading company:", err));

    // Fetch rating summary
    fetch(`http://localhost:8080/api/reviews/company/${companyId}/rating`)
      .then((res) => res.json())
      .then((data) => setRatingData(data))
      .catch((err) => console.error("Rating error:", err));

    // Fetch actual reviews
    fetch(`http://localhost:8080/api/reviews/company/${companyId}`)
      .then((res) => res.json())
      .then((data) => setReviews(data))
      .catch((err) => console.error("Reviews error:", err));
  }, [companyId]);

  if (!company) return <div>Loading...</div>;

  const getInitials = (name) =>
    name?.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);

  // Update input fields
  const handleChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  // Save updated company data
  const handleSave = () => {
    fetch(`http://localhost:8080/api/company-cleaners/update/${companyId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editData),
    })
      .then((res) => res.json())
      .then((updated) => {
        setCompany(updated);
        setIsEditing(false);
      })
      .catch((err) => console.error("Update error:", err));
  };

  // Cancel editing
  const handleCancel = () => {
    setEditData(company);
    setIsEditing(false);
  };

  return (
    <div className="company-profile-page">
      <NavbarCleaner />

      {/* HEADER */}
      <div className="dashboard-header">
        <div>
          <h1>Company Profile</h1>
          <p style={{ margin: 0, opacity: 0.7 }}>
            Manage your company information.
          </p>
        </div>

        <div style={{ display: "flex", gap: "10px" }}>
          {!isEditing ? (
            <button className="action-btn edit" onClick={() => setIsEditing(true)}>
              <Edit size={16} /> Edit
            </button>
          ) : (
            <>
              <button className="action-btn edit" onClick={handleSave}>
                <Check size={16} /> Save
              </button>

              <button className="action-btn logout" onClick={handleCancel}>
                <X size={16} /> Cancel
              </button>
            </>
          )}

          <button className="action-btn logout" onClick={logout}>
            <LogOut size={16} /> Logout
          </button>
        </div>
      </div>

      <div className="profile-body">
        {/* LEFT COLUMN */}
        <div className="profile-column left">
          {/* Company card */}
          <div className="profile-card center-content">
            <div className="company-avatar">{getInitials(company.companyName)}</div>

            {!isEditing ? (
              <h2 className="company-name">{company.companyName}</h2>
            ) : (
              <input
                name="companyName"
                value={editData.companyName || ""}
                onChange={handleChange}
                className="edit-input"
              />
            )}

            {!isEditing ? (
              <p className="company-tagline">{company.tagline || "No tagline"}</p>
            ) : (
              <input
                name="tagline"
                value={editData.tagline || ""}
                onChange={handleChange}
                className="edit-input"
              />
            )}

            {/* Stats */}
            <div className="stats-row">
              <div className="stat-item">
                <span className="stat-val">{ratingData.avgRating.toFixed(1)}</span>
                <span className="stat-lbl">Rating</span>
              </div>

              <div className="stat-divider"></div>

              <div className="stat-item">
                <span className="stat-val">{company.employees || 0}</span>
                <span className="stat-lbl">Employees</span>
              </div>

              <div className="stat-divider"></div>

              <div className="stat-item">
                <span className="stat-val">{company.projects || 0}</span>
                <span className="stat-lbl">Jobs Done</span>
              </div>
            </div>
          </div>

          {/* DETAILS CARD */}
          <div className="profile-card">
            <h3 className="card-header">
              <Building size={18} /> Company Details
            </h3>

            <div className="info-list">
              {/* Email */}
              <div className="info-item">
                <Mail size={16} className="info-icon" />
                <div>
                  <label>Email</label>
                  {!isEditing ? (
                    <p>{company.email}</p>
                  ) : (
                    <input
                      name="email"
                      value={editData.email || ""}
                      onChange={handleChange}
                      className="edit-input"
                    />
                  )}
                </div>
              </div>

              {/* Phone */}
              <div className="info-item">
                <Phone size={16} className="info-icon" />
                <div>
                  <label>Phone</label>
                  {!isEditing ? (
                    <p>{company.phoneNumber}</p>
                  ) : (
                    <input
                      name="phoneNumber"
                      value={editData.phoneNumber || ""}
                      onChange={handleChange}
                      className="edit-input"
                    />
                  )}
                </div>
              </div>

              {/* Address */}
              <div className="info-item">
                <MapPin size={16} className="info-icon" />
                <div>
                  <label>Address</label>
                  {!isEditing ? (
                    <p>{company.address}</p>
                  ) : (
                    <input
                      name="address"
                      value={editData.address || ""}
                      onChange={handleChange}
                      className="edit-input"
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="profile-column right">
          {/* About section */}
          <div className="profile-card">
            <h3 className="card-header">About Us</h3>

            {!isEditing ? (
              <p className="about-text">{company.about || "No description."}</p>
            ) : (
              <textarea
                name="about"
                value={editData.about || ""}
                onChange={handleChange}
                className="edit-textarea"
              />
            )}
          </div>

          {/* REVIEWS SECTION */}
          <div className="profile-card">
            <h3 className="card-header">
              <Star size={18} /> Customer Reviews
            </h3>

            {reviews.length > 0 ? (
              <div className="reviews-container">
                {reviews.map((review, index) => (
                  <div key={index} className="review-item">
                    <p className="review-rating">Rating: {review.rating} / 5</p>
                    <p className="review-comment">{review.text}</p>
                    <p className="reviewer-name">
                      –{" "}
                      {review.customer
                        ? `${review.customer.firstName} ${review.customer.lastName}`
                        : "Anonymous"}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p>No reviews yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
