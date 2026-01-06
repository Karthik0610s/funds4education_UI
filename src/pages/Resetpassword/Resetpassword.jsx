import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../pages/styles.css";
import resetImg from "../../app/assests/login.jpg";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { publicAxios } from "../../api/config";
import { ApiKey } from "../../api/endpoint";
import Header from "../../app/components/header/header";

export default function ResetPassword() {
  const navigate = useNavigate();

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
  });

  const [error, setError] = useState(""); // single error state
  const [success, setSuccess] = useState("");

  // Password validation regex
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const { currentPassword, newPassword } = formData;

    // Check if both fields are filled
    if (!currentPassword || !newPassword) {
      setError("Please enter both current and new password.");
      return;
    }

    // Validate new password
    if (!passwordRegex.test(newPassword)) {
      setError(
        "New password must be at least 8 characters, include uppercase, lowercase, number, and special character."
      );
      return;
    }

    try {
      const res = await publicAxios.post(ApiKey.ResetPassword, {
        username: localStorage.getItem("username"),
        roleId: localStorage.getItem("roleId"),
        currentPassword,
        newPassword,
      });

      if (res.data.success) {
  setSuccess(res.data.message);

  // ✅ FORCE LOGOUT AFTER PASSWORD RESET
  localStorage.clear();
  setTimeout(() => {
    navigate("/login", { replace: true });
  }, 1500);
}
else {
        setError(res.data.message);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong.");
    }
  };

  return (
    <><Header variant="profile-role-based"/>
    <div className="login-page">
      <div className="login-card">
        <form
          onSubmit={handleSubmit}
          style={{
            padding: "2rem",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#1D4F56" }}>
            Reset Password
          </h2>
          {/* 
          <p style={{ fontSize: "0.875rem", color: "#1D4F56", marginBottom: "1.5rem" }}>
            Remembered your password?{" "} 
            {/*<a href="/login" style={{ color: "#1D4F56", textDecoration: "underline" }}>
              Back to Login
            </a>
            
          </p>
          */}
  

          {/* Current Password */}
          <div style={{ marginBottom: "1rem", position: "relative" }}>
            <label style={{ fontSize: "0.875rem", color: "#1D4F56" }}>Current Password</label>
            <input
              type={showCurrentPassword ? "text" : "password"}
              name="currentPassword"
              placeholder="Enter current password"
              value={formData.currentPassword}
              onChange={handleChange}
              style={{
                width: "100%",
                padding: "0.5rem 1rem",
                border: "1px solid #d1d5db",
                borderRadius: "0.5rem",
                height: "36px",
              }}
            />
            <button
              type="button"
              className="reset-eye-btn"
              onClick={() => setShowCurrentPassword(!showCurrentPassword)}
            >
              {showCurrentPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
            </button>
          </div>

          {/* New Password */}
          <div style={{ marginBottom: "1rem", position: "relative" }}>
            <label style={{ fontSize: "0.875rem", color: "#1D4F56" }}>New Password</label>
            <input
              type={showNewPassword ? "text" : "password"}
              name="newPassword"
              placeholder="Enter new password"
              value={formData.newPassword}
              onChange={handleChange}
              style={{
                width: "100%",
                padding: "0.5rem 1rem",
                border: "1px solid #d1d5db",
                borderRadius: "0.5rem",
                height: "36px",
              }}
            />
            <button
              type="button"
              className="reset-eye-btn"
              onClick={() => setShowNewPassword(!showNewPassword)}
            >
              {showNewPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
            </button>
          </div>

          <button
            type="submit"
            style={{
              width: "100%",
              backgroundColor: "#1D4F56",
              color: "#fff",
              padding: "0.5rem 1rem",
              borderRadius: "0.5rem",
              fontWeight: 600,
              cursor: "pointer",
              border: "none",
            }}
          >
            Reset Password
          </button>

          {/* Show all errors below button */}
          {error && (
            <p style={{ color: "red", fontSize: "13px", marginTop: "8px" }}>{error}</p>
          )}
          {success && (
            <p style={{ color: "green", fontSize: "13px", marginTop: "8px" }}>{success}</p>
          )}
        </form>

        {/* Right Image */}
        <div
          style={{
            backgroundImage: `url(${resetImg})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        ></div>
      </div>
    </div>
    </>
  );
}
