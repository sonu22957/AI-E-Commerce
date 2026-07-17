import axiosInstance from "./axios";

/**
 * Product API Service
 * -------------------
 * Provides API integrations for managing products, including:
 * 1. Fetching all products / catalog
 * 2. Fetching single product details by ID
 * 3. Adding product reviews
 * 4. Admin operations (creating, editing, and deleting products)
 */
export const getProducts = async (keyword = "", pageNumber = "") => {
  try {
    const response = await axiosInstance.get(
      `/api/products?keyword=${keyword}&pageNumber=${pageNumber}`
    );
    return response.data;
  } catch (error) {
    console.error("Get products API error:", error);
    throw error;
  }
};

export const getProductDetails = async (id) => {
  try {
    const response = await axiosInstance.get(`/api/products/${id}`);
    return response.data;
  } catch (error) {
    console.error("Get product details API error:", error);
    throw error;
  }
};

export const createProductReview = async (productId, review) => {
  try {
    const response = await axiosInstance.post(
      `/api/products/${productId}/reviews`,
      review
    );
    return response.data;
  } catch (error) {
    console.error("Create product review API error:", error);
    throw error;
  }
};

export const deleteProduct = async (id) => {
  try {
    const response = await axiosInstance.delete(`/api/admin/products/${id}`);
    return response.data;
  } catch (error) {
    console.error("Delete product API error:", error);
    throw error;
  }
};

export const createProduct = async (productData) => {
  try {
    const response = await axiosInstance.post(`/api/admin/products`, productData);
    return response.data;
  } catch (error) {
    console.error("Create product API error:", error);
    throw error;
  }
};

export const updateProduct = async (id, productData) => {
  try {
    const response = await axiosInstance.put(`/api/admin/products/${id}`, productData);
    return response.data;
  } catch (error) {
    console.error("Update product API error:", error);
    throw error;
  }
};

const productApi = {
  getProducts,
  getProductDetails,
  createProductReview,
  deleteProduct,
  createProduct,
  updateProduct,
};

export default productApi;
