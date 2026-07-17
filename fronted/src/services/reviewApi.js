import axiosInstance from "./axios";

/**
 * Review API Service
 * ------------------
 * Handles API operations for product reviews, including:
 * 1. Fetching reviews for a specific product
 * 2. Creating a new product review
 * 3. Deleting or reporting reviews (admin functions)
 */
export const getProductReviews = async (productId) => {
  try {
    const response = await axiosInstance.get(`/api/products/${productId}/reviews`);
    return response.data;
  } catch (error) {
    console.error("Get product reviews API error:", error);
    throw error;
  }
};

export const submitProductReview = async (productId, reviewData) => {
  try {
    const response = await axiosInstance.post(
      `/api/products/${productId}/reviews`,
      reviewData
    );
    return response.data;
  } catch (error) {
    console.error("Submit product review API error:", error);
    throw error;
  }
};

export const deleteProductReview = async (productId, reviewId) => {
  try {
    const response = await axiosInstance.delete(
      `/api/admin/products/${productId}/reviews/${reviewId}`
    );
    return response.data;
  } catch (error) {
    console.error("Delete product review API error:", error);
    throw error;
  }
};

const reviewApi = {
  getProductReviews,
  submitProductReview,
  deleteProductReview,
};

export default reviewApi;
