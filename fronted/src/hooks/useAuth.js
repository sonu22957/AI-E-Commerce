import { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login as loginAction, logout as logoutAction, setUser } from "../redux/authSlice";
import axiosInstance from "../services/axios";

/**
 * useAuth – custom hook that abstracts authentication logic.
 * Features:
 *   • login(email, password) – calls `/api/auth/login`, stores JWT in localStorage,
 *     dispatches Redux user state.
 *   • logout() – clears token, Redux state and redirects (optional).
 *   • isAuthenticated – boolean derived from token existence.
 *   • getCurrentUser – returns the user object from Redux store.
 *   • auto‑rehydrates auth state on app load (checks localStorage).
 */
export default function useAuth() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Initialise auth state from localStorage on mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
    if (token && storedUser) {
      // Set axios auth header
      axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      dispatch(setUser(JSON.parse(storedUser)));
    }
  }, [dispatch]);

  const login = useCallback(async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.post("/api/auth/login", { email, password });
      const { token, user } = response.data;
      // Persist token & user
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      // Set auth header for subsequent requests
      axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      dispatch(loginAction({ token, user }));
      return { token, user };
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Login failed");
      return null;
    } finally {
      setLoading(false);
    }
  }, [dispatch]);

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    delete axiosInstance.defaults.headers.common["Authorization"];
    dispatch(logoutAction());
  }, [dispatch]);

  const isAuthenticated = !!localStorage.getItem("token");

  const getCurrentUser = () => user;

  return {
    user,
    login,
    logout,
    isAuthenticated,
    getCurrentUser,
    loading,
    error,
  };
}
