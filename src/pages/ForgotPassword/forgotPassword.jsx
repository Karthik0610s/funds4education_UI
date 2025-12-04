import { useState } from "react";
import { ApiKey } from "../../api/endpoint";
import { publicAxios } from "../../api/config";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import resetImg from "../../app/assests/login.jpg";
import "../../pages/styles.css";
export default function ForgotPassword() {
  const [step, setStep] = useState(1);
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [role, setRole] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
const [showNewPass, setShowNewPass] = useState(false);
const [showConfirmPass, setShowConfirmPass] = useState(false);
  const handleContinue = async () => {
    debugger;
    setError("");

    if (!username || !role) {
      setError("Please enter username and select role");
      return;
    }

    try {
      debugger;
      const res = await publicAxios.get(`${ApiKey.EmailExistCheck}?email=${username}&role=${role}`);
      const data =  res.data;

      if (res.status==200 && data && (data.id || data.userId)) {
  setStep(2);
} else {
  setError("User not found. Please check username or role.");
}

    } catch (err) {
  const apiMessage =
    err?.response?.data?.message ||
    err?.response?.data?.error ||
    err?.message;

  setError(apiMessage || "Something went wrong. Try again.");
}
  };

  const handleUpdatePassword = async () => {
    setError("");

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
  const res = await publicAxios.put(ApiKey.ResetPassword, null, {
    params: {
      username,
      role,
      newPassword,
    },
  });

  alert("Password updated successfully!");
  navigate("/login");
} catch (err) {
  setError(err.response?.data?.message || "Something went wrong.");
}

  };

 return (
  <div className="login-page">
    <div className="login-card">

      {/* LEFT SIDE – Form */}
      <div
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
          Forgot Password
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

        {/* ---------------------- STEP 1 ---------------------- */}
        {step === 1 && (
          <>
            {/* Username */}
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
                Username/Email *
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your Email"
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
            </div>

            {/* Role */}
            <div style={{ marginBottom: "1.2rem", position: "relative"}}>
              <label
                style={{
                  display: "block",
                  fontSize: "0.875rem",
                  fontWeight: 500,
                  color: "#1D4F56",
                  marginBottom: "0.25rem",
                }}
              >
                Role *
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
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
              >
                <option value="">Select</option>
                <option value="sponsor">Sponsor</option>
                <option value="student">Student</option>
                <option value="institution">Institution</option>
              </select>
            </div>

            <button
              onClick={handleContinue}
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
              Continue
            </button>
          </>
        )}

        {/* ---------------------- STEP 2 ---------------------- */}
        {step === 2 && (
          <>
            {/* NEW PASSWORD */}
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
                New Password *
              </label>

              <input
                type={showNewPass ? "text" : "password"}
                value={newPassword}
                placeholder="Enter new password"
                onChange={(e) => setNewPassword(e.target.value)}
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
                onClick={() => setShowNewPass(!showNewPass)}
                style={{
                  position: "absolute",
                  right: "10px",
                  top: "50%",
                  transform: "translateY(1px)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                {showNewPass ? <FaEye /> : <FaEyeSlash />}
              </button>
            </div>

            {/* CONFIRM PASSWORD */}
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
                Re-enter Password *
              </label>

              <input
                type={showConfirmPass ? "text" : "password"}
                value={confirmPassword}
                placeholder="Re-enter new password"
                onChange={(e) => setConfirmPassword(e.target.value)}
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
                onClick={() => setShowConfirmPass(!showConfirmPass)}
                style={{
                  position: "absolute",
                  right: "10px",
                  top: "50%",
                  transform: "translateY(1px)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                {showConfirmPass ? <FaEye /> : <FaEyeSlash />}
              </button>
            </div>

            <button
              onClick={handleUpdatePassword}
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
              Update Password
            </button>
          </>
        )}

        {error && (
          <p style={{ color: "red", fontSize: "13px", marginTop: "10px" }}>
            {error}
          </p>
        )}
      </div>

      {/* RIGHT SIDE IMAGE */}
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
