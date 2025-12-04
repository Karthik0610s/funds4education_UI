import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../pages/styles.css";
import resetImg from "../../app/assests/login.jpg";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { publicAxios } from "../../api/config";
import { ApiKey } from "../../api/endpoint";

export default function ResetPassword() {
  const navigate = useNavigate();

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
  });

  const [errors, setErrors] = useState({
    currentPassword: "",
    newPassword: "",
  });

  const [success, setSuccess] = useState("");

  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setErrors({});
    setSuccess("");

    const currentPassword = formData.currentPassword;
    const newPassword = formData.newPassword;


    console.log({
      username: localStorage.getItem("username"),
      roleId: localStorage.getItem("roleId"),
      currentPassword,
      newPassword
    });

    if (!currentPassword || !newPassword) {
      setErrors({ newPassword: "Please enter both passwords." });
      return;
    }

    try {
      const res = await publicAxios.post(ApiKey.ResetPassword, {
        username: localStorage.getItem("username"),
        roleId: localStorage.getItem("roleId"),
        currentPassword,
        newPassword,
      });

      setSuccess("Password reset successfully!");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      setErrors({
        newPassword: err.response?.data?.message || "Something went wrong.",
      });
    }
  };


  return (
    <div className="login-page">
      <div className="login-card">
        {/* Left Form */}
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

          <p style={{ fontSize: "0.875rem", color: "#1D4F56", marginBottom: "1.5rem" }}>
            Remembered your password?{" "}
            <a href="/login" style={{ color: "#1D4F56", textDecoration: "underline" }}>
              Back to Login
            </a>
          </p>

          {/* Current Password */}
          <div style={{ marginBottom: "1rem", position: "relative" }}>
            <label style={{ fontSize: "0.875rem", color: "#1D4F56" }}>
              Current Password
            </label>
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
            {errors.currentPassword && (
              <p style={{ color: "red", fontSize: "12px" }}>{errors.currentPassword}</p>
            )}
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
            {errors.newPassword && (
              <p style={{ color: "red", fontSize: "12px" }}>{errors.newPassword}</p>
            )}
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
  );
}
