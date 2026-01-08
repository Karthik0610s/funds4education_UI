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
    <div className="signup-container">
      {!isEditing ? (
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
          <div className="profile-details">
            <div className="detail-row">
              <label>First Name:</label>
              <input type="text" value={profile.firstName || ""} readOnly />
            </div>
            <div className="detail-row">
              <label>Last Name:</label>
              <input type="text" value={profile.lastName || ""} readOnly />
            </div>
            <div className="detail-row">
              <label>Email:</label>
              <input type="text" value={profile.email || ""} readOnly />
            </div>
            <div className="detail-row">
              <label>Phone:</label>
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
              <label>Profile Photo:</label>
              <input type="text"   value={(profile.fileName || "").replace(/\|$/, "")} readOnly />
            </div>
          </div>

          {/* --- Account Info --- */}
          <h3 className="section-title">Account Info</h3>
          <div className="profile-details">
            <div className="detail-row">
              <label>User Name(Email):</label>
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
                    <label>Degree:</label>
                    <input type="text" value={edu.degree || ""} readOnly />
                  </div>
                  <div className="detail-row">
                    <label>College:</label>
                    <input type="text" value={edu.college || ""} readOnly />
                  </div>
                  <div className="detail-row">
                    <label>Year:</label>
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
