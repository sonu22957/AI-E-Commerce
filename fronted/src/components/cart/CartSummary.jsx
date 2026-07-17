import React, { useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { selectCartItems } from "../../redux/cartSlice";
import Button from "../common/Button";
import { useNavigate } from "react-router-dom";

/**
 * CartSummary component
 * --------------------
 * Shows a concise summary of the items in the shopping cart:
 *   • Subtotal (sum of item price × quantity)
 *   • Estimated tax (a simple 10% of subtotal for demo purposes)
 *   • Grand total
 *   • Checkout button that navigates to the checkout page.
 *
 * Styling uses Tailwind CSS, with dark‑mode support and subtle hover effects.
 */
export default function CartSummary() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const items = useSelector(selectCartItems);

  // Calculate totals; assumes each item has `price` as a string like "$19.99"
  const { subtotal, tax, total, itemCount } = useMemo(() => {
    const subtotalCalc = items.reduce((sum, item) => {
      const priceNum = parseFloat(item.price.replace(/[^0-9.]/g, "")) || 0;
      return sum + priceNum * (item.quantity || 1);
    }, 0);
    const taxCalc = subtotalCalc * 0.1; // 10% tax mock
    return {
      subtotal: subtotalCalc.toFixed(2),
      tax: taxCalc.toFixed(2),
      total: (subtotalCalc + taxCalc).toFixed(2),
      itemCount: items.reduce((c, i) => c + (i.quantity || 1), 0),
    };
  }, [items]);

  const handleCheckout = () => {
    // In a real app you might dispatch an action to create an order before navigation
    navigate("/checkout");
  };

  return (
    <div className="p-4 border rounded-lg bg-white dark:bg-gray-800 shadow-md">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
        Order Summary ({itemCount} {itemCount === 1 ? "item" : "items"})
      </h2>
      <div className="flex justify-between text-gray-700 dark:text-gray-300 mb-2">
        <span>Subtotal</span>
        <span>${subtotal}</span>
      </div>
      <div className="flex justify-between text-gray-700 dark:text-gray-300 mb-2">
        <span>Estimated Tax (10%)</span>
        <span>${tax}</span>
      </div>
      <hr className="my-2 border-gray-300 dark:border-gray-600" />
      <div className="flex justify-between text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
        <span>Total</span>
        <span>${total}</span>
      </div>
      <Button
        onClick={handleCheckout}
        disabled={items.length === 0}
        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded disabled:opacity-50"
      >
        Proceed to Checkout
      </Button>
    </div>
  );
}
