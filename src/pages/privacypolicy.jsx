import React from "react";

const PrivacyPolicy = () => {
  return (
    <div
      style={{
        maxWidth: "900px",
        margin: "40px auto",
        padding: "20px",
        fontFamily: "Arial, Helvetica, sans-serif",
        lineHeight: "1.6",
        color: "#333",
        background: "#fff",
        borderRadius: "10px",
        boxShadow: "0 4px 10px rgba(0,0,0,0.08)",
        fontSize:"14px"
      }}
    >
      <h1 style={{ color: "#000", marginBottom: "16px" }}>
        Privacy Policy
      </h1>

      <p>
        Funds4Education ("we", "our", or "us") values your privacy.
        This Privacy Policy explains how we collect, use, and protect
        your information when you use our website and services.
      </p>

      <h2 style={{ color: "#000", marginTop: "24px" }}>
        Information We Collect
      </h2>
      <ul>
        <li>Basic profile information such as your name and email address</li>
        <li>Account-related information required for authentication</li>
      </ul>

      <h2 style={{ color: "#000", marginTop: "24px" }}>
        How We Use Your Information
      </h2>
      <ul>
        <li>To authenticate users using Google Sign-In and other providers</li>
        <li>To create and manage user accounts</li>
        <li>To provide access to platform features</li>
      </ul>

      <h2 style={{ color: "#000", marginTop: "24px" }}>
        Data Sharing
      </h2>
      <p>
        We do not sell, trade, or rent your personal information to third
        parties. Your data is used strictly for platform functionality.
      </p>

      <h2 style={{ color: "#000", marginTop: "24px" }}>
        Data Security
      </h2>
      <p>
        We implement appropriate technical and organizational measures
        to protect your personal data from unauthorized access.
      </p>

      <h2 style={{ color: "#000", marginTop: "24px" }}>
        User Rights
      </h2>
      <p>
        You may request access, correction, or deletion of your personal
        data at any time by contacting us.
      </p>

      <h2 style={{ color: "#000", marginTop: "24px" }}>
        Contact Us
      </h2>
      <p>If you have any questions regarding this Privacy Policy:</p>
      <p>
        📧{" "}
        <a
          href="mailto:support@funds4education.in"
          style={{ color: "#0a4d8c" }}
        >
          support@funds4education.in
        </a>
      </p>

      <p style={{ marginTop: "24px" }}>
        <strong>Last updated:</strong> 15 December 2025
      </p>
    </div>
  );
};

export default PrivacyPolicy;
