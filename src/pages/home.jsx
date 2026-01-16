import React,{useEffect}from 'react';
import { useNavigate } from "react-router-dom";
import { useLocation } from 'react-router-dom';
import Header from '../app/components/header/header';
import "../pages/styles.css";
import '@fortawesome/fontawesome-free/css/all.min.css';
import { FaGraduationCap, FaHandHoldingUsd, FaUniversity } from 'react-icons/fa';
//import studentImg from "../app/assests/studentlogo.png";
//import studentImg from "../app/assests/Homepage.png"
import Image1 from "../app/assests/Image1.png";
import Image2 from "../app/assests/Image2.png";
import Image3 from "../app/assests/Image3.png";
import Image4 from "../app/assests/Image4.png";
import Image5 from "../app/assests/Image5.png";
import { routePath as RP } from "../app/components/router/routepath";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { fetchDashboardCounts } from '../app/redux/slices/dashboardCountSlice';
import { useSelector , useDispatch } from 'react-redux';
const Home=() =>{

  const navigate = useNavigate();
 const token = localStorage.getItem("token");
    const expiresAt = localStorage.getItem("expiresAt");
    const roleId = localStorage.getItem("roleId");
  /*useEffect(() => {
    

    if (token && token !== "" && expiresAt && roleId && roleId !== "0") {
      const expiryTime = new Date(expiresAt).getTime();
      const now = new Date().getTime();

      if (now < expiryTime) {
        // Token valid → redirect to role dashboard
        redirectToDashboard(roleId);
      } else {
        // Token expired → clear it
       // localStorage.clear();
      }
    }
  }, [navigate]);*/
const location = useLocation();

  useEffect(() => {
    if (location.state?.scrollTo) {
      const section = document.getElementById(location.state.scrollTo);
      if (section) {
        section.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [location]);
  // ✅ Helper function for redirection
  const redirectToDashboard = (roleId) => {
    debugger
    switch (roleId) {
      case "1":
        navigate(RP.studentdashboard);
        break;
      case "2":
        navigate(RP.sponsordashboard);
        break;
      case "4":
        navigate(RP.institutiondashboard);
        break;
         case "5":
        navigate(RP.facultyDashboard);
        break;
      default:
        break;
    }
  };

  // ✅ Click Handlers
  /*const handleClickStudent = () => {
    
    const token = localStorage.getItem("token");
    const expiresAt = localStorage.getItem("expiresAt");
    const roleId = localStorage.getItem("roleId");

    // if no valid token → go to login page
    if (!token || token === "" || !expiresAt || !roleId || roleId === "0") {
      navigate(RP.login, { state: { userType: "student" } });
    } else {
      const expiryTime = new Date(expiresAt).getTime();
      const now = new Date().getTime();
      if (now < expiryTime) {
        redirectToDashboard(roleId);
      } else {
      //  localStorage.clear();
        navigate(RP.login, { state: { userType: "student" } });
      }
    }
  };

  const handleClickSponsor = () => {
    
    const token = localStorage.getItem("token");
    const expiresAt = localStorage.getItem("expiresAt");
    const roleId = localStorage.getItem("roleId");

    if (!token || token === "" || !expiresAt || !roleId || roleId === "0") {
      navigate(RP.login, { state: { userType: "sponsor" } });
    } else {
      const expiryTime = new Date(expiresAt).getTime();
      const now = new Date().getTime();
      if (now < expiryTime) {
        redirectToDashboard(roleId);
      } else {
       // localStorage.clear();
        navigate(RP.login, { state: { userType: "sponsor" } });
      }
    }
  };

  const handleClickInstitution = () => {
    
    const token = localStorage.getItem("token");
    const expiresAt = localStorage.getItem("expiresAt");
    const roleId = localStorage.getItem("roleId");

    if (!token || token === "" || !expiresAt || !roleId || roleId === "0") {
      navigate(RP.login, { state: { userType: "institution" } });
    } else {
      const expiryTime = new Date(expiresAt).getTime();
      const now = new Date().getTime();
      if (now < expiryTime) {
        redirectToDashboard(roleId);
      } else {
       // localStorage.clear();
        navigate(RP.login, { state: { userType: "institution" } });
      }
    }
  };*/
  const checkAndNavigate = (expectedRole, userType) => {
  const token = localStorage.getItem("token");
  const expiresAt = localStorage.getItem("expiresAt");
  const roleId = localStorage.getItem("roleId");
// 🔹 Special case: student → direct dashboard access
  /*if (expectedRole === "1") {
    navigate(RP.studentdashboard);
    return;
  }*/
  // 🔹 Case 1: No valid token → go to login
  if (!token || token === "" || !expiresAt || !roleId || roleId === "0") {
    navigate(RP.login, { state: { userType } });
    return;
  }

  // 🔹 Case 2: Token expired → go to login
  const expiryTime = new Date(expiresAt).getTime();
  const now = new Date().getTime();
  if (now >= expiryTime) {
    // localStorage.clear();
    navigate(RP.login, { state: { userType } });
    return;
  }

  // 🔹 Case 3: Role mismatch → force login
  if (roleId !== expectedRole) {
    navigate(RP.login, { state: { userType } });
    return;
  }

  // 🔹 Case 4: Valid token + correct role → redirect to dashboard
  redirectToDashboard(roleId);
};

// ✅ Click Handlers
const handleClickStudent = () => checkAndNavigate("1", "student");

const handleClickDashboard=()=>{
  
  navigate(RP.studentdashboard);
}
const dispatch = useDispatch();

useEffect(() => {
  dispatch(fetchDashboardCounts());
}, []);

const { sponsorCount, studentCount, activeScholarshipCount } = useSelector(
  (state) => state.dashboardCounts
);

const handleClickSponsor = () => checkAndNavigate("2", "sponsor");
const handleClickInstitution = () => checkAndNavigate("5", "faculty");
 const testimonials = [
  {
    text: "VidyāSetu made it easy to understand which scholarships I was eligible for.",
    author: "– Ananya S. Student",
  },
  {
    text: "The platform helped me track applications and deadlines without confusion.",
    author: "– Rohan K. Student",
  },
  {
    text: "Clear information and a smooth experience throughout.",
    author: "– Meera P. Graduate",
  },
];
  const sliderSettings = {
    dots: true,
    infinite: true,
    autoplay: true,
    autoplaySpeed: 3000,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
  };
  return (

    <div className="homepage" >
      <Header varient="public"/>
      {/* Hero Section */}
    <section  id="hero" className="hero">
  <div className="hero-left">
  <Carousel
    autoPlay
    infiniteLoop
    showThumbs={false}
    showStatus={false}
    interval={3000} // 3 seconds per slide
  >
    {/* ===== Image Slides ===== */}
    {/*<div className="carousel-image-slide">
      <img src={Image1} alt="Student illustration"style={{width:"550px",height:"450px"}} />
    </div>*/}
    <div className="carousel-image-slide">
      <img src={Image2} alt="Image 2" />
    </div>
    <div className="carousel-image-slide">
     <img src={Image3} alt="Image 3" className="carousel-img-three" />
    </div>
    <div className="carousel-image-slide">
      <img src={Image4} alt="Image 4" />
    </div>
    <div className="carousel-image-slide">
      <img src={Image5} alt="Image 5" />
    </div>

    {/* ===== Text Slides ===== */}
    <div className="carousel-text-slide">
      <h2>About VidyāSetu</h2>
      <p>
         VidyāSetu is a student-focused digital platform that helps learners discover
  scholarship opportunities, understand eligibility criteria, and track
  applications with clarity and ease.
      </p>
    </div>

    <div className="carousel-text-slide">
      <h2>Our Vision</h2>
      <p>
         To guide students toward the right educational opportunities by simplifying
  scholarship discovery and application processes.
      </p>
    </div>

    <div className="carousel-text-slide">
      <h2>Our Mission</h2>
      <p>
         To provide a transparent and reliable platform where students can explore
  scholarships, track progress, and receive guidance throughout their academic journey.
      </p>
    </div>
  </Carousel>
</div>


  {/* Right side content */}
  <div className="hero-right" style={{ display: "flex", flexDirection: "column", justifyContent: "flex-start", gap: "30px" }}>
    <div>
      <section className="bg-[#F6F6FB] py-16 px-6 md:px-20 text-center">
      <h1 className="text-4xl md:text-6xl font-extrabold leading-tight text-gray-900">
       Discover the Right{" "}
        <span className="text-[#fe8200]">Scholarship Opportunities</span>
        <br />
         For Your Education Journey
      </h1>
      <p className="text-gray-600 mt-4 text-base md:text-lg max-w-2xl mx-auto">
       VidyāSetu helps students explore, understand, and apply for verified
  scholarship opportunities offered by institutions, trusts, and organizations.
      </p>
    </section>
      <button className="btn-primary" onClick={handleClickDashboard}>Find Your Path</button>
    </div>
  </div>
</section>


<section id="benefits-section" className="benefits-section">
  {/* Left Side Content */}
  <div className="benefits-left">
    <h2 className="benefits-subtitle">Benefits</h2>

    <h1 className="benefits-title">
       Helping Students <span>Find</span> <br /> the Right Scholarships
    </h1>

    <p className="benefits-description">
      VidyāSetu helps students identify suitable scholarships, understand benefits,
  and apply confidently — all in one place.
    </p>
  </div>

  {/* Right Side Cards */}
  <div className="benefits-right">
    <div className="benefit-card">
  <h3>Scholarship Discovery</h3>
  <p>Explore scholarships based on your education level and background</p>
</div>

<div className="benefit-card">
  <h3>Eligibility Guidance</h3>
  <p>Clear information on requirements and documents needed</p>
</div>

<div className="benefit-card">
  <h3>Application Tracking</h3>
  <p>Track scholarship applications and important deadlines</p>
</div>

<div className="benefit-card">
  <h3>Student Support</h3>
  <p>Guidance and updates to help students stay informed</p>
</div>

  </div>
</section>

<section id="achievement-section" className="achievement-section">
  {/* Header */}
 
 <div className="achievement-wrapper"></div>
  {/* Content Row */}
  <div className="achievement-content">
    {/* Left Side — Illustrations */}
    <div className="achievement-images">
      <div className="image-card yellow-bg">
        <img src="https://cdn-icons-png.flaticon.com/512/4333/4333609.png" alt="Student Reading" />
      </div>
      {/*<div className="image-card purple-bg">
        <img src="https://cdn-icons-png.flaticon.com/512/4208/4208497.png" alt="Girl Studying" />
      </div>
      <div className="image-card blue-bg">
        <img src="https://cdn-icons-png.flaticon.com/512/4207/4207248.png" alt="Man Working" />
      </div>
      <div className="image-card indigo-bg">
        <img src="https://cdn-icons-png.flaticon.com/512/4207/4207244.png" alt="Students Learning" />
      </div>*/}
    </div>

    {/* Right Side — Stats + Paragraph */}
    <div className="achievement-info">
       <div className="achievement-header">
    <h2 className="achievement-subtitle">Achievements</h2>
    <h1 className="achievement-title">
      An <span>Educational</span> Service <br /> With Rapid Development
    </h1>
  </div>
      <div className="achievement-stats">
        <div>
          <h2>{activeScholarshipCount}+</h2>
          <p>Scholarship</p>
        </div>
        <div>
          <h2>{studentCount}+</h2>
          <p>Students</p>
        </div>
        <div>
          <h2>{sponsorCount}+</h2>
          <p>Partner Group</p>
        </div>
      </div>

      <p className="achievement-description">
        With more highly educated people, the hope is that they can become valuable 
        assets for the country's future development.
      </p>
    </div>
  </div>
</section>





      {/* Role Cards */}
      
      
      <section className="roles">
        
        <div className="role-card role-student cursor-pointer" onClick={handleClickStudent}>
  <FaGraduationCap size={70} color='#396D70' />
  <h3>For Students</h3>
  <p>Find scholarships that match your background interests.</p>
</div>

<div className="role-card role-sponsor cursor-pointer" onClick={handleClickSponsor}>
  <FaHandHoldingUsd size={70} color='#396D70' />
  <h3>For Sponsors</h3>
  <p>Support talented students and track their progress.</p>
</div>

<div className="role-card role-institution cursor-pointer" onClick={handleClickInstitution}>
  <FaUniversity size={70} color='#396D70' />
  <h3>For Faculty</h3>
  <p>Video lessons and guidance for classes and courses.</p>
</div>

      </section>

      {/* Testimonials */}
      {/*<section className="testimonials">
        <h2>Testimonials</h2>
        <blockquote>
          “VidyāSetu helped me secure a scholarship that made my education
          possible.”
        </blockquote>
        <p className="author">– Ananya S. Student</p>
      </section>*/}
      <section className="testimonials max-w-2xl mx-auto py-10 text-center">
        <h2 className="text-2xl font-bold mb-6">Testimonials</h2>
        <Slider {...sliderSettings}>
          {testimonials.map((t, i) => (
            <div key={i} className="p-6">
              <blockquote className="text-xl italic mb-4">“{t.text}”</blockquote>
              <p className="author text-gray-600">{t.author}</p>
            </div>
          ))}
        </Slider>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-left">
          <a href="/contact">Contact Us</a>
          <a href="/privacy">Privacy Policy</a>
          <a href="/terms">Terms and Conditions</a>
          <a href="/termsofuse">Terms of Use</a>


        </div>
        <div className="footer-right">
         <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
    <i className="fab fa-twitter"></i>
  </a>
  <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
    <i className="fab fa-facebook"></i>
  </a>
  <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
    <i className="fab fa-instagram"></i>
  </a>
        </div>
      </footer>
    </div>
  )
}

export default Home