"use client";
import { useState, useEffect } from "react";
import { X } from "lucide-react";

export default function EmailCapture() {
  const [isVisible, setIsVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("");

  useEffect(() => {
    // Show popup after 5 seconds if not already dismissed
    const hasSeenPopup = localStorage.getItem("emailPopupDismissed");
    if (!hasSeenPopup) {
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    localStorage.setItem("emailPopupDismissed", "true");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("loading");

    try {
      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus("success");
        setTimeout(() => {
          handleClose();
        }, 2000);
      } else {
        setStatus("error");
      }
    } catch (error) {
      console.error("Error subscribing:", error);
      setStatus("error");
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="bg-white dark:bg-[#1E1E1E] rounded-2xl p-8 max-w-md mx-4 relative shadow-2xl">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
        >
          <X size={24} />
        </button>

        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-r from-[#5F51FF] to-[#876DFF] rounded-full mx-auto mb-4 flex items-center justify-center">
            <div className="w-8 h-8 bg-white transform rotate-12 rounded-sm"></div>
          </div>
          <h2 className="text-2xl font-bold text-[#1A1A1A] dark:text-white mb-2">
            Get 10% Off Your First Order!
          </h2>
          <p className="text-[#6F6F7B] dark:text-gray-300">
            Subscribe to our newsletter and stay updated with the latest gossip
            and exclusive deals.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5F51FF] focus:border-transparent bg-white dark:bg-gray-800 text-[#1A1A1A] dark:text-white"
          />

          <button
            type="submit"
            disabled={status === "loading"}
            className="w-full bg-gradient-to-r from-[#5F51FF] to-[#876DFF] text-white px-6 py-3 rounded-lg font-semibold hover:from-[#4A3FCC] hover:to-[#6B5AEE] active:from-[#3D34B3] active:to-[#5C4DDD] active:scale-95 hover:transform hover:-translate-y-0.5 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-[#5F51FF] focus:ring-opacity-50 transition-all duration-150 ease-out disabled:opacity-50"
          >
            {status === "loading" ? "Subscribing..." : "Subscribe Now"}
          </button>

          {status === "success" && (
            <p className="text-green-600 dark:text-green-400 text-center text-sm">
              Successfully subscribed! Check your email for your discount code.
            </p>
          )}

          {status === "error" && (
            <p className="text-red-600 dark:text-red-400 text-center text-sm">
              Something went wrong. Please try again.
            </p>
          )}
        </form>

        <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-4">
          We respect your privacy. Unsubscribe at any time.
        </p>
      </div>
    </div>
  );
}
