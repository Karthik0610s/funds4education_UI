import React from "react";
import "../../pages/styles.css";
import user1 from "../../app/assests/user1.png";
import user2 from "../../app/assests/user2.png";
import user3 from "../../app/assests/user3.png";
import { MapPin } from "lucide-react";

import studentImg from "../../app/assests/aiimage.png";

export default function ScholarshipPage() {
  return (
    <div className="scholarship-page">

      {/* --- Hero Section --- */}
      <div className="hero">
        <div className="hero-left">
          <img src={studentImg} alt="Student illustration" />
        </div>
        <div className="hero-right">
          <h1>AI Scholarship Match</h1>
          <p>
            Based on your profile and <br />background, here are some <br />recommended
            scholarships for <br />you.
          </p>
          <button className="btn-primary">Update Profile</button>
        </div>
      </div>

      {/* --- Bottom Section --- */}
      <div className="content-section">

        {/* Left: Your Matches */}
        <div className="matches">
          <h2>Your Matches</h2>

 <div className="match-card">
  <img src={user1} alt="Scholar" />
  <div className="match-info">
    <div className="title-with-tooltip">
      <h3>STEM Scholars Program</h3>
      <div className="tooltip">
        <h3>STEM Scholars Program</h3>
        <div className="tooltip-header">
  <p className="amount">$5,000</p>
  <p className="why">
    <MapPin className="icon" />
    <a href="#">Why this match?</a>
  </p>
</div>


       <p>
  Based on your interest in STEM <br />
  and career goal to become an <br />
  engineer
</p>
        <div className="tooltip-arrow"></div>
      </div>
    </div>

    <p>$5,000</p>
    <p className="deadline">Deadline: June 15, 2024</p>
    <p>Award on your interest in STEM</p>
  </div>
  <button className="apply-btn">Apply</button>
</div>




          <div className="match-card">
            <img src={user2} alt="Scholar" />
            <div className="match-info">
              <h3>Academic Achievement</h3>
              <p>$3,000</p>
              <p className="deadline">Deadline: May 20, 2024</p>
              <p>Background: Community Service</p>
            </div>
            <button className="apply-btn">Apply</button>
          </div>

          <div className="match-card">
            <img src={user3} alt="Scholar" />
            <div className="match-info">
              <h3>Women in Technology</h3>
              <p>$4,000</p>
              <p className="deadline">Deadline: May 5, 2024</p>
              <p>Background: Women in Tech</p>
            </div>
            <button className="apply-btn">Apply</button>
          </div>
        </div>

        {/* Right: Summary & Applications */}
        <div className="summary-section">

          <div className="financial-summary">
            <h3>Financial Summary</h3>
            <p className="amount">$50,000</p>
            <div class="budget-bar">
  <div class="progress-bar"></div>
</div>

            <p>Budget Utilization</p>
          </div>

          <button className="download-btn">Download Reports</button>

          <div className="applications">
            <h3>Applications</h3>
            <div className="application-card">
              <p><strong>Vijay T.</strong></p>
              <p>Arts</p>
              <p className="status">In Review</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
