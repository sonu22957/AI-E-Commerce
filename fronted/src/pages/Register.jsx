import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import Input from "../components/common/Input";
import Button from "../components/common/Button";
import { FiUser, FiMail, FiLock, FiUserPlus } from "react-icons/fi";
import axiosInstance from "../services/axios";
import { setCredentials } from "../redux/authSlice";

/**
 * Register Page
 * -------------
 * Provides user registration with a premium, responsive, dark-mode aware UI.
 * Handles form state, password validation, loading, error displaying, and Redux integration.
 */
export default function Register() {
  const [formData, setFormData] = useState({ 
    name: "",
    email: "", 
    password: "",
    confirmPassword: ""
  });
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
    
    // Basic validation
    if (!formData.name || !formData.email || !formData.password) {
      setError("Please fill in all required fields.");
      return;
    }
    
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      // Adjust endpoint if needed
      colsole.log(formData , "formData" , ".env", import.meta.env.VITE_API_URL);
      const response = await axiosInstance.post("/api/auth/register", {
        name: formData.name,
        email: formData.email,
        password: formData.password
      });
      
      const { user, token } = response.data;
      
      dispatch(setCredentials({ user, token }));
      
      // Redirect to home page after successful registration
      navigate("/");
    } catch (err) {
      console.error("Registration error", err);
      setError(
        err.response?.data?.message || "Registration failed. Please try again."
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
            Create an account
          </h2>
          <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
            Join us today and start your premium shopping experience.
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
              id="name"
              type="text"
              label="Full Name"
              placeholder="John Doe"
              value={formData.name}
              onChange={handleChange}
              icon={<FiUser className="text-gray-400" />}
              required
            />

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

            <Input
              id="confirmPassword"
              type="password"
              label="Confirm Password"
              placeholder="••••••••"
              value={formData.confirmPassword}
              onChange={handleChange}
              icon={<FiLock className="text-gray-400" />}
              required
            />
          </div>

          <div className="flex items-center mt-4">
            <input
              id="terms"
              name="terms"
              type="checkbox"
              required
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600"
            />
            <label htmlFor="terms" className="ml-2 block text-sm text-gray-900 dark:text-gray-300">
              I agree to the{" "}
              <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors">
                Privacy Policy
              </a>
            </label>
          </div>

          <div>
            <Button
              type="submit"
              disabled={loading || !formData.email || !formData.password || !formData.name}
              className="w-full flex justify-center items-center bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-semibold transition-transform hover:-translate-y-0.5 shadow-lg shadow-indigo-500/30 disabled:opacity-70 disabled:transform-none"
            >
              {loading ? (
                "Creating account..."
              ) : (
                <>
                  <FiUserPlus className="mr-2" /> Sign Up
                </>
              )}
            </Button>
          </div>

          <div className="text-center mt-6">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors"
              >
                Sign in
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
