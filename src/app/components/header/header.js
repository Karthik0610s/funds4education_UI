import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiBell, FiMenu, FiX, FiLogOut } from "react-icons/fi";

import { IoMdArrowDropdown } from "react-icons/io";
import logo from "../../assests/logo2.png";
import { routePath as RP } from "../router/routepath";
import "./header.css";
import { useDispatch } from "react-redux";
import { logout } from "../../redux/slices/authSlice";
import defaultImage from "../../assests/DefaultImage.png";
import { publicAxios } from "../../../api/config";
import { ApiKey } from "../../../api/endpoint";

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
//const menuRef = useRef(null);
const mobileMenuRef = useRef(null);
const desktopMenuRef = useRef(null);


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
  const handleLogout = async () => {
  const userId = localStorage.getItem("userId");

  if (userId) {
    await publicAxios.post((`${ApiKey.GetSessionClosed}?sessionId=${userId}`)
    );
  }

  localStorage.clear(); // or remove specific keys

  navigate("/login");
};

  
// MOBILE MENU CLOSE
useEffect(() => {
  const handleClickOutside = (event) => {
    const clickedInsideMobile =
      mobileMenuRef.current &&
      mobileMenuRef.current.contains(event.target);

    const clickedInsideDesktop =
      desktopMenuRef.current &&
      desktopMenuRef.current.contains(event.target);

    if (!clickedInsideMobile && !clickedInsideDesktop) {
      setMenuOpen(false);
    }
  };

  if (menuOpen) {
    document.addEventListener("mousedown", handleClickOutside);
  }

  return () => {
    document.removeEventListener("mousedown", handleClickOutside);
  };
}, [menuOpen]);

// 1️⃣ Get values from localStorage
const filePath = (localStorage.getItem("filepath") || "");
//.replace(/\\/g, "/");
const fileNameRaw = localStorage.getItem("filename") || "";

console.log("📁 filePath =", filePath);
console.log("📝 fileNameRaw =", fileNameRaw);
// normalize slashes & remove trailing //
const normalizedPath = filePath
  .replace(/\\/g, "/")
  .replace(/\/+$/, "");

console.log("📁 normalizedPath =", normalizedPath);
// 2️⃣ Extract folder name (student-26)
const folderName = normalizedPath.split("/").pop();
console.log("📂 folderName =", folderName);

// 3️⃣ Base URL
const baseUrl = publicAxios.defaults.baseURL.replace(/\/api$/, "");
console.log("🌐 baseUrl =", baseUrl);

// 4️⃣ STEP 1 - Clean file name (remove trailing | and spaces)
const cleanFileName = fileNameRaw.split("|")[0]?.trim() || "";
console.log("✨ cleanFileName =", cleanFileName);

// 5️⃣ STEP 2 - Remove invisible special characters
const finalFileName = cleanFileName.replace(/[^\x20-\x7E]/g, "");
console.log("🧹 finalFileName =", finalFileName);

// 6️⃣ STEP 3 - Detect if file is image
const isImage =
  finalFileName && /\.(png|jpg|jpeg|gif)$/i.test(finalFileName);
// ⬅️ IMPORTANT — if empty => use default image

console.log("🖼️ isImage =", isImage);

// 7️⃣ STEP 4 - Encode safe filename
const encodedFileName = encodeURIComponent(finalFileName);
console.log("🔐 encodedFileName =", encodedFileName);
console.log("👉 DefaultImage URL =", defaultImage);

// Pick the correct folder
//const parentFolder = roleName === "Sponsor" ? "sponsor" : "student";
let parentFolder = "";

if (roleName === "Student") parentFolder = "student";
else if (roleName === "Sponsor") parentFolder = "sponsor";
else if (roleName ==="Faculty") parentFolder="faculty";
// 8️⃣ STEP 5 - Build final image URL
const profileImageUrl =
  folderName && finalFileName
    ? `${baseUrl}/${parentFolder}/${folderName}/${encodedFileName}`
    : defaultImage;

console.log("🔗 profileImageUrl =", profileImageUrl);
 // 🔟 Image src state
  const [imgSrc, setImgSrc] = useState(defaultImage);

  // 1️⃣1️⃣ Update image when data changes
  useEffect(() => {
    if (isImage && profileImageUrl) {
      setImgSrc(profileImageUrl);
    } else {
      setImgSrc(defaultImage);
    }
  }, [profileImageUrl, isImage]);

// 9️⃣ STEP 6 - alt text without extension
const altText = finalFileName
  ? finalFileName.replace(/\.[^/.]+$/, "")
  : "";

console.log("🔤 altText =", altText);

const initialImg = isImage ? profileImageUrl : defaultImage;
const [imgError, setImgError] = useState(initialImg);
  console.log("imgError",imgError);
  const [isCompactHeader, setIsCompactHeader] = useState(
  window.innerWidth <= 912
);

useEffect(() => {
  setImgError(isImage ? profileImageUrl : defaultImage);
}, [roleName, profileImageUrl, isImage]);

useEffect(() => {
  const handleResize = () => {
    setIsCompactHeader(window.innerWidth <= 912);
  };

  window.addEventListener("resize", handleResize);
  return () => window.removeEventListener("resize", handleResize);
}, []);
  const renderVariantLinks = (forcedVariant) => {
  const activeVariant = forcedVariant || variant;

  switch (activeVariant) {
      case "public":
        return (
          <>
           {!isLoggedIn && (
          <div className="nav-wrapper">
            <div className="nav-bar">
              <Link to="/"state={{ scrollTo: "hero" }}  >Home</Link>
              <Link to="/" state={{ scrollTo: "benefits-section" }}>About Us</Link>
              <Link to={RP.studentdashboard}>Scholarships</Link>
               <Link to={RP.facultyDashboard}>E-Learning</Link>
                <Link to={RP.InstitutionsPage}>Institution</Link>
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
           )}
           <div className="header-actions student-profile-header" ref={dropdownRef}>
 {/* ---------- NOT LOGGED IN → SHOW PUBLIC HEADER (ABOVE RIGHT SECTION) ---------- */}
      
      
      <div className="right-section" style={{ display: "flex", alignItems: "center", gap: "20px" }}>

        

        {/* IF LOGGED IN → Show Profile Header */}
        {isLoggedIn && (
          <>
            <span style={{ fontWeight: 600 }}>
              Welcome, {userName || "User"}
            </span>

            {/* Bell Icon 
            <FiBell size={22} className="cursor-pointer" />
            */}

            {/* Dropdown Icon */}
            <div className="icon-circle" onClick={toggleDropdown}>
 <img
    src={imgSrc}
    alt={altText || "Profile"}
    className="circle-img"
    onError={() => setImgSrc(defaultImage)}
    style={{
      width: "100%",
      height: "100%",
      objectFit: "cover",
    }}
  />
            </div>

            {/* Dropdown Menu */}
            {dropdownOpen && (
              <div className="dropdown-menu">
                <div
                  className="dropdown-item"
               /*  onClick={() => {
  if (roleName === "Student") {
    navigate("/view-profile");
  } 
  else if (roleName === "Faculty") {
    navigate("/view-faculty-profile"); // ✅ THIS fixes faculty
  } 
  else if (roleName === "Sponsor") {
    navigate("/view-sponsor-profile");
  }

  setDropdownOpen(false);
}}*/ onClick={() => {
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
            <FiLogOut
              size={22}
              className="logout-icon"
              onClick={handleLogout}
              style={{ cursor: "pointer" }}
            />
          </>
        )}

      </div>
    </div>
    </>
        );

      case "student-profile":
  return (
    <>
    {!isLoggedIn && (
        <div className="nav-wrapper">
          <div className="nav-bar">
         <Link to="/"state={{ scrollTo: "hero" }}  >Home</Link>
            <Link to="/" state={{ scrollTo: "benefits-section" }}>About Us</Link>
            <Link to={RP.studentdashboard}>Scholarships</Link>
           <Link to={RP.facultyDashboard}>E-Learning</Link>
                <Link to={RP.InstitutionsPage}>Institution</Link>
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
      )}
    <div className="header-actions student-profile-header" ref={dropdownRef}>
 {/* ---------- NOT LOGGED IN → SHOW PUBLIC HEADER (ABOVE RIGHT SECTION) ---------- */}
      
      
      <div className="right-section" style={{ display: "flex", alignItems: "center", gap: "20px" }}>

        

        {/* IF LOGGED IN → Show Profile Header */}
        {isLoggedIn && (
          <>
            <span style={{ fontWeight: 600 }}>
              Welcome, {userName || "User"}
            </span>

            
            

            {/* Dropdown Icon */}
            <div className="icon-circle" onClick={toggleDropdown}>
             <img
    src={imgSrc}
    alt={altText || "Profile"}
    className="circle-img"
    onError={() => setImgSrc(defaultImage)}
    style={{
      width: "100%",
      height: "100%",
      objectFit: "cover",
    }}
  />
            </div>

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
            <FiLogOut
              size={22}
              className="logout-icon"
              onClick={handleLogout}
              style={{ cursor: "pointer" }}
            />
          </>
        )}

      </div>
    </div>
    </>
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

              {/* Bell Icon 
              <FiBell size={22} className="cursor-pointer" />
              */}

              {/* Dropdown Icon */}
              <div className="icon-circle" onClick={toggleDropdown}>
 <img
    src={imgSrc}
    alt={altText || "Profile"}
    className="circle-img"
    onError={() => setImgSrc(defaultImage)}
    style={{
      width: "100%",
      height: "100%",
      objectFit: "cover",
    }}
  />
              </div>

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
                  onClick={handleLogout}
                  style={{ cursor: "pointer" }}
                />
              )}
            </div>
          </div>
        );
           case "faculty-profile":
  return (
    <>
    {!isLoggedIn && (
        <div className="nav-wrapper">
          <div className="nav-bar">
         <Link to="/"state={{ scrollTo: "hero" }}  >Home</Link>
            <Link to="/" state={{ scrollTo: "benefits-section" }}>About Us</Link>
            <Link to={RP.studentdashboard}>Scholarships</Link>
            <Link to={RP.facultyDashboard}>E-Learning</Link>
                <Link to={RP.InstitutionsPage}>Institution</Link>
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
      )}
    <div className="header-actions student-profile-header" ref={dropdownRef}>
 {/* ---------- NOT LOGGED IN → SHOW PUBLIC HEADER (ABOVE RIGHT SECTION) ---------- */}
      
      
      <div className="right-section" style={{ display: "flex", alignItems: "center", gap: "20px" }}>

        

        {/* IF LOGGED IN → Show Profile Header */}
        {isLoggedIn && (
          <>
            <span style={{ fontWeight: 600 }}>
              Welcome, {userName || "User"}
            </span>

            {/* Bell Icon 
            <FiBell size={22} className="cursor-pointer" />
            */}

            {/* Dropdown Icon */}
            <div className="icon-circle" onClick={toggleDropdown}>
                <img
    src={imgSrc}
    alt={altText || "Profile"}
    className="circle-img"
    onError={() => setImgSrc(defaultImage)}
    style={{
      width: "100%",
      height: "100%",
      objectFit: "cover",
    }}
  />
  {/*{isImage ? (
     <img
      src={imgError}
  alt={altText}
  className="circle-img"
  onError={() => setImgError(defaultImage)}
  style={{
    width: "100%",
    height: "100%",
    objectFit: "cover",
  }}/>
    ) : (
      <div className="alt-logo-text">{altText}</div>
    )}*/}
            </div>

            {/* Dropdown Menu */}
            {dropdownOpen && (
              <div className="dropdown-menu">
                <div
                  className="dropdown-item"
                  onClick={() => {
                    navigate("/view-faculty-profile");
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
            <FiLogOut
              size={22}
              className="logout-icon"
              onClick={handleLogout}
              style={{ cursor: "pointer" }}
            />
          </>
        )}

      </div>
    </div>
    </>
  );

      case "dashboard":
        return (
          <div className="header-right">
            <button className="icon-btn">
              {/*<FiBell size={20} />*/}
            </button>
          </div>
        );

      case "profile-role-based":
  if (!isLoggedIn) return renderVariantLinks("public");

  if (roleName === "Student") return renderVariantLinks("student-profile");
  if (roleName === "Faculty") return renderVariantLinks("faculty-profile");
  if (roleName === "Sponsor") return renderVariantLinks("sponsor-profile");

  return null;

    }
  };

const renderMobileLinks = (forcedVariant) => {
  const activeVariant = forcedVariant || variant;

  switch (activeVariant) {
    /* ---------- PUBLIC ---------- */
    case "public":
      return (
        <> 
          <div className="mobile-item" onClick={() => { navigate("/",{ state: { scrollTo: "hero" }}); setMenuOpen(false); }}>
            Home
          </div>

          <div className="mobile-item" 
               onClick={() => { navigate("/", { state: { scrollTo: "benefits-section" }}); setMenuOpen(false); }}>
            About Us
          </div>

          <div className="mobile-item" onClick={() => { navigate(RP.studentdashboard); setMenuOpen(false); }}>
            Scholarships
          </div>
          <div className="mobile-item" onClick={() => { navigate(RP.facultyDashboard); setMenuOpen(false); }}>
            E-Learning
          </div>
<div className="mobile-item" onClick={() => { navigate(RP.InstitutionsPage); setMenuOpen(false); }}>
           Institution
          </div>
          <div className="mobile-item"
               onClick={() => { setShowSignupModal(true); setMenuOpen(false); }}>
            Sign Up
          </div>
        </>
      );

    /* ---------- STUDENT PROFILE ---------- */
    case "student-profile":
      return isLoggedIn ? (
        <>
          <div className="mobile-item" onClick={() => { navigate("/view-profile"); setMenuOpen(false); }}>
            Profile
          </div>

          <div className="mobile-item" onClick={() => { navigate("/reset-password"); setMenuOpen(false); }}>
            Reset Password
          </div>

          <div className="mobile-item" onClick={() => { navigate("/application"); setMenuOpen(false); }}>
            Applications
          </div>
        </>
      ) : (
        renderMobileLinks("public")
      );

    /* ---------- SPONSOR PROFILE ---------- */
    case "sponsor-profile":
      return isLoggedIn ? (
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
        </>
      ) : (
        renderMobileLinks("public")
      );

      case "faculty-profile":
      return isLoggedIn ? (
        <>
          <div className="mobile-item" onClick={() => { navigate("/view-faculty-profile"); setMenuOpen(false); }}>
            Profile
          </div>

          <div className="mobile-item" onClick={() => { navigate("/reset-password"); setMenuOpen(false); }}>
            Reset Password
          </div>

          
        </>
      ) : (
        renderMobileLinks("public")
      );

      case "profile-role-based":
  if (!isLoggedIn) return renderMobileLinks("public");

 return roleName === "Student"
    ? renderMobileLinks("student-profile")
    : roleName === "Faculty"
      ? renderMobileLinks("faculty-profile")
      : renderMobileLinks("sponsor-profile");

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
             else if (roleName === "Faculty") navigate("/facultydashboard");
          } else {
            navigate("/");
          }
        }}
      />
         {/* <span className="brand">VidyāSetu</span> */}
    </div>

    {/* RIGHT SIDE MOBILE (LOGGED IN) */}
    {isLoggedIn ? (
      <div className="right-mobile">

        <span className="mobile-welcome">Hi, {userName}</span>

        {/* LOGOUT ICON */}
        <FiLogOut
          size={22}
          className="logout-icon"
          onClick={handleLogout}
        />

        {/* MENU ICON */}
         <div className="menu-icon" 
        onClick={toggleMenu}>
          {menuOpen ? <FiX size={26} /> : <FiMenu size={26} />}
        </div> 
        {/* <button
  onClick={toggleMenu}
  className={`menu-toggle ${menuOpen ? "open" : ""}`}
>
  <FiMenu size={26} />
</button> */}

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

    
     {/* MOBILE MENU */}
  {menuOpen && (
  <nav className="mobile-menu"ref={mobileMenuRef}>
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
    ) : isLoggedIn && roleName === "Faculty" ? (
      <div className="left-section" style={{ display: "flex", alignItems: "center", gap: "20px" }}>
        <div
          onClick={() => navigate("/facultydashboard")}
          style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer" }}
        >
          <img src={logo} alt="Vidyasetu" className="logo" />
          <span className="brand">VidyāSetu</span>
        </div>
      </div>
    ): (
      <div
        className="header-left"
        //onClick={handleLogout}
         onClick={() => navigate("/")}
      >
        <img src={logo} alt="VidyaSetu Logo" className="logo" />
        <span className="brand">VidyāSetu</span>
      </div>
    )}

      
    {/* ================= RIGHT SIDE ================= */}
  <div className="right-desktop" ref={desktopMenuRef}>

    {/* ====== <= 912px → MENU STYLE ====== */}
    {isCompactHeader ? (
      <>
        {isLoggedIn ? (
          <>
            <span className="desktop-welcome">Hi, {userName}</span>

            <FiLogOut
              size={22}
              className="logout-icon"
              onClick={handleLogout}
            />

            <div className="menu-icon-desktop" onClick={toggleMenu}>
              {menuOpen ? <FiX size={26} /> : <FiMenu size={26} />}
            </div>
          </>
        ) : (
          <>
            <span
              className="desktop-login"
              onClick={() => navigate("/login")}
            >
              Login
            </span>

            <div className="menu-icon-desktop" onClick={toggleMenu}>
              {menuOpen ? <FiX size={26} /> : <FiMenu size={26} />}
            </div>
          </>
        )}

        {menuOpen && (
          <div className="desktop-menu" ref={desktopMenuRef}>
            {renderMobileLinks()}
          </div>
        )}
      </>
    ) : (
      /* ====== > 912px → NORMAL DESKTOP LINKS ====== */
      <div className="desktop-links">
        {renderVariantLinks()}
      </div>
    )}

  </div>
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
    navigate("/facultySignup");
  }}
>
  Faculty
</button>

            <span className="close-btn" onClick={() => setShowSignupModal(false)}>✖</span>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
