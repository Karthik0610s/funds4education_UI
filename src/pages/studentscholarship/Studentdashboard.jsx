import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import Header from "../../app/components/header/header";
import { logout } from "../../app/redux/slices/authSlice";
import {
  fetchScholarshipList,
  fetchFeaturedScholarships,
  fetchDropdownData,
} from "../../app/redux/slices/ScholarshipSlice";
import Swal from "sweetalert2";
import "../../pages/studentscholarship/studentdashboard.css";
import logoUrl from "../../app/assests/kotak.png";
import { routePath as RP } from "../../app/components/router/routepath";
//import { FaSearch } from "react-icons/fa";
import { publicAxios } from "../../api/config";
import { FaSearch, FaBars, FaFilter } from "react-icons/fa";
const StudentDashboard = () => {
  const [showFilter, setShowFilter] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const baseUrl = publicAxios.defaults.baseURL.replace(/\/api$/, "");
  //const logoUrl1 = `https://localhost:44315/Scholarship/Scholarship-1/${s.logoName}`;
  const { data = {}, loading = false } = useSelector(
    (state) => state.scholarship || {}
  );
  const { live = [], upcoming = [], featured = [] } = data;
  const [imgError, setImgError] = useState(false);

  const roleId =
    useSelector((state) => state.auth.roleId) ||
    Number(localStorage.getItem("roleId"));
  const userId =
    useSelector((state) => state.auth.userId) ||
    Number(localStorage.getItem("userId"));
  const name =
    useSelector((state) => state.auth.name) || localStorage.getItem("name");

  const [activeTab, setActiveTab] = useState("live");
  const [searchQuery, setSearchQuery] = useState("");
  /*const [filters, setFilters] = useState({
    class: "All",
    country: "All",
    gender: "All",
    religion: "All",
    state: "All",
    course: "All",
  });*/
  const [filters, setFilters] = useState({
    class: [],
    country: [],
    gender: [],
    religion: [],
    state: [],
    course: [],
  });
const [dropdownOpen, setDropdownOpen] = useState({
  class: false,
  country: false,
  gender: false,
  religion: false,
  state: false,
  course: false,
});

  const [dropdownData, setDropdownData] = useState({
    countries: [],
    classList: [],
    courses: [],
    states: [],
    genders: [],
    religions: [],
  });

  // ✅ Load dropdowns once
  useEffect(() => {
    const loadDropdowns = async () => {
      const res = await dispatch(fetchDropdownData());
      if (res && !res.error) {
        setDropdownData(res.data);
      } else {
        console.error(res?.errorMsg);
      }
    };
    loadDropdowns();
  }, [dispatch]);

  // ✅ Fetch scholarships whenever filters or tab change
  // 🔹 Load featured only once
useEffect(() => {
  dispatch(fetchFeaturedScholarships());
}, [dispatch]);

// 🔹 Scholarships reload when filters change
useEffect(() => {
   const activeFilters = {
        statusType: "both",
        classId: filters.class.length ? filters.class : null,
        countryId: filters.country.length ? filters.country : null,
        genderId: filters.gender.length ? filters.gender : null,
        religionId: filters.religion.length ? filters.religion : null,
        stateId: filters.state.length ? filters.state : null,
        courseId: filters.course.length ? filters.course : null,

      };
  dispatch(fetchScholarshipList(activeFilters));
}, [
  dispatch,
  activeTab,
  filters.class,
  filters.country,
  filters.gender,
  filters.religion,
  filters.state,
  filters.course,
]);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     const activeFilters = {
  //       statusType: "both",
  //       classId: filters.class.length ? filters.class : null,
  //       countryId: filters.country.length ? filters.country : null,
  //       genderId: filters.gender.length ? filters.gender : null,
  //       religionId: filters.religion.length ? filters.religion : null,
  //       stateId: filters.state.length ? filters.state : null,
  //       courseId: filters.course.length ? filters.course : null,

  //     };

  //     await dispatch(fetchScholarshipList(activeFilters));
  //     await dispatch(fetchFeaturedScholarships());
  //   };

  //   fetchData();
  // }, [
  //   dispatch,
  //   activeTab,
  //   filters.class,
  //   filters.country,
  //   filters.gender,
  //   filters.religion,
  //   filters.state,
  //   filters.course,
  // ]);

  const handleLogout = () => {
    dispatch(logout());
    Swal.fire({
      icon: "success",
      title: "Logout Successful",
      text: "You have been logged out.",
      confirmButtonColor: "#3085d6",
      timer: 1800,
    });
    navigate("/login");
  };

  const today = useMemo(() => new Date(), []);
  const getDaysLeftText = (endDate) => {
    if (!endDate) return null;
    const end = new Date(endDate);
    const diffDays = Math.ceil((end - today) / 86400000);
    if (diffDays <= 0) return null;
    if (diffDays === 1) return "Last day to go";
    if (diffDays <= 15) return `${diffDays} days to go`;
    return null;
  };

  const liveScholarships = useMemo(() => live || [], [live]);
  const upcomingScholarships = useMemo(() => upcoming || [], [upcoming]);
  const featuredScholarships = useMemo(() => featured || [], [featured]);
  const featuredIds = useMemo(
    () => featuredScholarships.map((s) => s.id || s.scholarshipId),
    [featuredScholarships]
  );

  // ✅ Apply filters + search on loaded data
  const displayedScholarships = useMemo(() => {
    const baseList =
      activeTab === "upcoming" ? upcomingScholarships : liveScholarships;

    return baseList.filter((s) => {
      const search = searchQuery.toLowerCase();
      const matchesSearch =
        s.name?.toLowerCase().includes(search) ||
        s.eligibility?.toLowerCase().includes(search) ||
        s.amount?.toLowerCase().includes(search);

      return matchesSearch;
    });
  }, [
    filters,
    liveScholarships,
    upcomingScholarships,
    activeTab,
    searchQuery,
  ]);

  const [currentPage, setCurrentPage] = useState(1);
  const scholarshipsPerPage = 6;

  useEffect(() => {
    setCurrentPage(1);
  }, [filters, activeTab, searchQuery]);

  const indexOfLastScholarship = currentPage * scholarshipsPerPage;
  const indexOfFirstScholarship = indexOfLastScholarship - scholarshipsPerPage;
  const currentScholarships = displayedScholarships.slice(
    indexOfFirstScholarship,
    indexOfLastScholarship
  );
  const totalPages = Math.ceil(
    displayedScholarships.length / scholarshipsPerPage
  );

  const clearAllFilters = () => {
 
    setFilters({
      class: [],
      country: [],
      gender: [],
      religion: [],
      state: [],
      course: [],
    });

  };
  const ads = [
  {
    title: "🎓 Online MBA Degree",
    text: "UGC Approved | EMI Available",
    button: "Apply Now",
  },
  {
    title: "💻 Full Stack Development Course",
    text: "Job Guarantee Program",
    button: "Enroll Now",
  },
  {
    title: "📚 IELTS Online Coaching",
    text: "Live Online Classes",
    button: "Start Learning",
  },

  // ⭐ Extra ads added below
  {
    title: "🧠 Data Science Certification",
    text: "Learn AI, ML & Python | Online",
    button: "Join Today",
  },
  {
    title: "🌍 Study Abroad Consultancy",
    text: "Free Guidance & Visa Support",
    button: "Book Free Call",
  },
  {
    title: "🧑‍💼 Digital Marketing Course",
    text: "Internship & Placement Support",
    button: "Register Now",
  },
];

  const [currentAd, setCurrentAd] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentAd((prev) => (prev + 1) % ads.length);
    }, 3000); // 3 seconds

    return () => clearInterval(interval);
  }, []);
  return (
    <div>
      <Header variant="student-profile" />
      <div className="mobile-header">
        <div className="mobile-menu-btn" onClick={() => setShowMobileMenu(true)}>
          ☰
        </div>

        <h2 className="mobile-user-name">{name ?? "Student"}</h2>
      </div>

      {/* ⭐ MOBILE MENU DRAWER */}
      {showMobileMenu && (
        <div className="mobile-menu-drawer">
          <div className="close-menu" onClick={() => setShowMobileMenu(false)}>✕</div>

          <Link to="/student-dashboard">Dashboard</Link>
          <Link to="/application">Applications</Link>
          {/* <Link to="/scholarship-match">Matches</Link>
    <Link to={RP.studentmessages}>Messages</Link> */}
          <Link to={RP.ViewStudentProfile}>Profile</Link>
          {/* <Link to={RP.studentwallet}>Wallet</Link> */}
        </div>
      )}

      {userId && roleId ? (
        <div className="student-navbar">
          <div className="user-info">
            <h2>{name ?? "Student"}</h2>
          </div>
          <nav>
            <Link to="/student-dashboard" className="active">
              Dashboard
            </Link>
            <Link to="/application">Applications</Link>
            {/* <Link to="/scholarship-match">Matches</Link>
            <Link to={RP.studentmessages}>Messages</Link> */}
            <Link to={RP.ViewStudentProfile}>Profile</Link>
            {/* <Link to={RP.studentwallet}>Wallet</Link> */}
          </nav>
        </div>
      ) : null}
      {/* ⭐ MOBILE FILTER ICON */}
      <div className="mobile-filter-icon" onClick={() => setShowFilter(true)}>
        <FaFilter />
        <span style={{ marginLeft: "6px" }}>Filters</span>
      </div>
      <div className="dashboard-container">
        {/* Sidebar Filters */}
        <aside className={`sidebar ${showFilter ? "mobile-open" : ""}`}>

          {/* ⭐ MOBILE CLOSE BUTTON */}
          <div className="mobile-filter-close" onClick={() => setShowFilter(false)}>
            ✕ Close
          </div>

          <div className="filter-title">Category</div>

          <div className="filter-group">
            {[
              { key: "class", label: "Class", options: dropdownData.classList },
              { key: "country", label: "Country", options: dropdownData.countries },
              { key: "gender", label: "Gender", options: dropdownData.genders },
              { key: "religion", label: "Religion", options: dropdownData.religions },
              { key: "state", label: "State", options: dropdownData.states },
              { key: "course", label: "Course", options: dropdownData.courses },
            ].map(({ key, label, options }) => (
              <div key={key} className="filter-dropdown">
                <button
                  className="dropdown-toggle"
                 onClick={() =>
                    setDropdownOpen((prev) => ({ ...prev, [key]: !prev[key] }))
                  }
                >
                  <span>{label}</span>
                  <span className="arrow">▼</span>
                </button>

                {filters[`show_${key}`] && (
                  <div className="dropdown-menu">
                    {/* Select All */}
                    <label className="checkbox-row">
                      <input
                        type="checkbox"
                        checked={filters[key].length === options.length}
                        onChange={() => {
                          if (filters[key].length === options.length) {
                            setFilters((prev) => ({ ...prev, [key]: [] }));
                          } else {
                            setFilters((prev) => ({
                              ...prev,
                              [key]: options.map((opt) => opt.id),
                            }));
                          }
                        }}
                      />
                      <span>Select All</span>
                    </label>

                    {/* All options */}
                    {options.map((opt) => (
                      <label key={opt.id} className="checkbox-row">
                        <input
                          type="checkbox"
                          checked={filters[key].includes(opt.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setFilters((prev) => ({
                                ...prev,
                                [key]: [...prev[key], opt.id],
                              }));
                            } else {
                              setFilters((prev) => ({
                                ...prev,
                                [key]: prev[key].filter((v) => v !== opt.id),
                              }));
                            }
                          }}

                        />
                        <span>{opt.name}</span>

                      </label>
                    ))}
                  </div>

                )}
              </div>
            ))}
          </div>


          <button className="clear-filters-btn" onClick={clearAllFilters}>
            Clear All Filters
          </button>

          {userId ? (
            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          ) : null}

        </aside>

        {/* Main Content */}
        <main className="main-content">
          <span style={{ fontSize: "34px" }}> Scholarships for Indian Students</span>

          {/* Search Box */}
          <div className="search-box mb-3">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search by name, eligibility or award..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="tab-container">
            <div className="tab-group">
              <button
                className={`tab ${activeTab === "live" ? "active" : ""}`}
                onClick={() => setActiveTab("live")}
              >
                Live Scholarships ({liveScholarships.length})
              </button>
              <button
                className={`tab ${activeTab === "upcoming" ? "active" : ""}`}
                onClick={() => setActiveTab("upcoming")}
              >
                Upcoming Scholarships ({upcomingScholarships.length})
              </button>
            </div>
          </div>

          {/* Scholarships Grid */}
          <div className="content-layout">
            <div className="scholarship-grid">
              
              {loading && 
                <p>Loading scholarships...</p>}

              
                {!loading && currentScholarships.length > 0 && (
                 
                currentScholarships.map((s, i) => {
                  const endDate = s.endDate ? new Date(s.endDate) : null;
                  const daysLeftText = getDaysLeftText(s.endDate);
                  const diffDays = endDate
                    ? Math.ceil((endDate - today) / 86400000)
                    : null;
                  const isFeatured = featuredIds.includes(
                    s.id || s.scholarshipId
                  );
                  // ✅ Clean logo name (remove trailing | and spaces)
                  const cleanLogoName = s.logoName?.split("|")[0]?.trim() || "";

                  // ✅ Encode spaces and special chars in file name
                  const encodedLogoName = encodeURIComponent(cleanLogoName);

                  // ✅ Build proper image URL
                  const imageUrl =
                    s.logoPath && cleanLogoName
                      ? `${baseUrl}/${s.logoPath
                        .replace(/^.*Scholarship[\\/]/, "Scholarship/")
                        .replace(/\\/g, "/")}/${encodedLogoName}`
                      : "/images/before.png";

                  // ✅ Create alt text without extension
                  const altText = cleanLogoName.replace(/\.[^/.]+$/, "") || "Scholarship Logo";

                  // ✅ Detect if file is an image
                  const isImage = /\.(png|jpg|jpeg|gif)$/i.test(cleanLogoName);
                  console.log("image", imageUrl);
                  return (
                    <div
                      className="scholarship-card"
                      key={i}
                      onClick={() =>
                        navigate(
                          `${RP.scholarshipViewPage}?id=${s.id || s.scholarshipId
                          }`
                        )
                      }
                    >
                      {!activeTab.includes("upcoming") && isFeatured && (
                        <div className="featured-tag">Featured</div>
                      )}
                      {activeTab === "live" && daysLeftText && (
                        <div
                          className={`deadline-badge ${diffDays <= 1 ? "urgent" : "warning"
                            }`}
                        >
                          {daysLeftText}
                        </div>
                      )}

                      <div className="card-header-flex">
                        <div className="logo-wrapper">
                          {/*<img
                            src={s.logopath}
                            alt={s.logoName ?? "Scholarship Logo"}
                            className="card-logo"
                          />*/}
                          {isImage ? (
                            <img
                              src={imageUrl}
                              alt={altText}
                              className="card-logo"
                              onError={() => setImgError(true)}
                            />
                          ) : (
                            <div className="alt-logo-text">{ }</div>
                          )}

                        </div>
                      </div>

                      <div className="card-body">
                        <h3 className="card-title">
                          {s.name ?? "Untitled Scholarship"}
                        </h3>
                        <p>
                          <strong>🏆 Award</strong>
                          <br />
                          {s.amount ?? "Not specified"}
                        </p>

                        <p>
                          <strong>🎓 Eligibility</strong>
                          <br />
                          {s.eligibility ?? "Not specified"}
                        </p>


                        {!daysLeftText && (
                          <p className="deadline-line">
                            <strong>📅 Deadline:</strong>
                            <br />
                            {endDate
                              ? endDate.toLocaleDateString("en-GB", {
                                day: "numeric",
                                month: "long",
                                year: "numeric",
                              })
                              : "N/A"}
                          </p>
                        )}


                        <div className="card-footer-updated">
                          Last Updated On{" "}
                          {s.lastUpdatedDate
                            ? new Date(s.lastUpdatedDate)
                              .toISOString()
                              .split("T")[0]
                            : "N/A"}
                        </div>
                      </div>
                    </div>
                  );
                }
              )
                

              )}  {!loading && currentScholarships.length === 0 && (
                  <p>No scholarships found.</p>
                )}
            </div>

            <div className="ads-container">
              <div className="ad-box">
                <h4>{ads[currentAd].title}</h4>
                <p>{ads[currentAd].text}</p>
                <button>{ads[currentAd].button}</button>
              </div>
           
            {/* Featured Sidebar */}
            <aside className="featured-sidebar">
              <div className="featured-header">Featured Scholarships</div>

              {featuredScholarships.length === 0 ? (
                <p style={{ padding: "12px" }}>No featured scholarships found.</p>
              ) : (
                featuredScholarships.map((s, i) => {
                  // const baseUrl = "https://localhost:44315";

                  // ✅ Clean logo name (remove trailing | and spaces)
                  const cleanLogoName = s.logoName?.split("|")[0]?.trim() || "";

                  // ✅ Encode spaces and special chars in file name
                  const encodedLogoName = encodeURIComponent(cleanLogoName);

                  // ✅ Build proper image URL (handles Scholarship, SchAppForm, etc.)
                  const imageUrl =
                    s.logoPath && cleanLogoName
                      ? `${baseUrl}/${s.logoPath
                        .replace(/^.*Scholarship[\\/]/, "Scholarship/")
                        .replace(/\\/g, "/")}/${encodedLogoName}`
                      : "/images/before.png";

                  // ✅ Create alt text without extension
                  const altText = cleanLogoName.replace(/\.[^/.]+$/, "") || "Scholarship Logo";

                  // ✅ Detect if file is an image
                  const isImage = /\.(png|jpg|jpeg|gif)$/i.test(cleanLogoName);

                  console.log("image", imageUrl);

                  return (
                    <div className="featured-item" key={i}>
                      {isImage ? (
                        <img
                          src={imageUrl}
                          alt={altText}
                          className="featured-logo"
                          onError={() => setImgError(true)}
                        />
                      ) : (
                        <div className="alt-logo-text">{ }</div>
                      )}

                      <div>
                        <p className="featured-title">
                          {s.scholarshipName ?? "Unnamed Scholarship"}
                        </p>
                        {s.deadline ? (
                          <p className="featured-deadline">
                            Deadline Date:{" "}
                            {new Date(s.deadline).toLocaleDateString("en-GB", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}
                          </p>
                        ) : (
                          <p className="featured-deadline">No Deadline</p>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </aside>
 </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="pagination-controls">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => p - 1)}
                  className="pagination-btn"
                >
                  ← Previous
                </button>

                <span className="page-info">
                  Page {currentPage} of {totalPages}
                </span>

                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((p) => p + 1)}
                  className="pagination-btn"
                >
                  Next →
                </button>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default StudentDashboard;
