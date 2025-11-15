import React, { useState } from "react";
import "../../../pages/styles.css";
import { useNavigate } from "react-router-dom";
import { routePath as RP } from "../../../app/components/router/routepath";
import { useDispatch } from "react-redux";
import { updateSponsor } from "../../../app/redux/slices/SponsorSlice";
import Swal from "sweetalert2";

export default function SponsorProfileForm({ profile, onCancel, onSave }) {
  const [formData, setFormData] = useState(profile || {});
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // -------------------------------
  // REGEX RULES
  // -------------------------------
  const orgNameRegex = /^[A-Za-z ]+$/;
  const nameRegex = /^[A-Za-z ]+$/;
  const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.(com|org|edu)$/;
  const phoneRegex = /^[0-9]{10}$/;
  const urlRegex = /^(https?:\/\/)?([\w-]+\.)+[\w-]{2,}(\/\S*)?$/;
  const numberRegex = /^[0-9]+$/;

  // -------------------------------
  // AUTO-BLOCK HANDLERS
  // -------------------------------

  // Letters + spaces only
  const handleLetterInput = (key, value) => {
    const clean = value.replace(/[^A-Za-z ]/g, "");
    setFormData({ ...formData, [key]: clean });
  };

  // Digits only
  const handleNumberInput = (key, value) => {
    const clean = value.replace(/[^0-9]/g, "");
    setFormData({ ...formData, [key]: clean });
  };

  // Website (no spaces)
  const handleWebsiteInput = (value) => {
    const clean = value.replace(/\s/g, "");
    setFormData({ ...formData, website: clean });
  };

  // Email (lowercase + block spaces)
  const handleEmailInput = (value) => {
    const clean = value.replace(/\s/g, "").toLowerCase();
    setFormData({ ...formData, email: clean });
  };

  // Address (remove triple spaces)
  const handleAddressInput = (value) => {
    const clean = value.replace(/\s{2,}/g, " ");
    setFormData({ ...formData, address: clean });
  };

  // -------------------------------
  // VALIDATION
  // -------------------------------
  const validateForm = () => {
    const errs = {};

    if (!formData.sponsorName || !orgNameRegex.test(formData.sponsorName)) {
      errs.sponsorName = "Only letters (A–Z) and spaces allowed.";
    }

    if (!formData.sponsorType) {
      errs.sponsorType = "Organization type is required.";
    }

    if (formData.website && !urlRegex.test(formData.website)) {
      errs.website = "Enter a valid website URL.";
    }

    if (formData.contactPerson && !nameRegex.test(formData.contactPerson)) {
      errs.contactPerson = "Only letters and spaces allowed.";
    }

    if (!formData.email || !emailRegex.test(formData.email)) {
      errs.email = "Enter a valid email (.com, .org, .edu).";
    }

    if (!formData.phone || !phoneRegex.test(formData.phone)) {
      errs.phone = "Phone number must be exactly 10 digits.";
    }

    if (!formData.address || formData.address.length < 5) {
      errs.address = "Address must be at least 5 characters.";
    }

    if (!formData.budget || !numberRegex.test(formData.budget)) {
      errs.budget = "Budget must be a valid number.";
    }

    if (!formData.studyLevels) {
      errs.studyLevels = "Please select a study level.";
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // -------------------------------
  // SUBMIT
  // -------------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const sponsorId = localStorage.getItem("userId");

    const updateData = {
      id: sponsorId,
      organizationName: formData.sponsorName,
      organizationType: formData.sponsorType,
      website: formData.website,
      email: formData.email,
      phone: formData.phone,
      contactPerson: formData.contactPerson,
      address: formData.address,
      budget: formData.budget,
      studentCriteria: formData.studentCriteria,
      studyLevels: formData.studyLevels
    };

    try {
      await updateSponsor(updateData, dispatch);
      Swal.fire({ text: "Profile updated successfully!", icon: "success" });
      onSave(formData);
    } catch (err) {
      Swal.fire({ text: "Failed to update profile!", icon: "error" });
    }
  };

  return (
    <div className="signup-card">
      <h2 className="walletheader">Sponsor Profile</h2>

      <h3 className="section-title">Organization Info</h3>

      <div className="row">
        <div className="form-group">
          <label>Sponsor / Organization Name *</label>
          <input
            type="text"
            value={formData.sponsorName || ""}
            onChange={(e) => handleLetterInput("sponsorName", e.target.value)}
            className={errors.sponsorName ? "input-error" : ""}
          />
          {errors.sponsorName && <p className="error-text">{errors.sponsorName}</p>}
        </div>

        <div className="form-group">
          <label>Type *</label>
          <select
            value={formData.sponsorType || ""}
            onChange={(e) =>
              setFormData({ ...formData, sponsorType: e.target.value })
            }
            className={errors.sponsorType ? "input-error" : ""}
          >
            <option value="">Select</option>
            <option value="Nonprofit">Nonprofit</option>
            <option value="Company">Company</option>
            <option value="Government">Government</option>
            <option value="Individual">Individual</option>
          </select>
          {errors.sponsorType && <p className="error-text">{errors.sponsorType}</p>}
        </div>
      </div>

      <div className="row">
        <div className="form-group">
          <label>Website</label>
          <input
            type="text"
            value={formData.website || ""}
            onChange={(e) => handleWebsiteInput(e.target.value)}
            className={errors.website ? "input-error" : ""}
          />
          {errors.website && <p className="error-text">{errors.website}</p>}
        </div>

        <div className="form-group">
          <label>Contact Person</label>
          <input
            type="text"
            value={formData.contactPerson || ""}
            onChange={(e) => handleLetterInput("contactPerson", e.target.value)}
            className={errors.contactPerson ? "input-error" : ""}
          />
          {errors.contactPerson && (
            <p className="error-text">{errors.contactPerson}</p>
          )}
        </div>
      </div>

      <h3 className="section-title">Contact Info</h3>

      <div className="row">
        <div className="form-group">
          <label>Email *</label>
          <input
            type="email"
            value={formData.email || ""}
            onChange={(e) => handleEmailInput(e.target.value)}
            className={errors.email ? "input-error" : ""}
          />
          {errors.email && <p className="error-text">{errors.email}</p>}
        </div>

        <div className="form-group">
          <label>Phone *</label>
          <input
            type="text"
            maxLength={10}
            value={formData.phone || ""}
            onChange={(e) => handleNumberInput("phone", e.target.value)}
            className={errors.phone ? "input-error" : ""}
          />
          {errors.phone && <p className="error-text">{errors.phone}</p>}
        </div>
      </div>

      <div className="form-group">
        <label>Address *</label>
        <textarea
          rows="2"
          value={formData.address || ""}
          onChange={(e) => handleAddressInput(e.target.value)}
          className={errors.address ? "input-error" : ""}
        />
        {errors.address && <p className="error-text">{errors.address}</p>}
      </div>

      <h3 className="section-title">Scholarship Preferences</h3>

      <div className="row">
        <div className="form-group">
          <label>Budget *</label>
          <input
            type="text"
            value={formData.budget || ""}
            onChange={(e) => handleNumberInput("budget", e.target.value)}
            className={errors.budget ? "input-error" : ""}
          />
          {errors.budget && <p className="error-text">{errors.budget}</p>}
        </div>

        <div className="form-group">
          <label>Student Criteria</label>
          <input
            type="text"
            value={formData.studentCriteria || ""}
            onChange={(e) =>
              setFormData({ ...formData, studentCriteria: e.target.value })
            }
          />
        </div>
      </div>

      <div className="form-group">
        <label>Supported Study Levels *</label>
        <select
          value={formData.studyLevels || ""}
          onChange={(e) =>
            setFormData({ ...formData, studyLevels: e.target.value })
          }
          className={errors.studyLevels ? "input-error" : ""}
        >
          <option value="">Select</option>
          <option value="High School">High School</option>
          <option value="Undergraduate">Undergraduate</option>
          <option value="Graduate">Graduate</option>
          <option value="PhD">PhD</option>
        </select>
        {errors.studyLevels && <p className="error-text">{errors.studyLevels}</p>}
      </div>

      <div className="btn-row">
        <button className="sign-action-btn1" onClick={handleSubmit}>
          Update Profile
        </button>

        <button
          className="sign-action-btn1 danger"
          onClick={() => {
            onCancel();
            navigate(RP.ViewSponsorProfile);
          }}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
