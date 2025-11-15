import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  FaGraduationCap,
  FaMoneyBillWave,
  FaCalendarAlt,
  FaUsers,
} from "react-icons/fa";
import Swal from "sweetalert2";
import Header from "../../../app/components/header/header";
import {
  fetchScholarshipBySponsor,
  deleteScholarship,
} from "../../../app/redux/slices/sponsorscholarshipSlice";
import AddScholarshipModal from "./AddScholarshipPage";
import "../../styles.css";

const ScholarshipPage = () => {
  const dispatch = useDispatch();

  // ✅ Correct slice name
  const { data, loading = false } = useSelector(
    (state) => state.sponsorScholarship || {}
  );

  // ✅ Ensure data is always an array
  const scholarships = Array.isArray(data) ? data : [];
  console.log("Redux data:", data);
  console.log("Scholarships array:", scholarships);

  const role = localStorage.getItem("roleName");
  const UserId = localStorage.getItem("userId");

  const [filter, setFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedScholarship, setSelectedScholarship] = useState(null);

 useEffect(() => {
  if (UserId && role) {
    dispatch(fetchScholarshipBySponsor(UserId, role))
  }
}, [UserId, role, dispatch]);
  // ✅ Filter and search logic
  const filteredScholarships =
    filter === "All"
      ? scholarships
      : scholarships.filter(
          (s) => s.status?.toLowerCase() === filter.toLowerCase()
        );

  const displayedScholarships = filteredScholarships.filter((s) =>
    s.scholarshipName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddScholarship = () => {
    setSelectedScholarship(null);
    setShowModal(true);
  };

  const handleEdit = (scholarship) => {
    debugger;
    setSelectedScholarship(scholarship);
    setShowModal(true);
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This scholarship will be deleted permanently!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        const modifiedBy = localStorage.getItem("userId");
        dispatch(deleteScholarship(id, modifiedBy));
      }
    });
  };

 const handleModalSubmit = () => {
  setShowModal(false);
  setSelectedScholarship(null);

  // Dispatch the fetch action to reload scholarships
  if (UserId && role) {
    dispatch(fetchScholarshipBySponsor(UserId, role));
  }
};

  return (
  <>
    <Header variant="scholarship" />

    <div className="scholarship-page">
      <h2 className="page-title">My Sponsored Scholarships</h2>
      <p className="page-subtitle">
        Manage your scholarships and filter them by status or title.
      </p>

      <div className="scholarship-actions">
        <input
          type="text"
          placeholder="Search by title..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ padding: "0.5rem", width: "200px" }}
        />

        <div className="scholarship-actions-right">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="applications-filter"
          >
            <option value="All">All</option>
            <option value="Active">Active</option>
            <option value="Closed">Closed</option>
          </select>

          <button
            className="applications-btn-new"
            onClick={handleAddScholarship}
          >
            + New Scholarship
          </button>
        </div>
      </div>

      <div className="scholarship-table">
        <div className="table-header">
          <span>Title</span>
          <span>Amount</span>
          <span>Scholarship Limit</span>
          <span>Status</span>
          <span>Deadline</span>
          <span>Actions</span>
        </div>

        {loading ? (
          <p className="loading-text">Loading scholarships...</p>
        ) : displayedScholarships.length > 0 ? (
          displayedScholarships.map((scholarship) => (
            <div key={scholarship.id} className="table-row">
              <span className="title" data-label="Title">
                {/* <FaGraduationCap className="icon" />{" "} */}
                {scholarship.scholarshipName || "N/A"}
              </span>

              <span data-label="Amount">
                {/* <FaMoneyBillWave className="icon" /> $ */}
                {scholarship.benefits ?? "0"}
              </span>

              <span data-label="Scholarship Limit">
                {/* <FaUsers className="icon" />{" "} */}
                {scholarship.scholarshipLimit ?? "-"}
              </span>

              <span data-label="Status">
                <span
                  className={`status ${
                    scholarship.status?.toLowerCase() || ""
                  }`}
                >
                  {scholarship.status || "N/A"}
                </span>
              </span>

              <span data-label="Deadline">
                {scholarship.endDate ? scholarship.endDate.split("T")[0] : "-"}
              </span>

             <span className="actions" data-label="Actions">
  <div className="actions-buttons">
    <button className="btn-view">View</button>
    <button className="btn-edit" onClick={() => handleEdit(scholarship)}>
      Edit
    </button>
    <button className="btn-danger" onClick={() => handleDelete(scholarship.id)}>
      Delete
    </button>
  </div>
</span>
            </div>
          ))
        ) : (
          <p className="applications-no-results">
            No scholarships found for <strong>{filter}</strong>.
          </p>
        )}
      </div>

      <AddScholarshipModal
        show={showModal}
        handleClose={() => setShowModal(false)}
        onSubmit={handleModalSubmit}
        scholarship={selectedScholarship}
      />
    </div>
  </>
);


};

export default ScholarshipPage;
