import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Header from "../../../app/components/header/header"; // adjust path
import { fetchScholarshipApplicationById } from "../../../app/redux/slices/scholarshipApplicationSlice";
import "../../../pages/styles.css";


const ViewApplication = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  const { selectedApplication, loading, error } = useSelector(
    (state) => state.scholarshipApplicationList
  );

  const [applicationData, setApplicationData] = useState(null);

  useEffect(() => {
    if (id) dispatch(fetchScholarshipApplicationById(id));
  }, [id, dispatch]);

  useEffect(() => {
    if (selectedApplication) setApplicationData(selectedApplication);
  }, [selectedApplication]);

  const handleBack = () => {
    window.history.back();
  };

  const getAge = (dob) => {
    if (!dob) return "N/A";
    const birthDate = new Date(dob);
    const diff = Date.now() - birthDate.getTime();
    const ageDate = new Date(diff);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error loading data!</p>;
  if (!applicationData) return <p>No data found</p>;

  const data = applicationData;

  return (
    <div>
      <Header variant="application" />

      {/* Header */}
      <div className="view-app-header">
        <button className="view-app-btn-back" onClick={handleBack}>
          Back
        </button>
        <div>
          <h1>Scholarship Application Preview</h1>
          <p>View all details of the scholarship application.</p>
        </div>
      </div>

      {/* Card Section */}
      <section className="view-app-cards">
        <div className="view-app-card">
          <h3>Personal Details</h3>
          <p>
            <strong>Full Name:</strong> {data.firstName} {data.lastName}
          </p>
          <p>
            <strong>Email:</strong> {data.email}
          </p>
          <p>
            <strong>Phone:</strong> {data.phoneNumber}
          </p>
          <p>
            <strong>Gender:</strong> {data.gender}
          </p>
          <p>
            <strong>Age:</strong> {getAge(data.dateOfBirth)}
          </p>

          <h3>Scholarship Details</h3>
          <p>
            <strong>Scholarship Name:</strong> {data.scholarshipName}
          </p>
          <p>
            <strong>Category:</strong> {data.category}
          </p>
          <p>
            <strong>Status:</strong> {data.status}
          </p>
          <p>
            <strong>Application Date:</strong>{" "}
            {new Date(data.applicationDate).toLocaleDateString()}
          </p>

          <h3>Education Details</h3>
          <p>
            <strong>Study Level:</strong> {data.studyLevel}
          </p>
          <p>
            <strong>School Name:</strong> {data.schoolName || "N/A"}
          </p>
          <p>
            <strong>Course / Major:</strong> {data.courseOrMajor || "N/A"}
          </p>
          <p>
            <strong>Year of Study:</strong> {data.yearOfStudy || "N/A"}
          </p>
          <p>
            <strong>GPA / Marks:</strong> {data.gpaOrMarks || "N/A"}
          </p>

          <h3>Additional Information</h3>
          <p>
            <strong>Extra Curricular Activities:</strong>{" "}
            {data.extraCurricularActivities || "N/A"}
          </p>
          <p>
            <strong>Awards & Achievements:</strong>{" "}
            {data.awardsAchievements || "N/A"}
          </p>
          <p>
            <strong>Notes / Comments:</strong> {data.notesComments || "N/A"}
          </p>

          <h3>Uploaded Documents</h3>
          {data.files && data.files.length > 0 ? (
            <ul>
              {data.files.map((file, i) => (
                <li key={i}>
                  <a
                    href={`file://${data.filePath}/${file}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {file}
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <p>No files uploaded</p>
          )}
        </div>
      </section>
    </div>
  );
};

export default ViewApplication;
