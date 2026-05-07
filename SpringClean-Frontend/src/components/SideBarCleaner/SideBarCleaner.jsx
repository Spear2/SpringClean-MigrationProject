import React from "react";
import "./SideBarCleaner.css";
import { Link } from "react-router-dom";
import { useAuth } from "../../auth/useAuth";

// ICONS
import { User, NotebookPen, Palette, LogOut } from "lucide-react";

export default function SideBarCleaner() {
  const { logout } = useAuth();

  return (
    <div className="sidebar">
      <nav className="menu">
        <ul className="menu-tabs">
          <Link to="/company/profile" style={{ textDecoration: "none" }}>
            <li>
              <User size={18} style={{ marginRight: "10px" }} />
              Profile
            </li>
          </Link>

          <Link to="/company/account" style={{ textDecoration: "none" }}>
            <li>
              <NotebookPen size={18} style={{ marginRight: "10px" }} />
              Account
            </li>
          </Link>

          {/* <Link to="/company/appearance" style={{ textDecoration: "none" }}>
            <li>
              <Palette size={18} style={{ marginRight: "10px" }} />
              Appearance
            </li>
          </Link> */}

          <Link
            style={{ textDecoration: "none" }}
            to="/"
            onClick={() => {
              const confirmLogout = window.confirm(
                "Are you sure you want to log out?"
              );
              if (confirmLogout) logout();
            }}
          >
            <li>
              <LogOut size={18} style={{ marginRight: "10px" }} />
              Log Out
            </li>
          </Link>
        </ul>
      </nav>
    </div>
  );
}
