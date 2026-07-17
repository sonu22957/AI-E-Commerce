import React from "react";
import { Link } from "react-router-dom";
import { FiShoppingBag, FiGithub, FiTwitter, FiInstagram } from "react-icons/fi";

/**
 * Footer Component
 * ----------------
 * Site-wide footer with navigation links, brand info, and social links.
 * Fully supports dark mode.
 */
export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <FiShoppingBag className="h-7 w-7 text-indigo-600 dark:text-indigo-400" />
              <span className="text-xl font-bold text-gray-900 dark:text-white">SmartCart AI</span>
            </Link>
            <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed max-w-xs">
              Next-generation shopping powered by AI. Discover products tailored
              perfectly to you.
            </p>
            <div className="flex gap-4 mt-5">
              <a href="#" aria-label="Twitter" className="text-gray-400 hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors">
                <FiTwitter className="h-5 w-5" />
              </a>
              <a href="#" aria-label="Instagram" className="text-gray-400 hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors">
                <FiInstagram className="h-5 w-5" />
              </a>
              <a href="#" aria-label="GitHub" className="text-gray-400 hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors">
                <FiGithub className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Shop Links */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4">
              Shop
            </h3>
            <ul className="space-y-3">
              {[
                { label: "All Products", to: "/products" },
                { label: "Cart", to: "/cart" },
                { label: "Wishlist", to: "/wishlist" },
                { label: "My Orders", to: "/orders" },
              ].map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-sm text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Account Links */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4">
              Account
            </h3>
            <ul className="space-y-3">
              {[
                { label: "Profile", to: "/profile" },
                { label: "Login", to: "/login" },
                { label: "Register", to: "/register" },
                { label: "AI Assistant", to: "/ai-assistant" },
              ].map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-sm text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-8 border-t border-gray-200 dark:border-gray-800 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-gray-400 dark:text-gray-500">
            © {year} SmartCart AI. All rights reserved.
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-500">
            Built with ❤️ using React & AI
          </p>
        </div>
      </div>
    </footer>
  );
}
