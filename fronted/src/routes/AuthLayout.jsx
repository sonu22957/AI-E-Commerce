import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

/**
 * AuthLayout Component
 * --------------------
 * Layout/Guard wrapper for authentication pages (Login, Register, ForgotPassword, etc.).
 * Redirects already logged-in users to the Home page to prevent double-logging.
 */
export default function AuthLayout() {
  const { isAuthenticated } = useSelector((state) => state.auth);

  // If already authenticated, redirect away from auth screens
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <Outlet />
    </div>
  );
}
