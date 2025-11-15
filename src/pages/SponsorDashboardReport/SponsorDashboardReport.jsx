import React from "react";
import "./SponsorDashboardReport.css";
import Header from "../../app/components/header/header";
import { FaGraduationCap } from "react-icons/fa"; // graduation cap icon
import tickImage from "../../app/assests/tickImage.png";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { date: "Apr 1", value: 200 },
  { date: "Apr 7", value: 600 },
  { date: "Apr 13", value: 800 },
  { date: "Apr 19", value: 500 },
  { date: "Apr 25", value: 700 },
  { date: "Apr 30", value: 850 },
];

const SponsorDashboardReport = () => {
  return (
    <>
      <Header variant="sponsordashboardreport" />

      {/* Main Dashboard */}
      <main className="dashboard">
        <h1 className="dashboard-title">Sponsor Dashboard</h1>
        <p className="subtitle">
          Manage your advertising campaigns <br /> and track performance metrics.
        </p>

        {/* Status Section */}
        <section className="status-card">
          <div className="status-info">
            <div>
              <p className="status-label">Current Status</p>
              <p className="status-active">
                <img src={tickImage} alt="Status Active" className="status-dot" />
                Active
              </p>              <p className="status-message">
                Apply for top scholarships today!
              </p>
            </div>
          </div>
          <button className="btn btn-active">Manage</button>
        </section>

        {/* Ad Performance Section */}
        <section className="performance">
          <h2>Ad Performance</h2>
          <div className="graph-container">
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#0a3c2f"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="stats">
            <div>
              <p>Clicks</p>
              <h3>4,560</h3>
            </div>
            <div>
              <p>CTR</p>
              <h3>3.2%</h3>
            </div>
            <div>
              <p>Conversions</p>
              <h3>368</h3>
            </div>
          </div>
        </section>

        {/* Ad Preview Section */}
        <section className="ad-preview">
          <h2 className="ad-title">Ad Preview</h2>
          <div className="ad-row">
            <div className="preview-card">
              <div className="icon">
                <FaGraduationCap size={60} color="#0a3c2f" />
              </div>
              <div>
                <h3>Unlock Your Potential</h3>
                <p>Apply for top <br />scholarships today!</p>
              </div>
            </div>
            <button className="btn btn-report">View Reports</button>
          </div>
        </section>
        <div style={{
          display: "flex",
          justifyContent: "flex-start",
          textAlign: "left",
          gap: "30px",
          fontSize: "1rem",
          color: "#7a8b7f",
          marginTop: "24px",
          width: "100%",
          maxWidth: "540px"
        }}>
          <a href="#" style={{ color: "#7a8b7f", textDecoration: "none" }}>Contact</a>
          <a href="#" style={{ color: "#7a8b7f", textDecoration: "none" }}>Privacy</a>
          <a href="#" style={{ color: "#7a8b7f", textDecoration: "none" }}>Terms</a>
        </div>
      </main>


    </>
  );
};

export default SponsorDashboardReport;
