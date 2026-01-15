import React, { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { updateStudent } from "../../../app/redux/slices/studentSlice"; // SweetAlert handled inside slice
import "../../../pages/styles.css";
import { uploadFormFilesReq } from "../../../api/scholarshipapplication/scholarshipapplication";
import Swal from "sweetalert2";
import { ApiKey } from "../../../api/endpoint";
import { publicAxios } from "../../../api/config";
import { fetchStudentProfile } from "../../../app/redux/slices/studentSlice";
import { FiX } from "react-icons/fi";
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
    fatherOccupation: "",
    motherOccupation: "",
    address: "",
    parentContactNumber: "",
    familyIncome: "",
    stateId: "",
    countryId: "",
    document: [],
    studentId: ""
  });
  const fileInputRef = useRef(null);
  const [educationList, setEducationList] = useState([]);
  const [education, setEducation] = useState({ degree: "", specification:"",college: "", year: "" });
  const [editIndex, setEditIndex] = useState(null);
  const [errors, setErrors] = useState({});
  const [selectedFiles, setSelectedFiles] = useState([]); // newly selected files
  const [filesList, setFilesList] = useState(formData?.files || []);
  console.log(filesList, "filelist"); // display names
  const [fileSelected, setFileSelected] = useState(false);
  const [newFileSelected, setNewFileSelected] = useState(false);
  const [existingDocFiles, setExistingDocFiles] = useState([]);
  const [originalFiles, setOriginalFiles] = useState([]);
  const handleFileChange = (e) => {
    debugger;
    const files = Array.from(e.target.files);
    if (!files || files.length === 0) return;

    // No file type restriction
    setSelectedFiles(files);
    setFilesList(files.map(f => f.name));
    setFileSelected(true);
    setNewFileSelected(true);
    setFormData({ ...formData, documents: files });
  };
  // Upload files function returns uploaded file names
  const uploadFiles = async (applicationId) => {
    debugger;
    if (selectedFiles.length < 1) return [];

    const formDataPayload = new FormData();
    selectedFiles.forEach((file) => formDataPayload.append("FormFiles", file));
    formDataPayload.append("TypeofUser", "student");
    formDataPayload.append("id", applicationId);

    try {
      await uploadFormFilesReq(formDataPayload);

      // Return names of uploaded files for merging
      return selectedFiles.map(f => f.name);
    } catch (ex) {
      console.error("File upload failed:", ex);
      return [];
    }
  };
  const downloadFileFun = async (id, type) => {
    try {
      //const res = await AsyncGetFiles(API.downloadScholarshipFiles + "?id=" + id);
      //const res= await 
      const res = await publicAxios.get(
        `${ApiKey.downloadscholarshipFiles}/${id}/${type}`,
        { responseType: "blob" }   // <-- important for file download
      );


      const url = window.URL.createObjectURL(
        new Blob([res.data], { type: "application/zip" })
      );

      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "documents.zip"); // you can rename as needed
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (err) {
      console.error("File download failed:", err);
    }
  };

  const handleClear = () => {
    // clear only newly selected files
    setSelectedFiles([]);

    // 🔑 restore backend files in UI
    setFilesList([...originalFiles]);

    // 🔑 keep backend payload intact
    setFormData(prev => ({
      ...prev,
      fileName: originalFiles.join("|"),
      filePath: prev.filePath
    }));

    setFileSelected(false);
    setNewFileSelected(false);

    if (fileInputRef.current) {
      fileInputRef.current.value = null;
    }
  };


  // ✅ Load profile data
  useEffect(() => {
    if (profile) {
      debugger;
      setFormData({
        id: profile.id,
        studentId: profile.studentId,
        firstName: profile.firstName || "",
        lastName: profile.lastName || "",
        email: profile.email || "",
        phone: profile.phone || "",
        dateofBirth: profile.dateofBirth
          ? new Date(profile.dateofBirth).toLocaleDateString("en-CA")
          : "",
        gender: profile.gender || "",
        userName: profile.userName || "",
        fatherOccupation: profile.fatherOccupation || "",
        motherOccupation: profile.motherOccupation || "",
        address: profile.address || "",
        parentContactNumber: profile.parentsContactNumber || "",
        familyIncome: profile.familyIncome || "",
        stateId: profile.stateId || "",
        countryId: profile.countryId || "",
        // filesList:profile.files ||""
      });
      setFilesList(profile.files || []);
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
  useEffect(() => {
    if (profile) {
      setFilesList(profile.files || []);
      setExistingDocFiles(profile.files || []);
      setOriginalFiles(profile.files || []);

      setFormData(prev => ({
        ...prev,
        fileName: profile.files?.join("|") || "",
        filePath: profile.filePath || ""
      }));
    }
  }, [profile?.id]);


  const isValidEmails = (email) => {
    if (!email) return false;

    email = email.trim();

    // Basic structure
    const basicRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    if (!basicRegex.test(email)) return false;

    const [local, domain] = email.split("@");

    // Local-part rules
    if (local.startsWith(".") || local.endsWith(".")) return false;
    if (local.includes("..")) return false;

    // Domain rules
    if (domain.startsWith(".") || domain.endsWith(".")) return false;
    if (domain.includes("..")) return false;

    const parts = domain.split(".");
    if (parts.length < 2) return false;

    // Reject duplicate TLDs like au.au, com.com
    const last = parts[parts.length - 1];
    const secondLast = parts[parts.length - 2];
    if (last === secondLast) return false;

    // Validate each domain label
    for (let part of parts) {
      if (!/^[A-Za-z0-9-]+$/.test(part)) return false;
      if (part.startsWith("-") || part.endsWith("-")) return false;
    }

    return true;
  };



  const handleRemoveSingleFile = (index) => {
    debugger;
    const updatedFiles = existingDocFiles.filter((_, i) => i !== index);
    //setExistingDocFiles(updatedFiles);
    setFilesList(updatedFiles);

    setFormData(prev => ({
      ...prev,
      files: updatedFiles,
      fileName: updatedFiles.length > 0 ? updatedFiles.join("|") : "",
    }));
    // flags
    if (updatedFiles.length === 0) {
      setFileSelected(false);
      setNewFileSelected(false);
    }

    // clear input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

  };
  // ✅ Format date for backend
  const formatDateForBackend = (dateStr) => {
    if (!dateStr) return null;
    const date = new Date(dateStr);
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${month}/${day}/${year} 00:00:00`;
  };
  const isValidEmail = (email) => {
    email = email.trim();

    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!regex.test(email)) return false;

    const [local, domain] = email.split("@");
    if (!local || !domain) return false;

    if (local.startsWith(".") || local.endsWith(".")) return false;
    if (local.includes("..")) return false;

    if (domain.startsWith(".") || domain.endsWith(".")) return false;
    if (domain.includes("..")) return false;

    const domainParts = domain.split(".");
    if (domainParts.length < 2) return false;

    const lastIndex = domainParts.length - 1;
    if (domainParts[lastIndex] === domainParts[lastIndex - 1]) return false;

    for (let part of domainParts) {
      if (!/^[a-zA-Z0-9-]+$/.test(part)) return false;
      if (part.startsWith("-") || part.endsWith("-")) return false;
    }

    return true;
  };
  const incomeRegex = /^(₹\s?|Rs\.?\s?)?[0-9,./-]+$/;

  const addressRegex = /^[A-Za-z0-9\s,./()\-\n]+$/;
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [loadingCountries, setLoadingCountries] = useState(false);
  const [loadingStates, setLoadingStates] = useState(false);
  const [courses, setCourses] = useState([]);
  const [loadingCourses, setLoadingCourses] = useState(false);
  const fetchCourses = async () => {
    try {
      setLoadingCourses(true);
      const res = await publicAxios.get(`${ApiKey.Class}`);
      setCourses(res.data || []);
    } catch (err) {
      console.error("Failed to fetch courses", err);
    } finally {
      setLoadingCourses(false);
    }
  };
 /* useEffect(() => {
    if (showEducationFields ) {
      fetchCourses();
    }
  }, [showEducationFields]);*/
  // Fetch countries
  const fetchCountries = async () => {
    try {
      setLoadingCountries(true);
      const res = await publicAxios.get(`${ApiKey.Country}`);
      setCountries(res.data || []);
    } catch (err) {
      console.error("Failed to fetch countries", err);
    } finally {
      setLoadingCountries(false);
    }
  };

  // Fetch states based on selected country
  const fetchStates = async () => {
    try {
      setLoadingStates(true);
      const res = await publicAxios.get(`${ApiKey.State}`);
      setStates(res.data || []);
    } catch (err) {
      console.error("Failed to fetch states", err);
    } finally {
      setLoadingStates(false);
    }
  };
  useEffect(() => {
    fetchCourses();
    fetchCountries();
    fetchStates();// fetch countries on component mount
  }, []);
  // ✅ Validation (same as in UserForm)
  const validateForm = () => {
    const errs = {};
    const nameRegex = /^[A-Za-z .-]+$/;
    // const emailRegex = /^[a-z0-9._%+-]+@gmail\.(com|in)$/;
    //const emailRegex = /^(?!.*\.\.)[A-Za-z0-9._%+-]+@[A-Za-z0-9-]+\.[A-Za-z]{2,}$/;

    {/* 
["email", "userName"].forEach(field => {
  const value = formData[field].trim();
  if (!value) {
    errs[field] = "Email is required."; // if empty
  } else if (!isValidEmail(value)) {
    errs[field] = "Enter a valid email address."; // if invalid format
  }
});
*/}


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

    if (!formData.email) {
      errs.email = "Email is required.";
    } else if (!isValidEmail(formData.email)) {
      errs.email = "Enter a valid email.";
    }


    if (!formData.phone.trim()) {
      errs.phone = "Phone number is required.";
    } else if (!phoneRegex.test(formData.phone)) {
      errs.phone = "Phone number must be 10 digits and cannot start with 0.";
    }

    if (!formData.gender) errs.gender = "Gender is required.";
    {/*if (!formData.userName.trim()) {
      errs.userName = "Email is required.";
    } else if (!emailRegex.test(formData.userName)) {
      errs.userName = "Enter a valid email address.";
    }*/}

if (!formData.countryId) {
    errs.country = "Country is required.";
  }

  // State
  if (!formData.stateId) {
    errs.state = "State is required.";
  }

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
    console.log("Errors:", errs);
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // ✅ Add/Update Education
  const addOrUpdateEducation = () => {
    const nameRegex = /^[A-Za-z .-]+$/;

    if (!education.degree.trim()) {
      setErrors(prev => ({ ...prev, education: "Course is required." }));
      return;
    }
    if (!education.specification.trim()) {
      setErrors(prev => ({ ...prev, education: "Specification is required." }));
      return;
    }
    {/*
    if (!nameRegex.test(education.degree)) {
      setErrors(prev => ({
        ...prev,
        education: "Course: special characters or numbers not allowed."
      }));
      return;
    }
  */}
    if (!education.college.trim()) {
      setErrors(prev => ({ ...prev, education: "College is required." }));
      return;
    }
    {/*
    if (!nameRegex.test(education.college)) {
      setErrors(prev => ({
        ...prev,
        education: "College: special characters or numbers not allowed."
      }));
      return;
    }
*/}

    if (!education.year) {
      setErrors(prev => ({ ...prev, education: "Year is required." }));
      return;
    }

    // clear education error
    setErrors(prev => ({ ...prev, education: null }));

    if (editIndex !== null) {
      const updated = [...educationList];
      updated[editIndex] = education;
      setEducationList(updated);
      setEditIndex(null);
    } else {
      setEducationList([...educationList, education]);
    }

    setEducation({ degree: "", specification:"",college: "", year: "" });
  };


  // ✅ Delete Education
  const deleteEducation = (index) => {
    setEducationList(educationList.filter((_, i) => i !== index));
  };

  // ✅ Submit form
  const handleSubmit = async (e) => {
    debugger;
    e.preventDefault();
    if (!validateForm()) return;

    const loggedInName = localStorage.getItem("name") || "System";
    const isFileRemoved =
      originalFiles.length > 0 && filesList.length === 0;
    //const finalFiles = filesList;
    debugger;
    const payload = {
      id: formData.studentId,
      studentId: formData.studentId,
      firstName: formData.firstName.trim(),
      lastName: formData.lastName.trim(),
      email: formData.email.trim().toLowerCase(),
      phone: formData.phone.trim(),
      dateofBirth: formatDateForBackend(formData.dateofBirth),
      userName: formData.userName.trim(),
      passwordHash: profile.passwordHash,
      gender: formData.gender,
      education: JSON.stringify(educationList),
        FatherOccupation:formData.fatherOccupation,
      MotherOccupation:formData.motherOccupation,
      Address:formData.address,
      FamilyIncome:formData.familyIncome,
      StateId:formData.stateId,
      countryId:formData.countryId,
      ParentsContactNumber:formData.parentContactNumber,
      roleId: "1",
      createdBy: profile.createdBy || null,
      createdDate: profile.createdDate || null,
      modifiedBy: loggedInName,
      modifiedDate: null,
      document: null,
      //   fileName: finalFiles.length > 0 ? filesList.join("|") : null,
      //filePath: finalFiles.length > 0 ? formData.filePath : null,
      //fileName: finalFiles.length > 0 ? finalFiles.join("|") : "",
      fileName: isFileRemoved ? "" : filesList.join("|"),
      filePath: formData.filePath   // 👈 ALWAYS send filePath
      //filePath: formData.filePath || null   
    };

    try {
      debugger;

      // ✅ EXACT sponsor pattern
      const res = await dispatch(updateStudent(payload)).unwrap();
      const userId = res?.id || profile.studentId;

      console.log("UserId:", userId);
      console.log("Selected files:", selectedFiles);

      if (selectedFiles?.length > 0) {
        await uploadFiles(userId);
      }

      await Swal.fire({
        icon: "success",
        title: "Success",
        text: "Profile updated successfully!",
      });
      // 2️⃣ Force fresh fetch BEFORE view page
      await dispatch(fetchStudentProfile(formData.id)).unwrap();

      // 3️⃣ Now navigate
      onSave();
      //  onSave(payload);
    } catch (err) {
      Swal.fire({
        icon: "error",
        text: "Update failed!",
      });
    }
  }
  return (
    <div className="signup-container">
      <div className="signup-card" style={{ position: "relative" }}>
        <button
          type="button"
          onClick={onCancel}
          aria-label="Close"
          style={{
            position: "absolute",
            top: "12px",
            right: "12px",
            background: "transparent",
            border: "none",
            fontSize: "24px",
            cursor: "pointer",
            color: "#555",
            zIndex: 10
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "#d11a2a")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "#555")}
        >
          <FiX />
        </button>
        <h2 className="walletheader">Edit Student Profile</h2>

        <form onSubmit={handleSubmit} noValidate>
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
              <label>Personal Email *</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value.toLowerCase().trim() })
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
          <div className="row">
            <div className="form-group" >
              <label>Father Occupation</label>
              <input
                type="text"
                value={formData.fatherOccupation}
                onChange={(e) =>
                 
                  setFormData({ ...formData, fatherOccupation: e.target.value })
                }
                className={errors.fatherOccupation ? "input-error" : ""}
                placeholder="Father Occupation"
              />
              {errors.fatherOccupation && <p className="error-text">{errors.fatherOccupation}</p>}
            </div>
            <div className="form-group">
              <label>Mother Occupation </label>
              <input
                type="text"
                value={formData.motherOccupation}
                onChange={(e) =>
              
                  setFormData({ ...formData, motherOccupation: e.target.value })
                }
                className={errors.motherOccupation ? "input-error" : ""}
                placeholder="Mother Occupation"
              />
              {errors.motherOccupation && <p className="error-text">{errors.motherOccupation}</p>}
            </div>
          </div>
          <div className="row">
            <div className="form-group">
              <label>Parent's Phone </label>
              <input
                type="text"
                maxLength={10}
                value={formData.parentContactNumber}
                onChange={(e) => {
                  const value = e.target.value;

                  // allow only numbers while typing
                  if (/^\d*$/.test(value)) {
                    setFormData({ ...formData, parentContactNumber: value });
                  }
                }}
                className={errors.parentContactNumber ? "input-error" : ""}
                placeholder="Parent's Number"
              />
              {errors.parentContactNumber && <p className="error-text">{errors.parentContactNumber}</p>}
            </div>
            <div className="form-group">
              <label>Family Income </label>
              <input
                type="text"
                value={formData.familyIncome}
                onChange={(e) =>

                  setFormData({ ...formData, familyIncome: e.target.value })
                }
                className={errors.familyIncome ? "input-error" : ""}
                placeholder="Family Income"
                maxLength={20}
              />
              {errors.familyIncome && <p className="error-text">{errors.familyIncome}</p>}
            </div>
          </div>
          <div className="row">
            <div className="form-group">
              <label>Country <span className="required">*</span></label>
              <select
                value={formData.countryId}
                onChange={(e) => setFormData({ ...formData, countryId: e.target.value, state: "" })}
                className={errors.country ? "input-error" : ""}
              >
                <option value="">Select Country</option>
                {countries.map((c) => (
                  <option key={c.id} value={c.id}>{c.country_Name}</option>
                ))}
              </select>
              {errors.country && <p className="error-text">{errors.country}</p>}
            </div>

            <div className="form-group">
              <label>State <span className="required">*</span></label>
              <select
                value={formData.stateId}
                onChange={(e) => setFormData({ ...formData, stateId: e.target.value })}
                className={errors.state ? "input-error" : ""}

              >
                <option value="">Select State</option>
                {states.map((s) => (
                  <option key={s.id} value={s.id}>{s.state_Name}</option>
                ))}
              </select>
              {errors.state && <p className="error-text">{errors.state}</p>}
            </div>
          </div>
          <div className="row">
            <div className="form-group">
              <label>Address </label>
              <textarea
                value={formData.address}
                maxLength={250}
                rows={4}
                placeholder="Address"
                className={errors.address ? "input-error" : ""}
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    address: e.target.value
                  });
                }}
              />

              {errors.address && <p className="error-text">{errors.address}</p>}
            </div>
          </div>
          <div className="form-group col-12">
            <label>Upload Profile Photo</label>
            <input
              type="file"
              accept="image/*"
              name="documents"
              onChange={handleFileChange}
              // multiple
              ref={fileInputRef}
            // disabled={isViewMode}
            />

            {fileSelected && filesList.length > 0 && (
              <button
                type="button"
                className="btn btn-sm btn-danger mt-2"
                onClick={handleClear}
                style={{ marginTop: "10px" }}
              >
                Clear
              </button>
            )}

            {/* Display all files: backend + newly selected */}
            {filesList.length > 0 && (
              <div className="d-flex flex-column mt-2 rounded" style={{ marginTop: "5px" }}>

                {/* Backend + selected files */}
                {filesList.map((fileName, index) => (
                  <div
                    key={`file-${index}`}
                    className="d-flex align-items-center border rounded p-2 mb-2"
                    style={{
                      gap: "12px",
                      paddingLeft: "14px",
                      paddingRight: "12px",
                      color: "black"
                    }}
                  >
                    <span style={{ flex: 1 }}>{fileName || "No File Name"}</span>
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => handleRemoveSingleFile(index)}
                      style={{ marginLeft: "5px" }}
                    >
                      ×
                    </button>
                  </div>
                ))}

                {/* Download button (backend only) */}
                {selectedFiles.length === 0 && profile?.files?.length > 0 && (
                  <button
                    type="button"
                    className="btn btn-sm btn-primary mt-2"
                    onClick={() => downloadFileFun(formData.studentId, "Student")}
                    style={{ marginTop: "5px", marginLeft: "15px" }}

                  >
                    Download
                  </button>
                )}
              </div>
            )}




          </div>
          {/* Education Section */}
          <h3 className="section-title">Current Education Details</h3>

    

  {/* Row 1 → 3 fields */}
   <div className="education-grid">
    <div className="form-group">
      <select
        value={education.degree}
        onChange={(e) =>
          setEducation({ ...education, degree: e.target.value })
        }
        //className={eduErrors.degree ? "input-error" : ""}
      >
        <option value="">Select Class / Course</option>
        {courses.map((course) => (
          <option key={course.classId} value={course.className}>
            {course.className}
          </option>
        ))}
      </select>
    </div>

    <div className="form-group">
      <input
        type="text"
        placeholder="Specification"
        value={education.specification}
        onChange={(e) =>
          setEducation({ ...education, specification: e.target.value })
        }
      />
    </div>

    <div className="form-group">
      <input
        type="text"
        placeholder="School/College"
        value={education.college}
        onChange={(e) =>
          setEducation({ ...education, college: e.target.value })
        }
      />
    </div>
 

  {/* Row 2 → Year + Button */}
  
    <div className="form-group">
      <input
        type="text"
        placeholder="Year"
        value={education.year}
        maxLength={4}
        onChange={(e) => {
          let cleaned = e.target.value.replace(/\D/g, "").slice(0, 4);
          const currentYear = new Date().getFullYear();
          if (cleaned && Number(cleaned) > currentYear) return;
          setEducation({ ...education, year: cleaned });
        }}
      />
    </div>
  <div className="sign-action-btns">
    <button
      type="button"
      className="sign-action-btn"
      onClick={addOrUpdateEducation}
     style={{marginTop:"-20px",justifyItems:"center"}}
    >
      {editIndex !== null ? "Update" : "Add"}
    </button>
    </div>
 </div>


          {errors.education && <p className="error-text">{errors.education}</p>}

          {educationList.length > 0 && (
            <table className="signup-table">
              <thead>
                <tr>
                  <th>Course</th>
                   <th>Specification</th>
                  <th>College</th>
                  <th>Year</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {educationList.map((edu, i) => (
                  <tr key={i}>
                    <td>{edu.degree}</td>
                    <td>{edu.specification}</td>
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
          <h3 className="section-title">Account Details</h3>
          <div className="form-group">
            <label>User Name(Email) *</label>
            <input
              type="email"
              value={formData.userName}
              onChange={(e) =>
                setFormData({ ...formData, userName: e.target.value.toLowerCase().trim() })
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
