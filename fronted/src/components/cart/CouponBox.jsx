import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axiosInstance from "../../services/axios";
import Input from "../common/Input";
import Button from "../common/Button";
import { FiCheck, FiAlertCircle } from "react-icons/fi";
import { applyCoupon, clearCoupon } from "../../redux/cartSlice";

/**
 * CouponBox component
 * ------------------
 * Allows the user to enter a discount coupon code. It sends the code to
 * `/api/cart/apply-coupon` and, on success, stores the discount amount in the
 * Redux cart slice (via `applyCoupon`). If the coupon is invalid, an error
 * message is shown. The UI is styled with Tailwind CSS and adapts to
 * dark‑mode.
 */
export default function CouponBox() {
  const dispatch = useDispatch();
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Assuming the cart slice keeps the applied discount amount (e.g., { amount: 5 })
  const discount = useSelector((state) => state.cart.discount?.amount || 0);

  const handleApply = async () => {
    if (!code.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const { data } = await axiosInstance.post("/api/cart/apply-coupon", { code: code.trim() });
      // Expect response { success: true, discount: 5.00 }
      if (data?.success) {
        dispatch(applyCoupon({ amount: data.discount }));
        setCode("");
      } else {
        throw new Error(data?.message || "Invalid coupon");
      }
    } catch (e) {
      console.warn("Coupon apply error:", e);
      dispatch(clearCoupon());
      setError(e.message || "Failed to apply coupon");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 border rounded-lg bg-gray-50 dark:bg-gray-800 mb-4">
      <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
        Have a coupon?
      </h3>
      <div className="flex items-center space-x-2">
        <Input
          type="text"
          placeholder="Enter code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          disabled={loading}
          className="flex-1 rounded-full focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
          aria-label="Coupon code"
        />
        <Button
          onClick={handleApply}
          disabled={loading || !code.trim()}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full disabled:opacity-50"
        >
          {loading ? (
            <FiAlertCircle className="animate-spin mr-1" />
          ) : (
            <FiCheck className="mr-1" />
          )}
          Apply
        </Button>
      </div>
      {error && (
        <p className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center">
          <FiAlertCircle className="mr-1" /> {error}
        </p>
      )}
      {discount > 0 && (
        <p className="mt-2 text-sm text-green-600 dark:text-green-400 flex items-center">
          <FiCheck className="mr-1" /> Discount applied: ${discount.toFixed(2)}
        </p>
      )}
    </div>
  );
}
