import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";
import Header from "../../../app/components/header/header";
import {
  fetchScholarshipBySponsor,
  deleteScholarship,
} from "../../../app/redux/slices/sponsorscholarshipSlice";
import AddScholarshipModal from "./AddScholarshipPage";
import "../../styles.css";
import SponsorLayout from "../../../pages/SponsorDashboard/SponsorLayout";
import { logout } from "../../../app/redux/slices/authSlice";
import { useNavigate } from "react-router-dom";

const ScholarshipPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { data, loading = false } = useSelector(
    (state) => state.sponsorScholarship || {}
  );

  const scholarships = Array.isArray(data) ? data : [];
  const name = localStorage.getItem("name") || "Sponsor";

  const role = localStorage.getItem("roleName");
  const UserId = localStorage.getItem("userId");

  // Filters & search
  const [filter, setFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  // Modal
  const [showModal, setShowModal] = useState(false);
  const [selectedScholarship, setSelectedScholarship] = useState(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 5;

  // Logout
  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  // Load scholarships
  useEffect(() => {
    if (UserId && role) {
      dispatch(fetchScholarshipBySponsor(UserId, role));
    }
  }, [UserId, role, dispatch]);

  // Filter + search logic
  const filteredScholarships =
    filter === "All"
      ? scholarships
      : scholarships.filter(
          (s) => s.status?.toLowerCase() === filter.toLowerCase()
        );

  const displayedScholarships = filteredScholarships.filter((s) =>
    s.scholarshipName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Pagination logic
  const totalPages = Math.ceil(displayedScholarships.length / ITEMS_PER_PAGE);

  const paginatedScholarships = displayedScholarships.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Handlers
  const handleAddScholarship = () => {
    setSelectedScholarship(null);
    setShowModal(true);
  };

  const handleEdit = (scholarship) => {
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

    if (UserId && role) {
      dispatch(fetchScholarshipBySponsor(UserId, role));
    }
  };

  return (
    <>
      <Header variant="scholarship" />

      <div className="page-split">

        {/* LEFT SIDEBAR */}
        <div className="left-container">
          <SponsorLayout name={name} handleLogout={handleLogout} />
        </div>

        {/* RIGHT MAIN */}
        <div className="right-container">

          <div className="mobile-sponsor">
            <SponsorLayout name={name} handleLogout={handleLogout} />
          </div>

          <div className="container">
            <div className="scholarship-page mt-5">
              <h2 className="page-title mt-5">My Sponsored Scholarships</h2>
              <p className="page-subtitle">
                Manage your scholarships and filter them by status or title.
              </p>

              {/* SEARCH & FILTER */}
              <div className="scholarship-actions">
                <input
                  type="text"
                  placeholder="Search by title..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  style={{ padding: "0.5rem", width: "200px" }}
                />

                <div className="scholarship-actions-right">
                  <select
                    value={filter}
                    onChange={(e) => {
                      setFilter(e.target.value);
                      setCurrentPage(1);
                    }}
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

              {/* TABLE */}
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
                ) : paginatedScholarships.length > 0 ? (
                  paginatedScholarships.map((scholarship) => (
                    <div key={scholarship.id} className="table-row">
                      <span className="title">{scholarship.scholarshipName}</span>
                      <span>{scholarship.benefits ?? "0"}</span>
                      <span>{scholarship.scholarshipLimit ?? "-"}</span>

                      <span>
                        <span
                          className={`status ${scholarship.status?.toLowerCase()}`}
                        >
                          {scholarship.status}
                        </span>
                      </span>

                      <span>
                        {scholarship.endDate
                          ? scholarship.endDate.split("T")[0]
                          : "-"}
                      </span>

                      <span className="actions">
                        <div className="actions-buttons">
                          <button className="btn-view">View</button>
                          <button
                            className="btn-edit"
                            onClick={() => handleEdit(scholarship)}
                          >
                            Edit
                          </button>
                          <button
                            className="btn-danger"
                            onClick={() => handleDelete(scholarship.id)}
                          >
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

              {/* PAGINATION */}
              {displayedScholarships.length > 0 && (
                <div className="pagination">
                  <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((prev) => prev - 1)}
                  >
                    Prev
                  </button>

                  <span className="page-indicator">
                    {currentPage} / {totalPages}
                  </span>

                  <button
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage((prev) => prev + 1)}
                  >
                    Next
                  </button>
                </div>
              )}

              {/* MODAL */}
              <AddScholarshipModal
                show={showModal}
                handleClose={() => setShowModal(false)}
                onSubmit={handleModalSubmit}
                scholarship={selectedScholarship}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ScholarshipPage;
