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

  /*const displayedScholarships = filteredScholarships.filter((s) =>
    s.scholarshipName?.toLowerCase().includes(searchQuery.toLowerCase())
  );*/
  const extractAmount = (amountText) => {
  if (!amountText) return 0;

  // Remove ₹ , commas, text → keep only numbers
  const match = amountText.replace(/,/g, "").match(/\d+/);
  return match ? parseInt(match[0], 10) : 0;
};
 const displayedScholarships = filteredScholarships.filter((s) => {
  const query = searchQuery.toLowerCase();

  const nameMatch =
    s.scholarshipName?.toLowerCase().includes(query);

  const statusMatch =
    s.status?.toLowerCase().includes(query);

  // 🔥 Amount match (₹20,000, 20000, 20k)
  const amountNumber = extractAmount(s.amount);
  const amountMatch =
    s.benefits?.toLowerCase().includes(query) ||
    amountNumber.toString().includes(query);

  const endDateMatch =
    s.endDate
      ? s.endDate.split("T")[0].includes(query)
      : false;

  return nameMatch || statusMatch || amountMatch || endDateMatch;
});



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
const useResponsiveSlice = () => {
  const getSliceLen = () => {
    const width = window.innerWidth;

    if (width <= 767) return 40;                 // Mobile
    if (width === 768 ) return 180;
   // if(width>769) return 10;// Tablet
    if (width > 769 && width === 1024) return 15;            // Exact 1024
    if (width >= 1280) return 20;                // Desktop

    return 20; // Fallback
  };

  const [sliceLen, setSliceLen] = useState(getSliceLen());

  useEffect(() => {
    const handleResize = () => setSliceLen(getSliceLen());
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return sliceLen;
};
const sliceLen = useResponsiveSlice();
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
<section className="applications-cards">

  <table className="applications-table">
    <thead>
      <tr>
        <th>S.No</th>
        <th>Scholarship Name</th>
        <th>Scholarship Amount</th>
        {/* <th>Scholarship Limit</th> */}
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
{/*<td data-label="Title" className="tooltip-cell">

  
  <span className="tooltip-text">
    {sch.scholarshipName}
  </span>

  
  <span className="title-desktop">
    {sch.scholarshipName?.slice(0, 12)}
    {sch.scholarshipName?.length > 12? "..." : ""}
  </span>

  
  <span className="title-tablet">
    {sch.scholarshipName?.slice(0, 180)}
    {sch.scholarshipName?.length > 180 ? "..." : ""}
  </span>


  <span className="title-mobile">
    {sch.scholarshipName?.slice(0, 40)}
    {sch.scholarshipName?.length > 40 ? "..." : ""}
  </span>

</td>*/}
<td data-label="Title" className="tooltip-cell">
      <span className="tooltip-text">{sch.benefits}</span>

      <span>
        {sch.scholarshipName?.slice(0, sliceLen)}
        {sch.scholarshipName?.length > sliceLen ? "..." : ""}
      </span>
    </td>


            {/* Amount */}
          {/* Amount */}
<td data-label="Amount" className="tooltip-cell">
      <span className="tooltip-text">{sch.benefits}</span>

      <span>
        {sch.benefits?.slice(0, sliceLen)}
        {sch.benefits?.length > sliceLen ? "..." : ""}
      </span>
    </td>


            {/* Scholarship Limit */}
            {/* <td data-label="Scholarship Limit">
              {sch.scholarshipLimit ?? "-"}
            </td> */}

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
                  onClick={() => openModal(sch, "view")}
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
              <button className="icon-btn edit" onClick={() => openModal(sch, "edit")}>
  <i className="fa fa-pencil"></i>
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
{displayedScholarships.length > 0 && totalPages > 1 && (
  <div className="pagination">
    <button
      disabled={currentPage === 1}
      onClick={() => setCurrentPage((prev) => prev - 1)}
    >
      Prev
    </button>

    <span>
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
