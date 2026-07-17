import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";
import Button from "../components/common/Button";
import Loader from "../components/common/Loader";
import { FiHeart, FiShoppingCart, FiTrash2 } from "react-icons/fi";
import axiosInstance from "../services/axios";
import { addToCart } from "../redux/cartSlice";

/**
 * Wishlist Page
 * -------------
 * Displays a grid of products the user has saved for later.
 * Features an empty state, loading state, and the ability to add items to cart or remove them.
 */
export default function Wishlist() {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const fetchWishlist = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.get("/api/wishlist");
      // Axios interceptor unwraps ApiResponse.data, so response.data
      // is the wishlist object { products: [...] } or an array directly
      const data = response.data;
      if (Array.isArray(data)) {
        setWishlistItems(data);
      } else if (data?.products) {
        setWishlistItems(data.products);
      } else {
        setWishlistItems([]);
      }
    } catch (err) {
      if (err?.response?.status === 401) {
        // Not logged in — show empty wishlist, not error
        setWishlistItems([]);
      } else {
        console.error("Failed to load wishlist", err);
        setError("Unable to load your wishlist. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  const handleRemove = async (productId) => {
    try {
      // Adjust this endpoint according to your actual backend API
      await axiosInstance.delete(`/api/wishlist/${productId}`);
      setWishlistItems((prev) => prev.filter(item => item._id !== productId && item.id !== productId));
    } catch (err) {
      console.error("Failed to remove item", err);
      alert("Could not remove the item from your wishlist.");
    }
  };

  const handleAddToCart = (product) => {
    dispatch(addToCart({ ...product, quantity: 1 }));
    navigate("/cart");
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight flex items-center">
              <FiHeart className="mr-3 text-pink-500 fill-current" /> My Wishlist
            </h1>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Items you've saved for later.
            </p>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader size="xl" className="text-pink-500" />
          </div>
        ) : error ? (
          <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700">
            <p className="text-red-500 dark:text-red-400 mb-4">{error}</p>
            <Button onClick={fetchWishlist}>Retry</Button>
          </div>
        ) : wishlistItems.length === 0 ? (
          <div className="text-center py-24 bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700">
            <FiHeart className="mx-auto h-16 w-16 text-gray-300 dark:text-gray-600 mb-6" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Your wishlist is empty</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-sm mx-auto">
              You haven't saved any items yet. Start exploring our collection and find something you love!
            </p>
            <Link to="/products">
              <Button className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-full font-medium transition-transform hover:scale-105 shadow-lg shadow-indigo-500/30">
                Explore Products
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 xl:gap-8">
            {wishlistItems.map((item) => (
              <div key={item._id || item.id} className="group bg-white dark:bg-gray-800 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700 overflow-hidden flex flex-col">
                <div className="relative w-full h-56 bg-gray-200 dark:bg-gray-700 overflow-hidden">
                  <img
                    src={
                      (item.images && item.images.length > 0)
                        ? item.images[0]
                        : item.image || `https://picsum.photos/seed/${item._id || item.id}/400/300`
                    }
                    alt={item.name}
                    className="w-full h-full object-center object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = `https://picsum.photos/seed/${item._id || item.id}/400/300`;
                    }}
                  />
                  <button 
                    onClick={() => handleRemove(item._id || item.id)}
                    className="absolute top-3 right-3 p-2 bg-white/90 dark:bg-gray-800/90 text-red-500 hover:text-red-600 rounded-full shadow-md backdrop-blur-sm transition-transform hover:scale-110"
                    title="Remove from wishlist"
                  >
                    <FiTrash2 className="h-4 w-4" />
                  </button>
                </div>
                
                <div className="p-5 flex-1 flex flex-col">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white line-clamp-1 mb-1">
                    <Link to={`/product/${item._id || item.id}`} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                      {item.name}
                    </Link>
                  </h3>
                  
                  <div className="mt-auto pt-4 flex items-center justify-between">
                    <p className="text-xl font-bold text-gray-900 dark:text-white">
                      ${(item.price || 0).toFixed(2)}
                    </p>
                    
                    <Button 
                      onClick={() => handleAddToCart(item)}
                      disabled={item.countInStock === 0}
                      className="flex items-center justify-center p-2.5 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-600 hover:text-white dark:hover:bg-indigo-500 dark:hover:text-white rounded-xl transition-colors disabled:opacity-50"
                      title={item.countInStock === 0 ? "Out of Stock" : "Add to Cart"}
                    >
                      <FiShoppingCart className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
