import { useState, useMemo, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchApplicationsBySponsor, updateApplicationStatus } from "../../app/redux/slices/ScholarshipSlice";
import "../styles.css";
import Swal from "sweetalert2";
import SponsorLayout from "../../pages/SponsorDashboard/SponsorLayout";
import { logout } from "../../app/redux/slices/authSlice";
import { useNavigate, Link } from "react-router-dom";
import Header from "../../app/components/header/header";
export default function SponsorApplications() {
  const dispatch = useDispatch();
  const { data, loading, error } = useSelector((state) => state.scholarship);
  const applications = data.applications || [];
  const name = localStorage.getItem("name") || "Student";
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };
  const formatAmount = (val) => {
  
  if (!val) return "₹0";

  let amount = String(val).trim();

  // already contains any currency → return as is
 if (/(₹|rs\.?\b|inr\b|usd\b|\$|€|£)/i.test(amount)) {
    return amount;
  }

  // extract the number part only (before any text)
  const match = amount.match(/[\d,]+\/?-?/);
  if (match) {
    const numPart = match[0]; // like "20,000/-"
    const rest = amount.slice(numPart.length); // remaining text

    return `₹${numPart}${rest}`;
  }

  // fallback for unknown format
  return `₹${amount}`;
};

  const [filter, setFilter] = useState("All");
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [newMessage, setNewMessage] = useState("");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5; // items per page

  const handleViewApplication = (appId) => {
    navigate(`/student/scholarship-application/${appId}/view`);
  };

  useEffect(() => {

    const sponsorId = localStorage.getItem("userId");
    dispatch(fetchApplicationsBySponsor(sponsorId));
  }, [dispatch]);

  // Reset page when filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [filter]);

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
const handleFundPopup = (application) => {
  const { applicationId, firstName, lastName, scholarshipName, amount } = application;

  Swal.fire({
    title: "Fund Student",
    html: `
      <div style="text-align:left;">
        <p><strong>Student:</strong> ${firstName} ${lastName}</p>
        <p><strong>Scholarship:</strong> ${scholarshipName}</p>
        <p><strong>Scholarship Amount:</strong> ${formatAmount(amount)}</p>
        <br/>
        <label><strong>Enter Fund Amount:</strong></label>
        <input type="number" id="fundAmount" class="swal2-input" placeholder="Enter amount" min="1" />
      </div>
    `,
    focusConfirm: false,
    showCancelButton: true,
    confirmButtonText: "Submit Funding",
    cancelButtonText: "Cancel",
    preConfirm: () => {
      const fundAmount = document.getElementById("fundAmount").value;

      if (!fundAmount || Number(fundAmount) <= 0) {
        Swal.showValidationMessage("Please enter a valid fund amount.");
        return false;
      }

      return { fundAmount };
    }
  }).then(async (result) => {
    if (result.isConfirmed) {
      const sponsorName = localStorage.getItem("name") || "SponsorUser";

      await dispatch(
        updateApplicationStatus(applicationId, "Funded", sponsorName, result.value.fundAmount)
      );

      Swal.fire({
        icon: "success",
        title: "Student Funded!",
        text: `Fund Amount: ₹${result.value.fundAmount}`,
        timer: 1500,
        showConfirmButton: false
      });

      const sponsorId = localStorage.getItem("userId");
      setTimeout(() => dispatch(fetchApplicationsBySponsor(sponsorId)), 500);
    }
  });
};


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

  // Filter application list
const filteredApplications = useMemo(() => {
  const sortedApps = [...applications].sort(
    (a, b) => new Date(b.applicationDate) - new Date(a.applicationDate)
  );

  if (filter === "All") return sortedApps;

  return sortedApps.filter(
    (app) => normalize(app.status) === normalize(filter)
  );
}, [applications, filter]);

  // Pagination
  const paginatedApplications = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredApplications.slice(start, start + pageSize);
  }, [filteredApplications, currentPage]);

  const totalPages = Math.ceil(filteredApplications.length / pageSize);

  const displayStatus = (s) => s.charAt(0).toUpperCase() + s.slice(1);

  if (loading) return <p className="loading">Loading applications...</p>;
  if (error) return <p className="error">Error loading applications.</p>;

  return (
      <>
      <Header variant="sponsor-profile" />
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
             {/* <option>Pending</option> */}
              <option>Approved</option>
              <option>Funded</option>
              <option>Rejected</option>
            </select>
          </div>

          {/* Applications List */}
          <div className="application-list">
            {paginatedApplications.length > 0 ? (
              paginatedApplications.map((app) => (
                <div
                  key={app.applicationId}
                  className="application-card"
                  style={{ cursor: "pointer" }}
                  onClick={() => handleViewApplication(app.applicationId)}
                >
                  <div className="application-info">
                    <h3 className="student-name">
                      {app.firstName} {app.lastName}
                    </h3>
                    <p>{app.scholarshipName || "Course not specified"}</p>
                    <p>School/College: {app.schoolName}</p>
                    <p>Funded Amount:{app.fundAmount}</p>
                    <span className={`status ${normalize(app.status)}`}>
                      {displayStatus(app.status)}
                    </span>
                  </div>

                  <div className="application-actions">
                    {["pending", "submitted", "under review"].includes(normalize(app.status)) && (
                      <>
                        <button
                          className="btn btn-approve"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleUpdateStatus(app.applicationId, "Approved");
                          }}
                        >
                          Approve
                        </button>
                        <button
                          className="btn btn-reject"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleUpdateStatus(app.applicationId, "Rejected");
                          }}
                        >
                          Reject
                        </button>
                      </>
                    )}

                    {normalize(app.status) === "approved" && (
                      <button
  className="btn btn-fund"
  onClick={(e) => {
    e.stopPropagation();
    handleFundPopup(app);
  }}
>
  Fund Student
</button>

                    )}

                    <button
                      className="btn btn-message"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedStudent({
                          ...app,
                          messages: app.messages || [],
                        });
                      }}
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
              </div>
            )}
          </div>

          {/* Pagination */}
          {filteredApplications.length > 0 && (
<div className="pagination">
    <button
      disabled={currentPage === 1}
      onClick={() => setCurrentPage((prev) => prev - 1)}
    >
      Prev
    </button>

    <span>
      {currentPage} / {totalPages}
    </span>

    <button
      disabled={currentPage === totalPages}
      onClick={() => setCurrentPage((prev) => prev + 1)}
    >
      Next
    </button>
  </div>
)}
        </div>

        {/* Messages Modal */}
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

</>
  );
}
