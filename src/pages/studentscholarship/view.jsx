import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { fetchScholarshipById } from "../../app/redux/slices/ScholarshipSlice";
import { publicAxios } from "../../api/config";
import { ApiKey } from "../../api/endpoint";
import "../../pages/styles.css";
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
const [downloading, setDownloading] = useState(false);

const downloadFileFun = async (id) => {
  try {
    setDownloading(true);
    const res = await publicAxios.get(
      `${ApiKey.downloadsponsorscholarshipFiles}/${id}`,
      { responseType: "blob" }
    );

    const url = window.URL.createObjectURL(
      new Blob([res.data], { type: "application/zip" })
    );

    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "documents.zip");
    document.body.appendChild(link);
    link.click();
    link.remove();
  } catch (err) {
    console.error("File download failed:", err);
  } finally {
    setDownloading(false);
  }
};



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
        navigate("/login", { state: { userType: "student" } });

    }
};
    useEffect(() => {
        if (id) {
            dispatch(fetchScholarshipById(id));
        }
    }, [dispatch, id]);

  const fileList =
    scholarship?.fileName?.trim()
      ? scholarship.fileName
          .split("|")
          .map(f => f.trim())
          .filter(Boolean)
      : [];

  // ✅ Early returns AFTER hooks
  if (loading) return <p>Loading scholarship details...</p>;
  if (!scholarship) return <p>No scholarship found.</p>;
  return (
  <div className="scholarshipview-page">
    {/* 🔙 Back Button */}
    <button className="scholarship-back-button" onClick={() => navigate(-1)}>
      ← Back
    </button>

    {/* WRAPPER so everything aligns properly */}
    <div className="scholarship-container">
      <div className="page-content">
        {/* 🎓 Title */}
        <h2 className="scholarship-view-title">{scholarship.scholarshipName}</h2>

        {/* About Program */}
        <h3 className="scholarship-subtitle">
          About The <span className="highlight-word">Program</span>
        </h3>

        <div className="about-card">
          <p className="scholarship-view-text schololarship-viwe-pad">
            {scholarship.description}
          </p>
        </div>

        {/* Eligibility Section */}
        <div className="scholarship-eligibility-header">
          <h3>Eligibility</h3>
          <div className="deadline-info">
            <span className="deadline-label">Deadline Date:</span>
            <span className="deadline-date">
              📅{" "}
              {scholarship.endDate
              ? new Date(scholarship.endDate).toLocaleDateString("en-IN", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                })
              : "Always Open"}
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

        {/* Benefits */}
        <div className="scholarship-eligibility-header">
          <h3>Benefits</h3>
        </div>
        <div className="scholarship-detail-container">
          <p className="scholarship-view-text">{scholarship.benefits}</p>
        </div>

        {/* Documents */}
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
            <p className="scholarship-view-text">No documents available.</p>
          )}
        </div>

        {/* Apply Section */}
        {scholarship.webportaltoApply && (
          <>
            <div className="scholarship-eligibility-header">
              <h3>How can you Apply?</h3>
            </div>

            <div className="scholarship-detail-container">
              <ul className="scholarship-view-text">
                {scholarship.webportaltoApply
  .split(/\r?\n|\. /)
  .map((line) => {
    const domainMatch = line.match(/^(.*?\.com)/i); // capture up to .com
    return domainMatch ? domainMatch[1] : line;
  })
  .map((line) => line.trim())
  .filter(
    (line) => line.length > 0 && !line.toLowerCase().startsWith("note")
  )
  .map((line, idx) => (
    <li key={idx} className="mobile-only">{line}</li>
  ))}

              </ul>

              <div style={{ textAlign: "center", marginTop: "20px" }}>
                <button
                  style={{
                    background: "linear-gradient(to right, #0E2ACE, #3BB7BF)",
                    color: "#fff",
                    border: "none",
                    borderRadius: "6px",
                    padding: "10px 30px",
                    fontWeight: "600",
                    fontSize: "16px",
                    cursor: "pointer",
                  }}
                  onClick={handleApplyNowClick}
                >
                  Apply Now
                </button>
              </div>
            </div>
          </>
        )}

        {/* Contact Details */}
        {scholarship.contactDetails && (
          <>
            <div className="scholarship-eligibility-header">
              <h3>Contact Details</h3>
            </div>
            <div className="scholarship-detail-container">
              <p className="scholarship-view-text" style={{ whiteSpace: "pre-line" }}>
                {scholarship.contactDetails}
              </p>
            </div>
          </>
        )}

        {/* Important Dates */}
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
 <div className="scholarship-eligibility-header">
          <h3>Criteria</h3>
        </div>
        <div className="scholarship-detail-container">
  <p className="scholarship-view-text">
    <strong>Renewable:</strong>{" "}
    {scholarship.isRenewable ? "Yes" : "No"}
  </p>

  {scholarship.isRenewable && (
    <p className="scholarship-view-text">
      <strong>Renewal Criteria:</strong>{" "}
      {scholarship.renewalCriteria || "Not specified"}
    </p>
  )}
</div>   
{/* Documents Section */}
<div className="scholarship-eligibility-header">
  <h3>Documents</h3>
</div>

<div className="scholarship-detail-container">
  {fileList.length > 0 ? (
    <>
      <ul className="scholarship-view-text">
        {fileList.map((file, index) => (
          <li key={index}>{file}</li>
        ))}
      </ul>

      <div style={{ textAlign: "center", marginTop: "20px" }}>
        <button
          type="button"
          disabled={downloading}
          onClick={() => downloadFileFun(scholarship.id)}
          style={{
            background: "linear-gradient(to right, #0E2ACE, #3BB7BF)",
            color: "#fff",
            border: "none",
            borderRadius: "6px",
            padding: "10px 30px",
            fontWeight: "600",
            fontSize: "16px",
            cursor: downloading ? "not-allowed" : "pointer",
          }}
        >
          {downloading ? "Downloading..." : "⬇️ Download Documents"}
        </button>
      </div>
    </>
  ) : (
    <p className="scholarship-view-text">No documents available.</p>
  )}
</div>




      </div>
    </div>
  </div>
);

};

export default ScholarshipViewPage;
