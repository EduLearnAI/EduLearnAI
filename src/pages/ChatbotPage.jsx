import React, { useState, useEffect, useRef } from "react";
import { FiSend, FiPaperclip, FiMic } from "react-icons/fi";
import { useLocation } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";

const backendBaseUrl = "https://mominah-edulearnai.hf.space";

const ChatbotPage = () => {
  // States for bot, chat, messages, etc.
  const [botId, setBotId] = useState(Cookies.get("bot_id") || null);
  const [chatId, setChatId] = useState(Cookies.get("chat_id") || null);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [chats, setChats] = useState([]);
  const [kbUploading, setKbUploading] = useState(false);
  const [dataUploaded, setDataUploaded] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState("");
  const [isCreatingBot, setIsCreatingBot] = useState(false);
  const [createBotSuccess, setCreateBotSuccess] = useState("");
  // State to track the current step.
  const [currentStep, setCurrentStep] = useState("initializeBot");
  // New state to toggle previous chats on mobile.
  const [showPrevChats, setShowPrevChats] = useState(false);

  const access_token = Cookies.get("access_token");
  const location = useLocation();
  const knowledgeBaseFileInputRef = useRef(null);

  // Determine prompt template based on navigation.
  const determineTemplate = () => {
    if (location.state && location.state.customPrompt) {
      return location.state.customPrompt;
    }
    if (location.state && location.state.task) {
      const taskLower = location.state.task.toLowerCase();
      if (taskLower.includes("solve")) {
        if (taskLower.includes("quiz")) return "quiz_solving";
        if (taskLower.includes("assignment")) return "assignment_solving";
        if (taskLower.includes("paper")) return "paper_solving";
      } else if (taskLower.includes("create")) {
        if (taskLower.includes("quiz")) return "quiz_creation";
        if (taskLower.includes("assignment")) return "assignment_creation";
        if (taskLower.includes("paper")) return "paper_creation";
      }
    }
    return "quiz_solving"; // Default fallback
  };

  // =====================
  // Handlers for actions
  // =====================
  // New Bot
  const handleCreateNewBot = () => {
    if (!access_token) return;
    setIsCreatingBot(true);
    setCreateBotSuccess("");
    const promptType = determineTemplate();
    axios
      .post(
        `${backendBaseUrl}/initialize_bot?prompt_type=${promptType}`,
        {},
        { headers: { Authorization: `Bearer ${access_token}` } }
      )
      .then((res) => {
        const newBotId = res.data.bot_id;
        setBotId(newBotId);
        Cookies.set("bot_id", newBotId, { expires: 7, secure: true });
        console.log("Bot initialized with ID:", newBotId);
        setCreateBotSuccess("Bot created successfully! Now add data.");
        setCurrentStep("addData");
      })
      .catch((err) => {
        console.error("Error creating new bot:", err);
        setCreateBotSuccess("Error creating new bot");
      })
      .finally(() => {
        setIsCreatingBot(false);
      });
  };

  // Add Data: handleKBUpload is triggered on file change (via hidden input)
  const handleKBUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setKbUploading(true);
    setUploadSuccess("");
    const formData = new FormData();
    formData.append("file", file);
    formData.append("bot_id", botId || "");
    try {
      const res = await axios.post(`${backendBaseUrl}/upload_document`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${access_token}`,
        },
      });
      console.log("KB upload response:", res.data);
      setDataUploaded(true);
      setUploadSuccess("Data uploaded successfully!");
      setCurrentStep("createNewChat");
    } catch (err) {
      console.error("Error uploading KB document:", err);
      setUploadSuccess("Error uploading data");
    }
    setKbUploading(false);
  };

  // New Chat
  const handleNewChat = () => {
    if (!botId || !access_token) return;
    axios
      .post(
        `${backendBaseUrl}/create_bot/${botId}`,
        {},
        { headers: { Authorization: `Bearer ${access_token}` } }
      )
      .then(() => {
        return axios.post(
          `${backendBaseUrl}/new_chat/${botId}`,
          {},
          { headers: { Authorization: `Bearer ${access_token}` } }
        );
      })
      .then((res) => {
        const newChatId = res.data.chat_id;
        setChatId(newChatId);
        Cookies.set("chat_id", newChatId, { expires: 7, secure: true });
        setMessages([]);
        console.log("New chat started with ID:", newChatId);
        setCurrentStep("chatScreen");
      })
      .catch((err) =>
        console.error("Error creating new chat:", err.response?.data || err)
      );
  };

  // =====================
  // Previous Chats
  // =====================
  useEffect(() => {
    if (access_token && botId) {
      axios
        .get(`${backendBaseUrl}/list_chats/${botId}`, {
          headers: { Authorization: `Bearer ${access_token}` },
        })
        .then((res) => {
          setChats(res.data.chat_ids || []);
        })
        .catch((err) => console.error("Error listing chats:", err));
    }
  }, [access_token, botId]);

  const loadChatMessages = (selectedChatId) => {
    if (access_token && selectedChatId) {
      axios
        .get(`${backendBaseUrl}/chat_history/${selectedChatId}?bot_id=${botId}`, {
          headers: { Authorization: `Bearer ${access_token}` },
        })
        .then((res) => {
          setMessages(res.data);
          setChatId(selectedChatId);
          Cookies.set("chat_id", selectedChatId, { expires: 7, secure: true });
        })
        .catch((err) => console.error("Error loading chat history:", err));
    }
  };

  // =====================
  // Mic Handler (for future voice input)
  // =====================
  const handleMicClick = () => {
    console.log("Mic icon clicked");
  };

  // =====================
  // Chat Query (with streaming effect)
  // =====================
  const streamResponse = (fullText) => {
    const tokens = fullText.split(" ");
    let index = 0;
    let currentText = "";
    const intervalId = setInterval(() => {
      currentText += tokens[index] + " ";
      setMessages((prevMessages) => {
        const updatedMessages = [...prevMessages];
        if (
          updatedMessages.length > 0 &&
          updatedMessages[updatedMessages.length - 1].sender === "system"
        ) {
          updatedMessages[updatedMessages.length - 1].text = currentText.trim();
        }
        return updatedMessages;
      });
      index++;
      if (index >= tokens.length) {
        clearInterval(intervalId);
      }
    }, 100);
  };

  const handleSend = () => {
    if (inputValue.trim() === "" || !botId || !chatId) return;
    const userMsg = {
      id: messages.length,
      text: inputValue,
      sender: "user",
      timestamp: new Date().toLocaleTimeString(),
    };
    setMessages((prev) => [...prev, userMsg]);

    axios
      .post(
        `${backendBaseUrl}/query`,
        { query: inputValue, bot_id: botId, chat_id: chatId },
        { headers: { Authorization: `Bearer ${access_token}` } }
      )
      .then((res) => {
        const answer = res.data.response;
        const systemMsg = {
          id: messages.length + 1,
          text: answer,
          sender: "system",
          timestamp: new Date().toLocaleTimeString(),
        };
        setMessages((prev) => [...prev, systemMsg]);
        streamResponse(answer);
      })
      .catch((err) => console.error("Error getting response:", err));
    setInputValue("");
  };

  return (
    <div className="flex flex-col md:flex-row h-full min-h-screen">
      {/* Sidebar */}
      <aside className="w-full md:w-1/4 bg-gray-100 p-4 overflow-y-auto">
        {/* New Action Buttons */}
        <div className="mb-6 space-y-4">
          <button
            type="button"
            onClick={handleCreateNewBot}
            title="Create a new bot"
            className="w-full font-bold py-2 px-4 rounded-lg shadow-md bg-blue-500 text-white hover:bg-blue-600 hover:scale-105 transition-all duration-300"
          >
            New Bot
          </button>
          <button
            type="button"
            onClick={() =>
              knowledgeBaseFileInputRef.current && knowledgeBaseFileInputRef.current.click()
            }
            title="Add data to bot"
            className="w-full bg-yellow-400 text-gray-900 font-bold py-2 px-4 rounded-lg shadow-md hover:bg-yellow-500 hover:scale-105 transition-all duration-300"
          >
            Add Data
          </button>
          <button
            type="button"
            onClick={handleNewChat}
            title="Start a new chat session"
            className="w-full bg-green-500 text-white font-bold py-2 px-4 rounded-lg shadow-md hover:bg-green-600 hover:scale-105 transition-all duration-300"
          >
            New Chat
          </button>
        </div>

        {/* Conditional step instructions (optional) */}
        {currentStep !== "chatScreen" && (
          <div className="mb-6">
            <p className="text-lg font-semibold">
              Please follow the steps to initialize your bot, add data, and start a new chat.
            </p>
          </div>
        )}

        {/* Previous Chats */}
        <h2 className="text-lg font-bold mb-2">Previous Chats</h2>
        {/* Desktop View: Always visible */}
        <div className="hidden md:block">
          {chats.length > 0 ? (
            <ul className="space-y-2">
              {chats.map((chat) => (
                <li
                  key={chat}
                  className="p-2 rounded hover:bg-gray-300 cursor-pointer transition-all duration-300"
                  title="Load this chat's conversation history."
                  onClick={() => loadChatMessages(chat)}
                >
                  <div className="font-semibold">Chat: {chat}</div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-600 text-sm">No previous chats found.</p>
          )}
        </div>
        {/* Mobile View: Toggle to show/hide previous chats in a collapsible section */}
        <div className="block md:hidden">
          <button
            onClick={() => setShowPrevChats(!showPrevChats)}
            className="w-full bg-blue-500 text-white py-2 px-4 rounded mb-2"
          >
            {showPrevChats ? "Hide Previous Chats" : "Show Previous Chats"}
          </button>
          {showPrevChats && (
            <div className="max-h-40 overflow-y-auto">
              {chats.length > 0 ? (
                <ul className="space-y-2">
                  {chats.map((chat) => (
                    <li
                      key={chat}
                      className="p-2 rounded hover:bg-gray-300 cursor-pointer transition-all duration-300"
                      title="Load this chat's conversation history."
                      onClick={() => loadChatMessages(chat)}
                    >
                      <div className="font-semibold">Chat: {chat}</div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-600 text-sm">No previous chats found.</p>
              )}
            </div>
          )}
        </div>
      </aside>

      {/* Main Chat/Instruction Area */}
      <div className="flex-1 flex flex-col bg-white">
        {currentStep !== "chatScreen" ? (
          <div className="flex-1 flex justify-center items-center p-4 md:p-8">
            <p className="text-lg font-semibold text-center">
              Please follow the steps in the sidebar to initialize your bot, add data, and create a new chat.
            </p>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto p-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-md px-4 py-2 rounded-lg shadow-md my-2 ${
                      msg.sender === "user" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-800"
                    }`}
                  >
                    {msg.sender === "system" ? (
                      <ReactMarkdown>{msg.text}</ReactMarkdown>
                    ) : (
                      msg.text
                    )}
                    <div className="text-right text-xs text-gray-500">{msg.timestamp}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-4 flex flex-col md:flex-row items-center border-t border-gray-300">
              {/* Mobile Layout for input controls */}
              <div className="flex flex-col w-full md:hidden">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  className="w-full p-2 border border-gray-300 rounded mb-2"
                  placeholder="Type your message"
                />
                <div className="flex justify-between">
                  <motion.button
                    type="button"
                    onClick={() =>
                      knowledgeBaseFileInputRef.current && knowledgeBaseFileInputRef.current.click()
                    }
                    title="Attach a file (e.g., PDF)"
                    className="p-2 hover:bg-gray-200 hover:scale-105 rounded transition-all duration-300"
                  >
                    <FiPaperclip />
                  </motion.button>
                  <motion.button
                    type="button"
                    onClick={handleMicClick}
                    title="Record voice input"
                    className="p-2 hover:bg-gray-200 hover:scale-105 rounded transition-all duration-300"
                  >
                    <FiMic />
                  </motion.button>
                  <motion.button
                    onClick={handleSend}
                    title="Send your message"
                    className="p-2 hover:bg-gray-200 hover:scale-105 rounded transition-all duration-300"
                  >
                    <FiSend />
                  </motion.button>
                </div>
              </div>
              {/* Desktop Layout for input controls */}
              <div className="hidden md:flex items-center w-full">
                <motion.button
                  type="button"
                  onClick={() =>
                    knowledgeBaseFileInputRef.current && knowledgeBaseFileInputRef.current.click()
                  }
                  title="Attach a file (e.g., PDF)"
                  className="p-2 hover:bg-gray-200 hover:scale-105 rounded transition-all duration-300"
                >
                  <FiPaperclip />
                </motion.button>
                <motion.button
                  type="button"
                  onClick={handleMicClick}
                  title="Record voice input"
                  className="p-2 ml-2 hover:bg-gray-200 hover:scale-105 rounded transition-all duration-300"
                >
                  <FiMic />
                </motion.button>
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  className="flex-1 mx-4 p-2 border border-gray-300 rounded"
                  placeholder="Type your message"
                />
                <motion.button
                  onClick={handleSend}
                  title="Send your message"
                  className="p-2 hover:bg-gray-200 hover:scale-105 rounded transition-all duration-300"
                >
                  <FiSend />
                </motion.button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Hidden File Input */}
      <input
        type="file"
        accept="application/pdf"
        ref={knowledgeBaseFileInputRef}
        onChange={handleKBUpload}
        hidden
      />
    </div>
  );
};

export default ChatbotPage;
