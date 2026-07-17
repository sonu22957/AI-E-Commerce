import { useEffect, useState } from "react";
import axios from "../../services/axios";

/**
 * ReviewSummary
 *
 * Shows an AI‑generated short summary of the reviews for a given product.
 * Expects a `productId` prop and calls `/api/ai/review-summary?productId=…`.
 * If the endpoint is unavailable a placeholder text is shown so the UI stays
 * functional during development.
 *
 * Tailwind CSS provides a clean, responsive card that works in both light and
 * dark mode.
 */
export default function ReviewSummary({ productId }) {
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!productId) return;
    const fetchSummary = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get("/api/ai/review-summary", {
          params: { productId },
        });
        // Expected response shape: { summary: "..." }
        setSummary(data?.summary || "");
      } catch {
        // Demo fallback – generic summary
        setSummary(
          "Overall, customers love this product for its quality and value. Most reviewers highlight its durability and sleek design, while a few mention minor sizing concerns."
        );
        setError(
          "Failed to fetch live AI summary – showing placeholder text."
        );
      } finally {
        setLoading(false);
      }
    };
    fetchSummary();
  }, [productId]);

  return (
    <section className="my-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg shadow">
      <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
        Review Summary
      </h3>
      {loading && (
        <div className="text-sm text-gray-600 dark:text-gray-400">Loading summary…</div>
      )}
      {error && (
        <p className="text-sm text-red-600 dark:text-red-400 mb-2">{error}</p>
      )}
      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        {summary || "No summary available."}
      </p>
    </section>
  );
}
