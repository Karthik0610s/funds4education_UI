import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import "./chatwidget.css";
import { publicAxios } from "../../api/config";
import { ApiKey } from "../../api/endpoint";
 import { useNavigate, Link , useLocation} from "react-router-dom";
 import { routePath as RP } from "../../app/components/router/routepath";
const ChatWidget = () => {
  const [showChat, setShowChat] = useState(false);
  const [messages, setMessages] = useState([
    { sender: "agent", text: "Hi! Search your Scholarship" },
  ]);
  const [input, setInput] = useState("");
  const hasClosedRef = useRef(false);
  const [sessionId, setSessionId] = useState(null);
 const navigate = useNavigate();
  const chatEndRef = useRef(null);
  const [isTyping, setIsTyping] = useState(false);
 
 
  // Auto-scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
 useEffect(() => {
    const handleTabClose = (e) => {
      const storedSession = localStorage.getItem("chatSessionId");
      const userId = localStorage.getItem("userId");

      // ⭐ Call API synchronously best effort
      if (storedSession) {
        publicAxios.post(
          `${ApiKey.GetSessionClosed}?sessionId=${userId}`
        ).catch(err => console.log("tab close api fail"));
      }

      // ⭐ Remove ONLY this key
      localStorage.removeItem("chatSessionId");
    };

    window.addEventListener("beforeunload", handleTabClose);

    return () => {
      window.removeEventListener("beforeunload", handleTabClose);
    };
  }, []);



  // 👉 OPEN CHAT → CHECK SESSION OR CREATE NEW
  const handleOpenChat = async () => {
   
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
    const userId = localStorage.getItem("userId");
    if (!userId) return;

    await publicAxios.post(
      (`${ApiKey.GetSessionClosed}?sessionId=${userId}`)
    );
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
        sessionId: localStorage.getItem("chatSessionId")?Number(localStorage.getItem("chatSessionId"))
        :sessionId,
        message: messageToSend,
        sender: localStorage.getItem("username") || "user",
      };
 
      const res = await publicAxios.post(ApiKey.InsertChat,
        payload
      );
 
      // 🌟 API RETURNS { answer: "...message..." }
      const answer = res.data.answer;
 
      setMessages((prev) => [...prev,
      { sender: "agent", text: answer }
        
        ]);
     
    } catch (error) {
      console.error(error);
      setMessages((prev) => [
        ...prev,
        { sender: "agent", text: "Sorry, something went wrong." },
      ]);
    }
      setIsTyping(false);
  };

 /*const parseScholarships = (text) => {
  if (!text) return null;

  // paragraph-only cases
  if (
    text.toLowerCase().includes("no matching") ||
    text.toLowerCase().includes("no scholarship") ||
    text.toLowerCase().includes("none.")
  ) {
    return null;
  }

  const lines = text.split("\n").map(l => l.trim()).filter(Boolean);

  let result = [];
  let current = null;

  lines.forEach(line => {
    // Case 1: single-line format
    // - SCH-002: Name — Due Date: 2025-12-31
    let singleMatch = line.match(
      /-\s*(.*?):\s*(.*?)\s*—\s*Due Date:\s*(.*)/i
    );

    if (singleMatch) {
      result.push({
        code: singleMatch[1],
        name: singleMatch[2],
        dueDate: singleMatch[3],
      });
      return;
    }

    // Case 2: multiline format start
    if (line.startsWith("- SCH")) {
      current = {
        code: line.replace("-", "").trim(),
        name: "",
        dueDate: "",
      };
      result.push(current);
      return;
    }

    // scholarship name
    if (current && current.name === "" && line.startsWith("-")) {
      current.name = line.replace("-", "").trim();
      return;
    }

    // due date line
    if (current && line.includes("Due Date:")) {
      current.dueDate = line.split("Due Date:")[1].trim();
      current = null;
    }
  });

  if (result.length === 0) return null;

  return result;
};
*/
/*const parseScholarships = (text) => {
  if (!text) return null;

  const lower = text.toLowerCase();

  // paragraph-only responses
  if (
    lower.includes("no scholarship") ||
    lower.includes("no matching") ||
    lower.includes("for reference")
  ) {
    return null;
  }

  const lines = text.split("\n").map(l => l.trim()).filter(Boolean);

  const results = [];

  // ---------- FORMAT 1 ----------
  // Scholarship Id | Code | Name | Due Date
  lines.forEach(line => {
    if (line.includes("Scholarship Id")) {
      const idMatch = line.match(/Scholarship Id:\s*(\d+)/i);
      const codeMatch = line.match(/Scholarship Code:\s*([^|]+)/i);
      const nameMatch = line.match(/Name:\s*([^|]+)/i);
      const dueMatch = line.match(/Due Date:\s*(.*)/i);

      if (codeMatch && nameMatch) {
        results.push({
          scholarshipId: idMatch?.[1] || null,
          code: codeMatch[1].trim(),
          name: nameMatch[1].trim(),
          dueDate: dueMatch?.[1]?.trim() || ""
        });
      }
    }
  });

  if (results.length) return results;

  // ---------- FORMAT 2 ----------
  // - SCHxxx Name — Due Date
  lines.forEach(line => {
    if (line.startsWith("- SCH")) {
      const parts = line.replace("-", "").split("—");

      if (parts.length >= 2) {
        const first = parts[0].trim();
        const due = parts[1].replace("Due Date:", "").trim();

        const code = first.split(" ")[0];
        const name = first.replace(code, "").trim();

        results.push({
          code,
          name,
          dueDate: due
        });
      }
    }
  });

  if (results.length) return results;

  // ---------- FORMAT 3 ----------
  // multiline block
  let current = {};

  lines.forEach(line => {
    if (line.startsWith("- SCH")) {
      if (current.code && current.name) results.push(current);

      current = { code: line.replace("-", "").trim() };
    }

    else if (line.startsWith("-") && !line.includes("Due Date")) {
      current.name = line.replace("-", "").trim();
    }

    else if (line.includes("Due Date")) {
      current.dueDate = line.split(":")[1]?.trim();
    }
  });

  if (current.code && current.name) results.push(current);

  return results.length ? results : null;
};*/
const parseScholarships = (text) => {
  if (!text) return null;

  try {
    const data = JSON.parse(text);

    if (!data.hasMatches) {
      return {
        hasMatches: false,
        message: data.message,
        scholarships: []
      };
    }

    return {
      hasMatches: true,
      message: data.message,
      scholarships: data.scholarships || []
    };

  } catch {
    return null;
  }
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
  {messages.map((msg, idx) => {
    const scholarships =
      msg.sender === "agent"
        ? parseScholarships(msg.text)
        : null;
 
    return (
      <p
        key={idx}
        className={
          msg.sender === "user" ? "user-msg" : "agent-msg"
        }
      >
        <strong>
          {msg.sender === "user" ? "You" : "Agent"}:
        </strong>{" "}

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
      <strong>Agent is typing...<span className="dots"></span></strong>
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