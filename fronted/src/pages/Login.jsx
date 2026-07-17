import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import Input from "../components/common/Input";
import Button from "../components/common/Button";
import { FiMail, FiLock, FiLogIn } from "react-icons/fi";
import axiosInstance from "../services/axios";
import { setCredentials } from "../redux/authSlice";

/**
 * Login Page
 * ----------
 * Provides user authentication with a premium, responsive, dark-mode aware UI.
 * Handles form state, loading, error displaying, and Redux integration.
 */
export default function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) return;

    setLoading(true);
    setError(null);
    try {
      // Adjust endpoint if needed
      const response = await axiosInstance.post("/api/auth/login", formData);
      const { user, token } = response.data;
      
      dispatch(setCredentials({ user, token }));
      
      // Redirect to home or dashboard based on role
      if (user.role === 'admin') {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } catch (err) {
      console.error("Login error", err);
      setError(
        err.response?.data?.message || "Invalid email or password. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 transition-colors py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white dark:bg-gray-800 p-10 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700">
        
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">
            Welcome back
          </h2>
          <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
            Sign in to your account to continue shopping.
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="p-4 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm font-medium border border-red-100 dark:border-red-800 text-center">
              {error}
            </div>
          )}

          <div className="space-y-5">
            <Input
              id="email"
              type="email"
              label="Email Address"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
              icon={<FiMail className="text-gray-400" />}
              required
            />

            <Input
              id="password"
              type="password"
              label="Password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              icon={<FiLock className="text-gray-400" />}
              required
            />
          </div>

          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900 dark:text-gray-300">
                Remember me
              </label>
            </div>

            <div className="text-sm">
              <Link
                to="/forgot-password"
                className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors"
              >
                Forgot your password?
              </Link>
            </div>
          </div>

          <div>
            <Button
              type="submit"
              disabled={loading || !formData.email || !formData.password}
              className="w-full flex justify-center items-center bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-semibold transition-transform hover:-translate-y-0.5 shadow-lg shadow-indigo-500/30 disabled:opacity-70 disabled:transform-none"
            >
              {loading ? (
                "Signing in..."
              ) : (
                <>
                  <FiLogIn className="mr-2" /> Sign In
                </>
              )}
            </Button>
          </div>

          <div className="text-center mt-6">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors"
              >
                Sign up
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
