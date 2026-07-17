import React from "react";
import { Link } from "react-router-dom";
import Button from "../components/common/Button";
import { FiHome, FiArrowLeft } from "react-icons/fi";

/**
 * NotFound Page
 * -------------
 * A premium 404 error page displayed when a user navigates to a non-existent route.
 * Features modern aesthetics, dark mode support, and clear calls to action.
 */
export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 transition-colors px-4 sm:px-6 lg:px-8 text-center">
      
      {/* Decorative Background Blob */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-indigo-500/10 dark:bg-indigo-500/5 rounded-full blur-3xl -z-10 pointer-events-none" />

      <h1 className="text-9xl font-extrabold text-indigo-600 dark:text-indigo-500 drop-shadow-sm">
        404
      </h1>
      
      <div className="mt-8">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
          Page Not Found
        </h2>
        <p className="mt-4 max-w-md mx-auto text-base text-gray-500 dark:text-gray-400 sm:text-lg">
          Oops! The page you're looking for seems to have wandered off. Let's get you back on track.
        </p>
      </div>

      <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
        <Link to="/">
          <Button className="w-full sm:w-auto flex items-center justify-center bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-full font-medium transition-transform hover:-translate-y-0.5 shadow-lg shadow-indigo-500/30">
            <FiHome className="mr-2 h-5 w-5" /> Go Home
          </Button>
        </Link>
        <button
          onClick={() => window.history.back()}
          className="w-full sm:w-auto flex items-center justify-center bg-white hover:bg-gray-50 text-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700 border border-gray-300 dark:border-gray-600 px-8 py-3 rounded-full font-medium transition-all hover:shadow-md"
        >
          <FiArrowLeft className="mr-2 h-5 w-5" /> Go Back
        </button>
      </div>
    </div>
  );
}
