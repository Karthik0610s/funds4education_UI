import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { updateStudent } from "../../../app/redux/slices/studentSlice"; // SweetAlert handled inside slice
import "../../../pages/styles.css";

export default function StudentProfileForm({ profile, onCancel, onSave }) {
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    id: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    dateofBirth: "",
    gender: "",
    userName: "",
  });

  const [educationList, setEducationList] = useState([]);
  const [education, setEducation] = useState({ degree: "", college: "", year: "" });
  const [editIndex, setEditIndex] = useState(null);
  const [errors, setErrors] = useState({});

  // ✅ Load profile data
  useEffect(() => {
    if (profile) {
      setFormData({
        id: profile.id,
        firstName: profile.firstName || "",
        lastName: profile.lastName || "",
        email: profile.email || "",
        phone: profile.phone || "",
        dateofBirth: profile.dateofBirth
          ? new Date(profile.dateofBirth).toLocaleDateString("en-CA")
          : "",
        gender: profile.gender || "",
        userName: profile.userName || "",
      });

      try {
        if (profile.education) {
          const parsed = JSON.parse(profile.education);
          setEducationList(Array.isArray(parsed) ? parsed : [parsed]);
        }
      } catch {
        console.warn("⚠️ Invalid education JSON:", profile.education);
      }
    }
  }, [profile]);

  // ✅ Format date for backend
  const formatDateForBackend = (dateStr) => {
    if (!dateStr) return null;
    const date = new Date(dateStr);
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${month}/${day}/${year} 00:00:00`;
  };

  // ✅ Validation (same as in UserForm)
  const validateForm = () => {
    const errs = {};
    const nameRegex = /^[A-Za-z .-]+$/;
    const emailRegex = /^[a-z0-9._%+-]+@gmail\.(com|in)$/;
    const phoneRegex = /^[1-9][0-9]{9}$/;

    if (!formData.firstName.trim()) {
      errs.firstName = "First name is required.";
    } else if (!nameRegex.test(formData.firstName)) {
      errs.firstName = "Only letters, spaces, dots, and hyphens allowed.";
    }

    if (!formData.lastName.trim()) {
      errs.lastName = "Last name is required.";
    } else if (!nameRegex.test(formData.lastName)) {
      errs.lastName = "Only letters, spaces, dots, and hyphens allowed.";
    }

    if (!formData.email.trim()) {
      errs.email = "Email is required.";
    } else if (!emailRegex.test(formData.email)) {
      errs.email = "Enter a valid Gmail address (e.g., user@gmail.com).";
    }

    if (!formData.phone.trim()) {
      errs.phone = "Phone number is required.";
    } else if (!phoneRegex.test(formData.phone)) {
      errs.phone = "Phone number must be 10 digits and cannot start with 0.";
    }

    if (!formData.gender) errs.gender = "Gender is required.";
    if (!formData.userName.trim()) errs.userName = "Username is required.";

    if (!formData.dateofBirth) {
      errs.dateofBirth = "Date of Birth is required.";
    } else {
      const dob = new Date(formData.dateofBirth);
      const today = new Date();
      const age = today.getFullYear() - dob.getFullYear();
      const monthDiff = today.getMonth() - dob.getMonth();
      if (dob > today) errs.dateofBirth = "Date of Birth cannot be in the future.";
      else if (age > 90) errs.dateofBirth = "Age cannot be more than 90 years.";
      else if (age < 10) errs.dateofBirth = "Age must be at least 10 years.";
    }

    if (educationList.length === 0)
      errs.education = "Add at least one education record.";

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // ✅ Add/Update Education
  const addOrUpdateEducation = () => {
    if (!education.degree || !education.college || !education.year) {
      // use global popup handled in slice, not here
      setErrors((prev) => ({
        ...prev,
        education: "Please fill in all education fields.",
      }));
      return;
    }

    if (editIndex !== null) {
      const updated = [...educationList];
      updated[editIndex] = education;
      setEducationList(updated);
      setEditIndex(null);
    } else {
      setEducationList([...educationList, education]);
    }

    setEducation({ degree: "", college: "", year: "" });
  };

  // ✅ Delete Education
  const deleteEducation = (index) => {
    setEducationList(educationList.filter((_, i) => i !== index));
  };

  // ✅ Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const loggedInName = localStorage.getItem("name") || "System";

    const payload = {
      id: formData.id,
      firstName: formData.firstName.trim(),
      lastName: formData.lastName.trim(),
      email: formData.email.trim().toLowerCase(),
      phone: formData.phone.trim(),
      dateofBirth: formatDateForBackend(formData.dateofBirth),
      userName: formData.userName.trim(),
      passwordHash: profile.passwordHash,
      gender: formData.gender,
      education: JSON.stringify(educationList),
      roleId: "1",
      createdBy: profile.createdBy || null,
      createdDate: profile.createdDate || null,
      modifiedBy: loggedInName,
      modifiedDate: null,
    };

    dispatch(updateStudent(payload))
      .unwrap()
      .then(() => onSave(payload))
      .catch(() => {});
  };

  return (
    <div className="signup-container">
      <div className="signup-card">
        <h2 className="walletheader">Edit Student Profile</h2>

        <form onSubmit={handleSubmit}>
          {/* Basic Details */}
          <h3 className="section-title">Basic Details</h3>

          <div className="row">
            <div className="form-group">
              <label>First Name *</label>
              <input
                type="text"
                value={formData.firstName}
                onInput={(e) => {
                  e.target.value = e.target.value.replace(/[^A-Za-z .-]/g, "");
                  e.target.value = e.target.value.replace(/\s{2,}/g, " ");
                }}
                onChange={(e) =>
                  setFormData({ ...formData, firstName: e.target.value })
                }
              />
              {errors.firstName && <p className="error-text">{errors.firstName}</p>}
            </div>

            <div className="form-group">
              <label>Last Name *</label>
              <input
                type="text"
                value={formData.lastName}
                onInput={(e) => {
                  e.target.value = e.target.value.replace(/[^A-Za-z .-]/g, "");
                  e.target.value = e.target.value.replace(/\s{2,}/g, " ");
                }}
                onChange={(e) =>
                  setFormData({ ...formData, lastName: e.target.value })
                }
              />
              {errors.lastName && <p className="error-text">{errors.lastName}</p>}
            </div>
          </div>

          <div className="row">
            <div className="form-group">
              <label>Email *</label>
              <input
                type="email"
                value={formData.email}
                onInput={(e) => {
                  e.target.value = e.target.value
                    .toLowerCase()
                    .replace(/\s+/g, "")
                    .replace(/[^a-z0-9@._-]/g, "");
                }}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
              {errors.email && <p className="error-text">{errors.email}</p>}
            </div>

            <div className="form-group">
              <label>Phone *</label>
              <input
                type="text"
                value={formData.phone}
                maxLength="10"
                onInput={(e) => {
                  e.target.value = e.target.value.replace(/[^0-9]/g, "");
                  if (e.target.value.startsWith("0")) {
                    e.target.value = e.target.value.slice(1);
                  }
                  if (e.target.value.length > 10) {
                    e.target.value = e.target.value.slice(0, 10);
                  }
                }}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
              />
              {errors.phone && <p className="error-text">{errors.phone}</p>}
            </div>
          </div>

          <div className="row">
            <div className="form-group">
              <label>Date of Birth *</label>
              <input
                type="date"
                value={formData.dateofBirth}
                onChange={(e) =>
                  setFormData({ ...formData, dateofBirth: e.target.value })
                }
              />
              {errors.dateofBirth && (
                <p className="error-text">{errors.dateofBirth}</p>
              )}
            </div>

            <div className="form-group">
              <label>Gender *</label>
              <select
                value={formData.gender}
                onChange={(e) =>
                  setFormData({ ...formData, gender: e.target.value })
                }
              >
                <option value="">Select</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
              {errors.gender && <p className="error-text">{errors.gender}</p>}
            </div>
          </div>

          {/* Education Section */}
          <h3 className="section-title">Education</h3>

          <div className="row">
            <input
              type="text"
              placeholder="Course"
              value={education.degree}
              onChange={(e) =>
                setEducation({ ...education, degree: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="College"
              value={education.college}
              onChange={(e) =>
                setEducation({ ...education, college: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="Year"
              value={education.year}
              onChange={(e) =>
                setEducation({ ...education, year: e.target.value })
              }
            />
            <button
              type="button"
              className="sign-action-btn"
              onClick={addOrUpdateEducation}
            >
              {editIndex !== null ? "Update" : "Add"}
            </button>
          </div>

          {errors.education && <p className="error-text">{errors.education}</p>}

          {educationList.length > 0 && (
            <table className="signup-table">
              <thead>
                <tr>
                  <th>Course</th>
                  <th>College</th>
                  <th>Year</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {educationList.map((edu, i) => (
                  <tr key={i}>
                    <td>{edu.degree}</td>
                    <td>{edu.college}</td>
                    <td>{edu.year}</td>
                    <td>
                      <button
                        type="button"
                        className="sign-action-btn1"
                        onClick={() => {
                          setEducation(edu);
                          setEditIndex(i);
                        }}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        className="sign-action-btn1 danger"
                        onClick={() => deleteEducation(i)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {/* Username */}
          <h3 className="section-title">Account</h3>
          <div className="form-group">
            <label>Username *</label>
            <input
              type="text"
              value={formData.userName}
              onChange={(e) =>
                setFormData({ ...formData, userName: e.target.value })
              }
            />
            {errors.userName && <p className="error-text">{errors.userName}</p>}
          </div>

          <div className="btn-row">
            <button type="submit" className="sign-action-btn1">
              Update Profile
            </button>
            <button
              type="button"
              className="sign-action-btn1 danger"
              onClick={onCancel}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
