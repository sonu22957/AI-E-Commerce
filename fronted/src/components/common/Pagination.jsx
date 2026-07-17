import React from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

/**
 * Pagination Component
 * --------------------
 * Renders numbered page buttons with Prev / Next navigation.
 *
 * @param {number}   currentPage  - The currently active page (1-indexed)
 * @param {number}   totalPages   - Total number of pages
 * @param {function} onPageChange - Callback(page: number) when a page is selected
 * @param {number}   siblingCount - Pages to show on each side of current (default: 1)
 */
export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  siblingCount = 1,
}) {
  if (totalPages <= 1) return null;

  // Build page numbers with ellipsis
  const range = (start, end) =>
    Array.from({ length: end - start + 1 }, (_, i) => start + i);

  const buildPages = () => {
    const totalNumbers = siblingCount * 2 + 5; // siblings + current + 2 ends + 2 dots
    if (totalPages <= totalNumbers) return range(1, totalPages);

    const leftSibling = Math.max(currentPage - siblingCount, 1);
    const rightSibling = Math.min(currentPage + siblingCount, totalPages);
    const showLeftDots = leftSibling > 2;
    const showRightDots = rightSibling < totalPages - 1;

    if (!showLeftDots && showRightDots) {
      return [...range(1, 3 + siblingCount * 2), "...", totalPages];
    }
    if (showLeftDots && !showRightDots) {
      return [1, "...", ...range(totalPages - (3 + siblingCount * 2) + 1, totalPages)];
    }
    return [1, "...", ...range(leftSibling, rightSibling), "...", totalPages];
  };

  const pages = buildPages();

  const btnBase =
    "min-w-[36px] h-9 px-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center";
  const activeCls = "bg-indigo-600 text-white shadow-sm";
  const inactiveCls =
    "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800";
  const disabledCls = "opacity-40 cursor-not-allowed";

  return (
    <nav aria-label="Pagination" className="flex items-center justify-center gap-1 flex-wrap">
      {/* Prev */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label="Previous page"
        className={`${btnBase} ${currentPage === 1 ? disabledCls : inactiveCls}`}
      >
        <FiChevronLeft className="h-4 w-4" />
      </button>

      {/* Page numbers */}
      {pages.map((page, idx) =>
        page === "..." ? (
          <span key={`dots-${idx}`} className="px-2 text-gray-400 select-none">
            …
          </span>
        ) : (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            aria-label={`Go to page ${page}`}
            aria-current={page === currentPage ? "page" : undefined}
            className={`${btnBase} ${page === currentPage ? activeCls : inactiveCls}`}
          >
            {page}
          </button>
        )
      )}

      {/* Next */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        aria-label="Next page"
        className={`${btnBase} ${currentPage === totalPages ? disabledCls : inactiveCls}`}
      >
        <FiChevronRight className="h-4 w-4" />
      </button>
    </nav>
  );
}
