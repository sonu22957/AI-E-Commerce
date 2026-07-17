import React from "react";
import Navbar from "../components/common/Navbar";
import Sidebar from "../components/dashboad/Sidebar";
import UserTable from "../components/dashboad/UserTable";
import Button from "../components/common/Button";
import { FiUserPlus } from "react-icons/fi";

/**
 * ManageUsers Page
 * ----------------
 * Admin interface dedicated to viewing and managing registered users.
 * Uses the dashboard layout with Sidebar and Navbar, embedding the UserTable.
 */
export default function ManageUsers() {
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
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Manage Users
              </h1>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                View customer accounts, update roles, and manage access.
              </p>
            </div>
            <Button
              className="flex items-center bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg shadow-lg shadow-indigo-500/30 transition-transform hover:-translate-y-0.5 font-medium"
              onClick={() => console.log("Open Add User Modal")}
            >
              <FiUserPlus className="mr-2 h-5 w-5" /> Add User
            </Button>
          </div>

          {/* Users Table Section */}
          <section className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 overflow-hidden">
            <UserTable />
          </section>
        </main>
      </div>
    </div>
  );
}
