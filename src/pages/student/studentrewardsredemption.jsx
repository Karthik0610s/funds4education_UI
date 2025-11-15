import React from "react";
import walletimage from "../../app/assests/walletimage.png";
import card from "../../app/assests/card.jpg";
import { FaTrophy } from "react-icons/fa";
import Header from "../../app/components/header/header";
import amazon from "../../app/assests/amazon.png";
import "../../pages/styles.css";  // ✅ import CSS
import elearning from "../../app/assests/e-learing.jpg";
import closedBook from "../../app/assests/closedbook.jpg";
import { FaGraduationCap, FaChalkboardTeacher, FaBookOpen } from "react-icons/fa";

export default function StudentRewardsRedemption() {
  return (
    <>
      <Header variant="studentwalletredemption" />

      <div className="redemption-container">
        {/* Header */}
        <h1 className="redemption-header">Reward Redemption</h1>
        <p className="redemption-subtitle">
          Redeem your points for gift cards,scholarship <br /> boosts,learning
          resources,and more
        </p>

        <div className="wallet-container">
          <div>
            <img
              src={walletimage}
              alt="wallet"
              style={{ width: "230px", height: "auto" }}
            />
          </div>
          <div className="wallet-info">
            <p className="wallet-balance">Points Available</p>
            <p className="wallet-balance">3,200 pts</p>
            <button className="redeem-btn">Redeem</button>
          </div>
        </div>

        {/* Sections */}

        <div className="points-history">
          <h1 className="rewards-title">Points History</h1>

          <div className="reward-grid">
            <div className="reward-point-item">
              <div className="reward-point-top-row">
                <img src={amazon} alt="wallet" width="50" height="50" />
                <div className="text-info">
                  <p className="point-title">Amazon Gift Card</p>
                  <p className="point-subtitle">2,500 pts</p>
                   <button className="redeem-btn">Redeem</button>
                </div>
              </div>
             {/* <button className="redeem-btn">Redeem</button>*/}
            </div>

            <div className="reward-point-item">
              <div className="point-top-row">
                {/* Left Side: Text */}
                <div className="text-info">
                  <p className="point-title">Scholarship Boost</p>
                  <p className="point-subtitle">Featured listing for 7 days</p>
                  <p className="point-subtitle">3,000 pts</p>
                </div>

                {/* Right Side: Icon + Button */}
                <div className="icon-and-button">
                  <FaGraduationCap size={40} color="#0f3d32" />
                  <button className="redeem-btn">Redeem</button>
                </div>
              </div>
            </div>

            {/* ✅ 2. Extra Classes */}
            <div className="reward-point-item">
             
                <div className="reward-point-top-row">
                  <img
                    src={closedBook}
                    alt="wallet"
                    style={{ width: "50px", height: "50px" }}
                  />
                  <div className="text-info">
                    <p className="point-title">Extra Classes</p>
                    <p className="point-subtitle">Access additional lessons</p>
                    <p className="point-subtitle">1,500 pts</p>
                     <button className="redeem-btn">Redeem</button>
                    
                  </div>

                 
                </div>
              
            </div>

            {/* ✅ 3. E-Book Download */}
            <div className="reward-point-item">
              <div className="point-top-row">
                <div className="text-info">
                  <p className="point-title">E-Book Download</p>
                  <p className="point-subtitle">Explore our learning library</p>
                  <p className="point-subtitle">1,000 pts</p>
                </div>

                <div className="icon-and-button">
                  <img
                    src={elearning}
                    alt="wallet"
                    style={{ width: "50px", height: "50px" }}
                  />
                  <button className="redeem-btn">Redeem</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="redemptionfooter">
        <span>Contact</span>
        <span>Privacy</span>
        <span>Terms</span>
      </div>
    </>
  );
}
