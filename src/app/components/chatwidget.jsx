import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import "./chatwidget.css";
import { publicAxios } from "../../api/config";
import { ApiKey } from "../../api/endpoint";
 
const ChatWidget = () => {
  const [showChat, setShowChat] = useState(false);
  const [messages, setMessages] = useState([
    { sender: "agent", text: "Hi! Search your Scholarship" },
  ]);
  const [input, setInput] = useState("");
  const hasClosedRef = useRef(false);
  const [sessionId, setSessionId] = useState(null);
 
  const chatEndRef = useRef(null);
  const [isTyping, setIsTyping] = useState(false);
 
 
  // Auto-scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
 
 /* useEffect(() => {
  const checkExpiryAndClose = () => {
    const expiry = localStorage.getItem("expiryAt");
    if (!expiry || hasClosedRef.current) return;
 
    const expiryDateTime = new Date(expiry); // 2026-01-06T12:27:00.3068594Z
    const now = new Date();
     
    if (now.getTime() > expiryDateTime.getTime()) {
      debugger;
      hasClosedRef.current = true;
      closeChatSession(); // ✅ API CALL INSIDE THIS
    }
  };
 
  // run immediately on load
  checkExpiryAndClose();
 
  // then keep checking
  const interval = setInterval(checkExpiryAndClose, 30000);
 
  return () => clearInterval(interval);
}, []);*/
  useEffect(() => {
  const handleTabClose = () => {
    closeChatSession();
  };
 
  window.addEventListener("beforeunload", handleTabClose);
 
  return () => {
    window.removeEventListener("beforeunload", handleTabClose);
  };
}, []);
 
  // 👉 OPEN CHAT → CHECK SESSION OR CREATE NEW
  const handleOpenChat = async () => {
   debugger;
    setShowChat(true);
 
    let storedSession = localStorage.getItem("chatSessionId");
 
    if (!storedSession) {
      try {
        const userId = localStorage.getItem("userId") || null;
 
const res = await publicAxios.post(`${ApiKey.GetSessionId}?userid=${userId}`);      
 
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
 
  //close session
  const closeChatSession = async () => {
  try {
    debugger;
    const userId = localStorage.getItem("userId");
    if (!userId) return;
 
    await publicAxios.post(
      (`${ApiKey.GetSessionClosed}?sessionId=${userId}`)
    );
         localStorage.clear();
    //localStorage.removeItem("chatSessionId");
  } catch (error) {
    console.error("Failed to close session:", error);
  }
};
 
 
  // 👉 SEND MESSAGE
  const sendMessage = async () => {
    debugger;
    if (!input.trim()) return;
 
    setMessages((prev) => [...prev, { sender: "user", text: input }]);
 
    const messageToSend = input;
    setInput("");
 setIsTyping(true);
    try {
     
      const payload = {
        sessionId: localStorage.getItem("chatSessionId")?Number(localStorage.getItem("chatSessionId"))
        :sessionId,
        message: messageToSend,
        sender: localStorage.getItem("username") || "user",
      };
 
      const res = await publicAxios.post(ApiKey.InsertChat,
        payload
      );
 
      // 🌟 API RETURNS { answer: "...message..." }
      const reply = res.data.answer;
 
      setMessages((prev) => [...prev, { sender: "agent", text: reply }]);
    } catch (error) {
      console.error(error);
      setMessages((prev) => [
        ...prev,
        { sender: "agent", text: "Sorry, something went wrong." },
      ]);
    }
      setIsTyping(false);
  };
 
  return (
    <>
      {/* Floating Button */}
      <div className="chat-float-container" onClick={handleOpenChat}>
        <div className="chat-float-btn">💬</div>
        <span className="chat-float-text">Chat Us</span>
      </div>
 
      {/* CHAT POPUP */}
      {showChat && (
        <div className="chat-popup">
          <div className="chat-header">
            <span>Support Chat</span>
            <button className="close-chat" onClick={() => setShowChat(false)}>
              ✕
            </button>
          </div>
 
          <div className="chat-body">
            {messages.map((msg, idx) => (
              <p
                key={idx}
                className={msg.sender === "user" ? "user-msg" : "agent-msg"}
              >
                <strong>{msg.sender === "user" ? "You" : "Agent"}:</strong>{" "}
                {msg.text}
              </p>
            ))}
             {/* ⭐ Agent Typing Indicator */}
  {isTyping && (
    <p className="agent-msg typing-indicator">
      Agent is typing...<span className="dots"></span>
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
      )}
    </>
  );
};
 
export default ChatWidget;