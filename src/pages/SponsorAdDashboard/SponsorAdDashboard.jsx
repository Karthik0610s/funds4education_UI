import React from "react";
import Header from "../../app/components/header/header";
import { FaGraduationCap } from "react-icons/fa"; // Graduation cap icon

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
  { date: "Jan", cpc: 2.1, cpa: 2.5 },
  { date: "Feb", cpc: 2.8, cpa: 3.2 },
  { date: "Mar", cpc: 2.2, cpa: 3.1 },
  { date: "Apr", cpc: 3.0, cpa: 3.5 },
  { date: "May", cpc: 2.6, cpa: 3.8 },
];

const SponsorAdDashboard = () => {
  return (
    <>
      <Header variant="sponsoraddashboard" />

      {/* Main Dashboard */}
      <main className="dashboard">
        {/* Title */}
        <h1 className="dashboard-title">Sponsor Dashboard</h1>
        <p className="subtitle">
          View key metrics and manage your <br />scholarship ad campaigns.
        </p>
        <button className="btn-small-new">
          + New Campaign
        </button>



        {/* Stats Section */}
        <section className="stats-cards">
          <div className="stats-card">
            <p>Total Spend</p>
            <h3>$2,500</h3>
          </div>
          <div className="stats-card">
            <p>Clicks</p>
            <h3>12,540</h3>
          </div>
          <div className="stats-card">
            <p>CTR</p>
            <h3>3.2%</h3>
          </div>
          <div className="stats-card">
            <p>Applications</p>
            <h3>384</h3>
          </div>
        </section>


        <div className="dashboard-sections">
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
                  <Line type="monotone" dataKey="cpc" stroke="#0a3c2f" strokeWidth={2} />
                  <Line type="monotone" dataKey="cpa" stroke="#43a047" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="stats">
              <div>
                <p>Current Balance</p>
                <h3>$2,150.00</h3>
              </div>
            </div>
          </section>

          {/* Top Campaigns Section */}
          <section className="campaigns">
            <h2>Top Campaigns</h2>
            <div className="campaign-card">
              <h3>STEM Scholarship</h3>
              <p>8,510 Clicks • 250 Applications</p>
            </div>
            <div className="campaign-card">
              <h3>Diversity in Arts</h3>
              <p>4,030 Clicks • 134 Applications</p>
            </div>
          </section>
        </div>

        {/* Footer */}
        <div
          style={{
            display: "flex",
            justifyContent: "flex-start",
            textAlign: "left",
            gap: "30px",
            fontSize: "1rem",
            color: "#7a8b7f",
            marginTop: "24px",
            width: "100%",
            maxWidth: "540px",
          }}
        >
          <a href="#" style={{ color: "#7a8b7f", textDecoration: "none" }}>
            Contact
          </a>
          <a href="#" style={{ color: "#7a8b7f", textDecoration: "none" }}>
            Privacy
          </a>
          <a href="#" style={{ color: "#7a8b7f", textDecoration: "none" }}>
            Terms
          </a>
        </div>
      </main>
    </>
  );
};

export default SponsorAdDashboard;
