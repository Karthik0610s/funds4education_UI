import React from "react";
import walletimage from "../../app/assests/walletimage.png";
import giftcard from "../../app/assests/giftcard.jpg";
import elearning from "../../app/assests/e-learing.jpg";
import laptoptropy from "../../app/assests/laptoptropy.jpg";

import Header from "../../app/components/header/header";
import "../../pages/styles.css"; // import your CSS

export default function StudentRewards() {
  return (
    <>
      <Header variant="studentrewards" />
      <div className="container">
        <div className="walletheader">
          <h1 className="wallettitle">Student Rewards</h1>
          <p className="walletsubtitle">
            Use your points to redeem rewards and boost your Opportunities
          </p>
        </div>

        <div className="rewards-wallet-container">
          <div className="wallet-info">
            <p className="wallet-balance">Wallet Balance</p>
            <p className="wallet-balance">3,200 pts</p>
            <button className="redeem-btn">View History</button>
          </div>
          <div className="wallet-info">
            <p className="wallet-balance">Wallet Balance</p>
            <p className="wallet-balance">3,200 pts</p>
            <button className="redeem-btn">Redeem</button>
          </div>
        </div>

        <div className="points-history">
          <h1 className="rewards-title">Points History</h1>

          <div className="reward-point-item">
            <div className="point-top-row">
              <div className="reward-point-info">
                <img src={giftcard} alt="wallet" width="50" height="50" />
                <div className="text-info">
                  <p className="point-title">Gift Card</p>
                  <p className="point-subtitle">Choose from popular retailers</p>
                  <p className="point-date">May 10, 2024</p>
                </div>
              </div>
              <div className="right-box">
                <p className="reward-point-value">+2,500</p>
              </div>
            </div>
          </div>

          <div className="reward-point-item">
            <div className="point-top-row">
              <div className="reward-point-info">
                <img src={laptoptropy} alt="wallet" width="50" height="50" />
                <div className="text-info">
                  <p className="point-title">Scholarship Boost</p>
                  <p className="point-subtitle">Get bonus points for applications</p>
                  <p className="point-date">Apr 28, 2024</p>
                </div>
              </div>
              <div className="right-box">
                <p className="reward-point-value">+500</p>
              </div>
            </div>
          </div>

          <div className="reward-point-item">
            <div className="point-top-row">
              <div className="reward-point-info">
                <img src={elearning} alt="wallet" width="50" height="50" />
                <div className="text-info">
                  <p className="point-title">Online Courses</p>
                  <p className="point-subtitle">Access exclusive learning content</p>
                  <p className="point-date">Apr 12, 2024</p>
                </div>
              </div>
              <div className="right-box">
                <p className="reward-point-value">+200</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
