import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";
import Button from "../components/common/Button";
import Loader from "../components/common/Loader";
import DeliveryEstimate from "../components/common/DeliveryEstimate";
import { FiPackage, FiExternalLink, FiClock, FiCheckCircle, FiTruck } from "react-icons/fi";
import axiosInstance from "../services/axios";

/**
 * Orders Page
 * -----------
 * Customer-facing page displaying their order history.
 * Features premium Tailwind styling, loading states, and responsive order cards.
 */
export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMyOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.get("/api/orders/myorders");
      setOrders(response.data || []);
    } catch (err) {
      console.error("Failed to load orders", err);
      setError("Failed to load your order history. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyOrders();
  }, []);

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case "delivered":
      case "completed":
        return <FiCheckCircle className="text-green-500 mr-2" />;
      case "processing":
      case "pending":
      default:
        return <FiClock className="text-yellow-500 mr-2" />;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <Navbar />

      <main className="flex-1 max-w-5xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-8">
          My Orders
        </h1>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader size="lg" className="text-indigo-600" />
          </div>
        ) : error ? (
          <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
            <p className="text-red-500 dark:text-red-400 mb-4">{error}</p>
            <Button onClick={fetchMyOrders}>Retry</Button>
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
            <FiPackage className="mx-auto h-16 w-16 text-gray-400 mb-4" />
            <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
              No orders yet
            </h2>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              When you place an order, it will appear here.
            </p>
            <Link to="/products">
              <Button className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-full font-medium transition-transform hover:scale-105 shadow-lg shadow-indigo-500/30">
                Start Shopping
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div 
                key={order._id || order.id} 
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden"
              >
                {/* Order Header */}
                <div className="bg-gray-50 dark:bg-gray-800/50 px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex flex-col sm:flex-row gap-4 sm:gap-8">
                    <div>
                      <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
                        Order Placed
                      </p>
                      <p className="text-sm text-gray-900 dark:text-white font-medium">
                        {new Date(order.createdAt).toLocaleDateString(undefined, {
                          year: 'numeric', month: 'long', day: 'numeric'
                        })}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
                        Total
                      </p>
                      <p className="text-sm text-gray-900 dark:text-white font-medium">
                        ${(order.totalPrice || order.total || 0).toFixed(2)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
                        Order #
                      </p>
                      <p className="text-sm text-gray-900 dark:text-white font-medium">
                        {order._id || order.id}
                      </p>
                    </div>
                  </div>
                  <Button 
                    className="flex justify-center items-center bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 text-sm py-2 px-4 rounded-lg"
                    onClick={() => console.log("View Details", order._id || order.id)}
                  >
                    View Details <FiExternalLink className="ml-2" />
                  </Button>
                </div>

                {/* Order Status & Items Summary */}
                <div className="p-6">
                  <div className="flex items-center text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    {getStatusIcon(order.status)}
                    <span className="capitalize">{order.status || 'Processing'}</span>
                  </div>
                  
                  {/* Delivery Status */}
                  <div className="mt-4">
                    {order.status?.toLowerCase() === 'delivered' || order.status?.toLowerCase() === 'completed' ? (
                      <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400 font-semibold">
                        <FiCheckCircle className="h-4 w-4" />
                        Delivered on{" "}
                        {order.deliveredAt
                          ? new Date(order.deliveredAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
                          : "time"}
                      </div>
                    ) : (
                      <DeliveryEstimate
                        shippingMethod={order.shippingMethod || "standard"}
                        orderDate={order.createdAt}
                        compact={false}
                      />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
}
