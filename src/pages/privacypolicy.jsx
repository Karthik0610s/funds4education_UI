import React from "react";
import "./styles.css";

const PrivacyPolicy = () => {
  return (
    <div className="privacy-policy-container">
      {/* Header */}
      <div className="privacy-policy-header">
        <h1>Privacy Policy</h1>
        <p className="terms-last-updated">Last updated on 06 Jan 2026</p>
      </div>

      {/* Content */}
      <div className="privacy-policy-content">
        <h2 className="privacy-policy-platform-name">VidyaSetu</h2>

        <p className="privacy-policy-text">
          VidyaSetu (“We”, “Us”, “Our”) respects your privacy and is committed to
          protecting the personal information of users (“You”, “User”) who
          access the VidyaSetu website or mobile application (“Platform”). This
          Privacy Policy explains how information is collected, used, and
          protected.
        </p>

        <h3 className="privacy-policy-section-title">
          1. Information We Collect
        </h3>

        <h4 className="privacy-policy-section-title">
          1.1 Personal Information
        </h4>
        <p className="privacy-policy-text">
          VidyaSetu is an information-only platform. We do not collect
          scholarship applications, financial details, or sensitive identity
          documents. Limited personal information may be collected only when
          users voluntarily create an account.
        </p>

        <ul className="privacy-policy-list">
          <li>Name (optional)</li>
          <li>Email address or mobile number (optional)</li>
          <li>User preferences for saved or viewed scholarships</li>
        </ul>

        <h4 className="privacy-policy-section-title">
          1.2 Information We Do NOT Collect
        </h4>
        <ul className="privacy-policy-list">
          <li>Scholarship application forms</li>
          <li>Bank account or payment details</li>
          <li>KYC, Aadhaar, PAN, or identity documents</li>
          <li>Income certificates or academic mark sheets</li>
        </ul>

        <h4 className="privacy-policy-section-title">
          1.3 Non-Personal Information
        </h4>
        <ul className="privacy-policy-list">
          <li>IP address</li>
          <li>Browser type and device information</li>
          <li>Pages viewed and time spent on the Platform</li>
          <li>Cookies and session data</li>
        </ul>

        <h3 className="privacy-policy-section-title">
          2. How We Use Your Information
        </h3>

        <ul className="privacy-policy-list">
          <li>To display scholarship and educational information</li>
          <li>To personalize user experience (if logged in)</li>
          <li>To improve platform performance and usability</li>
          <li>To respond to user queries or support requests</li>
          <li>To comply with applicable legal requirements</li>
        </ul>

        <h3 className="privacy-policy-section-title">
          3. Sharing of Information
        </h3>

        <p className="privacy-policy-text">
          VidyaSetu does not sell, rent, or share personal data with sponsors,
          institutions, or third parties for scholarship processing. Information
          may be shared only when required by law or government authorities.
        </p>

        <h3 className="privacy-policy-section-title">
          4. Data Storage & Security
        </h3>

        <ul className="privacy-policy-list">
          <li>Data is stored on secure servers</li>
          <li>Reasonable technical safeguards are applied</li>
          <li>Access is restricted to authorized personnel only</li>
          <li>Practices comply with the Information Technology Act, 2000</li>
        </ul>

        <h3 className="privacy-policy-section-title">
          5. Cookies Policy
        </h3>

        <p className="privacy-policy-text">
          Cookies are used to enhance user experience and analyze platform
          usage. Users may disable cookies through browser settings; however,
          some features may not function properly.
        </p>

        <h3 className="privacy-policy-section-title">
          6. User Rights
        </h3>

        <ul className="privacy-policy-list">
          <li>Access the personal information shared with us</li>
          <li>Request correction or deletion of data</li>
          <li>Request account deactivation</li>
          <li>Withdraw consent where applicable</li>
        </ul>

        <h3 className="privacy-policy-section-title">
          7. Third-Party Links
        </h3>

        <p className="privacy-policy-text">
          The Platform may contain links to external scholarship or government
          websites. VidyaSetu is not responsible for the privacy practices or
          content of such third-party websites.
        </p>

        <h3 className="privacy-policy-section-title">
          8. Changes to This Policy
        </h3>

        <p className="privacy-policy-text">
          VidyaSetu may update this Privacy Policy from time to time. Continued
          use of the Platform indicates acceptance of the updated policy.
        </p>

        <h3 className="privacy-policy-section-title">
          9. Contact Us
        </h3>

        <p className="privacy-policy-text">
          <strong className="privacy-policy-label">Email:</strong>{" "}
          <a
            href="mailto:info@lore-technology.com"
            className="privacy-policy-link"
          >
            info@lore-technology.com
          </a>
          <br />
          <strong className="privacy-policy-label">Address:</strong>{" "}
          <span className="privacy-policy-link">India</span>
        </p>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
