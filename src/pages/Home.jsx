import { useState, useContext, useMemo } from "react";
import ProductCard from "../components/ProductCard";
import { products } from "../data/products";
import { CartContext } from "../context/CartContext";
import SearchFilter from "../components/SearchFilter";
import "./Home.css";

function Home() {
  // const [displayedProducts] = useState(products);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [sortBy, setSortBy] = useState("none");

  const filteredProducts = useMemo(() => {
    let result = products.filter((product) =>
      product.name.toLowerCase().includes(searchKeyword.toLowerCase())
    );

    if (selectedCategory) {
      result = result.filter(
        (product) => product.category === selectedCategory
      );
    }

    switch (sortBy) {
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
      default:
        break;
    }
    return result;
  }, [searchKeyword, selectedCategory, sortBy]);

  return (
    <main className="home">
      <div className="container">
        <section className="hero">
          <h1>Welcome to MyShop</h1>
          <p>Leading electronics store - Quality products, best prices</p>
          <button className="btn-primary">Explore Products</button>
        </section>

        <SearchFilter
          onSearch={setSearchKeyword}
          onFilterChange={setSelectedCategory}
          onSortChange={setSortBy}
        />

        <section className="products-section">
          <div className="section-header">
            <h2>
              Featured Products
              <span className="result-count">
                ({filteredProducts.length} products)
              </span>
            </h2>
            <p>Explore the best technology products available</p>
          </div>

          <div className="products-grid">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
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
