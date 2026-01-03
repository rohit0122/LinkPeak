import React from 'react';

/**
 * Reusable Pagination Component
 * @param {Object} pagination - Pagination state { page, totalPages, total, limit }
 * @param {Function} onPageChange - Callback when page changes
 * @param {boolean} loading - Optional loading state to disable buttons
 */
export default function Pagination({ pagination, onPageChange, loading = false }) {
    const { page, totalPages } = pagination;

    if (!totalPages || totalPages <= 1) return null;

    const renderPageNumbers = () => {
        const pages = [];

        for (let p = 1; p <= totalPages; p++) {
            // Show first page, last page, current page, and adjacent pages
            if (
                p === 1 ||
                p === totalPages ||
                (p >= page - 1 && p <= page + 1)
            ) {
                pages.push(
                    <button
                        key={p}
                        onClick={() => onPageChange(p)}
                        className={`btn btn-sm btn-square ${page === p ? 'btn-primary' : 'btn-ghost'}`}
                        disabled={loading}
                    >
                        {p}
                    </button>
                );
            } else if (p === page - 2 || p === page + 2) {
                // Show ellipsis for gaps
                pages.push(<span key={p} className="opacity-40">...</span>);
            }
        }

        return pages;
    };

    return (
        <div className="flex items-center justify-center gap-4 mt-8 pb-10">
            <button
                onClick={() => onPageChange(page - 1)}
                disabled={page === 1 || loading}
                className="btn btn-sm btn-outline px-6"
            >
                Previous
            </button>

            <div className="flex items-center gap-2">
                {renderPageNumbers()}
            </div>

            <button
                onClick={() => onPageChange(page + 1)}
                disabled={page === totalPages || loading}
                className="btn btn-sm btn-outline px-6"
            >
                Next
            </button>
        </div>
    );
}
