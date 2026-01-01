import "../../../pages/styles.css";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchFacultyUserProfile,
  updateFacultyUserProfile,
} from "../../../app/redux/slices/facultySlice.js";
import FacultyProfileForm from "./facultyProfile.jsx";
import { useNavigate } from "react-router-dom";
export default function FacultyProfile() {
  const dispatch = useDispatch();
  const { profile, status, error } = useSelector((state) => state.faculty);
  console.log("profile",profile);
  const [isEditing, setIsEditing] = useState(false);
  const id =localStorage.getItem("userId");
const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1); // 👈 goes back to the previous page
  };

  // ✅ Fetch logged-in student's profile on mount
  useEffect(() => {
    dispatch(fetchFacultyUserProfile(id));
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
  let workArray = [];

try {
  if (profile && profile.work) {
    const parsed = JSON.parse(profile.work);
    workArray = Array.isArray(parsed) ? parsed : [parsed];
  }
} catch (err) {
  console.warn("⚠️ Invalid work JSON:", profile.work, err);
  workArray = [];
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
            <h2 className="headers">Faculty Profile</h2>
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
              <label>User Name:</label>
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
          <h3 className="section-title">Qualification</h3>
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


           <h3 className="section-title">Work Details</h3>
          {workArray.length > 0 ? (
            <div className="profile-details">
              {workArray.map((edu, index) => (
                <div key={index} className="education-item">
                  <div className="detail-row">
                    <label>Organization:</label>
                    <input type="text" value={edu.organization || ""} readOnly />
                  </div>
                  <div className="detail-row">
                    <label>StartDate:</label>
                    <input type="text" value={edu.startDate || ""} readOnly />
                  </div>
                  {!edu.currentlyWorking && (
  <div className="detail-row">
    <label>End Date:</label>
    <input type="text" value={edu.endDate || ""} readOnly />
  </div>
)}
                  <div className="detail-row">
                    <label>Role:</label>
                    <input type="text" value={edu.role || ""} readOnly />
                  </div>
                  <div className="detail-row">
                    <label>Currently Working:</label>
                    <input type="text" value={edu.currentlyWorking ? "Yes" : "No"} readOnly />
                  </div>
                  {index < workArray.length - 1 && (
                    <hr className="divider" />
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p>No work details available.</p>
          )}
        </div>
      ) : (
        // ✅ Edit Form Mode
        <FacultyProfileForm
          profile={profile}
          onCancel={() => setIsEditing(false)}
          onSave={() => {
         /*   dispatch(updateFacultyUserProfile(updatedData)).then(() => {
              setIsEditing(false); // ✅ Return to view mode
            });*/
            setIsEditing(false);
          }}
        />
      )}
    </div>
  );
}
