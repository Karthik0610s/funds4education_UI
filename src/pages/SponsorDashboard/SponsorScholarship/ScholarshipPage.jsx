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
                    onClick={handleAddScholarship}
                  >
                    + New Scholarship
                  </button>
                </div>
              </div>

              {/* TABLE */}
<section className="applications-cards">

  <table className="applications-table">
    <thead>
      <tr>
        <th>S.No</th>
        <th>Title</th>
        <th>Amount</th>
        <th>Scholarship Limit</th>
        <th>Status</th>
        <th>Deadline</th>
        <th>Actions</th>
      </tr>
    </thead>

    <tbody>
      {loading ? (
        <tr>
          <td colSpan="7" style={{ textAlign: "center" }}>
            Loading scholarships...
          </td>
        </tr>
      ) : paginatedScholarships.length > 0 ? (
        paginatedScholarships.map((sch, index) => (
          <tr key={sch.id}>

            {/* S.No */}
            <td data-label="S.No">
              {(currentPage - 1) * ITEMS_PER_PAGE + index + 1}
            </td>

            {/* Title */}
            <td
              data-label="Title"
              style={{ position: "relative", cursor: "pointer" }}
              onMouseEnter={(e) => {
                const tip = document.createElement("div");
                tip.innerText = sch.scholarshipName;
                tip.className = "custom-tooltip";
                Object.assign(tip.style, {
                  position: "absolute",
                  bottom: "120%",
                  left: "50%",
                  transform: "translateX(-50%)",
                  background: "#111827",
                  color: "#fff",
                  padding: "6px 10px",
                  fontSize: "12px",
                  borderRadius: "6px",
                  width: "220px",
                  whiteSpace: "normal",
                  wordBreak: "break-word",
                  zIndex: 2000,
                });
                e.currentTarget.appendChild(tip);
              }}
              onMouseLeave={(e) => {
                const tip = e.currentTarget.querySelector(".custom-tooltip");
                if (tip) tip.remove();
              }}
            >
        {/* DESKTOP (>800px) - 125 chars */}
<span className="title-desktop">
  {sch.scholarshipName?.slice(0, 125)}
  {sch.scholarshipName.length > 125 ? "..." : ""}
</span>

{/* TABLET (500–800px) - 180 chars */}
<span className="title-tablet">
  {sch.scholarshipName?.slice(0, 180)}
  {sch.scholarishmentName?.length > 180 ? "..." : ""}
</span>

{/* MOBILE (<500px) - 50 chars */}
<span className="title-mobile">
  {sch.scholarshipName?.slice(0, 50)}
  {sch.scholarshipName.length > 50 ? "..." : ""}
</span>

            </td>

            {/* Amount */}
            <td
              data-label="Amount"
              style={{ position: "relative", cursor: "pointer" }}
              onMouseEnter={(e) => {
                const tip = document.createElement("div");
                tip.innerText = sch.benefits;
                tip.className = "custom-tooltip";
                Object.assign(tip.style, {
                  position: "absolute",
                  bottom: "120%",
                  left: "50%",
                  transform: "translateX(-50%)",
                  background: "#111827",
                  color: "#fff",
                  padding: "6px 10px",
                  fontSize: "12px",
                  borderRadius: "6px",
                  width: "220px",
                  whiteSpace: "normal",
                  wordBreak: "break-word",
                  zIndex: 2000,
                });
                e.currentTarget.appendChild(tip);
              }}
              onMouseLeave={(e) => {
                const tip = e.currentTarget.querySelector(".custom-tooltip");
                if (tip) tip.remove();
              }}
            >
                   
        {/* DESKTOP (>800px) - 125 chars */}
<span className="title-desktop">
  {sch.benefits?.slice(0, 105)}
  {sch.benefits.length > 105 ? "..." : ""}
</span>

{/* TABLET (500–800px) - 180 chars */}
<span className="title-tablet">
  {sch.benefits?.slice(0, 180)}
  {sch.benefits?.length > 180 ? "..." : ""}
</span>

{/* MOBILE (<500px) - 50 chars */}
<span className="title-mobile">
  {sch.benefits?.slice(0, 50)}
  {sch.benefits.length > 50 ? "..." : ""}
</span>
              
            </td>

            {/* Scholarship Limit */}
            <td data-label="Scholarship Limit">
              {sch.scholarshipLimit ?? "-"}
            </td>

            {/* Status */}
            <td data-label="Status">
              <span className={`status ${sch.status?.toLowerCase()}`}>
                {sch.status}
              </span>
            </td>

            {/* Deadline */}
            <td data-label="Deadline">
              {sch.endDate ? sch.endDate.split("T")[0] : "-"}
            </td>

            {/* ACTIONS (same as applications section) */}
            <td data-label="Status / Actions">
              <div className="actions-container">

                {/* VIEW */}
                <button
                  className="icons-btn view"
                  onClick={() => console.log("view")}
                  style={{
                    color: "#1e40af",
                    background: "transparent",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  <i className="fa-regular fa-eye"></i>
                </button>

                {/* EDIT */}
                <button
                  className="icons-btn edit"
                  onClick={() => handleEdit(sch)}
                  style={{
                    color: "orange",
                    background: "transparent",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  <i className="fa-regular fa-pen-to-square"></i>
                </button>

                {/* DELETE */}
                <button
                  className="icons-btn delete"
                  onClick={() => handleDelete(sch.id)}
                  style={{
                    color: "red",
                    background: "transparent",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  <i className="fa-solid fa-trash"></i>
                </button>

              </div>
            </td>

          </tr>
        ))
      ) : (
        <tr>
          <td colSpan="7" className="applications-no-results">
            No scholarships found for <strong>{filter}</strong>.
          </td>
        </tr>
      )}
    </tbody>
  </table>

  {/* PAGINATION */}
  <div className="pagination">
    <button disabled={currentPage === 1} onClick={() => setCurrentPage(prev => prev - 1)}>
      Prev
    </button>

    <span>{currentPage} / {totalPages}</span>

    <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(prev => prev + 1)}>
      Next
    </button>
  </div>

</section>



              {/* PAGINATION 
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
              )}*/}

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
