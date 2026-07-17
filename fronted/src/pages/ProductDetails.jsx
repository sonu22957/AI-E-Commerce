import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";
import Button from "../components/common/Button";
import Loader from "../components/common/Loader";
import ReviewSummary from "../components/ai/ReviewSummary";
import DeliveryEstimate from "../components/common/DeliveryEstimate";
import { FiShoppingCart, FiHeart, FiStar, FiArrowLeft } from "react-icons/fi";
import axiosInstance from "../services/axios";
import { addToCart } from "../redux/cartSlice";

/**
 * ProductDetails Page
 * -------------------
 * Displays comprehensive details for a single product.
 * Includes image gallery (or single image), pricing, description, 
 * AI-powered review summaries, and Add to Cart functionality.
 */
export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [shippingMethod, setShippingMethod] = useState("standard");

  useEffect(() => {
    const fetchProductDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axiosInstance.get(`/api/products/${id}`);
        setProduct(response.data);
      } catch (err) {
        console.error("Failed to load product details", err);
        setError("Could not load product details. It may have been removed or the server is down.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProductDetails();
    }
  }, [id]);

  const handleAddToCart = () => {
    if (product) {
      dispatch(addToCart({ ...product, quantity }));
      console.log(`Added ${quantity} of ${product.name} to cart`);
      navigate('/cart');
    }
  };

  const renderStars = (rating = 0) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <FiStar 
        key={i} 
        className={`h-5 w-5 ${i < Math.round(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300 dark:text-gray-600'}`} 
      />
    ));
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
        <Navbar />
        <main className="flex-1 flex justify-center items-center">
          <Loader size="xl" className="text-indigo-600" />
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
        <Navbar />
        <main className="flex-1 flex flex-col justify-center items-center p-6 text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Oops!</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">{error || "Product not found."}</p>
          <Link to="/products">
            <Button className="flex items-center"><FiArrowLeft className="mr-2" /> Back to Products</Button>
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="mb-6">
          <button 
            onClick={() => navigate(-1)} 
            className="inline-flex items-center text-sm font-medium text-gray-600 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400 transition-colors"
          >
            <FiArrowLeft className="mr-2 h-4 w-4" /> Back
          </button>
        </div>

        <div className="lg:grid lg:grid-cols-2 lg:gap-x-12 xl:gap-x-16">
          {/* Product Image */}
          <div className="flex flex-col-reverse lg:flex-row gap-6">
            <div className="w-full aspect-w-1 aspect-h-1 rounded-2xl overflow-hidden bg-gray-100 dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700">
              <img
                src={
                  (product.images && product.images.length > 0)
                    ? product.images[0]
                    : product.image || `https://picsum.photos/seed/${product._id}/600/600`
                }
                alt={product.name}
                className="w-full h-full object-center object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = `https://picsum.photos/seed/${product._id}/600/600`;
                }}
              />
            </div>
          </div>

          {/* Product Info */}
          <div className="mt-10 px-4 sm:px-0 lg:mt-0">
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white">
              {product.name}
            </h1>
            
            <div className="mt-3 flex items-center">
              <h2 className="sr-only">Product information</h2>
              <p className="text-3xl text-gray-900 dark:text-gray-100 font-bold">
                ${(product.price || 0).toFixed(2)}
              </p>
            </div>

            {/* Reviews summary */}
            <div className="mt-4 flex items-center gap-4">
              <div className="flex items-center">
                {renderStars(product.rating)}
              </div>
              <p className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer font-medium">
                {product.numReviews || 0} reviews
              </p>
            </div>

            <div className="mt-6">
              <h3 className="sr-only">Description</h3>
              <div className="text-base text-gray-700 dark:text-gray-300 space-y-4">
                <p>{product.description}</p>
              </div>
            </div>

            {/* Add to Cart Section */}
            <div className="mt-8 border-t border-gray-200 dark:border-gray-700 pt-8">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium text-gray-900 dark:text-white">Quantity</span>
                <span className={`text-sm font-medium ${product.countInStock > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                  {product.countInStock > 0 ? 'In Stock' : 'Out of Stock'}
                </span>
              </div>
              
              <div className="flex items-center gap-4 mb-6">
                <select
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  disabled={product.countInStock === 0}
                  className="block w-24 pl-3 pr-10 py-3 text-base border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white disabled:opacity-50"
                >
                  {[...Array(product.countInStock > 0 ? Math.min(product.countInStock, 10) : 1).keys()].map((x) => (
                    <option key={x + 1} value={x + 1}>
                      {x + 1}
                    </option>
                  ))}
                </select>

                <Button
                  onClick={handleAddToCart}
                  disabled={product.countInStock === 0}
                  className="flex-1 flex items-center justify-center bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-8 rounded-xl font-semibold transition-all hover:scale-[1.02] shadow-lg shadow-indigo-500/30 disabled:opacity-50 disabled:hover:scale-100"
                >
                  <FiShoppingCart className="mr-2 h-5 w-5" /> Add to Cart
                </Button>
                
                <button className="p-3 text-gray-400 hover:text-pink-500 bg-gray-100 dark:bg-gray-800 hover:bg-pink-50 dark:hover:bg-pink-900/20 rounded-xl transition-colors">
                  <FiHeart className="h-6 w-6" />
                </button>
              </div>
            </div>

            {/* Delivery Estimate */}
            <div className="mt-6">
              <DeliveryEstimate
                shippingMethod={shippingMethod}
                showOptions={true}
                onMethodChange={setShippingMethod}
              />
            </div>

            {/* AI Review Summary Component */}
            <div className="mt-10">
              <ReviewSummary productId={id} />
            </div>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
