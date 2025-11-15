import React from "react";
import studentWallet from "../../app/assests/wallet.jpg";
import card from "../../app/assests/card.jpg";
import { FaTrophy } from "react-icons/fa";
import Header from "../../app/components/header/header";
import "../../pages/styles.css";  // ✅ import CSS
import { useNavigate } from "react-router-dom";
import { routePath as RP } from "../../app/components/router/routepath";
export default function StudentWalletRedemption() {
   const navigate = useNavigate();
  
    const handleRedeem = () => {
      // You can also store the selected item in state or context
      navigate(RP.studentrewardsredemption);
    };
  return (
    <>
      <Header variant="studentwalletredemption" />

      <div className="redemption-container">
        {/* Header */}
        <h1 className="redemption-header">Student Wallet</h1>
        <p className="redemption-subtitle">
          Earn points and redeem them for <br /> rewards and benefits
        </p>

        {/* Wallet + Redeem Button */}
        <div className="redemption-wallet">
          <img src={studentWallet} alt="Student Wallet" style={{ width: "230px", height: "auto" }} />
          <button className="redeem-btn" onClick={() => handleRedeem()}>Redeem Points</button>
        </div>

        {/* Points Balance Card */}
        <div className="points-card">
          <div className="points-left">
            <FaTrophy size={40} color="#F6C23F" />
            <div>
              <p className="points-title">Points Balance</p>
              <p className="points-title">3,250</p>
            </div>
          </div>
          <h2 className="points-value">3,250</h2>
        </div>

        {/* Sections */}
        <div className="sections">
          {/* Recent Activity */}
          <div className="section">
            <h3>Recent Activity</h3>
            {[
              { date: "April 16, 2024", activity: "$10 Gift Card", points: "1,000 points", type: "card" },
              { date: "April 12, 2024", activity: "$10 Gift Card", points: "1,000 points" },
            ].map((item, index) => (
              <div key={index}>
                <p style={{ fontSize: "14px", margin: "0 0 4px 0" }}>{item.date}</p>
                <div className="card-item">
                  <div className="card-left">
                    {item.type === "card" && (
                      <img src={card} alt="Student Wallet" style={{ width: "50px", height: "50px" }} />
                    )}
                    <span style={{ fontWeight: "bold" }}>{item.activity}</span>
                  </div>
                  <span>{item.points}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Top Campaigns */}
          <div className="section">
            <h3>Top Campaigns</h3>
            {[
              { activity: "$10 Gift Card", date: "April 16, 2024", points: "1,000 points", type: "gift" },
              { activity: "STEM Quiz Completed", date: "April 12, 2024", points: "+500 points", type: "quiz" },
            ].map((item, index) => (
              <div key={index} className="card-item">
                <div className="card-left">
                  {item.type === "quiz" && <FaTrophy size={24} color="#F6C23F" />}
                  <div>
                    <p  style={{ fontWeight: "bold" }}>{item.activity}</p>
                    <small>{item.date}</small>
                  </div>
                </div>
                <span>{item.points}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="redemptionfooter">
          <span>Contact</span>
          <span>Privacy</span>
          <span>Terms</span>
        </div>
      </div>
    </>
  );
}
