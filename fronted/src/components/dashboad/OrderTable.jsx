import React, { useEffect, useState } from "react";
import axiosInstance from "../../services/axios";
import Loader from "../common/Loader";
import Button from "../common/Button";
import { FiEdit, FiTrash2 } from "react-icons/fi";

/**
 * OrderTable – displays a paginated list of orders for the admin dashboard.
 * Features:
 *   • Fetches orders from `/api/admin/orders` (adjust endpoint as needed).
 *   • Loading spinner while fetching.
 *   • Graceful error handling with a retry button.
 *   • Tailwind‑styled table, dark‑mode aware, with subtle hover animations.
 *   • Simple actions (View Details, Delete) – placeholders for integration.
 */
export default function OrderTable() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.get("/api/admin/orders");
      setOrders(response.data || []);
    } catch (err) {
      console.error(err);
      setError("Failed to load orders. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
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
        <Button onClick={fetchOrders} className="mt-4" loading={false}>
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
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 dark:text-gray-200">
              Order ID
            </th>
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 dark:text-gray-200">
              Customer
            </th>
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 dark:text-gray-200">
              Total
            </th>
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 dark:text-gray-200">
              Status
            </th>
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 dark:text-gray-200">
              Date
            </th>
            <th className="px-4 py-2 text-center text-sm font-medium text-gray-700 dark:text-gray-200">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
          {orders.map((order) => (
            <tr key={order.id} className="hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
              <td className="px-4 py-2 text-sm text-gray-900 dark:text-gray-100">{order.id}</td>
              <td className="px-4 py-2 text-sm text-gray-900 dark:text-gray-100">{order.customerName}</td>
              <td className="px-4 py-2 text-sm text-gray-900 dark:text-gray-100">${order.total.toFixed(2)}</td>
              <td className="px-4 py-2 text-sm">
                <span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${
                  order.status === "Completed"
                    ? "bg-green-100 text-green-800"
                    : order.status === "Pending"
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-red-100 text-red-800"
                }`}>
                  {order.status}
                </span>
              </td>
              <td className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400">{new Date(order.createdAt).toLocaleDateString()}</td>
              <td className="px-4 py-2 text-center">
                <Button className="mr-2" onClick={() => console.log('view', order.id)}>
                  <FiEdit className="inline-block mr-1" /> View
                </Button>
                <Button className="bg-red-600 hover:bg-red-700" onClick={() => console.log('delete', order.id)}>
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
