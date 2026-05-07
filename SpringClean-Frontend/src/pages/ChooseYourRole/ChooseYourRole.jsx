import React from "react";
import "./ChooseYourRole.css";
import { Link } from "react-router-dom";

const ChooseYourRole = () => {
  return (
    <div className="choose-role-page">
      <div className="role-container">
        <h1>Choose Your Role</h1>
        <p className="subtitle">Select how you want to log in to SpringClean</p>

        <div className="button-group">
          <Link to="/login/customer" className="role-btn customer-btn">
            Customer
          </Link>
          <Link to="/login/cleaner" className="role-btn cleaner-btn">
            Cleaner
          </Link>
          <Link to="/login/company" className="role-btn company-btn">
            Company
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ChooseYourRole;
