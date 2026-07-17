import React from "react";

/**
 * Loader Component
 * ----------------
 * A centered spinning loader with optional size and label.
 * Used as a full-page or inline loading indicator.
 *
 * @param {string}  size    - "sm" | "md" | "lg" (default: "md")
 * @param {string}  label   - Optional accessible loading text
 * @param {boolean} fullPage - If true, centers loader in the full viewport
 */
export default function Loader({ size = "md", label = "Loading…", fullPage = false }) {
  const sizeMap = {
    sm: "h-6 w-6 border-2",
    md: "h-10 w-10 border-4",
    lg: "h-16 w-16 border-4",
  };

  const spinner = (
    <div className="flex flex-col items-center justify-center gap-3" role="status" aria-live="polite">
      <div
        className={`rounded-full border-indigo-200 dark:border-gray-700 border-t-indigo-600 dark:border-t-indigo-400 animate-spin ${sizeMap[size] ?? sizeMap.md}`}
      />
      {label && (
        <span className="text-sm text-gray-500 dark:text-gray-400 animate-pulse">
          {label}
        </span>
      )}
    </div>
  );

  if (fullPage) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm">
        {spinner}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center py-12">
      {spinner}
    </div>
  );
}
