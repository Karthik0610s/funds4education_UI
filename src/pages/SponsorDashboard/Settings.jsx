import React, { useState } from "react";
import { FaCog, FaBell } from "react-icons/fa";
import "../styles.css";

export default function SponsorSettings() {
  const [settings, setSettings] = useState({
    applicationDeadline: "",
    eligibilityDetails: "",
    studentLocation: "",
    renewalOption: false,
    disbursementMode: "",
    maxApplicationsPerStudent: "",
    scholarshipNotes: "",
    notifyNewApplication: false,
    notifyStudentSelection: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked, options } = e.target;
    if (type === "checkbox") {
      setSettings({ ...settings, [name]: checked });
    } else if (type === "select-multiple") {
      const selected = Array.from(options).filter(o => o.selected).map(o => o.value);
      setSettings({ ...settings, [name]: selected });
    } else {
      setSettings({ ...settings, [name]: value });
    }
  };

  const handleSave = () => {
    console.log("Saving Sponsor Settings:", settings);
    alert("Sponsor Settings saved successfully!");
  };

  return (
    <div className="sponsor-settings">
      <h1>Sponsor Settings</h1>
      <p>Manage your scholarship application rules and notifications.</p>

      <div className="settings-card">
        <h2><FaCog /> Scholarship Application Settings</h2>

        <label>Application Deadline</label>
        <input
          type="date"
          name="applicationDeadline"
          value={settings.applicationDeadline}
          onChange={handleChange}
        />

        <label>Eligibility Requirements (Detailed)</label>
        <textarea
          name="eligibilityDetails"
          value={settings.eligibilityDetails}
          onChange={handleChange}
          placeholder="Enter detailed eligibility criteria"
        />

        <label>Preferred Student Location</label>
        <select
          name="studentLocation"
          value={settings.studentLocation}
          onChange={handleChange}
        >
          <option value="">Select</option>
          <option value="City-wise">City-wise</option>
          <option value="State-wise">State-wise</option>
          <option value="National">National</option>
          <option value="Any">Any</option>
        </select>

        <label>
          <input
            type="checkbox"
            name="renewalOption"
            checked={settings.renewalOption}
            onChange={handleChange}
          />
          Scholarship Renewal Option
        </label>

      

        <label>Mode of Disbursement</label>
        <select
          name="disbursementMode"
          value={settings.disbursementMode}
          onChange={handleChange}
        >
          <option value="">Select</option>
          <option value="Bank Transfer">Bank Transfer</option>
          <option value="PayPal">PayPal</option>
          <option value="Cheque">Cheque</option>
        </select>

        <label>Maximum Applications per Student</label>
        <input
          type="number"
          name="maxApplicationsPerStudent"
          value={settings.maxApplicationsPerStudent}
          onChange={handleChange}
          placeholder="Enter maximum applications"
        />

        <label>Scholarship Notes / Instructions</label>
        <textarea
          name="scholarshipNotes"
          value={settings.scholarshipNotes}
          onChange={handleChange}
          placeholder="Enter notes or instructions for students"
        />

        <h3><FaBell /> Notifications</h3>
        <label>
          <input
            type="checkbox"
            name="notifyNewApplication"
            checked={settings.notifyNewApplication}
            onChange={handleChange}
          />
          Notify on new application
        </label>
        <label>
          <input
            type="checkbox"
            name="notifyStudentSelection"
            checked={settings.notifyStudentSelection}
            onChange={handleChange}
          />
          Notify on student selection
        </label>

        <button onClick={handleSave}>Save Settings</button>
      </div>
    </div>
  );
}
