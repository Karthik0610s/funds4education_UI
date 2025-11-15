import React, { useState } from "react";
import "../../pages/styles.css"; // custom styles

export default function MessagesPage() {
  const [messages, setMessages] = useState([
    { from: "Sponsor", subject: "Scholarship Approved. Congratulations!", date: "2025-09-20" },
    { from: "Sponsor", subject: "Submit your documents for verification", date: "2025-09-22" },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [newMessage, setNewMessage] = useState("");

  const handleSend = () => {
    if (!newMessage.trim()) return;

    const newMsg = {
      from: "You",
      subject: newMessage,
      date: new Date().toISOString().slice(0, 10),
    };
    setMessages([newMsg, ...messages]);
    setNewMessage("");
    setShowModal(false);
  };

  return (
    <div className="messages-container">
      {/* Header */}
      <div className="messages-header">
        <h2 className="page-title">Messages</h2>
        <button className="sign-action-btn" onClick={() => setShowModal(true)}>
          + Add Message
        </button>
      </div>

      {/* Messages List */}
      <div className="table-card">
        <table className="messages-table">
          <thead>
            <tr>
              <th>From</th>
              <th>Message</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {messages.map((msg, i) => (
              <tr key={i} className="message-row">
                <td>{msg.from}</td>
                {/* ✅ Show preview only */}
                <td>{msg.subject.length > 40 ? msg.subject.slice(0, 40) + "..." : msg.subject}</td>
                <td className="msg-date">{msg.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            {/* ✅ Modal Header with Close Button */}
            <div className="modal-header">
              <h3>Send New Message</h3>
              <button className="close-btn" 
              onClick={() => {
      setNewMessage("");   // ✅ clear field
      setShowModal(false); // close modal
    }}>×</button>
            </div>

            <div className="modal-body">
              <textarea
                rows="5"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message..."
              />
            </div>

            <div className="modal-actions">
              <button className="sign-action-btn1" onClick={handleSend}>
                Send
              </button>
              <button className="sign-action-btn1 danger" onClick={() => {
      setNewMessage("");   // ✅ clear field
      setShowModal(false); // close modal
    }}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
