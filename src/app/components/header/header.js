import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiBell, FiMenu, FiX, FiLogOut } from "react-icons/fi";
import logo from "../../assests/Logo.png";
import { routePath as RP } from "../router/routepath";
import "./header.css";
import { useDispatch } from "react-redux";
import { logout } from "../../redux/slices/authSlice";

const Header = ({ variant = "public" }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const userId = localStorage.getItem("userId");
  const roleId = localStorage.getItem("roleId");
  const roleName = localStorage.getItem("roleName");
  const userName = localStorage.getItem("name");

  const isLoggedIn = userId && roleId;

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
          <div className="header-actions student-profile-header" ref={dropdownRef}>
            {/* RIGHT SIDE */}
            <div className="right-section" style={{ display: "flex", alignItems: "center", gap: "20px" }}>
              {isLoggedIn ? (
                <span style={{ fontWeight: 600 }}>
                  Welcome, {userName || "User"}
                </span>
              ) : (
                <span
                  style={{ cursor: "pointer", fontWeight: 600 }}
                  onClick={() => navigate("/login")}
                >
                  Login
                </span>
              )}

              {/* Bell Icon */}
              <FiBell size={22} className="cursor-pointer" />

              {/* Dropdown Icon */}
              <div className="icon-circle" onClick={toggleDropdown}>?</div>

              {/* Dropdown Menu */}
              {dropdownOpen && (
                <div className="dropdown-menu">
                  <div
                    className="dropdown-item"
                    onClick={() => {
                      navigate("/view-profile");
                      setDropdownOpen(false);
                    }}
                  >
                    Profile
                  </div>

                  <div
                    className="dropdown-item"
                    onClick={() => {
                      navigate("/reset-password");
                      setDropdownOpen(false);
                    }}
                  >
                    Reset Password
                  </div>
                </div>
              )}

              {/* Logout */}
              {isLoggedIn && (
                <FiLogOut
                  size={22}
                  className="logout-icon"
                  onClick={() => {
                    localStorage.clear();
                    dispatch(logout());
                    navigate("/");
                  }}
                  style={{ cursor: "pointer" }}
                />
              )}
            </div>
          </div>
        );
        case "sponsor-profile":
        return (
          <div className="header-actions student-profile-header" ref={dropdownRef}>
            {/* RIGHT SIDE */}
            <div className="right-section" style={{ display: "flex", alignItems: "center", gap: "20px" }}>
              {isLoggedIn ? (
                <span style={{ fontWeight: 600 }}>
                  Welcome, {userName || "User"}
                </span>
              ) : (
                <span
                  style={{ cursor: "pointer", fontWeight: 600 }}
                  onClick={() => navigate("/login")}
                >
                  Login
                </span>
              )}

              {/* Bell Icon */}
              <FiBell size={22} className="cursor-pointer" />

              {/* Dropdown Icon */}
              <div className="icon-circle" onClick={toggleDropdown}>?</div>

              {/* Dropdown Menu */}
              {dropdownOpen && (
                <div className="dropdown-menu">
                  <div
                    className="dropdown-item"
                    onClick={() => {
                      navigate("/view-sponsor-profile");
                      setDropdownOpen(false);
                    }}
                  >
                    Profile
                  </div>

                  <div
                    className="dropdown-item"
                    onClick={() => {
                      navigate("/reset-password");
                      setDropdownOpen(false);
                    }}
                  >
                    Reset Password
                  </div>
                </div>
              )}

              {/* Logout */}
              {isLoggedIn && (
                <FiLogOut
                  size={22}
                  className="logout-icon"
                  onClick={() => {
                    localStorage.clear();
                    dispatch(logout());
                    navigate("/");
                  }}
                  style={{ cursor: "pointer" }}
                />
              )}
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

  const renderMobileLinks = (forcedVariant) => {
  const activeVariant = forcedVariant || variant;

  switch (activeVariant) {


    /* ------------------- PUBLIC (MOBILE) ------------------- */
    case "public":
      return (
        <>
          <div className="mobile-item" onClick={() => navigate("/")}>Home</div>
          <div
            className="mobile-item"
            onClick={() => {
              navigate("/", { state: { scrollTo: "benefits-section" } });
            }}
          >
            About Us
          </div>

          <div
            className="mobile-item"
            onClick={() => navigate(RP.studentdashboard)}
          >
            Scholarships
          </div>

          {/*<div
            className="mobile-item"
            onClick={() => navigate("/login")}
          >
            Login
          </div>*/}

          <div
            className="mobile-item"
            onClick={() => {
              setShowSignupModal(true);
              setMenuOpen(false);
            }}
          >
            Sign Up
          </div>
        </>
      );

    /* ------------------- STUDENT PROFILE (MOBILE) ------------------- */
    case "student-profile":
      return (
        <>
          {isLoggedIn ? (
            <>
              <div className="mobile-item" onClick={() => { navigate("/view-profile"); setMenuOpen(false); }}>
                Profile
              </div>

              <div className="mobile-item" onClick={() => { navigate("/reset-password"); setMenuOpen(false); }}>
                Reset Password
              </div>

              <div className="mobile-item" onClick={() => { navigate("/applications"); setMenuOpen(false); }}>
                Applications
              </div>

              {/*<div
                className="mobile-item logout-item"
                onClick={() => {
                  localStorage.clear();
                  dispatch(logout());
                  navigate("/");
                  setMenuOpen(false);
                }}
              >
                Logout
              </div>*/}
            </>
          ) 
           : (
        renderMobileLinks("public")  // ⬅ HERE IS THE FIX
      )}
        </>
      );


       case "sponsor-profile":
      return (
        <>
          {isLoggedIn ? (
            <>
              <div className="mobile-item" onClick={() => { navigate("/view-sponsor-profile"); setMenuOpen(false); }}>
                Profile
              </div>

              <div className="mobile-item" onClick={() => { navigate("/reset-password"); setMenuOpen(false); }}>
                Reset Password
              </div>

              <div className="mobile-item" onClick={() => { navigate("/sponsor-dashboard/sponsorapplication"); setMenuOpen(false); }}>
                Applications
              </div>
              <div className="mobile-item" onClick={() => { navigate("/sponsor-dashboard/scholarshipPage"); setMenuOpen(false); }}>
                Sponsor Scholarship
              </div>
              <div className="mobile-item" onClick={() => { navigate("/Sponsored-Scholarship"); setMenuOpen(false); }}>
                Approved Scholarship
              </div>

              {/*<div
                className="mobile-item logout-item"
                onClick={() => {
                  localStorage.clear();
                  dispatch(logout());
                  navigate("/");
                  setMenuOpen(false);
                }}
              >
                Logout
              </div>*/}
            </>
          ) 
           : (
        renderMobileLinks("public")  // ⬅ HERE IS THE FIX
      )}
        </>
      );

    /* ------------------- STUDENT NAVIGATION (MOBILE) ------------------- */
    case "student":
      return (
        <>
          <div className="mobile-item" onClick={() => navigate("/my-scholarships")}>
            Dashboard
          </div>
          <div className="mobile-item" onClick={() => navigate("/applications")}>
            Saved
          </div>
          <div className="mobile-item" onClick={() => navigate("/profile")}>
            Message
          </div>
        </>
      );

    default:
      return null;
  }
};

  return (
    <>
      <header className="header">

  {/* ================= MOBILE HEADER ================= */}
  <div className="mobile-header">

    {/* LEFT SIDE MOBILE */}
    <div className="left-section-mobile">
      <img
        src={logo}
        alt="logo"
        className="logo"
        onClick={() => {
          if (isLoggedIn) {
            if (roleName === "Student") navigate("/student-dashboard");
            else if (roleName === "Sponsor") navigate("/sponsor-dashboard");
          } else {
            navigate("/");
          }
        }}
      />
    </div>

    {/* RIGHT SIDE MOBILE (LOGGED IN) */}
    {isLoggedIn ? (
      <div className="right-mobile">

        <span className="mobile-welcome">Hi, {userName}</span>

        {/* LOGOUT ICON */}
        <FiLogOut
          size={22}
          className="logout-icon"
          onClick={() => {
            localStorage.clear();
            dispatch(logout());
            navigate("/");
          }}
        />

        {/* MENU ICON */}
        <div className="menu-icon" onClick={toggleMenu}>
          {menuOpen ? <FiX size={26} /> : <FiMenu size={26} />}
        </div>
      </div>
    ) : (
      /* RIGHT SIDE MOBILE (NOT LOGGED IN) */
      <div className="right-mobile">
        <span className="mobile-login" onClick={() => navigate("/login")}>
          Login
        </span>

        <div className="menu-icon-mobile" onClick={toggleMenu}>
          {menuOpen ? <FiX size={26} /> : <FiMenu size={26} />}
        </div>
      </div>
    )}

    {/* MOBILE MENU DROPDOWN 
    <nav className={`nav-menu mobile-menu ${menuOpen ? "open" : ""}`}>
      {isLoggedIn && (
        <>
          <div
            className="dropdown-item"
            onClick={() => {
              navigate("/view-profile");
              setMenuOpen(false);
            }}>
            Profile
          </div>

          <div
            className="dropdown-item"
            onClick={() => {
              navigate("/reset-password");
              setMenuOpen(false);
            }}>
            Reset Password
          </div>

          {roleName === "Student" && (
            <div
              className="dropdown-item"
              onClick={() => {
                navigate("/application");
                setMenuOpen(false);
              }}>
              Applications
            </div>
          )}
        </>
    </nav>*/}
     {/* MOBILE MENU */}
  {menuOpen && (
  <nav className="mobile-menu">
    <div className="mobile-menu-items">
      {renderMobileLinks()}
    </div>
  </nav>
)}
  </div>

  {/* ================= DESKTOP HEADER ================= */}
  <div className="header-container desktop-header">

    {/* LEFT SIDE AREA */}
    {isLoggedIn && roleName === "Student" ? (
      <div className="left-section" style={{ display: "flex", alignItems: "center", gap: "20px" }}>
        <div
          onClick={() => navigate("/student-dashboard")}
          style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer" }}
        >
          <img src={logo} alt="Vidyasetu" className="logo" />
          <span className="brand">VidyāSetu</span>
        </div>

        <div
          onClick={() => navigate("/application")}
          style={{ cursor: "pointer", fontWeight: 500 }}
        >
          Applications
        </div>
      </div>
    ) : isLoggedIn && roleName === "Sponsor" ? (
      <div className="left-section" style={{ display: "flex", alignItems: "center", gap: "20px" }}>
        <div
          onClick={() => navigate("/sponsor-dashboard")}
          style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer" }}
        >
          <img src={logo} alt="Vidyasetu" className="logo" />
          <span className="brand">VidyāSetu</span>
        </div>
      </div>
    ) : (
      <div
        className="header-left"
        onClick={() => {
          localStorage.clear();
          dispatch(logout());
          navigate("/");
        }}
      >
        <img src={logo} alt="VidyaSetu Logo" className="logo" />
        <span className="brand">VidyāSetu</span>
      </div>
    )}

    {/* HAMBURGER (DESKTOP) */}
    <div className="menu-icon-desktop" onClick={toggleMenu}>
      {menuOpen ? <FiX size={26} /> : <FiMenu size={26} />}
    </div>

    {/* NAV CONTENT (RIGHT SIDE DESKTOP) */}
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
            <button
  className="role-button student"
  onClick={() => {
    setShowSignupModal(false);   // CLOSE MODAL
    navigate("/signup");
  }}
>
  Student
</button>

<button
  className="role-button sponsor"
  onClick={() => {
    setShowSignupModal(false);
    navigate("/sponsor/signup");
  }}
>
  Sponsor
</button>

<button
  className="role-button institution"
  onClick={() => {
    setShowSignupModal(false);
    navigate("/institution/signup");
  }}
>
  Institution
</button>

            <span className="close-btn" onClick={() => setShowSignupModal(false)}>✖</span>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
