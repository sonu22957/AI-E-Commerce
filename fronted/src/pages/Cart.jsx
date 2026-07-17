import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";
import CartItem from "../components/cart/CartItem";
import Button from "../components/common/Button";
import DeliveryEstimate from "../components/common/DeliveryEstimate";
import {
  selectCartItems,
  removeFromCart,
  updateItemQuantity,
} from "../redux/cartSlice";
import {
  FiShoppingBag,
  FiArrowRight,
  FiTruck,
  FiShield,
  FiRefreshCw,
  FiTag,
  FiX,
  FiChevronRight,
  FiGift,
  FiStar,
  FiShoppingCart,
  FiTrendingUp,
  FiHeart,
} from "react-icons/fi";
import { MdLocalOffer } from "react-icons/md";
import axiosInstance from "../services/axios";

/**
 * Cart Page — Premium redesign
 * Fixes Redux selector (cartItems), adds:
 * - Animated empty state with trending products
 * - Coupon code input
 * - Savings highlight
 * - Trust badges
 * - Full delivery estimate widget
 */
export default function Cart() {
  const cartItems = useSelector(selectCartItems);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [shippingMethod, setShippingMethod] = useState("standard");
  const [coupon, setCoupon] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponMsg, setCouponMsg] = useState("");
  const [discount, setDiscount] = useState(0);
  const [trendingProducts, setTrendingProducts] = useState([]);
  const [loadingTrending, setLoadingTrending] = useState(false);
  const [cartMsg, setCartMsg] = useState("");

  const SHIPPING_PRICE = { standard: 0, express: 99, overnight: 249 };

  // Fixed: use cartItems (from Redux slice)
  const subtotal = cartItems.reduce(
    (total, item) => total + (item.price || 0) * (item.quantity || 1),
    0
  );
  const tax = subtotal * 0.05;
  const shippingCost = subtotal > 5000 ? 0 : (SHIPPING_PRICE[shippingMethod] ?? 0);
  const discountAmount = couponApplied ? discount : 0;
  const total = subtotal + tax + shippingCost - discountAmount;
  const savings = discountAmount + (SHIPPING_PRICE["standard"] - shippingCost < 0 ? 0 : 0);

  // Fetch trending products for empty cart
  useEffect(() => {
    if (cartItems.length === 0) {
      setLoadingTrending(true);
      axiosInstance
        .get("/api/ai/recommendations")
        .then(({ data }) => setTrendingProducts(data?.items || []))
        .catch(() =>
          axiosInstance
            .get("/api/products?limit=6&sort=-rating")
            .then(({ data }) => setTrendingProducts(data?.products || data || []))
            .catch(() => setTrendingProducts([]))
        )
        .finally(() => setLoadingTrending(false));
    }
  }, [cartItems.length]);

  const handleCoupon = () => {
    const code = coupon.trim().toUpperCase();
    if (code === "SAVE10") {
      setDiscount(subtotal * 0.1);
      setCouponApplied(true);
      setCouponMsg("🎉 10% discount applied!");
    } else if (code === "FLAT200") {
      setDiscount(200);
      setCouponApplied(true);
      setCouponMsg("🎉 ₹200 off applied!");
    } else if (code === "FREESHIP") {
      setDiscount(shippingCost);
      setCouponApplied(true);
      setCouponMsg("🎉 Free shipping applied!");
    } else {
      setCouponMsg("❌ Invalid coupon code.");
      setTimeout(() => setCouponMsg(""), 3000);
    }
  };

  const removeCouponHandler = () => {
    setCoupon("");
    setCouponApplied(false);
    setDiscount(0);
    setCouponMsg("");
  };

  const addTrendingToCart = async (product) => {
    try {
      await axiosInstance.post("/api/carts", { productId: product._id, quantity: 1 });
      setCartMsg(`✅ "${product.name}" cart mein add ho gaya!`);
      setTimeout(() => setCartMsg(""), 3000);
    } catch {
      setCartMsg("⚠️ Login karein pehle!");
      setTimeout(() => setCartMsg(""), 3000);
    }
  };

  // ── EMPTY CART STATE ─────────────────────────────────────────────────────────
  if (cartItems.length === 0) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
        <Navbar />
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-8">
            Shopping Cart
          </h1>

          {/* Empty state hero */}
          <div className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 rounded-3xl p-8 sm:p-12 text-white text-center mb-10 shadow-2xl">
            {/* Decorative blobs */}
            <div className="absolute -top-10 -left-10 w-40 h-40 rounded-full bg-white/10 blur-2xl" />
            <div className="absolute -bottom-10 -right-10 w-56 h-56 rounded-full bg-white/10 blur-3xl" />

            <div className="relative z-10">
              <div className="mx-auto w-24 h-24 bg-white/20 backdrop-blur-sm rounded-3xl flex items-center justify-center mb-6 shadow-inner">
                <FiShoppingBag className="w-12 h-12 text-white" />
              </div>
              <h2 className="text-3xl font-extrabold mb-3">Your cart is empty</h2>
              <p className="text-indigo-200 text-lg mb-8 max-w-md mx-auto">
                Kuch khareedo! Hamare trending products dekhein aur apni favourite cheezein cart mein add karein.
              </p>
              <Link to="/products">
                <button className="inline-flex items-center gap-2 bg-white text-indigo-600 font-bold px-8 py-4 rounded-2xl hover:bg-indigo-50 transition-all shadow-lg hover:-translate-y-0.5 hover:shadow-xl">
                  <FiShoppingBag className="h-5 w-5" />
                  Start Shopping
                  <FiArrowRight className="h-5 w-5" />
                </button>
              </Link>
            </div>
          </div>

          {/* Trust badges row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
            {[
              { icon: FiTruck, label: "Free Delivery", sub: "Orders above ₹5000" },
              { icon: FiShield, label: "Secure Payment", sub: "100% safe & encrypted" },
              { icon: FiRefreshCw, label: "Easy Returns", sub: "7-day return policy" },
              { icon: FiGift, label: "Gift Wrapping", sub: "Available on checkout" },
            ].map(({ icon: Icon, label, sub }) => (
              <div
                key={label}
                className="flex flex-col items-center text-center bg-white dark:bg-gray-800 rounded-2xl p-4 border border-gray-100 dark:border-gray-700 shadow-sm"
              >
                <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center mb-2">
                  <Icon className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                </div>
                <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">{label}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{sub}</p>
              </div>
            ))}
          </div>

          {/* Cart notification */}
          {cartMsg && (
            <div className="mb-6 px-4 py-3 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-700 rounded-2xl text-sm font-medium text-green-700 dark:text-green-300">
              {cartMsg}
            </div>
          )}

          {/* Trending products */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <FiTrendingUp className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  Trending Products
                </h3>
              </div>
              <Link
                to="/products"
                className="text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
              >
                View all <FiChevronRight className="h-4 w-4" />
              </Link>
            </div>

            {loadingTrending ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden animate-pulse">
                    <div className="h-36 bg-gray-200 dark:bg-gray-700" />
                    <div className="p-3 space-y-2">
                      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
                      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            ) : trendingProducts.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                {trendingProducts.slice(0, 6).map((product) => (
                  <div
                    key={product._id}
                    className="group bg-white dark:bg-gray-800 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 flex flex-col"
                  >
                    <div className="relative overflow-hidden">
                      <img
                        src={
                          product.images?.length > 0
                            ? product.images[0]
                            : product.image ||
                              `https://picsum.photos/seed/${product._id}/300/200`
                        }
                        alt={product.name}
                        className="w-full h-36 object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = `https://picsum.photos/seed/${product._id}/300/200`;
                        }}
                      />
                      <button className="absolute top-2 right-2 p-1.5 rounded-full bg-white/80 dark:bg-gray-800/80 text-gray-400 hover:text-pink-500 transition-colors opacity-0 group-hover:opacity-100">
                        <FiHeart className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    <div className="p-3 flex flex-col flex-1">
                      <p className="text-xs font-semibold text-gray-800 dark:text-gray-100 truncate leading-tight mb-1">
                        {product.name}
                      </p>
                      <div className="flex items-center gap-1 mb-2">
                        <FiStar className="h-3 w-3 text-yellow-400 fill-current" />
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {product.rating || "New"}
                        </span>
                      </div>
                      <p className="text-sm font-bold text-indigo-600 dark:text-indigo-400 mb-2">
                        ₹{(product.price || 0).toLocaleString("en-IN")}
                      </p>
                      <button
                        onClick={() => addTrendingToCart(product)}
                        className="mt-auto w-full flex items-center justify-center gap-1.5 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-600 hover:text-white dark:hover:bg-indigo-500 dark:hover:text-white transition-all text-xs font-semibold"
                      >
                        <FiShoppingCart className="h-3.5 w-3.5" />
                        Add to Cart
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 dark:text-gray-400 text-sm text-center py-10">
                Koi trending product nahi mila.
              </p>
            )}
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // ── FILLED CART STATE ────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">
            Shopping Cart
            <span className="ml-3 text-lg font-semibold text-indigo-600 dark:text-indigo-400">
              ({cartItems.length} {cartItems.length === 1 ? "item" : "items"})
            </span>
          </h1>
          <Link
            to="/products"
            className="text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
          >
            <FiShoppingBag className="h-4 w-4" /> Continue Shopping
          </Link>
        </div>

        <div className="lg:grid lg:grid-cols-12 lg:gap-x-8 lg:items-start">
          {/* ── Left: Cart Items ── */}
          <div className="lg:col-span-7 xl:col-span-8 space-y-3">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
              <ul className="divide-y divide-gray-100 dark:divide-gray-700">
                {cartItems.map((item) => (
                  <CartItem key={item._id || item.id} item={item} />
                ))}
              </ul>
            </div>

            {/* Trust badges */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { icon: FiShield, text: "Secure Payment" },
                { icon: FiRefreshCw, text: "Easy Returns" },
                { icon: FiTruck, text: "Fast Delivery" },
              ].map(({ icon: Icon, text }) => (
                <div
                  key={text}
                  className="flex items-center gap-2 bg-white dark:bg-gray-800 rounded-xl p-3 border border-gray-100 dark:border-gray-700 text-xs font-medium text-gray-600 dark:text-gray-400"
                >
                  <Icon className="h-4 w-4 text-indigo-500 flex-shrink-0" />
                  {text}
                </div>
              ))}
            </div>
          </div>

          {/* ── Right: Order Summary ── */}
          <div className="mt-8 lg:mt-0 lg:col-span-5 xl:col-span-4 space-y-4">
            {/* Coupon Code */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-5">
              <div className="flex items-center gap-2 mb-3">
                <MdLocalOffer className="h-5 w-5 text-orange-500" />
                <h3 className="text-sm font-bold text-gray-800 dark:text-gray-100">
                  Apply Coupon
                </h3>
              </div>
              {couponApplied ? (
                <div className="flex items-center justify-between bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-700 rounded-xl px-4 py-2.5">
                  <span className="text-sm text-green-700 dark:text-green-300 font-semibold flex items-center gap-2">
                    <FiTag className="h-4 w-4" />
                    {coupon.toUpperCase()} · {couponMsg}
                  </span>
                  <button
                    onClick={removeCouponHandler}
                    className="text-green-600 dark:text-green-400 hover:text-red-500 transition-colors"
                  >
                    <FiX className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <input
                    value={coupon}
                    onChange={(e) => setCoupon(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleCoupon()}
                    placeholder="Enter coupon code"
                    className="flex-1 text-sm rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 px-4 py-2.5 text-gray-900 dark:text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-indigo-500 transition"
                  />
                  <button
                    onClick={handleCoupon}
                    className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl transition-colors"
                  >
                    Apply
                  </button>
                </div>
              )}
              {couponMsg && !couponApplied && (
                <p className="mt-2 text-xs text-red-500">{couponMsg}</p>
              )}
              <p className="mt-2 text-xs text-gray-400 dark:text-gray-500">
                Try: <span className="font-mono font-semibold text-indigo-500">SAVE10</span> · <span className="font-mono font-semibold text-indigo-500">FLAT200</span> · <span className="font-mono font-semibold text-indigo-500">FREESHIP</span>
              </p>
            </div>

            {/* Price Breakdown */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-5">
              <h2 className="text-base font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <FiTag className="h-4 w-4 text-indigo-500" /> Order Summary
              </h2>
              <dl className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
                <div className="flex justify-between">
                  <dt>Subtotal ({cartItems.length} items)</dt>
                  <dd className="font-semibold text-gray-900 dark:text-white">
                    ₹{subtotal.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt>Shipping</dt>
                  <dd className={`font-semibold ${shippingCost === 0 ? "text-green-600 dark:text-green-400" : "text-gray-900 dark:text-white"}`}>
                    {shippingCost === 0 ? "FREE 🎉" : `₹${shippingCost}`}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt>Tax (5%)</dt>
                  <dd className="font-semibold text-gray-900 dark:text-white">
                    ₹{tax.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                  </dd>
                </div>
                {couponApplied && (
                  <div className="flex justify-between text-green-600 dark:text-green-400">
                    <dt className="flex items-center gap-1">
                      <FiTag className="h-3.5 w-3.5" /> Discount
                    </dt>
                    <dd className="font-semibold">
                      -₹{discountAmount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                    </dd>
                  </div>
                )}
                <div className="flex justify-between pt-3 border-t border-gray-200 dark:border-gray-700">
                  <dt className="text-base font-bold text-gray-900 dark:text-white">Total</dt>
                  <dd className="text-xl font-extrabold text-indigo-600 dark:text-indigo-400">
                    ₹{total.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                  </dd>
                </div>
              </dl>

              {/* Savings highlight */}
              {(couponApplied || shippingCost === 0) && (
                <div className="mt-4 flex items-center gap-2 bg-green-50 dark:bg-green-900/20 rounded-xl px-4 py-2.5 border border-green-100 dark:border-green-800">
                  <FiGift className="h-4 w-4 text-green-600 dark:text-green-400 flex-shrink-0" />
                  <p className="text-xs font-semibold text-green-700 dark:text-green-300">
                    You're saving ₹{(discountAmount + (subtotal > 5000 ? SHIPPING_PRICE.standard : 0)).toLocaleString("en-IN")} on this order! 🎉
                  </p>
                </div>
              )}

              {/* Checkout Button */}
              <button
                onClick={() => navigate("/checkout")}
                className="mt-5 w-full flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white py-4 rounded-2xl font-bold text-base transition-all hover:-translate-y-0.5 shadow-lg shadow-indigo-500/30"
              >
                Proceed to Checkout
                <FiArrowRight className="h-5 w-5" />
              </button>
              <p className="mt-3 text-xs text-center text-gray-400 dark:text-gray-500 flex items-center justify-center gap-1">
                <FiShield className="h-3.5 w-3.5" /> Secure, encrypted checkout
              </p>
            </div>

            {/* Delivery Estimate Widget */}
            <DeliveryEstimate
              shippingMethod={shippingMethod}
              showOptions={true}
              onMethodChange={setShippingMethod}
            />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
