import React, { useState } from "react";
import "./CleanerLoginPage.css";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/useAuth";

const CleanerLoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async () => {
    if (!email || !password) {
      alert("Please fill in all fields.");
      return;
    }

    const payload = { email, password };

    try {
      const response = await fetch("http://localhost:8080/api/cleaners/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Login Successfully");

        // Accept both backend possibilities: cleanerId or id
        login({
          id: data.cleanerId || data.id,
          token: data.token,
          type: "cleaner",
        });

        navigate("/cleaner");
      } else {
        alert(data.message || "Invalid Credentials");
      }
    } catch (error) {
      console.error("Login Error:", error);
      alert("Could not connect to the server.");
    }
  };

  return (
    <div className="page-container">
      {/* Left Side */}
      <div className="cleaner-left-side">
        <h1 className="brand-title">SpringClean</h1>
      </div>

      {/* Right Side */}
      <div className="cleaner-right-side">
        <div className="loginform-container">
          <div className="form-header">
            <h1>Cleaner Login</h1>
            <p>Welcome back! Please log in to your cleaner account.</p>
          </div>

          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              value={email}
              placeholder="Enter your username (email)"
              onChange={(e) => setEmail(e.target.value)}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              placeholder="Enter your password"
              onChange={(e) => setPassword(e.target.value)}
              className="form-input"
            />
          </div>

          <div className="form-footer">
            <button className="login-btn" onClick={handleLogin}>
              Log In
            </button>
            <p className="signup-text">
              Don’t have an account? <Link to="/Register">Sign up</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CleanerLoginPage;
