import React, { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { updateStudent } from "../../../app/redux/slices/studentSlice"; // SweetAlert handled inside slice
import "../../../pages/styles.css";
import { uploadFormFilesReq} from "../../../api/scholarshipapplication/scholarshipapplication";
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
    document:[],
    studentId:""
  });
const fileInputRef = useRef(null);
  const [educationList, setEducationList] = useState([]);
  const [education, setEducation] = useState({ degree: "", college: "", year: "" });
  const [editIndex, setEditIndex] = useState(null);
  const [errors, setErrors] = useState({});
 const [selectedFiles, setSelectedFiles] = useState([]); // newly selected files
const [filesList, setFilesList] = useState(formData?.files||[]);
console.log(filesList,"filelist"); // display names
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
        studentId:profile.studentId,
        firstName: profile.firstName || "",
        lastName: profile.lastName || "",
        email: profile.email || "",
        phone: profile.phone || "",
        dateofBirth: profile.dateofBirth
          ? new Date(profile.dateofBirth).toLocaleDateString("en-CA")
          : "",
        gender: profile.gender || "",
        userName: profile.userName || "",
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

  // ✅ Validation (same as in UserForm)
  const validateForm = () => {
    const errs = {};
    const nameRegex = /^[A-Za-z .-]+$/;
   // const emailRegex = /^[a-z0-9._%+-]+@gmail\.(com|in)$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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
  errs.email = "Enter a valid email address (e.g., user@example.com).";
}


    if (!formData.phone.trim()) {
      errs.phone = "Phone number is required.";
    } else if (!phoneRegex.test(formData.phone)) {
      errs.phone = "Phone number must be 10 digits and cannot start with 0.";
    }

    if (!formData.gender) errs.gender = "Gender is required.";
if (!formData.userName.trim()) {
  errs.userName = "Email is required.";
} else if (!emailRegex.test(formData.userName)) {
  errs.userName = "Enter a valid email address.";
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
      studentId:formData.studentId,
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
      document:null,
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
.replace(/[^a-z0-9@._%+-]/g, "");
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
{ filesList.length > 0 && (
  <div className="d-flex flex-column mt-2 rounded"style={{ marginTop: "5px" }}>

    {/* Backend + selected files */}
    {filesList.map((fileName, index) => (
      <div
        key={`file-${index}`}
        className="d-flex align-items-center border rounded p-2 mb-2"
        style={{
          gap: "12px",
          paddingLeft: "14px",
          paddingRight: "12px",
          color:"black"
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
        onClick={() => downloadFileFun(formData.studentId,"Student")}
        style={{marginTop:"5px",marginLeft:"15px"}}
        
      >
        Download
      </button>
    )}
  </div>
)}



                    
                  </div>
          {/* Education Section */}
          <h3 className="section-title">Education</h3>

          <div className="row">
            <input
              type="text"
              placeholder="Class/Course"
              value={education.degree}
              onChange={(e) =>
                setEducation({ ...education, degree: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="School/College"
              value={education.college}
              onChange={(e) =>
                setEducation({ ...education, college: e.target.value })
              }
            />
            <input
  type="text"
  placeholder="Year"
  value={education.year}
  maxLength={4}
  onChange={(e) => {
    let cleaned = e.target.value.replace(/\D/g, "").slice(0, 4);
    const currentYear = new Date().getFullYear();

    if (cleaned === "") {
      setEducation({ ...education, year: "" });
      return;
    }

    const enteredYear = Number(cleaned);

    // ❌ Block entering a future year
    if (enteredYear > currentYear) return;

    setEducation({ ...education, year: cleaned });
  }}
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
  type="email"
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
