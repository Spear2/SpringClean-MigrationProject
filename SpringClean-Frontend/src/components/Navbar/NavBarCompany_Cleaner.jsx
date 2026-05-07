import React from "react";
import "./NavBarCompany_Cleaner.css";
import useCleaner from "../../Hooks/useCleaner";
import { useAuth } from "../../auth/useAuth";
import { Link } from "react-router-dom";
import { useState } from "react";

export default function NavBarCompany_Cleaner() {
  const cleaner = useCleaner();
  const { Logout } = useAuth();

  const [isOpen, setIsOpen] = useState(false);
  const toggleMenu = () => setIsOpen(!isOpen);

  if (!cleaner) return <p>Loading...</p>;
  return (
    <>
      <nav className="CompanyCleanerNavbar">
        <div className="navbar-logo">
          <Link to="/cleaner">
            <span className="logo-text">SpringClean</span>
          </Link>
        </div>

        <ul className={`navbar-links ${isOpen ? "open" : ""}`}>
          <li>
            <Link to="/cleaner">Dashboard</Link>
          </li>
          <li>
            <Link to="/cleaner/bookings">Bookings</Link>
          </li>
          <li>
            <Link to="/cleaner/reviews">Reviews</Link>
          </li>
          <li>
            <Link to="/cleaner/earnings">Earnings</Link>
          </li>
          <li>
            <Link to="/cleaner/profile">Profile</Link>
          </li>
        </ul>
        <div
          className={`hamburger ${isOpen ? "active" : ""}`}
          onClick={toggleMenu}
        >
          <span></span>
          <span></span>
          <span></span>
        </div>
      </nav>
    </>
  );
}
