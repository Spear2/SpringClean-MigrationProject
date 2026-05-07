import React, { useState } from "react";
import RoleButton from "../RoleButton/RoleButton";
import cleanerIcon from "../../../assets/broom.ico";
import customerIcon from "../../../assets/user-solid-full.svg";
import companyIcon from "../../../assets/building.png";
import StepJourney from "../Journey/StepJourney";
import { Link } from "react-router-dom";

export default function FirstStep({
  onNext,
  formData,
  updateFormData,
  currentStep,
}) {
  const [role, setRole] = useState(formData.role || "");

  const handleNext = () => {
    if (!role) {
      alert("Please select a role!");
      return;
    }
    updateFormData({ role });
    onNext();
  };

  // ----------------------
  // INLINE STYLE OBJECTS
  // ----------------------
  const styles = {
    container: {
      border: "3px solid white",
      background: "white",
      borderRadius: "30px",
      padding: "40px",
      minWidth: "400px",
      minHeight: "45vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: "30px",
      textAlign: "center",
      boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
    },
    title: {
      fontFamily: "Cal Sans, sans-serif",
      fontWeight: 500,
      fontSize: "3rem",
      margin: 0,
      color: "#1c4274",
    },
    subtitle: {
      fontFamily: "Nunito, sans-serif",
      fontSize: "1.5rem",
      margin: "10px 0 0 0",
      color: "#555",
    },
    roleButtons: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "30px",
      flexWrap: "wrap",
      padding: "20px",
    },
    navButtons: {
      display: "flex",
      gap: "30px",
    },
    backButton: {
      fontFamily: "Cal Sans, sans-serif",
      padding: "15px 30px",
      fontSize: "1.5rem",
      background: "#ccc",
      border: "none",
      borderRadius: "30px",
      cursor: "pointer",
    },
    nextButton: {
      padding: "15px 30px",
      fontFamily: "Cal Sans, sans-serif",
      background: "#1c4274",
      fontSize: "1.5rem",
      color: "white",
      border: "none",
      borderRadius: "30px",
      cursor: "pointer",
      opacity: role ? 1 : 0.5,
    },

    // Mobile responsiveness
    "@media(maxWidth: 768px)": {
      container: {
        padding: "30px 20px",
        minHeight: "40vh",
      },
      title: { fontSize: "2rem" },
      subtitle: { fontSize: "1.2rem" },
      roleButtons: { gap: "20px" },
    },
  };

  return (
    <div style={styles.container}>
      <div className="description">
        <h1 style={styles.title}>Please choose your role:</h1>
        <p style={styles.subtitle}>Looking to book or be booked?</p>
      </div>

      <div style={styles.roleButtons}>
        <RoleButton
          icon={cleanerIcon}
          label="Cleaner"
          onClick={() => setRole("cleaner")}
          active={role === "cleaner"}
        />

        <RoleButton
          icon={customerIcon}
          label="Customer"
          onClick={() => setRole("customer")}
          active={role === "customer"}
        />
        <RoleButton
          icon={companyIcon}
          label="Company"
          onClick={() => setRole("company")}
          active={role === "company"}
        />
      </div>

      <div style={styles.navButtons}>
        <Link to="/">
          <button style={styles.backButton}>Back</button>
        </Link>
        <button style={styles.nextButton} onClick={handleNext} disabled={!role}>
          Next →
        </button>
      </div>
    </div>
  );
}
