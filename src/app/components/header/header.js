import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiBell, FiMenu, FiX } from "react-icons/fi";
import { IoMdArrowDropdown } from "react-icons/io";
import logo from "../../assests/Logo.png";
import { routePath as RP } from "../router/routepath";
import "./header.css";
import { useDispatch } from "react-redux";
import { logout } from "../../redux/slices/authSlice";

const Header = ({ variant = "public" }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [menuOpen, setMenuOpen] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const dropdownRef = useRef(null);

  const toggleMenu = () => setMenuOpen((prev) => !prev);
  const toggleDropdown = () => setDropdownOpen((prev) => !prev);

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const scrollToSection = (id) => {
    const section = document.getElementById(id);
    if (section) section.scrollIntoView({ behavior: "smooth" });
  };

  const renderVariantLinks = () => {
    switch (variant) {
      case "public":
        return (
          <div className="nav-wrapper">
            <div className="nav-bar">
              <Link to="/">Home</Link>
              <Link to="/" state={{ scrollTo: "benefits-section" }}>About Us</Link>
              <Link to={RP.studentdashboard}>Scholarships</Link>
            </div>
            <div className="header-right">
              <Link to="/login">Login</Link>
              <Link
                to="#"
                className="signup-btn"
                onClick={(e) => {
                  e.preventDefault();
                  setShowSignupModal(true);
                }}
              >
                Sign Up
              </Link>
            </div>
          </div>
        );

      case "student-profile":
        return (
          <div className="header-actions" ref={dropdownRef}>
            {/* Bell Icon */}
            <FiBell size={22} className="cursor-pointer" />

            {/* Icon Circle */}
            <div className="icon-circle" onClick={toggleDropdown}>?</div>

            {/* Dropdown Menu */}
            {dropdownOpen && (
              <div className="dropdown-menu">
                <div className="dropdown-item" onClick={() => { navigate("/view-profile"); setDropdownOpen(false); }}>Profile</div>
                <div className="dropdown-item" onClick={() => { navigate("/reset-password"); setDropdownOpen(false); }}>Reset Password</div>
              </div>
            )}

            {/* Language Selector */}
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
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <>
      <header className="header">
        <div className="header-container">
          {/* LOGO */}
          <div
            className="header-left"
            onClick={() => {
              localStorage.clear();
              dispatch(logout());
              navigate(RP.home);
            }}
          >
            <img src={logo} alt="VidyaSetu Logo" className="logo" />
            <span className="brand">VidyāSetu</span>
          </div>

          {/* HAMBURGER */}
          <div className="menu-icon" onClick={toggleMenu}>
            {menuOpen ? <FiX size={26} /> : <FiMenu size={26} />}
          </div>

          {/* NAV CONTENT */}
          <nav className={`nav-menu ${menuOpen ? "open" : ""}`}>
            {renderVariantLinks()}
          </nav>
        </div>
      </header>

      {/* SIGNUP MODAL */}
      {showSignupModal && (
        <div className="signup-modal">
          <div className="modal-content">
            <h2>Select Your Account Type</h2>
            <button className="role-button student" onClick={() => navigate("/signup")}>Student</button>
            <button className="role-button sponsor" onClick={() => navigate("/sponsor/signup")}>Sponsor</button>
            <button className="role-button institution" onClick={() => navigate("/institution/signup")}>Institution</button>
            <span className="close-btn" onClick={() => setShowSignupModal(false)}>✖</span>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
