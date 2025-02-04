import { useState } from "react";

function Chatbot({ userType }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const botResponses = {
    student: [
      "You can solve quizzes, assignments, and papers here!",
      "Need study plans? I can generate one for you.",
      "Remember: Hard work beats talent when talent doesn’t work hard!",
    ],
    teacher: [
      "You can create and review quizzes and assignments.",
      "Want to set a new paper? Let's do it.",
      "Teachers shape the future!",
    ],
    university: [
      "Ask anything related to university services.",
      "Need help with admissions or fees?",
      "University support is here for you!",
    ],
  };

  const handleSend = () => {
    if (!input.trim()) return;
    
    const userMessage = { user: "You", text: input };
    setMessages([...messages, userMessage]);
    setInput("");

    setTimeout(() => {
      const botReply = botResponses[userType]?.[Math.floor(Math.random() * botResponses[userType].length)] || "I'm here to help!";
      setMessages((prev) => [...prev, { user: "Bot", text: botReply }]);
    }, 1000);
  };

  return (
    <div className="chatbot">
      <h2 className="text-xl font-bold text-center mb-2">Chatbot</h2>
      <div className="chatbox">
        {messages.map((msg, index) => (
          <p key={index} className={`p-2 ${msg.user === "You" ? "text-right text-blue-600" : "text-gray-700"}`}>
            <strong>{msg.user}:</strong> {msg.text}
          </p>
        ))}
      </div>
      <input
        type="text"
        className="chat-input"
        placeholder="Type a message..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSend()}
      />
      <button onClick={handleSend} className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md w-full">
        Send
      </button>
    </div>
  );
}

export default Chatbot;
