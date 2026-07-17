import React from "react";
import Navbar from "../components/common/Navbar";
import AIChatbot from "../components/ai/AIChatbot";
import AIRecommendation from "../components/ai/AIRecommendation";

/**
 * AIAssistant Page
 * ----------------
 * Provides a dedicated page for AI interactions, including a chatbot and recommendations.
 * Uses Tailwind CSS with a modern, responsive layout.
 */
export default function AIAssistant() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">
            Your Personal AI Assistant
          </h1>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
            Get personalized shopping recommendations or ask questions about our products.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Chatbot Area */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-700 h-[600px]">
              <AIChatbot />
            </div>
          </div>

          {/* Side Panel for Recommendations */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border border-gray-100 dark:border-gray-700">
              <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">
                Recommended for You
              </h2>
              <AIRecommendation />
            </div>
            
            <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl p-6 border border-indigo-100 dark:border-indigo-800">
              <h3 className="text-lg font-semibold text-indigo-800 dark:text-indigo-300 mb-2">
                Pro Tip
              </h3>
              <p className="text-sm text-indigo-700 dark:text-indigo-400">
                You can ask the assistant to track your orders, suggest gifts, or compare products based on your preferences!
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
