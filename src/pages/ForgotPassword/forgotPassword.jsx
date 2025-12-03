import { useState } from "react";
import { ApiKey } from "../../api/endpoint";
import { publicAxios } from "../../api/config";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
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
  <div className="forgot-container">
    <h2 className="forgot-title">Forgot Password</h2>

    

    {step === 1 && (
      <div className="step-section">
        <label>Username *</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <label>Role *</label>
        <select value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="">Select</option>
          <option value="sponsor">Sponsor</option>
          <option value="student">Student</option>
          <option value="institution">Institution</option>
        </select>

        <button onClick={handleContinue}>Continue</button>
      </div>
    )}

    {step === 2 && (
      <div className="step-section">

  <label>New Password *</label>
  <div className="password-wrapper">
    <input
      type={showNewPass ? "text" : "password"}
      value={newPassword}
      onChange={(e) => setNewPassword(e.target.value)}
    />
    <span className="toggle-eye" onClick={() => setShowNewPass(!showNewPass)}>
      {showNewPass ? <FaEye /> : <FaEyeSlash />}
    </span>
  </div>

  <label>Re-enter Password *</label>
  <div className="password-wrapper">
    <input
      type={showConfirmPass ? "text" : "password"}
      value={confirmPassword}
      onChange={(e) => setConfirmPassword(e.target.value)}
    />
    <span className="toggle-eye" onClick={() => setShowConfirmPass(!showConfirmPass)}>
      {showConfirmPass ? <FaEye /> : <FaEyeSlash />}
    </span>
    
  </div>

  <button onClick={handleUpdatePassword}>Update Password</button>
</div>

    )}
    {error && <p className="error-text">{error}</p>}
  </div>
);

}
