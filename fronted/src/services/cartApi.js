import axiosInstance from "./axios";

/**
 * Cart API Service
 * ----------------
 * Provides API integrations for shopping cart operations, including:
 * 1. Fetching user's cart from the database
 * 2. Syncing local cart items with the database
 * 3. Applying and removing discount coupons
 */
export const getCart = async () => {
  try {
    const response = await axiosInstance.get("/api/cart");
    return response.data;
  } catch (error) {
    console.error("Get cart API error:", error);
    throw error;
  }
};

export const syncCart = async (cartItems) => {
  try {
    const response = await axiosInstance.post("/api/cart/sync", { items: cartItems });
    return response.data;
  } catch (error) {
    console.error("Sync cart API error:", error);
    throw error;
  }
};

export const applyPromoCode = async (code) => {
  try {
    const response = await axiosInstance.post("/api/cart/coupon", { code });
    return response.data;
  } catch (error) {
    console.error("Apply coupon API error:", error);
    throw error;
  }
};

const cartApi = {
  getCart,
  syncCart,
  applyPromoCode,
};

export default cartApi;
