# 📘 Guide: Implementing Pagination + Advanced Search

## 🎯 Objectives

Implement **Pagination** and **Advanced Search** to:

- Load products by page (12 products per page)
- Search by name, category, price, and rating
- Maintain filters when switching pages

---

## 📊 Architecture & Logic

### A. Overall Flow

```
User enters search/filter
           ↓
Call API with params: page, limit, keyword, category, priceRange, sortBy
           ↓
Backend returns: { products: [...], total: 100, page: 1, pages: 5 }
           ↓
Frontend renders products + pagination buttons
           ↓
User clicks page → back to step 2
```

### B. API Parameters to Send

```javascript
{
  page: 1,              // Trang hiện tại (bắt đầu từ 1)
  limit: 12,            // Số sản phẩm trên 1 trang
  keyword: "laptop",    // Tìm kiếm theo tên
  category: "electronics", // Lọc theo category
  minPrice: 100,        // Giá tối thiểu
  maxPrice: 5000,       // Giá tối đa
  rating: 4,            // Đánh giá tối thiểu
  sortBy: "price-asc"   // Sắp xếp: price-asc, price-desc, name-asc, name-desc, newest, popular
}
```

### C. Response từ Backend

```javascript
{
  success: true,
  data: {
    products: [
      { id: 1, name: "Laptop", price: 1000, category: "electronics", rating: 4.5, ... },
      // ... 12 sản phẩm
    ],
    pagination: {
      total: 145,       // Tổng số sản phẩm
      page: 1,          // Trang hiện tại
      limit: 12,        // Sản phẩm trên trang
      pages: 13         // Tổng số trang (Math.ceil(145 / 12) = 13)
    }
  }
}
```

---

## 🔧 Step-by-Step Implementation

### STEP 1: Cập nhật Backend API (Express)

**Tệp: `backend/routes/products.js`**

```javascript
// GET /api/products - với pagination & filter
router.get("/", async (req, res) => {
  try {
    // 1️⃣ LẤY CÁC PARAMS TỪ QUERY STRING
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const keyword = req.query.keyword || "";
    const category = req.query.category || "";
    const minPrice = parseFloat(req.query.minPrice) || 0;
    const maxPrice = parseFloat(req.query.maxPrice) || Infinity;
    const minRating = parseFloat(req.query.rating) || 0;
    const sortBy = req.query.sortBy || "newest";

    // 2️⃣ KIỂM TRA VALIDATION
    if (page < 1) {
      return res.status(400).json({ success: false, message: "Page phải >= 1" });
    }
    if (limit < 1 || limit > 100) {
      return res.status(400).json({ success: false, message: "Limit phải từ 1-100" });
    }

    // 3️⃣ TẠO FILTER OBJECT
    let filter = {};

    // Tìm kiếm theo tên (case-insensitive)
    if (keyword) {
      filter.name = { $regex: keyword, $options: "i" };
    }

    // Lọc theo category
    if (category) {
      filter.category = category;
    }

    // Lọc theo giá
    filter.price = { $gte: minPrice, $lte: maxPrice };

    // Lọc theo rating
    if (minRating > 0) {
      filter.rating = { $gte: minRating };
    }

    // 4️⃣ TẠO SORT OBJECT
    let sortObj = {};
    switch (sortBy) {
      case "price-asc":
        sortObj = { price: 1 }; // 1 = ascending
        break;
      case "price-desc":
        sortObj = { price: -1 }; // -1 = descending
        break;
      case "name-asc":
        sortObj = { name: 1 };
        break;
      case "name-desc":
        sortObj = { name: -1 };
        break;
      case "popular":
        sortObj = { rating: -1, reviews: -1 }; // Sắp xếp theo rating cao nhất
        break;
      case "newest":
      default:
        sortObj = { createdAt: -1 }; // Mới nhất trước
        break;
    }

    // 5️⃣ TÍNH TOÁN SKIP & LIMIT
    // Ví dụ: page=2, limit=12 → skip 12 sản phẩm, lấy 12 sản phẩm tiếp theo
    const skip = (page - 1) * limit;

    // 6️⃣ LẤY TỔNG SỐ SẢN PHẨM PHỤ HỢP FILTER
    const total = await Product.countDocuments(filter);

    // 7️⃣ LẤY DANH SÁCH SẢN PHẨM
    const products = await Product.find(filter).sort(sortObj).skip(skip).limit(limit);

    // 8️⃣ TÍNH TỔNG SỐ TRANG
    const pages = Math.ceil(total / limit);

    // 9️⃣ KIỂM TRA PAGE CÓ VỢT QUÁ KHÔNG
    if (page > pages && total > 0) {
      return res.status(400).json({
        success: false,
        message: `Page ${page} không tồn tại. Tổng ${pages} trang.`,
      });
    }

    // 🔟 TRẢ VỀ RESPONSE
    res.json({
      success: true,
      data: {
        products,
        pagination: {
          total,
          page,
          limit,
          pages,
          hasNextPage: page < pages,
          hasPrevPage: page > 1,
        },
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
```

**Chú thích khó:**

- `$regex` & `$options: "i"`: MongoDB regex tìm kiếm không phân biệt chữ hoa/thường
- `skip()`: bỏ qua N sản phẩm đầu tiên
- `limit()`: chỉ lấy N sản phẩm
- `Math.ceil(145 / 12) = 13`: làm tròn lên số trang

---

### STEP 2: Tạo Custom Hook cho Pagination

**Tệp: `frontend/src/hooks/usePagination.js`** (NEW)

```javascript
import { useState, useCallback, useEffect } from "react";

/**
 * Hook quản lý pagination & filter
 *
 * Tính năng:
 * - Lưu trạng thái page, filter
 * - Call API với params
 * - Trả về products, pagination info, functions để update
 */
export function usePagination(initialLimit = 12) {
  // 1️⃣ STATE QUẢN LÝ
  const [page, setPage] = useState(1);
  const [limit] = useState(initialLimit);
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // 2️⃣ STATE QUẢN LÝ FILTER
  const [filters, setFilters] = useState({
    keyword: "",
    category: "",
    minPrice: 0,
    maxPrice: Infinity,
    rating: 0,
    sortBy: "newest",
  });

  // 3️⃣ HÀM FETCH SẢN PHẨM
  const fetchProducts = useCallback(
    async (pageNum = 1, filterObj = filters) => {
      try {
        setIsLoading(true);
        setError(null);

        // Tạo URL với query parameters
        const params = new URLSearchParams();
        params.append("page", pageNum);
        params.append("limit", limit);

        if (filterObj.keyword) params.append("keyword", filterObj.keyword);
        if (filterObj.category) params.append("category", filterObj.category);
        params.append("minPrice", filterObj.minPrice);
        params.append("maxPrice", filterObj.maxPrice === Infinity ? 999999 : filterObj.maxPrice);
        if (filterObj.rating > 0) params.append("rating", filterObj.rating);
        params.append("sortBy", filterObj.sortBy);

        // Call API
        const response = await fetch(`http://localhost:8000/api/products?${params.toString()}`);

        if (!response.ok) {
          throw new Error(`HTTP Error: ${response.status}`);
        }

        const data = await response.json();

        if (data.success) {
          setProducts(data.data.products);
          setPagination(data.data.pagination);
          setPage(pageNum);
        } else {
          throw new Error(data.message || "Failed to fetch products");
        }
      } catch (err) {
        setError(err.message);
        console.error("Fetch error:", err);
      } finally {
        setIsLoading(false);
      }
    },
    [limit, filters]
  );

  // 4️⃣ HÀM CẬP NHẬT FILTER
  const updateFilter = useCallback((newFilter) => {
    setFilters((prev) => ({
      ...prev,
      ...newFilter,
    }));
    // Reset về trang 1 khi thay đổi filter
    setPage(1);
  }, []);

  // 5️⃣ HÀM CHUYỂN TRANG
  const goToPage = useCallback(
    (pageNum) => {
      if (pageNum < 1 || (pagination && pageNum > pagination.pages)) return;
      fetchProducts(pageNum, filters);
    },
    [pagination, filters, fetchProducts]
  );

  // 6️⃣ HÀM RESET FILTER
  const resetFilters = useCallback(() => {
    setFilters({
      keyword: "",
      category: "",
      minPrice: 0,
      maxPrice: Infinity,
      rating: 0,
      sortBy: "newest",
    });
    setPage(1);
  }, []);

  // 7️⃣ EFFECT: GỌI API KHI FILTER THAY ĐỔI
  useEffect(() => {
    fetchProducts(1, filters);
  }, [filters]); // Lưu ý: không thêm fetchProducts vào dependency array để tránh infinite loop

  return {
    // Data
    products,
    pagination,
    isLoading,
    error,

    // State
    page,
    filters,

    // Functions
    goToPage,
    updateFilter,
    resetFilters,
    fetchProducts,
  };
}
```

**Chú thích khó:**

- `useCallback`: tránh tạo function mới mỗi render (optimize performance)
- `URLSearchParams`: tạo query string an toàn
- `useEffect`: tự động gọi API khi filters thay đổi
- Dependency array `[filters]`: trigger effect khi filter thay đổi

---

### STEP 3: Cập nhật Component SearchFilter

**Tệp: `frontend/src/components/SearchFilter.jsx`** (Cập nhật - Thay thế nội dung cũ)

⚠️ **Lưu ý quan trọng**: File này đã tồn tại. Bạn cần **xóa toàn bộ nội dung cũ** và **thay thế** bằng code dưới đây.

```javascript
import React, { useState, useEffect } from "react";
import { FiSliders, FiX } from "react-icons/fi";
import "./SearchFilter.css";

/**
 * Advanced Search & Filter Component
 *
 * Features:
 * - Quick search by keyword
 * - Advanced filtering: category, price range, rating
 * - Sorting options: newest, popular, price, name
 * - Filter counter badge
 *
 * Props:
 * - onFilterChange(filters): callback when filters are applied
 * - currentFilters: current active filters object
 */
function SearchFilter({ onFilterChange, currentFilters = {} }) {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [localFilters, setLocalFilters] = useState({
    keyword: currentFilters.keyword || "",
    category: currentFilters.category || "",
    minPrice: currentFilters.minPrice || 0,
    maxPrice: currentFilters.maxPrice || 5000,
    rating: currentFilters.rating || 0,
    sortBy: currentFilters.sortBy || "newest",
  });

  // Update localFilters when currentFilters changes from parent component
  useEffect(() => {
    setLocalFilters(currentFilters);
  }, [currentFilters]);

  /**
   * Handle input & select changes
   * Updates localFilters state
   */
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setLocalFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /**
   * Handle price range changes
   * Converts string to number
   */
  const handlePriceChange = (e) => {
    const { name, value } = e.target;
    const numValue = parseFloat(value) || 0;
    setLocalFilters((prev) => ({
      ...prev,
      [name]: numValue,
    }));
  };

  /**
   * Apply filters and close advanced panel
   * Calls parent callback with updated filters
   */
  const handleApplyFilter = () => {
    onFilterChange(localFilters);
    setShowAdvanced(false);
  };

  /**
   * Reset all filters to default values
   * Calls parent callback with empty filters
   */
  const handleReset = () => {
    const resetFilters = {
      keyword: "",
      category: "",
      minPrice: 0,
      maxPrice: 5000,
      rating: 0,
      sortBy: "newest",
    };
    setLocalFilters(resetFilters);
    onFilterChange(resetFilters);
  };

  /**
   * Count active filters
   * Returns number of non-default filters
   */
  const activeFilterCount = [
    localFilters.keyword,
    localFilters.category,
    localFilters.minPrice > 0,
    localFilters.maxPrice < 5000,
    localFilters.rating > 0,
  ].filter(Boolean).length;

  return (
    <div className="search-filter-container">
      {/* ===== SEARCH BAR ===== */}
      <div className="search-bar">
        <input
          type="text"
          name="keyword"
          placeholder="Search for products..."
          value={localFilters.keyword}
          onChange={handleInputChange}
          onKeyPress={(e) => {
            // Apply filter when Enter key is pressed
            if (e.key === "Enter") {
              handleApplyFilter();
            }
          }}
          className="search-input-field"
        />
        <button onClick={handleApplyFilter} className="btn-search">
          🔍 Search
        </button>
      </div>

      {/* ===== TOOLBAR: SORT & ADVANCED FILTER BUTTON ===== */}
      <div className="filter-toolbar">
        {/* Sort Dropdown */}
        <select
          name="sortBy"
          value={localFilters.sortBy}
          onChange={handleInputChange}
          className="sort-select"
        >
          <option value="newest">Newest</option>
          <option value="popular">Most Popular</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="name-asc">Name: A-Z</option>
          <option value="name-desc">Name: Z-A</option>
        </select>

        {/* Advanced Filter Button */}
        <button
          className={`btn-advanced-filter ${activeFilterCount > 0 ? "active" : ""}`}
          onClick={() => setShowAdvanced(!showAdvanced)}
          title="Open advanced filters"
        >
          <FiSliders />
          Filters {activeFilterCount > 0 && `(${activeFilterCount})`}
        </button>
      </div>

      {/* ===== ADVANCED FILTER PANEL ===== */}
      {showAdvanced && (
        <div className="advanced-filter-panel">
          {/* Panel Header */}
          <div className="filter-header">
            <h3>Advanced Filters</h3>
            <button
              className="btn-close"
              onClick={() => setShowAdvanced(false)}
              title="Close filters"
            >
              <FiX />
            </button>
          </div>

          {/* Filter Groups */}
          <div className="filter-body">
            {/* ===== CATEGORY FILTER ===== */}
            <div className="filter-group">
              <label htmlFor="category">Category</label>
              <select
                id="category"
                name="category"
                value={localFilters.category}
                onChange={handleInputChange}
                className="filter-select"
              >
                <option value="">All Categories</option>
                <option value="electronics">Electronics</option>
                <option value="computers">Computers</option>
                <option value="accessories">Accessories</option>
                <option value="phones">Phones</option>
              </select>
            </div>

            {/* ===== PRICE RANGE FILTER ===== */}
            <div className="filter-group">
              <label>Price Range ($)</label>

              {/* Number Input Fields */}
              <div className="price-inputs">
                <input
                  type="number"
                  name="minPrice"
                  placeholder="Min"
                  value={localFilters.minPrice}
                  onChange={handlePriceChange}
                  min="0"
                  className="price-input"
                />
                <span className="price-separator">-</span>
                <input
                  type="number"
                  name="maxPrice"
                  placeholder="Max"
                  value={localFilters.maxPrice}
                  onChange={handlePriceChange}
                  min="0"
                  className="price-input"
                />
              </div>

              {/* Range Sliders for Visual Selection */}
              <div className="price-range-slider-container">
                <input
                  type="range"
                  name="minPrice"
                  min="0"
                  max="5000"
                  value={localFilters.minPrice}
                  onChange={handlePriceChange}
                  className="slider min-slider"
                />
                <input
                  type="range"
                  name="maxPrice"
                  min="0"
                  max="5000"
                  value={localFilters.maxPrice}
                  onChange={handlePriceChange}
                  className="slider max-slider"
                />
              </div>

              {/* Display current price range */}
              <div className="price-display">
                ${localFilters.minPrice} - ${localFilters.maxPrice}
              </div>
            </div>

            {/* ===== RATING FILTER ===== */}
            <div className="filter-group">
              <label htmlFor="rating">Minimum Rating</label>
              <select
                id="rating"
                name="rating"
                value={localFilters.rating}
                onChange={handleInputChange}
                className="filter-select"
              >
                <option value="0">All Ratings</option>
                <option value="1">⭐ 1+ Star</option>
                <option value="2">⭐ 2+ Stars</option>
                <option value="3">⭐ 3+ Stars</option>
                <option value="4">⭐ 4+ Stars</option>
                <option value="5">⭐ 5 Stars</option>
              </select>
            </div>
          </div>

          {/* Filter Actions Footer */}
          <div className="filter-footer">
            <button className="btn-reset" onClick={handleReset} title="Clear all filters">
              Reset
            </button>
            <button
              className="btn-apply"
              onClick={handleApplyFilter}
              title="Apply selected filters"
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default SearchFilter;
```

---

### STEP 4: Tạo Component Pagination

**Tệp: `frontend/src/components/Pagination.jsx`** (NEW)

```javascript
import React from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import "./Pagination.css";

/**
 * Component Pagination
 *
 * Props:
 * - pagination: { page, pages, total, limit, hasNextPage, hasPrevPage }
 * - onPageChange(pageNum): callback khi user click page
 * - isLoading: hiển thị loading state
 */
function Pagination({ pagination, onPageChange, isLoading = false }) {
  if (!pagination || pagination.pages <= 1) {
    return null; // Không cần pagination nếu chỉ 1 trang
  }

  const { page, pages, total, limit, hasNextPage, hasPrevPage } = pagination;

  // 1️⃣ TÍNH RANGE SẢN PHẨM HIỂN THỊ
  const startItem = (page - 1) * limit + 1;
  const endItem = Math.min(page * limit, total);

  // 2️⃣ SINH DANH SÁCH PAGE NUMBERS
  // Hiển thị: [Previous] [1] [2] [3] ... [10] [Next]
  const getPageNumbers = () => {
    const numbers = [];
    const maxVisible = 7; // Tối đa 7 nút page (1,2,3,...,10)

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

  // 3️⃣ HANDLE CLICK PAGE
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
        Hiển thị <strong>{startItem}</strong> - <strong>{endItem}</strong> trong{" "}
        <strong>{total}</strong> sản phẩm
      </div>

      {/* 5️⃣ PAGINATION BUTTONS */}
      <div className="pagination-controls">
        {/* Previous Button */}
        <button
          className={`btn-pagination btn-prev ${!hasPrevPage ? "disabled" : ""}`}
          onClick={() => handlePageClick(page - 1)}
          disabled={!hasPrevPage || isLoading}
          title="Trang trước"
        >
          <FiChevronLeft /> Trước
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
          title="Trang sau"
        >
          Sau <FiChevronRight />
        </button>
      </div>

      {/* 6️⃣ LOADING INDICATOR */}
      {isLoading && <div className="pagination-loading">Đang tải...</div>}
    </div>
  );
}

export default Pagination;
```

**Chú thích khó:**

- `getPageNumbers()`: sinh danh sách trang với logic smart (hiển thị trang hiện tại ở giữa)
- `Math.min(page * limit, total)`: trang cuối không hiển thị vượt quá tổng sản phẩm
- Ellipsis `...`: chỉ thị có trang bị lược bỏ giữa đó

---

### STEP 5: Cập nhật trang Home

**Tệp: `frontend/src/pages/Home.jsx`** (Cập nhật)

```javascript
import { useState, useContext, useEffect } from "react";
import ProductCard from "../components/ProductCard";
import { CartContext } from "../context/CartContext";
import SearchFilter from "../components/SearchFilter";
import Pagination from "../components/Pagination";
import { usePagination } from "../hooks/usePagination";
import "./Home.css";

function Home() {
  const { cart, addToCart } = useContext(CartContext);

  // 1️⃣ SỬ DỤNG CUSTOM HOOK
  const { products, pagination, isLoading, error, filters, updateFilter, goToPage, resetFilters } =
    usePagination(12); // 12 sản phẩm trên 1 trang

  // 2️⃣ HANDLE FILTER CHANGE
  const handleFilterChange = (newFilters) => {
    updateFilter(newFilters);
  };

  // 3️⃣ HANDLE PAGE CHANGE
  const handlePageChange = (pageNum) => {
    goToPage(pageNum);
  };

  return (
    <main className="home">
      <div className="container">
        {/* Hero Section */}
        <section className="hero">
          <h1>Welcome to MyShop</h1>
          <p>Leading electronics store - Quality products, best prices</p>
          <button className="btn-primary" onClick={resetFilters}>
            Explore All Products
          </button>
        </section>

        {/* 4️⃣ SEARCH & FILTER COMPONENT */}
        <SearchFilter onFilterChange={handleFilterChange} currentFilters={filters} />

        {/* 5️⃣ LOADING STATE */}
        {isLoading && <div className="loading-spinner">Đang tải sản phẩm...</div>}

        {/* 6️⃣ ERROR STATE */}
        {error && (
          <div className="error-message">
            <p>❌ Lỗi: {error}</p>
            <button onClick={() => window.location.reload()}>Tải lại trang</button>
          </div>
        )}

        {/* 7️⃣ PRODUCTS GRID */}
        {!isLoading && !error && (
          <>
            {products.length > 0 ? (
              <>
                <section className="products-section">
                  <div className="section-header">
                    <h2>
                      Sản Phẩm {filters.keyword && `tìm "${filters.keyword}"`}
                      {pagination && (
                        <span className="product-count">({pagination.total} sản phẩm)</span>
                      )}
                    </h2>
                  </div>

                  <div className="products-grid">
                    {products.map((product) => (
                      <ProductCard
                        key={product.id}
                        product={product}
                        onAddToCart={() => addToCart(product)}
                      />
                    ))}
                  </div>
                </section>

                {/* 8️⃣ PAGINATION COMPONENT */}
                <Pagination
                  pagination={pagination}
                  onPageChange={handlePageChange}
                  isLoading={isLoading}
                />
              </>
            ) : (
              <div className="no-results">
                <p>😔 Không tìm thấy sản phẩm phù hợp</p>
                {filters.keyword && <p>Thử tìm kiếm từ khóa khác hoặc xóa các bộ lọc</p>}
                <button className="btn-reset-filter" onClick={resetFilters}>
                  Xóa tất cả bộ lọc
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}

export default Home;
```

---

### STEP 6: Thêm CSS cho Components

**Tệp: `frontend/src/components/Pagination.css`** (NEW)

```css
.pagination-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
  margin: 3rem 0;
  padding: 2rem;
  background-color: var(--bg-light);
  border-radius: 12px;
}

.pagination-info {
  font-size: 0.95rem;
  color: var(--text-light);
}

.pagination-controls {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
  justify-content: center;
}

/* Page Buttons */
.btn-pagination,
.btn-page {
  padding: 0.6rem 1rem;
  border: 1px solid var(--border-color);
  background-color: white;
  color: var(--text-dark);
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.4rem;
}

.btn-pagination:hover:not(.disabled),
.btn-page:hover {
  border-color: var(--primary-color);
  color: var(--primary-color);
  background-color: #fff8f0;
}

.btn-page.active {
  background-color: var(--primary-color);
  color: white;
  border-color: var(--primary-color);
}

.btn-pagination.disabled,
.btn-page:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-numbers {
  display: flex;
  gap: 0.3rem;
  align-items: center;
}

.ellipsis {
  padding: 0.6rem 0.5rem;
  color: var(--text-light);
}

.pagination-loading {
  text-align: center;
  padding: 1rem;
  color: var(--text-light);
  font-size: 0.9rem;
}

/* Responsive */
@media (max-width: 768px) {
  .pagination-container {
    padding: 1.5rem 1rem;
    gap: 1.5rem;
  }

  .btn-pagination,
  .btn-page {
    padding: 0.5rem 0.8rem;
    font-size: 0.9rem;
  }

  .page-numbers {
    gap: 0.2rem;
  }
}

@media (max-width: 480px) {
  .pagination-controls {
    gap: 0.25rem;
  }

  .btn-pagination,
  .btn-page {
    padding: 0.4rem 0.6rem;
    font-size: 0.8rem;
  }

  /* Ẩn text, chỉ show icon */
  .btn-pagination span {
    display: none;
  }

  /* Ẩn một số page numbers */
  .page-numbers .btn-page:not(.active) {
    display: none;
  }

  .page-numbers .btn-page.active {
    display: block;
  }
}
```

**Tệp: `frontend/src/components/SearchFilter.css`** (Cập nhật - Thêm phần này)

```css
/* Advanced Filter Panel */
.advanced-filter-panel {
  margin-top: 1.5rem;
  padding: 2rem;
  background-color: white;
  border-radius: 12px;
  box-shadow: var(--shadow-md);
  animation: slideDown 0.3s ease;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.filter-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid var(--border-color);
}

.filter-header h3 {
  font-size: 1.2rem;
  color: var(--text-dark);
  margin: 0;
}

.btn-close {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: var(--text-light);
  transition: color 0.3s ease;
}

.btn-close:hover {
  color: var(--text-dark);
}

.filter-body {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin-bottom: 1.5rem;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}

.filter-group label {
  font-weight: 600;
  color: var(--text-dark);
  font-size: 0.95rem;
}

.filter-group select,
.filter-group input {
  padding: 0.7rem;
  border: 1px solid var(--border-color);
  border-radius: 6px;
  font-size: 0.9rem;
  transition: border-color 0.3s ease;
}

.filter-group select:focus,
.filter-group input:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 2px rgba(255, 107, 53, 0.1);
}

.price-inputs {
  display: flex;
  align-items: center;
  gap: 0.8rem;
}

.price-inputs input {
  flex: 1;
  padding: 0.7rem;
  border: 1px solid var(--border-color);
  border-radius: 6px;
}

.price-range-slider {
  position: relative;
  display: flex;
  align-items: center;
  margin-top: 1rem;
}

.slider {
  position: absolute;
  width: 100%;
  height: 4px;
  border-radius: 2px;
  background-color: var(--border-color);
  pointer-events: none;
  -webkit-appearance: none;
  appearance: none;
}

.slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background-color: var(--primary-color);
  cursor: pointer;
  pointer-events: auto;
  box-shadow: var(--shadow-md);
  transition: transform 0.2s ease;
}

.slider::-webkit-slider-thumb:hover {
  transform: scale(1.1);
}

.slider::-moz-range-thumb {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background-color: var(--primary-color);
  cursor: pointer;
  pointer-events: auto;
  box-shadow: var(--shadow-md);
  border: none;
  transition: transform 0.2s ease;
}

.slider::-moz-range-thumb:hover {
  transform: scale(1.1);
}

.min-slider {
  z-index: 5;
}

.max-slider {
  z-index: 4;
}

.filter-footer {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
}

.btn-reset,
.btn-apply {
  padding: 0.8rem 1.5rem;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.95rem;
}

.btn-reset {
  background-color: #f5f5f5;
  color: var(--text-dark);
  border: 1px solid var(--border-color);
}

.btn-reset:hover {
  background-color: #efefef;
}

.btn-apply {
  background: linear-gradient(135deg, var(--primary-color), var(--primary-dark));
  color: white;
}

.btn-apply:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.btn-advanced-filter {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.7rem 1.2rem;
  background-color: white;
  border: 1px solid var(--border-color);
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 500;
  color: var(--text-dark);
}

.btn-advanced-filter:hover {
  border-color: var(--primary-color);
  color: var(--primary-color);
}

.btn-advanced-filter.active {
  background-color: #fff8f0;
  border-color: var(--primary-color);
  color: var(--primary-color);
}

/* Responsive */
@media (max-width: 768px) {
  .advanced-filter-panel {
    padding: 1.5rem;
  }

  .filter-body {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }

  .filter-footer {
    flex-direction: column;
    gap: 0.8rem;
  }

  .btn-reset,
  .btn-apply {
    width: 100%;
  }
}
```

---

### STEP 7: Cập nhật Home.css

**Tệp: `frontend/src/pages/Home.css`** (Thêm vào cuối file)

```css
/* Loading Spinner */
.loading-spinner {
  text-align: center;
  padding: 4rem 2rem;
  font-size: 1.1rem;
  color: var(--text-light);
  animation: fadeIn 0.3s ease;
}

.loading-spinner::after {
  content: "";
  display: inline-block;
  width: 20px;
  height: 20px;
  border: 3px solid var(--border-color);
  border-top-color: var(--primary-color);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin-left: 0.5rem;
  vertical-align: middle;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* Error Message */
.error-message {
  padding: 2rem;
  background-color: #ffebee;
  border-left: 4px solid #ff6b35;
  border-radius: 8px;
  text-align: center;
  margin: 2rem 0;
}

.error-message p {
  color: #c62828;
  margin: 0 0 1rem 0;
  font-size: 1rem;
}

.error-message button {
  padding: 0.7rem 1.5rem;
  background-color: #ff6b35;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
}

.error-message button:hover {
  background-color: #ff5722;
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

/* Product Count Badge */
.product-count {
  font-weight: normal;
  color: var(--primary-color);
  margin-left: 0.5rem;
  font-size: 0.85em;
}

/* Fade In Animation */
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

/* Responsive */
@media (max-width: 768px) {
  .loading-spinner {
    padding: 2rem 1rem;
  }

  .error-message {
    padding: 1.5rem;
    margin: 1rem 0;
  }
}
```

---

## 🧪 Hướng dẫn Kiểm Thử

### Test Scenarios:

```javascript
// TEST 1: Pagination cơ bản
// 1. Vào trang chủ → Click page 2 → Xác nhận sản phẩm thay đổi
// 2. Click "Trước" → Về page 1
// 3. Click "Sau" → Tới page 2

// TEST 2: Search
// 1. Nhập "laptop" → Click "Tìm kiếm" → Filter sản phẩm
// 2. Kết quả phải reset về page 1
// 3. Clear search → Xem tất cả sản phẩm

// TEST 3: Filter nâng cao
// 1. Click "Bộ lọc"
// 2. Chọn category "electronics" → Click "Áp dụng"
// 3. Chọn giá từ 100 - 1000 → Click "Áp dụng"
// 4. Chọn rating 4+ → Click "Áp dụng"
// 5. Click "Reset" → Xóa tất cả filter

// TEST 4: Combine search + filter + pagination
// 1. Nhập keyword
// 2. Mở bộ lọc, chọn category & giá
// 3. Chuyển trang
// 4. Xác nhận tất cả params giữ lại

// TEST 5: Sort
// 1. Click select "Giá: Thấp đến Cao" → Sản phẩm sắp xếp lại
// 2. Click "Phổ biến" → Sắp xếp theo rating

// TEST 6: Edge cases
// 1. Tìm kiếm từ khóa không tồn tại → Hiển thị "Không tìm thấy"
// 2. Nhập page số quá lớn → Backend trả lỗi
// 3. Slow network → Hiển thị loading spinner
```

---

## 📍 Checklist triển khai

- [ ] **Backend**: Cập nhật `/api/products` endpoint với pagination & filter
- [ ] **Frontend Hook**: Tạo `usePagination.js` hook
- [ ] **Frontend Component**: Tạo `Pagination.jsx` component
- [ ] **Frontend Component**: Cập nhật `SearchFilter.jsx` với advanced filter
- [ ] **Frontend Page**: Cập nhật `Home.jsx` sử dụng hook & components
- [ ] **CSS**: Thêm `Pagination.css`
- [ ] **CSS**: Cập nhật `SearchFilter.css`
- [ ] **CSS**: Cập nhật `Home.css`
- [ ] **Test**: Kiểm thử tất cả scenarios
- [ ] **Performance**: Check Network tab, xác nhận API calls chính xác

---

## 🎓 Key Concepts để học

### 1. **URL Query Parameters**

```javascript
// GET /api/products?page=2&limit=12&keyword=laptop&category=electronics

// Frontend: tạo URLSearchParams
const params = new URLSearchParams();
params.append("page", 2);
params.append("keyword", "laptop");
const url = `/api/products?${params.toString()}`;
```

### 2. **Skip & Limit (Database Pagination)**

```javascript
// Page 1: skip = 0, limit = 12 → Items 1-12
// Page 2: skip = 12, limit = 12 → Items 13-24
// Page 3: skip = 24, limit = 12 → Items 25-36
// Formula: skip = (page - 1) * limit
```

### 3. **MongoDB Regex (Case-Insensitive Search)**

```javascript
// Tìm tất cả sản phẩm tên có chứa "laptop" (bất kể chữ hoa/thường)
Product.find({
  name: { $regex: "laptop", $options: "i" },
});
```

### 4. **MongoDB Sort**

```javascript
// sort(1) = ascending (A→Z, 0→9)
// sort(-1) = descending (Z→A, 9→0)
.sort({ price: 1 }) // Giá tăng dần
.sort({ price: -1 }) // Giá giảm dần
```

### 5. **React Hooks Optimization**

```javascript
// useCallback: tránh tạo function mới mỗi render
const fetchProducts = useCallback(async () => {
  // ...
}, [dependencies]); // Chỉ tạo lại khi dependencies thay đổi

// Dependency array: gọi lại effect khi thay đổi
useEffect(() => {
  fetchProducts();
}, [filters]); // Gọi lại khi filters thay đổi
```

---

## 🚀 Thứ tự code từng step

1. Backend API endpoint (`/api/products`)
2. Frontend custom hook (`usePagination.js`)
3. Pagination component (`Pagination.jsx`)
4. Update SearchFilter component
5. Update Home page
6. Add CSS
7. Test toàn bộ

Good luck! 💪
