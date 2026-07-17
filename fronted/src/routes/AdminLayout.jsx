import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import Navbar from "../components/common/Navbar";
import Sidebar from "../components/dashboad/Sidebar";

/**
 * AdminLayout Component
 * ---------------------
 * structural layout for all admin dashboard screens.
 * Wraps pages in authorization guards to ensure only admin users can access.
 * Displays a persistent Sidebar navigation alongside the content (Outlet).
 */
export default function AdminLayout() {
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  // If not authenticated or not an admin, redirect to homepage
  if (!isAuthenticated || user?.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <Navbar />

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar Nav */}
        <aside className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 hidden md:block">
          <Sidebar />
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
