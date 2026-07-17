import React, { useState } from "react";
import { Link } from "react-router-dom";
import Input from "../components/common/Input";
import Button from "../components/common/Button";
import { FiMail, FiArrowLeft, FiCheckCircle } from "react-icons/fi";
import axiosInstance from "../services/axios";

/**
 * ForgotPassword Page
 * -------------------
 * Allows users to request a password reset link.
 * Includes premium UI styling, input validation, and success state.
 */
export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    setError(null);
    try {
      // API call to send reset email
      await axiosInstance.post("/api/auth/forgot-password", { email });
      setSuccess(true);
    } catch (err) {
      console.error("Forgot password error", err);
      setError(
        err.response?.data?.message || "Failed to send reset link. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 transition-colors py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white dark:bg-gray-800 p-10 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700">
        
        {success ? (
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 dark:bg-green-900/30 mb-6">
              <FiCheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
            </div>
            <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-4">
              Check your email
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-8">
              We've sent a password reset link to <br />
              <span className="font-semibold text-gray-800 dark:text-gray-100">{email}</span>
            </p>
            <Link to="/login">
              <Button className="w-full flex items-center justify-center bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-medium transition-transform hover:-translate-y-0.5 shadow-lg shadow-indigo-500/30">
                <FiArrowLeft className="mr-2" /> Back to Login
              </Button>
            </Link>
          </div>
        ) : (
          <>
            <div className="text-center">
              <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">
                Forgot Password
              </h2>
              <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
                Enter the email address associated with your account and we'll send you a link to reset your password.
              </p>
            </div>

            <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
              {error && (
                <div className="p-4 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm font-medium border border-red-100 dark:border-red-800">
                  {error}
                </div>
              )}

              <div>
                <Input
                  id="email"
                  type="email"
                  label="Email Address"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  icon={<FiMail className="text-gray-400" />}
                  required
                />
              </div>

              <div>
                <Button
                  type="submit"
                  disabled={loading || !email}
                  className="w-full flex justify-center bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-semibold transition-transform hover:-translate-y-0.5 shadow-lg shadow-indigo-500/30 disabled:opacity-70 disabled:transform-none"
                >
                  {loading ? "Sending link..." : "Send Reset Link"}
                </Button>
              </div>

              <div className="text-center mt-6">
                <Link
                  to="/login"
                  className="inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors"
                >
                  <FiArrowLeft className="mr-2" /> Back to Login
                </Link>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
