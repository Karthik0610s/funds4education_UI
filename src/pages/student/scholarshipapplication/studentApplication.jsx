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
const statusIcon = {
  draft: "fa-regular fa-file-lines",
  approved: "fa-solid fa-circle-check",
  submitted: "fa-regular fa-paper-plane",
  rejected: "fa-solid fa-circle-xmark",
};

const statusLabel = {
  draft: "Draft",
  approved: "Approved",
  submitted: "Submitted",
  rejected: "Rejected",
};

const statusColor = {
  draft: "#d6c581ff",
  approved: "#006400",
  submitted: "#1e40af",
  rejected: "red",
};
const [currentPage, setCurrentPage] = useState(1);
const ITEMS_PER_PAGE = 5;
  const totalPages = Math.ceil(displayedApps.length / ITEMS_PER_PAGE);

  const paginatedApps = displayedApps.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

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
     <>
    <table className="applications-table">
      <thead>
        <tr>
          <th>S.No</th>
          <th>Name</th>
          <th>Applied By</th>
          <th>Date</th>
          <th>Status / Actions</th>
        </tr>
      </thead>

      <tbody>
        {paginatedApps.map((app, index) => (
          <tr key={app.id}>

            {/* S.No */}
            <td data-label="S.No">{index + 1}</td>

            {/* Name */}
            <td data-label="Name">{app.scholarshipName}</td>

            {/* Applied By */}
            <td data-label="Applied By">
              {app.firstName} {app.lastName}
            </td>

            {/* Date */}
            <td data-label="Date">
              {new Date(app.applicationDate).toLocaleDateString("en-IN", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </td>

            {/* STATUS + ACTIONS */}
            <td
              data-label="Status / Actions"
             
              style={{
               
                alignItems: "center",
                gap: "14px",
              }}
            >
  <div className="actions-container">
              {/* STATUS ICON */}
              <span
                className="status-icon"
                style={{
                  color:
                    app.status.toLowerCase() === "approved"
                      ? "#006400"
                      : app.status.toLowerCase() === "submitted"
                      ? "#1e40af"
                      : app.status.toLowerCase() === "draft"
                      ? "#d6c581ff"
                      : app.status.toLowerCase() === "rejected"
                      ? "red"
                      : "black",
                  fontSize: "16px",
                  cursor: "pointer",
                  position: "relative",
                }}
                onMouseEnter={(e) => {
                  const tip = document.createElement("div");
                  tip.innerText = app.status.charAt(0).toUpperCase() + app.status.slice(1);
                  tip.style.position = "absolute";
                  tip.style.bottom = "120%";
                  tip.style.left = "50%";
                  tip.style.transform = "translateX(-50%)";
                  tip.style.background = "#111827";
                  tip.style.color = "#fff";
                  tip.style.padding = "6px 10px";
                  tip.style.fontSize = "16px";
                  tip.style.borderRadius = "6px";
                  tip.style.whiteSpace = "nowrap";
                  tip.style.zIndex = 2000;
                  tip.style.pointerEvents = "none";
                  tip.className = "custom-tooltip";
                  e.currentTarget.appendChild(tip);
                }}
                onMouseLeave={(e) => {
                  const tip = e.currentTarget.querySelector(".custom-tooltip");
                  if (tip) tip.remove();
                }}
              >
                <i
                  className={
                    app.status.toLowerCase() === "approved"
                      ? "fa-solid fa-circle-check"
                      : app.status.toLowerCase() === "submitted"
                      ? "fa-regular fa-paper-plane"
                      : app.status.toLowerCase() === "draft"
                      ? "fa-regular fa-file-lines"
                      : "fa-solid fa-circle-xmark"
                  }
                ></i>
              </span>

              {/* --- EDIT BUTTON --- */}
              <button
                className="icons-btn edit"
                onClick={() => handleEdit(app)}
                style={{
                  color: "orange",
                  fontSize: "16px",
                  cursor: "pointer",
                  background: "transparent",
                  border: "none",
                }}
              >
                <i className="fa-regular fa-pen-to-square"></i>
              </button>

              {/* --- DELETE BUTTON --- */}
              <button
                className="icons-btn delete"
                onClick={() => handleDelete(app.id)}
                style={{
                  color: "red",
                  fontSize: "16px",
                  cursor: "pointer",
                  background: "transparent",
                  border: "none",
                }}
              >
                <i className="fa-solid fa-trash"></i>
              </button>
</div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
   
          <div className="pagination">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => prev - 1)}
            >
              Prev
            </button>
            <span>{currentPage} / {totalPages}</span>
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((prev) => prev + 1)}
            >
              Next
            </button>
          </div>
          </>
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
