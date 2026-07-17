import React, { useState, useRef, useEffect } from "react";
import { FiSend, FiMessageSquare, FiX, FiShoppingCart, FiSearch, FiStar, FiMinus } from "react-icons/fi";
import { BsRobot } from "react-icons/bs";
import axiosInstance from "../../services/axios";

/**
 * AIChatbot — Smart AI Assistant
 * - Searches real products from DB
 * - Adds products to cart
 * - Understands Hinglish and English
 */
export default function AIChatbot() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: "assistant",
      content: "Namaste! 🛍️ Main SmartCart AI hoon!\n\nMujhse ye sab puchh sakte ho:\n• 🔍 \"Show me phones under 50000\"\n• 🛒 \"Add iPhone to cart\"\n• ⭐ \"Best products dikhao\"\n• 📦 \"Electronics category\"\n• 💬 Koi bhi sawaal!",
      products: [],
    },
  ]);
  const [loading, setLoading] = useState(false);
  const [cartMsg, setCartMsg] = useState("");
  const bottomRef = useRef(null);

  useEffect(() => {
    if (open) bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open]);

  const addToCart = async (product) => {
    try {
      await axiosInstance.post("/api/carts", { productId: product._id, quantity: 1 });
      setCartMsg(`✅ "${product.name}" cart mein add ho gaya!`);
      setTimeout(() => setCartMsg(""), 3000);
    } catch {
      // If not logged in, show message
      setCartMsg("⚠️ Cart mein add karne ke liye pehle login karo!");
      setTimeout(() => setCartMsg(""), 3000);
    }
  };

  const handleSend = async () => {
    const text = input.trim();
    if (!text || loading) return;

    const userMsg = { id: Date.now(), role: "user", content: text, products: [] };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const history = messages.slice(1).map((m) => ({ role: m.role, content: m.content }));
      const { data } = await axiosInstance.post("/api/ai/chat", { message: text, history });

      const aiMsg = {
        id: Date.now() + 1,
        role: "assistant",
        content: data.reply || "Koi jawab nahi mila.",
        products: data.products || [],
        intent: data.intent,
        cartResult: data.cartResult,
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (error) {
      console.error("Chat error:", error);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          role: "assistant",
          content: "⚠️ Sorry, abhi connection issue hai. Thodi der baad try karo!",
          products: [],
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Quick suggestion chips
  const suggestions = [
    "Best phones dikhao",
    "Laptops under 100000",
    "Gaming products",
    "Add PS5 to cart",
    "Top rated items",
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {/* Chat Window */}
      {open && (
        <div
          className="w-80 sm:w-[420px] bg-white dark:bg-gray-900 rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-700 flex flex-col overflow-hidden"
          style={{ height: "580px", animation: "slideUp 0.25s ease-out" }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 bg-gradient-to-r from-indigo-600 to-purple-600">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-full bg-white/20 flex items-center justify-center">
                <BsRobot className="h-5 w-5 text-white" />
              </div>
              <div>
                <span className="text-sm font-bold text-white block">SmartCart AI</span>
                <div className="flex items-center gap-1">
                  <div className="h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse" />
                  <span className="text-xs text-indigo-200">Online • Products se connected</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/20 transition-colors"
            >
              <FiX className="h-4 w-4" />
            </button>
          </div>

          {/* Cart notification toast */}
          {cartMsg && (
            <div className="px-4 py-2 bg-green-50 dark:bg-green-900/30 border-b border-green-100 dark:border-green-800">
              <p className="text-xs font-medium text-green-700 dark:text-green-300">{cartMsg}</p>
            </div>
          )}

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4 bg-gray-50 dark:bg-gray-950">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex flex-col ${msg.role === "user" ? "items-end" : "items-start"}`}>
                {/* Bubble */}
                <div
                  className={
                    msg.role === "user"
                      ? "max-w-[85%] px-4 py-2.5 rounded-2xl rounded-tr-sm bg-indigo-600 text-white text-sm"
                      : "max-w-[95%] px-4 py-2.5 rounded-2xl rounded-tl-sm bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 text-sm shadow-sm border border-gray-100 dark:border-gray-700"
                  }
                  style={{ whiteSpace: "pre-wrap" }}
                >
                  {msg.content}
                </div>

                {/* Product Cards (shown for AI messages with products) */}
                {msg.role === "assistant" && msg.products && msg.products.length > 0 && (
                  <div className="mt-2 w-full space-y-2">
                    {msg.products.map((product) => (
                      <div
                        key={product._id}
                        className="flex items-center gap-3 bg-white dark:bg-gray-800 rounded-2xl p-3 border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-all"
                      >
                        {/* Product Image */}
                        <img
                          src={
                            product.images && product.images.length > 0
                              ? product.images[0]
                              : `https://picsum.photos/seed/${product._id}/80/80`
                          }
                          alt={product.name}
                          className="h-14 w-14 rounded-xl object-cover flex-shrink-0"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = `https://picsum.photos/seed/${product._id}/80/80`;
                          }}
                        />
                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-gray-800 dark:text-gray-100 truncate">
                            {product.name}
                          </p>
                          <div className="flex items-center gap-1 mt-0.5">
                            <FiStar className="h-3 w-3 text-yellow-400 fill-current" />
                            <span className="text-xs text-gray-500 dark:text-gray-400">{product.rating || "New"}</span>
                            <span className="text-xs text-gray-300 dark:text-gray-600 mx-1">•</span>
                            <span className="text-xs text-indigo-600 dark:text-indigo-400 font-medium">
                              {product.category}
                            </span>
                          </div>
                          <p className="text-sm font-bold text-gray-900 dark:text-white mt-0.5">
                            ₹{product.price?.toLocaleString("en-IN")}
                          </p>
                        </div>
                        {/* Add to Cart Button */}
                        <button
                          onClick={() => addToCart(product)}
                          className="flex-shrink-0 p-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition-colors"
                          title="Add to Cart"
                        >
                          <FiShoppingCart className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {/* Loading dots */}
            {loading && (
              <div className="flex justify-start">
                <div className="px-4 py-3 bg-white dark:bg-gray-800 rounded-2xl rounded-tl-sm shadow-sm border border-gray-100 dark:border-gray-700 flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-indigo-400 animate-bounce [animation-delay:0ms]" />
                  <span className="h-2 w-2 rounded-full bg-indigo-400 animate-bounce [animation-delay:150ms]" />
                  <span className="h-2 w-2 rounded-full bg-indigo-400 animate-bounce [animation-delay:300ms]" />
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Suggestion Chips */}
          {messages.length <= 1 && (
            <div className="px-3 py-2 flex gap-2 overflow-x-auto border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 scrollbar-hide">
              {suggestions.map((s) => (
                <button
                  key={s}
                  onClick={() => setInput(s)}
                  className="flex-shrink-0 text-xs px-3 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 border border-indigo-100 dark:border-indigo-800 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors"
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div className="flex items-center gap-2 px-3 py-3 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder="Kuch bhi puchho ya search karo..."
              className="flex-1 text-sm rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-4 py-2.5 text-gray-900 dark:text-gray-100 placeholder-gray-400 outline-none focus:ring-2 focus:ring-indigo-500 transition"
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || loading}
              className="p-2.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-indigo-500/30"
            >
              <FiSend className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* FAB Toggle Button */}
      <button
        onClick={() => setOpen((o) => !o)}
        className="h-14 w-14 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-xl shadow-indigo-500/40 flex items-center justify-center transition-all duration-300 hover:scale-110 relative"
      >
        {open ? <FiX className="h-6 w-6" /> : <BsRobot className="h-6 w-6" />}
        {!open && (
          <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-green-500 border-2 border-white animate-pulse" />
        )}
      </button>

      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px) scale(0.95); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
}
