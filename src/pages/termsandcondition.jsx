import React from "react";
import "./styles.css";

const TermsAndConditions = () => {
  const currentYear = new Date().getFullYear();

  return (
    <div className="terms-container">
      {/* Header */}
      <div className="terms-header">
        <h1>Terms & Conditions</h1>
        <p className="terms-last-updated">Last updated on 06 Jan 2026</p>
      </div>

      {/* Content */}
      <div className="terms-content">
        <h2 className="terms-company-name">VidyāSetu</h2>
 <p className="terms-text">
          By accessing or using the VidyāSetu website or mobile application (“Platform”), you agree to 
          comply with and be bound by these Terms & Conditions and our Privacy Policy. 
          If you do not agree, please do not use the Platform.
        </p>

        <h3 className="terms-section-title">1. About VidyāSetu</h3>
        <p className="terms-text">
         VidyāSetu is an online platform designed to help students discover, view, and apply for scholarship opportunities. 
         The Platform provides informational support and application access for educational scholarships.
        </p>

        <h3 className="terms-section-title">2. Eligibility</h3>
        <p className="terms-text">
          Users must be 18 years or older to register. Minors may use the
          Platform only through a parent or legal guardian. Users must be
          legally capable of entering contracts under the Indian Contract Act,
          1872.
        </p>

        <h3 className="terms-section-title">
          3. User Registration & Account Responsibility
        </h3>
        <p className="terms-text">
          Users must provide accurate information during registration and are
          responsible for maintaining the confidentiality of login credentials.
        </p>

        <h3 className="terms-section-title">4. Student Terms</h3>
        <ul className="terms-list">
          <li>All scholarship application details submitted must be true, accurate, and complete.</li>
          <li>Submission of an application does not guarantee scholarship selection or approval.</li>
          <li>Providing false, misleading, or fraudulent information may result in account suspension or permanent termination.</li>
        </ul>
        <h3 className="terms-section-title">5. Prohibited Activities</h3>
        <ul className="terms-list">
          <li>Uploading false or illegal content</li>
          <li>Unauthorized system access</li>
          <li>Misuse of user data</li>
          <li>Abusive or defamatory behavior</li>
          <li>Violation of these rules may result in immediate account suspension</li>
        </ul>
        

        <h3 className="terms-section-title">6. Intellectual Property</h3>
        <p className="terms-text">
          All Platform design, software, logos, and trademarks are the exclusive property of VidyāSetu.
          Users may not copy, modify, distribute, or misuse Platform content without prior written permission.
        </p>

        <h3 className="terms-section-title">7. Disclaimer</h3>
        <p className="terms-text">
          The Platform is provided on an “as is” and “as available” basis. VidyāSetu does not 
          guarantee uninterrupted access, error-free operation, or scholarship approval of any kind.
        </p>
        <h3 className="terms-section-title">8. Limitation of Liability</h3>
        <p className="terms-text">
          VidyāSetu shall not be liable for any direct or indirect loss, damages, or inconvenience 
          arising from the use of the Platform or reliance on scholarship information.
        </p>

        <h3 className="terms-section-title">9. Governing Law</h3>
        <p className="terms-text">
         These Terms & Conditions shall be governed by and interpreted in accordance with the laws of India,
          and the courts of India shall have exclusive jurisdiction.
        </p>

        <p className="terms-footer">
          © 2026 VidyāSetu. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default TermsAndConditions;
