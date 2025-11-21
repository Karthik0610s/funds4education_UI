import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Header from "../../../app/components/header/header";
import {
  fetchScholarshipApplicationListbyStudent,
  deleteScholarshipApplication,
} from "../../../app/redux/slices/scholarshipApplicationSlice";
import Swal from "sweetalert2";
import AddApplicationModal from "./addApplication"; // <-- your modal component
import { useLocation } from "react-router-dom";
const ApplicationsPage = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  // Redux state
  const { data: applications = [], loading = false } =
    useSelector((state) => state.scholarshipApplicationList || {});

  const [filter, setFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const studentId = localStorage.getItem("userId");

  useEffect(() => {
    debugger;
    dispatch(fetchScholarshipApplicationListbyStudent(studentId));
  }, [dispatch, studentId]);

  // Filtered applications based on status
  const filteredApps =
    filter === "All"
      ? applications
      : applications.filter(
        (app) => app.status.toLowerCase() === filter.toLowerCase()
      );

  // Filter further by search query
  const displayedApps = filteredApps.filter((app) =>
    app.scholarshipName?.toLowerCase().includes(searchQuery.toLowerCase())
  );
  useEffect(() => {
    // ✅ Open Add Modal automatically when user came from Apply Now
    if (location.state?.openAddModal) {
      setSelectedApplication(null);
      setShowModal(true);
    }
  }, [location.state]);
  // Open modal in Add mode
  const handleAddApplication = () => {
    setSelectedApplication(null);
    setShowModal(true);

  };

  // Open modal in Edit mode
  const handleEdit = (app) => {
    setSelectedApplication(app);
    setShowModal(true);
  };

  // Delete application
  const handleDelete = (appId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This application will be deleted permanently!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        await deleteScholarshipApplication(appId, studentId, dispatch);
        Swal.fire("Deleted!", "Application has been deleted.", "success");
        // dispatch(fetchScholarshipApplicationListbyStudent());
      }
    });
  };

  // After modal submit
  const handleModalSubmit = () => {
    setShowModal(false);
    setSelectedApplication(null);
    dispatch(fetchScholarshipApplicationListbyStudent());
  };

  return (
    <div>
      <Header variant="application" />
      <div className="applications-header">
        <h1 className="applications-title pt-5">My Scholarship Applications</h1>
        <p className="applications-subtitle">
          Track your scholarship applications and <br /> filter by status.
        </p>
      </div>

      {/* Actions */}
      <div className="applications-actions">
        <input
          type="text"
          placeholder="Search by name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="applications-filter"
        >
          <option value="All">All</option>
          <option value="Submitted">Submitted</option>
          <option value="In Review">In Review</option>
          <option value="Rejected">Rejected</option>
          <option value="Approved">Approved</option>
          <option value="Draft">Draft</option>
        </select>

        <button className="applications-btn-new" onClick={handleAddApplication}>
          + New Application
        </button>
      </div>

      {/* Applications List */}
      <section className="applications-cards">
        {displayedApps.length > 0 ? (
          displayedApps.map((app) => (
            <div key={app.id} className="applications-card">
              <div className="application-info">
                <h3>Scholarship: {app.scholarshipName}</h3>
                <span>
                  {app.firstName} {app.lastName}
                </span>
                <p>
                  {new Date(app.applicationDate).toLocaleDateString("en-IN", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </p>
              </div>

              {app.status.toLowerCase() === "draft" ? (
                <div className="application-actions-schl">
                  <span className={`applications-status ${app.status.toLowerCase()}`}>
                    {app.status}
                  </span>
                  <button
                    className="applications-btn-edit"
                    onClick={() => handleEdit(app)}
                  >
                    Edit
                  </button>
                  <button
                    className="applications-btn-delete"
                    onClick={() => handleDelete(app.id)}
                  >
                    Delete
                  </button>
                </div>
              ) : (
                <span className={`applications-status ${app.status.toLowerCase()}`}>
                  {app.status}
                </span>
              )}
            </div>
          ))
        ) : (
          <p className="applications-no-results">
            No applications found for <strong>{filter}</strong>.
          </p>
        )}
      </section>

      <AddApplicationModal
        show={showModal}
        handleClose={() => setShowModal(false)}
        onSubmit={handleModalSubmit}
        application={selectedApplication}
      />
    </div>

  );
};

export default ApplicationsPage;
