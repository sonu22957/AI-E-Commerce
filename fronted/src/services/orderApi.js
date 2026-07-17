import axiosInstance from "./axios";

/**
 * Order API Service
 * -----------------
 * Handles API communication for placing and tracking orders:
 * 1. Placing a new order
 * 2. Fetching order details by ID
 * 3. Getting logged-in user's order history
 * 4. Admin functions (list all orders, update status)
 */
export const createOrder = async (orderData) => {
  try {
    const response = await axiosInstance.post("/api/orders", orderData);
    return response.data;
  } catch (error) {
    console.error("Create order API error:", error);
    throw error;
  }
};

export const getOrderDetails = async (id) => {
  try {
    const response = await axiosInstance.get(`/api/orders/${id}`);
    return response.data;
  } catch (error) {
    console.error("Get order details API error:", error);
    throw error;
  }
};

export const getMyOrders = async () => {
  try {
    const response = await axiosInstance.get("/api/orders/myorders");
    return response.data;
  } catch (error) {
    console.error("Get my orders API error:", error);
    throw error;
  }
};

export const getAllOrders = async () => {
  try {
    const response = await axiosInstance.get("/api/admin/orders");
    return response.data;
  } catch (error) {
    console.error("Get all orders API error:", error);
    throw error;
  }
};

export const updateOrderStatus = async (id, status) => {
  try {
    const response = await axiosInstance.put(`/api/admin/orders/${id}/status`, { status });
    return response.data;
  } catch (error) {
    console.error("Update order status API error:", error);
    throw error;
  }
};

const orderApi = {
  createOrder,
  getOrderDetails,
  getMyOrders,
  getAllOrders,
  updateOrderStatus,
};

export default orderApi;
