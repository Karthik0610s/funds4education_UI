import React, { useEffect, useState ,useRef} from "react";
import { useDispatch } from "react-redux";
import {
  addNewScholarshipApplication,
  fetchScholarshipApplicationList,
  updateScholarshipApplication,
} from "../../../app/redux/slices/scholarshipApplicationSlice";
import "../../../pages/styles.css";
import Swal from "sweetalert2";
import { useNavigate, useNavigation } from "react-router-dom";
import {fetchScholarshipApplicationByIdReq, uploadFormFilesReq} from "../../../api/scholarshipapplication/scholarshipapplication"
import { publicAxios } from "../../../api/config";
import { ApiKey } from "../../../api/endpoint";
import { routePath as RP } from "../../../app/components/router/routepath";
// --- Regex validations ---
const nameRegex = /^[A-Za-z\s]{0,150}$/;
const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9-]+\.(com|com\.au|edu)$/;
const phoneRegex = /^[0-9]{0,10}$/;
const courseRegex = /^[A-Za-z\s]{0,150}$/;
const collegeRegex = /^[A-Za-z\s]{0,250}$/;
const yearRegex = /^[0-9\-]{0,10}$/;
const gpaRegex = /^\d{0,3}(\.\d{1,2})?$/;
const scholarshipRegex = /^[A-Za-z0-9\s]{0,250}$/;
const text250Regex = /^[A-Za-z\s]{0,250}$/;

/*const scholarshipOptions = [
  { id: 1, name: "National Merit Scholarship" },
  { id: 2, name: "Need-Based Education Grant" },
  { id: 3, name: "STEM Excellence Fellowship" },
  { id: 4, name: "Research Innovation Award" },
];*/
 

 

const AddApplicationModal = ({ show, handleClose, application }) => {
const [scholarshipOptions, setScholarshipOptions] = useState([]);
  const [filteredScholarships, setFilteredScholarships] = useState([]);
   useEffect(() => {
    const fetchScholarships = async () => {
      try {
        const url = `${ApiKey.Scholarship}/status`;
        const params = { StatusType: "live" };
        const res = await publicAxios.get(url, { params });

        // ✅ Adjust mapping depending on API structure
        if (res.data && Array.isArray(res.data)) {
          const options = res.data.map((s) => ({
            id: s.id,
            name: s.name,
             type: s.scholarshipType,
          }));
          setScholarshipOptions(options);
        }
      } catch (error) {
        console.error("Error fetching scholarships:", error);
      }
    };

    fetchScholarships();
  }, []);
   // 🔍 Whenever category changes, filter scholarships
 
const fileInputRef = useRef(null);
const navigation= useNavigate();
   const dispatch = useDispatch();
  const today = new Date().toISOString().split("T")[0];
  const minDOB = new Date(new Date().setFullYear(new Date().getFullYear() - 79))
    .toISOString()
    .split("T")[0];
   const initialFormData = {
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    dateOfBirth: "",
    gender: "",
    studyLevel: "",
    schoolName: "",
    courseOrMajor: "",
    yearOfStudy: "",
    gpaOrMarks: "",
    scholarshipId: "",
    category: "",
    applicationDate: today,
    documents: null,
    extraCurricularActivities: "",
    awardsAchievements: "",
    notesComments: "",
    status: "",
      createdBy: "",
  modifiedBy: "",
  };
  const [formData, setFormData] = useState(initialFormData);
   
  const [errors, setErrors] = useState({});
  const [selectedFiles, setSelectedFiles] = useState([]);
//const [filesList, setFilesList] = useState([]);
// --- State ---
const [filesList, setFilesList] = useState(formData?.files || []);
const [fileSelected, setFileSelected] = useState(false);
const [newFileSelected, setNewFileSelected] = useState(false);
 

 

  

  // Populate form if editing
  useEffect(() => {
    if (application) {
      setFormData({
        ...initialFormData,
        ...application,
        dateOfBirth: application.dateOfBirth ? application.dateOfBirth.split("T")[0] : "",
        applicationDate: application.applicationDate ? application.applicationDate.split("T")[0] : today,
        scholarshipId: application.scholarshipId ? parseInt(application.scholarshipId) : "",
        modifiedBy:localStorage.getItem("name")
      });
    } else {
     setFormData({
      ...initialFormData,
      createdBy: localStorage.getItem("name"),  // ✅ set created by current user
      
    });
    }
    setErrors({});
  }, [application, show]);

 /* const handleChange = (e) => {
    const { name, value, files } = e.target;
    let regex = null;

    switch (name) {
      case "firstName":
      case "lastName":
        regex = nameRegex;
        break;
      case "phoneNumber":
        regex = phoneRegex;
        break;
      case "courseOrMajor":
        regex = courseRegex;
        break;
      case "schoolName":
        regex = collegeRegex;
        break;
      case "yearOfStudy":
        regex = yearRegex;
        break;
      case "gpaOrMarks":
        regex = gpaRegex;
        break;
      case "scholarshipId":
        regex = scholarshipRegex;
        break;
      case "extraCurricularActivities":
      case "awardsAchievements":
      case "notesComments":
        regex = text250Regex;
        break;
      default:
        regex = null;
    }

    if (files) {
      setFormData({ ...formData, [name]: files[0] });
    } else {
      if (!regex || regex.test(value)) {
        setFormData({ ...formData, [name]: name === "scholarshipId" ? parseInt(value) : value });
      }
    }
    setErrors({ ...errors, [name]: "" });
  };*/
  const handleChange = (e) => {
  const { name, value, files } = e.target;
  let regex = null;

  switch (name) {
    case "firstName":
    case "lastName":
      regex = nameRegex;
      break;
    case "phoneNumber":
      regex = phoneRegex;
      break;
    case "courseOrMajor":
      regex = courseRegex;
      break;
    case "schoolName":
      regex = collegeRegex;
      break;
    case "yearOfStudy":
      regex = yearRegex;
      break;
    case "gpaOrMarks":
      regex = gpaRegex;
      break;
    case "scholarshipId":
      regex = scholarshipRegex;
      break;
    case "extraCurricularActivities":
    case "awardsAchievements":
    case "notesComments":
      regex = text250Regex;
      break;
    default:
      regex = null;
  }

  if (files) {
    const fileArray = Array.from(files);
    setSelectedFiles(fileArray);
    setFilesList(fileArray.map((f) => f.name));
  } else {
   /* if (!regex || regex.test(value)) {
      setFormData({
        ...formData,
        [name]: name === "scholarshipId" ? parseInt(value) : value,
      });
    }*/
let updatedFormData = { ...formData };

      if (!regex || regex.test(value)) {
        updatedFormData[name] =
          name === "scholarshipId" ? parseInt(value) : value;
      }

      // ✅ When a scholarship is selected, set the corresponding type in category
      if (name === "scholarshipId") {
        const selected = scholarshipOptions.find(
          (s) => s.id === parseInt(value)
        );
        if (selected) {
          updatedFormData.category = selected.type || "";
        } else {
          updatedFormData.category = "";
        }
      }

      setFormData(updatedFormData);
  }
  setErrors({ ...errors, [name]: "" });
};


// --- Clear function ---
const handleClear = () => {
  // Clear newly selected files
  setSelectedFiles([]);
  setFilesList([]);
  setFileSelected(false);
  setNewFileSelected(false);

  // Clear the file input element
  if (fileInputRef.current) {
    fileInputRef.current.value = null;
  }

  // Reset documents field in formData
  setFormData({ ...formData, documents: null });
};

// --- File change handler ---
const handleFileChange = (e) => {
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
  if (selectedFiles.length < 1) return [];

  const formDataPayload = new FormData();
  selectedFiles.forEach((file) => formDataPayload.append("FormFiles", file));
  formDataPayload.append("TypeofUser", "SchAppForm");
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

  const validateForm = () => {
    const newErrors = {};
    if (!formData.firstName || !nameRegex.test(formData.firstName))
      newErrors.firstName = "First Name is required (letters only, max 150).";
    if (formData.lastName && !nameRegex.test(formData.lastName))
      newErrors.lastName = "Last Name must be letters only (max 150).";
    if (!formData.email || !emailRegex.test(formData.email))
      newErrors.email = "Valid email required (abc@xyz.com).";
    if (formData.phoneNumber && !/^[0-9]{10}$/.test(formData.phoneNumber))
      newErrors.phoneNumber = "Phone must be exactly 10 digits.";
    if (formData.dateOfBirth && !(new Date(formData.dateOfBirth) <= new Date()))
      newErrors.dateOfBirth = `DOB must be valid and in the past.`;
    if (!formData.studyLevel) newErrors.studyLevel = "Study Level is required.";
    if (!formData.scholarshipId) newErrors.scholarshipId = "Scholarship Name required.";
    if (!formData.category) newErrors.category = "Category required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /*const handleSubmit = (e, statusType) => {
    e.preventDefault();
    if (!validateForm()) return;

    const finalData = { ...formData, status: statusType };

    if (application) {
      updateScholarshipApplication(finalData, dispatch);
    } else {
      addNewScholarshipApplication(finalData, dispatch);
    }

    handleCloseAndReset();
  };*/
const handleSubmit = async (e, statusType) => {
  e.preventDefault();
  if (!validateForm()) return;

  const finalData = {
    ...formData,
    status: statusType,
    dateOfBirth: formData.dateOfBirth || null,
    yearOfStudy: formData.yearOfStudy || null,
    phoneNumber: formData.phoneNumber || "",
    schoolName: formData.schoolName || "",
    courseOrMajor: formData.courseOrMajor || "",
    documents: null,
  };

  let applicationId = null;

  try {
    // Create or update application
    if (application) {
      applicationId = application.id;
      await updateScholarshipApplication(finalData, dispatch);
    } else {
      const res = await addNewScholarshipApplication(finalData, dispatch);
      applicationId = res?.id;
    }

    // Upload files if any
    if (applicationId && selectedFiles.length > 0) {
      await uploadFiles(applicationId);
    }

    // Fetch updated application by ID to get the latest files
    if (applicationId) {
      debugger;
      const updatedApp = await fetchScholarshipApplicationByIdReq(applicationId);
      setFormData((prev) => ({
        ...prev,
        ...updatedApp.data,
        dateOfBirth: updatedApp.data.dateOfBirth
          ? updatedApp.data.dateOfBirth.split("T")[0]
          : "",
        applicationDate: updatedApp.data.applicationDate
          ? updatedApp.data.applicationDate.split("T")[0]
          : today,
      }));
    }

    // Reset selected files
    setSelectedFiles([]);
    //setFilesList([]);

    // Fetch latest list for Redux
   // await dispatch(fetchScholarshipApplicationList());

    // Show success Swal
    const result = await Swal.fire({
      text: application ? "Application updated successfully!" : "Application added successfully!",
      icon: "success",
      confirmButtonText: "OK",
    });

    // Navigate after OK
    if (result.isConfirmed) {
      navigation("/application"); // useNavigate hook
    }

    handleCloseAndReset();
  } catch (err) {
    console.error("Submit failed:", err);
    Swal.fire({
      text: "Error! Try Again!",
      icon: "error",
    });
  }
};


  const handleCloseAndReset = () => {
    setFormData(initialFormData);
    setErrors({});
    handleClose();
  };

  const downloadFileFun = async (id) => {
  try {
    //const res = await AsyncGetFiles(API.downloadScholarshipFiles + "?id=" + id);
//const res= await 
 const res = await publicAxios.get(
      `${ApiKey.downloadscholarshipFiles}/${id}`, 
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

  if (!show) return null; // Do not render if modal hidden

  const Required = () => <span style={{ color: "red" }}> *</span>;

  return (
    <div className="modal-overlay">
      <div className="modal">
        {/* Header */}
        <div className="modal-header">
          <h3>{application ? "Edit Application" : "New Application"}</h3>
          <button className="close-btn" onClick={handleCloseAndReset}>×</button>
        </div>

        {/* Body */}
       <div className="modal-body">
  <form>
    <h4>Personal Information</h4>

    <div className="row">
      <div className="form-group col-6">
        <label>First Name <Required /></label>
        <input
          type="text"
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
          className={errors.firstName ? "input-error" : ""}
          placeholder="First Name"
        />
        {errors.firstName && <p className="error-text">{errors.firstName}</p>}
      </div>

      <div className="form-group col-6">
        <label>Last Name</label>
        <input
          type="text"
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
          className={errors.lastName ? "input-error" : ""}
          placeholder="Last Name"
        />
        {errors.lastName && <p className="error-text">{errors.lastName}</p>}
      </div>
    </div>

    <div className="row">
      <div className="form-group col-6">
        <label>Email <Required /></label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className={errors.email ? "input-error" : ""}
          placeholder="Email"
        />
        {errors.email && <p className="error-text">{errors.email}</p>}
      </div>

      <div className="form-group col-6">
        <label>Phone</label>
        <input
          type="text"
          name="phoneNumber"
          value={formData.phoneNumber}
          onChange={handleChange}
          className={errors.phoneNumber ? "input-error" : ""}
          placeholder="Phone"
        />
        {errors.phoneNumber && <p className="error-text">{errors.phoneNumber}</p>}
      </div>
    </div>

    <div className="row">
      <div className="form-group col-6">
        <label>Date of Birth</label>
        <input
          type="date"
          name="dateOfBirth"
          value={formData.dateOfBirth}
          min={minDOB}
          max={today}
          onChange={handleChange}
        />
      </div>

      <div className="form-group col-6">
        <label>Gender</label>
        <select
          name="gender"
          value={formData.gender}
          onChange={handleChange}
        >
          <option value="">Select Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>
      </div>
    </div>

    <h4 className="mt-3">Academic Information</h4>

    <div className="row">
      <div className="form-group col-6">
        <label>Study Level <Required /></label>
        <select
          name="studyLevel"
          value={formData.studyLevel}
          onChange={handleChange}
        >
          <option value="">Select Study Level</option>
          <option value="UG">Undergraduate</option>
          <option value="PG">Postgraduate</option>
          <option value="PhD">Ph.D.</option>
        </select>
        {errors.studyLevel && <p className="error-text">{errors.studyLevel}</p>}
      </div>

      <div className="form-group col-6">
        <label>College</label>
        <input
          type="text"
          name="schoolName"
          value={formData.schoolName}
          onChange={handleChange}
        />
      </div>
    </div>

    <div className="row">
      <div className="form-group col-6">
        <label>Course / Major</label>
        <input
          type="text"
          name="courseOrMajor"
          value={formData.courseOrMajor}
          onChange={handleChange}
        />
      </div>

      <div className="form-group col-6">
        <label>Year of Study</label>
        <input
          type="text"
          name="yearOfStudy"
          value={formData.yearOfStudy}
          onChange={handleChange}
        />
      </div>
    </div>

    <div className="row">
      <div className="form-group col-6">
        <label>Marks / GPA</label>
        <input
          type="text"
          name="gpaOrMarks"
          value={formData.gpaOrMarks}
          onChange={handleChange}
        />
      </div>

      <div className="form-group col-6">
        <label>Scholarship Name <Required /></label>
        <select
          name="scholarshipId"
          value={formData.scholarshipId}
          onChange={handleChange}
        >
          <option value="">Select Scholarship</option>
          {scholarshipOptions.map((sch) => (
            <option key={sch.id} value={sch.id}>{sch.name}</option>
          ))}
        </select>
      </div>
    </div>

    <div className="row">
       <div className="form-group col-6">
                <label>Category <Required /></label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  disabled // category is auto-filled, not user-editable
                >
                  <option value="">Select Category</option>
                  {formData.category && (
                    <option value={formData.category}>
                      {formData.category}
                    </option>
                  )}
                </select>
              </div>
 
      <div className="form-group col-6">
        <label>Application Date <Required /></label>
        <input
          type="date"
          name="applicationDate"
          value={formData.applicationDate}
          min={today}
          max={today}
          onChange={handleChange}
        />
      </div>
    </div>

    <div className="row">
  {/*<div className="form-group col-12">
    <label>Upload Documents</label>
    <input
      type="file"
      name="documents"
      onChange={handleChange}
      multiple
    />

    Show uploaded files from backend if present 
    {formData?.files && formData.files.length > 0 && (
      <div className="mt-2">
        {formData.files.map((fileName, index) => (
          <div
            key={index}
            className="d-flex align-items-center mt-1 border rounded p-2"
          >
            <div className="flex-grow-1">
              <h6 className="mb-0">{fileName}</h6>
            </div>
            <button
              type="button"
              className="btn btn-sm btn-primary ms-2"
           onClick={() => downloadFileFun(formData.id)}
            >
              Download
            </button>
          </div>
        ))}
      </div>
    )}
    {formData?.files && formData.files.length > 0 && (
  <div className="mt-2 border rounded p-3">
   

    
    <ul className="mb-2">
      {formData.files.map((fileName, index) => (
        <li key={index}>{fileName}</li>
      ))}
    </ul>

    
    <button
      type="button"
      className="btn btn-sm btn-primary"
      onClick={() => downloadFileFun(formData.id)}
    >
      Download
    </button>
  </div>
)}*/}


 <div className="form-group col-12">
  <label>Upload Documents</label>
  <input
    type="file"
    name="documents"
    onChange={handleFileChange}
    multiple
    ref={fileInputRef}
  />

  {fileSelected && filesList.length > 0 && (
  <button
    type="button"
    className="btn btn-sm btn-danger mt-2"
    onClick={handleClear}
  >
    Clear
  </button>
)}

  {/* Display all files: backend + newly selected */}
  {(formData?.files?.length > 0 || filesList.length > 0) && (
    <div className="d-flex flex-column mt-2 rounded">
      {/* Existing backend files */}
      {formData?.files?.map((fileName, index) => (
        <div
          key={`backend-${index}`}
          className="d-flex align-items-center justify-content-between border rounded p-2 mb-1"
        >
          <span>{fileName || "No File Name"}</span>
        </div>
      ))}

     

      {/* Download button for backend files */}
      {formData?.files?.length > 0 && (
        <button
          type="button"
          className="btn btn-sm btn-primary mt-2"
          onClick={() => downloadFileFun(formData.id)}
        >
          Download
        </button>
      )}
    </div>
  )}
</div>





</div>


    <h4 className="mt-3">Additional Information</h4>
    <div className="row">
      <div className="form-group col-12">
        <label>Extra-Curricular</label>
        <textarea name="extraCurricularActivities" value={formData.extraCurricularActivities} onChange={handleChange}></textarea>
      </div>
      <div className="form-group col-12">
        <label>Awards / Achievements</label>
        <textarea name="awardsAchievements" value={formData.awardsAchievements} onChange={handleChange}></textarea>
      </div>
      <div className="form-group col-12">
        <label>Notes / Comments</label>
        <textarea name="notesComments" value={formData.notesComments} onChange={handleChange}></textarea>
      </div>
    </div>
  </form>
</div>


        {/* Footer Actions */}
        <div className="modal-actions">
          <button className="sign-action-btn1 danger" onClick={handleCloseAndReset} >Cancel</button>
          <button className="sign-action-btn1" onClick={(e) => handleSubmit(e, "Draft")}>Save Draft</button>
          <button className="sign-action-btn1" onClick={(e) => handleSubmit(e, "Submitted")}>
            {application ? "Update" : "Submit"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddApplicationModal;
