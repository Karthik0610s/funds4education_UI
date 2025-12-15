import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Header from "../../../app/components/header/header";
import { fetchScholarshipApplicationById } from "../../../app/redux/slices/scholarshipApplicationSlice";
import SponsorLayout from "../../SponsorDashboard/SponsorLayout";
import { logout } from "../../../app/redux/slices/authSlice";
import "../../../pages/styles.css";
import { publicAxios } from "../../../api/config";
import { ApiKey } from "../../../api/endpoint";
const ViewApplication = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { selectedApplication, loading, error } = useSelector(
    (state) => state.scholarshipApplicationList
  );

  const [applicationData, setApplicationData] = useState(null);

  useEffect(() => {
    if (id) dispatch(fetchScholarshipApplicationById(id));
  }, [id, dispatch]);

  useEffect(() => {
    if (selectedApplication && selectedApplication.length > 0) {
      setApplicationData(selectedApplication[0]);
    }
  }, [selectedApplication]);

  const handleBack = () => navigate(-1);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const name = localStorage.getItem("name") || "Student";
  const downloadFiles = async () => {
  try {
    const res = await publicAxios.get(
      `${ApiKey.downloadscholarshipFiles}/${data.id}`,
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
  }
};


  const getAge = (dob) => {
    if (!dob) return "N/A";
    const birthDate = new Date(dob);
    const diff = Date.now() - birthDate.getTime();
    const ageDate = new Date(diff);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error loading data!</p>;
  if (!applicationData) return <p>No data found</p>;

  const data = applicationData;

  return (
    <div className="page-split">
      {/* Left Sidebar */}
      <div className="left-container">
        <SponsorLayout name={name} handleLogout={handleLogout} />
      </div>

      {/* Right Side */}
      <div className="right-container">
        <Header variant="sponsor-profile" />

        {/* Header with Back Button on Right */}
        <div className="view-app-header">
          <div className="view-app-header-title">
            <h1>Scholarship Application Preview</h1>
            <p>View all details of the scholarship application.</p>
          </div>
     {/*
          <button
            className="view-application-back-btn"
            onClick={handleBack}
          >
            ←  Back
          </button>
     */}
        </div>

        {/* Card Section */}
        <section className="view-app-cards">
          <div className="view-app-card">

            <h3>Personal Details</h3>
            <p><strong>Full Name:</strong> {data.firstName} {data.lastName}</p>
            <p><strong>Email:</strong> {data.email}</p>
            <p><strong>Phone:</strong> {data.phoneNumber}</p>
            <p><strong>Gender:</strong> {data.gender}</p>
            <p><strong>Age:</strong> {getAge(data.dateOfBirth)}</p>

            <h3>Scholarship Details</h3>
            <p><strong>Scholarship Name:</strong> {data.scholarshipName}</p>
            <p><strong>Category:</strong> {data.category}</p>
            <p><strong>Application Date:</strong> {new Date(data.applicationDate).toLocaleDateString()}</p>

            <h3>Education Details</h3>
            <p><strong>Study Level:</strong> {data.studyLevel}</p>
            <p><strong>School Name:</strong> {data.schoolName || "N/A"}</p>
            <p><strong>Course / Major:</strong> {data.courseOrMajor || "N/A"}</p>
            <p><strong>Year of Study:</strong> {data.yearOfStudy || "N/A"}</p>
            <p><strong>GPA / Marks:</strong> {data.gpaOrMarks || "N/A"}</p>

            <h3>Additional Information</h3>
            <p><strong>Extra Curricular Activities:</strong> {data.extraCurricularActivities || "N/A"}</p>
            <p><strong>Awards & Achievements:</strong> {data.awardsAchievements || "N/A"}</p>
            <p><strong>Notes / Comments:</strong> {data.notesComments || "N/A"}</p>

            <h3>Uploaded Documents</h3>

{data.files?.length > 0 ? (
  <div>
    <ul>
      {data.files.map((file, index) => (
        <li key={index}>{file}</li>
      ))}
    </ul>

    <button className="btn btn-primary mt-2" onClick={downloadFiles}>
      Download Documents
    </button>
  </div>
) : (
  <p>No files uploaded</p>
)}

          </div>
        </section>
      </div>
    </div>
  );
};

export default ViewApplication;
