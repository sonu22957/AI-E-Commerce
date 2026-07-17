import axiosInstance from "./axios";

/**
 * Auth API Service
 * ----------------
 * Provides API integrations for authentication operations including:
 * 1. User login
 * 2. User registration
 * 3. Profile fetching and updating
 * 4. Password recovery/reset
 */
export const login = async (email, password) => {
  try {
    const response = await axiosInstance.post("/api/auth/login", { email, password });
    return response.data;
  } catch (error) {
    console.error("Login API error:", error);
    throw error;
  }
};

export const register = async (name, email, password) => {
  try {
    const response = await axiosInstance.post("/api/auth/register", { name, email, password });
    return response.data;
  } catch (error) {
    console.error("Register API error:", error);
    throw error;
  }
};

export const getUserProfile = async () => {
  try {
    const response = await axiosInstance.get("/api/users/profile");
    return response.data;
  } catch (error) {
    console.error("Get profile API error:", error);
    throw error;
  }
};

export const updateUserProfile = async (userData) => {
  try {
    const response = await axiosInstance.put("/api/users/profile", userData);
    return response.data;
  } catch (error) {
    console.error("Update profile API error:", error);
    throw error;
  }
};

export const forgotPassword = async (email) => {
  try {
    const response = await axiosInstance.post("/api/auth/forgotpassword", { email });
    return response.data;
  } catch (error) {
    console.error("Forgot password API error:", error);
    throw error;
  }
};

export const resetPassword = async (token, password) => {
  try {
    const response = await axiosInstance.put(`/api/auth/resetpassword/${token}`, { password });
    return response.data;
  } catch (error) {
    console.error("Reset password API error:", error);
    throw error;
  }
};

const authApi = {
  login,
  register,
  getUserProfile,
  updateUserProfile,
  forgotPassword,
  resetPassword,
};

export default authApi;
