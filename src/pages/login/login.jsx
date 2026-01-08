import React, { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import login from "../../app/assests/login.jpg";
import "../../pages/styles.css";
import {
  FaLinkedin,
  FaInstagram,
  FaTwitter,
  FaPinterest,
  FaFacebook,
} from "react-icons/fa";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { routePath as RP } from "../../app/components/router/routepath";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { loginUser , clearError  } from "../../app/redux/slices/authSlice";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({
    identifier: "",
    password: "",
    userType: "",
  });

  const location = useLocation();
  const navigate = useNavigate();
  const [userType, setUserType] = useState(location.state?.userType || "");

  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);

  // ✅ Update API base URL to match your backend
  const API_BASE_URL =
    process.env.REACT_APP_API_BASE_URL ||
    "https://funds4education.in/api/v1/Auth";

  const handleOAuthLogin = (provider) => {
    if (!userType) {
      setErrors((prev) => ({
        ...prev,
        userType: "Please select a user type",
      }));
      return;
    }

    // Redirect to backend OAuth endpoint
    // window.location.href = `${API_BASE_URL}/${provider}/login?role=${userType}`;
    window.location.href = `https://funds4education.in/api/v1/Auth/${provider}/${userType}/login`;
  };

  /* 
  const handleOAuthLogin = async (provider) => {
    if (!userType) {
      alert("Please select or provide user type before login.");
      return;
    }

    const loginUrl = `https://localhost:44315/api/Auth/${provider}/${userType}/login`;

    // Open OAuth login popup
    const popup = window.open(loginUrl, "_blank", "width=500,height=600");

    // Listen for backend message (token info)
    const handleMessage = (event) => {
      // Validate message origin
      if (!event.origin.includes("localhost")) return;

      const data = event.data;
      if (data?.token) {
        // ✅ Save token data to localStorage
        localStorage.setItem("token", data.token);
        localStorage.setItem("name", data.name);
        localStorage.setItem("roleId", data.roleId);
        localStorage.setItem("roleName", data.roleName);
        localStorage.setItem("userId", data.userId);
        localStorage.setItem("username", data.username);

        // ✅ Close popup
        popup.close();

        // ✅ Navigate based on role
        if (data.roleName === "Student") navigate("/student-dashboard");
        else if (data.roleName === "Sponsor") navigate("/sponsor-dashboard");
        else if (data.roleName === "Institution") navigate("/institution-dashboard");
      }

      // Cleanup listener
      window.removeEventListener("message", handleMessage);
    };

    window.addEventListener("message", handleMessage);
  };
  */

  const emailRegex =
    /^[A-Za-z0-9._%+-]+@[A-Za-z0-9-]+\.(com|com\.au|edu|edu\.in|in|au)$/;

  const isValidEmail = (email) => {
    if (!emailRegex.test(email)) return false;

    const domainPart = email.split("@")[1];
    const tldMatches = domainPart.match(/\.[a-z]+/gi);
    if (!tldMatches) return false;

    const tldSet = new Set(tldMatches);
    return tldSet.size === tldMatches.length;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let newErrors = { identifier: "", password: "", userType: "" };

    if (!userType) newErrors.userType = "Please select a user type";

    // if (!identifier.trim()) newErrors.identifier = "Username or Email is required";
    if (!identifier.trim()) {
      newErrors.identifier = "Email is required";
    } else if (!isValidEmail(identifier)) {
      newErrors.identifier = "Enter a valid email";
    }

    if (!password.trim()) newErrors.password = "Password is required";

    setErrors(newErrors);
    if (Object.values(newErrors).some((err) => err)) return;

    dispatch(loginUser({ username: identifier, password, userType }))
      .unwrap()
      .then((res) => {
        const roleId = res.roleId;
        if (roleId === 1) navigate("/student-dashboard");
        else if (roleId === 2) navigate("/sponsor-dashboard");
        else if (roleId === 4) navigate("/institution-dashboard");
        else if (roleId === 5) navigate("/facultydashboard");
      })
      .catch(() => {});
  };

  return (
    <div className="login-page">
      <div className="login-card">
        {/* === Left: Form === */}
        <form className="login-form" onSubmit={handleSubmit}>
          <h2>Login</h2>

          <p>
            Don’t have an account yet?{" "}
            <Link
              to="#"
              onClick={(e) => {
                e.preventDefault();
                if (!userType) {
                  setErrors((prev) => ({
                    ...prev,
                    userType: "Please select a user type",
                  }));
                  return;
                }

                const path =
                  userType === "student"
                    ? RP.signup
                    : userType === "sponsor"
                    ? RP.signupSponsor
                    : RP.facultySignup;

                navigate(path, { state: { userType } });
              }}
            >
              Sign Up
            </Link>
          </p>

          <div className="user-radio-group">
            {["student", "sponsor", "faculty"].map((type) => (
              <label key={type} className="user-radio-label">
                <input
                  type="radio"
                  name="userType"
                  value={type}
                  checked={userType === type}
                  onChange={(e) => {
  setUserType(e.target.value);

  // ✅ Clear ALL local validation errors
  setErrors({
    identifier: "",
    password: "",
    userType: "",
  });

  // ✅ Clear Redux/global auth error
  dispatch(clearError());
}}

                />
                <span>{type.charAt(0).toUpperCase() + type.slice(1)}</span>
              </label>
            ))}
            <p className="error">{errors.userType || " "}</p>
          </div>

          {/* === Username / Email === */}
          <div className="input-group">
            <label>Username or Email</label>
            <input
              type="text"
              value={identifier}
              onChange={(e) => {
                setIdentifier(e.target.value);
                setErrors((prev) => ({ ...prev, identifier: "" }));
                dispatch(clearError()); 
              }}
              placeholder="Enter username or email"
            />
            <p className="error">{errors.identifier || " "}</p>
          </div>

          {/* === Password === */}
          <div className="input-group">
            <label>Password</label>
            <div className="password-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setErrors((prev) => ({ ...prev, password: "" }));
                  dispatch(clearError());
                }}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <AiOutlineEyeInvisible />
                ) : (
                  <AiOutlineEye />
                )}
              </button>
            </div>
            <p className="error">{errors.password || " "}</p>
          </div>

          <div className="forgot-password">
            <Link
              to="#"
              onClick={(e) => {
                e.preventDefault();
                if (!userType) {
                  setErrors((prev) => ({
                    ...prev,
                    userType: "Please select a user type",
                  }));
                  return;
                }
                navigate("/forgot-password", { state: { userType } });
              }}
            >
              Forgot Password?
            </Link>
          </div>

          <button type="submit" disabled={loading} className="login-btn">
            {loading ? "Logging in..." : "LOGIN"}
          </button>

          {error && <p className="error global">{error}</p>}

          <div className="divider">
            <span>or login with</span>
          </div>

          <div className="social-buttons">
            <button type="button" onClick={() => handleOAuthLogin("google")}>
              <FcGoogle /> Google
            </button>
            <button type="button" onClick={() => handleOAuthLogin("facebook")}>
              <FaFacebook /> Facebook
            </button>
           {/* <button type="button" onClick={() => handleOAuthLogin("linkedin")}>
              <FaLinkedin /> LinkedIn
            </button>
            <button type="button" onClick={() => handleOAuthLogin("instagram")}>
              <FaInstagram /> Instagram
            </button>
            <button type="button" onClick={() => handleOAuthLogin("twitter")}>
              <FaTwitter /> X
            </button>
            <button type="button" onClick={() => handleOAuthLogin("pinterest")}>
              <FaPinterest /> Pinterest
            </button>
            */}
          </div>
        </form>

        {/* === Right: Illustration === */}
        <div
          className="login-illustration"
          style={{ backgroundImage: `url(${login})` }}
        ></div>
      </div>
    </div>
  );
}
