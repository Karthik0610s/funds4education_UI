import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import SponsorProfileForm from "./sponsorProfile.jsx";
import { fetchSponsorById } from "../../../app/redux/slices/SponsorSlice.js";
import "../../../pages/styles.css";
import { useNavigate } from "react-router-dom";

export default function ViewProfile() {
  const dispatch = useDispatch();
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();

  const handleBack = () => navigate(-1);

  useEffect(() => {
    const sponsorId = localStorage.getItem("userId"); // logged-in sponsor ID
    if (sponsorId) {
      dispatch(fetchSponsorById(sponsorId))
        .then((data) => {
          const sponsor = data.payload ? data.payload[0] : data; // adjust based on return
          setProfile({
            sponsorName: sponsor.organizationName || "",
            sponsorType: sponsor.organizationType || "",
            website: sponsor.website || "",
            email: sponsor.email || "",
            phone: sponsor.phone || "",
            contactPerson: sponsor.contactPerson || "",
            address: sponsor.address || "",
            budget: sponsor.budget || "",
            studentCriteria: sponsor.studentCriteria || "",
            studyLevels: sponsor.studyLevels || "",
          });
        })
        .catch((err) => console.error("❌ Error fetching sponsor:", err));
    }
  }, [dispatch]);

  if (!profile) return <p>Loading sponsor profile...</p>;

  return (
    <div className="signup-container">
      {!isEditing ? (
        <div className="signup-card">
          <div className="profile-header">
            <h2 className="headers">Sponsor Profile</h2>
            <div className="button-group">
              <button className="sign-action-btn" onClick={handleBack}>Back</button>
              <button className="sign-action-btn" onClick={() => setIsEditing(true)}>Edit</button>
            </div>
          </div>

          {/* Organization Info */}
          <h3 className="section-title">Organization Info</h3>
          <div className="profile-details">
            <div className="detail-row"><label>Organization Name:</label><input type="text" value={profile.sponsorName} readOnly /></div>
            <div className="detail-row"><label>Type:</label><input type="text" value={profile.sponsorType} readOnly /></div>
            <div className="detail-row"><label>Website:</label><input type="text" value={profile.website} readOnly /></div>
          </div>

          {/* Contact Info */}
          <h3 className="section-title">Contact Info</h3>
          <div className="profile-details">
            <div className="detail-row"><label>Email:</label><input type="text" value={profile.email} readOnly /></div>
            <div className="detail-row"><label>Phone:</label><input type="text" value={profile.phone} readOnly /></div>
          </div>

          {/* Extra Info */}
          <h3 className="section-title">Additional Info</h3>
          <div className="profile-details">
            <div className="detail-row"><label>Contact Person:</label><input type="text" value={profile.contactPerson} readOnly /></div>
            <div className="detail-row"><label>Address:</label><input type="text" value={profile.address} readOnly /></div>
            <div className="detail-row"><label>Budget:</label><input type="text" value={profile.budget} readOnly /></div>
            <div className="detail-row"><label>Student Criteria:</label><input type="text" value={profile.studentCriteria} readOnly /></div>
            <div className="detail-row"><label>Study Levels:</label><input type="text" value={profile.studyLevels} readOnly /></div>
          </div>
        </div>
      ) : (
        <SponsorProfileForm
          profile={profile}
          onCancel={() => setIsEditing(false)}
          onSave={(updatedProfile) => {
            setProfile(updatedProfile);
            setIsEditing(false);
          }}
        />
      )}
    </div>
  );
}
