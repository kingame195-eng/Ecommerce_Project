import { Link } from "react-router-dom";
import { FiShoppingCart, FiMenu, FiX } from "react-icons/fi";
import { useState, useContext } from "react";
import { CartContext } from "../context/CartContext";
import "./Header.css";

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { cart } = useContext(CartContext);
  const cartCount = cart.length;

  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="logo">
          MyShop
        </Link>

        <nav className={`nav ${menuOpen ? "nav-open" : ""}`}>
          <Link to="/" className="nav-link">
            Home
          </Link>
          <Link to="/" className="nav-link">
            Products
          </Link>
          <Link to="/" className="nav-link">
            Contact
          </Link>
          <Link to="/account" className="nav-link">
            Account
          </Link>
          <Link to="/order-history" className="nav-link">
            Order History
          </Link>
          <Link to="/cart" className="nav-link cart-link">
            <span className="cart-icon">🛒</span>
            Cart
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </Link>
        </nav>

        <button
          className="menu-toggle"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
      </div>
    </header>
  );
}

export default Header;
