import React from "react";
import { Link } from "react-router-dom";
import "./ThirdStep.css";

export default function ThirdStep() {
  return (
    <div className="thirdstep-container">
      <div className="success-card">
        <div className="success-icon">✅</div>
        <h1>Account Created Successfully!</h1>
        <p>You can now log in and start using SpringClean.</p>

        <Link to="/login/ChooseYourRole">
          <button className="login-btn">Log In</button>
        </Link>
      </div>
    </div>
  );
}
