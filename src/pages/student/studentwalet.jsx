import React from "react";
import walletimage from "../../app/assests/walletimage.png"; 
import Header from "../../app/components/header/header";
import "../../pages/styles.css";
import { routePath as RP } from "../../app/components/router/routepath";
import { useNavigate } from "react-router-dom";
export default function StudentWallet() {
    const navigate = useNavigate();

  const handleRedeem = () => {
    // You can also store the selected item in state or context
    navigate(RP.studentwalletredemption);
  };
  return (
    <> 
      <Header variant="studentwallet" />

      <div className="container">
        <div className="walletheader">
          <h1 className="wallettitle">Student Wallet</h1>
          <p className="walletsubtitle">
            Earn points and redeem them for rewards, scholarships, and more
          </p>
        </div>

        <div className="wallet-container">
          <div>
            <img
              src={walletimage}
              alt="wallet"
              style={{ width: "230px", height: "auto" }}
            />
          </div>
          <div className="wallet-info">
            <p className="wallet-balance">Wallet Balance</p>
            <p className="wallet-balance">3,200 pts</p>
            <button className="redeem-btn"  onClick={() => handleRedeem()}>Redeem</button>
          </div>
        </div>

        <div className="points-history">
          <h1 className="title">Points History</h1>

          <div className="point-item">
            <div className="point-info">
              <p className="point-title">Scholarship Award</p>
              <p className="point-subtitle">Leaders of Tomorrow Scholarship</p>
              <p className="point-date">May 10, 2024</p>
            </div>
            <div className="point-value">+2,500</div>
          </div>

          <div className="point-item">
            <div className="point-info">
              <p className="point-title">Referral Bonus</p>
              <p className="point-subtitle">You referred Vansh K.</p>
              <p className="point-date">Apr 28, 2024</p>
            </div>
            <div className="point-value">+500</div>
          </div>

          <div className="point-item">
            <div className="point-info">
              <p className="point-title">Profile Completion</p>
              <p className="point-subtitle">Completed all profile sections</p>
              <p className="point-date"></p>
            </div>
            <div className="point-value">+200</div>
          </div>
        </div>
      </div>
    </>
  );
}
