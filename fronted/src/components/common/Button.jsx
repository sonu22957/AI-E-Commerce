import React from "react";

/**
 * Reusable Button Component
 * --------------------------
 * A flexible button wrapper that merges custom className with base styles.
 * Accepts all standard HTML button props and forwards them.
 *
 * @param {string}   className  - Additional Tailwind/CSS classes
 * @param {string}   type       - Button type (default: "button")
 * @param {boolean}  disabled   - Disabled state
 * @param {function} onClick    - Click handler
 * @param {node}     children   - Button content
 */
export default function Button({
  children,
  className = "",
  type = "button",
  disabled = false,
  onClick,
  ...rest
}) {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`inline-flex items-center justify-center font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-60 disabled:cursor-not-allowed ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
}
