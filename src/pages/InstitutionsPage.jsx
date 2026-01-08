import React, { useEffect, useState } from "react";
import Header from "../app/components/header/header";
import { useDispatch, useSelector } from "react-redux";
import { publicAxios } from "../api/config";
import { ApiKey } from "../api/endpoint";
import { useNavigate } from "react-router-dom";
import "../pages/styles.css";
import {
  fetchInstitutionList,
  fetchStates,
  fetchDistricts,
  fetchLocations,
  fetchCollegeTypes,
  fetchManagements,
} from "../app/redux/slices/InstitutionlistSlice";
import { FaFilter } from "react-icons/fa";
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
    collegeTypes,
    managements,
    totalCount,
  } = useSelector((state) => state.institutionList);
const [showFilter, setShowFilter] = useState(false);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
 
  const [filters, setFilters] = useState({
    state: "",
    district: "",
    location: "",
    collegeType: "",
    management: "",
  });

  const ITEMS_PER_PAGE = 5;

  useEffect(() => {
    dispatch(
      fetchInstitutionList({
        page: currentPage,
        pageSize: ITEMS_PER_PAGE,
        search,
        state: filters.state,
        district: filters.district,
        location: filters.location,
        collegeType: filters.collegeType,
        management: filters.management,
      })
    );
  }, [dispatch, currentPage, search, filters]);

  useEffect(() => {
    dispatch(fetchStates());
    dispatch(fetchLocations());
    dispatch(fetchCollegeTypes());
    dispatch(fetchManagements());
  }, [dispatch]);

  useEffect(() => {
    if (filters.state) dispatch(fetchDistricts(filters.state));
  }, [filters.state]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, filters]);

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
      collegeType: "",
      management: "",
    });
    setSearch("");
  };

  const handleDownloadTemplate = async () => {
    const response = await publicAxios.get(ApiKey.DOWNLOAD_COLLEGE_TEMPLATE, {
      responseType: "blob",
    });

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
    dispatch(fetchInstitutionList());
    e.target.value = "";
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
    placeholder="Search by institution, location, management..."
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


        <section className="list-container">
          {loading && <p>Loading institutions...</p>}
         {/* {error && <p style={{ color: "red" }}>Failed to load institutions</p>} */}
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
                <p><strong>Location:</strong> {inst.location}</p>
                <p><strong>College Type:</strong> {inst.collegeType}</p>
              </div>
            </div>
          ))}

       <div className="pagination">
  <button disabled={currentPage <= 1} onClick={() => setCurrentPage(p => p - 1)}>
    Prev
  </button>

  <span>Page {currentPage} of {totalPages}</span>

  <button disabled={currentPage >= totalPages} onClick={() => setCurrentPage(p => p + 1)}>
    Next
  </button>
</div>

        </section>
      </div>
    </div>
  );
}
