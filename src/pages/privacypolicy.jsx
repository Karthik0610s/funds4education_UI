import React from "react";
import "./styles.css";

const PrivacyPolicy = () => {
  return (
    <div className="privacy-policy-container">
      
      {/* Header */}
      <div className="privacy-policy-header">
        <h1>Privacy Policy - VidyaSetu</h1>
      </div>

      {/* Content */}
      <div className="privacy-policy-content">

        <h2 className="privacy-policy-platform-name">VidyaSetu</h2>

        <p className="privacy-policy-text">
          VidyaSetu (“We”, “Us”, “Our”) respects your privacy and is committed to
          protecting the personal information of all users (“You”, “User”)
          accessing or using the VidyaSetu website and mobile application
          (“Platform”). This Privacy Policy explains how we collect, use, store,
          and protect your information.
        </p>

        <h3 className="privacy-policy-section-title">1. Information We Collect</h3>

        <h4 className="privacy-policy-section-title">1.1 Personal Information</h4>
        <p className="privacy-policy-text">
          We may collect the following information during registration or use of the Platform:
        </p>

        <ul className="privacy-policy-list">
          <li>Name, age, gender</li>
          <li>Email address and mobile number</li>
          <li>Educational details and institution information</li>
          <li>Scholarship application details</li>
          <li>Login credentials (encrypted)</li>
          <li>KYC or identification details (if required)</li>
        </ul>

        <h4 className="privacy-policy-section-title">1.2 Financial Information</h4>

        <ul className="privacy-policy-list">
          <li>Bank details or payment-related information (only when required for scholarships)</li>
          <li>Such information is collected and processed securely in compliance with applicable laws</li>
        </ul>

        <h4 className="privacy-policy-section-title">1.3 Non-Personal Information</h4>

        <ul className="privacy-policy-list">
          <li>IP address</li>
          <li>Browser type and device information</li>
          <li>Pages visited, time spent on the Platform</li>
          <li>Cookies and session data</li>
        </ul>

        <h3 className="privacy-policy-section-title">2. How We Use Your Information</h3>

        <ul className="privacy-policy-list">
          <li>Create and manage user accounts</li>
          <li>Process scholarship applications</li>
          <li>Enable sponsors to review and approve/reject applications</li>
          <li>Provide access to e-learning content</li>
          <li>Improve platform performance and user experience</li>
          <li>Communicate updates, notifications, and support responses</li>
          <li>Comply with legal and regulatory requirements</li>
        </ul>

        <h3 className="privacy-policy-section-title">3. Sharing of Information</h3>

        <ul className="privacy-policy-list">
          <li>With Sponsors for scholarship evaluation</li>
          <li>With Institutions and Faculty for academic purposes</li>
          <li>With service providers for platform operation</li>
          <li>When required by law or government authorities</li>
        </ul>

        <h3 className="privacy-policy-section-title">4. Data Storage & Security</h3>

        <ul className="privacy-policy-list">
          <li>Data is stored on secure servers with reasonable safeguards</li>
          <li>We follow the Information Technology Act, 2000</li>
          <li>Access limited to authorized personnel only</li>
        </ul>

        <h3 className="privacy-policy-section-title">5. Cookies Policy</h3>

        <p className="privacy-policy-text">
          You may disable cookies through browser settings; however, some features
          may not function properly.
        </p>

        <h3 className="privacy-policy-section-title">6. User Rights</h3>

        <ul className="privacy-policy-list">
          <li>Access their personal data</li>
          <li>Update or correct inaccuracies</li>
          <li>Request account deactivation</li>
          <li>Withdraw consent</li>
        </ul>

        <h3 className="privacy-policy-section-title">13. Contact Us</h3>

        <p className="privacy-policy-text">
          <strong className="privacy-policy-label">Email:</strong>{" "}
          <a href="mailto:support@vidhyasetu.com" className="privacy-policy-link">
            support@vidhyasetu.com
          </a>
        </p>

        <p className="privacy-policy-text">
          <strong className="privacy-policy-label">Address:</strong><br/>
          India
        </p>
        <p className="privacy-policy-lastupdate">
          Last updated: 06 Jan 2026
        </p>

      </div>
    </div>
  );
};

export default PrivacyPolicy;

