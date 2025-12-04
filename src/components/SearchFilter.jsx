import { useState } from "react";
import { FiSearch, FiX } from "react-icons/fi";
import "./SearchFilter.css";

function SearchFilter({ onSearch, onFilterChange, onSortChange }) {
  const [searchKeyword, setSearchKeyword] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [sortBy, setSortBy] = useState("none");

  const categories = [
    { value: "", label: "All Categories" },
    { value: "Electronics", label: "Electronics" },
    { value: "Audio", label: "Audio" },
    { value: "Accessories", label: "Accessories" },
  ];

  const handleSearchChange = (e) => {
    const value = e.target.value;

    setSearchKeyword(value);
    onSearch(value);
  };

  const handleClearSearch = () => {
    setSearchKeyword("");
    onSearch("");
  };

  const handleCategoryChange = (e) => {
    const value = e.target.value;

    setSelectedCategory(value);
    onFilterChange(value);
  };

  const handleSortChange = (e) => {
    const value = e.target.value;

    setSortBy(value);
    onSortChange(value);
  };

  return (
    <div className="search-filter">
      <div className="filter-header">
        <h3>Search & Filter Products</h3>
      </div>
      <div className="search-box">
        <div className="search-input-wrapper">
          <FiSearch className="search-icon" />
          <input
            type="text"
            placeholder="Enter product name..."
            value={searchKeyword}
            onChange={handleSearchChange}
            className="search-input"
          />

          {searchKeyword && (
            <button
              onClick={handleClearSearch}
              className="clear-btn"
              title="Clear search"
            >
              <FiX />
            </button>
          )}
        </div>
      </div>

      <div className="filter-section">
        <div className="filter-group">
          <label htmlFor="category">Category:</label>
          <select
            id="category"
            value={selectedCategory}
            onChange={handleCategoryChange}
            className="filter-select"
          >
            {categories.map((cat) => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="sort">Sort By:</label>
          <select
            id="sort"
            value={sortBy}
            onChange={handleSortChange}
            className="filter-select"
          >
            <option value="none">No sorting</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="name-asc">Name: A to Z</option>
            <option value="name-desc">Name: Z to A</option>
          </select>
        </div>
      </div>
    </div>
  );
}

export default SearchFilter;
