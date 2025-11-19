// components/layout/SponsorLayout.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { routePath as RP }  from "../../app/components/router/routepath";

const SponsorLayout = ({ children, name, handleLogout }) => {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <>
      {/* ⭐ MOBILE TOP BAR */}
      <div className="sponsor-mobile-bar">
        <button
          className="sponsor-mobile-btn"
          onClick={() => setDrawerOpen(!drawerOpen)}
        >
          ☰
        </button>

        <div className="sponsor-mobile-center">
          <span className="sponsor-mobile-username">{name}</span>
        </div>

        <div className="sponsor-mobile-right"></div>
      </div>

      {/* ⭐ OVERLAY */}
      {drawerOpen && (
        <div
          className="sponsor-drawer-overlay"
          onClick={() => setDrawerOpen(false)}
        ></div>
      )}

      {/* ⭐ DRAWER */}
      <aside className={`sponsor-drawer ${drawerOpen ? "open" : ""}`}>
        <nav className="sponsor-drawer-nav">

           <Link to="/sponsor-dashboard" className="nav-link">Dashboard</Link>

          <Link to="/sponsor-dashboard/sponsorapplication" className="sponsor-drawer-item">
            Applications
          </Link>

          <Link to="/sponsor-dashboard/scholarshipPage" className="sponsor-drawer-item">
            Sponsored Scholarship
          </Link>

          <Link to="/Sponsored-Scholarship" className="sponsor-drawer-item">
            Approved Applications
          </Link>

          {/* <Link to="/sponsor-dashboard/report" className="sponsor-drawer-item">
            Reports
          </Link> */}

          <Link to={RP.ViewSponsorProfile} className="sponsor-drawer-item">
            Profile
          </Link>

          <button className="sponsor-drawer-item logout" onClick={handleLogout}>
            Logout
          </button>

        </nav>
      </aside>

      {/* ⭐ DESKTOP SIDEBAR */}
      <aside className="sidebar">
        <div className="profile">
          <div className="avatar">👤</div>
          <p className="profile-name">{name}</p>
        </div>

        <nav className="sidebar-nav">
          <Link to="/sponsor-dashboard" className="nav-link">Dashboard</Link>
          <Link to="/sponsor-dashboard/sponsorapplication" className="nav-link">Applications</Link>
          <Link to="/sponsor-dashboard/scholarshipPage" className="nav-link">Sponsored Scholarship</Link>
          <Link to="/Sponsored-Scholarship" className="nav-link">Approved Applications</Link>
          {/* <Link to="/sponsor-dashboard/report" className="nav-link">Reports</Link> */}
          <Link to={RP.ViewSponsorProfile} className="nav-link">Profile</Link>
        </nav>

        <div style={{ marginTop: "auto", padding: "1rem" }}>
          <button onClick={handleLogout} className="logout-button">Logout</button>
        </div>
      </aside>

      {/* ⭐ PAGE CONTENT */}
      <div className="sponsor-content">
        {children}
      </div>
    </>
  );
};

export default SponsorLayout;
