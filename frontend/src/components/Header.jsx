import { FiShoppingCart, FiMenu, FiX } from "react-icons/fi";
import { useState, useContext } from "react";
import { CartContext } from "../context/CartContext";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { FiUser, FiLogOut } from "react-icons/fi";
import "./Header.css";

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { cart } = useContext(CartContext);
  const cartCount = cart.length;
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

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

          {user ? (
            <div className="user-menu">
              <span className="user-name">Hi, {user.name || user.email}</span>
              <Link to="/account" className="nav-link">
                <FiUser /> Account
              </Link>
              <button onClick={handleLogout} className="nav-link logout">
                <FiLogOut /> Logout
              </button>
            </div>
          ) : (
            <div className="auth-menu">
              <Link to="/login" className="nav-link">
                Login
              </Link>
              <Link to="/register" className="nav-link register">
                Register
              </Link>
            </div>
          )}

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
