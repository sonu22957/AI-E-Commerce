import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { savePaymentMethod } from "../../redux/cartSlice";
import Button from "../common/Button";
import Input from "../common/Input";
import { FiCreditCard, FiAlertCircle, FiCheckCircle } from "react-icons/fi";

/**
 * PaymentMethod component
 * ----------------------
 * Allows the user to select a payment method and enter required details.
 * Currently supports:
 *   • Credit Card (mock validation)
 *   • PayPal (mock redirect)
 * The component posts the selected method to `/api/checkout/payment` and
 * displays success / error feedback. Tailwind CSS provides a premium, dark‑
 * mode‑aware UI.
 */
export default function PaymentMethod({ onPaymentSuccess }) {
  const [method, setMethod] = useState("card"); // 'card' | 'paypal'
  const [cardInfo, setCardInfo] = useState({
    number: "",
    name: "",
    expiry: "",
    cvc: "",
  });
  const dispatch = useDispatch();
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleCardChange = (e) => {
    const { name, value } = e.target;
    setCardInfo((prev) => ({ ...prev, [name]: value }));
  };

  const validateCard = () => {
    const { number, name, expiry, cvc } = cardInfo;
    return number.trim() && name.trim() && expiry.trim() && cvc.trim();
  };

  const handlePay = () => {
    setError(null);
    setSuccess(null);
    try {
      const payload = method === "card" ? { method, card: cardInfo } : { method };
      dispatch(savePaymentMethod(payload));
      setSuccess("Payment processed successfully!");
      if (onPaymentSuccess) onPaymentSuccess(payload);
    } catch (e) {
      console.warn("Payment error:", e);
      setError("Unable to process payment locally.");
    }
  };

  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
        Payment Method
      </h2>

      {/* Method selector */}
      <div className="flex space-x-4 mb-4">
        <Button
          onClick={() => setMethod("card")}
          className={`flex-1 ${method === "card" ? "bg-indigo-600 text-white" : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200"}`}
        >
          <FiCreditCard className="mr-2 inline" /> Credit Card
        </Button>
        <Button
          onClick={() => setMethod("paypal")}
          className={`flex-1 ${method === "paypal" ? "bg-indigo-600 text-white" : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200"}`}
        >
          PayPal
        </Button>
      </div>

      {/* Card details form */}
      {method === "card" && (
        <div className="space-y-3 mb-4">
          <Input
            type="text"
            name="number"
            placeholder="Card Number"
            value={cardInfo.number}
            onChange={handleCardChange}
            className="w-full"
          />
          <Input
            type="text"
            name="name"
            placeholder="Name on Card"
            value={cardInfo.name}
            onChange={handleCardChange}
            className="w-full"
          />
          <div className="grid grid-cols-2 gap-2">
            <Input
              type="text"
              name="expiry"
              placeholder="MM/YY"
              value={cardInfo.expiry}
              onChange={handleCardChange}
              className="w-full"
            />
            <Input
              type="text"
              name="cvc"
              placeholder="CVC"
              value={cardInfo.cvc}
              onChange={handleCardChange}
              className="w-full"
            />
          </div>
        </div>
      )}

      {/* PayPal placeholder */}
      {method === "paypal" && (
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
          You will be redirected to PayPal after clicking Pay.
        </p>
      )}

      {/* Feedback */}
      {error && (
        <div className="flex items-center text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900 p-2 rounded mb-2">
          <FiAlertCircle className="mr-2" /> {error}
        </div>
      )}
      {success && (
        <div className="flex items-center text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900 p-2 rounded mb-2">
          <FiCheckCircle className="mr-2" /> {success}
        </div>
      )}

      <Button
        onClick={handlePay}
        disabled={method === "card" && !validateCard()}
        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded disabled:opacity-50 flex items-center justify-center"
      >
        Pay Now
      </Button>
    </div>
  );
}
