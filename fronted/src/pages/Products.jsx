import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";
import Loader from "../components/common/Loader";
import Button from "../components/common/Button";
import usePagination from "../hooks/usePagination";
import axiosInstance from "../services/axios";
import { FiFilter, FiSearch, FiStar, FiShoppingCart } from "react-icons/fi";

/**
 * Products Page
 * -------------
 * Displays a catalog of all available products.
 * Includes search, basic filtering UI, pagination, and a responsive grid layout.
 */
export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Search state
  const [searchTerm, setSearchTerm] = useState("");

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.get("/api/products");
      // Adjust according to your API response structure
      setProducts(response.data?.products || response.data || []);
    } catch (err) {
      console.error("Failed to load products", err);
      setError("Unable to load products. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Filter products locally by search term
  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination hook
  const {
    currentPage,
    totalPages,
    pageSlice,
    nextPage,
    prevPage,
    setPage,
  } = usePagination({
    totalItems: filteredProducts.length,
    itemsPerPage: 8,
  });

  const visibleProducts = pageSlice(filteredProducts);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header & Search */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
              All Products
            </h1>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Discover our latest collection of premium items.
            </p>
          </div>
          
          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="relative w-full md:w-64">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-700 rounded-xl leading-5 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:text-sm transition-colors"
              />
            </div>
            <button className="p-2.5 rounded-xl bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              <FiFilter className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader size="xl" className="text-indigo-600" />
          </div>
        ) : error ? (
          <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700">
            <p className="text-red-500 dark:text-red-400 mb-4">{error}</p>
            <Button onClick={fetchProducts}>Retry</Button>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700">
            <FiSearch className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h2 className="text-xl font-medium text-gray-900 dark:text-white mb-2">No products found</h2>
            <p className="text-gray-500 dark:text-gray-400">Try adjusting your search term.</p>
            <Button onClick={() => setSearchTerm("")} className="mt-6">Clear Search</Button>
          </div>
        ) : (
          <>
            {/* Product Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 xl:gap-8">
              {visibleProducts.map((product) => (
                <div key={product._id || product.id} className="group relative bg-white dark:bg-gray-800 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700 overflow-hidden flex flex-col">
                  <div className="relative w-full h-56 bg-gray-200 dark:bg-gray-700 overflow-hidden">
                    <img
                      src={
                        (product.images && product.images.length > 0)
                          ? product.images[0]
                          : product.image || `https://picsum.photos/seed/${product._id}/400/300`
                      }
                      alt={product.name}
                      className="w-full h-full object-center object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = `https://picsum.photos/seed/${encodeURIComponent(product.name)}/400/300`;
                      }}
                    />
                    {product.category && (
                      <div className="absolute top-2 left-2 bg-indigo-600 text-white text-xs font-semibold px-2 py-1 rounded-full">
                        {product.category}
                      </div>
                    )}
                    {product.stock === 0 && (
                      <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-md">
                        Sold Out
                      </div>
                    )}
                  </div>
                  
                  <div className="p-5 flex-1 flex flex-col">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white line-clamp-1">
                        <Link to={`/product/${product._id || product.id}`}>
                          <span aria-hidden="true" className="absolute inset-0" />
                          {product.name}
                        </Link>
                      </h3>
                    </div>
                    
                    <div className="flex items-center mb-4">
                      <FiStar className="text-yellow-400 fill-current h-4 w-4" />
                      <span className="ml-1 text-sm text-gray-600 dark:text-gray-400">
                        {product.rating || "New"}
                      </span>
                    </div>

                    <div className="mt-auto flex items-center justify-between z-10 relative">
                      <p className="text-xl font-bold text-gray-900 dark:text-white">
                        ${(product.price || 0).toFixed(2)}
                      </p>
                      <button 
                        disabled={product.countInStock === 0}
                        className="p-2 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-600 hover:text-white dark:hover:bg-indigo-500 dark:hover:text-white rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        onClick={(e) => {
                          e.preventDefault(); // Prevent navigating to product detail
                          console.log("Add to cart", product._id || product.id);
                        }}
                      >
                        <FiShoppingCart className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="mt-12 flex justify-center items-center space-x-4">
                <Button
                  onClick={prevPage}
                  disabled={currentPage === 1}
                  className="bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
                >
                  Previous
                </Button>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Page {currentPage} of {totalPages}
                </span>
                <Button
                  onClick={nextPage}
                  disabled={currentPage === totalPages}
                  className="bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
                >
                  Next
                </Button>
              </div>
            )}
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}
