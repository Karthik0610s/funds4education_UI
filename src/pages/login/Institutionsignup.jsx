import React, { useState,useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { routePath as RP } from "../../app/components/router/routepath";
import "../../pages/styles.css"; // your CSS file
import { addNewInstitutionSignup } from "../../app/redux/slices/institutionsignupSlice";
//import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useDispatch } from "react-redux";
import { uploadFormFilesReq } from "../../api/scholarshipapplication/scholarshipapplication";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
export default function InstitutionSignUpPage() {
  const fileInputRef = useRef(null);
   const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
const dispatch = useDispatch();
  const [institutionDetails, setInstitutionDetails] = useState({
    institutionName: "",
    institutionType: "",
    registrationNumber: "",
    address: "",
    city: "",
    state: "",
    country: "",
    contactPerson: "",
    contactEmail: "",
    contactPhone: "",
    numStudentsEligible: "",
    verificationAuthority: "",
     documents: [],
    
  });
const [step, setStep] = useState(0);
  const [verification, setVerification] = useState({ username: "", password: "" });
  const [errors, setErrors] = useState({});

  // --- Validation regex ---
  const nameRegex = /^[A-Za-z\s]{1,150}$/;
  //const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9-]+\.(com|edu|org|in|au)$/;
  //const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9-]+\.(com\.au|au|edu|org|in)$/;
//const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9-]+\.(com(\.(au|edu|in|org))?|edu|org|in)$/;
  const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9-]+\.(com|com\.au|edu|edu\.in|in|au)$/;



  const phoneRegex = /^[0-9]{10}$/;
  const usernameRegex = /^[A-Za-z]{1,150}$/;
  const passwordRegex =
    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{6,}$/;

  // --- Handlers ---
  const handleInstitutionChange = (e) => {
    const { name, value } = e.target;

    switch (name) {
      case "institutionName":
      case "contactPerson":
      case "verificationAuthority":
        setInstitutionDetails((prev) => ({
          ...prev,
          [name]: value.replace(/[^A-Za-z\s]/g, "").slice(0, 150),
        }));
        break;

      case "city":
      case "state":
      case "country":
        setInstitutionDetails((prev) => ({
          ...prev,
          [name]: value.replace(/[^A-Za-z\s]/g, "").slice(0, 50),
        }));
        break;

      case "registrationNumber":
        setInstitutionDetails((prev) => ({
          ...prev,
          [name]: value.replace(/[^A-Za-z0-9]/g, "").slice(0, 10),
        }));
        break;

      case "address":
        setInstitutionDetails((prev) => ({
          ...prev,
          [name]: value.replace(/[^A-Za-z0-9\s\-.,/]/g, "").slice(0, 200),
        }));
        break;

      case "contactPhone":
        setInstitutionDetails((prev) => ({
          ...prev,
          [name]: value.replace(/[^0-9]/g, "").slice(0, 10),
        }));
        break;

      case "numStudentsEligible":
        setInstitutionDetails((prev) => ({
          ...prev,
          [name]: value.replace(/[^0-9]/g, "").slice(0, 5),
        }));
        break;

      default:
        setInstitutionDetails((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleVerificationChange = (e) => {
    const { name, value } = e.target;

   if (name === "username") {
    const cleaned = value
      .replace(/[^A-Za-z0-9@._%+-]/g, "") // allow these chars only
      .slice(0, 150);                     // limit to 150 chars

    setVerification((prev) => ({
      ...prev,
      username: cleaned,
    }));
  }  else if (name === "password") {
      setVerification((prev) => ({ ...prev, [name]: value })); // password validation on next/save
    }
  };

  // --- Validation per step ---
  const validateStep = () => {
    let stepErrors = {};

    if (step === 0) {
      if (!institutionDetails.institutionName || !nameRegex.test(institutionDetails.institutionName))
        stepErrors.institutionName = "Institution Name required (alphabets & spaces only).";
      if (!institutionDetails.institutionType)
        stepErrors.institutionType = "Institution Type is required.";
      if (!institutionDetails.registrationNumber)
        stepErrors.registrationNumber = "Registration/Accreditation Number required.";
    }

    if (step === 1) {
      if (!institutionDetails.address) stepErrors.address = "Address is required.";
      if (!institutionDetails.city) stepErrors.city = "City is required.";
      if (!institutionDetails.state) stepErrors.state = "State is required.";
      if (!institutionDetails.country) stepErrors.country = "Country is required.";
      if (!institutionDetails.contactPerson)
        stepErrors.contactPerson = "Contact Person Name is required.";
      if (!institutionDetails.contactEmail || !emailRegex.test(institutionDetails.contactEmail))
        stepErrors.contactEmail = "Valid Contact Email is required.";
      if (!institutionDetails.contactPhone || !phoneRegex.test(institutionDetails.contactPhone))
        stepErrors.contactPhone = "Valid 10-digit phone number required.";
      if (!institutionDetails.numStudentsEligible)
        stepErrors.numStudentsEligible = "Number of Students Eligible required.";
      if (!institutionDetails.verificationAuthority)
        stepErrors.verificationAuthority = "Verification Authority is required.";
    }

    if (step === 2) {
       if (!verification.username || !emailRegex.test(verification.username))
  stepErrors.username = "Enter a valid email.";
      if (!verification.password || !passwordRegex.test(verification.password))
        stepErrors.password =
          "Password min 6 chars, must include letters, numbers & 1 special char.";
    }

    setErrors(stepErrors);
    return Object.keys(stepErrors).length === 0;
  };

  // --- Navigation handlers ---
  const nextStep = () => {
    if (validateStep()) setStep(step + 1);
  };
  const prevStep = () => setStep(step - 1);



  const [selectedFiles, setSelectedFiles] = useState([]); // newly selected files
  const [filesList, setFilesList] = useState( []); // display names
  const [fileSelected, setFileSelected] = useState(false);
  const [newFileSelected, setNewFileSelected] = useState(false);
   const [existingDocFiles, setExistingDocFiles] = useState([]);
  const [originalFiles, setOriginalFiles] = useState([]);
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (!files || files.length === 0) return;
  
    setSelectedFiles(files);               // store File objects
    setFilesList(files.map(f => f.name));  // store names for display
  
    setInstitutionDetails({ ...institutionDetails, documents: files }); // attach to basicDetails
    setFileSelected(true);
  };
    // Upload files function returns uploaded file names
    const uploadFiles = async (applicationId) => {
      if (selectedFiles.length < 1) return [];
  
      const formDataPayload = new FormData();
      selectedFiles.forEach((file) => formDataPayload.append("FormFiles", file));
      formDataPayload.append("TypeofUser", "institution");
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
    const handleRemoveSingleFile = (index) => { 
    debugger;
  const updatedFiles = existingDocFiles.filter((_, i) => i !== index);
  //setExistingDocFiles(updatedFiles);
   setFilesList(updatedFiles);

  /*setFormData(prev => ({
    ...prev,
    files: updatedFiles,
    fileName: updatedFiles.length > 0 ? updatedFiles.join("|") : "",
  }));*/
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
  const handleClear = () => {
    setSelectedFiles([]);
    setFilesList([]);
    setFileSelected(false);
    setInstitutionDetails({ ...institutionDetails, documents: [] }); // clear documents
    if (fileInputRef.current) fileInputRef.current.value = null;
  };
  const handleSave = async () => {
    
    if (!validateStep()) return;

    // Flatten data to match backend expected structure
    const data = {
      institutionID: 0, // 0 or leave it if backend auto-generates
      institutionName: institutionDetails.institutionName,
      institutionType: institutionDetails.institutionType,
      registrationNumber: institutionDetails.registrationNumber,
      address: institutionDetails.address,
      city: institutionDetails.city,
      state: institutionDetails.state,
      country: institutionDetails.country,
      contactPerson: institutionDetails.contactPerson,
      contactEmail: institutionDetails.contactEmail,
      contactPhone: institutionDetails.contactPhone,
      numStudentsEligible: parseInt(institutionDetails.numStudentsEligible, 10),
      verificationAuthority: institutionDetails.verificationAuthority,
      institutionCreatedBy: localStorage.getItem("name") || "Admin", // can be replaced with logged user if needed
      institutionCreatedDate: new Date().toISOString(),
      institutionModifiedBy: localStorage.getItem("name") || "Admin",
      institutionModifiedDate: new Date().toISOString(),
      username: verification.username,
      passwordHash: verification.password, // backend can hash it if needed
      roleId: 4 || localStorage.getItem("roleId"), // assuming 4 = Institution role
      userCreatedBy: localStorage.getItem("name") ||"Admin",
      userCreatedDate: new Date().toISOString(),
    };

    try {
      const res = await addNewInstitutionSignup(data,dispatch);
debugger;
      if (res && !res.error && res.data) {
         const userId =res.data.institutionID;
      if (!userId) return; 
         // stop if insertion failed
        
          // 2️⃣ Upload documents if any
          if (institutionDetails.documents && institutionDetails.documents.length > 0) {
            try {
              await uploadFiles(userId);
            } catch (err) {
              console.error("File upload failed:", err);
              Swal.fire({
                text: "Documents upload failed!",
                icon: "error",
              });
              return;
            }
          }
        // SweetAlert success
        Swal.fire({
          title: "Success!",
          text: "Institution inserted successfully",
          icon: "success",
          confirmButtonText: "OK",
        }).then(() => {
          navigate(RP.login); // or RP.login
        });
      } else {
        Swal.fire({
          title: "Error",
          text: res?.message || "Something went wrong!",
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    } catch (error) {
        
      Swal.fire({
        title: "Error",
        text: error.message  ||error. errorMsg|| "API call failed!",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-card">
        {/* Header */}
        <div className="signup-header">
          <h2>Institution Sign Up</h2>
          <p>
            Already a member?{" "}
            <Link 
  to={RP.login} 
  state={{ userType: "institution" }} 
  className="signup-link"
>
  Sign in
</Link>
          </p>
        </div>

        {/* Step navigation */}
        <div className="signup-steps">
          {["Basic Details", "Institution Info", "Verification"].map((label, i) => (
            <div key={i} className="step-item">
              <div
                className={`step-circle ${i === step ? "active" : ""}`}
                onClick={() => {
                  if (i <= step) setStep(i);
                }}
                title={label}
              >
                {i + 1}
              </div>
              <span className="step-label">{label}</span>
            </div>
          ))}
        </div>

        {/* Step content */}
        {step === 0 && (
          <div>
            <h3 className="section-title">Basic Details</h3>
            <div className="form-group">
              <label>Institution Name *</label>
              <input
                type="text"
                name="institutionName"
                value={institutionDetails.institutionName}
                onChange={handleInstitutionChange}
                className={errors.institutionName ? "input-error" : ""}
                placeholder="Institution Name"
                maxLength={150}
              />
              {errors.institutionName && <p className="error-text">{errors.institutionName}</p>}
            </div>

            <div className="form-group">
              <label>Institution Type *</label>
              <select
                name="institutionType"
                value={institutionDetails.institutionType}
                onChange={handleInstitutionChange}
                className={errors.institutionType ? "input-error" : ""}
              >
                <option value="">Select Type</option>
                <option value="School">School</option>
                <option value="College">College</option>
                <option value="University">University</option>
              </select>
              {errors.institutionType && <p className="error-text">{errors.institutionType}</p>}
            </div>

            <div className="form-group">
              <label>Registration/Accreditation Number *</label>
              <input
                type="text"
                name="registrationNumber"
                value={institutionDetails.registrationNumber}
                onChange={handleInstitutionChange}
                className={errors.registrationNumber ? "input-error" : ""}
                placeholder="Registration/Accreditation Number"
                maxLength={10}
              />
              {errors.registrationNumber && (
                <p className="error-text">{errors.registrationNumber}</p>
              )}
            </div>
          </div>
        )}

        {step === 1 && (
          <div>
            <h3 className="section-title">Institution Info</h3>
            <div className="form-group">
              <label>Address *</label>
              <input
                type="text"
                name="address"
                value={institutionDetails.address}
                onChange={handleInstitutionChange}
                className={errors.address ? "input-error" : ""}
                placeholder="Full Address"
                maxLength={200}
              />
              {errors.address && <p className="error-text">{errors.address}</p>}
            </div>

            <div className="row">
              <div className="form-group">
                <label>City *</label>
                <input
                  type="text"
                  name="city"
                  value={institutionDetails.city}
                  onChange={handleInstitutionChange}
                  className={errors.city ? "input-error" : ""}
                  placeholder="City"
                  maxLength={50}
                />
                {errors.city && <p className="error-text">{errors.city}</p>}
              </div>
              <div className="form-group">
                <label>State *</label>
                <input
                  type="text"
                  name="state"
                  value={institutionDetails.state}
                  onChange={handleInstitutionChange}
                  className={errors.state ? "input-error" : ""}
                  placeholder="State"
                  maxLength={50}
                />
                {errors.state && <p className="error-text">{errors.state}</p>}
              </div>
              <div className="form-group">
                <label>Country *</label>
                <input
                  type="text"
                  name="country"
                  value={institutionDetails.country}
                  onChange={handleInstitutionChange}
                  className={errors.country ? "input-error" : ""}
                  placeholder="Country"
                  maxLength={50}
                />
                {errors.country && <p className="error-text">{errors.country}</p>}
              </div>
            </div>

            <div className="form-group">
              <label>Contact Person Name (Scholarship Officer/Admin) *</label>
              <input
                type="text"
                name="contactPerson"
                value={institutionDetails.contactPerson}
                onChange={handleInstitutionChange}
                className={errors.contactPerson ? "input-error" : ""}
                placeholder="Contact Person Name"
                maxLength={150}
              />
              {errors.contactPerson && <p className="error-text">{errors.contactPerson}</p>}
            </div>

            <div className="row">
              <div className="form-group">
                <label>Contact Email *</label>
                <input
                  type="email"
                  name="contactEmail"
                  value={institutionDetails.contactEmail}
                  onChange={handleInstitutionChange}
                  className={errors.contactEmail ? "input-error" : ""}
                  placeholder="Contact Email"
                />
                {errors.contactEmail && <p className="error-text">{errors.contactEmail}</p>}
              </div>
              <div className="form-group">
                <label>Contact Phone *</label>
                <input
                  type="text"
                  name="contactPhone"
                  value={institutionDetails.contactPhone}
                  onChange={handleInstitutionChange}
                  className={errors.contactPhone ? "input-error" : ""}
                  placeholder="Contact Phone"
                  maxLength={10}
                />
                {errors.contactPhone && <p className="error-text">{errors.contactPhone}</p>}
              </div>
            </div>

            <div className="form-group">
              <label>Number of Students Eligible *</label>
              <input
                type="number"
                name="numStudentsEligible"
                value={institutionDetails.numStudentsEligible}
                onChange={handleInstitutionChange}
                className={errors.numStudentsEligible ? "input-error" : ""}
                placeholder="Number of Students Eligible"
                maxLength={5}
              />
              {errors.numStudentsEligible && (
                <p className="error-text">{errors.numStudentsEligible}</p>
              )}
            </div>

            <div className="form-group">
              <label>Verification Authority (Name & Designation of Approver) *</label>
              <input
                type="text"
                name="verificationAuthority"
                value={institutionDetails.verificationAuthority}
                onChange={handleInstitutionChange}
                className={errors.verificationAuthority ? "input-error" : ""}
                placeholder="Verification Authority"
                maxLength={150}
              />
              {errors.verificationAuthority && (
                <p className="error-text">{errors.verificationAuthority}</p>
              )}
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

               {filesList.length > 0 && (
    <div className="d-flex flex-column mt-2 rounded"style={{ marginTop: "5px" }}>
      {filesList.map((fileName, index) => (
        <div
          key={index}
          className="d-flex align-items-center justify-content-between border rounded p-2 mb-1"
           style={{
          gap: "12px",
          paddingLeft: "14px",
          paddingRight: "12px",
          color:"black"
        }}
        >
          <span>{fileName}</span>
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
    </div>
  )}
  </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <h3 className="section-title">Verification</h3>
            <div className="row">
              {/*<div className="form-group">
                <label>Username *</label>
                <input
                  type="text"
                  name="username"
                  placeholder="Username"
                  value={verification.username}
                  onChange={handleVerificationChange}
                  className={errors.username ? "input-error" : ""}
                  maxLength={150}
                />
                {errors.username && <p className="error-text">{errors.username}</p>}
              </div>*/}
               <div className="form-group">
        <label>Username *</label>
        <input
  type="text"
  placeholder="Username"
  value={verification.username}
 onChange={(e) => { const value = e.target.value; // allow only letters, numbers, underscore 
 if (/^[A-Za-z0-9@._%+-]*$/.test(value)){ setVerification({ ...verification, username: value }); } }} className={errors.username ? "input-error" : ""} />

        {errors.username && <p className="error-text">{errors.username}</p>}
      </div>
              <div className="form-group">
               <label>Password *</label>
             
               <div className="password-wrapper">
                 <input
                   type={showPassword ? "text" : "password"}
                   placeholder="Password"
                   value={verification.password}
                   onChange={(e) =>
                     setVerification({ ...verification, password: e.target.value })
                   }
                   className={errors.password ? "input-error" : ""}
                 />
             
                 <span
                   className="password-toggle"
                   onClick={() => setShowPassword(!showPassword)}
                 >
                   {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
                 </span>
               </div>
             
               {errors.password && <p className="error-text">{errors.password}</p>}
             </div>
            </div>
          </div>
        )}

        {/* Navigation buttons */}
        <div className="nav-buttons">
          {step > 0 && (
            <button onClick={prevStep} className="nav-btn">
              Previous
            </button>
          )}
          {step < 2 && (
            <button onClick={nextStep} className="nav-btn">
              Next
            </button>
          )}
          {step === 2 && (
            <button onClick={handleSave} className="save-btn">
              Save
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
