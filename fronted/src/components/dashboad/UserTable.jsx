import React, { useEffect, useState } from "react";
import axiosInstance from "../../services/axios";
import Loader from "../common/Loader";
import Button from "../common/Button";
import { FiUser, FiTrash2 } from "react-icons/fi";

/**
 * UserTable – renders a paginated list of users for the admin dashboard.
 * Features:
 *   • Fetches user data from `/api/admin/users`.
 *   • Shows a loading spinner while fetching.
 *   • Displays an error message with a retry button on failure.
 *   • Tailwind‑styled, dark‑mode aware table with subtle hover effects.
 *   • Basic action buttons (View, Delete) as placeholders.
 */
export default function UserTable() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.get("/api/admin/users");
      setUsers(response.data || []);
    } catch (err) {
      console.error(err);
      setError("Failed to load users. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <Loader className="w-12 h-12 text-indigo-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-600">
        <p>{error}</p>
        <Button onClick={fetchUsers} className="mt-4">
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg shadow ring-1 ring-black ring-opacity-5">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-800">
          <tr>
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 dark:text-gray-200">ID</th>
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 dark:text-gray-200">Name</th>
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 dark:text-gray-200">Email</th>
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 dark:text-gray-200">Role</th>
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 dark:text-gray-200">Status</th>
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 dark:text-gray-200">Joined</th>
            <th className="px-4 py-2 text-center text-sm font-medium text-gray-700 dark:text-gray-200">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
          {users.map((user) => (
            <tr key={user.id} className="hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
              <td className="px-4 py-2 text-sm text-gray-900 dark:text-gray-100">{user.id}</td>
              <td className="px-4 py-2 text-sm text-gray-900 dark:text-gray-100">{user.name}</td>
              <td className="px-4 py-2 text-sm text-gray-900 dark:text-gray-100">{user.email}</td>
              <td className="px-4 py-2 text-sm text-gray-900 dark:text-gray-100">{user.role}</td>
              <td className="px-4 py-2 text-sm">
                <span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${
                  user.status === "Active"
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}>{user.status}</span>
              </td>
              <td className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400">
                {new Date(user.createdAt).toLocaleDateString()}
              </td>
              <td className="px-4 py-2 text-center">
                <Button className="mr-2" onClick={() => console.log('view', user.id)}>
                  <FiUser className="inline-block mr-1" /> View
                </Button>
                <Button className="bg-red-600 hover:bg-red-700" onClick={() => console.log('delete', user.id)}>
                  <FiTrash2 className="inline-block mr-1" /> Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
