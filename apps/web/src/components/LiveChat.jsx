"use client";
import { useState } from "react";
import { MessageCircle, X, Send } from "lucide-react";

export default function LiveChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([
    {
      text: "Hi! How can we help you today?",
      sender: "support",
      timestamp: new Date(),
    },
  ]);

  const handleSend = () => {
    if (!message.trim()) return;

    // Add user message
    setMessages([
      ...messages,
      { text: message, sender: "user", timestamp: new Date() },
    ]);
    setMessage("");

    // Simulate support response
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          text: "Thanks for your message! Our team will respond shortly.",
          sender: "support",
          timestamp: new Date(),
        },
      ]);
    }, 1000);
  };

  return (
    <>
      {/* Chat button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 bg-gradient-to-r from-[#5F51FF] to-[#876DFF] text-white p-4 rounded-full shadow-lg hover:from-[#4A3FCC] hover:to-[#6B5AEE] active:from-[#3D34B3] active:to-[#5C4DDD] active:scale-95 hover:transform hover:-translate-y-0.5 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-[#5F51FF] focus:ring-opacity-50 transition-all duration-150 ease-out"
        >
          <MessageCircle size={24} />
        </button>
      )}

      {/* Chat window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-[350px] h-[500px] bg-white dark:bg-[#1E1E1E] rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-200 dark:border-gray-700">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#5F51FF] to-[#876DFF] text-white p-4 flex items-center justify-between">
            <div>
              <h3 className="font-semibold">Live Chat</h3>
              <p className="text-sm text-white/80">We're here to help!</p>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 hover:bg-white/10 rounded-lg transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[75%] rounded-2xl px-4 py-2 ${
                    msg.sender === "user"
                      ? "bg-gradient-to-r from-[#5F51FF] to-[#876DFF] text-white"
                      : "bg-gray-100 dark:bg-gray-800 text-[#1A1A1A] dark:text-white"
                  }`}
                >
                  <p className="text-sm">{msg.text}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex gap-2">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSend()}
                placeholder="Type a message..."
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-full focus:outline-none focus:ring-2 focus:ring-[#5F51FF] focus:border-transparent bg-white dark:bg-gray-800 text-[#1A1A1A] dark:text-white"
              />
              <button
                onClick={handleSend}
                className="bg-gradient-to-r from-[#5F51FF] to-[#876DFF] text-white p-2 rounded-full hover:from-[#4A3FCC] hover:to-[#6B5AEE] active:from-[#3D34B3] active:to-[#5C4DDD] active:scale-95 focus:outline-none focus:ring-2 focus:ring-[#5F51FF] focus:ring-opacity-50 transition-all duration-150"
              >
                <Send size={20} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
