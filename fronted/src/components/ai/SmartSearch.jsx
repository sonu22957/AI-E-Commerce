import React, { useState, useEffect, useRef } from "react";
import axiosInstance from "../../services/axios";
import Input from "../common/Input";
import Button from "../common/Button";
import { FiSearch, FiClock, FiAlertCircle } from "react-icons/fi";

/**
 * SmartSearch component
 * --------------------
 * Provides an AI‑enhanced search box that queries the backend endpoint
 * `/api/ai/smart-search?q=...` and displays a list of product suggestions.
 *
 * Features:
 *   • Debounced input (300 ms) to avoid excessive network traffic.
 *   • Loading spinner with subtle motion.
 *   • Graceful fallback with mock suggestions when the API is unavailable.
 *   • Fully responsive and adapts to light/dark mode using Tailwind CSS.
 *   • Accessible ARIA attributes for screen readers.
 */
export default function SmartSearch({ onSelect }) {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const debounceTimer = useRef(null);

  // Mock data used when the backend is not reachable (dev mode)
  const mockSuggestions = [
    { id: 1, name: "Elegant Silk Scarf", price: "$29.99" },
    { id: 2, name: "Minimalist Leather Wallet", price: "$49.99" },
    { id: 3, name: "Eco-friendly Bamboo Sunglasses", price: "$39.99" },
  ];

  useEffect(() => {
    // Clear previous timer on query change
    if (debounceTimer.current) clearTimeout(debounceTimer.current);

    if (!query.trim()) {
      setSuggestions([]);
      setError(null);
      return;
    }

    // Debounce the API call
    debounceTimer.current = setTimeout(() => {
      const fetchSuggestions = async () => {
        setLoading(true);
        setError(null);
        try {
          const { data } = await axiosInstance.get("/api/ai/smart-search", {
            params: { q: query },
          });
          setSuggestions(data?.results ?? []);
        } catch (e) {
          // In development we fall back to mock data so UI stays functional
          console.warn("SmartSearch fallback to mock data:", e);
          setSuggestions(mockSuggestions);
          setError("Unable to fetch live results – showing demo data.");
        } finally {
          setLoading(false);
        }
      };
      fetchSuggestions();
    }, 300);

    // Cleanup on unmount
    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, [query]);

  const handleSelect = (item) => {
    if (onSelect) onSelect(item);
    setQuery("");
    setSuggestions([]);
  };

  return (
    <div className="w-full max-w-md mx-auto my-4">
      <div className="relative flex items-center">
        <Input
          type="text"
          placeholder="Search products…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1 pr-10 rounded-full focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
          aria-label="Smart product search"
        />
        <FiSearch className="absolute right-4 text-gray-400 dark:text-gray-300" size={20} />
      </div>

      {loading && (
        <div className="flex items-center mt-2 text-indigo-600 dark:text-indigo-400">
          <FiClock className="animate-spin mr-2" /> Loading suggestions…
        </div>
      )}

      {error && (
        <div className="flex items-center mt-2 text-red-600 dark:text-red-400">
          <FiAlertCircle className="mr-2" /> {error}
        </div>
      )}

      {suggestions.length > 0 && (
        <ul className="mt-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {suggestions.map((item) => (
            <li
              key={item.id}
              className="flex justify-between items-center px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
              onClick={() => handleSelect(item)}
            >
              <span className="text-sm font-medium dark:text-white">{item.name}</span>
              <span className="text-sm text-gray-600 dark:text-gray-300">{item.price}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
