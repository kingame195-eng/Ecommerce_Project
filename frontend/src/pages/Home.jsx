import { useState, useContext, useMemo, useEffect } from "react";
import ProductCard from "../components/ProductCard";
import { CartContext } from "../context/CartContext";
import SearchFilter from "../components/SearchFilter";
import Pagination from "../components/Pagination";
import "./Home.css";

function Home() {
  // ✅ CORRECT: Fetch products from backend API
  const [displayedProducts, setDisplayedProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  // Filter state
  const [filters, setFilters] = useState({
    keyword: "",
    category: "",
    minPrice: 0,
    maxPrice: 5000,
    rating: 0,
    sortBy: "newest",
  });

  // ✅ CORRECT: Fetch products from backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("http://localhost:8000/api/products");
        if (!response.ok) throw new Error("Failed to fetch products");
        const data = await response.json();
        setDisplayedProducts(data);
      } catch (err) {
        setError(err.message);
        console.error("Error fetching products:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // ❌ OLD: Used hardcoded products from data/products.js
  // const [displayedProducts] = useState(products);

  // Filter products based on filters
  const filteredProducts = useMemo(() => {
    let result = displayedProducts.filter((product) =>
      product.name.toLowerCase().includes(filters.keyword.toLowerCase())
    );

    if (filters.category) {
      result = result.filter((product) => product.category === filters.category);
    }

    // Filter by price
    result = result.filter(
      (product) => product.price >= filters.minPrice && product.price <= filters.maxPrice
    );

    // Filter by rating
    if (filters.rating > 0) {
      result = result.filter((product) => (product.rating || 0) >= filters.rating);
    }

    // Sort products
    switch (filters.sortBy) {
      case "price-asc":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        result.sort((a, b) => b.price - a.price);
        break;
      case "name-asc":
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "name-desc":
        result.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case "popular":
        result.sort((a, b) => (b.sales || 0) - (a.sales || 0));
        break;
      case "newest":
      default:
        result.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
        break;
    }
    return result;
  }, [displayedProducts, filters]);

  // Calculate pagination
  const totalProducts = filteredProducts.length;
  const totalPages = Math.ceil(totalProducts / itemsPerPage);
  const startIdx = (currentPage - 1) * itemsPerPage;
  const endIdx = startIdx + itemsPerPage;
  const paginatedProducts = filteredProducts.slice(startIdx, endIdx);

  // Pagination object
  const paginationInfo = {
    page: currentPage,
    pages: totalPages,
    total: totalProducts,
    limit: itemsPerPage,
    hasNextPage: currentPage < totalPages,
    hasPrevPage: currentPage > 1,
  };

  // Handle filter changes - reset to page 1
  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setCurrentPage(1); // Reset to first page when filters change
  };

  // Handle page change
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  return (
    <main className="home">
      <div className="container">
        <section className="hero">
          <h1>Welcome to MyShop</h1>
          <p>Leading electronics store - Quality products, best prices</p>
          <button className="btn-primary">Explore Products</button>
        </section>

        <SearchFilter onFilterChange={handleFilterChange} currentFilters={filters} />

        <section className="products-section">
          <div className="section-header">
            <h2>
              Featured Products
              <span className="result-count">({totalProducts} products)</span>
            </h2>
            <p>Explore the best technology products available</p>
          </div>

          {isLoading && <p style={{ textAlign: "center" }}>Loading products...</p>}
          {error && <p style={{ textAlign: "center", color: "red" }}>Error: {error}</p>}

          {!isLoading && totalProducts === 0 && (
            <p style={{ textAlign: "center", padding: "40px 0" }}>
              No products found matching your filters. Try adjusting your search criteria.
            </p>
          )}

          {!isLoading && totalProducts > 0 && (
            <>
              <div className="products-grid">
                {paginatedProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
              <Pagination
                pagination={paginationInfo}
                onPageChange={handlePageChange}
                isLoading={isLoading}
              />
            </>
          )}
        </section>
        <section className="stats">
          <div className="stat-item">
            <h3>500+</h3>
            <p>Products</p>
          </div>

          <div className="stat-item">
            <h3>50K+</h3>
            <p>Customers</p>
          </div>

          <div className="stat-item">
            <h3>24/7</h3>
            <p>Support</p>
          </div>

          <div className="stat-item">
            <h3>100%</h3>
            <p>Authentic</p>
          </div>
        </section>
      </div>
    </main>
  );
}

export default Home;
