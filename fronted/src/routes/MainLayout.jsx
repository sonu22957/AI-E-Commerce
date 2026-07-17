import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";

/**
 * MainLayout Component
 * --------------------
 * Serves as the structural layout for all customer-facing routes.
 * Includes the global Navbar at the top, followed by the page content (Outlet),
 * and wraps up with the global Footer at the bottom.
 */
export default function MainLayout() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <Navbar />
      
      {/* Page Content wrapper */}
      <main className="flex-1 w-full">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}
