import { useState, useMemo, useCallback } from "react";

/**
 * usePagination – a reusable hook that abstracts pagination logic.
 *
 * @param {Object} params
 * @param {number} params.totalItems          – total number of items in the collection.
 * @param {number} [params.itemsPerPage=10]   – how many items to show per page.
 * @param {number} [params.initialPage=1]    – starting page number (1‑based).
 * @returns {Object}                         – pagination state and helper functions.
 *
 * Features (premium UI‑ready):
 *   • Calculates total pages, current page slice indices.
 *   • Provides `nextPage`, `prevPage`, `setPage`, and `goToPage` helpers.
 *   • Returns a memoized `pageSlice` function to slice any array according to the current page.
 *   • Handles edge‑cases (out‑of‑bounds page numbers) gracefully.
 */
export default function usePagination({ totalItems, itemsPerPage = 10, initialPage = 1 }) {
  const [currentPage, setCurrentPage] = useState(() => {
    const safeInitial = Math.max(1, Math.min(initialPage, Math.ceil(totalItems / itemsPerPage) || 1));
    return safeInitial;
  });

  const totalPages = useMemo(() => {
    return Math.max(1, Math.ceil(totalItems / itemsPerPage));
  }, [totalItems, itemsPerPage]);

  // Ensure currentPage stays in bounds when totalItems changes.
  useMemo(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages);
  }, [currentPage, totalPages]);

  const startIndex = useMemo(() => (currentPage - 1) * itemsPerPage, [currentPage, itemsPerPage]);
  const endIndex = useMemo(() => Math.min(startIndex + itemsPerPage, totalItems), [startIndex, itemsPerPage, totalItems]);

  const goToPage = useCallback(
    (page) => {
      const pageNum = Math.max(1, Math.min(page, totalPages));
      setCurrentPage(pageNum);
    },
    [totalPages]
  );

  const nextPage = useCallback(() => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  }, [totalPages]);

  const prevPage = useCallback(() => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  }, []);

  /**
   * Helper to slice an array according to the current pagination state.
   * @param {Array} data – the full data array.
   * @returns {Array}   – a shallow slice representing the current page.
   */
  const pageSlice = useCallback(
    (data) => {
      if (!Array.isArray(data)) return [];
      return data.slice(startIndex, endIndex);
    },
    [startIndex, endIndex]
  );

  return {
    currentPage,
    totalPages,
    startIndex,
    endIndex,
    setPage: goToPage,
    nextPage,
    prevPage,
    pageSlice,
    // Convenience values for UI components:
    hasNext: currentPage < totalPages,
    hasPrev: currentPage > 1,
  };
}
