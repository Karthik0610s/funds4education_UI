import React, { useEffect, useState, useMemo ,useRef} from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import Header from "../../app/components/header/header";
import { logout } from "../../app/redux/slices/authSlice";
import {
  fetchScholarshipList,
  fetchFeaturedScholarships,
  fetchCoursesByClassId,clearCourses,
  fetchDropdownData,
} from "../../app/redux/slices/ScholarshipSlice";
import Swal from "sweetalert2";
import "../../pages/studentscholarship/studentdashboard.css";
import { routePath as RP } from "../../app/components/router/routepath";
//import { FaSearch } from "react-icons/fa";
import { publicAxios } from "../../api/config";
import { FaSearch, FaBars, FaFilter } from "react-icons/fa";
import GoogleAd from "../googleads";
const StudentDashboard = () => {
  const [showFilter, setShowFilter] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [eligibilityTab, setEligibilityTab] = useState("all"); // default
  //const [activeTab, setActiveTab] = useState("live"); // default
//const userId = localStorage.getItem("userId");
//const roleId = localStorage.getItem("roleId");
//const roleName = localStorage.getItem("roleName");

// Condition: user is logged in


  const dispatch = useDispatch();
  const navigate = useNavigate();
  const baseUrl = publicAxios.defaults.baseURL.replace(/\/api$/, "");
  //const logoUrl1 = `https://localhost:44315/Scholarship/Scholarship-1/${s.logoName}`;
  const { data = {}, loading = false } = useSelector(
    (state) => state.scholarship || {}
  );
  const { live = [], upcoming = [], featured = [] } = data;
  const [imgError, setImgError] = useState(false);
  const { courses, courseLoading } = useSelector(
  (state) => state.scholarship
);


  const roleId =
    useSelector((state) => state.auth.roleId) ||
    Number(localStorage.getItem("roleId"));
  const userId =
    useSelector((state) => state.auth.userId) ||
    Number(localStorage.getItem("userId"));
  const name =
    useSelector((state) => state.auth.name) || localStorage.getItem("name");
const roleName = localStorage.getItem("roleName");
const canSeeEligibility = userId && roleId && roleName;
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
      setDropdownData({
        ...res.data,
        courses: res.data.courses.map(c => ({
          id: c.courseId,
          name: c.courseName,
          classId: c.classId, // keep for future filtering
        })),
      });
    }
  };
  loadDropdowns();
}, [dispatch]);

  // ✅ Fetch scholarships whenever filters or tab change
  // 🔹 Load featured only once
  useEffect(() => {
    dispatch(fetchFeaturedScholarships());
  }, [dispatch]);

  useEffect(() => {
    debugger;
  if (filters.class.length === 0) {
    dispatch(clearCourses());
    return;
  }

  const classId = filters.class;
  console.log(classId,"classID");
  dispatch(fetchCoursesByClassId(classId));
}, [filters.class, dispatch]);

const sidebarRef = useRef(null);
const paginationRef = useRef(null);

 /*const closeAllDropdowns = () => {
    setFilters((prev) => ({
      ...prev,
      show_class: false,
      show_country: false,
      show_gender: false,
      show_religion: false,
      show_state: false,
      show_course: false,
    }));
  };*/

  // CLICK OUTSIDE HANDLER
 const [isMobile, setIsMobile] = useState(
  window.matchMedia("(max-width: 920px)").matches
);

useEffect(() => {
  const mediaQuery = window.matchMedia("(max-width: 920px)");

  const handleResize = () => setIsMobile(mediaQuery.matches);

  mediaQuery.addEventListener("change", handleResize);

  return () => mediaQuery.removeEventListener("change", handleResize);
}, []);
useEffect(() => {
  function handleClickOutside(event) {
    if (!showFilter) return; // only run if sidebar is open

    const clickedOutsideSidebar =
      sidebarRef.current && !sidebarRef.current.contains(event.target);

    if (clickedOutsideSidebar) {
      setShowFilter(false);
      closeAllDropdowns();
    }
  }

  document.addEventListener("mousedown", handleClickOutside);
  return () => document.removeEventListener("mousedown", handleClickOutside);
}, [showFilter]);



  // 🔹 Scholarships reload when filters change
  useEffect(() => {
    const activeFilters = {
      statusType: "both",
      filterType:eligibilityTab,
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
     eligibilityTab, 
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
    if (!endDate) return "Always Open";   // ⭐ FIX: null means always open

    const end = new Date(endDate);
    if (isNaN(end.getTime())) return "Always Open"; // ⭐ invalid date → always open

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
const getResponsiveValue = (breakpoints) => {
  const width = window.innerWidth;
  for (let i = 0; i < breakpoints.length; i++) {
    if (width >= breakpoints[i].minWidth) return breakpoints[i].value;
  }
  return breakpoints[breakpoints.length - 1].value;
};
  // --- Responsive helpers ---
const getItemsPerPage = () =>
  getResponsiveValue([
    { minWidth: 1400, value: 12 },
    { minWidth: 1024, value: 10 },
    { minWidth: 768, value: 6 },
    { minWidth: 0, value: 4 },
  ]);
  const [scholarshipsPerPage, setScholarshipsPerPage] = useState(getItemsPerPage());
useEffect(() => {
  const handleResize = () => {
    setScholarshipsPerPage(getItemsPerPage());
  
  };

  window.addEventListener("resize", handleResize);
  return () => window.removeEventListener("resize", handleResize);
}, []);
  //const scholarshipsPerPage = 10;

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
useEffect(() => {
  console.log("🔍 Live scholarships:", liveScholarships.length);
  console.log("🔍 Upcoming scholarships:", upcomingScholarships.length);
  console.log("🔍 Active tab:", activeTab);
  console.log("🔍 Search query:", searchQuery);
  console.log("🔍 Displayed scholarships:", displayedScholarships.length);
  console.log("🔍 Scholarships per page:", scholarshipsPerPage);
  console.log("🔍 Total pages:", totalPages);
  console.log("🔍 Current page:", currentPage);
}, [liveScholarships, upcomingScholarships, activeTab, searchQuery, displayedScholarships, currentPage]);
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
      title: "💻 Full Stack Development",
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
const ads1 = [
  {
    title: "💻 Full-Stack Developer Course",
    text: "MERN/Java/Python Tracks",
    button: "Enroll Now",
  },
  {
    title: "📖 Government Exam Coaching",
    text: "SSC | Bank | UPSC | State Exams",
    button: "Start Preparation",
  },
  {
    title: "🧾 Resume & Portfolio Builder",
    text: "Create ATS-Friendly Resume",
    button: "Build Resume",
  },
  {
    title: "📸 Graphic Design Masterclass",
    text: "Photoshop, Illustrator & UI/UX",
    button: "Join Workshop",
  },
  {
    title: "🏦 Personal Loan Assistance",
    text: "Instant Approval | High Eligibility",
    button: "Check Eligibility",
  },
  {
    title: "🧳 International Travel Deals",
    text: "Cheap Flights, Hotels & Packages",
    button: "Explore Deals",
  },
  {
    title: "👩‍⚕️ Health & Fitness Coaching",
    text: "Diet Plans, Weight Loss Programs",
    button: "Get Plan",
  },
  {
    title: "🎧 Spoken English Classes",
    text: "Improve Communication + Fluency",
    button: "Join Now",
  },
];
const [openDropdown, setOpenDropdown] = useState(null); // 🔥 only one dropdown
const closeAllDropdowns = () => {
  setOpenDropdown(null);
};
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
      {/*<div className="mobile-header">
        <div className="mobile-menu-btn" onClick={() => setShowMobileMenu(true)}>
          ☰
        </div>

        <h2 className="mobile-user-name">{name ?? "Student"}</h2>
      </div>*/}

      {/* ⭐ MOBILE MENU DRAWER */}
      {showMobileMenu && (
        <div className="mobile-menu-drawer">
          <div className="close-menu" onClick={() => setShowMobileMenu(false)}>✕</div>

          <Link to="/student-dashboard">Dashboard</Link>
          <Link to="/application">Applications</Link>
          {/* <Link to="/scholarship-match">Matches</Link>
    <Link to={RP.studentmessages}>Messages</Link> */}
          {/* <Link to={RP.studentwallet}>Wallet</Link> */}
        </div>
      )}

      {/* {userId && roleId ? (
        <div className="student-navbar">
          <div className="user-info">
            <h2>{name ?? "Student"}</h2>
          </div>
          <nav>
            <Link to="/student-dashboard" className="active">
              Dashboard
            </Link>
            <Link to="/application">Applications</Link>
            /* <Link to="/scholarship-match">Matches</Link>
            <Link to={RP.studentmessages}>Messages</Link> */

            /* <Link to={RP.studentwallet}>Wallet</Link> */
         /* </nav>
        </div>
      ) : null}*/}
      {/* ⭐ MOBILE FILTER ICON */}
      <div className="mobile-filter-icon" onClick={() => setShowFilter(true)}>
        <FaFilter />
        <span style={{ marginLeft: "6px" }}>Filters</span>
      </div>
      <div className="dashboard-container-SC">
       {isMobile && showFilter && (
    <div
      className="sidebar-overlay"
      onClick={() => {
        setShowFilter(false);
        closeAllDropdowns();
      }}
    />
  )}

   <aside
     ref={sidebarRef}
    className={`sidebar ${
      showFilter ? (isMobile ? "mobile-open" : "desktop-open") : ""
    }`}
    onClick={closeAllDropdowns} // 🔥 close dropdown on sidebar click
  >
    {/* HEADER */}
    <div className="filter-header">
      <span className="filter-title">Category</span>
      <span
        className="mobile-filter-close"
        onClick={() => {
          setShowFilter(false);
          closeAllDropdowns();
        }}
      >
        ✕
      </span>
    </div>

    {/* FILTER GROUP */}
    <div className="filter-group">
      {[
        { key: "country", label: "Country", options: dropdownData.countries },
        { key: "state", label: "State", options: dropdownData.states },
        { key: "religion", label: "Religion", options: dropdownData.religions },
        { key: "gender", label: "Gender", options: dropdownData.genders },
        { key: "class", label: "Class", options: dropdownData.classList },
        { key: "course", label: "Course", options: courses },
      ].map(({ key, label, options }) => (
        <div
          key={key}
          className="filter-dropdown"
          onClick={(e) => e.stopPropagation()} // 🔥 prevent sidebar close
        >
          {/* TOGGLE */}
          <button
            className="dropdown-toggle"
            onClick={() =>
              setOpenDropdown(openDropdown === key ? null : key)
            }
          >
            <span>{label}</span>
            <span className="arrow">▼</span>
          </button>

          {/* DROPDOWN */}
          {openDropdown === key && (
            <div className="dropdown-menu">
              {/* SELECT ALL */}
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

              {/* OPTIONS */}
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

    {/* CLEAR BUTTON */}
    <button className="clear-filters-btn" onClick={clearAllFilters}>
      Clear All Filters
    </button>

  </aside>

        {/* Main Content */}
        <main className="main-content">
<div className="content-layout">
          {/* LEFT SIDE */}
          <div className="left-content" >

            {/* Title */}
            <span
              style={{
                fontSize: "34px",
                display: "block",
                margin: "12px auto",
              }}
            >
              Scholarships for Indian Students
            </span>

            {/* Search Box */}
            <div className="tab-card-container search-card">
              <FaSearch className="search-icon" />
              <input
                type="text"
                placeholder="Search by name, eligibility or award..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>



            {/* Parent Tabs */}
            <div className="tabs-wrapper">

              {/* CARD 1 — Eligibility + All */}
              <div className="tab-card-container">
               <button
  className={`tab-btn ${eligibilityTab === "eligibility" ? "active" : ""}`}
  onClick={() => canSeeEligibility && setEligibilityTab("eligibility")}
  disabled={!canSeeEligibility}
>
  Eligibility
</button>

                <button
                  className={`tab-btn ${eligibilityTab === "all" ? "active" : ""}`}
                  onClick={() => setEligibilityTab("all")}
                >
                  All
                </button>
              </div>

              {/* CARD 2 — Live + Upcoming */}
              <div className="tab-card-container">
                <button
                  className={`tab-btn ${activeTab === "live" ? "active" : ""}`}
                  onClick={() => setActiveTab("live")}
                >
                  Live ({liveScholarships.length})
                </button>

                <button
                  className={`tab-btn ${activeTab === "upcoming" ? "active" : ""}`}
                  onClick={() => setActiveTab("upcoming")}
                >
                  Upcoming ({upcomingScholarships.length})
                </button>
              </div>






            </div>
 </div>
            {/* RIGHT SIDE ADS */}
            {/* {!loading && currentScholarships.length > 0 && (
  <div className="right-content">
    
      <GoogleAd />
    
  </div>
)} */}

<div className="right-content">
    <div className="ad-box" style={{marginBottom:"8px"}}>
                <h4>{ads[currentAd].title}</h4>
                <p>{ads[currentAd].text}</p>
                <button>{ads[currentAd].button}</button>
              </div>
      {/*<GoogleAd /> */}
   
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
                  // Extract folder name from Windows path
                  const folderName = s.logoPath
                    ? s.logoPath.split(/[/\\]/).pop()
                    : "";
                  // ✅ Clean logo name (remove trailing | and spaces)
                  const cleanLogoName = s.logoName?.split("|")[0]?.trim() || "";

                  // ✅ Encode spaces and special chars in file name
                  const encodedLogoName = encodeURIComponent(cleanLogoName);

                  // ✅ Build proper image URL
                  /* const imageUrl =
                     folderName && cleanLogoName
                       ? `${baseUrl}/${s.logoPath
                         .replace(/^.*Scholarship[\\/]/, "Scholarship/")
                         .replace(/\\/g, "/")}/${encodedLogoName}`
                       : "/images/before.png";
 */
                  const imageUrl =
                    folderName && cleanLogoName
                      ? `${baseUrl}/SCHOLARSHIPLOGO/${folderName}/${cleanLogoName}`
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
                     

                 {/*     <div className="card-header-flex">
                         {activeTab === "live" && (
                        <>
                          {s.endDate === null ? (
                            <div className="deadline-badge open">
                              Always Open
                            </div>
                          ) : (
                            daysLeftText && (
                              <div className={`deadline-badge ${diffDays <= 1 ? "urgent" : "warning"}`}>
                                {daysLeftText}
                              </div>
                            )
                          )}
                        </>
                      )}
                        <div className="logo-wrapper">
                          {/*<img
                            src={s.logopath}
                            alt={s.logoName ?? "Scholarship Logo"}
                            className="card-logo"
                          />
                          {cleanLogoName ? (
    <img
      src={imageUrl}
      alt={altText}
      className="card-logo"
      onError={(e) => {
        e.target.style.display = "none"; // hide broken image
      }}
    />
  ) : (
    <div className="empty-logo" />
  )}
</div>
                      </div>  */}

                      <div className="card-header-flex">
  <div className="logo-wrapper">
    {cleanLogoName ? (
      <img
        src={imageUrl}
        alt={altText}
        className="card-logo"
        onError={(e) => (e.target.style.display = "none")}
      />
    ) : (
      <div className="empty-logo" />
    )}
  </div>
 
  {activeTab === "live" &&
    (s.endDate === null ? (
      <div className="deadline-badge open">Always Open</div>
    ) : (
      daysLeftText && (
        <div className={`deadline-badge ${diffDays <= 1 ? "urgent" : "warning"}`}>
          {daysLeftText}
        </div>
      )
    ))}
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
 {/* ===== MOBILE ONLY PAGINATION ===== */}
  {totalPages > 1 && (
    <div className="pagination-mobile">
      <button
        disabled={currentPage === 1}
        onClick={() => setCurrentPage(p => p - 1)}
        className="pagination-btn"
      >
        ← Previous
      </button>

      <span className="page-info">
        Page {currentPage} of {totalPages}
      </span>

      <button
        disabled={currentPage === totalPages}
        onClick={() => setCurrentPage(p => p + 1)}
        className="pagination-btn"
      >
        Next →
      </button>
    </div>
  )}
            <div className="ads-container">
               {/*<div className="ad-box" style={{marginBottom:"8px"}}>
                {/*<h4>{ads[currentAd].title}</h4>
                <p>{ads[currentAd].text}</p>
                <button>{ads[currentAd].button}</button>
              </div>*/}

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
                          .replace(/^.*SCHOLARSHIPLOGO[\\/]/, "SCHOLARSHIPLOGO/")
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
              <div className="pagination-controls desktop-only"  ref={paginationRef}>
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
