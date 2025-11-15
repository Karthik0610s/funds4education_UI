import React from "react";
import { FaGraduationCap, FaBookOpen } from "react-icons/fa";
import Header from "../../app/components/header/header";
const MonetizationPage = () => {
  return (
    <>
    <Header variant="studentmonetization" />
    <div className="monetization-page">
      <h1>Monetization & Ads</h1>
      <p>Generate additional revenue by displaying <br />relevant ads and promotions.</p>

      <div className="cards">
        <div className="card">
          <span>4b</span>
          <FaGraduationCap className="icon" />
          <h3>Unlock Your Potential</h3>
          <p>Apply for top scholarships today!</p>
          <button>Apply</button>
        </div>

        <div className="card">
          <span>4b</span>
          <FaBookOpen className="icon" />
          <h3>Online Learning</h3>
          <p>Explore our courses and programs</p>
          <button>Learn More</button>
        </div>
      </div>

   <div className="earnings">
  <h2>Earnings</h2>
  <p>Current Balance</p>

  <div className="balance-row">
    <p className="balance">$2,150.00<button>View Reports</button></p>
    
  </div>
</div>


  <div className="footer-links-page">
  <a href="#">Contact</a>
  <a href="#">Privacy</a>
  <a href="#">Terms</a>
</div>

    </div>
    </>
  );
};

export default MonetizationPage;
