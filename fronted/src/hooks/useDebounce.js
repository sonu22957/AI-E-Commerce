import { useState, useEffect } from "react";

/**
 * useDebounce – returns a debounced version of the supplied value.
 *
 * @param {any} value - The value to debounce (e.g., a search query).
 * @param {number} [delay=500] - Delay in milliseconds before the value updates.
 * @returns {any} - The debounced value, updating only after the delay.
 *
 * Premium features:
 *   • Cleans up pending timers on unmount or when inputs change.
 *   • Handles rapid updates gracefully, ideal for type‑ahead search or API throttling.
 *   • JSDoc provides IDE autocomplete and TypeScript compatibility.
 */
export default function useDebounce(value, delay = 500) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebounced(value);
    }, delay);

    // Cleanup timer if value or delay changes, or on unmount.
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debounced;
}
