import React from "react";

/**
 * Input Component
 * ---------------
 * A styled, accessible input field wrapper.
 * Supports label, error message, icon prefix, and all standard input props.
 *
 * @param {string}  id          - Input id (required for label association)
 * @param {string}  label       - Label text shown above the input
 * @param {string}  error       - Error message shown below the input
 * @param {node}    icon        - Optional icon rendered on the left inside the input
 * @param {string}  className   - Extra classes for the wrapper div
 */
export default function Input({
  id,
  label,
  error,
  icon,
  className = "",
  type = "text",
  ...rest
}) {
  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      {label && (
        <label
          htmlFor={id}
          className="text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-gray-400 dark:text-gray-500">
            {icon}
          </div>
        )}
        <input
          id={id}
          type={type}
          className={`w-full rounded-lg border px-3 py-2.5 text-sm text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 placeholder-gray-400 dark:placeholder-gray-500 outline-none transition focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:opacity-60 disabled:cursor-not-allowed ${
            error
              ? "border-red-400 focus:ring-red-400 focus:border-red-400"
              : "border-gray-300 dark:border-gray-700"
          } ${icon ? "pl-10" : ""}`}
          {...rest}
        />
      </div>
      {error && (
        <p className="text-xs text-red-500 mt-0.5">{error}</p>
      )}
    </div>
  );
}
