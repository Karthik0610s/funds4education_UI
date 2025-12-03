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
    
    newPassword: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({
    
    newPassword: "",
    confirmPassword: "",
  });
  const [success, setSuccess] = useState("");

  // ✅ Regex patterns
  // const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // simple email validation
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  // Minimum 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special character

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({ newPassword: "", confirmPassword: "" });
    setSuccess("");

    const { newPassword, confirmPassword } = formData;
    let newErrors = {};

   
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
  className="reset-eye-btn"
  onClick={() => setShowPassword(!showPassword)}
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
  className="reset-eye-btn"
  onClick={() => setShowPassword(!showPassword)}
>
  {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
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
