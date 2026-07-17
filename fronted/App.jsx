import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

// Pages
import Home from "./src/pages/Home";
import Products from "./src/pages/Products";
import ProductDetails from "./src/pages/ProductDetails";
import Cart from "./src/pages/Cart";
import Checkout from "./src/pages/Checkout";
import Login from "./src/pages/Login";
import Register from "./src/pages/Register";
import ForgotPassword from "./src/pages/ForgotPassword";
import ResetPassword from "./src/pages/ResetPassword";
import Profile from "./src/pages/Profile";
import Orders from "./src/pages/Orders";
import Wishlist from "./src/pages/Wishlist";
import AIAssistant from "./src/pages/AIAssistant";
import AdminDashboard from "./src/pages/AdminDashboard";
import ManageOrders from "./src/pages/ManageOrders";
import ManageProducts from "./src/pages/ManageProducts";
import ManageUsers from "./src/pages/ManageUsers";
import NotFound from "./src/pages/NotFound";

/**
 * Protected Route Component
 * -------------------------
 * Restricts access to authenticated users. Redirects to /login if unauthenticated.
 */
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

/**
 * Admin Route Component
 * ---------------------
 * Restricts access to admin users. Redirects to / if unauthorized.
 */
const AdminRoute = ({ children }) => {
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  return isAuthenticated && user?.role === "admin" ? (
    children
  ) : (
    <Navigate to="/" replace />
  );
};

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/ai-assistant" element={<AIAssistant />} />

        {/* Protected Customer Routes */}
        <Route
          path="/checkout"
          element={
            <ProtectedRoute>
              <Checkout />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/orders"
          element={
            <ProtectedRoute>
              <Orders />
            </ProtectedRoute>
          }
        />
        <Route
          path="/wishlist"
          element={
            <ProtectedRoute>
              <Wishlist />
            </ProtectedRoute>
          }
        />

        {/* Admin Routes */}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/orders"
          element={
            <AdminRoute>
              <ManageOrders />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/products"
          element={
            <AdminRoute>
              <ManageProducts />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <AdminRoute>
              <ManageUsers />
            </AdminRoute>
          }
        />

        {/* 404 Route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}
