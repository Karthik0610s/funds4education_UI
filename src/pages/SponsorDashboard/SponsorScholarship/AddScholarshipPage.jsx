import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";
import "../../../pages/styles.css";
import Select from "react-select";

import {

    fetchScholarshipBySponsor, addNewScholarship,
    updateScholarship,
    fetchReligions,
    fetchCountries,
    fetchStates,
    fetchGenders,
    fetchClasses,
    fetchCoursesByClass,

} from "../../../app/redux/slices/sponsorscholarshipSlice";


import { uploadFormFilesReq } from "../../../api/scholarshipapplication/scholarshipapplication"
import { publicAxios } from "../../../api/config";
import { ApiKey } from "../../../api/endpoint";
// Regex validations
const text150 = /^[A-Za-z0-9\s.,'-]{0,150}$/;
const text250 = /^[A-Za-z0-9\s.,'-]{0,250}$/;
const text500 = /^[A-Za-z0-9\s.,'-]{0,500}$/;
const decimalRegex = /^\d{0,3}(\.\d{1,2})?$/;
//const amountRegex = /^\d{0,10}(\.\d{1,2})?$/;
const AddScholarshipModal = ({ show, handleClose, scholarship }) => {
    const dispatch = useDispatch();
    const fileInputRef = useRef(null);
    const today = new Date().toISOString().split("T")[0];
    const role = localStorage.getItem("roleName");
    const UserId = localStorage.getItem("userId");


    const initialData = {
        scholarshipCode: "",
        scholarshipName: "",
        scholarshipType: "",
        description: "",
        eligibility: "",
        eligibilityCriteria: "",
        className: "",
        course: "",
        applicableDepartments: "",
        minPercentageOrCGPA: "",
        maxFamilyIncome: "",
        scholarshipAmount: "",
        isRenewable: false,
        renewalCriteria: "",
        startDate: "",
        endDate: "",
        status: "Active",
        sponsorId: 0,
        createdBy: "",
        scholarshipLimit: 0,
        modifiedBy: "",
    };

    const [formData, setFormData] = useState(initialData);
    const [errors, setErrors] = useState({});
    const [selectedFiles, setSelectedFiles] = useState([]);
    //const [filesList, setFilesList] = useState([]);
    // --- State ---
    const [filesList, setFilesList] = useState(formData?.files || []);
    const [fileSelected, setFileSelected] = useState(false);
    const [newFileSelected, setNewFileSelected] = useState(false);
    // ✅ Regex rules
    const text50 = /^[A-Za-z0-9\s]{0,50}$/; // letters, numbers, spaces only, max 50
    const text350 = /^[A-Za-z0-9\s]{0,350}$/;
    const text250 = /^[A-Za-z0-9\s]{0,250}$/;
    const text300 = /^[A-Za-z0-9\s]{0,300}$/;
    //  const text500 = /^[A-Za-z0-9\s.,-]{0,1000}$/; // allows . , - only
    const text500 = /^[A-Za-z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`~\s]{0,1000}$/;
    //const decimalRegex = /^\d{0,2}(\.\d{0,2})?$/; // CGPA/Percentage with decimals
    const number5Regex = /^\d{0,5}$/;
    //const amountRegex = /^\d{0,6}$/; // up to 6 digits (no decimals, only numbers)
    // ✅ Allow up to 10 digits total, optional 2 decimals, and optional % sign
    //const decimalRegex = /^(?:\d{1,8}(?:\.\d{1,2})?|\d{1,2}(?:\.\d{1,2})?%)$/;
    // const decimalRegex = /^\d{0,6}(\.\d{0,2})?%?$/;
    const decimalRegex = /^[A-Za-z₹$,\/\s%-]*\d{1,10}(\.\d{1,2})?%?[A-Za-z₹$,\/\s%-]*$/;
    // ✅ Allow up to 10 digits with optional decimal up to 2 places (e.g., 25000.70)
    //const amountRegex = /^\d{0,10}(\.\d{0,2})?$/;
    const amountRegex = /^[A-Za-z0-9₹$,.\s/%-]{1,350}$/;


    const scholarshipCodeRegex = /^[A-Za-z0-9-]{0,50}$/;

    // Scholarship name allows all characters, max 350
    const scholarshipNameRegex = /^.{0,350}$/;

    // minPercentageOrCGPA and maxFamilyIncome accept any text up to 350 chars
    const anyText350 = /^.{0,350}$/;

    const {
        religions,
        countries,
        states,
        genders,
        classes,
        courses,
    } = useSelector((state) => state.sponsorScholarship);
/*const [filters, setFilters] = useState({
  religion: [],
  country: [],
  state: [],
  gender: [],
  className: [],
  course: [],
});*/
const [filters, setFilters] = useState({
  religion: null,
  country: null,
  state: null,
  gender: null,
  className: null,
  course: null,
});
// ✅ SafeJoin prevents .join() crashes when a field isn't an array
const safeJoin = (val) => {
  if (!val) return null;
  if (Array.isArray(val)) return val.join(",");
  if (typeof val === "string" || typeof val === "number") return val.toString();
  return null;
};

    useEffect(() => {
        if (show) {
            if (scholarship) {
                // Set form data
                setFormData({
                    ...initialData,
                    ...scholarship,
                    startDate: scholarship.startDate ? scholarship.startDate.split("T")[0] : "",
                    endDate: scholarship.endDate ? scholarship.endDate.split("T")[0] : "",
                });

                // Set filters for dropdowns
                /*setFilters({
                    religion: scholarship.religion_ID ? String(scholarship.religion_ID) : "",
                    country: scholarship.country_ID ? String(scholarship.country_ID) : "",
                    state: scholarship.state_ID ? String(scholarship.state_ID) : "",
                    gender: scholarship.gender_ID ? String(scholarship.gender_ID) : "",
                    className: scholarship.class_ID ? String(scholarship.class_ID) : "",
                    course: "", // will set after courses fetch
                });*/
                setFilters({
    religion: scholarship.religion_ID ?? null,
    country: scholarship.country_ID ?? null,
    state: scholarship.state_ID ?? null,
    gender: scholarship.gender_ID ?? null,
    className: scholarship.class_ID ?? null,
    course: null, // will set after courses fetch
});

                // Fetch courses for saved class
                if (scholarship.class_ID) {
                    dispatch(fetchCoursesByClass(scholarship.class_ID));
                }
            } else {
                // Add mode
                setFormData({ ...initialData, sponsorId: localStorage.getItem("userId"), createdBy: localStorage.getItem("name") });
                setFilters({
                    religion: "",
                    country: "",
                    state: "",
                    gender: "",
                    className: "",
                    course: "",
                });
            }
        }

        // Fetch dropdown data
        dispatch(fetchReligions());
        dispatch(fetchCountries());
        dispatch(fetchStates());
        dispatch(fetchGenders());
        dispatch(fetchClasses());
    }, [show, scholarship, dispatch]);
   /* useEffect(() => {
        if (scholarship && scholarship.class_ID && courses.length > 0) {
            setFilters(prev => ({
                ...prev,
                course: scholarship.course_ID ? String(scholarship.course_ID) : ""
            }));
        }
    }, [courses, scholarship]);*/
    useEffect(() => {
    if (scholarship && scholarship.class_ID && courses.length > 0) {
        setFilters(prev => ({
            ...prev,
            course: scholarship.course_ID ?? null
        }));
    }
}, [courses, scholarship]);


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
        setFormData({ ...formData, uploadedFiles: null });
    };
    const handleFilterChange = (e) => {
    const { name, value } = e.target;

    // Convert dropdown values to int (except empty string -> null)
    const parsedValue = value === "" ? null : parseInt(value);

    // Update state with numeric ID
    setFilters(prev => ({
        ...prev,
        [name]: parsedValue
    }));

    // When class changes → fetch courses for that class
    if (name === "className" && parsedValue) {
        dispatch(fetchCoursesByClass(parsedValue));

        // Reset course dropdown on class change
        setFilters(prev => ({
            ...prev,
            course: null
        }));
    }
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
        setFormData({ ...formData, uploadedFiles: files });
    };
    // Upload files function returns uploaded file names
    const uploadFiles = async (applicationId) => {
        if (selectedFiles.length < 1) return [];

        const formDataPayload = new FormData();
        selectedFiles.forEach((file) => formDataPayload.append("FormFiles", file));
        formDataPayload.append("TypeofUser", "Scholarship");
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
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        let regex = null;

        switch (name) {
            case "scholarshipCode":
                regex = scholarshipCodeRegex; // max 50, no special chars
                break;
            case "scholarshipName":
                regex = scholarshipNameRegex; // letters/numbers/spaces only, max 350
                break;
            case "description":


                regex = text500; // allows ., - , and space
                break;
            case "applicableCourses":
            case "applicableDepartments":
                regex = text250;
                break;
            case "renewalCriteria":
                regex = text300; // max length 300, no special chars
                break;
            case "minPercentageOrCGPA":
                regex = anyText350; // decimals allowed
                break;
            case "maxFamilyIncome":
                regex = anyText350;
                break;
            case "scholarshipAmount":
                regex = text350; // numeric only, max length 6
                break;
            case "scholarshipLimit":
                regex = number5Regex;
                break;
            default:
                regex = null;
        }

        if (type === "checkbox") {
            setFormData({ ...formData, [name]: checked });
        } else if (!regex || regex.test(value)) {
            setFormData({ ...formData, [name]: value });
        }

        setErrors({ ...errors, [name]: "" });
    };

    const urlRegex = /^(https?:\/\/)?([\w-]+\.)+[\w-]{2,}(\/[\w- ./?%&=]*)?$/i;

    const validateForm = () => {
        debugger;
        const newErrors = {};

        console.log("🔍 Validating form data:", formData);

        // Required fields
        if (!formData.scholarshipCode?.trim()) {
            newErrors.scholarshipCode = "Scholarship Code is required.";
            console.log("❌ scholarshipCode missing");
        }
        if (!formData.scholarshipName?.trim()) {
            newErrors.scholarshipName = "Scholarship Name is required.";
            console.log("❌ scholarshipName missing");
        }
        if (!formData.scholarshipType?.trim()) {
            newErrors.scholarshipType = "Scholarship Type is required.";
            console.log("❌ scholarshipType missing");
        }
        if (!formData.startDate) {
            newErrors.startDate = "Start Date is required.";
            console.log("❌ startDate missing");
        }
        if (!formData.endDate) {
            newErrors.endDate = "End Date is required.";
            console.log("❌ endDate missing");
        } else if (formData.startDate && formData.endDate < formData.startDate) {
            newErrors.endDate = "End Date must be after Start Date.";
            console.log("❌ endDate < startDate");
        }

        // Scholarship amount validation
        /* if (formData.benefits && !amountRegex.test(formData.benefits)) {
             newErrors.benefits = "Enter a valid amount (numbers only, up to 2 decimals).";
             console.log("❌ Invalid benefits format:", formData.benefits);
         }*/
        if (formData.benefits && formData.benefits.length > 350) {
    newErrors.benefits = "Scholarship Amount cannot exceed 350 characters.";
}
if (formData.minPercentageOrCGPA && formData.minPercentageOrCGPA.length > 350) {
    newErrors.minPercentageOrCGPA = "Min % / CGPA cannot exceed 350 characters.";
}
if (formData.maxFamilyIncome && formData.maxFamilyIncome.length > 350) {
    newErrors.maxFamilyIncome = "Max Family Income cannot exceed 350 characters.";
}

        // Scholarship limit
        if (formData.scholarshipLimit && isNaN(formData.scholarshipLimit)) {
            newErrors.scholarshipLimit = "Scholarship limit must be a number.";
            console.log("❌ Invalid scholarshipLimit:", formData.scholarshipLimit);
        }

        // Web Portal validation
        if (!formData.webportaltoApply) {
            newErrors.webportaltoApply = "Web Portal to Apply is required.";
            console.log("❌ webportaltoApply missing");
        } else {
            const urlPattern = /^(https?:\/\/)?([\w-]+\.)+[\w-]{2,}(\/[\w-]*)*\/?$/;
            if (!urlPattern.test(formData.webportaltoApply)) {
                newErrors.webportaltoApply = "Please enter a valid URL (e.g., https://example.com)";
                console.log("❌ Invalid webportaltoApply:", formData.webportaltoApply);
            }
        }

        if (!formData.eligibility?.trim()) {
            newErrors.eligibility = "Eligibility is required.";
            console.log("❌ eligibility missing");
        }

        if (!formData.eligibilityCriteria?.trim()) {
            newErrors.eligibilityCriteria = "Eligibility Criteria is required.";
            console.log("❌ eligibilityCriteria missing");
        }

        // Optional text length validations
        if (formData.description && formData.description.length > 500) {
            newErrors.description = "Description cannot exceed 500 characters.";
            console.log("❌ description too long:", formData.description.length);
        }
        if (formData.eligibility && formData.eligibility.length > 250) {
            newErrors.eligibility = "Eligibility cannot exceed 250 characters.";
            console.log("❌ eligibility too long:", formData.eligibility.length);
        }
        if (formData.eligibilityCriteria && formData.eligibilityCriteria.length > 500) {
            newErrors.eligibilityCriteria = "Eligibility Criteria cannot exceed 500 characters.";
            console.log("❌ eligibilityCriteria too long:", formData.eligibilityCriteria.length);
        }
        if (formData.renewalCriteria && formData.renewalCriteria.length > 300) {
            newErrors.renewalCriteria = "Renewal Criteria cannot exceed 300 characters.";
            console.log("❌ renewalCriteria too long:", formData.renewalCriteria.length);
        }

        setErrors(newErrors);

        console.log("✅ Validation complete. Errors:", newErrors);
        return Object.keys(newErrors).length === 0;
    };


    const handleSubmit = async (e) => {
        debugger;
        e.preventDefault();
        if (!validateForm()) return;

const payload = {
  ...formData,
  minPercentageOrCGPA: formData.minPercentageOrCGPA || null,
  maxFamilyIncome: formData.maxFamilyIncome || null,
  scholarshipAmount: formData.benefits || null,
  documents: formData.documents || null,
  uploadedFiles: null,

  // ✅ Use safeJoin to avoid "join is not a function" error
  religion_ID: safeJoin(filters.religion),
  country_ID: safeJoin(filters.country),
  state_ID: safeJoin(filters.state),
  gender_ID: safeJoin(filters.gender),
  class_ID: safeJoin(filters.className),
  course_ID: safeJoin(filters.course),

  id: scholarship ? scholarship.id : 0,
};

        try {
            debugger;
            let res;
            let scholarshipId;

            if (scholarship) {

                const res = await updateScholarship(payload, dispatch);
                if (!res?.success) {
                    handleCloseAndReset(); // ✅ close the modal and reset form
                    return;
                }
                scholarshipId = scholarship.id;
            } else {
                console.log("Payload to insert:", payload);
                res = await addNewScholarship(payload, dispatch);
                // ⛔ Stop if insert failed or duplicate
                if (!res?.success) {
                    handleCloseAndReset(); // ✅ close the modal and reset form
                    return;
                }

                scholarshipId = res.data?.id;
                //  scholarshipId = res?.id;
            }

            // ✅ Upload files if any
            if (scholarshipId && selectedFiles.length > 0) {
                await uploadFiles(scholarshipId);
            }

            // ✅ Refresh list
            const UserId = localStorage.getItem("userId");
            const role = localStorage.getItem("roleName");
            if (UserId && role) {
                dispatch(fetchScholarshipBySponsor(UserId, role));
            }

            // ✅ Success message
            await Swal.fire({
                text: scholarship
                    ? "Scholarship updated successfully!"
                    : "Scholarship added successfully!",
                icon: "success",
                confirmButtonText: "OK",
            });

            handleCloseAndReset();
        } catch (err) {
            console.error("Error saving scholarship:", err);
            Swal.fire({ text: "Error saving scholarship!", icon: "error" });
        }
    };


    const handleCloseAndReset = () => {
        setFormData(initialData);
        setErrors({});
        handleClose();
    };
    const downloadFileFun = async (id) => {
        try {
            //const res = await AsyncGetFiles(API.downloadScholarshipFiles + "?id=" + id);
            //const res= await 
            const res = await publicAxios.get(
                `${ApiKey.downloadsponsorscholarshipFiles}/${id}`,
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

    if (!show) return null;

    const Required = () => <span style={{ color: "red" }}> *</span>;

    return (
        <div className="modal-overlay">
            <div className="modal">
                <div className="modal-header">
                    <h3>{scholarship ? "Edit Scholarship" : "Add Scholarship"}</h3>
                    <button className="close-btn" onClick={handleCloseAndReset}>×</button>
                </div>

                <div className="modal-body">
                    <form>
                        <div className="row">
                            <div className="form-group col-6">
                                <label>Scholarship Code<Required /></label>
                                <input
                                    type="text"
                                    name="scholarshipCode"
                                    value={formData.scholarshipCode}
                                    onChange={handleChange}
                                    placeholder="SCH-001"
                                    className={errors.scholarshipCode ? "form-field-error" : ""}
                                />
                                {errors.scholarshipCode && <p className="error-text">{errors.scholarshipCode}</p>}
                            </div>

                            <div className="form-group col-6">
                                <label>Scholarship Name<Required /></label>
                                <input
                                    type="text"
                                    name="scholarshipName"
                                    value={formData.scholarshipName}
                                    onChange={handleChange}
                                    placeholder="Merit Scholarship"
                                    className={errors.scholarshipName ? "form-field-error" : ""}
                                />
                                {errors.scholarshipName && <p className="error-text">{errors.scholarshipName}</p>}
                            </div>
                        </div>

                        <div className="row">
                            <div className="form-group col-6">
                                <label>Scholarship Type<Required /></label>
                                <select
                                    name="scholarshipType"
                                    value={formData.scholarshipType || ""}
                                    onChange={handleChange}
                                >
                                    <option value="">Select Type</option>
                                    <option value="Merit Based">Merit-Based</option>
                                    <option value="Neet Based">Neet-Based</option>
                                    <option value="Research Grant">Research Grant</option>
                                    <option value="Government">Government</option>
                                </select>

                                {errors.scholarshipType && <p className="error-text">{errors.scholarshipType}</p>}
                            </div>

                            <div className="form-group col-6">
                                <label>Scholarship Amount</label>
                                <input
                                    type="text"
                                    name="benefits"
                                    value={formData.benefits}
                                    onChange={handleChange}
                                    placeholder="10000"
                                />
                            </div>
                        </div>
                        <div className="row">
                            <div className="form-group col-6">
                                <label>Description</label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    placeholder="Scholarship details..."
                                />
                            </div>
                            <div className="form-group col-6">
                                <label>Eligibility<Required /></label>
                                <input
                                    type="text"
                                    name="eligibility"
                                    value={formData.eligibility || ""}
                                    onChange={handleChange}
                                    className={errors.eligibility ? "form-field-error" : ""}

                                />
                                {errors.eligibility && <p className="error-text">{errors.eligibility}</p>}

                            </div>
                            <div className="form-group col-6">
                                <label>Eligibility Criteria<Required /></label>
                                <textarea
                                    name="eligibilityCriteria"
                                    value={formData.eligibilityCriteria}
                                    onChange={handleChange}
                                    className={errors.eligibilityCriteria ? "form-field-error" : ""}
                                />
                                {errors.eligibilityCriteria && (
                                    <p className="error-text">{errors.eligibilityCriteria}</p>
                                )}
                            </div>
                        </div>

                        {/* --- Filters Section --- */}
{/*<div className="filters-section mb-4">
  <div className="row">
   
    <div className="form-group col-4">
      <label>Religion</label>
      <Select
        isMulti
        name="religion"
        options={religions.map((r) => ({
          value: r.id,
          label: r.religion_Name,
        }))}
        value={religions
          .filter((r) => filters.religion?.includes(String(r.id)))
          .map((r) => ({ value: r.id, label: r.religion_Name }))}
        onChange={(selected) =>
          setFilters({
            ...filters,
            religion: selected.map((s) => s.value.toString()),
          })
        }
        placeholder="Select Religion(s)"
        classNamePrefix="select"
      />
    </div>
                                <div className="form-group col-4">
                                    <label>Country</label>
                                    <select name="country" value={filters.country} onChange={handleFilterChange}>
                                        <option value="">Select Country</option>
                                        {countries.map(c => (
                                            <option key={c.id} value={c.id}>{c.country_Name}</option>
                                        ))}
                                    </select>
                                </div>
<div className="form-group col-4">
      <label>State</label>
      <Select
        isMulti
        name="state"
        options={states.map((s) => ({
          value: s.id,
          label: s.state_Name,
        }))}
        value={states
          .filter((s) => filters.state?.includes(String(s.id)))
          .map((s) => ({ value: s.id, label: s.state_Name }))}
        onChange={(selected) =>
          setFilters({
            ...filters,
            state: selected.map((s) => s.value.toString()),
          })
        }
        placeholder="Select State(s)"
        classNamePrefix="select"
      />
    </div>
  </div>

  <div className="row mt-2">
    
    <div className="form-group col-4">
      <label>Gender</label>
      <Select
        isMulti
        name="gender"
        options={genders.map((g) => ({
          value: g.gender_ID,
          label: g.gender_Name,
        }))}
        value={genders
          .filter((g) => filters.gender?.includes(String(g.gender_ID)))
          .map((g) => ({ value: g.gender_ID, label: g.gender_Name }))}
        onChange={(selected) =>
          setFilters({
            ...filters,
            gender: selected.map((s) => s.value.toString()),
          })
        }
        placeholder="Select Gender(s)"
        classNamePrefix="select"
      />
    </div>
                                <div className="form-group col-4">
                                    <label>Class</label>
                                    <select name="className" value={filters.className} onChange={handleFilterChange}>
                                        <option value="">Select Class</option>
                                        {classes.map(cls => (
                                            <option key={cls.classId} value={cls.classId}>{cls.className}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="form-group col-4">
      <label>Course</label>
      <Select
        isMulti
        name="course"
        isDisabled={!filters.className?.length}
        options={courses.map((c) => ({
          value: c.courseId,
          label: c.courseName,
        }))}
        value={courses
          .filter((c) => filters.course?.includes(String(c.courseId)))
          .map((c) => ({ value: c.courseId, label: c.courseName }))}
        onChange={(selected) =>
          setFilters({
            ...filters,
            course: selected.map((s) => s.value.toString()),
          })
        }
        placeholder="Select Course(s)"
        classNamePrefix="select"
      />
    </div>
  </div>
                        </div>*/}

                        {/*kamali single select*/}
<div className="mb-4">

  {/* Row 1 */}
  <div className="row">
    {/* Religion */}
    <div className="form-group col-6">
      <label>Religion</label>
      <select
        name="religion"
        className="form-control"
        value={filters.religion ?? ""}
        onChange={(e) => setFilters({ ...filters, religion: Number(e.target.value) || null })}
      >
        <option value="">Select Religion</option>
        {religions.map(r => (
          <option key={r.id} value={r.id}>
            {r.religion_Name}
          </option>
        ))}
      </select>
    </div>

    {/* Country */}
    <div className="form-group col-6">
      <label>Country</label>
      <select
        name="country"
        className="form-control"
        value={filters.country ?? ""}
        onChange={(e) => setFilters({ ...filters, country: Number(e.target.value) || null })}
      >
        <option value="">Select Country</option>
        {countries.map(c => (
          <option key={c.id} value={c.id}>
            {c.country_Name}
          </option>
        ))}
      </select>
    </div>
  </div>

  {/* Row 2 */}
  <div className="row mt-3">
    {/* State */}
    <div className="form-group col-6">
      <label>State</label>
      <select
        name="state"
        className="form-control"
        value={filters.state ?? ""}
        onChange={(e) => setFilters({ ...filters, state: Number(e.target.value) || null })}
      >
        <option value="">Select State</option>
        {states.map(s => (
          <option key={s.id} value={s.id}>
            {s.state_Name}
          </option>
        ))}
      </select>
    </div>

    {/* Gender */}
    <div className="form-group col-6">
      <label>Gender</label>
      <select
  name="gender"
  className="form-control"
  value={filters.gender ?? ""}
  onChange={(e) => setFilters({ ...filters, gender: Number(e.target.value) || null })}
>
  <option value="">Select Gender</option>
  {genders.map(g => (
    <option key={g.gender_ID} value={g.gender_ID}>
      {g.gender_Name}
    </option>
  ))}
</select>
    </div>
  </div>

  {/* Row 3 */}
  <div className="row mt-3">
    {/* Class */}
    <div className="form-group col-6">
      <label>Class</label>
      {/*<select
        name="className"
        className="form-control"
        value={filters.className ?? ""}
        onChange={(e) => setFilters({ ...filters, className: Number(e.target.value) || null })}
      >
        <option value="">Select Class</option>
        {classes.map(cls => (
          <option key={cls.classId} value={cls.classId}>
            {cls.className}
          </option>
        ))}
      </select>*/}
      <select name="className" value={filters.className ?? ""} onChange={handleFilterChange}>
  <option value="">Select Class</option>
  {classes.map(cls => (
    <option key={cls.classId} value={cls.classId}>
      {cls.className}
    </option>
  ))}
</select>
    </div>

    {/* Course */}
    <div className="form-group col-6">
      <label>Course</label>
      <select
        name="course"
        className="form-control"
        disabled={!filters.className}
        value={filters.course ?? ""}
        onChange={(e) => setFilters({ ...filters, course: Number(e.target.value) || null })}
      >
        <option value="">Select Course</option>
        {courses.map(c => (
          <option key={c.courseId} value={c.courseId}>
            {c.courseName}
          </option>
        ))}
      </select>
    </div>
  </div>

</div>



                        <div className="row">
                            <div className="form-group col-4">
                                <label>Min % / CGPA</label>
                                <input
                                    type="text"
                                    name="minPercentageOrCGPA"
                                    value={formData.minPercentageOrCGPA}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="form-group col-4">
                                <label>Max Family Income</label>
                                <input
                                    type="text"
                                    name="maxFamilyIncome"
                                    value={formData.maxFamilyIncome}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className=" col-4 renewable-field">
                                <label>Renewable</label>
                                <input
                                    type="checkbox"
                                    name="isRenewable"
                                    checked={formData.isRenewable}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        {formData.isRenewable && (
                            <div className="row">
                                <div className="form-group">
                                    <label>Renewal Criteria</label>
                                    <input
                                        type="text"
                                        name="renewalCriteria"
                                        value={formData.renewalCriteria}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                        )}

                        <div className="row">
                            <div className="form-group col-6">
                                <label>Start Date<Required /></label>
                                <input
                                    type="date"
                                    name="startDate"
                                    value={formData.startDate}
                                    onChange={handleChange}
                                />
                                {errors.startDate && <p className="error-text">{errors.startDate}</p>}
                            </div>

                            <div className="form-group col-6">
                                <label>End Date<Required /></label>
                                <input
                                    type="date"
                                    name="endDate"
                                    value={formData.endDate}
                                    min={formData.startDate || ""}
                                    onChange={handleChange}
                                />
                                {errors.endDate && <p className="error-text">{errors.endDate}</p>}
                            </div>
                        </div>

                        <div className="row">
                            <div className="form-group">
                                <label>Status</label>
                                <select name="status" value={formData.status} onChange={handleChange}>
                                    <option value="Active">Active</option>
                                    <option value="Inactive">Inactive</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Scholarship Limit</label>
                                <input
                                    type="text"
                                    name="scholarshipLimit"
                                    value={formData.scholarshipLimit}
                                    onChange={handleChange}
                                    placeholder="e.g. 10000"
                                    maxLength={5} // Prevent more than 5 characters
                                    inputMode="numeric" // Brings up numeric keypad on mobile
                                />

                            </div>
                            <div className="row">
                                <div className="form-group col-6">
                                    <label>Documents</label>
                                    <textarea
                                        name="documents"
                                        value={formData.documents || ""}
                                        onChange={handleChange}
                                        placeholder=""
                                        maxLength={3000}
                                    />
                                </div>
                                <div className="form-group col-6">
                                    <label>Can Apply</label>
                                    <textarea
                                        name="canApply"
                                        value={formData.canApply || ""}
                                        onChange={handleChange}
                                        placeholder="Who can apply for this scholarship?"
                                    />
                                </div>
                                <div className="form-group col-6">
                                    <label>Web Portal to Apply<Required /></label>
                                    <input
                                        type="text"
                                        name="webportaltoApply"
                                        value={formData.webportaltoApply}
                                        onChange={handleChange}
                                        placeholder="https://example.com"
                                    />
                                    {errors.webportaltoApply && <p className="error-text">{errors.webportaltoApply}</p>}
                                </div>

                                <div className="form-group col-6">
                                    <label>Contact Details</label>
                                    <textarea
                                        name="contactDetails"
                                        value={formData.contactDetails || ""}
                                        onChange={handleChange}
                                        placeholder="Email / Phone / Address"
                                    />
                                </div>
                            </div>

                            <div className="form-group col-4">
                                <label>Upload Documents</label>
                                <input
                                    type="file"
                                    //  name="documents"
                                    onChange={handleFileChange}
                                    multiple
                                    ref={fileInputRef}
                                />

                                {fileSelected && filesList.length > 0 && (
                                    <button
                                        type="button"
                                        className="btn-danger mt-2"
                                        onClick={handleClear}
                                        style={{ marginTop: "5px" }}
                                    >
                                        Clear
                                    </button>
                                )}

                                {/* Display all files: backend + newly selected */}
                                {(formData?.files?.length > 0 || filesList.length > 0) && (
                                    <div className="d-flex flex-column mt-4 rounded" style={{ marginTop: "5px" }}>
                                        {/* Existing backend files */}
                                        {formData?.files?.map((fileName, index) => (
                                            <div
                                                key={`backend-${index}`}
                                                className="d-flex align-items-center justify-content-between border rounded p-2 mb-1"
                                            >
                                                <span style={{ marginBottom: "5px", padding: "5px" }}>{fileName || "No File Name"}</span>
                                            </div>
                                        ))}



                                        {/* Download button for backend files */}
                                        {formData?.files?.length > 0 && (
                                            <button
                                                type="button"
                                                className="btn btn-sm btn-primary mt-2"
                                                onClick={() => downloadFileFun(formData.id)}
                                                style={{ marginTop: "5px" }}
                                            >
                                                Download
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </form>
                </div>

                <div className="modal-actions">
                    <button className="sign-action-btn1 danger" onClick={handleCloseAndReset}>Cancel</button>
                    <button className="sign-action-btn1" onClick={handleSubmit}>
                        {scholarship ? "Update" : "Save"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddScholarshipModal;
