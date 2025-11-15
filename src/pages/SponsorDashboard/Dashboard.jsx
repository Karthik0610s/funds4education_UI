import { FiBell, FiUpload, FiDownload } from "react-icons/fi";
import { useEffect } from "react";
import "../../pages/styles.css";
import logo from "../../app/assests/Logo.png"
import Header from "../../app/components/header/header";
import student1 from "../../app/assests/Img1.jpg";
import { useDispatch , useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import student2 from "../../app/assests/img2.jpg";
import student3 from "../../app/assests/img3.jpg";
import { logout } from "../../app/redux/slices/authSlice";
import { Link } from "react-router-dom";
import { routePath as RP } from "../../app/components/router/routepath";
export default function SponsorDashboard() {

 const dispatch = useDispatch();
  const navigate = useNavigate();

   const name =
      useSelector((state) => state.auth.name) || localStorage.getItem("name");
  const handleLogout = () => {
    dispatch(logout());
    
    navigate("/login");
  };
 useEffect(() => {
    // push a dummy state so browser Back triggers popstate reliably
    window.history.pushState(null, document.title, window.location.href);

    const handleBackButton = async (event) => {
      try {
        console.log("Back button detected — purging redux-persist and clearing storage");

        // 1) Purge persisted redux state (wait for it)
        if (window.persistor && typeof window.persistor.purge === "function") {
          await window.persistor.purge();
          console.log("persistor.purge() finished");
        } else {
          console.log("window.persistor not found");
        }

        // 2) Clear storages
        localStorage.clear();
        sessionStorage.clear();
        console.log("localStorage and sessionStorage cleared");

        // 3) Redirect without creating history entry
        // Use replace so the user can't go forward back into the protected area
        window.location.replace("http://localhost:3000/");
      } catch (err) {
        console.error("Error during back-handler:", err);
        // fallback redirect
        window.location.replace("http://localhost:3000/");
      }
    };

    window.addEventListener("popstate", handleBackButton);

    return () => {
      window.removeEventListener("popstate", handleBackButton);
    };
  }, []);
 // ✅ run only once

  return (
    <div className="dashboard-container">
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
      <div className="main-section">

        {/*<headerr className="header">
          <div className="header-left">
            <img src={logo} alt="logo" className="logo" />
            <span className="brand">VidyāSetu</span>
            
          </div>

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
        </header>*/}
        <main className="dashboard-main">
          <h2 className="section-title">Scholarships</h2>
          <div className="stats-grid">
            <div className="stat-card">
              <p>Sponsored Students</p>
              <p className="stat-value">5</p>
            </div>
            <div className="stat-card">
              <p>Regions Supported</p>
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
            ].map((student, i) => (
              <div key={i} className="student-card">
                <div className="student-info">
                  <img src={student.avatar} alt={student.name} className="student-avatar" />
                  <div>
                    <h4>{student.name}</h4>
                    <p>{student.field}</p>
                    <p className="muted">Deadline: {student.deadline}</p>
                    <p className="muted">Background: {student.background}</p>
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
                <p><strong>Vijay T.</strong> - Arts</p>
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
