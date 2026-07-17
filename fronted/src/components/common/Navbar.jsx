import React, { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../redux/authSlice";
import {
  FiShoppingBag,
  FiShoppingCart,
  FiHeart,
  FiUser,
  FiLogOut,
  FiMenu,
  FiX,
  FiSun,
  FiMoon,
  FiSearch,
} from "react-icons/fi";
import SmartSearch from "../ai/SmartSearch";

/**
 * Navbar Component
 * ----------------
 * Responsive top navigation bar with authentication state awareness.
 * Shows cart count, wishlist, user avatar, and admin link for admins.
 * Includes mobile menu toggle and dark mode placeholder.
 */
export default function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const cartItems = useSelector((state) => state.cart.items ?? []);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dark, setDark] = useState(
    () => document.documentElement.classList.contains("dark")
  );

  const cartCount = cartItems.reduce((sum, item) => sum + (item.quantity ?? 1), 0);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const toggleDark = () => {
    document.documentElement.classList.toggle("dark");
    setDark((d) => !d);
  };

  const navLinks = [
    { label: "Products", to: "/products" },
    { label: "AI Assistant", to: "/ai-assistant" },
  ];

  const activeCls = "text-indigo-600 dark:text-indigo-400 font-semibold";
  const linkCls =
    "text-sm text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors";

  return (
    <header className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <FiShoppingBag className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
            <span className="text-lg font-bold text-gray-900 dark:text-white">SmartCart AI</span>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                className={({ isActive }) =>
                  isActive ? `${activeCls} text-sm` : linkCls
                }
              >
                {l.label}
              </NavLink>
            ))}
            {isAuthenticated && user?.role === "admin" && (
              <NavLink
                to="/admin"
                className={({ isActive }) =>
                  isActive ? `${activeCls} text-sm` : linkCls
                }
              >
                Admin
              </NavLink>
            )}
          </nav>

          {/* Right Icons */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Dark mode toggle */}
            <button
              onClick={toggleDark}
              aria-label="Toggle dark mode"
              className="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              {dark ? <FiSun className="h-5 w-5" /> : <FiMoon className="h-5 w-5" />}
            </button>

            {/* Search */}
            <div className="hidden sm:block w-64">
              <SmartSearch onSelect={(item) => navigate(`/products/${item.id}`)} />
            </div>

            {isAuthenticated ? (
              <>
                {/* Wishlist */}
                <Link
                  to="/wishlist"
                  aria-label="Wishlist"
                  className="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors hidden sm:inline-flex"
                >
                  <FiHeart className="h-5 w-5" />
                </Link>

                {/* Cart */}
                <Link
                  to="/cart"
                  aria-label="Cart"
                  className="relative p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  <FiShoppingCart className="h-5 w-5" />
                  {cartCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 h-4 w-4 flex items-center justify-center rounded-full bg-indigo-600 text-white text-[10px] font-bold">
                      {cartCount > 9 ? "9+" : cartCount}
                    </span>
                  )}
                </Link>

                {/* Profile */}
                <Link
                  to="/profile"
                  aria-label="Profile"
                  className="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors hidden sm:inline-flex"
                >
                  <FiUser className="h-5 w-5" />
                </Link>

                {/* Logout */}
                <button
                  onClick={handleLogout}
                  aria-label="Logout"
                  className="hidden sm:inline-flex p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-500 transition-colors"
                >
                  <FiLogOut className="h-5 w-5" />
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="hidden sm:inline-flex text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="hidden sm:inline-flex text-sm font-medium px-4 py-2 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white transition-colors shadow-sm"
                >
                  Sign up
                </Link>
              </>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileOpen((o) => !o)}
              aria-label="Toggle menu"
              className="md:hidden p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              {mobileOpen ? <FiX className="h-5 w-5" /> : <FiMenu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="md:hidden bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 px-4 py-4 space-y-3">
          {navLinks.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                `block text-sm py-2 ${isActive ? activeCls : linkCls}`
              }
            >
              {l.label}
            </NavLink>
          ))}
          {isAuthenticated ? (
            <>
              <NavLink to="/wishlist" onClick={() => setMobileOpen(false)} className={`block text-sm py-2 ${linkCls}`}>Wishlist</NavLink>
              <NavLink to="/orders" onClick={() => setMobileOpen(false)} className={`block text-sm py-2 ${linkCls}`}>Orders</NavLink>
              <NavLink to="/profile" onClick={() => setMobileOpen(false)} className={`block text-sm py-2 ${linkCls}`}>Profile</NavLink>
              {user?.role === "admin" && (
                <NavLink to="/admin" onClick={() => setMobileOpen(false)} className={`block text-sm py-2 ${linkCls}`}>Admin</NavLink>
              )}
              <button onClick={() => { handleLogout(); setMobileOpen(false); }} className="block w-full text-left text-sm py-2 text-red-500">
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" onClick={() => setMobileOpen(false)} className={`block text-sm py-2 ${linkCls}`}>Login</NavLink>
              <NavLink to="/register" onClick={() => setMobileOpen(false)} className={`block text-sm py-2 ${linkCls}`}>Sign up</NavLink>
            </>
          )}
        </div>
      )}
    </header>
  );
}
