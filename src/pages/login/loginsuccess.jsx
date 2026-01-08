import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function LoginSuccess() {
  const navigate = useNavigate();
  const { search } = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(search);
    const token = params.get("token");
    const expiresAt = params.get("expiresAt");
    const roleId = params.get("roleId");
    const roleName = params.get("roleName");
    const username = params.get("username");
    const name = params.get("name");
    const userId = params.get("userId");
    const id = params.get("id");
    const filePath = params.get("filePath");
    const fileName = params.get("fileName");
    const firtName =params.get("firstName");
const lastName =params.get("lastName");
const email =params.get("email");
const dateOfBirth =params.get("dateOfBirth");
const gender =params.get("gender");
const phoneNumber =params.get("phoneNumber");

    if (token) {
      // ✅ Save each value separately in localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("expiresAt", expiresAt);
      localStorage.setItem("roleId", roleId);
      localStorage.setItem("roleName", roleName || "");
      localStorage.setItem("username", username);
      localStorage.setItem("name", name);
      localStorage.setItem("userId", userId);
      localStorage.setItem("id", id);
      localStorage.setItem("filepath",filePath) ;  
      localStorage.setItem("filename",fileName) ; 
      localStorage.setItem("firstName", firtName );
localStorage.setItem("lastName", lastName);
localStorage.setItem("email", email);
localStorage.setItem("phoneNumber", phoneNumber);
localStorage.setItem("dateOfBirth", dateOfBirth);
localStorage.setItem("gender", gender);  
      // ✅ Optional: log for debugging
      console.log("Login successful:", {
        token,
        expiresAt,
        roleId,
        roleName,
        username,
        name,
        userId,
        id,
        filePath,
        fileName,
      });

      // ✅ Show success popup, then navigate
      setTimeout(() => {
        alert(`Login successful! Welcome, ${name}.`);

        if (roleName === "Student") navigate("/student-dashboard");
        else if (roleName === "Sponsor") navigate("/sponsor-dashboard");
        else if (roleName === "Institution") navigate("/institution-dashboard");
          else if (roleName === "Faculty") navigate("/facultydashboard");
        else navigate("/");
      }, 500);
    } else {
      navigate("/login");
    }
  }, [navigate, search]);

  return <p>Processing login... please wait.</p>;
}
