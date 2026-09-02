import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import "./chatwidget.css";
import { publicAxios } from "../../api/config";
import { ApiKey } from "../../api/endpoint";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { routePath as RP } from "../../app/components/router/routepath";

// 👉 FAQ SOURCE FILE
// This must live in the `public` folder (NOT src) because it's fetched
// at runtime as a plain static asset — files under src get bundled and
// are not reachable by URL.
//
//   Move it to:  public/VidyaSetu_All_FAQ_Updated.txt
//
// If your app is deployed under a sub-path, adjust FAQ_FILE_URL below.
const FAQ_FILE_URL = "/VidyaSetu_All_FAQ_Updated.txt";

// 👉 Parses the numbered "N. Question? Answer: ...answer..." blocks out
// of the raw FAQ text file into [{ q, a }, ...]. Stops each answer at
// the next numbered question or the next ALL-CAPS section heading
// (e.g. "HELP & SUPPORT"), so section headers themselves are skipped.
const parseFaqText = (rawText) => {
  if (!rawText) return [];

  const text = rawText.replace(/\r\n/g, "\n");

  const entryRegex =
    /(\d+)\.\s+([\s\S]*?\?)\s*Answer:\s*([\s\S]*?)(?=\n\s*\d+\.\s+\S|\n\s*[A-Z][A-Z0-9 &/\-\u2013]{3,}\s*\n|\s*$)/g;

  const faqs = [];
  let match;

  while ((match = entryRegex.exec(text)) !== null) {
    const question = match[2].replace(/\s+/g, " ").trim();
    const answer = match[3].replace(/\s+/g, " ").trim();
    if (question && answer) {
      faqs.push({ q: question, a: answer });
    }
  }

  return faqs;
};

const ChatWidget = () => {
  const [showChat, setShowChat] = useState(false);
  const [hoverMenu, setHoverMenu] = useState(false);
  const [messages, setMessages] = useState([
    { sender: "agent", text: "Hi! Search your Scholarship" },
  ]);
  const [input, setInput] = useState("");
  const hasClosedRef = useRef(false);
  const [sessionId, setSessionId] = useState(null);
  const navigate = useNavigate();
  const chatEndRef = useRef(null);
  const [isTyping, setIsTyping] = useState(false);

  // 👉 Container ref — used to detect taps OUTSIDE the floating button/menu
  // so the menu can be closed on mobile (no mouseleave event on touch).
  const floatContainerRef = useRef(null);

  // 👉 RAISE A QUERY popup state
  const [showRaiseQuery, setShowRaiseQuery] = useState(false);
  const [raiseQueryView, setRaiseQueryView] = useState("form"); // "form" | "tickets" | "thread"
  const [subjectText, setSubjectText] = useState("");
  const [queryText, setQueryText] = useState("");
  const [submittingQuery, setSubmittingQuery] = useState(false);
  const [querySubmitted, setQuerySubmitted] = useState(false);
  const [tickets, setTickets] = useState([]);
  const [loadingTickets, setLoadingTickets] = useState(false);

  // 👉 TICKET THREAD (conversation) state
  const [activeTicket, setActiveTicket] = useState(null); // { ticketId, subject, status, ... }
  const [conversation, setConversation] = useState([]);
  const [loadingConversation, setLoadingConversation] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [sendingReply, setSendingReply] = useState(false);
  const threadEndRef = useRef(null);

  // 👉 FAQ popup state
  const [showFAQ, setShowFAQ] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState(null);
  const [faqData, setFaqData] = useState([]);
  const [faqLoading, setFaqLoading] = useState(false);
  const [faqError, setFaqError] = useState(null);
  const [faqSearchQuery, setFaqSearchQuery] = useState("");

  // 👉 Login-required prompt state (shown instead of Chat AI / Raise Query
  // when the person isn't logged in)
  const [showLoginAlert, setShowLoginAlert] = useState(false);

  // Auto-scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Auto-scroll ticket thread
  useEffect(() => {
    threadEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversation]);

  useEffect(() => {
    const handleTabClose = (e) => {
      const storedSession = localStorage.getItem("chatSessionId");
      const userId = localStorage.getItem("userId");

      // ⭐ Call API synchronously best effort
      if (storedSession) {
        publicAxios
          .post(`${ApiKey.GetSessionClosed}?sessionId=${userId}`)
          .catch((err) => console.log("tab close api fail"));
      }

      // ⭐ Remove ONLY this key
      localStorage.removeItem("chatSessionId");
    };

    window.addEventListener("beforeunload", handleTabClose);

    return () => {
      window.removeEventListener("beforeunload", handleTabClose);
    };
  }, []);

  // 👉 Close the Help & Support menu when tapping/clicking OUTSIDE it.
  // This is what makes tap-to-open work correctly on mobile — desktop
  // still gets the hover behavior via onMouseEnter/onMouseLeave below,
  // but touch devices rely entirely on this + the onClick toggle.
  useEffect(() => {
    if (!hoverMenu) return;

    const handleOutsideClick = (e) => {
      if (
        floatContainerRef.current &&
        !floatContainerRef.current.contains(e.target)
      ) {
        setHoverMenu(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("touchstart", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("touchstart", handleOutsideClick);
    };
  }, [hoverMenu]);

  // 👉 LOGIN CHECK — same convention the rest of the app uses (token +
  // expiresAt in localStorage) to decide whether someone is logged in.
  const isLoggedIn = () => {
    const token = localStorage.getItem("token");
    const expiry = localStorage.getItem("expiresAt");
    return !!token && !!expiry;
  };

  const promptLogin = () => {
    setHoverMenu(false);
    setShowLoginAlert(true);
  };

  const goToLogin = () => {
    setShowLoginAlert(false);
    navigate(RP.login);
  };

  const goToSignup = () => {
    setShowLoginAlert(false);
    navigate(RP.signup);
  };

  // 👉 OPEN CHAT → CHECK SESSION OR CREATE NEW
  const handleOpenChat = async () => {
    if (!isLoggedIn()) {
      promptLogin();
      return;
    }

    setHoverMenu(false);
    setShowRaiseQuery(false); // don't let both popups be open at once
    setShowFAQ(false);
    setShowChat(true);

    let storedSession = localStorage.getItem("chatSessionId");

    if (!storedSession) {
      try {
        const userId = localStorage.getItem("userId") || null;

        const res = await publicAxios.post(
          `${ApiKey.GetSessionId}?userid=${userId}`
        );

        const newSessionId = res.data.sessionId.sessionId;
        localStorage.setItem("chatSessionId", newSessionId);

        setSessionId(newSessionId);
      } catch (error) {
        console.error("Session creation failed:", error);
        setSessionId("");
      }
    } else {
      setSessionId(storedSession);
    }
  };

  // 👉 RAISE A QUERY → open the full-screen query card (Subject + Description form)
  const handleRaiseQuery = () => {
    if (!isLoggedIn()) {
      promptLogin();
      return;
    }

    setHoverMenu(false);
    setShowChat(false); // don't let both popups be open at once
    setShowFAQ(false);
    setQuerySubmitted(false);
    setSubjectText("");
    setQueryText("");
    setRaiseQueryView("form");
    setActiveTicket(null);
    setConversation([]);
    setShowRaiseQuery(true);
  };

  // 👉 FAQ — no login required, general help content.
  // Reads Q&A pairs from the FAQ text file (fetched once, then cached in
  // state so re-opening the popup doesn't re-fetch).
  const handleOpenFAQ = async () => {
    setHoverMenu(false);
    setShowChat(false);
    setShowRaiseQuery(false);
    setOpenFaqIndex(null);
    setShowFAQ(true);

    if (faqData.length > 0 || faqLoading) return;

    setFaqLoading(true);
    setFaqError(null);

    try {
      const res = await fetch(FAQ_FILE_URL);
      if (!res.ok) {
        throw new Error(`Failed to load FAQ file (status ${res.status})`);
      }
      const rawText = await res.text();
      const parsed = parseFaqText(rawText);
      setFaqData(parsed);
    } catch (error) {
      console.error("Failed to load FAQ:", error);
      setFaqError("Couldn't load FAQs right now. Please try again later.");
    } finally {
      setFaqLoading(false);
    }
  };

  const toggleFaq = (idx) => {
    setOpenFaqIndex((prev) => (prev === idx ? null : idx));
  };

  // 👉 Filter FAQs based on search query
  const getFilteredFaqs = () => {
    if (!faqSearchQuery.trim()) return faqData;
    
    const query = faqSearchQuery.toLowerCase();
    return faqData.filter(
      (item) =>
        item.q.toLowerCase().includes(query) ||
        item.a.toLowerCase().includes(query)
    );
  };

  // 👉 MY TICKETS → switch the same card to a ticket-list view
  // GET v1/Query/student/{studentId}
  const fetchTickets = async () => {
    setLoadingTickets(true);
    try {
      const studentId = localStorage.getItem("userId");

      if (!studentId) {
        setTickets([]);
        return;
      }

      const res = await publicAxios.get(
        `${ApiKey.GetMyTickets}/${studentId}`
      );

      setTickets(res.data || []);
    } catch (error) {
      console.error("Failed to load tickets:", error);
      setTickets([]);
    } finally {
      setLoadingTickets(false);
    }
  };

  const openMyTickets = () => {
    setRaiseQueryView("tickets");
    setActiveTicket(null);
    setConversation([]);
    fetchTickets();
  };

  const openNewQueryForm = () => {
    setRaiseQueryView("form");
    setQuerySubmitted(false);
    setSubjectText("");
    setQueryText("");
    setActiveTicket(null);
    setConversation([]);
  };

  // 👉 OPEN A TICKET THREAD
  // GET v1/Query/{id}/conversation
  const openTicketThread = async (ticket) => {
    setActiveTicket(ticket);
    setRaiseQueryView("thread");
    setLoadingConversation(true);
    setReplyText("");

    try {
      const res = await publicAxios.get(
        `${ApiKey.GetTicketConversation}/${ticket.ticketId}/conversation`
      );
      setConversation(res.data || []);
    } catch (error) {
      console.error("Failed to load conversation:", error);
      setConversation([]);
    } finally {
      setLoadingConversation(false);
    }
  };

  const backToTicketList = () => {
    setActiveTicket(null);
    setConversation([]);
    setRaiseQueryView("tickets");
    fetchTickets(); // refresh statuses/last activity
  };

  // 👉 SEND A REPLY inside a ticket thread
  // POST v1/Query/reply
  const sendReply = async () => {
    if (!replyText.trim() || !activeTicket) return;

    setSendingReply(true);
    try {
      const userId = Number(localStorage.getItem("userId")) || 0;

      await publicAxios.post(ApiKey.ReplyToQuery, {
        queryId: activeTicket.ticketId,
        chats: replyText,
        chatsPersonId: userId,
        createdBy: userId,
      });

      // Optimistically append, then re-fetch for the authoritative copy
      setConversation((prev) => [
        ...prev,
        {
          chatId: `temp-${Date.now()}`,
          queryId: activeTicket.ticketId,
          message: replyText,
          chatsPersonId: userId,
          createdDate: new Date().toISOString(),
          createdBy: userId,
        },
      ]);
      setReplyText("");

      const res = await publicAxios.get(
        `${ApiKey.GetTicketConversation}/${activeTicket.ticketId}/conversation`
      );
      setConversation(res.data || []);
    } catch (error) {
      console.error("Failed to send reply:", error);
    } finally {
      setSendingReply(false);
    }
  };

  // 👉 SUBMIT the raised query
  // POST v1/Query
  const submitQuery = async () => {
    if (!subjectText.trim() || !queryText.trim()) return;
    setSubmittingQuery(true);
    try {
      const studentId = Number(localStorage.getItem("userId")) || 0;

      await publicAxios.post(ApiKey.RaiseQuery, {
        subject: subjectText,
        studentId,
        description: queryText,
        createdBy: studentId,
      });
    } catch (error) {
      console.error("Raise query failed:", error);
    } finally {
      setSubmittingQuery(false);
      setQuerySubmitted(true);
      setSubjectText("");
      setQueryText("");
    }
  };

  //close session
  const closeChatSession = async () => {
    try {
      const userId = localStorage.getItem("userId");
      if (!userId) return;

      await publicAxios.post(`${ApiKey.GetSessionClosed}?sessionId=${userId}`);
      //localStorage.clear();
      localStorage.removeItem("chatSessionId");
    } catch (error) {
      console.error("Failed to close session:", error);
    }
  };

  // 👉 SEND MESSAGE
  const sendMessage = async () => {
    if (!input.trim()) return;

    setMessages((prev) => [...prev, { sender: "user", text: input }]);

    const messageToSend = input;
    setInput("");
    setIsTyping(true);
    try {
      const payload = {
        sessionId: localStorage.getItem("chatSessionId")
          ? Number(localStorage.getItem("chatSessionId"))
          : sessionId,
        message: messageToSend,
        sender: localStorage.getItem("username") || "user",
      };

      const res = await publicAxios.post(ApiKey.InsertChat, payload);

      // 🌟 API RETURNS { answer: "...message..." }
      const answer = res.data.answer;

      setMessages((prev) => [...prev, { sender: "agent", text: answer }]);
    } catch (error) {
      console.error(error);
      setMessages((prev) => [
        ...prev,
        { sender: "agent", text: "Sorry, something went wrong." },
      ]);
    }
    setIsTyping(false);
  };

  // 👉 Format a date as relative time: "just now", "5 mins ago", "2 hours ago", "3 days ago"
  // Parses a date string coming from the API as IST (+05:30), regardless of
  // whether it already has a timezone suffix or not. Backend saves IST-local
  // values (via DATEADD(MINUTE, 330, GETUTCDATE())), so we must tell the
  // browser explicitly "this is +05:30" instead of letting it assume its own
  // local timezone — otherwise the elapsed-time math comes out hours off.
  const parseAsIst = (dateValue) => {
    if (!dateValue) return NaN;

    let str = String(dateValue).trim();

    // Normalize "2026-08-28 15:27:01.687" -> "2026-08-28T15:27:01.687"
    str = str.replace(" ", "T");

    // Strip any timezone info the string might already carry (Z or ±HH:MM),
    // since we want to force-interpret it as IST regardless.
    str = str.replace(/(Z|[+-]\d{2}:\d{2})$/, "");

    return new Date(`${str}+05:30`).getTime();
  };

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

  const parseScholarships = (text) => {
    if (!text) return null;

    try {
      const data = JSON.parse(text);

      if (!data.hasMatches) {
        return {
          hasMatches: false,
          message: data.message,
          scholarships: [],
        };
      }

      return {
        hasMatches: true,
        message: data.message,
        scholarships: data.scholarships || [],
      };
    } catch {
      return null;
    }
  };

  return (
    <>
      {/* Floating Button — hover (desktop) OR tap (mobile) to reveal
          Chat with AI / Raise a Query / FAQ. Always rendered regardless
          of login state — clicking Chat AI / Raise Query while logged
          out shows the login prompt instead of proceeding. */}
      <div
        className="chat-float-container"
        ref={floatContainerRef}
        onMouseEnter={() => setHoverMenu(true)}
        onMouseLeave={() => setHoverMenu(false)}
      >
        {hoverMenu && (
          <div className="chat-float-menu">
            <button
              type="button"
              className="chat-float-menu-item"
              onClick={handleOpenChat}
            >
              💬 Chat with AI
            </button>
            {localStorage.getItem("roleName")?.toLowerCase() !== "sponsor" && (
              <button
                type="button"
                className="chat-float-menu-item"
                onClick={handleRaiseQuery}
              >
                📝 Raise a Query
              </button>
            )}
            <button
              type="button"
              className="chat-float-menu-item"
              onClick={handleOpenFAQ}
            >
              ❓ FAQs
            </button>
          </div>
        )}

        <div
          className="chat-float-row"
          onClick={() => setHoverMenu((prev) => !prev)}
        >
          <div className="chat-float-btn">🎧</div>
          <span className="chat-float-text">Help &amp; Support</span>
        </div>
      </div>

      {/* LOGIN REQUIRED PROMPT */}
      {showLoginAlert && (
        <div
          className="login-alert-overlay"
          onClick={() => setShowLoginAlert(false)}
        >
          <div
            className="login-alert-box"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="login-alert-title">Please login / Sign up</div>
            <p className="login-alert-text">
              
             
             Already have an account? Log in. 
             New here? Sign up to access this feature.
            </p>
            <div className="login-alert-actions">
              <button
                type="button"
                className="cancel-btn"
                onClick={() => setShowLoginAlert(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="cancel-btn"
                style={{ borderColor: "#fe8200", color: "#fe8200" }}
                onClick={goToSignup}
              >
                Sign Up
              </button>
              <button
                type="button"
                className="send-btn"
                onClick={goToLogin}
              >
                Go to Login
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CHAT POPUP — same overlay/size as Raise a Query so both boxes
          match exactly (reuses raise-query-popup / raise-query-fullscreen). */}
      {showChat && (
        <div
          className="raise-query-overlay"
          onClick={() => setShowChat(false)}
        >
          <div
            className="chat-popup raise-query-popup raise-query-fullscreen"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="chat-header raise-query-header">
              <span>Support Chat</span>
              <button
                className="close-chat"
                onClick={() => setShowChat(false)}
              >
                ✕
              </button>
            </div>
            <div className="chat-body">
              {messages.map((msg, idx) => {
                const scholarships =
                  msg.sender === "agent" ? parseScholarships(msg.text) : null;

                return (
                  <p
                    key={idx}
                    className={
                      msg.sender === "user" ? "user-msg" : "agent-msg"
                    }
                  >
                    <strong>{msg.sender === "user" ? "You" : "Agent"}:</strong>{" "}

                    {msg.sender === "agent" && scholarships ? (
                      <>
                        {/* Agent message */}
                        <span>{scholarships.message}</span>

                        {/* Show table only if matches */}
                        {scholarships.hasMatches && (
                          <table className="chat-table">
                            <thead>
                              <tr>
                                <th>S.No</th>
                                <th>Scholarship</th>
                              </tr>
                            </thead>
                            <tbody>
                              {scholarships.scholarships.map((s, i) => (
                                <tr key={i}>
                                  <td>{i + 1}</td>
                                  <td
                                    className="chat-link"
                                    onClick={() =>
                                      navigate(
                                        `${RP.scholarshipViewPage}?id=${s.scholarshipId}`
                                      )
                                    }
                                  >
                                    {s.name}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        )}
                      </>
                    ) : (
                      <span>{msg.text}</span>
                    )}
                  </p>
                );
              })}
              {/* ⭐ Typing indicator */}
              {isTyping && (
                <p className="agent-msg typing-indicator">
                  <strong>
                    Agent is typing...<span className="dots"></span>
                  </strong>
                </p>
              )}

              <div ref={chatEndRef} />
            </div>

            <div className="chat-input-area">
              <input
                type="text"
                placeholder="Type your message..."
                className="chat-input"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              />
              <button className="send-btn" onClick={sendMessage}>
                Send
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FAQ POPUP — same overlay/size as Raise a Query / Chat AI.
          Q&A pairs are loaded from FAQ_FILE_URL and parsed on first open. */}
      {showFAQ && (
        <div
          className="raise-query-overlay"
          onClick={() => {
            setShowFAQ(false);
            setFaqSearchQuery("");
          }}
        >
          <div
            className="chat-popup raise-query-popup raise-query-fullscreen"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="chat-header raise-query-header">
              <span>Frequently Asked Questions</span>
              <button
                className="close-chat"
                onClick={() => {
                  setShowFAQ(false);
                  setFaqSearchQuery("");
                }}
              >
                ✕
              </button>
            </div>

            {/* FAQ SEARCH INPUT */}
            <div className="faq-search-container">
              <input
                type="text"
                className="faq-search-input"
                placeholder="Search FAQs..."
                value={faqSearchQuery}
                onChange={(e) => setFaqSearchQuery(e.target.value)}
              />
            </div>

            <div className="raise-query-body faq-body">
              {faqLoading && (
                <div className="ticket-empty-state">Loading FAQs...</div>
              )}

              {!faqLoading && faqError && (
                <div className="ticket-empty-state">{faqError}</div>
              )}

              {!faqLoading && !faqError && faqData.length === 0 && (
                <div className="ticket-empty-state">
                  No FAQs available right now.
                </div>
              )}

              {!faqLoading && !faqError && faqData.length > 0 && getFilteredFaqs().length === 0 && (
                <div className="ticket-empty-state">
                  No FAQs match your search.
                </div>
              )}

              {!faqLoading &&
                !faqError &&
                getFilteredFaqs().map((item, idx) => {
                  const isOpen = openFaqIndex === idx;
                  return (
                    <div
                      className={`faq-item ${isOpen ? "open" : ""}`}
                      key={idx}
                    >
                      <button
                        type="button"
                        className="faq-question"
                        onClick={() => toggleFaq(idx)}
                      >
                        <span>{item.q}</span>
                        <span className="faq-caret">{isOpen ? "−" : "+"}</span>
                      </button>
                      {isOpen && (
                        <div className="faq-answer">{item.a}</div>
                      )}
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      )}

      {/* RAISE A QUERY — full-screen overlay */}
      {showRaiseQuery && (
        <div
          className="raise-query-overlay"
          onClick={() => setShowRaiseQuery(false)}
        >
          <div
            className="chat-popup raise-query-popup raise-query-fullscreen"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="chat-header raise-query-header">
              <span>
                {raiseQueryView === "tickets"
                  ? "My Queries"
                  : raiseQueryView === "thread"
                  ? activeTicket
                    ? `Query #${activeTicket.ticketId} — ${activeTicket.subject}`
                    : "Query"
                  : "Raise a Query"}
              </span>
              <div className="raise-query-header-actions">
                {raiseQueryView === "thread" ? (
                  <button
                    type="button"
                    className="my-tickets-btn"
                    onClick={backToTicketList}
                  >
                    ← Back
                  </button>
                ) : raiseQueryView === "tickets" ? (
                  <button
                    type="button"
                    className="my-tickets-btn"
                    onClick={openNewQueryForm}
                  >
                    + New Query
                  </button>
                ) : (
                  <button
                    type="button"
                    className="my-tickets-btn"
                    onClick={openMyTickets}
                  >
                    My Queries
                  </button>
                )}
                <button
                  className="close-chat"
                  onClick={() => setShowRaiseQuery(false)}
                >
                  ✕
                </button>
              </div>
            </div>

            {raiseQueryView === "form" && (
              <>
                <div className="raise-query-body">
                  {querySubmitted ? (
                    <div className="raise-query-success">
                      ✅ Your query has been submitted. Our support team will
                      get back to you soon.
                    </div>
                  ) : (
                    <>
                      <label className="raise-query-label">Subject</label>
                      <input
                        type="text"
                        className="raise-query-input"
                        placeholder="Enter a subject..."
                        value={subjectText}
                        onChange={(e) => setSubjectText(e.target.value)}
                      />

                      <label className="raise-query-label">
                        Describe your issue or question
                      </label>
                      <textarea
                        className="raise-query-textarea"
                        placeholder="Type your query here..."
                        value={queryText}
                        onChange={(e) => setQueryText(e.target.value)}
                        rows={6}
                      />
                    </>
                  )}
                </div>

                <div className="raise-query-footer">
                  {querySubmitted ? (
                    <button
                      className="send-btn"
                      onClick={() => setShowRaiseQuery(false)}
                    >
                      Close
                    </button>
                  ) : (
                    <>
                      <button
                        type="button"
                        className="cancel-btn"
                        onClick={() => {
                          setSubjectText("");
                          setQueryText("");
                          setShowRaiseQuery(false);
                        }}
                      >
                        Cancel
                      </button>
                      <button
                        className="send-btn"
                        onClick={submitQuery}
                        disabled={
                          !subjectText.trim() ||
                          !queryText.trim() ||
                          submittingQuery
                        }
                      >
                        {submittingQuery ? "Submitting..." : "Submit Query"}
                      </button>
                    </>
                  )}
                </div>
              </>
            )}

            {raiseQueryView === "tickets" && (
              <div className="raise-query-body ticket-list-body">
                {loadingTickets ? (
                  <div className="ticket-empty-state">Loading tickets...</div>
                ) : tickets.length === 0 ? (
                  <div className="ticket-empty-state">
                    You haven't raised any queries yet.
                  </div>
                ) : (
                  tickets.map((t, i) => (
                    <div
                      className="ticket-card"
                      key={t.ticketId || i}
                      onClick={() => openTicketThread(t)}
                      role="button"
                      tabIndex={0}
                    >
                      <div className="ticket-title">
                        Query #{t.ticketId} {t.subject}
                      </div>
                      <div className="ticket-activity">
                        Last activity: {getRelativeTime(t.lastActivityDate)}
                      </div>
                      <div className="ticket-status-label">Status</div>
                      <div className="ticket-status-value">{t.status}</div>
                    </div>
                  ))
                )}
              </div>
            )}

            {raiseQueryView === "thread" && (
              <>
                <div className="raise-query-body ticket-thread-body">
                  {loadingConversation ? (
                    <div className="ticket-empty-state">
                      Loading conversation...
                    </div>
                  ) : conversation.length === 0 ? (
                    <div className="ticket-empty-state">
                      No messages yet.
                    </div>
                  ) : (
                    conversation.map((c) => {
                      const currentUserId = Number(
                        localStorage.getItem("userId")
                      );
                      const isMine = c.chatsPersonId === currentUserId;
                      const senderName = isMine
                        ? localStorage.getItem("name") || "You"
                        : "Support";

                      return (
                        <div
                          key={c.chatId}
                          className={`ticket-thread-msg ${
                            isMine ? "from-me" : "from-support"
                          }`}
                        >
                          <div className="ticket-thread-msg-sender">
                            {senderName}
                          </div>
                          <div className="ticket-thread-msg-bubble">
                            {c.message}
                          </div>
                          <div className="ticket-thread-msg-time">
                            {getRelativeTime(c.createdDate)}
                          </div>
                        </div>
                      );
                    })
                  )}
                  <div ref={threadEndRef} />
                </div>

                {activeTicket.status?.toLowerCase() !== "closed" && (
                  <div className="chat-input-area">
                    <input
                      type="text"
                      placeholder="Type your reply..."
                      className="chat-input"
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && sendReply()}
                      disabled={sendingReply}
                    />

                    <button
                      className="send-btn"
                      onClick={sendReply}
                      disabled={!replyText.trim() || sendingReply}
                    >
                      {sendingReply ? "Sending..." : "Send"}
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default ChatWidget;