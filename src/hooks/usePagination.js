import { useState, useCallback, useEffect } from "react";

export function usePagination(initialLimit = 12) {
  const [page, setPage] = useState(1);
  const [limit] = useState(initialLimit);
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const [filters, setFilters] = useState({
    keyword: "",
    category: "",
    minPrice: 0,
    maxPrice: Infinity,
    rating: 0,
    sortBy: "newest",
  });

  const fetchProducts = useCallback(
    async (pageNum = 1, filterObj = filters) => {
      try {
        setIsLoading(true);
        setError(null);

        // Create URL with query parameters
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

  // Update filter
  const updateFilter = useCallback((newFilter) => {
    setFilters((prev) => ({
      ...prev,
      ...newFilter,
    }));
    // Reset to page 1 when filter changes
    setPage(1);
  }, []);

  const goToPage = useCallback(
    (pageNum) => {
      if (pageNum < 1 || (pagination && pageNum > pagination.pages)) return;
      fetchProducts(pageNum, filters);
    },
    [pagination, filters, fetchProducts]
  );

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

  useEffect(() => {
    fetchProducts(1, filters);
  }, [filters]); // Note: do NOT add fetchProducts to dependency array to avoid infinite loop

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
