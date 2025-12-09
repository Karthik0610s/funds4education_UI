import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchApplicationsBySponsor } from "../../app/redux/slices/ScholarshipSlice";
import "../styles.css";
import SponsorLayout from "../../pages/SponsorDashboard/SponsorLayout";
import { logout } from "../../app/redux/slices/authSlice";
import { useNavigate, Link } from "react-router-dom";
import Header from "../../app/components/header/header";
export default function SponsoredScholarship() {
  const dispatch = useDispatch();
  const { data, loading, error } = useSelector((state) => state.scholarship);
  const applications = data.applications || [];
const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };
const name = localStorage.getItem("name") || "Student";
 const navigate = useNavigate();
  useEffect(() => {
    debugger;
    const sponsorId = localStorage.getItem("userId");
    dispatch(fetchApplicationsBySponsor(sponsorId, "Approved")); 
  }, [dispatch]);

  const approvedApplications = useMemo(() => {
    return applications.filter(
      (app) => (app.status || "").toLowerCase() === "approved"
    );
  }, [applications]);

  if (loading) return <p className="loading">Loading approved applications...</p>;
  if (error) return <p className="error">Error loading applications.</p>;

  return (
      <>
      <Header variant="sponsor-profile" />

    <div className="page-split">
    
     <div className="left-container">
    <SponsorLayout name={name} handleLogout={handleLogout} />
  </div>

  
      <div className="right-container">
     <div className="mobile-sponsor">
        <SponsorLayout name={name} handleLogout={handleLogout} />
      </div>
        <div className="container">

    {/* Desktop Title */}
  <h2 className="page-title desktop-title">Approved Student Applications</h2>

  {/* Mobile Title */}
  <h2 className="page-title mobile-title">Approved Applications</h2>

        {approvedApplications.length === 0 ? (
          <p className="empty">No approved applications found.</p>
        ) : (
          <div className="application-list">
            {approvedApplications.map((app) => (
              <div key={app.applicationId} className="application-card">
                <div className="application-info">
                  <h3 className="student-name">
                    {app.firstName} {app.lastName}
                  </h3>
                  <p>Course: {app.courseOrMajor || "No Course Info"}</p>
                  <p>School: {app.schoolName || "N/A"}</p>
                  <p>Application Date: {new Date(app.applicationDate).toLocaleDateString()}</p>
                  <span className="status approved">Approved</span>
                </div>
          
                
                
              </div>
            
            ))}
          </div>
        )}
      </div>
      </div>
    </div>
    </>
  );
}
