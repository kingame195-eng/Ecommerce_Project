import { useParams, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { CartContext } from "../context/CartContext";
import { getProductById } from "../data/products";
import { FiShoppingCart, FiArrowLeft } from "react-icons/fi";
import "./ProductDetail.css";
import ProductRatings from "../components/ProductRatings";

function ProductDetail() {
  const { id } = useParams();
  const { addToCart } = useContext(CartContext);
  const navigate = useNavigate();
  const product = getProductById(id);

  if (!product) {
    return (
      <div className="product-detail">
        <div className="container">
          <h2>Product not found</h2>
          <button onClick={() => navigate("/")} className="btn-back">
            Back to home
          </button>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart(product);
    alert("Product added to cart!");
  };

  return (
    <main className="product-detail">
      <div className="container">
        <button onClick={() => navigate("/")} className="btn-back">
          <FiArrowLeft /> Back
        </button>

        <div className="detail-content">
          <div className="detail-image">
            <img src={product.image} alt={product.name} />
            <div className="category-badge">{product.category}</div>
          </div>

          <div className="detail-info">
            <h1>{product.name}</h1>

            <p className="short-description">{product.description}</p>

            <div className="price-section">
              <span className="price">
                ${product.price.toLocaleString("en-US")}
              </span>
              <span className={`stock ${product.stock > 0 ? "in-stock" : ""}`}>
                {product.stock > 0
                  ? `${product.stock} items in stock`
                  : "Out of stock"}
              </span>
            </div>

            <div className="details-section">
              <h3>Product Details</h3>
              <p>{product.details}</p>
            </div>

            <div className="action-buttons">
              <button
                className="btn-add-to-cart"
                onClick={handleAddToCart}
                disabled={product.stock === 0}
              >
                <FiShoppingCart /> Add to Cart
              </button>

              <button
                className="btn-buy-now"
                onClick={() => {
                  handleAddToCart();
                  navigate("/cart");
                }}
                disabled={product.stock === 0}
              >
                Buy Now
              </button>
            </div>

            <div className="additional-info">
              <div className="info-item">
                <strong>SKU:</strong> {product.id}
              </div>
              <div className="info-item">
                <strong>Category:</strong> {product.category}
              </div>
              <div className="info-item">
                <strong>Status:</strong>{" "}
                {product.stock > 0 ? "In stock" : "Out of stock"}
              </div>
            </div>
          </div>
        </div>

        <ProductRatings />
      </div>
    </main>
  );
}

export default ProductDetail;
