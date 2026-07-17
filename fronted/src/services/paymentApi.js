import axiosInstance from "./axios";

/**
 * Payment API Service
 * -------------------
 * Provides API integrations for processing checkout payments, including:
 * 1. Creating a Stripe payment intent / checkout session
 * 2. Confirming card payments
 * 3. Fetching client configuration tokens (e.g., PayPal client ID)
 */
export const createPaymentIntent = async (amount, currency = "usd") => {
  try {
    const response = await axiosInstance.post("/api/payments/create-intent", {
      amount,
      currency,
    });
    return response.data; // Should return { clientSecret }
  } catch (error) {
    console.error("Create payment intent API error:", error);
    throw error;
  }
};

export const getPaypalClientId = async () => {
  try {
    const response = await axiosInstance.get("/api/config/paypal");
    return response.data; // Returns PayPal Client ID string
  } catch (error) {
    console.error("Get PayPal Client ID API error:", error);
    throw error;
  }
};

export const verifyPayment = async (paymentDetails) => {
  try {
    const response = await axiosInstance.post("/api/payments/verify", paymentDetails);
    return response.data;
  } catch (error) {
    console.error("Verify payment API error:", error);
    throw error;
  }
};

const paymentApi = {
  createPaymentIntent,
  getPaypalClientId,
  verifyPayment,
};

export default paymentApi;
