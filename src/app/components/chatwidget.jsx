import React, { useState } from "react";
import "./chatwidget.css";

const ChatWidget = () => {
  const [showChat, setShowChat] = useState(false);

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
            <p><strong>Agent:</strong> Hi! How can I help you?</p>
          </div>

          <div className="chat-input-area">
            <input type="text" placeholder="Type your message..." className="chat-input" />
            <button className="send-btn">Send</button>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatWidget;
