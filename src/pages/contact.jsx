import React from "react";
import "./styles.css";

const ContactUs = () => {
  return (
    <div className="contact-container">
      {/* Header */}
      <div className="contact-header">
        <h1>Contact Us</h1>
      </div>

      {/* Content */}
      <div className="contact-content">
        <h2 className="contact-company-name">
          Lore Technology Solutions Pvt Ltd
        </h2>

        <h3 className="contact-section-title">Head Office</h3>

        <p className="contact-text">
          2/2, Maruthi Nagar 1st Cross,
          <br />
          Chinnatirupathi,
          <br />
          Salem – 636008,
          <br />
          Tamil Nadu, India
          <br />
          <strong className="contact-label">Phone:</strong> +91 73376 54242
          <br />
          <strong className="contact-label">Email:</strong>{" "}
          info@lore-technology.com
        </p>
      </div>
    </div>
  );
};

export default ContactUs;
