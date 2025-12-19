import React, { useState,useRef } from "react";
import { Link, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { insertNewUser } from "../../app/redux/slices/signupSlice";
import { routePath as RP } from "../../app/components/router/routepath";
import { useNavigate } from "react-router-dom";
import "../../pages/styles.css";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import Swal from "sweetalert2";
import { uploadFormFilesReq } from "../../api/scholarshipapplication/scholarshipapplication";
export default function SignUpPage() {
  const [step, setStep] = useState(0);
  const [userType, setUserType] = useState("student"); // default to student
  const [showPassword, setShowPassword] = useState(false);

const fileInputRef = useRef(null);
  const [basicDetails, setBasicDetails] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    dob: "",
    gender: "",
      documents: [],
  });

  const [educationList, setEducationList] = useState([]);
  const [eduErrors, setEduErrors] = useState({});
  const [education, setEducation] = useState({ degree: "", college: "", year: "" });
  const [showEducationFields, setShowEducationFields] = useState(false);
  const [editIndex, setEditIndex] = useState(null);

  const [verification, setVerification] = useState({ username: "", password: "" });
  const [errors, setErrors] = useState({});

  // Redux
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.signup);

  // --- Validation regex ---
  const nameRegex = /^[A-Za-z]{0,150}$/;
  const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9-]+\.(com|com\.au|edu|edu\.in|in|au)$/;
  const usernameRegex = /^[A-Za-z0-9_]{3,20}$/;
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{6,}$/;
  const phoneRegex = /^\d{10}$/;
  const courseRegex = /^[A-Za-z0-9\s.]{0,150}$/;
  const collegeRegex = /^[A-Za-z\s]{0,250}$/;
  const yearRegex = /^[0-9]{4}$/;

  const isValidEmail = (email) => {
    if (!emailRegex.test(email)) return false;
    const domainPart = email.split("@")[1];
    const tldMatches = domainPart.match(/\.[a-z]+/gi);
    if (!tldMatches) return false;
    const tldSet = new Set(tldMatches);
    return tldSet.size === tldMatches.length;
  };

  // --- Validation per step ---
  const validateStep = () => {
    let stepErrors = {};

    if (step === 0) {
      if (!basicDetails.firstName || !nameRegex.test(basicDetails.firstName))
        stepErrors.firstName = "First name required (alphabets only, max 150).";
      if (!basicDetails.lastName || !nameRegex.test(basicDetails.lastName))
        stepErrors.lastName = "Last name required (alphabets only, max 150).";
      if (!basicDetails.email || !isValidEmail(basicDetails.email))
        stepErrors.email = "Invalid email.";
      if (!basicDetails.phone || !phoneRegex.test(basicDetails.phone))
        stepErrors.phone = "Phone number max 10 digits.";
      if (!basicDetails.dob) stepErrors.dob = "Date of birth is required.";
      if (!basicDetails.gender) stepErrors.gender = "Gender is required.";
    }
    
    if (step === 1) {
      if (educationList.length === 0)
        stepErrors.education = "Add at least one education record.";
    }

    if (step === 2) {
      if (!verification.username || !isValidEmail(verification.username))
  stepErrors.username = "Enter a valid email.";
      if (!verification.password || !passwordRegex.test(verification.password))
        stepErrors.password =
          "Password must be min 6 chars, include letters, numbers & special char.";
    }

    setErrors(stepErrors);
    return Object.keys(stepErrors).length === 0;
  };

  // --- Step navigation ---
  const nextStep = () => {
    if (validateStep()) setStep(step + 1);
  };
  const prevStep = () => setStep(step - 1);

  const [selectedFiles, setSelectedFiles] = useState([]); // newly selected files
const [filesList, setFilesList] = useState( []); // display names
const [fileSelected, setFileSelected] = useState(false);

const handleFileChange = (e) => {
  const files = Array.from(e.target.files);
  if (!files || files.length === 0) return;

  setSelectedFiles(files);               // store File objects
  setFilesList(files.map(f => f.name));  // store names for display

  setBasicDetails({ ...basicDetails, documents: files }); // attach to basicDetails
  setFileSelected(true);
};
  // Upload files function returns uploaded file names
  const uploadFiles = async (applicationId) => {
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
const handleClear = () => {
  setSelectedFiles([]);
  setFilesList([]);
  setFileSelected(false);
  setBasicDetails({ ...basicDetails, documents: [] }); // clear documents
  if (fileInputRef.current) fileInputRef.current.value = null;
};

  // --- Save (Signup dispatch) ---
  const handleSave = async() => {
    if (!validateStep()) return;
  const createdBy = `${basicDetails.firstName} ${basicDetails.lastName}`.trim();
const payload = {
  FirstName: basicDetails.firstName,
  LastName: basicDetails.lastName,
  Email: basicDetails.email,            // ✅ correct field
  Phone: basicDetails.phone,
  DateofBirth: basicDetails.dob,        // ✅ rename
  Gender: basicDetails.gender,
  UserName: verification.username,      // ✅ rename
  PasswordHash: verification.password,  // ✅ raw password
  RoleId: "1",
  Education: JSON.stringify(educationList) ,// ✅ backend expects string
  CreatedBy: createdBy,  
};

debugger;
   // 1️⃣ Insert user and get ID
  const userId = await dispatch(insertNewUser(payload));
  if (!userId) return; // stop if insertion failed

  // 2️⃣ Upload documents if any
  if (basicDetails.documents && basicDetails.documents.length > 0) {
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

  // 3️⃣ Show success alert after everything
  await Swal.fire({
    text: "Signup successful!",
    icon: "success",
    confirmButtonText: "OK",
  });

  // 4️⃣ Navigate to login
  navigate("/login");
};

  // --- Education handlers ---
  const addEducation = () => {
    let errorsObj = {};
    if (!courseRegex.test(education.degree)) errorsObj.degree = "Invalid course.";
    if (!collegeRegex.test(education.college)) errorsObj.college = "Invalid college/university.";
    if (!yearRegex.test(education.year)) errorsObj.year = "Year must be 4 digits.";

    if (Object.keys(errorsObj).length > 0) {
      setEduErrors(errorsObj);
      return;
    }

    setEducationList([...educationList, education]);
    setEducation({ degree: "", college: "", year: "" });
    setShowEducationFields(false);
    setEduErrors({});
  };

  const updateEducation = (index) => {
    let errorsObj = {};
    if (!courseRegex.test(education.degree)) errorsObj.degree = "Invalid course.";
    if (!collegeRegex.test(education.college)) errorsObj.college = "Invalid college/university.";
    if (!yearRegex.test(education.year)) errorsObj.year = "Year must be 4 digits.";

    if (Object.keys(errorsObj).length > 0) {
      setEduErrors(errorsObj);
      return;
    }

    const updated = [...educationList];
    updated[index] = education;
    setEducationList(updated);
    setEditIndex(null);
    setEducation({ degree: "", college: "", year: "" });
    setEduErrors({});
  };

  const deleteEducation = (index) => {
    const updated = educationList.filter((_, i) => i !== index);
    setEducationList(updated);
  };

  // --- DOB restrictions ---
  const today = new Date().toISOString().split("T")[0];
  const minDob = new Date();
  minDob.setFullYear(minDob.getFullYear() - 79);
  const minDobStr = minDob.toISOString().split("T")[0];

  const isStepCompleted = (stepIndex) => {
    if (stepIndex === 0) {
      return (
        basicDetails.firstName &&
        nameRegex.test(basicDetails.firstName) &&
        basicDetails.lastName &&
        nameRegex.test(basicDetails.lastName) &&
        basicDetails.email &&
        isValidEmail(basicDetails.email) &&
        basicDetails.phone &&
        phoneRegex.test(basicDetails.phone) &&
        basicDetails.dob &&
        basicDetails.gender
      );
    }
    if (stepIndex === 1) return educationList.length > 0;
    return true;
  };

  return (
    <div className="signup-container">
      <div className="signup-card">
        {/* Header */}
        <div className="signup-header">
          <h2>Sign up</h2>
          <p>
            Already a member?{" "}
            <Link to={RP.login} state={{ userType }} className="signup-link">
              Sign in
            </Link>
          </p>
        </div>

        {/* Step navigation */}
        <div className="signup-steps">
          {["Basic Details", "Education", "Verification"].map((label, i) => (
            <div key={i} className="step-item">
              <div
                className={`step-circle ${i === step ? "active" : ""} ${
                  i > 0 && !isStepCompleted(i - 1) ? "disabled" : ""
                }`}
                onClick={() => {
                  if (i === 0 || isStepCompleted(i - 1)) setStep(i);
                }}
                title={label}
              >
                {i + 1}
              </div>
              <span className="step-label">{label}</span>
            </div>
          ))}
        </div>

        {/* Error / Loading messages */}
        {loading && <p className="loading-text">Processing...</p>}
        {error && <p className="error-text">Something went wrong, try again!</p>}

        {/* Step Content */}
        {/* Step 0: Basic Details */}
        {step === 0 && (
          <div>
            <h3 className="section-title">Basic Details</h3>
            <div className="row">
              <div className="form-group">
                <label>First Name *</label>
                <input
                  type="text"
                  value={basicDetails.firstName}
                  onChange={(e) =>
                    nameRegex.test(e.target.value) &&
                    setBasicDetails({ ...basicDetails, firstName: e.target.value })
                  }
                  className={errors.firstName ? "input-error" : ""}
                  placeholder="First Name"
                />
                {errors.firstName && <p className="error-text">{errors.firstName}</p>}
              </div>
              <div className="form-group">
                <label>Last Name *</label>
                <input
                  type="text"
                  value={basicDetails.lastName}
                  onChange={(e) =>
                    nameRegex.test(e.target.value) &&
                    setBasicDetails({ ...basicDetails, lastName: e.target.value })
                  }
                  className={errors.lastName ? "input-error" : ""}
                  placeholder="Last Name"
                />
                {errors.lastName && <p className="error-text">{errors.lastName}</p>}
              </div>
            </div>
            <div className="row">
              <div className="form-group">
                <label>Email *</label>
<input
  type="email"
  value={basicDetails.email}
  onChange={(e) => {
    const value = e.target.value;

    // allow only letters, numbers, @ and dot while typing
    if (/^[A-Za-z0-9@.]*$/.test(value)) {
      setBasicDetails({ ...basicDetails, email: value });
    }
  }}
  className={errors.email ? "input-error" : ""}
  placeholder="Email"
/>

                {errors.email && <p className="error-text">{errors.email}</p>}
              </div>
              <div className="form-group">
                <label>Phone *</label>
                <input
                  type="text"
                  maxLength={10}
                  value={basicDetails.phone}
                  onChange={(e) => {
    const value = e.target.value;

    // allow only numbers while typing
    if (/^\d*$/.test(value)) {
      setBasicDetails({ ...basicDetails, phone: value });
    }
  }}
                  className={errors.phone ? "input-error" : ""}
                  placeholder="Phone"
                />
                {errors.phone && <p className="error-text">{errors.phone}</p>}
              </div>
            </div>
            <div className="row">
              <div className="form-group">
                <label>Date of Birth *</label>
                <input
                  type="date"
                  value={basicDetails.dob}
                  max={today}
                  min={minDobStr}
                  onChange={(e) => setBasicDetails({ ...basicDetails, dob: e.target.value })}
                  className={errors.dob ? "input-error" : ""}
                />
                {errors.dob && <p className="error-text">{errors.dob}</p>}
              </div>
              <div className="form-group">
                <label>Gender *</label>
                <div className="gender-group">
                  <label>   Male
                  </label>
                    <input
                      type="radio"
                      name="gender"
                      checked={basicDetails.gender === "Male"}
                      onChange={() => setBasicDetails({ ...basicDetails, gender: "Male" })}
                    />
                 
                  <label>  Female
                  </label>
                    <input
                      type="radio"
                      name="gender"
                      checked={basicDetails.gender === "Female"}
                      onChange={() => setBasicDetails({ ...basicDetails, gender: "Female" })}
                    />
                  
                </div>
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
                  >
                    Clear
                  </button>
                )}

               {filesList.length > 0 && (
    <div className="d-flex flex-column mt-2 rounded">
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
        </div>
      ))}
    </div>
  )}


                    
                  </div>
              
              
          </div>
        )}

        {/* Education Step */}
        {step === 1 && (
          <div>
            <div className="education-header">
              <h3>Education</h3>
              {!showEducationFields && editIndex === null && (
                <button onClick={() => setShowEducationFields(true)} className="add-btn">
                  + Add Education
                </button>
              )}
            </div>

            {errors.education && <p className="error-text">{errors.education}</p>}

           {/*{educationList.length > 0 && (
              <div className="education-grid header">
                <div>Course</div>
                <div>College / University</div>
                <div>Year</div>
                <div>Actions</div>
              </div>
            )}
*/}
            {educationList.map((edu, index) =>
              editIndex === index ? (
                <div className="education-grid" key={index}>
                  <input
  type="text"
  placeholder="Course"
  value={education.degree}
  onChange={(e) => setEducation({ ...education, degree: e.target.value })}
/>
{eduErrors.degree && <p className="error-text">{eduErrors.degree}</p>}

<input
  type="text"
  placeholder="College / University  "
  value={education.college}
  onChange={(e) => setEducation({ ...education, college: e.target.value })}
/>
{eduErrors.college && <p className="error-text">{eduErrors.college}</p>}

<input
  type="text"
  placeholder="Year"
  value={education.year}
  onChange={(e) => setEducation({ ...education, year: e.target.value })}
  maxLength={4}
/>
{eduErrors.year && <p className="error-text">{eduErrors.year}</p>}


                  <div className="sign-action-btns">
                    <button onClick={() => updateEducation(index)} className="sign-action-btn">
                      Save
                    </button>
                    <button
                      onClick={() => {
                        setEditIndex(null);
                        setEducation({ degree: "", college: "", year: "" });
                      }}
                      className="sign-action-btn"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="education-grid" key={index}>
                  <div>{edu.degree}</div>
                  <div>{edu.college}</div>
                  <div>{edu.year}</div>
                  <div className="sign-action-btns">
                    <button
                      onClick={() => {
                        setEditIndex(index);
                        setEducation(edu);
                        setShowEducationFields(false);
                      }}
                      className="sign-action-btn"
                    >
                      Edit
                    </button>
                    <button onClick={() => deleteEducation(index)} className="sign-action-btn">
                      Delete
                    </button>
                  </div>
                </div>
              )
            )}

            {showEducationFields && editIndex === null && (
              <div className="education-grid">
<input
  type="text"
  placeholder="Course / Class"
  value={education.degree}
  maxLength={150}
  onChange={(e) => {
    if (courseRegex.test(e.target.value)) {
      setEducation({ ...education, degree: e.target.value });
    }
  }}
/>


                 

                  <input
  type="text"
  placeholder="College / University / School"
  value={education.college}
  maxLength={250}
  onChange={(e) => {
    if (collegeRegex.test(e.target.value)) {
      setEducation({ ...education, college: e.target.value });
    }
  }}
/>

                

                  <input
                    type="text"
                    placeholder="Year"
                    value={education.year}
                    maxLength={4}
                    onChange={(e) => {
    const value = e.target.value;
    // Allow only numbers while typing
    if (/^\d*$/.test(value)) {
      setEducation({ ...education, year: value });
    }
  }}
                  />
                 

                <div className="sign-action-btns">
                  <button onClick={addEducation} className="sign-action-btn">
                    Save
                  </button>
                  <button
                    onClick={() => {
                      setShowEducationFields(false);
                      setEducation({ degree: "", college: "", year: "" });
                        setEduErrors({}); // 🔹 clear errors on Cancel
                    }}
                    className="sign-action-btn"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
             {/* Show errors only after clicking Save */}
    {Object.keys(eduErrors).length > 0 && (
      <div className="error-block">
        {eduErrors.degree && <p className="error-text">{eduErrors.degree}</p>}
        {eduErrors.college && <p className="error-text">{eduErrors.college}</p>}
        {eduErrors.year && <p className="error-text">{eduErrors.year}</p>}
      </div>
    )}
          </div>
        )}

        {/* Step 2: Verification */}
        {step === 2 && (
          <div>
            <h3>Verification</h3>
            <div className="row">
              <div className="form-group">
               <label>Email *</label>
<input
  type="text"
  placeholder="Enter your email"
  value={verification.username}
  onChange={(e) => {
    const value = e.target.value;

    // allow valid email characters while typing
    if (/^[A-Za-z0-9@._%+-]*$/.test(value)) {
      setVerification({ ...verification, username: value });
    }
  }}
  className={errors.username ? "input-error" : ""}
/>

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
            <button onClick={handleSave} className="save-btn" disabled={loading}>
              {loading ? "Saving..." : "Save"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
