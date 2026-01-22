import React from "react";
import "./styles.css";

const TermsAndUse = () => {
  return (
    <div className="terms-container">
      {/* Header */}
      <div className="terms-header">
        <h1>Terms of Use</h1>
        <p className="terms-last-updated">Last updated on 06 Jan 2026</p>
      </div>

      {/* Content */}
      <div className="terms-content">
        <h2 className="terms-company-name">VidyāSetu</h2>

        <p className="terms-text">
          By accessing or using the VidyāSetu website or mobile application
          (“Platform”), you agree to be bound by these Terms of Use, our Privacy
          Policy, and other applicable policies. If you do not agree, please do
          not use the Platform.
        </p>

        <h3 className="terms-section-title">1. Introduction</h3>
        <p className="terms-text">
          VidyāSetu is an educational information platform designed to help
          students and parents discover and view scholarship opportunities and
          academic resources. VidyāSetu does not accept applications, process
          documents, approve candidates, or distribute scholarship funds.
        </p>

        <h3 className="terms-section-title">2. Definitions</h3>
        <ul className="terms-list">
          <li>
            <strong>“VidyāSetu”, “We”, “Us”, “Our”</strong> refers to the owner and
            operator of the VidyāSetu platform.
          </li>
          <li>
            <strong>“User” / “You”</strong> refers to any individual accessing
            the platform, including students and parents.
          </li>
          <li>
            <strong>“Scholarship Information”</strong> refers to publicly
            available details such as eligibility, benefits, deadlines, and
            official links.
          </li>
          <li>
            <strong>“Content”</strong> refers to text, links, documents, and
            educational materials displayed on the Platform.
          </li>
        </ul>

        <h3 className="terms-section-title">3. Eligibility</h3>
        <p className="terms-text">
          VidyāSetu displays scholarship information available for students from
          Grade 1 onwards, including school-level, higher secondary, diploma,
          undergraduate, and postgraduate studies. Eligibility criteria,
          benefits, and application processes are determined solely by the
          respective scholarship providers. Students and parents must verify
          details on the official scholarship websites before applying.
        </p>

        <h3 className="terms-section-title">4. User Accounts</h3>
        <p className="terms-text">
          Account creation on VidyāSetu is optional and intended only for
          personalization and saved viewing preferences. Users are responsible
          for maintaining the confidentiality of their login credentials.
        </p>

        <h3 className="terms-section-title">5. Services Offered</h3>
        <ul className="terms-list">
          <li>Viewing scholarship details and announcements</li>
          <li>Accessing official scholarship websites and links</li>
          <li>Viewing academic and educational information</li>
          <li>General guidance for awareness purposes only</li>
        </ul>

        <h3 className="terms-section-title">6. No Application or Processing</h3>
        <p className="terms-text">
          VidyāSetu does not accept scholarship applications, verify documents,
          shortlist students,	approve applications, or distribute funds. All
          applications must be submitted directly on the official scholarship
          provider’s website.
        </p>

        <h3 className="terms-section-title">7. Accuracy of Information</h3>
        <p className="terms-text">
          While reasonable efforts are made to keep information updated,
          VidyāSetu does not guarantee the accuracy or completeness of
          scholarship details. Information may change without notice.
        </p>

        <h3 className="terms-section-title">8. Prohibited Activities</h3>
        <ul className="terms-list">
          <li>Misusing or copying platform content without permission</li>
          <li>Attempting unauthorized access to the platform</li>
          <li>Uploading false or misleading information</li>
        </ul>

        <h3 className="terms-section-title">9. Privacy & Data Protection</h3>
        <p className="terms-text">
          VidyāSetu respects user privacy. Any personal information collected is
          handled in accordance with applicable Indian data protection laws and
          our Privacy Policy.
        </p>

        <h3 className="terms-section-title">10. Intellectual Property</h3>
        <p className="terms-text">
          All platform design, branding, and original content belong to
          VidyāSetu. Scholarship names, logos, and trademarks belong to their
          respective owners.
        </p>

        <h3 className="terms-section-title">11. Third-Party Links</h3>
        <p className="terms-text">
          The Platform may contain links to third-party websites. VidyāSetu is
          not responsible for their content, services, or privacy practices.
        </p>

        <h3 className="terms-section-title">12. Disclaimer</h3>
        <p className="terms-text">
          VidyāSetu is an information-only platform. We do not guarantee
          scholarship approval, selection, or financial assistance.
        </p>

        <h3 className="terms-section-title">13. Limitation of Liability</h3>
        <p className="terms-text">
          VidyāSetu shall not be liable for any direct or indirect loss arising
          from reliance on scholarship information displayed on the Platform.
        </p>

        <h3 className="terms-section-title">14. Modification of Terms</h3>
        <p className="terms-text">
          VidyāSetu reserves the right to modify these Terms at any time.
          Continued use of the Platform constitutes acceptance of the updated
          Terms.
        </p>

        <h3 className="terms-section-title">15. Governing Law</h3>
        <p className="terms-text">
          These Terms shall be governed by and construed in accordance with the
          laws of India.
        </p>

        <h3 className="privacy-policy-section-title">
          16. Contact Information
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

export default TermsAndUse;
