import { Link } from "react-router-dom";
import "./NavBarCleanerStyle.css";
import useCompany from "../../Hooks/useCompany";
import { useAuth } from "../../auth/useAuth";
import React, { useState } from "react";

export default function NavbarCleaner() {
  const company = useCompany();
  const { logout } = useAuth();

  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  if (!company) return <p>Loading...</p>;

  return (
    <nav className="navbar-cleaner">
      <div className="navbar-logo">
        <Link to="/company">
          <span className="logo-text">SpringClean</span>
        </Link>
      </div>

      <ul className={`navbar-links ${isOpen ? "open" : ""}`}>
        <li>
          <Link to="/company">Dashboard</Link>
        </li>
        <li>
          <Link to="/company/bookings">Bookings</Link>
        </li>
        <li>
          <Link to="/company/schedule">Schedule</Link>
        </li>
        <li>
          <Link to="/company/payments">Payments</Link>
        </li>
        <li>
          <Link to="/company/profile">Profile</Link>
        </li>
      </ul>

      {/* <div className="navbar-user">
        <img
          src="https://cdn-icons-png.flaticon.com/512/1946/1946429.png"
          alt="Cleaner avatar"
          className="navbar-avatar"
        />
        <span className="navbar-name">Hi, {company.companyName}!</span>
      </div> */}
      <div
        className={`hamburger ${isOpen ? "active" : ""}`}
        onClick={toggleMenu}
      >
        <span></span>
        <span></span>
        <span></span>
      </div>
    </nav>
  );
}
