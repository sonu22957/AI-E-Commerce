import React, { useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import Input from "../components/common/Input";
import Button from "../components/common/Button";
import { FiLock, FiCheckCircle, FiAlertCircle } from "react-icons/fi";
import axiosInstance from "../services/axios";

/**
 * ResetPassword Page
 * ------------------
 * Form for users to enter and confirm a new password using a reset token from their email.
 */
export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (!formData.password) {
      setError("Please enter a new password.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      // Adjust endpoint if needed
      await axiosInstance.put(`/api/auth/resetpassword/${token}`, {
        password: formData.password,
      });
      
      setSuccess(true);
      setTimeout(() => {
        navigate("/login");
      }, 3000); // Redirect to login after 3 seconds
    } catch (err) {
      console.error("Reset password error", err);
      setError(
        err.response?.data?.message || "Invalid or expired reset token. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 transition-colors py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white dark:bg-gray-800 p-10 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700">
        
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-indigo-100 dark:bg-indigo-900/30 mb-4">
            <FiLock className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
          </div>
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">
            Reset Password
          </h2>
          <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
            Enter your new password below.
          </p>
        </div>

        {success ? (
          <div className="rounded-2xl bg-green-50 dark:bg-green-900/20 p-6 text-center border border-green-200 dark:border-green-800">
            <FiCheckCircle className="mx-auto h-12 w-12 text-green-500 mb-4" />
            <h3 className="text-lg font-medium text-green-800 dark:text-green-400">Password Reset Successful</h3>
            <p className="mt-2 text-sm text-green-700 dark:text-green-500">
              Your password has been changed successfully. You are being redirected to the login page.
            </p>
            <div className="mt-6">
              <Link to="/login">
                <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
                  Go to Login
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="flex items-center p-4 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm font-medium border border-red-100 dark:border-red-800">
                <FiAlertCircle className="mr-3 h-5 w-5 flex-shrink-0" />
                {error}
              </div>
            )}

            <div className="space-y-5">
              <Input
                id="password"
                type="password"
                label="New Password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                icon={<FiLock className="text-gray-400" />}
                required
              />

              <Input
                id="confirmPassword"
                type="password"
                label="Confirm New Password"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={handleChange}
                icon={<FiLock className="text-gray-400" />}
                required
              />
            </div>

            <div>
              <Button
                type="submit"
                disabled={loading || !formData.password || !formData.confirmPassword}
                className="w-full flex justify-center items-center bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-semibold transition-transform hover:-translate-y-0.5 shadow-lg shadow-indigo-500/30 disabled:opacity-70 disabled:transform-none"
              >
                {loading ? "Resetting Password..." : "Reset Password"}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
