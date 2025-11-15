import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../pages/styles.css";
import resetImg from "../../app/assests/login.jpg";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

export default function ResetPassword() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    emailOrUsername: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({
    emailOrUsername: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [success, setSuccess] = useState("");

  // ✅ Regex patterns
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // simple email validation
  const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/; // alphanumeric + underscores
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  // Minimum 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special character

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({ emailOrUsername: "", newPassword: "", confirmPassword: "" });
    setSuccess("");

    const { emailOrUsername, newPassword, confirmPassword } = formData;
    let newErrors = {};

    // ✅ Validate Email/Username
    if (!emailOrUsername.trim()) {
      newErrors.emailOrUsername = "Email or Username is required.";
    } else if (
      !emailRegex.test(emailOrUsername) &&
      !usernameRegex.test(emailOrUsername)
    ) {
      newErrors.emailOrUsername =
        "Enter a valid email or username (3–20 alphanumeric characters).";
    }

    // ✅ Validate Password
    if (!newPassword.trim()) {
      newErrors.newPassword = "New password is required.";
    } else if (!passwordRegex.test(newPassword)) {
      newErrors.newPassword =
        "Password must be 8+ chars, include uppercase, lowercase, number, and special symbol.";
    }

    // ✅ Confirm Password
    if (!confirmPassword.trim()) {
      newErrors.confirmPassword = "Please confirm your password.";
    } else if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      // Simulate API call
      console.log("Resetting password for:", emailOrUsername);
      setSuccess("✅ Password reset successfully!");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setErrors({
        ...newErrors,
        emailOrUsername: "❌ Failed to reset password. Please try again.",
      });
    }
  };

  return (
     <div className="login-page">
    <div className="login-card">
        {/* Left: Reset Password Form */}
        <form
          onSubmit={handleSubmit}
          style={{
            padding: "2rem",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <h2
            style={{
              fontSize: "1.5rem",
              fontWeight: "bold",
              color: "#1D4F56",
              marginBottom: "0.5rem",
            }}
          >
            Reset Password
          </h2>

          <p
            style={{
              fontSize: "0.875rem",
              color: "#1D4F56",
              marginBottom: "1.5rem",
            }}
          >
            Remembered your password?{" "}
            <a
              href="/login"
              style={{ color: "#1D4F56", textDecoration: "underline" }}
            >
              Back to Login
            </a>
          </p>

          {/* Email or Username */}
          <div style={{ marginBottom: "1rem" }}>
            <label
              style={{
                display: "block",
                fontSize: "0.875rem",
                fontWeight: 500,
                color: "#1D4F56",
                marginBottom: "0.25rem",
              }}
            >
              Email or Username
            </label>
            <input
              type="text"
              name="emailOrUsername"
              placeholder="Enter your registered email or username"
              value={formData.emailOrUsername}
              onChange={handleChange}
              style={{
                width: "100%",
                padding: "0.5rem 1rem",
                fontSize: "14px",
                border: "1px solid #d1d5db",
                borderRadius: "0.5rem",
                outline: "none",
                height: "36px",
                boxSizing: "border-box",
              }}
            />
            {errors.emailOrUsername && (
              <p style={{ color: "red", fontSize: "12px", marginTop: "4px" }}>
                {errors.emailOrUsername}
              </p>
            )}
          </div>

          {/* New Password */}
          <div style={{ marginBottom: "1rem", position: "relative" }}>
            <label
              style={{
                display: "block",
                fontSize: "0.875rem",
                fontWeight: 500,
                color: "#1D4F56",
                marginBottom: "0.25rem",
              }}
            >
              New Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              name="newPassword"
              placeholder="Enter new password"
              value={formData.newPassword}
              onChange={handleChange}
              style={{
                width: "100%",
                padding: "0.5rem 1rem",
                fontSize: "14px",
                border: "1px solid #d1d5db",
                borderRadius: "0.5rem",
                outline: "none",
                height: "36px",
                boxSizing: "border-box",
              }}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: "absolute",
                top: "65%",
                right: "10px",
                transform: "translateY(-50%)",
                background: "transparent",
                border: "none",
                cursor: "pointer",
                color: "#1D4F56",
                fontSize: "20px",
              }}
            >
              {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
            </button>
            {errors.newPassword && (
              <p style={{ color: "red", fontSize: "12px", marginTop: "4px" }}>
                {errors.newPassword}
              </p>
            )}
          </div>

          {/* Confirm Password */}
          <div style={{ marginBottom: "1rem", position: "relative" }}>
            <label
              style={{
                display: "block",
                fontSize: "0.875rem",
                fontWeight: 500,
                color: "#1D4F56",
                marginBottom: "0.25rem",
              }}
            >
              Confirm Password
            </label>
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              placeholder="Confirm new password"
              value={formData.confirmPassword}
              onChange={handleChange}
              style={{
                width: "100%",
                padding: "0.5rem 1rem",
                fontSize: "14px",
                border: "1px solid #d1d5db",
                borderRadius: "0.5rem",
                outline: "none",
                height: "36px",
                boxSizing: "border-box",
              }}
            />
            <button
              type="button"
              onClick={() =>
                setShowConfirmPassword(!showConfirmPassword)
              }
              style={{
                position: "absolute",
                top: "65%",
                right: "10px",
                transform: "translateY(-50%)",
                background: "transparent",
                border: "none",
                cursor: "pointer",
                color: "#1D4F56",
                fontSize: "20px",
              }}
            >
              {showConfirmPassword ? (
                <AiOutlineEyeInvisible />
              ) : (
                <AiOutlineEye />
              )}
            </button>
            {errors.confirmPassword && (
              <p style={{ color: "red", fontSize: "12px", marginTop: "4px" }}>
                {errors.confirmPassword}
              </p>
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
              marginBottom: "1rem",
            }}
          >
            Reset Password
          </button>

          {success && (
            <p style={{ color: "green", fontSize: "13px" }}>{success}</p>
          )}
        </form>

        {/* Right: Image */}
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
