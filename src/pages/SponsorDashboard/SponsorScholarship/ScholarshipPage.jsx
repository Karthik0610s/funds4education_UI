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
  const [modalMode, setModalMode] = useState("view");

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
  const openModal = (scholarship, mode) => {
  setSelectedScholarship(scholarship);
  setModalMode(mode);
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
      <Header variant="sponsor-profile" />

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
                  onClick={() => openModal(null, "add")}> + Add New Scholarship</button>

                </div>
              </div>

              {/* TABLE */}
<div className="scholarship-table">
  <div className="table-header">
    <span>S.No</span>
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
    paginatedScholarships.map((scholarship, index) => (
<div className="table-row" key={scholarship.id}>
        {/* S.No */}
        <span data-label="S.No">{(index + 1) + (currentPage - 1) * ITEMS_PER_PAGE}</span>

        {/* Title */}
       <span
  className="title"
  style={{ position: "relative", cursor: "pointer" }}
  onMouseEnter={(e) => {
    const tip = document.createElement("div");
    tip.innerText = scholarship.scholarshipName;
    tip.style.position = "absolute";
    tip.style.bottom = "120%";
    tip.style.left = "50%";
    tip.style.transform = "translateX(-50%)";
    tip.style.background = "#111827";
    tip.style.color = "#fff";
    tip.style.padding = "6px 10px";
    tip.style.fontSize = "11px";
    tip.style.borderRadius = "6px";
    tip.style.width = "220px";       // ✅ wider tooltip
  tip.style.maxWidth = "260px";    // optional safe limit
  tip.style.whiteSpace = "normal";
  tip.style.wordBreak = "break-word";
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
  {scholarship.scholarshipName?.slice(0, 25) +
    (scholarship.scholarshipName?.length > 25 ? "..." : "")
  }
</span>


        {/* Amount */}
      <span
  style={{ position: "relative", cursor: "pointer" }}
  onMouseEnter={(e) => {
    const tip = document.createElement("div");
    tip.innerText = scholarship.benefits;
    tip.style.position = "absolute";
    tip.style.bottom = "120%";
    tip.style.left = "50%";
    tip.style.transform = "translateX(-50%)";
    tip.style.background = "#111827";
    tip.style.color = "#fff";
    tip.style.padding = "6px 10px";
    tip.style.fontSize = "11px";
    tip.style.borderRadius = "6px";
   tip.style.width = "220px";       // ✅ wider tooltip
  tip.style.maxWidth = "260px";    // optional safe limit
  tip.style.whiteSpace = "normal";
  tip.style.wordBreak = "break-word";
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
  {scholarship.benefits?.slice(0, 20) +
    (scholarship.benefits?.length > 20 ? "..." : "")
  }
</span>



        {/* Scholarship Limit */}
        <span>{scholarship.scholarshipLimit ?? "-"}</span>

        {/* Status */}
        <span>
          <span className={`status ${scholarship.status?.toLowerCase()}`}>
            {scholarship.status}
          </span>
        </span>

        {/* Deadline */}
        <span>
          {scholarship.endDate ? scholarship.endDate.split("T")[0] : "-"}
        </span>

        <span className="actions-buttons">
          <div className="actions">

 <button className="icon-btn" onClick={() => openModal(scholarship, "view")}>
  <i className="fa fa-eye"></i>
</button>


 <button className="icon-btn edit" onClick={() => openModal(scholarship, "edit")}>
  <i className="fa fa-pencil"></i>
</button>

  <button className="icon-btn delete" onClick={() => handleDelete(scholarship.id)}>
    <i className="fa fa-trash"></i>
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
   scholarship={selectedScholarship}
   mode={modalMode}    // <-- Add this
/>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ScholarshipPage;
