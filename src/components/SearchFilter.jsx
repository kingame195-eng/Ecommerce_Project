import React, { useState, useEffect } from "react";
import { FiSliders, FiX } from "react-icons/fi";
import "./SearchFilter.css";

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

  // Đồng bộ localFilters với currentFilters khi currentFilters thay đổi
  useEffect(() => {
    setLocalFilters(currentFilters);
  }, [currentFilters]);

  // Xử lý thay đổi input
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setLocalFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Xử lý thay đổi giá cho minPrice và maxPrice
  const handlePriceChange = (e) => {
    const { name, value } = e.target;
    const numValue = parseFloat(value) || 0;
    setLocalFilters((prev) => ({
      ...prev,
      [name]: numValue,
    }));
  };

  // Áp dụng filter, gọi onFilterChange với filter hiện tại
  const handleApplyFilter = () => {
    onFilterChange(localFilters);
    setShowAdvanced(false);
  };

  // Reset filter về mặc định, gọi onFilterChange với filter mặc định
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

  //Đếm filter đang hoạt động, Trả về filters không mặc định
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
