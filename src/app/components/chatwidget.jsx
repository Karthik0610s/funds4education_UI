import React, { useState,useRef,useEffect } from "react";
import axios from "axios";
import "./chatwidget.css";
import { publicAxios } from "../../api/config";
import { ApiKey } from "../../api/endpoint";
const ChatWidget = () => {
  const [showChat, setShowChat] = useState(false);
const [messages, setMessages] = useState([
    { sender: "agent", text: "Hi! How can I help you?" },
  ]);
  //const user=localStorage.getItem("userName");
  const [input, setInput] = useState("");
  const [sessionId, setSessionId] = useState(1); // Replace with real session
  const chatEndRef = useRef(null);
 // Auto-scroll to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Send Message to Backend (.NET API)
  const sendMessage = async () => {
    if (!input.trim()) return;

    // Add user's message to UI
    setMessages((prev) => [...prev, { sender: "user", text: input }]);

    const messageToSend = input;
    setInput("");

    try {
      const res = await publicAxios.post(ApiKey.InsertChat, {
        sessionId: sessionId,
        message: messageToSend,
        sender:localStorage.getItem("username")||"agent"
      });

      const reply = res.data;

      setMessages((prev) => [...prev, { sender: "agent", text: reply }]);

    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { sender: "agent", text: "Sorry, something went wrong." },
      ]);
      console.error(error);
    }
  };

  return (
    <>
      {/* Floating Button */}
      <div className="chat-float-container" onClick={() => setShowChat(true)}>
        <div className="chat-float-btn">💬</div>
        <span className="chat-float-text">Chat Us</span>
      </div>

      {/* Popup Window */}
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
            <div ref={chatEndRef} />
          </div>

          
          {/*<div className="chat-body">
            {messages.map((msg, idx) => (
              <p
                key={idx}
                className={msg.sender === "user" ? "user-msg" : "agent-msg"}
              >
                <strong>{msg.sender === "user" ? "You" : "Agent"}:</strong>{" "}
                {msg.text}
              </p>
            ))}
            <div ref={chatEndRef} />
          </div>*/}

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
