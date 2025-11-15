import React from "react";
import walletimage from "../../app/assests/walletimage.png";
import graph from "../../app/assests/graph.jpg";
import elearning from "../../app/assests/e-learing.jpg";
import tropymoney from "../../app/assests/tropymoney.jpg";
import Header from "../../app/components/header/header";
import "../../pages/styles.css";

export default function StudentRedemptionCatalog() {
  return (
    <>
      <Header variant="studentredemptioncalog" />
      <div className="container">
        <div className="walletheader">
          <h1 className="wallettitle">Student Redemption Catalog</h1>
          <p className="walletsubtitle">
            Redeem your points to receive gift cards, enhance scholarships, and more
          </p>
        </div>

        <div className="wallet-container">
          <div>
            <img
              src={tropymoney}
              alt="wallet"
              style={{ width: "230px", height: "auto" }}
            />
          </div>
          <div className="wallet-info">
            <p className="wallet-balance">Wallet Balance</p>
            <p className="wallet-balance">3,200 pts</p>
            <button className="redeem-btn">Redeem</button>
          </div>
        </div>

        <div className="points-history">
          <h1 className="title">Points History</h1>

          {/* Item 1 */}
          <div className="reward-point-item">
            <div className="point-top-row">
              <div className="reward-point-info">
                <img
                  src={walletimage}
                  alt="wallet"
                  style={{ width: "50px", height: "50px" }}
                />
                <div className="text-info">
                  <p className="point-title">Gift Card</p>
                  <p className="point-subtitle">
                    Leaders of Tomorrow Scholarship
                  </p>
                  <p className="point-date">May 10, 2024</p>
                </div>
              </div>
              <div className="right-box">
                <p className="point-value">+2,500</p>
                <button className="redeem-btn">Redeem</button>
              </div>
            </div>
          </div>

          {/* Item 2 */}
          <div className="reward-point-item">
  <div className="point-top-row">
    {/* Left side */}
    <div className="reward-point-info">
      <img src={graph} alt="wallet" style={{ width: "50px", height: "50px" }} />
      <div className="text-info">
        <p className="point-title">Scholarship Boost</p>
        <p className="point-subtitle">You referred Vansh K.</p>
        <p className="point-date">Apr 28, 2024</p>
      </div>
    </div>

    {/* Right side */}
    <div className="right-box">
      <p className="point-value">+500</p>
      <button className="redeem-btn">Redeem</button>
    </div>
  </div>
</div>

          {/* Item 3 */}
          <div className="reward-point-item">
            <div className="point-top-row">
              <div className="reward-point-info">
                <img
                  src={elearning}
                  alt="wallet"
                  style={{ width: "50px", height: "50px" }}
                />
                <div className="text-info">
                  <p className="point-title">E-Learning Module</p>
                  <p className="point-subtitle">Completed all profile sections</p>
                  <p className="point-date">Apr 12, 2024</p>
                </div>
              </div>
              <div className="right-box">
                <p className="point-value">+200</p>
                <button className="redeem-btn">Redeem</button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}
