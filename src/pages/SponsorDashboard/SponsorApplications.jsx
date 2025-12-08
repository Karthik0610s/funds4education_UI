import { useState, useMemo, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchApplicationsBySponsor, updateApplicationStatus } from "../../app/redux/slices/ScholarshipSlice"; // adjust path if needed
import "../styles.css";
import Swal from "sweetalert2";
import SponsorLayout from "../../pages/SponsorDashboard/SponsorLayout";
import { logout } from "../../app/redux/slices/authSlice";
import { useNavigate, Link } from "react-router-dom";

export default function SponsorApplications() {
  const dispatch = useDispatch();
  const { data, loading, error } = useSelector((state) => state.scholarship);
  const applications = data.applications || [];
  const name = localStorage.getItem("name") || "Student";
  const navigate = useNavigate();

  // logout
  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };
  const [filter, setFilter] = useState("All");
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const handleViewApplication = (appId) => {
    navigate(`/student/scholarship-application/${appId}/view`);
  };

  useEffect(() => {
    debugger;
    const sponsorId = localStorage.getItem("userId");
    dispatch(fetchApplicationsBySponsor(sponsorId));
  }, [dispatch]);

  const normalize = (s) => (s || "").toLowerCase();

  const handleUpdateStatus = (id, newStatus) => {
    const modifiedBy = localStorage.getItem("name") || "SponsorUser";
    const sponsorId = localStorage.getItem("userId");

    const actionText =
      newStatus === "Approved"
        ? "approve"
        : newStatus === "Rejected"
          ? "reject"
          : newStatus === "Funded"
            ? "fund"
            : "update";

    Swal.fire({
      title: `Are you sure you want to ${actionText} this application?`,
      text:
        newStatus === "Approved"
          ? "Once approved, this student will be eligible for funding."
          : newStatus === "Rejected"
            ? "Once rejected, this student cannot reapply for this scholarship."
            : "Confirm your action.",
      icon:
        newStatus === "Approved"
          ? "success"
          : newStatus === "Rejected"
            ? "warning"
            : "info",
      showCancelButton: true,
      confirmButtonText: `Yes, ${actionText}`,
      cancelButtonText: "Cancel",
      confirmButtonColor:
        newStatus === "Approved"
          ? "#4CAF50"
          : newStatus === "Rejected"
            ? "#e74c3c"
            : "#3498db",
      cancelButtonColor: "#999",
    }).then(async (result) => {
      if (result.isConfirmed) {
        // ✅ Dispatch API call
        await dispatch(updateApplicationStatus(id, newStatus, modifiedBy));

        setTimeout(() => {
          dispatch(fetchApplicationsBySponsor(sponsorId));
        }, 800);

        Swal.fire({
          icon: "success",
          title: "Updated!",
          text: `Application has been ${newStatus.toLowerCase()} successfully.`,
          timer: 1500,
          showConfirmButton: false,
        });
      }
    });
  };


  // 💬 Handle local messaging UI (not stored in backend)
  const sendMessage = () => {
    if (!newMessage.trim() || !selectedStudent) return;
    setSelectedStudent({
      ...selectedStudent,
      messages: [
        ...selectedStudent.messages,
        { sender: "Sponsor", text: newMessage, time: new Date().toLocaleString() },
      ],
    });
    setNewMessage("");
  };

  // 🧠 Filter logic
  const filteredApplications = useMemo(() => {
    if (filter === "All") return applications;
    return applications.filter((app) => normalize(app.status) === normalize(filter));
  }, [applications, filter]);

  const displayStatus = (s) => s.charAt(0).toUpperCase() + s.slice(1);

  if (loading) return <p className="loading">Loading applications...</p>;
  if (error) return <p className="error">Error loading applications.</p>;

  return (

    <div className="page-split">

      <div className="left-container">
        <SponsorLayout name={name} handleLogout={handleLogout} />
      </div>


      <div className="right-container">
        <div className="mobile-sponsor">
          <SponsorLayout name={name} handleLogout={handleLogout} />
        </div>
        <div className="container">
          <h2 className="page-title">Student Applications</h2>

          {/* Filter */}
          <div className="filter">
            <label>Filter by status:</label>
            <select value={filter} onChange={(e) => setFilter(e.target.value)}>
              <option>All</option>
              <option>Pending</option>
              <option>Approved</option>
              <option>Funded</option>
              <option>Rejected</option>
            </select>
          </div>

          {/* Applications List */}
          <div className="application-list">
            {filteredApplications.length > 0 ? (
              filteredApplications.map((app) => (
                <div key={app.applicationId} className="application-card">
                  <div className="application-info">
                    <h3 className="student-name">
                      {app.firstName} {app.lastName}
                    </h3>
                    <p>{app.scholarshipName || "Course not specified"}</p>
                    <p>School: {app.schoolName}</p>
                    <span className={`status ${normalize(app.status)}`}>
                      {displayStatus(app.status)}
                    </span>
                  </div>
                  <div className="application-actions">
                    {/* VIEW BUTTON */}
                    <button
                      className="btn btn-view"
                      onClick={() => handleViewApplication(app.applicationId)}
                    >
                      View
                    </button>

                    {["pending", "submitted", "under review"].includes(normalize(app.status)) && (
                      <>
                        <button
                          className="btn btn-approve"
                          onClick={() => handleUpdateStatus(app.applicationId, "Approved")}
                        >
                          Approve
                        </button>
                        <button
                          className="btn btn-reject"
                          onClick={() => handleUpdateStatus(app.applicationId, "Rejected")}
                        >
                          Reject
                        </button>
                      </>
                    )}

                    {normalize(app.status) === "approved" && (
                      <button
                        className="btn btn-fund"
                        onClick={() => handleUpdateStatus(app.applicationId, "Funded")}
                      >
                        Fund Student
                      </button>
                    )}

                    <button
                      className="btn btn-message"
                      onClick={() =>
                        setSelectedStudent({
                          ...app,
                          messages: app.messages || [],
                        })
                      }
                    >
                      Messages ({(app.messages || []).length})
                    </button>
                  </div>


                </div>
              ))
            ) : (
              <div style={{ textAlign: "center", padding: "40px" }}>
                {filter === "All" ? (
                  <>
                    <h3>No scholarships added</h3>
                    <p>Add scholarship to get applications</p>
                  </>
                ) : (
                  <h3>No {filter} applications</h3>
                )}
              </div>)}
          </div>
        </div>

        {/* 💬 Modal for Messages */}
        {selectedStudent && (
          <div className="modal-overlay">
            <div className="modal">
              <h2>Messages with {selectedStudent.firstName}</h2>
              <div className="messages-box">
                {selectedStudent.messages.length === 0 ? (
                  <p className="empty">No messages yet.</p>
                ) : (
                  selectedStudent.messages.map((m, i) => (
                    <div key={i} className={`message-item ${m.sender.toLowerCase()}`}>
                      <strong>{m.sender}:</strong> {m.text}
                      <div className="message-time">{m.time}</div>
                    </div>
                  ))
                )}
              </div>

              {/* Send Message Box */}
              <div className="send-box">
                <textarea
                  rows="3"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type your message..."
                />
                <button className="btn btn-approve" onClick={sendMessage}>
                  Send
                </button>
              </div>

              <div className="modal-actions">
                <button className="btn btn-reject" onClick={() => setSelectedStudent(null)}>
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
