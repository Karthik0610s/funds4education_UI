import React from "react";
import "./styles.css";

const TermsAndUse = () => {
  const currentYear = new Date().getFullYear();
  const lastUpdated = new Date().toLocaleDateString();

  return (
    <div className="terms-container">
  {/* Header */}
  <div className="terms-header">
    <h1>Terms of Use</h1>
  </div>

  {/* Content */}
  <div className="terms-content">
    <h2 className="terms-company-name">VidyāSetu</h2>

    <p className="terms-text">
      <strong>Last updated:</strong> {lastUpdated}
    </p>

    <p className="terms-text">
      By accessing or using the VidyāSetu website or mobile application
      (“Platform”), you agree to be bound by these Terms of Use, our Privacy
      Policy, and other applicable policies. If you do not agree, please do not
      use the Platform.
    </p>

    <h3 className="terms-section-title">1. Introduction</h3>
    <p className="terms-text">
      VidyāSetu is an online education and scholarship facilitation platform
      designed to connect students, sponsors, institutions, and faculty through
      digital services including scholarship applications, dashboards, and
      e-learning content.
    </p>

    <h3 className="terms-section-title">2. Definitions</h3>
    <ul className="terms-list">
      <li>
        <strong>“VidyāSetu”, “We”, “Us”, “Our”</strong> refers to the owner and
        operator of the VidyāSetu platform.
      </li>
      <li>
        <strong>“User” / “You”</strong> refers to any individual or entity using
        the platform, including Students, Sponsors, Faculty, and Institutions.
      </li>
      <li>
        <strong>“Student”</strong> refers to users applying for scholarships or
        accessing learning content.
      </li>
      <li>
        <strong>“Sponsor”</strong> refers to individuals or organizations funding
        scholarships.
      </li>
      <li>
        <strong>“Faculty”</strong> refers to educators uploading academic or
        learning content.
      </li>
      <li>
        <strong>“Content”</strong> refers to videos, text, documents, and other
        materials available on the Platform.
      </li>
    </ul>

    <h3 className="terms-section-title">3. Eligibility</h3>
    <p className="terms-text">
      Users must be 18 years or older to register. Minors may use the Platform
      only through a parent or legal guardian. Users must be legally capable of
      entering into binding contracts under the Indian Contract Act, 1872.
    </p>

    <h3 className="terms-section-title">4. User Accounts & Registration</h3>
    <ul className="terms-list">
      <li>Users must provide true, accurate, and complete information</li>
      <li>Users are responsible for safeguarding login credentials</li>
      <li>
        VidyāSetu may suspend or terminate accounts for misuse or false
        information
      </li>
    </ul>

    <h3 className="terms-section-title">5. Services Offered</h3>

    <h4 className="terms-sub-title">5.1 Student Services</h4>
    <ul className="terms-list">
      <li>Scholarship application submission</li>
      <li>Tracking application status</li>
      <li>Access to approved e-learning content</li>
      <li>Viewing institution and faculty listings</li>
    </ul>

    <h4 className="terms-sub-title">5.2 Sponsor Services</h4>
    <ul className="terms-list">
      <li>Review student scholarship applications</li>
      <li>Approve or reject applications</li>
      <li>View student academic details (as permitted)</li>
    </ul>

    <h4 className="terms-sub-title">5.3 Faculty & Institution Services</h4>
    <ul className="terms-list">
      <li>Upload and manage e-learning video content</li>
      <li>Share academic materials</li>
      <li>Manage institutional profiles</li>
    </ul>

    <h3 className="terms-section-title">6. Content Upload & Usage</h3>
    <p className="terms-text">
      Faculty and Institutions must ensure that uploaded content is original,
      legally authorized, educational, and free from copyright infringement.
      VidyāSetu reserves the right to review or remove content that violates
      these Terms.
    </p>

    <h3 className="terms-section-title">7. Prohibited Activities</h3>
    <ul className="terms-list">
      <li>Uploading false, misleading, or illegal information</li>
      <li>Impersonating another user or entity</li>
      <li>Uploading malicious software</li>
      <li>Posting abusive, defamatory, or obscene content</li>
      <li>Attempting unauthorized system access</li>
      <li>Misusing personal or student data</li>
    </ul>

    <h3 className="terms-section-title">8. Privacy & Data Protection</h3>
    <p className="terms-text">
      User data is handled in accordance with VidyāSetu’s Privacy Policy and is
      protected under the Information Technology Act, 2000. Data is shared only
      on a need-to-know basis.
    </p>

    <h3 className="terms-section-title">9. Cookies & Tracking</h3>
    <p className="terms-text">
      VidyāSetu may use cookies to improve user experience, track sessions, and
      analyze platform performance. Users may disable cookies in browser
      settings.
    </p>

    <h3 className="terms-section-title">10. Intellectual Property Rights</h3>
    <p className="terms-text">
      All platform content, designs, logos, and software belong to VidyāSetu.
      Uploaded content remains the property of the uploader, while granting
      VidyāSetu the right to host and display it.
    </p>

    <h3 className="terms-section-title">11. Third-Party Links</h3>
    <p className="terms-text">
      The Platform may contain links to third-party websites. VidyāSetu is not
      responsible for their content, services, or privacy practices.
    </p>

    <h3 className="terms-section-title">12. Disclaimer of Warranties</h3>
    <p className="terms-text">
      The Platform and services are provided on an “as is” and “as available”
      basis. VidyāSetu does not guarantee uninterrupted access, content accuracy,
      or scholarship approval.
    </p>

    <h3 className="terms-section-title">13. Limitation of Liability</h3>
    <p className="terms-text">
      VidyāSetu shall not be liable for any indirect, incidental, or
      consequential damages arising from use of the Platform.
    </p>

    <h3 className="terms-section-title">14. Indemnity</h3>
    <p className="terms-text">
      You agree to indemnify VidyāSetu against any claims arising from violation
      of these Terms, misuse of the Platform, or infringement of third-party
      rights.
    </p>

    <h3 className="terms-section-title">15. Modification of Terms</h3>
    <p className="terms-text">
      VidyāSetu reserves the right to modify these Terms at any time. Continued
      use of the Platform constitutes acceptance of updated Terms.
    </p>

    <h3 className="terms-section-title">16. Governing Law & Jurisdiction</h3>
    <p className="terms-text">
      These Terms are governed by the laws of India, and courts in India shall
      have exclusive jurisdiction.
    </p>

    <h3 className="terms-section-title">17. Contact Information</h3>
    <p className="terms-text">
      For queries or support, contact:
      <br />
      📧 info@lore-technology.com
    </p>

    <p className="terms-footer">
      © 2026 VidyāSetu. All rights reserved.
    </p>
  </div>
</div>

  );
};

export default TermsAndUse;