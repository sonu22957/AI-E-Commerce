import React from "react";
import Navbar from "../components/common/Navbar";
import Sidebar from "../components/dashboad/Sidebar";
import OrderTable from "../components/dashboad/OrderTable";

/**
 * ManageOrders Page
 * -----------------
 * Admin page specifically dedicated to viewing and managing all customer orders.
 * Uses the dashboard layout with Sidebar and Navbar.
 */
export default function ManageOrders() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <Navbar />

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar navigation */}
        <aside className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 hidden md:block">
          <Sidebar />
        </aside>

        {/* Main content area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-auto">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Manage Orders
              </h1>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                View, update, and track all customer orders in one place.
              </p>
            </div>
            {/* Optional: Add filters, export buttons, or search here in the future */}
          </div>

          {/* Orders Table Section */}
          <section className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
            <OrderTable />
          </section>
        </main>
      </div>
    </div>
  );
}
