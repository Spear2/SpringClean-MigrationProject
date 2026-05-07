import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import useCustomer from "../../Hooks/useCustomer";

export default function CustomerProfile() {
  const navigate = useNavigate();

  const customer = useCustomer();

  const [profile, setProfile] = useState({
    firstName: "Jane",
    lastName: "Doe",
    email: "jane.doe@example.com",
    phone: "+1 555-123-4567",
    address: "123 Green Street, Springfield",
    photo: "https://cdn-icons-png.flaticon.com/512/219/219970.png",
  });

  const [editData, setEditData] = useState({ ...profile });
  const [isEditing, setIsEditing] = useState(false);

  if (!customer) return null; // or "Loading..."

  const handleEdit = () => {
    setEditData({
      firstName: customer.firstName,
      lastName: customer.lastName,
      email: customer.email,
      phoneNumber: customer.phoneNumber,
      address: customer.address,
      photo:
        customer.photo ||
        "https://cdn-icons-png.flaticon.com/512/219/219970.png",
    });
    setIsEditing(true);
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setEditData((prev) => ({ ...prev, photo: imageUrl }));
    }
  };

  const handleSave = async () => {
    try {
      const res = await fetch(
        `http://localhost:8080/api/customers/${customer.customerId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            firstName: editData.firstName,
            lastName: editData.lastName,
            email: editData.email,
            phoneNumber: editData.phoneNumber,
            address: editData.address,
          }),
        }
      );

      if (!res.ok) {
        alert("Update failed.");
        return;
      }

      const updated = await res.json();

      // Refresh frontend values
      customer.firstName = updated.firstName;
      customer.lastName = updated.lastName;
      customer.email = updated.email;
      customer.phoneNumber = updated.phoneNumber;
      customer.address = updated.address;

      alert("Profile updated successfully!");
      setIsEditing(false);
    } catch (e) {
      alert("Failed to update customer.");
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleBack = () => {
    navigate("/customer");
  };

  return (
    <>
      <div className="top-content">
        <h1>Manage Profile</h1>
        <span>View and manage profile information up to date.</span>
      </div>

      <div className="ccpr-profile-page-container">
        <div className="ccpr-profile-layout">
          {/* LEFT SIDE IMAGE */}
          <div className="ccpr-profile-left">
            <div className="ccpr-profile-image-box">
              <img
                src={
                  customer.photo ||
                  "https://cdn-icons-png.flaticon.com/512/219/219970.png"
                }
                alt="Profile"
                className="ccpr-profile-image"
              />
            </div>
          </div>

          {/* RIGHT SIDE DETAILS */}
          <div className="ccpr-profile-right">
            <div className="ccpr-profile-fields">
              <div className="ccpr-field-row">
                <div className="ccpr-field-item">
                  <label>First Name</label>
                  <input type="text" value={customer.firstName} readOnly />
                </div>
                <div className="ccpr-field-item">
                  <label>Last Name</label>
                  <input type="text" value={customer.lastName} readOnly />
                </div>
              </div>

              <div className="ccpr-field-row">
                <div className="ccpr-field-item">
                  <label>Email</label>
                  <input type="email" value={customer.email} readOnly />
                </div>
                <div className="ccpr-field-item">
                  <label>Phone</label>
                  <input type="tel" value={customer.phoneNumber} readOnly />
                </div>
              </div>

              <div className="ccpr-field-row single">
                <div className="ccpr-field-item">
                  <label>Address</label>
                  <input type="text" value={customer.address} readOnly />
                </div>
              </div>

              <div className="ccpr-profile-buttons">
                <button className="ccpr-edit-btn" onClick={handleEdit}>
                  Edit Profile
                </button>
                <button className="ccpr-back-btn" onClick={handleBack}>
                  Back to Home
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* EDIT MODAL */}
        {isEditing && (
          <div className="ccpr-modal-overlay">
            <div className="ccpr-uniform-box">
              <div className="ccpr-profile-layout">
                {/* LEFT EDIT IMAGE */}
                <div className="ccpr-profile-left">
                  <div className="ccpr-profile-image-box">
                    <img
                      src={editData.photo}
                      alt="Edit"
                      className="ccpr-profile-image"
                    />
                  </div>
                  <label className="ccpr-upload-label">
                    Change Photo
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoChange}
                    />
                  </label>
                </div>

                {/* RIGHT EDIT FIELDS */}
                <div className="ccpr-profile-right">
                  <div className="ccpr-profile-fields">
                    <div className="ccpr-field-row">
                      <div className="ccpr-field-item">
                        <label>First Name</label>
                        <input
                          type="text"
                          value={editData.firstName}
                          onChange={(e) =>
                            setEditData({
                              ...editData,
                              firstName: e.target.value,
                            })
                          }
                        />
                      </div>

                      <div className="ccpr-field-item">
                        <label>Last Name</label>
                        <input
                          type="text"
                          value={editData.lastName}
                          onChange={(e) =>
                            setEditData({
                              ...editData,
                              lastName: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>

                    <div className="ccpr-field-row">
                      <div className="ccpr-field-item">
                        <label>Email</label>
                        <input
                          type="email"
                          value={editData.email}
                          onChange={(e) =>
                            setEditData({ ...editData, email: e.target.value })
                          }
                        />
                      </div>

                      <div className="ccpr-field-item">
                        <label>Phone Number</label>
                        <input
                          type="tel"
                          value={editData.phoneNumber}
                          onChange={(e) =>
                            setEditData({
                              ...editData,
                              phoneNumber: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>

                    <div className="ccpr-field-row single">
                      <div className="ccpr-field-item">
                        <label>Address</label>
                        <input
                          type="text"
                          value={editData.address}
                          onChange={(e) =>
                            setEditData({
                              ...editData,
                              address: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>
                  </div>

                  <div className="ccpr-profile-buttons">
                    <button
                      className="ccpr-edit-btn"
                      onClick={handleSave}
                      style={{ fontFamily: "Cal Sans" }}
                    >
                      Save Changes
                    </button>
                    <button
                      className="ccpr-back-btn"
                      onClick={handleCancel}
                      style={{ fontFamily: "Cal Sans" }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
