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
import { loginUser } from "../../app/redux/slices/authSlice";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [userType, setUserType] = useState("");
  const [errors, setErrors] = useState({
    identifier: "",
    password: "",
    userType: "",
  });

  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);

  const emailRegex =
    /^[A-Za-z0-9._%+-]+@[A-Za-z0-9-]+\.(com|com\.au|edu|edu\.in|in|au)$/;

  const isValidEmail = (email) => {
    if (!emailRegex.test(email)) return false;
    const domainPart = email.split("@")[1];
    const tldMatches = domainPart.match(/\.[a-z]+/gi);
    if (!tldMatches) return false;
    return new Set(tldMatches).size === tldMatches.length;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let newErrors = { identifier: "", password: "", userType: "" };

    if (!userType) newErrors.userType = "Please select a user type";
    if (!identifier.trim()) newErrors.identifier = "Email is required";
    else if (!isValidEmail(identifier))
      newErrors.identifier = "Enter a valid email";
    if (!password.trim()) newErrors.password = "Password is required";

    setErrors(newErrors);
    if (Object.values(newErrors).some((err) => err)) return;

    dispatch(loginUser({ username: identifier, password, userType }))
      .unwrap()
      .then((res) => {
        if (res.roleId === 1) navigate("/student-dashboard");
        else if (res.roleId === 2) navigate("/sponsor-dashboard");
        else if (res.roleId === 4) navigate("/institution-dashboard");
      });
  };

  const handleOAuthLogin = (provider) => {
    if (!userType) {
      setErrors((prev) => ({
        ...prev,
        userType: "Please select a user type",
      }));
      return;
    }

    window.location.href = `https://funds4education.in/api/v1/Auth/${provider}/${userType}/login`;
  };

  return (
    <div className="login-page">
      <div className="login-card">
        {/* LEFT FORM */}
        <form className="login-form" onSubmit={handleSubmit}>
          <h2>Login</h2>

          <p>
            Don’t have an account?{" "}
            <Link
              to="#"
              onClick={(e) => {
                e.preventDefault();
                if (!userType) {
                  setErrors((p) => ({
                    ...p,
                    userType: "Please select a user type",
                  }));
                  return;
                }

                const path =
                  userType === "student"
                    ? RP.signup
                    : userType === "sponsor"
                    ? RP.signupSponsor
                    : RP.signupInstitution;

                navigate(path, { state: { userType } });
              }}
            >
              Sign Up
            </Link>
          </p>

          {/* USER TYPE */}
          <div className="user-radio-group">
            {["student", "sponsor", "institution"].map((type) => (
              <label key={type} className="user-radio-label">
                <input
                  type="radio"
                  name="userType"
                  value={type}
                  checked={userType === type}
                  onChange={(e) => {
                    setUserType(e.target.value);
                    setErrors((p) => ({ ...p, userType: "" }));
                  }}
                />
                <span>{type.charAt(0).toUpperCase() + type.slice(1)}</span>
              </label>
            ))}
            <p className="error">{errors.userType || " "}</p>
          </div>

          {/* EMAIL */}
          <div className="input-group">
            <label>Email</label>
            <input
              type="text"
              value={identifier}
              placeholder="Enter email"
              onChange={(e) => {
                setIdentifier(e.target.value);
                setErrors((p) => ({ ...p, identifier: "" }));
              }}
            />
            <p className="error">{errors.identifier || " "}</p>
          </div>

          {/* PASSWORD */}
          <div className="input-group">
            <label>Password</label>
            <div className="password-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                placeholder="Enter password"
                onChange={(e) => {
                  setPassword(e.target.value);
                  setErrors((p) => ({ ...p, password: "" }));
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
                  setErrors((p) => ({
                    ...p,
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

          {/* SOCIAL LOGIN */}
          <div className="social-buttons">
            <button type="button" onClick={() => handleOAuthLogin("google")}>
              <FcGoogle /> Google
            </button>
            <button type="button" onClick={() => handleOAuthLogin("facebook")}>
              <FaFacebook /> Facebook
            </button>
            <button type="button" onClick={() => handleOAuthLogin("linkedin")}>
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
          </div>
        </form>

        {/* RIGHT IMAGE */}
        <div
          className="login-illustration"
          style={{ backgroundImage: `url(${login})` }}
        />
      </div>
    </div>
  );
}
