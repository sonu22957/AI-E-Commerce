import { useEffect, useState } from "react";
import { FiShoppingCart, FiStar, FiTrendingUp } from "react-icons/fi";
import axios from "../../services/axios";

/**
 * AIRecommendation — shows top-rated real products from DB
 */
export default function AIRecommendation({ userId }) {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [cartMsg, setCartMsg] = useState("");

  useEffect(() => {
    const fetchRecommendations = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get("/api/ai/recommendations", { params: { userId } });
        setRecommendations(data?.items || []);
      } catch {
        // Fallback: fetch top products directly
        try {
          const { data } = await axios.get("/api/products?limit=6");
          setRecommendations(data?.products || data || []);
        } catch {
          setRecommendations([]);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchRecommendations();
  }, [userId]);

  const addToCart = async (product) => {
    try {
      await axios.post("/api/cart", { productId: product._id, quantity: 1 });
      setCartMsg(`✅ "${product.name}" added!`);
      setTimeout(() => setCartMsg(""), 2500);
    } catch {
      setCartMsg("⚠️ Login karein pehle!");
      setTimeout(() => setCartMsg(""), 2500);
    }
  };

  return (
    <section>
      <div className="flex items-center gap-2 mb-4">
        <FiTrendingUp className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
        <h3 className="text-base font-bold text-gray-800 dark:text-gray-100">
          AI‑Powered Recommendations
        </h3>
      </div>

      {cartMsg && (
        <div className="mb-3 px-3 py-2 rounded-xl bg-green-50 dark:bg-green-900/30 border border-green-100 dark:border-green-800">
          <p className="text-xs font-medium text-green-700 dark:text-green-300">{cartMsg}</p>
        </div>
      )}

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex gap-3 animate-pulse">
              <div className="h-14 w-14 rounded-xl bg-gray-200 dark:bg-gray-700 flex-shrink-0" />
              <div className="flex-1 space-y-2 py-1">
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : recommendations.length === 0 ? (
        <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
          Koi recommendation nahi mili.
        </p>
      ) : (
        <div className="space-y-3">
          {recommendations.map((item) => (
            <div
              key={item._id || item.id}
              className="flex items-center gap-3 p-2.5 rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors group"
            >
              <img
                src={
                  (item.images && item.images.length > 0)
                    ? item.images[0]
                    : item.image || `https://picsum.photos/seed/${item._id}/80/80`
                }
                alt={item.name || item.title}
                className="h-14 w-14 rounded-xl object-cover flex-shrink-0 border border-gray-100 dark:border-gray-700"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = `https://picsum.photos/seed/${item._id}/80/80`;
                }}
              />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-gray-800 dark:text-gray-100 truncate leading-tight">
                  {item.name || item.title}
                </p>
                <div className="flex items-center gap-1 mt-0.5">
                  <FiStar className="h-3 w-3 text-yellow-400 fill-current" />
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {item.rating || "New"}
                  </span>
                </div>
                <p className="text-sm font-bold text-indigo-600 dark:text-indigo-400 mt-0.5">
                  ₹{(item.price || 0).toLocaleString("en-IN")}
                </p>
              </div>
              <button
                onClick={() => addToCart(item)}
                className="flex-shrink-0 p-2 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-600 hover:text-white dark:hover:bg-indigo-500 dark:hover:text-white transition-all opacity-0 group-hover:opacity-100"
                title="Add to Cart"
              >
                <FiShoppingCart className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
