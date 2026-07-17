import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { saveShippingAddress } from "../../redux/cartSlice";
import Input from "../common/Input";
import Button from "../common/Button";
import { FiCheckCircle, FiAlertCircle } from "react-icons/fi";

/**
 * AddressForm component
 * --------------------
 * A reusable form for collecting shipping address information during checkout.
 * Features:
 *   • Controlled inputs with simple client‑side validation.
 *   • Calls `/api/checkout/address` (POST) to persist the address.
 *   • Displays success or error feedback using Tailwind‑styled alerts.
 *   • Accepts an optional `onSuccess` callback (e.g., to advance to the next step).
 */
export default function AddressForm({ onSuccess }) {
  const [form, setForm] = useState({
    fullName: "",
    line1: "",
    line2: "",
    city: "",
    state: "",
    zip: "",
    phone: "",
  });
  const dispatch = useDispatch();
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const required = ["fullName", "line1", "city", "state", "zip", "country", "phone"];
    for (const field of required) {
      if (!form[field].trim()) return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      setError("Please fill in all required fields.");
      return;
    }
    setError(null);
    try {
      dispatch(saveShippingAddress(form));
      setSuccess("Address saved successfully!");
      if (onSuccess) onSuccess(form);
    } catch (err) {
      console.warn("Address submit error:", err);
      setError("Failed to save address locally.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      {error && (
        <div className="flex items-center text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900 p-2 rounded">
          <FiAlertCircle className="mr-2" /> {error}
        </div>
      )}
      {success && (
        <div className="flex items-center text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900 p-2 rounded">
          <FiCheckCircle className="mr-2" /> {success}
        </div>
      )}

      <Input
        type="text"
        name="fullName"
        placeholder="Full Name"
        value={form.fullName}
        onChange={handleChange}
        required
        className="w-full"
      />
      <Input
        type="text"
        name="line1"
        placeholder="Address Line 1"
        value={form.line1}
        onChange={handleChange}
        required
        className="w-full"
      />
      <Input
        type="text"
        name="line2"
        placeholder="Address Line 2 (optional)"
        value={form.line2}
        onChange={handleChange}
        className="w-full"
      />
      <div className="grid grid-cols-2 gap-4">
        <Input
          type="text"
          name="city"
          placeholder="City"
          value={form.city}
          onChange={handleChange}
          required
        />
        <Input
          type="text"
          name="state"
          placeholder="State / Province"
          value={form.state}
          onChange={handleChange}
          required
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Input
          type="text"
          name="zip"
          placeholder="ZIP / Postal Code"
          value={form.zip}
          onChange={handleChange}
          required
        />
        <Input
          type="text"
          name="country"
          placeholder="Country"
          value={form.country}
          onChange={handleChange}
          required
        />
      </div>
      <Input
        type="tel"
        name="phone"
        placeholder="Phone Number"
        value={form.phone}
        onChange={handleChange}
        required
      />

      <Button
        type="submit"
        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded"
      >
        Save Address
      </Button>
    </form>
  );
}
