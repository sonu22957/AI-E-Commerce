import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";
import Input from "../components/common/Input";
import Button from "../components/common/Button";
import { FiUser, FiMail, FiLock, FiSave } from "react-icons/fi";
import axiosInstance from "../services/axios";
import { setCredentials } from "../redux/authSlice";

/**
 * Profile Page
 * ------------
 * Allows users to view and update their profile details (Name, Email, Password).
 * Features smooth state transitions, error handling, and a modern card layout.
 */
export default function Profile() {
  const { user, token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        name: user.name || "",
        email: user.email || "",
      }));
    }
  }, [user]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setTimeout(() => setError(null), 3000);
      return;
    }

    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      const response = await axiosInstance.put("/api/users/profile", {
        name: formData.name,
        email: formData.email,
        password: formData.password || undefined,
      });

      dispatch(setCredentials({ user: response.data, token }));
      setMessage("Profile updated successfully!");
      setFormData((prev) => ({ ...prev, password: "", confirmPassword: "" }));
      setTimeout(() => setMessage(null), 4000);
    } catch (err) {
      console.error("Profile update error", err);
      setError(err.response?.data?.message || "Failed to update profile");
      setTimeout(() => setError(null), 4000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 transition-colors">
      <Navbar />

      <main className="flex-1 max-w-3xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden">
          
          {/* Header */}
          <div className="px-8 py-6 border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
              <FiUser className="mr-3 text-indigo-500" /> My Profile
            </h1>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 ml-9">
              Update your personal details and change your password.
            </p>
          </div>

          {/* Form */}
          <div className="p-8">
            {message && (
              <div className="mb-6 p-4 rounded-xl bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 text-sm font-medium border border-green-200 dark:border-green-800">
                {message}
              </div>
            )}
            
            {error && (
              <div className="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm font-medium border border-red-100 dark:border-red-800">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  id="name"
                  type="text"
                  label="Full Name"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={handleChange}
                  icon={<FiUser className="text-gray-400" />}
                />

                <Input
                  id="email"
                  type="email"
                  label="Email Address"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  icon={<FiMail className="text-gray-400" />}
                />
              </div>

              <div className="pt-6 border-t border-gray-100 dark:border-gray-700">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Change Password</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input
                    id="password"
                    type="password"
                    label="New Password"
                    placeholder="Leave blank to keep current"
                    value={formData.password}
                    onChange={handleChange}
                    icon={<FiLock className="text-gray-400" />}
                  />

                  <Input
                    id="confirmPassword"
                    type="password"
                    label="Confirm New Password"
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    icon={<FiLock className="text-gray-400" />}
                  />
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <Button
                  type="submit"
                  disabled={loading}
                  className="flex items-center px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold transition-transform hover:-translate-y-0.5 shadow-lg shadow-indigo-500/30 disabled:opacity-70 disabled:transform-none"
                >
                  {loading ? (
                    "Saving..."
                  ) : (
                    <>
                      <FiSave className="mr-2" /> Save Changes
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
