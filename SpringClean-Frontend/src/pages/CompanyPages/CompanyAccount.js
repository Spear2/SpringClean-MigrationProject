import { useState } from "react";
import NavbarCleaner from "../../components/Navbar/NavBarCleaner";
import SideBarCleaner from "../../components/SideBarCleaner/SideBarCleaner";
import { Mail, Lock, User, Bell, Globe, Shield, Trash2 } from "lucide-react";
import "../../pages/CompanyPages/CompanyStyles/CompanyAccount.css";

export default function CompanyAccount() {
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [newPassword, setNewPassword] = useState("");

  const [company, setCompany] = useState({
    email: "springcleanco@gmail.com",
    password: "password123",
    ownerName: "Juan Dela Cruz",
    ownerPhone: "+63 912 345 6789",
    recoveryEmail: "springclean.recovery@gmail.com",
    timezone: "GMT+8 (Philippines)",
    notifications: {
      booking: true,
      payment: true,
      schedule: true,
    },
  });

  const handleToggle = (field) => {
    setCompany({
      ...company,
      notifications: {
        ...company.notifications,
        [field]: !company.notifications[field],
      },
    });
  };

  const handleDeleteAccount = () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete your company account? This action cannot be undone."
    );

    if (confirmDelete) {
      alert("Company account deleted.");
      // TODO: Add backend API delete request
    }
  };

  return (
    <div className="company-account-page">
      <NavbarCleaner />

      <div className="content-wrapper">
        <SideBarCleaner />

        <div className="account-container">
          <h1 className="account-title">Account Settings</h1>

          {/* Login Credentials */}
          <section className="account-section">
            <h3>
              <Lock className="icon" /> Login Credentials
            </h3>

            <div className="account-row">
              <label>Email</label>
              <div className="account-value-row">
                <Mail size={18} />
                <input
                  type="text"
                  value={company.email}
                  onChange={(e) =>
                    setCompany({ ...company, email: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="account-row">
              <label>Password</label>
              <button
                className="btn-secondary"
                onClick={() => setShowPasswordModal(true)}
              >
                Change Password
              </button>
            </div>
          </section>

          {/* Preferences */}
          <section className="account-section">
            <h3>
              <Globe className="icon" /> System Preferences
            </h3>

            <div className="account-row">
              <label>Timezone</label>
              <input
                type="text"
                value={company.timezone}
                onChange={(e) =>
                  setCompany({ ...company, timezone: e.target.value })
                }
              />
            </div>

            {["booking", "payment", "schedule"].map((type) => (
              <div key={type} className="account-row toggle-row">
                <label>
                  <Bell size={18} />{" "}
                  {type.charAt(0).toUpperCase() + type.slice(1)} Notifications
                </label>
                <input
                  type="checkbox"
                  checked={company.notifications[type]}
                  onChange={() => handleToggle(type)}
                />
              </div>
            ))}
          </section>

          {/* Danger Zone */}
          <section className="account-section danger-zone">
            <h3>
              <Shield className="icon" /> Security & Danger Zone
            </h3>

            <button className="btn-danger" onClick={handleDeleteAccount}>
              <Trash2 size={18} /> Delete Company Account
            </button>
          </section>

          {/* Password Modal */}
          {showPasswordModal && (
            <div className="modal-overlay">
              <div className="modal">
                <h2>Change Password</h2>

                <input
                  type="password"
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />

                <div className="modal-buttons">
                  <button
                    className="btn-save"
                    onClick={() => {
                      if (!newPassword)
                        return alert("Password cannot be empty.");
                      setCompany({ ...company, password: newPassword });
                      setShowPasswordModal(false);
                      alert("Password updated successfully!");
                    }}
                  >
                    Save
                  </button>

                  <button
                    className="btn-cancel"
                    onClick={() => setShowPasswordModal(false)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
