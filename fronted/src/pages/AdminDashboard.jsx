import React from "react";
import Navbar from "../components/common/Navbar";
import Sidebar from "../components/dashboad/Sidebar";
import OrderTable from "../components/dashboad/OrderTable";

/**
 * AdminDashboard – main admin area layout.
 *
 * Features:
 *   • Responsive two‑column layout with a collapsible sidebar.
 *   • Dark‑mode aware Tailwind styling and smooth micro‑animations.
 *   • Displays the OrderTable component for order management.
 *   • Ready for extensions (e.g., analytics cards, user table, charts).
 */
export default function AdminDashboard() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Top navigation */}
      <Navbar />

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar navigation */}
        <aside className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
          <Sidebar />
        </aside>

        {/* Main content area */}
        <main className="flex-1 p-6 overflow-auto">
          <h1 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-6">
            Admin Dashboard
          </h1>
          {/* Orders Management */}
          <section className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
            <h2 className="text-xl font-medium text-gray-700 dark:text-gray-200 mb-4">
              Recent Orders
            </h2>
            <OrderTable />
          </section>
        </main>
      </div>
    </div>
  );
}
