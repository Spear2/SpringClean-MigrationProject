import React, { useState } from "react";
import "./NavBarStyle.css";
import { Link } from "react-router-dom";

const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <nav className="navbar-container">
      <Link to="/" className="title-link">
        SpringClean
      </Link>

      <div className={`nav-links ${isOpen ? "open" : ""}`}>
        <a href="/#">Home</a>
        <a href="/#services">Services</a>
        <a href="/#aboutus">About Us</a>
        <Link to="/login/ChooseYourRole">Login/Sign Up</Link>
      </div>

      <div className="hamburger" onClick={toggleMenu}>
        <span></span>
        <span></span>
        <span></span>
      </div>
    </nav>
  );
};

export default NavBar;
