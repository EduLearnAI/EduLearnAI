import React, { useState, useEffect } from 'react';
import { FiSend, FiMic, FiPaperclip } from 'react-icons/fi';

const ChatbotPage = () => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');

  // Hide global footer on this page (Footer should have id="footer")
  useEffect(() => {
    const footer = document.getElementById('footer');
    if (footer) {
      footer.style.display = 'none';
    }
    return () => {
      if (footer) {
        footer.style.display = 'block';
      }
    };
  }, []);

  const handleSend = () => {
    if (inputValue.trim() !== '') {
      const newMessage = {
        id: messages.length,
        text: inputValue,
        sender: 'user',
        timestamp: new Date().toLocaleTimeString(),
      };
      setMessages([...messages, newMessage]);
      setInputValue('');
    }
  };

  return (
    // Changed from h-screen to h-[90vh] for a slightly smaller overall height
    <div className="flex h-[90vh]">
      {/* Sidebar for Recent Chats */}
      <aside className="w-1/4 bg-gray-100 p-4">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Chats</h2>
        <ul>
          <li className="mb-2 p-2 rounded hover:bg-gray-300 text-gray-900">Chat 1</li>
          <li className="mb-2 p-2 rounded hover:bg-gray-300 text-gray-900">Chat 2</li>
          <li className="mb-2 p-2 rounded hover:bg-gray-300 text-gray-900">Chat 3</li>
        </ul>
      </aside>

      {/* Vertical Yellow Divider */}
      <div className="w-px bg-yellow-400" />

      {/* Chat Section */}
      <div className="flex-1 flex flex-col bg-white">
        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs md:max-w-md lg:max-w-lg px-4 py-2 rounded-lg ${
                  message.sender === 'user'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-800'
                }`}
              >
                {message.text}
                <div className="text-right text-xs text-gray-500">
                  {message.timestamp}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Input Section */}
        <div className="p-4 flex justify-between items-center border-t border-gray-200">
          <FiPaperclip className="text-xl cursor-pointer text-gray-800" />
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            className="flex-1 mx-4 p-2 border border-gray-300 rounded-lg bg-white text-gray-900"
            placeholder="Type your message"
          />
          <FiMic className="text-xl cursor-pointer text-gray-800" />
          <FiSend onClick={handleSend} className="text-xl cursor-pointer text-gray-800" />
        </div>
      </div>
    </div>
  );
};

export default ChatbotPage;
