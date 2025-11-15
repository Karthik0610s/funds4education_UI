import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { fetchScholarshipById } from "../../app/redux/slices/ScholarshipSlice";

const ScholarshipViewPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const [searchParams] = useSearchParams();

    // ✅ Get ID from location.state (preferred) OR from ?id query (fallback)
    const id = location.state?.id || searchParams.get("id");

    const isLoggedIn = useSelector((state) => state.auth.token);
    const { selectedScholarship: scholarship, loading } = useSelector(
        (state) => state.scholarship
    );


   const handleApplyNowClick = () => {
    if (isLoggedIn) {
        if (scholarship.webportaltoApply) {
            const url = scholarship.webportaltoApply.startsWith("http")
                ? scholarship.webportaltoApply
                : `https://${scholarship.webportaltoApply}`;
            window.open(url, "_blank"); // opens in new browser tab
        } else {
            alert("Application link not available.");
        }
    } else {
        navigate("/login");
    }
};
    useEffect(() => {
        if (id) {
            dispatch(fetchScholarshipById(id));
        }
    }, [dispatch, id]);

    if (loading) return <p>Loading scholarship details...</p>;
    if (!scholarship) return <p>No scholarship found.</p>;

    return (
        <div className="scholarshipview-page">
            {/* 🔙 Back Button */}
            <button className="scholarship-back-button" onClick={() => navigate(-1)}>
   Back
</button>

            {/* 🎓 Title & About Section */}
            <div className="page-content">
               <h2
                    className="scholarship-view-title"
                   
                    >
                    {scholarship.scholarshipName}
                </h2>

                <h3 className="scholarship-subtitle">
                    About The <span className="highlight-word">Program</span>
                </h3>
<div className="about-card">
  <p className="scholarship-view-text schololarship-viwe-pad">
    {scholarship.description}
  </p>
</div>            </div>

            {/* Eligibility Section */}
            <div className="scholarship-eligibility-header">
                <h3>Eligibility</h3>
                <div className="deadline-info">
                    <span className="deadline-label">Deadline Date:</span>
                    <span className="deadline-date">
                        📅{" "}
                        {new Date(scholarship.endDate).toLocaleDateString("en-GB", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                        }).replace(/ /g, "-")}
                    </span>
                </div>
            </div>

            <div className="scholarship-detail-container">
                {(scholarship.eligibility || scholarship.eligibilityCriteria) && (
                    <div className="scholarship-view-text">
                        <ul>
                            {scholarship.eligibility &&
                                scholarship.eligibility
                                    .split(/\r?\n/)
                                    .filter(Boolean)
                                    .map((line, idx) => <li key={`elig-${idx}`}>{line.trim()}</li>)}

                            {scholarship.eligibilityCriteria &&
                                scholarship.eligibilityCriteria
                                    .split(/\. |\r?\n/)
                                    .filter(Boolean)
                                    .map((line, idx) => <li key={`criteria-${idx}`}>{line.trim()}</li>)}
                        </ul>
                    </div>
                )}
            </div>

            {/* Benefits Section */}
            <div className="scholarship-eligibility-header">
                <h3>Benefits</h3>
            </div>

            <div className="scholarship-detail-container">
                <p className="scholarship-view-text">{scholarship.benefits}</p>
            </div>

            {/* Documents Section */}
            <div className="scholarship-eligibility-header">
                <h3>Documents</h3>
            </div>

            <div className="scholarship-detail-container">
                {scholarship.documents && scholarship.documents.trim().length > 0 ? (
                    <ul className="scholarship-view-text">
                        {scholarship.documents
                              .split(/\. |\r?\n/)
                            .map((line) => line.trim())
                            .filter((line) => line.length > 0)
                            .map((line, index) => (
                                <li key={index}>{line}</li>
                            ))}
                    </ul>
                ) : (
                    <p>No documents available.</p>
                )}
            </div>

            {/* Web Portal Section (How can you Apply?) */}
            {scholarship.webportaltoApply && (
                <>
                    <div className="scholarship-eligibility-header">
                        <h3>How can you Apply?</h3>
                    </div>
                    <div className="scholarship-detail-container">
                        <ul className="scholarship-view-text">
                            {scholarship.webportaltoApply
                                .split(/\r?\n|\. /)
                                .map((line) => line.trim())
                                .filter(
                                    (line) =>
                                        line.length > 0 && !line.toLowerCase().startsWith("note")
                                )
                                .map((line, idx) => (
                                    <li key={idx}>{line}</li>
                                ))}
                        </ul>

                        {/* 🟠 Apply Now Button */}
                        <div style={{ textAlign: "center", marginTop: "20px" }}>
                            <button
                                style={{
                                    background:
                                        "linear-gradient(to right, rgb(14, 42, 206), rgb(59, 183, 191))",
                                    color: "#fff",
                                    border: "none",
                                    borderRadius: "6px",
                                    padding: "10px 30px",
                                    fontWeight: "600",
                                    fontSize: "16px",
                                    cursor: "pointer",
                                    transition: "0.3s",
                                }}
                                onClick={handleApplyNowClick}
                                onMouseOver={(e) => (e.target.style.opacity = "0.9")}
                                onMouseOut={(e) => (e.target.style.opacity = "1")}
                            >
                                Apply Now
                            </button>
                        </div>
                    </div>
                </>
            )}

            {/* Contact Details Section */}
            {scholarship.contactDetails && (
                <>
                    <div className="scholarship-eligibility-header">
                        <h3>Contact Details</h3>
                    </div>
                    <div className="scholarship-detail-container">
                        <p
                            className="scholarship-view-text"
                            style={{ whiteSpace: "pre-line" }}
                        >
                            {scholarship.contactDetails}
                        </p>
                    </div>
                </>
            )}

            {/* 📅 Important Dates Section */}
            <div className="scholarship-eligibility-header">
                <h3>Important Dates</h3>
            </div>

            <div className="scholarship-detail-container">
                <p className="scholarship-view-text">
                    <strong>Application Deadline:</strong>{" "}
                    {scholarship.endDate
                        ? new Date(scholarship.endDate).toLocaleDateString("en-IN", {
                            day: "2-digit",
                            month: "long",
                            year: "numeric",
                        })
                        : "Not specified"}
                </p>
            </div>

            
        </div>
    );
};

export default ScholarshipViewPage;
