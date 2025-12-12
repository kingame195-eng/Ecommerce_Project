import { useContext } from "react";
import { CartContext } from "../context/CartContext";
import { Link } from "react-router-dom";
import { FiTrash2, FiMinus, FiPlus } from "react-icons/fi";
import "./Cart.css";

function Cart() {
  const { cart, removeFromCart, updateQuantity, getTotalPrice } =
    useContext(CartContext);

  const totalPrice = getTotalPrice();
  const shippingCost = totalPrice > 100 ? 0 : 5;
  const totalPayment = totalPrice + shippingCost;

  if (cart.length === 0) {
    return (
      <main className="cart">
        <div className="container">
          <h1>Your Cart</h1>
          <div className="empty-cart">
            <p>Your cart is currently empty</p>
            <Link to="/" className="btn-continue-shopping">
              Continue Shopping
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="cart">
      <div className="container">
        <h1>Your Cart</h1>
        <div className="cart-layout">
          <div className="cart-items">
            <div className="cart-table">
              <div className="cart-header">
                <div className="col-product">Product</div>
                <div className="col-price">Price</div>
                <div className="col-quantity">Quantity</div>
                <div className="col-total">Total</div>
                <div className="col-action">Action</div>
              </div>
              {cart.map((item) => (
                <div key={item.id} className="cart-row">
                  <div className="col-product">
                    <img src={item.image} alt={item.name} />
                    <div className="product-info">
                      <p className="product-name">{item.name}</p>
                      <p className="product-sku">SKU: {item.id}</p>
                    </div>
                  </div>
                  <div className="col-price">
                    ${item.price.toLocaleString("en-US")}
                  </div>

                  <div className="col-quantity">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="qty-btn"
                    >
                      <FiMinus />
                    </button>

                    <input
                      type="number"
                      value={item.quantity}
                      onChange={(e) =>
                        updateQuantity(item.id, parseInt(e.target.value))
                      }
                      min="1"
                      className="qty-input"
                    />

                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="qty-btn"
                    >
                      <FiPlus />
                    </button>
                  </div>
                  <div className="col-total">
                    ${(item.price * item.quantity).toLocaleString("en-US")}
                  </div>

                  <div className="col-action">
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="btn-remove"
                      title="Remove product"
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="order-summary">
            <h2>Order Summary</h2>
            <div className="summary-row">
              <span>Subtotal:</span>
              <span>${totalPrice.toLocaleString("en-US")}</span>
            </div>

            <div className="summary-row">
              <span>Shipping:</span>
              <span className="shipping-cost">
                {shippingCost === 0 ? "Free" : `$${shippingCost}`}
              </span>
            </div>

            {shippingCost > 0 && (
              <p className="shipping-note">
                Free shipping for orders over $100
              </p>
            )}

            <div className="summary-row total">
              <span>Total Payment:</span>
              <span>${totalPayment.toLocaleString("en-US")}</span>
            </div>

            <div className="btn-group">
              {/* ↑ .btn-group: container for 2 buttons (flex column) */}
              <Link to="/checkout" className="btn-checkout">
                {/* ↑ btn-checkout: checkout button (orange gradient) */}
                Proceed to Checkout
              </Link>

              <Link to="/" className="btn-continue-shopping">
                {/* ↑ btn-continue-shopping: continue shopping button (orange outline) */}
                Continue Shopping
              </Link>
            </div>
            {/* ↑ Buttons now stacked vertically with gap 12px (no overlap) */}
          </div>
        </div>
      </div>
    </main>
  );
}

export default Cart;
