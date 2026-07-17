import React, { useMemo } from "react";
import { useSelector } from "react-redux";
import { selectCartItems } from "../../redux/cartSlice";
import Button from "../common/Button";
import { FiShoppingCart } from "react-icons/fi";

/**
 * OrderSummary component
 * ----------------------
 * Displays a read‑only overview of the current cart: list of items, subtotal,
 * tax (10 % mock rate) and total. It also provides a button to continue to the
 * payment step. UI uses Tailwind CSS with dark‑mode support.
 */
export default function OrderSummary() {
  const items = useSelector(selectCartItems);

  // Calculate totals
  const { subtotal, tax, total } = useMemo(() => {
    const subtotalCalc = items.reduce((sum, item) => {
      let priceNum = 0;
      if (typeof item.price === 'number') {
        priceNum = item.price;
      } else if (typeof item.price === 'string') {
        priceNum = parseFloat(item.price.replace(/[^0-9.]/g, "")) || 0;
      }
      const qty = item.quantity || 1;
      return sum + priceNum * qty;
    }, 0);
    const taxRate = 0.1; // 10% tax for demo purposes
    const taxCalc = subtotalCalc * taxRate;
    return {
      subtotal: subtotalCalc,
      tax: taxCalc,
      total: subtotalCalc + taxCalc,
    };
  }, [items]);

  if (!items.length) {
    return (
      <div className="p-4 text-center text-gray-600 dark:text-gray-400">
        <FiShoppingCart className="inline-block mb-2 text-2xl" />
        <p>Your cart is empty.</p>
      </div>
    );
  }

  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
        Order Summary
      </h2>

      {/* Item list */}
      <ul className="space-y-2 max-h-48 overflow-y-auto mb-4">
        {items.map((item) => (
          <li
            key={item.id || item._id}
            className="flex justify-between text-sm text-gray-700 dark:text-gray-300"
          >
            <span>{item.name} × {item.quantity}</span>
            <span>₹{(typeof item.price === 'number' ? item.price : parseFloat(item.price.replace(/[^0-9.]/g, "")) || 0).toLocaleString("en-IN")}</span>
          </li>
        ))}
      </ul>

      {/* Totals */}
      <div className="border-t border-gray-200 dark:border-gray-700 pt-2 mb-4">
        <div className="flex justify-between text-gray-800 dark:text-gray-200">
          <span>Subtotal</span>
          <span>₹{subtotal.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
        </div>
        <div className="flex justify-between text-gray-800 dark:text-gray-200">
          <span>Tax (10%)</span>
          <span>₹{tax.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
        </div>
        <div className="flex justify-between font-semibold text-gray-900 dark:text-gray-100 mt-2">
          <span>Total</span>
          <span>₹{total.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
        </div>
      </div>

    </div>
  );
}
