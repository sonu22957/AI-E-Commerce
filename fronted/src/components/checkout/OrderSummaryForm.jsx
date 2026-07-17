import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { selectCartItems, clearCart } from "../../redux/cartSlice";
import axiosInstance from "../../services/axios";
import Button from "../common/Button";
import Loader from "../common/Loader";
import { FiCheckCircle, FiAlertCircle } from "react-icons/fi";

/**
 * OrderSummaryForm component
 * --------------------------
 * Shows a read‑only summary of the cart (items, subtotal, tax, total) and
 * provides a **Place Order** button. When clicked it sends a POST request to
 * `/api/checkout/create-order` with the current cart contents. On success the
 * cart is cleared and a success alert is shown; on failure an error alert is
 * displayed. The UI is built with Tailwind CSS and adapts to dark mode.
 */
export default function OrderSummaryForm({ onOrderSuccess }) {
  const dispatch = useDispatch();
  const items = useSelector(selectCartItems);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Compute totals – assumes each item has `price` like "$19.99" and `quantity`.
  const { subtotal, tax, total } = items.reduce(
    (acc, item) => {
      const priceNum = parseFloat(item.price.replace(/[^0-9.]/g, "")) || 0;
      const qty = item.quantity || 1;
      const lineTotal = priceNum * qty;
      acc.subtotal += lineTotal;
      return acc;
    },
    { subtotal: 0, tax: 0, total: 0 }
  );
  const taxRate = 0.1; // 10% tax for demo
  const computedTax = subtotal * taxRate;
  const grandTotal = subtotal + computedTax;

  const handlePlaceOrder = async () => {
    if (!items.length) return;
    setLoading(true);
    setError(null);
    try {
      const { data } = await axiosInstance.post("/api/checkout/create-order", {
        items,
        subtotal: subtotal.toFixed(2),
        tax: computedTax.toFixed(2),
        total: grandTotal.toFixed(2),
      });
      setSuccess(data?.message || "Order placed successfully!");
      dispatch(clearCart());
      if (onOrderSuccess) onOrderSuccess(data);
    } catch (e) {
      console.warn("Order creation error:", e);
      setError(e.response?.data?.message || "Failed to place order.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      {error && (
        <div className="flex items-center text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900 p-2 rounded mb-4">
          <FiAlertCircle className="mr-2" /> {error}
        </div>
      )}
      {success && (
        <div className="flex items-center text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900 p-2 rounded mb-4">
          <FiCheckCircle className="mr-2" /> {success}
        </div>
      )}

      {/* Item list */}
      <ul className="space-y-2 mb-4 max-h-48 overflow-y-auto">
        {items.map((item) => (
          <li key={item.id} className="flex justify-between text-sm text-gray-700 dark:text-gray-300">
            <span>{item.name} × {item.quantity}</span>
            <span>{item.price}</span>
          </li>
        ))}
      </ul>

      {/* Totals */}
      <div className="border-t border-gray-200 dark:border-gray-700 pt-2 mb-4">
        <div className="flex justify-between text-gray-800 dark:text-gray-200">
          <span>Subtotal</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-gray-800 dark:text-gray-200">
          <span>Tax (10%)</span>
          <span>${computedTax.toFixed(2)}</span>
        </div>
        <div className="flex justify-between font-semibold text-gray-900 dark:text-gray-100 mt-2">
          <span>Total</span>
          <span>${grandTotal.toFixed(2)}</span>
        </div>
      </div>

      <Button
        onClick={handlePlaceOrder}
        disabled={loading || !items.length}
        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded disabled:opacity-50 flex items-center justify-center"
      >
        {loading ? <Loader className="w-5 h-5 mr-2 text-white" /> : null}
        {loading ? "Placing order…" : "Place Order"}
      </Button>
    </div>
  );
}
