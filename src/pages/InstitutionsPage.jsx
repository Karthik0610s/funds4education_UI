import React, { useEffect, useState } from "react";
//import "../pages/InstitutionsPage.css";
import Header from "../app/components/header/header";
import { useDispatch, useSelector } from "react-redux";
import { publicAxios } from "../api/config";
import { ApiKey } from "../api/endpoint";
import "../pages/styles.css"
import {
  fetchInstitutionList,
  fetchStates,
  fetchDistricts,
  fetchLocations,
  fetchCollegeTypes,
  fetchManagements,
} from "../app/redux/slices/InstitutionlistSlice";

export default function InstitutionsPage() {
  const dispatch = useDispatch();

  const {
    institutions,
    loading,
    error,
    states,
    districts,
    locations,
    collegeTypes,
    managements,
  } = useSelector((state) => state.institutionList);

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
    dispatch(fetchInstitutionList());
    dispatch(fetchStates());
    dispatch(fetchLocations());
    dispatch(fetchCollegeTypes());
    dispatch(fetchManagements());
  }, [dispatch]);

  useEffect(() => {
    if (filters.state) {
      dispatch(fetchDistricts(filters.state));
    }
  }, [filters.state, dispatch]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, filters]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "state" ? { district: "" } : {}),
    }));
  };

  const filteredInstitutions = institutions.filter((inst) => {
    const searchMatch = `${inst.name} ${inst.location} ${inst.collegeType}`
      .toLowerCase()
      .includes(search.toLowerCase());

    return (
      searchMatch &&
      (!filters.state || inst.state === filters.state) &&
      (!filters.district || inst.district === filters.district) &&
      (!filters.location || inst.location === filters.location) &&
      (!filters.collegeType || inst.collegeType === filters.collegeType) &&
      (!filters.management || inst.management === filters.management)
    );
  });

  const totalPages = Math.ceil(filteredInstitutions.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedInstitutions = filteredInstitutions.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

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
    dispatch(fetchInstitutionList());
    e.target.value = "";
  };

  return (
    <div className="page-container">
      <Header />

      {/* ===== TOP BAR ===== */}
      <div className="top-bar">
        <input
          className="global-search"
          placeholder="Search by institution, location, type..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className="top-actions">
          <button className="template-btn" onClick={handleDownloadTemplate}>
            Download Template
          </button>

          <label className="upload-btn">
            Upload
            <input
              type="file"
              accept=".xlsx"
              hidden
              onChange={handleUploadExcel}
            />
          </label>
        </div>
      </div>

      {/* ===== MAIN CONTENT ===== */}
      <div className="content-layouts">
        <aside className="filter-card">
          {/* STATE */}
          <div class="filter-title">Filter</div>
          <div className="filter-groups">
            <label className="filter-label">State</label>
            <select
              name="state"
              value={filters.state}
              onChange={handleFilterChange}
            >
              <option value="">Select State</option>
              {states.map((s, i) => (
                <option
                  key={s.state}
                  value={s.state}
                >
                  {s.state}
                </option>
              ))}
            </select>
          </div>

          {/* DISTRICT */}
          <div className="filter-groups">
            <label className="filter-labels">District</label>
            <select
              name="district"
              value={filters.district}
              onChange={handleFilterChange}
              disabled={!filters.state}
            >
              <option value="">Select District</option>
              {districts.map((d, i) => (
                <option
                  key={d.district}
                  value={d.district}
                >
                  {d.district}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-groups">
            <label className="filter-labels">Location</label>
            <select
              name="location"
              value={filters.location}
              onChange={handleFilterChange}
            >
              <option value="">Select Location</option>
              {locations.map((loc, i) => (
                <option key={i} value={loc.location}>
                  {loc.location}
                </option>
              ))}
            </select>
          </div>

          {/* COLLEGE TYPE */}
          <div className="filter-groups">
            <label className="filter-labels">College Type</label>
            <select
              name="collegeType"
              value={filters.collegeType}
              onChange={handleFilterChange}
            >
              <option value="">Select College Type</option>
              {collegeTypes.map((c) => (
                <option
                  key={c.collegeType}
                  value={c.collegeType}
                >
                  {c.collegeType || c.name}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-groups">
            <label className="filter-labels">Management</label>
            <select
              name="management"
              value={filters.management}
              onChange={handleFilterChange}
            >
              <option value="">Select Management</option>
              {managements.map((m, i) => (
                <option
                  key={m.management}
                  value={m.management}
                >
                  {m.management}
                </option>
              ))}
            </select>
          </div>

          <button className="clear-btn" onClick={clearFilters}>
            Clear All Filters
          </button>
        </aside>

        {/* ===== RIGHT LIST ===== */}
        <section className="list-container">
          {loading && <p>Loading institutions...</p>}
          {error && (
            <p style={{ color: "red" }}>Failed to load institutions</p>
          )}

          {!loading && paginatedInstitutions.length === 0 && (
            <p style={{ color: "#6b7280" }}>No institutions found</p>
          )}

          {paginatedInstitutions.map((inst) => (
            <div className="institution-card" key={inst.id}>
              <div className="card-header">
                <h2>{inst.name}</h2>
              </div>
              <div className="card-details">
                <p>
                  <strong>Location:</strong> {inst.location}
                </p>
                <p>
                  <strong>College Type:</strong> {inst.collegeType}
                </p>
              </div>
            </div>
          ))}

          {totalPages > 1 && (
            <div className="pagination">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => p - 1)}
              >
                Prev
              </button>

              <span className="page-info">
                {currentPage} / {totalPages}
              </span>

              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => p + 1)}
              >
                Next
              </button>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
