import React, { useState, useEffect, useMemo } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import Header from "../../app/components/header/header.js";
import SponsorLayout from "../../pages/SponsorDashboard/SponsorLayout.jsx";
import { logout } from "../../app/redux/slices/authSlice";
import "../../pages/styles.css";
//import "./queryAdminList.css";
import { publicAxios } from "../../api/config.js";
import { ApiKey } from "../../api/endpoint";

const STATUS_OPTIONS = ["All", "Open", "Pending reply", "Responded", "Closed"];

const statusClass = (status) => {
  switch ((status || "").toLowerCase()) {
    case "open":
      return "status-badge status-open";
    case "in progress":
      return "status-badge status-progress";
    case "resolved":
      return "status-badge status-resolved";
    case "closed":
      return "status-badge status-closed";
    default:
      return "status-badge";
  }
};

// 👉 Parses a date string coming from the API as IST (+05:30), regardless of
// whether it already has a timezone suffix or not. Backend saves IST-local
// values (via DATEADD(MINUTE, 330, GETUTCDATE())), so we must tell the
// browser explicitly "this is +05:30" instead of letting it assume its own
// local timezone — otherwise the elapsed-time math comes out hours off.
const parseAsIst = (dateValue) => {
  if (!dateValue) return NaN;

  let str = String(dateValue).trim();
  str = str.replace(" ", "T");
  str = str.replace(/(Z|[+-]\d{2}:\d{2})$/, "");

  return new Date(`${str}+05:30`).getTime();
};

// 👉 "Just now" / "5 mins ago" / "2 hours ago" / "3 days ago" / "2 weeks ago"...
const getRelativeTime = (dateValue) => {
  if (!dateValue) return "—";

  const then = parseAsIst(dateValue);
  if (Number.isNaN(then)) return "—";

  const now = Date.now();
  const diffMs = now - then;
  const diffSec = Math.floor(diffMs / 1000);

  if (diffSec < 60) return "Just now";

  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin} min${diffMin === 1 ? "" : "s"} ago`;

  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr} hour${diffHr === 1 ? "" : "s"} ago`;

  const diffDay = Math.floor(diffHr / 24);
  if (diffDay < 7) return `${diffDay} day${diffDay === 1 ? "" : "s"} ago`;

  const diffWeek = Math.floor(diffDay / 7);
  if (diffWeek < 4) return `${diffWeek} week${diffWeek === 1 ? "" : "s"} ago`;

  const diffMonth = Math.floor(diffDay / 30);
  if (diffMonth < 12) return `${diffMonth} month${diffMonth === 1 ? "" : "s"} ago`;

  const diffYear = Math.floor(diffDay / 365);
  return `${diffYear} year${diffYear === 1 ? "" : "s"} ago`;
};

const QueryAdminList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const sponsorName = localStorage.getItem("name") || "Sponsor";

  const [queries, setQueries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 5;

  // 👉 Reply popup state — holds the FULL ticket object (need studentId/
  // studentName/subject/id for the modal header + message attribution)
  const [activeTicket, setActiveTicket] = useState(null);
  const [conversation, setConversation] = useState([]);
  const [loadingConversation, setLoadingConversation] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [sendingReply, setSendingReply] = useState(false);

  // Logout
  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  // 👉 GET v1/Query/all
  const fetchAllQueries = async () => {
    setLoading(true);
    try {
      const res = await publicAxios.get(ApiKey.GetAllQueries);
      setQueries(res.data || []);
    } catch (error) {
      console.error("Failed to load queries:", error);
      setQueries([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllQueries();
  }, []);

  const filteredQueries = useMemo(() => {
    return queries.filter((q) => {
      let matchesStatus = true;

      if (statusFilter === "Pending reply") {
        matchesStatus = !!q.isReplyFlag;
      } else if (statusFilter === "Responded") {
        matchesStatus = !q.isReplyFlag;
      } else if (statusFilter !== "All") {
        matchesStatus =
          (q.status || "").toLowerCase() === statusFilter.toLowerCase();
      }

      const search = searchText.trim().toLowerCase();
      const matchesSearch =
        !search ||
        (q.subject || "").toLowerCase().includes(search) ||
        (q.studentName || "").toLowerCase().includes(search);

      return matchesStatus && matchesSearch;
    });
  }, [queries, searchText, statusFilter]);

  // Pagination logic
  const totalPages = Math.ceil(filteredQueries.length / ITEMS_PER_PAGE);

  const paginatedQueries = filteredQueries.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Keep currentPage in range if the filtered list shrinks (e.g. after search)
  useEffect(() => {
    if (currentPage > 1 && paginatedQueries.length === 0) {
      setCurrentPage(1);
    }
  }, [filteredQueries.length]); // eslint-disable-line react-hooks/exhaustive-deps

  // 👉 Open the reply popup for a ticket → load its conversation thread
  const openReplyModal = async (query) => {
    setActiveTicket(query);
    setConversation([]);
    setReplyText("");
    setLoadingConversation(true);

    try {
      const res = await publicAxios.get(
        `${ApiKey.GetTicketConversation}/${query.id}/conversation`
      );
      setConversation(res.data || []);
    } catch (error) {
      console.error("Failed to load conversation:", error);
      setConversation([]);
    } finally {
      setLoadingConversation(false);
    }
  };

  const closeReplyModal = () => {
    setActiveTicket(null);
    setConversation([]);
    setReplyText("");
  };

  // 👉 POST v1/Query/reply
  const sendReply = async () => {
    if (!replyText.trim() || !activeTicket) return;

    setSendingReply(true);
    try {
      const adminId = Number(localStorage.getItem("userId")) || 0;

      await publicAxios.post(ApiKey.ReplyToQuery, {
        queryId: activeTicket.id,
        chats: replyText,
        chatsPersonId: adminId,
        createdBy: adminId,
      });

      setReplyText("");

      const res = await publicAxios.get(
        `${ApiKey.GetTicketConversation}/${activeTicket.id}/conversation`
      );
      setConversation(res.data || []);

      // Refresh the card list so IsReplyFlag / status pill stay current
      fetchAllQueries();
    } catch (error) {
      console.error("Failed to send reply:", error);
    } finally {
      setSendingReply(false);
    }
  };

  return (
    <>
      <Header variant="sponsor-profile" />

      <div className="page-split">
        {/* LEFT SIDEBAR */}
        <div className="left-container">
          <SponsorLayout
            name={sponsorName}
            handleLogout={handleLogout}
            scholarshipOnly
          />
        </div>

        {/* RIGHT MAIN */}
        <div className="right-container">
          <div className="mobile-sponsor">
            <SponsorLayout
              name={sponsorName}
              handleLogout={handleLogout}
              scholarshipOnly
            />
          </div>

          <div className="container">
            <div className="scholarship-page mt-5">
              <h2 className="page-title mt-5">Support Queries</h2>
              <p className="page-subtitle">
                Manage student queries and respond to open tickets.
              </p>

              {/* SEARCH & FILTER (no Add button) */}
              <div className="scholarship-actions">
                <input
                  type="text"
                  placeholder="Search by subject or student..."
                  value={searchText}
                  onChange={(e) => {
                    setSearchText(e.target.value);
                    setCurrentPage(1);
                  }}
                  style={{ padding: "0.5rem", width: "200px" }}
                />

                <div className="scholarship-actions-right">
                  <select
                    value={statusFilter}
                    onChange={(e) => {
                      setStatusFilter(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="applications-filter"
                  >
                    {STATUS_OPTIONS.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* CARD LIST */}
              <div className="query-admin-list">
                {loading ? (
                  <div className="query-admin-empty">Loading queries...</div>
                ) : filteredQueries.length === 0 ? (
                  <div className="query-admin-empty">No queries found.</div>
                ) : (
                  paginatedQueries.map((q) => (
                    <div className="query-card" key={q.id}>
                      <div className="query-card-top">
                        <div className="query-card-titles">
                          <div className="query-card-student">
                            {q.studentName}
                          </div>
                          <div className="query-card-subject">
                            Ticket #{q.id} — {q.subject}
                          </div>
                        </div>
                        <span className={statusClass(q.status)}>
                          {q.status}
                        </span>
                      </div>

                      <div className="query-card-footer">
                        {q.isReplyFlag ? (
                          <span className="pending-pill">Pending reply</span>
                        ) : (
                          <span className="responded-pill">Responded</span>
                        )}

                        {q.status?.toLowerCase() !== "closed" && (
  <button
    type="button"
    className="reply-btn"
    onClick={() => openReplyModal(q)}
  >
    Reply
  </button>
)}
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* PAGINATION */}
              {filteredQueries.length > 0 && totalPages > 1 && (
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
          </div>
        </div>
      </div>

      {/* 👉 REPLY POPUP */}
      {activeTicket && (
        <div className="reply-modal-overlay" onClick={closeReplyModal}>
          <div
            className="reply-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="reply-modal-header">
              <div className="reply-modal-titles">
                <div className="reply-modal-subject">
                  Ticket #{activeTicket.id} — {activeTicket.subject}
                </div>
                <div className="reply-modal-student">
                  {activeTicket.studentName}
                </div>
              </div>
              <button
                type="button"
                className="reply-modal-close"
                onClick={closeReplyModal}
              >
                ✕
              </button>
            </div>

            <div className="reply-modal-body">
              {loadingConversation ? (
                <div className="query-admin-empty">
                  Loading conversation...
                </div>
              ) : conversation.length === 0 ? (
                <div className="query-admin-empty">No messages yet.</div>
              ) : (
                conversation.map((c) => {
                  const isStudentMsg =
                    c.chatsPersonId === activeTicket.studentId;
                  const senderName = isStudentMsg
                    ? activeTicket.studentName
                    : sponsorName;

                  return (
                    <div
                      key={c.chatId}
                      className={`reply-msg ${
                        isStudentMsg ? "from-student" : "from-sponsor"
                      }`}
                    >
                      <div className="reply-msg-sender">{senderName}</div>
                      <div className="reply-msg-bubble">{c.message}</div>
                      <div className="reply-msg-time">
                        {getRelativeTime(c.createdDate)}
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {activeTicket.status?.toLowerCase() !== "closed" && (
  <div className="reply-modal-footer">
    <input
      type="text"
      className="reply-modal-input"
      placeholder="Type your reply..."
      value={replyText}
      onChange={(e) => setReplyText(e.target.value)}
      onKeyDown={(e) => e.key === "Enter" && sendReply()}
      disabled={sendingReply}
    />

    <button
      type="button"
      className="send-btn"
      onClick={sendReply}
      disabled={!replyText.trim() || sendingReply}
    >
      {sendingReply ? "Sending..." : "Send"}
    </button>
  </div>
)}
          </div>
        </div>
      )}
    </>
  );
};

export default QueryAdminList;