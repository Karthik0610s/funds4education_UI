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
import Swal from "sweetalert2";
import { updateApplicationStatus, fetchApplicationsBySponsor } from "../../../app/redux/slices/ScholarshipSlice";


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

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  }; const handleFundPopup = (application) => {
    const { applicationId, firstName, lastName, scholarshipName, amount } = application;

    Swal.fire({
      title: "Fund Student",
      html: `
        <div style="text-align:left;">
          <p><strong>Student:</strong> ${firstName} ${lastName}</p>
          <p><strong>Scholarship:</strong> ${scholarshipName}</p>
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

  const name = localStorage.getItem("name") || "Student";

  // Move data definition here to avoid undefined in downloadFiles
  const data = applicationData;



  const downloadFiles = async () => {
    try {
      debugger;
      const res = await publicAxios.get(
        `${ApiKey.downloadscholarshipFiles}/${data.id}/${"ScholarshipApplication"}`,
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

  return (
    <div className="va-page-split">
      {/* Left Sidebar */}
      <div className="va-left-container">
        <SponsorLayout name={name} handleLogout={handleLogout} />
      </div>

      {/* Right Side */}
      <div className="va-right-container">
        <Header variant="sponsor-profile" />

        <div className="va-header">
          <h1>Scholarship Application Preview</h1>
          <p>View all details of the scholarship application.</p>
        </div>

        {/* Back button example */}
        {/* <button className="va-btn-back" onClick={() => navigate(-1)}>← Back</button> */}

        {/* Personal Details Container */}

        <h2 className="personal-header">Personal Details</h2>
        <div className="va-section-content">
          <p><strong>Full Name:</strong> {data.firstName} {data.lastName}</p>
          <p><strong>Email:</strong> {data.email}</p>
          <p><strong>Phone:</strong> {data.phoneNumber}</p>
          <p><strong>Gender:</strong> {data.gender}</p>
          <p><strong>Age:</strong> {getAge(data.dateOfBirth)}</p>
        </div>


        {/* Scholarship Details Container */}
        <h2 class="personal-header">Scholarship Details</h2>

        <div className="va-section-content">
          <p>
            <strong>Scholarship Name:</strong> <span>{data.scholarshipName}</span>
          </p>
          <p><strong>Category:</strong> {data.category}</p>
          <p><strong>Application Date:</strong> {new Date(data.applicationDate).toLocaleDateString()}</p>
        </div>


        {/* Education Details Container */}
        <h2 class="personal-header">Education Details</h2>

        <div className="va-section-content">
          <p><strong>Study Level:</strong> {data.studyLevel}</p>
          <p>
            <strong>School / College Name:</strong> <span>{data.schoolName || "N/A"}</span>
          </p>
          <p>
            <strong>Class / Course / Major:</strong> <span>{data.courseOrMajor || "N/A"}</span>
          </p>

          <p><strong>Year of Study:</strong> {data.yearOfStudy || "N/A"}</p>
          <p><strong>Marks / GPA:</strong> {data.gpaOrMarks || "N/A"}</p>

        </div>

        {/* Additional Information Container */}
        <h2 class="personal-header">Additional Information</h2>

        <div className="va-section-content">
          <p>
            <strong>Extra Curricular Activities:</strong> <span>{data.extraCurricularActivities || "N/A"}</span>
          </p>
          <p>
            <strong>Awards & Achievements:</strong> <span>{data.awardsAchievements || "N/A"}</span>
          </p>
          <p>
            <strong>Notes / Comments:</strong> <span>{data.notesComments || "N/A"}</span>
          </p>

        </div>


        {/* Uploaded Documents Container */}
        <h2 class="personal-header">Uploaded Documents</h2>

        <div className="va-section-content">
          {data.files?.length > 0 ? (
            <>
              <ul>
                {data.files.map((file, index) => (
                  <li key={index}>{file}</li>
                ))}
              </ul>
              <button className="va-btn-download" onClick={downloadFiles}>
                Download Documents
              </button>
            </>
          ) : (
            <p>No files uploaded</p>
          )}
        </div>
        {/*
        {data.status?.toLowerCase() === "approved" && (
          <div className="fund-btn-wrapper">
            <button
              className="btn btn-fund"
              onClick={() => handleFundPopup(data)}
            >
              Fund Student
            </button>
          </div>

        )}
        {data.status?.toLowerCase() === "funded" && (
          <p style={{ color: "green", fontWeight: "bold" }}>
            ✅ This student has already been funded
          </p>
        )}
        */}

      </div>
    </div>

  );
};

export default ViewApplication;
