import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import Navbar from "../components/common/Navbar";
import AddressForm from "../components/checkout/AddressForm";
import PaymentMethod from "../components/checkout/PaymentMethod";
import OrderSummary from "../components/checkout/OrderSummary";
import Button from "../components/common/Button";
import { selectCartItems, clearCartItems } from "../redux/cartSlice";
import axiosInstance from "../services/axios";

/**
 * Checkout Page
 * -------------
 * A streamlined, multi-step checkout process.
 * Integrates AddressForm, PaymentMethod, and OrderSummary.
 */
export default function Checkout() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cartItems = useSelector(selectCartItems);

  const [step, setStep] = useState(1);
  const [placing, setPlacing] = useState(false);
  const [placeError, setPlaceError] = useState(null);

  const [checkoutData, setCheckoutData] = useState({
    address: null,
    paymentMethod: null,
  });

  const handleAddressSubmit = (addressData) => {
    setCheckoutData({ ...checkoutData, address: addressData });
    setStep(2);
  };

  const handlePaymentSubmit = (paymentData) => {
    setCheckoutData({ ...checkoutData, paymentMethod: paymentData });
    setStep(3);
  };

  const handlePlaceOrder = async () => {
    setPlacing(true);
    setPlaceError(null);
    try {
      // Build order payload matching the backend Order schema
      const orderPayload = {
        items: cartItems.map((item) => ({
          product: item._id || item.id,
          quantity: item.quantity || 1,
          price: item.price || 0,
        })),
        totalAmount: cartItems.reduce(
          (sum, item) => sum + (item.price || 0) * (item.quantity || 1),
          0
        ),
        address: checkoutData.address,
        paymentMethod: checkoutData.paymentMethod?.method || "COD",
      };

      await axiosInstance.post("/api/orders", orderPayload);

      // Clear cart after successful order
      dispatch(clearCartItems());

      // Redirect to orders page
      navigate("/orders");
    } catch (err) {
      console.error("Place order error:", err);
      setPlaceError(
        err?.response?.data?.message || "Order place karne mein error aaya. Dobara try karein."
      );
    } finally {
      setPlacing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-8">
          Checkout
        </h1>

        <div className="lg:grid lg:grid-cols-12 lg:gap-x-12 lg:items-start">
          {/* Left Column: Forms */}
          <div className="lg:col-span-7 xl:col-span-8 space-y-6">
            
            {/* Step 1: Shipping Address */}
            <div className={`bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 ${step === 1 ? 'ring-2 ring-indigo-500 dark:ring-indigo-400' : ''}`}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
                  1. Shipping Address
                </h2>
                {step > 1 && (
                  <button 
                    onClick={() => setStep(1)} 
                    className="text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:underline"
                  >
                    Edit
                  </button>
                )}
              </div>
              
              {step === 1 ? (
                <AddressForm onSuccess={handleAddressSubmit} defaultValues={checkoutData.address} />
              ) : (
                <div className="text-gray-600 dark:text-gray-300 text-sm">
                  {checkoutData.address ? (
                    <p>
                      {checkoutData.address.fullName}<br/>
                      {checkoutData.address.street}<br/>
                      {checkoutData.address.city}, {checkoutData.address.state} {checkoutData.address.zip}
                    </p>
                  ) : (
                    <p>No address provided.</p>
                  )}
                </div>
              )}
            </div>

            {/* Step 2: Payment Method */}
            <div className={`bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 ${step === 2 ? 'ring-2 ring-indigo-500 dark:ring-indigo-400' : ''} ${step < 2 ? 'opacity-50 pointer-events-none' : ''}`}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
                  2. Payment Method
                </h2>
                {step > 2 && (
                  <button 
                    onClick={() => setStep(2)} 
                    className="text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:underline"
                  >
                    Edit
                  </button>
                )}
              </div>

              {step === 2 ? (
                <PaymentMethod onPaymentSuccess={handlePaymentSubmit} defaultValues={checkoutData.paymentMethod} />
              ) : step > 2 ? (
                <div className="text-gray-600 dark:text-gray-300 text-sm flex items-center">
                  <span className="capitalize">{checkoutData.paymentMethod?.method || 'Credit Card'}</span>
                  {checkoutData.paymentMethod?.last4 && (
                    <span className="ml-2">• • • • {checkoutData.paymentMethod.last4}</span>
                  )}
                </div>
              ) : null}
            </div>

            {/* Step 3: Review */}
            <div className={`bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 ${step === 3 ? 'ring-2 ring-indigo-500 dark:ring-indigo-400' : ''} ${step < 3 ? 'opacity-50 pointer-events-none' : ''}`}>
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">
                3. Review &amp; Place Order
              </h2>
              {step === 3 && (
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                  Please review your order summary on the right. If everything looks correct, submit your order below.
                </p>
              )}
              {step === 3 && placeError && (
                <div className="mb-4 px-4 py-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700 rounded-xl text-sm text-red-700 dark:text-red-300">
                  ⚠️ {placeError}
                </div>
              )}
              {step === 3 && (
                <Button
                  onClick={handlePlaceOrder}
                  disabled={placing || cartItems.length === 0}
                  className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-xl font-semibold transition-transform hover:-translate-y-0.5 shadow-lg shadow-indigo-500/30 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {placing ? "⏳ Placing Order..." : "🛍️ Place Order"}
                </Button>
              )}
            </div>
          </div>

          {/* Right Column: Order Summary */}
          <div className="mt-8 lg:mt-0 lg:col-span-5 xl:col-span-4">
            <OrderSummary />
          </div>
        </div>
      </main>
    </div>
  );
}
