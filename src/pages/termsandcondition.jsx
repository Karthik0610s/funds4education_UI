import React from "react";
const styles = {
  sectionTitle: {
    marginTop: "24px",
    marginBottom: "8px",
    color: "#1f2937",
  },
  paragraph: {
    marginBottom: "16px",
    lineHeight: "1.6",
    color: "#374151",
  },
  list: {
    marginBottom: "16px",
    paddingLeft: "20px",
    lineHeight: "1.6",
    color: "#374151",
  },
};

const TermsAndConditions = () => {
  const currentYear = new Date().getFullYear();
  const lastUpdated = new Date().toLocaleDateString();

  return (
  <div
    style={{
      maxWidth: "900px",
      margin: "40px auto",
      padding: "20px",
      background: "#fff",
      borderRadius: "10px",
      boxShadow: "0 4px 10px rgba(0,0,0,0.08)",
      fontFamily: "Arial, sans-serif",
      marginBottom: "5px",
    }}
  >
    <h1
      style={{
        textAlign: "center",
        marginBottom: "30px",
        color: "#1f2937",
      }}
    >
      VidyāSetu – Terms and Conditions
    </h1>

    <p style={styles.paragraph}>
      <strong>Last updated:</strong> {lastUpdated}
    </p>

    <p style={styles.paragraph}>
      Welcome to VidyāSetu. By accessing or using our website, mobile
      application, or services (collectively, the “Platform”), you agree to
      comply with and be bound by these Terms and Conditions (“Terms”).
    </p>

    <h3 style={styles.sectionTitle}>1. About VidyāSetu</h3>
    <p style={styles.paragraph}>
      VidyāSetu is an educational platform that provides information, tools,
      and services related to scholarships, applications, learning resources,
      and student support.
    </p>

    <h3 style={styles.sectionTitle}>2. Eligibility</h3>
    <p style={styles.paragraph}>
      You must be at least 18 years old to use the Platform, or use it under
      the supervision of a parent/guardian. You agree to provide accurate and
      complete information during registration and usage.
    </p>

    <h3 style={styles.sectionTitle}>3. User Accounts</h3>
    <p style={styles.paragraph}>
      You are responsible for maintaining the confidentiality of your account
      credentials. Any activity carried out using your account will be deemed
      as your responsibility. VidyāSetu reserves the right to suspend or
      terminate accounts that violate these Terms.
    </p>

    <h3 style={styles.sectionTitle}>4. Use of the Platform</h3>
    <ul style={styles.list}>
      <li>Not to misuse the Platform or access it for unlawful purposes.</li>
      <li>Not to upload false, misleading, or harmful content.</li>
      <li>
        Not to attempt to disrupt or compromise the security or functionality
        of the Platform.
      </li>
    </ul>

    <h3 style={styles.sectionTitle}>
      5. Scholarship & Information Disclaimer
    </h3>
    <p style={styles.paragraph}>
      VidyāSetu acts as an information facilitator only. We do not guarantee
      scholarship approval, funding, or selection. Scholarship details may
      change at any time; users are advised to verify information from official
      sources.
    </p>

    <h3 style={styles.sectionTitle}>6. Intellectual Property</h3>
    <p style={styles.paragraph}>
      All content on VidyāSetu, including text, graphics, logos, and software,
      is the property of VidyāSetu or its licensors.
    </p>

    <h3 style={styles.sectionTitle}>7. Payments (If Applicable)</h3>
    <p style={styles.paragraph}>
      Certain services may be paid. All payments are non-refundable unless
      explicitly stated.
    </p>

    <h3 style={styles.sectionTitle}>8. Third-Party Services & Ads</h3>
    <p style={styles.paragraph}>
      The Platform may display third-party links or advertisements (including
      Google Ads). VidyāSetu is not responsible for third-party content,
      policies, or practices.
    </p>

    <h3 style={styles.sectionTitle}>9. Limitation of Liability</h3>
    <p style={styles.paragraph}>
      To the maximum extent permitted by law, VidyāSetu shall not be liable
      for any indirect, incidental, or consequential damages.
    </p>

    <h3 style={styles.sectionTitle}>10. Privacy</h3>
    <p style={styles.paragraph}>
      Your use of the Platform is also governed by our Privacy Policy.
    </p>

    <h3 style={styles.sectionTitle}>11. Termination</h3>
    <p style={styles.paragraph}>
      We may suspend or terminate access to the Platform at any time without
      prior notice if these Terms are violated.
    </p>

    <h3 style={styles.sectionTitle}>12. Changes to Terms</h3>
    <p style={styles.paragraph}>
      VidyāSetu reserves the right to update these Terms at any time.
    </p>

    <h3 style={styles.sectionTitle}>13. Governing Law</h3>
    <p style={styles.paragraph}>
      These Terms shall be governed by and construed in accordance with the
      laws of India.
    </p>

    <p style={{ textAlign: "center", marginTop: "40px" }}>
      © {currentYear} VidyāSetu. All rights reserved.
    </p>
  </div>
);

};

export default TermsAndConditions;
