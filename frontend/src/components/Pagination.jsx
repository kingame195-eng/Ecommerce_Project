import React from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import "./Pagination.css";

function Pagination({ pagination, onPageChange, isLoading = false }) {
  if (!pagination || pagination.pages <= 1) {
    return null; // Không cần pagination nếu chỉ 1 trang
  }

  const { page, pages, total, limit, hasNextPage, hasPrevPage } = pagination;

  // TÍNH RANGE SẢN PHẨM HIỂN THỊ
  const startItem = (page - 1) * limit + 1;
  const endItem = Math.min(page * limit, total);

  const getPageNumbers = () => {
    const numbers = [];
    const maxVisible = 7;

    if (pages <= maxVisible) {
      // Nếu tổng page <= 7, hiển thị tất cả
      for (let i = 1; i <= pages; i++) {
        numbers.push(i);
      }
    } else {
      // Ngược lại, hiển thị smart (luôn show page hiện tại ở giữa)
      const leftSide = Math.max(1, page - 2);
      const rightSide = Math.min(pages, page + 2);

      // Thêm trang đầu
      numbers.push(1);

      // Thêm ellipsis nếu cần
      if (leftSide > 2) {
        numbers.push("...");
      }

      // Thêm các trang xung quanh trang hiện tại
      for (let i = leftSide; i <= rightSide; i++) {
        if (i !== 1 && i !== pages) {
          numbers.push(i);
        }
      }

      // Thêm ellipsis nếu cần
      if (rightSide < pages - 1) {
        numbers.push("...");
      }

      // Thêm trang cuối
      if (pages > 1) {
        numbers.push(pages);
      }
    }
    return numbers;
  };

  const pageNumbers = getPageNumbers();

  const handlePageClick = (pageNum) => {
    if (pageNum !== page && !isLoading) {
      onPageChange(pageNum);
      // Scroll to top
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div className="pagination-container">
      {/* 4️⃣ INFO TEXT */}
      <div className="pagination-info">
        Display <strong>{startItem}</strong> - <strong>{endItem}</strong> in{" "}
        <strong>{total}</strong> products
      </div>

      {/* 5️⃣ PAGINATION BUTTONS */}
      <div className="pagination-controls">
        {/* Previous Button */}
        <button
          className={`btn-pagination btn-prev ${!hasPrevPage ? "disabled" : ""}`}
          onClick={() => handlePageClick(page - 1)}
          disabled={!hasPrevPage || isLoading}
          title="Previous page"
        >
          <FiChevronLeft /> Previous
        </button>

        {/* Page Numbers */}
        <div className="page-numbers">
          {pageNumbers.map((num, idx) => (
            <React.Fragment key={idx}>
              {num === "..." ? (
                <span className="ellipsis">...</span>
              ) : (
                <button
                  className={`btn-page ${num === page ? "active" : ""}`}
                  onClick={() => handlePageClick(num)}
                  disabled={isLoading || num === page}
                >
                  {num}
                </button>
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Next Button */}
        <button
          className={`btn-pagination btn-next ${!hasNextPage ? "disabled" : ""}`}
          onClick={() => handlePageClick(page + 1)}
          disabled={!hasNextPage || isLoading}
          title="Next page"
        >
          Next <FiChevronRight />
        </button>
      </div>

      {/* 6️⃣ LOADING INDICATOR */}
      {isLoading && <div className="pagination-loading">Loading...</div>}
    </div>
  );
}

export default Pagination;
