import React from "react";

export default function ErrorMessage({ message }) {
  if (!message) return null;

  return (
    <div
      style={{
        backgroundColor: "#ffe5e5",
        color: "#d10000",
        padding: "10px 10px",
        borderRadius: "8px",
        marginTop: "12px",
        fontSize: "0.5rem",
        border: "1px solid #ffb3b3",
        display: "flex",
        alignItems: "center",
        gap: "8px",
        fontFamily: "Nunito",
      }}
    >
      <span style={{ fontWeight: "bold" }}>⚠️</span>
      <span>{message}</span>
    </div>
  );
}
