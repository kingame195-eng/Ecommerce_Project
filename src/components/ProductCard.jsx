import { Link } from "react-router-dom";
import { FiShoppingCart, FiEye } from "react-icons/fi";
import { useContext } from "react";
import { CartContext } from "../context/CartContext";
import "./ProductCard.css";

function ProductCard({ product }) {
  const { addToCart } = useContext(CartContext);

  return (
    <div className="product-card">
      <div className="product-image">
        <img src={product.image} alt={product.name} />
        <div className="product-overlay">
          <Link to={`/product/${product.id}`} className="btn-view">
            <FiEye size={20} />
            View Details
          </Link>

          <button className="btn-cart" onClick={() => addToCart(product)}>
            <FiShoppingCart size={20} />
            Add to Cart
          </button>
        </div>
        <div className="product-badge">{product.category}</div>
      </div>

      <div className="product-info">
        <h3 className="product-name">
          <Link to={`/product/${product.id}`}>{product.name}</Link>
        </h3>
        <p className="product-description">{product.description}</p>
        <div className="product-footer">
          <span className="product-price">
            ${product.price.toLocaleString("en-US")}
          </span>
          <span
            className={`stock-status ${
              product.stock > 0 ? "in-stock" : "out-of-stock"
            }`}
          >
            {product.stock > 0 ? "In Stock" : "Out of Stock"}
          </span>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
