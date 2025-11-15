import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiBell, FiUpload, FiDownload, FiMenu, FiX } from "react-icons/fi";
import { IoMdArrowDropdown } from "react-icons/io";
import logo from "../../assests/Logo.png";
import { routePath as RP } from "../router/routepath";
import "./header.css";

const Header = ({ variant = "public" }) => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const scrollToSection = (id) => {
    const section = document.getElementById(id);
    if (section) section.scrollIntoView({ behavior: "smooth" });
  };

  // ✅ Toggles the hamburger menu
  const toggleMenu = () => setMenuOpen((prev) => !prev);

  // ✅ Conditionally render menu items based on variant
  const renderVariantLinks = () => {
    switch (variant) {
      case "public":
        return (
          <div className="nav-wrapper">
            <div className="nav-bar">
              <Link to="/">Home</Link>
              <a
                href="#benefits-section"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection("benefits-section");
                }}
              >
                About Us
              </a>
              <a
                href="#category-section"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection("category-section");
                }}
              >
                Category
              </a>
              <Link to={RP.studentdashboard}>Scholarships</Link>
            </div>
            <div className="header-right">
              <Link to="/login">Login</Link>
              <Link to="/signup">Sign Up</Link>
              <Link to={RP.resetPassword}>Reset Password</Link>
            </div>
          </div>
        );

      case "student-profile":
        return (
          <div className="header-actions">
            <Link to="/login">Login</Link>
            <FiBell size={22} className="cursor-pointer" />
            <div className="icon-circle">
              <span className="icon-text">?</span>
            </div>
            <div className="language-selector">
              <span>English</span>
              <IoMdArrowDropdown />
            </div>
          </div>
        );

      case "student":
        return (
          <div className="nav-links">
            <Link to="/my-scholarships">Dashboard</Link>
            <Link to="/applications">Saved</Link>
            <Link to="/profile">Message</Link>
          </div>
        );

      case "dashboard":
        return (
          <div className="header-right">
            <button className="icon-btn">
              <FiBell size={20} />
            </button>
            <button className="action-btn">
              <FiUpload size={16} /> Upload
            </button>
            <button className="action-btn">
              <FiDownload size={16} /> Download
            </button>
          </div>
        );

      case "sponsordashboardreport":
        return (
          <div className="nav-links">
            <Link to="">Dashboard</Link>
            <Link to="">Campaigns</Link>
            <Link to="">Reports</Link>
          </div>
        );

      case "sponsoraddashboard":
        return (
          <div className="nav-links">
            <Link to="">Dashboard</Link>
            <Link to="">AdCampaigns</Link>
            <Link to="">Settings</Link>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <header className="header">
      <div className="header-container">
        {/* === LEFT: LOGO === */}
        <div className="header-left" onClick={() => navigate(RP.home)}>
          <img src={logo} alt="VidyaSetu Logo" className="logo" />
          <span className="brand">VidyāSetu</span>
        </div>

        {/* === MENU ICON === */}
        <div className="menu-icon" onClick={toggleMenu}>
          {menuOpen ? <FiX size={26} /> : <FiMenu size={26} />}
        </div>

        {/* === NAVIGATION VARIANT === */}
        <nav className={`nav-menu ${menuOpen ? "open" : ""}`}>
          {renderVariantLinks()}
        </nav>
      </div>
    </header>
  );
};

export default Header;
