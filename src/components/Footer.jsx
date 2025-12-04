import { Link } from "react-router-dom";
import { FiFacebook, FiTwitter, FiInstagram, FiLinkedin } from "react-icons/fi";
import "./Footer.css";

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h4>About MyShop</h4>
          <ul>
            <li>
              <p>
                MyShop is a leading electronics store offering high-quality
                technology products at the best prices.
              </p>
            </li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Quick Links</h4>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/">Products</Link>
            </li>
            <li>
              <Link to="/cart">Cart</Link>
            </li>
            <li>
              <Link to="/">Contact</Link>
            </li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Policies</h4>
          <ul>
            <li>
              <Link to="/">Privacy Policy</Link>
            </li>
            <li>
              <Link to="/">Terms of Service</Link>
            </li>
            <li>
              <Link to="/">Return Policy</Link>
            </li>
            <li>
              <Link to="/">Shipping Policy</Link>
            </li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Contact</h4>
          <ul>
            <li>
              <strong>Address:</strong> 123 Le Loi Street, Ho Chi Minh City
            </li>
            <li>
              <strong>Email:</strong> info@myshop.com
            </li>
            <li>
              <strong>Phone:</strong> 0987654321
            </li>
            <li>
              <strong>Business Hours:</strong> 8AM - 10PM (Mon-Sun)
            </li>
          </ul>
        </div>
      </div>

      <div className="footer-social">
        <div className="social-icons">
          <a href="#" aria-label="Facebook" title="Facebook">
            <FiFacebook size={20} />
          </a>
          <a href="#" aria-label="Twitter" title="Twitter">
            <FiTwitter size={20} />
          </a>
          <a href="#" aria-label="Instagram" title="Instagram">
            <FiInstagram size={20} />
          </a>
          <a href="#" aria-label="LinkedIn" title="LinkedIn">
            <FiLinkedin size={20} />
          </a>
        </div>
      </div>

      <div className="footer-bottom">
        <p>
          &copy; {currentYear} MyShop. All rights reserved. | Designed by{" "}
          <strong>MyTeam</strong>
        </p>
      </div>
    </footer>
  );
}

export default Footer;
