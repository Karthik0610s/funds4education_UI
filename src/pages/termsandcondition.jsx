import React from "react";
import "./styles.css";

const TermsAndConditions = () => {
  const currentYear = new Date().getFullYear();

  return (
    <div className="terms-container">
      {/* Header */}
      <div className="terms-header">
        <h1>Terms & Conditions</h1>
        <p className="terms-last-updated">Last updated on 06 January 2026</p>
      </div>

      {/* Content */}
      <div className="terms-content">
        <h2 className="terms-company-name">VidyāSetu</h2>
 <p className="terms-text">
          By accessing, registering, or using the VidyāSetu website or mobile
          application (“Platform”), you agree to comply with and be bound by
          these Terms and Conditions, along with our Privacy Policy and other
          applicable policies.
        </p>

        <h3 className="terms-section-title">1. About VidyāSetu</h3>
        <p className="terms-text">
          VidyāSetu is an online platform that enables students to apply for
          scholarships and access e-learning content, sponsors to review and
          fund scholarships, and institutions and faculty to upload educational
          content.
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
          <li>All application details must be true and accurate</li>
          <li>Submission does not guarantee scholarship approval</li>
          <li>False information may lead to account suspension</li>
        </ul>

        <h3 className="terms-section-title">5. Sponsor Terms</h3>
        <p className="terms-text">
          Sponsors approve or reject applications at their discretion.
          VidyāSetu acts only as a facilitation platform and is not responsible
          for funding disputes.
        </p>

        <h3 className="terms-section-title">
          6. Faculty & Institution Terms
        </h3>
        <p className="terms-text">
          Faculty and institutions must upload only original or authorized
          educational content and grant VidyāSetu the right to host and display
          such content.
        </p>

        <h3 className="terms-section-title">7. Prohibited Activities</h3>
        <ul className="terms-list">
          <li>Uploading false or illegal content</li>
          <li>Unauthorized system access</li>
          <li>Misuse of user data</li>
          <li>Abusive or defamatory behavior</li>
        </ul>

        <h3 className="terms-section-title">8. Intellectual Property</h3>
        <p className="terms-text">
          All platform design, logos, and software belong to VidyāSetu. Uploaded
          content remains owned by the uploader.
        </p>

        <h3 className="terms-section-title">9. Disclaimer</h3>
        <p className="terms-text">
          Services are provided on an “as is” basis without guarantees of
          uninterrupted access or scholarship approval.
        </p>

        <h3 className="terms-section-title">10. Governing Law</h3>
        <p className="terms-text">
          These Terms are governed by the laws of India, and courts in India
          shall have exclusive jurisdiction.
        </p>

        <p className="terms-footer">
          © 2026 VidyāSetu. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default TermsAndConditions;
