import "../../../pages/styles.css";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchStudentProfile,
  updateStudent,
} from "../../../app/redux/slices/studentSlice.js";
import StudentProfileForm from "./studentprofile.jsx";
import { useNavigate } from "react-router-dom";
export default function StudentProfile() {
  const dispatch = useDispatch();
  const { profile, status, error } = useSelector((state) => state.student);
  const [isEditing, setIsEditing] = useState(false);
const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1); // 👈 goes back to the previous page
  };

  // ✅ Fetch logged-in student's profile on mount
  useEffect(() => {
    dispatch(fetchStudentProfile());
  }, [dispatch]);

  // ✅ Parse Education JSON safely
  let educationArray = [];
  try {
    if (profile && profile.education) {
      const parsed = JSON.parse(profile.education);
      educationArray = Array.isArray(parsed) ? parsed : [parsed];
    }
  } catch (err) {
    console.warn("⚠️ Invalid education JSON:", profile.education, err);
    educationArray = [];
  }

  // ✅ Format date of birth properly (local date)
  const formattedDOB = profile?.dateofBirth
    ? new Date(profile.dateofBirth).toLocaleDateString("en-CA")
    : "";

  // ✅ Loading & error states
  if (status === "loading")
    return <div className="signup-container">Loading profile...</div>;
  if (error)
    return (
      <div className="signup-container text-red-600">Error: {error}</div>
    );
  if (!profile) return null;

  return (
    <div >
      {!isEditing ? (
            <div className="profile-page-wrapper">
        <div className="signup-card">
          <div className="profile-header">
            <h2 className="headers">Student Profile</h2>
            <div className="button-group">
    <button className="sign-action-btn"onClick={handleBack}>Back</button>
    <button className="sign-action-btn" onClick={() => setIsEditing(true)}>
      Edit
    </button>
  </div>
          </div>

          {/* --- Basic Info --- */}
          <h3 className="section-title">Basic Details</h3>
          <div className="education-item">
            <div className="detail-row">
              <label>Candidate’s Full Name:</label>
              <input type="text" value={profile.firstName || ""} readOnly />
            </div>
            <div className="detail-row">
              <label>Candidate’s Initial:</label>
              <input type="text" value={profile.lastName || ""} readOnly />
            </div>
            <div className="detail-row">
              <label>Email ID:</label>
              <input type="text" value={profile.email || ""} readOnly />
            </div>
            <div className="detail-row">
              <label>Phone Number:</label>
              <input type="text" value={profile.phone || ""} readOnly />
            </div>
            <div className="detail-row">
              <label>Date of Birth:</label>
              <input type="text" value={formattedDOB} readOnly />
            </div>
            <div className="detail-row">
              <label>Gender:</label>
              <input type="text" value={profile.gender || ""} readOnly />
            </div>
            <div className="detail-row">
              <label>Father's Name:</label>
              <input type="text" value={profile.motherOccupation || ""} readOnly />
            </div>
             <div className="detail-row">
              <label>Occupation of Father:</label>
              <input type="text" value={profile.fatherOccupation || ""} readOnly />
            </div>
             
            <div className="detail-row">
              <label>Parent's Phone Number:</label>
              <input type="text" value={profile.parentsContactNumber || ""} readOnly />
            </div>
              <div className="detail-row">
              <label>Family Income per Annum:</label>
              <input type="text" value={profile.familyIncome || ""} readOnly />
            </div>
            <div className="detail-row">
              <label>State:</label>
              <input type="text" value={profile.state_Name || ""} readOnly />
            </div>
             <div className="detail-row">
              <label>Country:</label>
              <input type="text" value={profile.country_Name || ""} readOnly />
            </div>
            <div className="detail-row">
              <label>Address:</label>
              <input type="text" value={profile.address || ""} readOnly />
            </div>
            <div className="detail-row">
              <label>Profile Photo:</label>
              <input type="text"   value={(profile.fileName || "").replace(/\|$/, "")} readOnly />
            </div>
          </div>

          {/* --- Account Info --- */}
          <h3 className="section-title">Account Info</h3>
          <div className="education-item">
            <div className="detail-row">
              <label>Username (Email):</label>
              <input type="text" value={profile.userName || ""} readOnly />
            </div>
            <div className="detail-row">
              <label>Password:</label>
              <input
                type="password"
                value={profile.passwordHash ? "********" : ""}
                readOnly
              />
            </div>
          </div>

          {/* --- Education --- */}
          <h3 className="section-title">Education Details</h3>
          {educationArray.length > 0 ? (
            <div className="profile-details">
              {educationArray.map((edu, index) => (
                <div key={index} className="education-item">
                  <div className="detail-row">
                    <label>Class / Course:</label>
                    <input type="text" value={edu.degree || ""} readOnly />
                  </div>
                   <div className="detail-row">
                    <label>Discipline / Specialization:</label>
                    <input type="text" value={edu.specification || ""} readOnly />
                  </div>
                  <div className="detail-row">
                    <label>School / College / University Name:</label>
                    <input type="text" value={edu.college || ""} readOnly />
                  </div>
                  <div className="detail-row">
                    <label>Year of Study:</label>
                    <input type="text" value={edu.year || ""} readOnly />
                  </div>
                  {index < educationArray.length - 1 && (
                    <hr className="divider" />
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p>No education details available.</p>
          )}
        </div>
        </div>
      ) : (
        // ✅ Edit Form Mode
        <StudentProfileForm
          profile={profile}
          onCancel={() => setIsEditing(false)}
          onSave={() => {
            /*dispatch(updateStudent(updatedData)).then(() => {
              setIsEditing(false); // ✅ Return to view mode
            });*/
             setIsEditing(false);
          }}
        />
      )}
    </div>
  );
}
