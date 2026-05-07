import "./CustomerLoginPage.css";
import React, { useState } from "react";
import { Link, useNavigate  } from "react-router-dom";
import { useAuth } from "../../auth/useAuth";

const CustomerLoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async () =>{
    if(!email || !password){
      alert("Please fill the field");
      return;
    }

    const payload = { email, password };

    try{
      const response = await fetch("http://localhost:8080/api/customers/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if(response.ok) {
        const data = await response.json();
        alert("Login Successfuly", data);

        login({
          id: data.customerId,
          token: data.token,
          type: "customer",
        });
        navigate("/customer")
        
      }else{
        const err = await response.json();
        alert(err.message || "Invalid Credentials");
      }
    }catch(error){
      alert("Something is wrong!");

    }
  };

  return (
    <div className="page-container">
      {/* Left side */}
      <div className="left-side">
        <h1>SpringClean</h1>
      </div>

      {/* Right side */}
      <div className="right-side">
        <div className="loginform-container">
          <div className="loginform-header">
            <h2>Customer Login</h2>
            <p>Welcome back! Please log in to continue.</p>
          </div>

          {/* Username */}
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              value={email}
              placeholder="Enter your username"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* Password */}
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              placeholder="Enter your password"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {/* Login button */}
          <div className="form-group">
            <button className="login-btn" onClick={handleLogin}>
              Log In
            </button>
          </div>

          <p className="signup-text">
            Don’t have an account? <Link to="/Register">Sign up</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default CustomerLoginPage;
