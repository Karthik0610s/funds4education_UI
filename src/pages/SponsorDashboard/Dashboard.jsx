import { FiBell, FiUpload, FiDownload } from "react-icons/fi";
import { useEffect, useState } from "react";
import "../../pages/styles.css";
import logo from "../../app/assests/Logo.png";
import student1 from "../../app/assests/Img1.jpg";
import student2 from "../../app/assests/img2.jpg";
import student3 from "../../app/assests/img3.jpg";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import Swal from "sweetalert2";
import { logout } from "../../app/redux/slices/authSlice";
import { routePath as RP } from "../../app/components/router/routepath";

export default function SponsorDashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const name =
    useSelector((state) => state.auth.name) || localStorage.getItem("name");

  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  // disable back button
  useEffect(() => {
    window.history.pushState(null, document.title, window.location.href);

    const handleBack = async () => {
      try {
        if (window.persistor?.purge) await window.persistor.purge();
        localStorage.clear();
        sessionStorage.clear();
      } finally {
        window.location.replace("http://localhost:3000/");
      }
    };

    window.addEventListener("popstate", handleBack);
    return () => window.removeEventListener("popstate", handleBack);
  }, []);

  return (
    <div className="dashboard-container">
{/* ⭐ MOBILE BAR */}
<div className="sponsor-mobile-bar">
 <button className="sponsor-mobile-btn" onClick={() => setDrawerOpen(!drawerOpen)}>
  ☰
</button>

  <span className="sponsor-mobile-username">{name}</span>
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

    <button className="sponsor-drawer-item">Dashboard</button>

    <Link to="/sponsor-dashboard/sponsorapplication" className="sponsor-drawer-item">
      Applications
    </Link>

    <Link to="/sponsor-dashboard/scholarshipPage" className="sponsor-drawer-item">
      Sponsored Scholarship
    </Link>

    <Link to="/Sponsored-Scholarship" className="sponsor-drawer-item">
      Approved Applications
    </Link>

    <Link to="/sponsor-dashboard/report" className="sponsor-drawer-item">
      Reports
    </Link>

    <Link to={RP.ViewSponsorProfile} className="sponsor-drawer-item">
      Profile
    </Link>

    <button className="sponsor-drawer-item logout" onClick={handleLogout}>
      Logout
    </button>

  </nav>
</aside>

 {/* Destop Sidebar */}
      <aside className="sidebar">
        <div className="profile">
          <div className="avatar">👤</div>
          <div>
            <p className="profile-name">{name}</p>
          </div>
        </div>

        <nav className="sidebar-nav">
          <button className="active">Dashboard</button>
          <Link to="/sponsor-dashboard/sponsorapplication" className="nav-link">
            Applications
          </Link>
          <Link to="/sponsor-dashboard/scholarshipPage" className="nav-link">
            Sponsored Scholarship
          </Link>
           <Link to="/Sponsored-Scholarship" className="nav-link">
            Approved
            Applications
          </Link>         
          <Link to="/sponsor-dashboard/report" className="nav-link">
            Reports
          </Link>
          <Link to={RP.ViewSponsorProfile} className="nav-link">
            Profile
          </Link>
          </nav>
          {/* ✅ Logout Button */}
          <div style={{ marginTop: "auto", padding: "1rem" }}>
            <button onClick={handleLogout} className="logout-button">
              Logout
            </button>
          </div>

        

      </aside>


      {/* ⭐ MAIN CONTENT */}
      <div className="main-section">

        <main className="dashboard-main">
          <h2 className="section-title">Scholarships</h2>

          <div className="stats-grid">
            <div className="stat-card">
              <p>Sponsored Students</p>
              <p className="stat-value">5</p>
            </div>

            <div className="stat-card">
              <p>Total Funds</p>
              <p className="stat-value">$50,000</p>
            </div>
          </div>

          <h3 className="sub-title">Student Profiles</h3>

          <div className="students-list">
            {[
              {
                name: "Ananya S.",
                field: "Engineering",
                deadline: "May 1, 2024",
                background: "Women in STEM",
                avatar: student1,
              },
              {
                name: "Community Service Scholarship",
                field: "$1,500",
                deadline: "July 10, 2024",
                background: "Community Service",
                avatar: student2,
              },
              {
                name: "Future Leaders Scholarship",
                field: "$3,000",
                deadline: "Aug 20, 2024",
                background: "Leadership",
                avatar: student3,
              },
            ].map((s, i) => (
              <div key={i} className="student-card">
                <div className="student-info">
                  <img src={s.avatar} alt={s.name} className="student-avatar" />
                  <div>
                    <h4>{s.name}</h4>
                    <p>{s.field}</p>
                    <p className="muted">Deadline: {s.deadline}</p>
                    <p className="muted">Background: {s.background}</p>
                  </div>
                </div>
                <button className="msg-btn">Message</button>
              </div>
            ))}
          </div>

          <div className="applications">
            <div className="app-header">
              <h3 className="sub-title">Applications</h3>
              <button className="download-btn">Download Reports</button>
            </div>

            <div className="app-card">
              <div className="app-card-header">
                <p><strong>Vijay T.</strong> – Arts</p>
                <span className="status">In Review</span>
              </div>

              <div className="app-row">
                <span>Funds Disbursed</span>
                <div className="progress-bar">
                  <div className="progress" style={{ width: "60%" }}></div>
                </div>
              </div>

              <div className="app-row">
                <span>Customize Branding</span>
              </div>
            </div>
          </div>

        </main>

      </div>
    </div>
  );
}
