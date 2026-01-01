import { FiBell, FiUpload, FiDownload } from "react-icons/fi";
import { useEffect, useState, useMemo } from "react";
import "../../pages/styles.css";
import student1 from "../../app/assests/Img1.jpg";
import student2 from "../../app/assests/img2.jpg";
import student3 from "../../app/assests/img3.jpg";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import Swal from "sweetalert2";
import { logout } from "../../app/redux/slices/authSlice";
import { 
  fetchApplicationsBySponsor,
  updateApplicationStatus
} from "../../app/redux/slices/ScholarshipSlice";
import SponsorLayout from "../../pages/SponsorDashboard/SponsorLayout";
import { routePath as RP } from "../../app/components/router/routepath";
import Header from "../../app/components/header/header";
export default function SponsorDashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { data } = useSelector((state) => state.scholarship);
  const [filter, setFilter] = useState("All");
  const normalize = (s) => (s || "").toLowerCase();

  const applications = data.applications || [];


  const name =
    useSelector((state) => state.auth.name) || localStorage.getItem("name");

  const [drawerOpen, setDrawerOpen] = useState(false);
  const handleUpdateStatus = (id, newStatus) => {
  const modifiedBy = localStorage.getItem("name") || "SponsorUser";
  const sponsorId = localStorage.getItem("userId");

  const actionText =
    newStatus === "Approved"
      ? "approve"
      : newStatus === "Rejected"
      ? "reject"
      : newStatus === "Funded"
      ? "fund"
      : "update";

  Swal.fire({
    title: `Are you sure you want to ${actionText} this application?`,
    text:
      newStatus === "Approved"
        ? "Once approved, this student will be eligible for funding."
        : newStatus === "Rejected"
        ? "Once rejected, this student cannot reapply for this scholarship."
        : "Confirm your action.",
    icon:
      newStatus === "Approved"
        ? "success"
        : newStatus === "Rejected"
        ? "warning"
        : "info",
    showCancelButton: true,
    confirmButtonText: `Yes, ${actionText}`,
    cancelButtonText: "Cancel",
    confirmButtonColor:
      newStatus === "Approved"
        ? "#4CAF50"
        : newStatus === "Rejected"
        ? "#e74c3c"
        : "#3498db",
    cancelButtonColor: "#999",
  }).then(async (result) => {
    if (result.isConfirmed) {
      await dispatch(updateApplicationStatus(id, newStatus, modifiedBy ));

      setTimeout(() => {
        dispatch(fetchApplicationsBySponsor(sponsorId));
      }, 800);

      Swal.fire({
        icon: "success",
        title: "Updated!",
        text: `Application has been ${newStatus.toLowerCase()} successfully.`,
        timer: 1500,
        showConfirmButton: false,
      });
    }
  });
};


  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };
 const fundedApplications = useMemo(() => {
  return applications.filter(
    (app) => (app.status || "").toLowerCase() === "funded"
  );
}, [applications]);


  const filteredApplications = useMemo(() => {
    
    if (filter === "All") return applications;
    return applications.filter((app) => normalize(app.status) === normalize(filter));
  }, [applications, filter]);
  function extractNumber(str) {
    if (!str) return 0;

    // Match the largest number with commas or decimals
    const match = str.replace(/,/g, '').match(/\d+(\.\d+)?/);

    return match ? Number(match[0]) : 0;
  }
  const totalFund = fundedApplications.reduce(
  (sum, app) => sum + (Number(app.fundAmount) || 0),
  0
);

const formattedFund = totalFund.toLocaleString("en-IN", {
  style: "currency",
  currency: "INR"
});

  useEffect(() => {
    
    const sponsorId = localStorage.getItem("userId");
    dispatch(fetchApplicationsBySponsor(sponsorId));
  }, [dispatch]);

  const handleViewApplication = (id) => {
  navigate(`/student/scholarship-application/${id}/view`);
};



const [currentPage, setCurrentPage] = useState(1);
const pageSize = 5; // number of applications per page

const filteredApps = applications.filter(s =>
  ["approved", "submitted"].includes((s.status || "").toLowerCase())
);

const totalPages = Math.ceil(filteredApps.length / pageSize);
const handleFundPopup = (application) => {
  const { applicationId, firstName, lastName, scholarshipName, amount } = application;

  Swal.fire({
    title: "Fund Student",
    html: `
      <div style="text-align:left;">
        <p><strong>Student:</strong> ${firstName} ${lastName}</p>
        <p><strong>Scholarship:</strong> ${scholarshipName}</p>
        <p><strong>Scholarship Amount:</strong> ${formatAmount(amount)}</p>
        <br/>
        <label><strong>Enter Fund Amount:</strong></label>
        <input type="number" id="fundAmount" class="swal2-input" placeholder="Enter amount" min="1" />
      </div>
    `,
    focusConfirm: false,
    showCancelButton: true,
    confirmButtonText: "Submit Funding",
    cancelButtonText: "Cancel",
    preConfirm: () => {
      const fundAmount = document.getElementById("fundAmount").value;

      if (!fundAmount || Number(fundAmount) <= 0) {
        Swal.showValidationMessage("Please enter a valid fund amount.");
        return false;
      }

      return { fundAmount };
    }
  }).then(async (result) => {
    if (result.isConfirmed) {
      const sponsorName = localStorage.getItem("name") || "SponsorUser";

      await dispatch(
        updateApplicationStatus(applicationId, "Funded", sponsorName, result.value.fundAmount)
      );

      Swal.fire({
        icon: "success",
        title: "Student Funded!",
        text: `Fund Amount: ₹${result.value.fundAmount}`,
        timer: 1500,
        showConfirmButton: false
      });

      const sponsorId = localStorage.getItem("userId");
      setTimeout(() => dispatch(fetchApplicationsBySponsor(sponsorId)), 500);
    }
  });
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
        window.location.replace("https://funds4education.in");
      }
    };

    window.addEventListener("popstate", handleBack);
    return () => window.removeEventListener("popstate", handleBack);
  }, []);
const formatAmount = (val) => {
  
  if (!val) return "₹0";

  let amount = String(val).trim();

  // already contains any currency → return as is
 if (/(₹|rs\.?\b|inr\b|usd\b|\$|€|£)/i.test(amount)) {
    return amount;
  }

  // extract the number part only (before any text)
  const match = amount.match(/[\d,]+\/?-?/);
  if (match) {
    const numPart = match[0]; // like "20,000/-"
    const rest = amount.slice(numPart.length); // remaining text

    return `₹${numPart}${rest}`;
  }

  // fallback for unknown format
  return `₹${amount}`;
};
  return (
    <>
     <Header variant="sponsor-profile" />
    <div className="dashboard-container">
      <SponsorLayout name={name} handleLogout={handleLogout}></SponsorLayout>
      {/* ⭐ MOBILE BAR */}
    {/* <div className="sponsor-mobile-bar">
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


     
      {drawerOpen && (
        <div
          className="sponsor-drawer-overlay"
          onClick={() => setDrawerOpen(false)}
        ></div>
      )}

     
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
     {/* <aside className="sidebar">
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
       
        <div style={{ marginTop: "auto", padding: "1rem" }}>
          <button onClick={handleLogout} className="logout-button">
            Logout
          </button>
        </div>



      </aside>*/}


      {/* ⭐ MAIN CONTENT */}
      <div className="main-section">

        <main className="dashboard-main">
          <h2 className="section-title">Scholarships</h2>

          <div className="stats-grid">
            <div className="stat-card">
              <p>Sponsored Students</p>
              <p className="stat-value">{fundedApplications.length}</p>
            </div>

            <div className="stat-card">
              <p>Total Funds</p>
              <p className="stat-value"> {formattedFund}</p>
            </div>
          </div>


          {/* <div className="students-list">
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
          </div> */}
         {/* 
<h3 className="sub-title">Student Profiles</h3>

<div className="students-list">
  {approvedApplications.map((s, i) => (
    <div key={i} className="student-card">
      <div className="student-info">

        <img src={student1} alt={s.firstName} className="student-avatar" />

        <div className="student-details">
          <p className="student-name">
            <strong>{s.firstName} {s.lastName}</strong>
            <span className="sch-name"> - {s.scholarshipName}</span>
          </p>

          <div className="app-row">
            <div className="info-row">
              <span className="label">Amount</span>
              <span className="value">₹{s.amount}</span>
            </div>
          </div>

          <div className="info-row">
            <span className="label">Applied On</span>
            <span className="value">
              {new Date(s.applicationDate).toLocaleDateString()}
            </span>
          </div>

          <div className="status-action-row">
            <span className="status-badge">{s.status.toUpperCase()}</span>
            <button className="msg-btn">Message</button>
          </div>
        </div>

      </div>
    </div>
  ))}
</div>
*/}




          <div className="applications">
            <div className="app-header">
              <h3 className="sub-title">Applications</h3>
              {/* <button className="download-btn">Download Reports</button> */}
            </div>

            {/* <div className="app-card">
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
            </div> */}
<div className="app-card-container">

{applications.length === 0 ? (
    <div className="no-applications">
      No applications found
    </div>
  ) : ( applications
    .filter(s => ["approved", "submitted"].includes((s.status || "").toLowerCase()))
      .sort((a, b) => new Date(b.applicationDate) - new Date(a.applicationDate))
     .slice((currentPage - 1) * pageSize, currentPage * pageSize)
     
  .map((s, i) => {
      const progressMap = {
        APPROVED: 80,
        FUNDED: 100,
        REJECTED: 0,
        SUBMITTED: 40,
        "IN REVIEW": 60,
        PENDING: 40,
        DRAFT: 20
      };

      const progress = progressMap[s.status?.toUpperCase()] ?? 0;
      const statusNorm = (s.status || "").toLowerCase();

      return (
        <div key={i} className="app-card"
        
        onClick={() => handleViewApplication(s.applicationId)} style={{ cursor: "pointer" }}>
          <div className="app-card-header">
            <p>
              <strong>{s.firstName} {s.lastName}</strong> – {s.scholarshipName}
            </p>
            <span className={`status ${statusNorm}`}>
              <strong>{s.status.toUpperCase()}</strong>
            </span>
          </div>

          <div className="app-row">
            <span>Scholarship Amount</span>
            <strong>{formatAmount(s.amount)}</strong>
          </div>

          <div className="app-row">
            <span>Application Date</span>
            <span>{new Date(s.applicationDate).toLocaleDateString()}</span>
          </div>

          <div className="app-row">
            <span>Funds Disbursed</span>
            <div className="progress-bar">
              <div className="progress" style={{ width: `${progress}%` }}></div>
            </div>
          </div>
          

          <div className="application-actions">
            {statusNorm === "submitted" && (
              <>
                <button
  className="btn btn-approve"
  onClick={(e) => {
    e.stopPropagation();
    handleUpdateStatus(s.applicationId, "Approved");
  }}
>
  Approve
</button>

<button
  className="btn btn-reject"
  onClick={(e) => {
    e.stopPropagation();
    handleUpdateStatus(s.applicationId, "Rejected");
  }}
>
  Reject
</button>
              </>
            )}

            {statusNorm === "approved" && (
             <button
  className="btn btn-fund"
  onClick={(e) => {
    e.stopPropagation();
    handleFundPopup(s);
  }}
>
  Fund Student
</button>

            )}
          </div>
        </div>
      );
    }) )}
</div>

{filteredApps.length > 0 && totalPages > 1 && (
  <div className="pagination">
    <button
      disabled={currentPage === 1}
      onClick={() => setCurrentPage((prev) => prev - 1)}
    >
      Prev
    </button>

    <span>
      Page {currentPage} / {totalPages}
    </span>

    <button
      disabled={currentPage === totalPages}
      onClick={() => setCurrentPage((prev) => prev + 1)}
    >
      Next
    </button>
  </div>
)}






          </div>

        </main>

      </div>
    </div>
    </>
  );
}
