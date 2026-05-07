import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./NavBarCustomerStyle.css";
import { useAuth } from "../../auth/useAuth";
import useCustomer from "../../Hooks/useCustomer";

export default function NavBarCustomer() {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const auth = useAuth();
  const customer = useCustomer();

  if (!customer || !auth.user) return null;

  return (
    <>
      <nav className="navbar-container">
        <Link to="/customer" className="title-link">SpringClean</Link>

        <div className={`nav-links ${isOpen ? "open" : ""}`}>
          <Link to="/customer">Home</Link>
          <Link to="/customer/reviews">Reviews</Link>
          <Link to="/customer/wallet">Wallet</Link>

          <button 
            className="account-btn" 
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            <div className="account-circle">{customer.firstName?.[0]}</div>
            {customer.lastName}
            <span className={`arrow ${dropdownOpen ? "rotated" : ""}`}>▾</span>
          </button>
        </div>

        <div className="hamburger" onClick={() => setIsOpen(!isOpen)}>
          <span></span><span></span><span></span>
        </div>
      </nav>

      <div className={`dropdown-menu ${dropdownOpen ? "show" : ""}`}>
        <Link to="/customer/profile" className="menu-item">Profile</Link>
        <Link to="/customer/settings" className="menu-item">Settings</Link>
        <div 
          className="menu-item sign-out" 
          onClick={() => { 
            auth.logout(); 
            setDropdownOpen(false);
          }}
        >
          Log Out
        </div>
      </div>
    </>
  );
}
