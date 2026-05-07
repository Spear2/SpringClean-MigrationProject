import React, { useState, useEffect, use } from "react";
import "./SecondStep.css";
import ErrorMessage from "./ErrorMessage";

export default function CompanyForm({
  onNext,
  onBack,
  updateFormData,
  formData,
}) {
  const [companyCleanerId, setCompanyCleanerId] = useState("");
  const [companyCleaners, setCompanyCleaners] = useState([]);
  const [cleanerName, setCleanerName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);



  const handleSubmit = async () => {

    console.log(companyCleanerId, cleanerName, email, phoneNumber, address, password, confirmPassword);
    if (
      !companyCleanerId ||
      !cleanerName ||
      !email ||
      !phoneNumber ||
      !address ||
      !password ||
      !confirmPassword
    ) {
      setError("Please Enter All required fields!");
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
    
    const payload = { cleanerName, email, password, phoneNumber, address, companyCleanerId };

    try{
      const res = await fetch(
        "http://localhost:8080/api/cleaners/register",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
      if (!res.ok) {
        const err = await res.json();
        alert(err.message || "Cleaner registration failed!");
        return;
      }
      alert("Cleaner registered successfully!");
      onNext();
    } catch (error) {
      alert("Something went wrong!");
    }

  };
  
  useEffect(() => {
    fetch('http://localhost:8080/api/company-cleaners')
    .then((res) => res.json())
    .then((data) => {
      setCompanyCleaners(data);
    })
    .catch((err) => {
      console.error("Error Fetching companies: ", err);
    });
  }, []);

  return (
    <div className="form-container">
      <div className="description">
        <h1>Create Cleaner Account</h1>
        <p>Please select your company from the list below.</p>
      </div>

      <div className="form-fields">
        <select
          className="form-select"
          value={companyCleanerId}
          onChange={(e) => setCompanyCleanerId(e.target.value)}
        >
          <option value="" disabled>
            Choose a company
          </option>

          {companyCleaners.map((company) => (
            <option key={company.companyCleanerId} value={company.companyCleanerId}>
              {company.companyName} {company.companyCleanerId}
            </option>
          ))}
        </select>
        <input
          type="text"
          placeholder="Name"
          value={cleanerName}
          onChange={(e) => setCleanerName(e.target.value)}
        />
        <input
          type="email"
          placeholder="Email"
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
