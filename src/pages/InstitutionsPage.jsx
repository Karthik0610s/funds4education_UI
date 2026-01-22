import React, { useEffect, useState } from "react";
import Header from "../app/components/header/header";
import { useDispatch, useSelector } from "react-redux";
import { publicAxios } from "../api/config";
import { ApiKey } from "../api/endpoint";
import { useNavigate } from "react-router-dom";
import "../pages/styles.css";
import { FaFilter } from "react-icons/fa";
import { useSearchParams } from "react-router-dom";


import {
  fetchInstitutionList,
  fetchStates,
  fetchDistricts,
  fetchLocations,
  fetchCollegeTypes,
  fetchCollege,
  fetchManagements,
} from "../app/redux/slices/InstitutionlistSlice";
export default function InstitutionsPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    institutions,
    loading,
    error,
    states,
    districts,
    locations,
    colleges,
    collegeTypes,
    managements,
    totalCount,
  } = useSelector((state) => state.institutionList);
const [showFilter, setShowFilter] = useState(false);
 // const [search, setSearch] = useState("");
 // const [currentPage, setCurrentPage] = useState(1);
 const [searchParams, setSearchParams] = useSearchParams();
const [search, setSearch] = useState(searchParams.get("search") || "");
const [currentPage, setCurrentPage] = useState(
  Number(searchParams.get("page")) || 1
);

  // 1️⃣ MOBILE OVERLAY STATE
  const [showMobileFilter, setShowMobileFilter] = useState(false);
 {/* 
  const [filters, setFilters] = useState({
    state: "",
    district: "",
    location: "",
    college:"",
    collegeType: "",
    management: "",
  });
  */}
const [filters, setFilters] = useState({
  state: searchParams.get("state") || "",
  district: searchParams.get("district") || "",
  location: searchParams.get("location") || "",
  college: searchParams.get("college") || "",
  collegeType: searchParams.get("collegeType") || "",
  management: searchParams.get("management") || "",
});
  const ITEMS_PER_PAGE = 5;

  /* ===== FETCH LIST WITH FILTERS ===== */
  useEffect(() => {
    dispatch(
      fetchInstitutionList({
        page: currentPage,
        pageSize: ITEMS_PER_PAGE,
        search,
        state: filters.state,
        district: filters.district,
        location: filters.location,
        college:filters.college,
        collegeType: filters.collegeType,
        management: filters.management,
      })
    );
  }, [dispatch, currentPage, search, filters]);
   useEffect(() => {
  setSearchParams({
    search,
    page: currentPage,
    ...filters,
  });
}, [search, currentPage, filters]);

  /* ===== LOAD FILTER DATA ===== */
  useEffect(() => {
    dispatch(fetchStates());
    dispatch(fetchLocations());
    dispatch(fetchCollege)
    dispatch(fetchCollegeTypes());
    dispatch(fetchManagements());
  }, [dispatch]);

  useEffect(() => {
    if (filters.state) {
      dispatch(fetchDistricts(filters.state));
    }
  }, [filters.state]);
 {/* 
  useEffect(() => {
    setCurrentPage(1);
  }, [search, filters]);
*/}
  /* ===== HANDLERS ===== */
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE) || 1;

  const clearFilters = () => {
    setFilters({
      state: "",
      district: "",
      location: "",
      college:"",
      collegeType: "",
      management: "",
    });
    setSearch("");
  };

  /* ===== DOWNLOAD / UPLOAD (OPTIONAL) ===== */
  const handleDownloadTemplate = async () => {
    const response = await publicAxios.get(
      ApiKey.DOWNLOAD_COLLEGE_TEMPLATE,
      { responseType: "blob" }
    );

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "CollegeDetails_Template.xlsx");
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  };

  const handleUploadExcel = async (e) => {
    const file = e.target.files[0];
    if (!file || !file.name.endsWith(".xlsx")) return;

    const formData = new FormData();
    formData.append("file", file);

    await publicAxios.post(ApiKey.UPLOAD_COLLEGE_EXCEL, formData);

    // refresh
    dispatch(fetchInstitutionList());
    e.target.value = "";
  };

  const getVideoUrl = (filePath, fileName) => {
    if (!filePath || !fileName) return "";

    const normalized = filePath.replace(/\\/g, "/");

    const index = normalized.indexOf("/VideoContent/");
    if (index === -1) return "";

    let relativePath = normalized.substring(index + "/VideoContent".length);
    relativePath = relativePath.replace(/^\/+/, "");

    const baseUrl = publicAxios.defaults.baseURL.replace(/\/api$/, "");

    const encodedFileName = encodeURIComponent(fileName);
    const url = `${baseUrl}/VideoContent/${relativePath}/${encodedFileName}`;

    console.log("Generated URL:", url);
    return url;
  };

  const formatDate = (date) => {
    const d = new Date(date);
    return `${String(d.getDate()).padStart(2, "0")}-${String(
      d.getMonth() + 1
    ).padStart(2, "0")}-${d.getFullYear()}`;
  };

  return (
    <div >
      <Header />

       <div
    className="mobile-filter-icon"
    onClick={() => setShowFilter(true)}
  >
    <FaFilter />
    <span style={{ marginLeft: "6px" }}>Filters</span>
  </div>
    <div className="top-bar" >
  <input
    className="global-search"
    value={search}
    onChange={(e) => setSearch(e.target.value)}
    placeholder="Search by institution , management..."
  />
  {/* ===== TOP BAR ===== */}
     

  {/* Mobile filter button */}
  
</div>

      {/* ===== MAIN CONTENT ===== */}
      <div className="content-layouts">
        {/* Desktop only */}
<aside className="filter-card desktop-only">
  <div className="filters-title">Filter</div>

  <div className="filter-groups">
    <label>State</label>
    <select name="state" value={filters.state} onChange={handleFilterChange}>
      <option value="">Select State</option>
      {states.map(s => (
        <option key={s.state} value={s.state}>{s.state}</option>
      ))}
    </select>
  </div>

  <div className="filter-groups">
    <label>District</label>
    <select
      name="district"
      value={filters.district}
      onChange={handleFilterChange}
      disabled={!filters.state}
    >
      <option value="">Select District</option>
      {districts.map(d => (
        <option key={d.district} value={d.district}>{d.district}</option>
      ))}
    </select>
  </div>
  {/*
  <div className="filter-groups">
    <label>Location</label>
    <select name="location" value={filters.location} onChange={handleFilterChange}>
      <option value="">Select Location</option>
      {locations.map((l, i) => (
        <option key={i} value={l.location}>{l.location}</option>
      ))}
    </select>
  </div>
*/}
 <div className="filter-groups">
    <label>College Type</label>
    <select name="collegeType" value={filters.college} onChange={handleFilterChange}>
      <option value="">Select College Type</option>
      {colleges?.map(c => (
        <option key={c.college} value={c.college}>{c.college}</option>
      ))}
    </select>
  </div>
  <div className="filter-groups">
    <label>Sub College Type</label>
    <select name="collegeType" value={filters.collegeType} onChange={handleFilterChange}>
      <option value="">Select Sub College Type</option>
      {collegeTypes.map(c => (
        <option key={c.collegeType} value={c.collegeType}>{c.collegeType}</option>
      ))}
    </select>
  </div>

  <div className="filter-groups">
    <label>Management</label>
    <select name="management" value={filters.management} onChange={handleFilterChange}>
      <option value="">Select Management</option>
      {managements.map(m => (
        <option key={m.management} value={m.management}>{m.management}</option>
      ))}
    </select>
  </div>

  <button className="clear-btn" onClick={clearFilters}>
    Clear All Filters
  </button>
</aside>
{showFilter && (
  <div className="mobile-filter-overlay">
    <div className="filter-card mobile-panel">

      {/* Header */}
      <div className="filter-header">
        <span className="filter-title">Filter</span>
        <span
          className="mobile-filter-close"
          onClick={() => setShowFilter(false)}
        >
          ✕
        </span>
      </div>

      {/* Same filters reused */}
      <div className="filter-groups">
        <label>State</label>
        <select name="state" value={filters.state} onChange={handleFilterChange}>
          <option value="">Select State</option>
          {states.map(s => (
            <option key={s.state} value={s.state}>{s.state}</option>
          ))}
        </select>
      </div>

      <div className="filter-groups">
        <label>District</label>
        <select
          name="district"
          value={filters.district}
          onChange={handleFilterChange}
          disabled={!filters.state}
        >
          <option value="">Select District</option>
          {districts.map(d => (
            <option key={d.district} value={d.district}>{d.district}</option>
          ))}
        </select>
      </div>

      <div className="filter-groups">
        <label>Location</label>
        <select name="location" value={filters.location} onChange={handleFilterChange}>
          <option value="">Select Location</option>
          {locations.map((l, i) => (
            <option key={i} value={l.location}>{l.location}</option>
          ))}
        </select>
      </div>

      <div className="filter-groups">
        <label>College Type</label>
        <select name="collegeType" value={filters.collegeType} onChange={handleFilterChange}>
          <option value="">Select College Type</option>
          {collegeTypes.map(c => (
            <option key={c.collegeType} value={c.collegeType}>{c.collegeType}</option>
          ))}
        </select>
      </div>

      <div className="filter-groups">
        <label>Management</label>
        <select name="management" value={filters.management} onChange={handleFilterChange}>
          <option value="">Select Management</option>
          {managements.map(m => (
            <option key={m.management} value={m.management}>{m.management}</option>
          ))}
        </select>
      </div>

      <button className="clear-btn" onClick={clearFilters}>
        Clear All Filters
      </button>
    </div>

    {/* Background overlay */}
    <div
      className="overlay-background"
      onClick={() => setShowFilter(false)}
    />
  </div>
)}


        {/* ===== LIST CONTAINER ===== */}
        <section className="list-container">

          {loading && <p>Loading institutions...</p>}

          {!loading && institutions.length === 0 && (
            <p style={{ color: "#6b7280" }}>No institutions found</p>
          )}

          {institutions.map((inst) => (
            <div
              className="institution-card"
              key={inst.id}
              onClick={() => navigate(`/institution/view/${inst.id}`)}
              style={{ cursor: "pointer" }}
            >
              <div className="card-header">
                <h2>{inst.name}</h2>
              </div>

              <div className="card-details">
                <p>
                  <strong>District:</strong> {inst.district}
                </p>
                <p>
                  <strong>College Type:</strong> {inst.collegeType}
                </p>
              </div>
            </div>
          ))}

          {/* ===== PAGINATION ===== */}
          <div className="pagination">
            <button
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage((p) => p - 1)}
            >
              Prev
            </button>

            <span>
              Page {currentPage} of {totalPages}
            </span>

            <button
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
            >
              Next
            </button>
          </div>

        </section>
      </div>
    </div>
  );
}
