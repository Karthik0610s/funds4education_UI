import React from "react";

const ContactUs = () => {
  return (
    <div style={{ maxWidth: "800px", margin: "40px auto", padding: "30px", background: "#ffffff", borderRadius: "10px", boxShadow: "0 4px 10px rgba(0,0,0,0.08)", fontFamily: "Arial, sans-serif" }}>
      <h1 style={{ textAlign: "center", marginBottom: "30px", color: "#1f2937" }}>Contact Us</h1>

      <div style={{ marginBottom: "20px" }}>
        <strong style={{ display: "block", marginBottom: "6px", color: "#374151" }}>Address</strong>
        <span>
          2/2, Maruthi Nagar 1st Cross,<br />
          Chinnatirupathi,<br />
          Salem – 636008,<br />
          Tamil Nadu, India
        </span>
      </div>

      <div style={{ marginBottom: "20px" }}>
        <strong style={{ display: "block", marginBottom: "6px", color: "#374151" }}>Phone</strong>
        <a href="tel:+917337654242" style={{ color: "#111827", textDecoration: "none", fontSize: "16px" }}>+91 73376 54242</a>
      </div>

      <div>
        <strong style={{ display: "block", marginBottom: "6px", color: "#374151" }}>Email</strong>
        <a href="mailto:support@lore-technology.com" style={{ color: "#111827", textDecoration: "none", fontSize: "16px" }}>support@lore-technology.com</a>
      </div>
    </div>
  );
};

export default ContactUs;
