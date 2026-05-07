import React, { useState } from "react";
// import "./CustomerForm.css";
import "./SecondStep.css";
import ErrorMessage from "./ErrorMessage";

export default function CustomerForm({
  onNext,
  onBack,
  updateFormData,
  formData,
}) {
  const [firstName, setFirstName] = useState(formData.firstName || "");
  const [lastName, setLastName] = useState(formData.lastName || "");
  const [email, setEmail] = useState(formData.email || "");
  const [phoneNumber, setPhoneNumber] = useState(formData.phone || "");
  const [address, setAddress] = useState(formData.address || "");
  const [password, setPassword] = useState(formData.password || "");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);

  const handleSubmit = async () => {
    if (
      !firstName ||
      !lastName ||
      !email ||
      !password ||
      !confirmPassword ||
      !phoneNumber ||
      !address
    ) {
      setError("Please fill in all required fields!");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please Enter a valid email address.");
      return;
    }
    if (!/^09\d{9}$/.test(phoneNumber)) {
      setError("Please enter a valid PH phone number (e.g., 09123456789).");
      return;
    }

    const payload = {
      firstName,
      lastName,
      email,
      phoneNumber,
      address,
      password,
    };

    try {
      const res = await fetch("http://localhost:8080/api/customers/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json();
        alert(err.message || "Customer registration failed!");
        return;
      }

      alert("Customer registered successfully!");
      onNext();
    } catch (error) {
      console.error(error);
      alert("Something went wrong!");
    }
  };

  return (
    <div className="form-container">
      <div className="description">
        <h1>Create Customer Account</h1>
        <p>Join our network of professional cleaners</p>
      </div>

      <div className="form-fields">
        <div className="name-row">
          <input
            type="text"
            placeholder="First Name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
          <input
            type="text"
            placeholder="Last Name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
        </div>

        <input
          type="email"
          placeholder="Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="text"
          placeholder="Phone Number"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
        />
        <input
          type="text"
          placeholder="Address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
      </div>

      {error && <ErrorMessage message={error} />}

      <div className="button-group">
        <button className="back-button" onClick={onBack}>
          ← Back
        </button>
        <button className="next-button" onClick={handleSubmit}>
          Next →
        </button>
      </div>
    </div>
  );
}
