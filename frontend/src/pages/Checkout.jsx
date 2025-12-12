import { useContext, useState } from "react";
import { CartContext } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import "./Checkout.css";

function Checkout() {
  const { cart, getTotalPrice, clearCart } = useContext(CartContext);
  const { user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: user?.name || "",
    email: user?.email || "",
    phone: "",
    address: "",
    city: "",
    zipCode: "",
    paymentMethod: "credit-card",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);

  if (cart.length === 0 && !orderPlaced) {
    return (
      <main className="checkout">
        <div className="container">
          <h1>No items in cart</h1>
          <p>
            <button onClick={() => navigate("/cart")} className="btn-primary">
              Back to cart
            </button>
          </p>
        </div>
      </main>
    );
  }

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.fullName || !formData.email || !formData.phone) {
      alert("Please fill in all required fields");
      return;
    }

    // ✅ CORRECT: Submit order to backend API
    setIsLoading(true);
    try {
      const response = await fetch("http://localhost:8000/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.token}`,
        },
        body: JSON.stringify({
          items: cart.map((item) => ({
            productId: item.id,
            quantity: item.quantity,
          })),
          shippingAddress: `${formData.address}, ${formData.city}`,
        }),
      });

      if (!response.ok) throw new Error("Failed to place order");

      const data = await response.json();
      console.log("Order created:", data);

      setOrderPlaced(true);
      clearCart();
    } catch (error) {
      alert("Error placing order: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // ❌ OLD: Used fake setTimeout instead of calling backend
  // setTimeout(() => {
  //   setOrderPlaced(true);
  //   setIsLoading(false);
  //   clearCart();
  // }, 2000);

  const totalPrice = getTotalPrice();
  const shippingCost = totalPrice > 100 ? 0 : 5;
  const totalPayment = totalPrice + shippingCost;

  if (orderPlaced) {
    return (
      <main className="checkout">
        <div className="container">
          <div className="success-message">
            <div className="success-icon">✓</div>
            <h1>Order Placed Successfully!</h1>
            <p>Thank you for your purchase. Your order is being processed.</p>
            <p>
              We will send detailed information to your email: <strong>{formData.email}</strong>
            </p>
            <div className="order-details">
              <h3>Order Information:</h3>
              <p>
                <strong>Recipient Name:</strong> {formData.fullName}
              </p>
              <p>
                <strong>Delivery Address:</strong> {formData.address}, {formData.city}
              </p>
              <p>
                <strong>Total Amount:</strong> ${totalPayment.toLocaleString("en-US")}
              </p>
            </div>
            <button onClick={() => navigate("/")} className="btn-back-home">
              Back to Home
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="checkout">
      <div className="container">
        <h1>Checkout</h1>
        <div className="checkout-layout">
          <div className="checkout-form">
            <form onSubmit={handleSubmit}>
              <section className="form-section">
                <h2>Shipping Information</h2>
                <div className="form-group">
                  <label htmlFor="fullName">Full Name *</label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                    placeholder="Enter full name"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="email">Email *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="Enter email"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="phone">Phone Number *</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    placeholder="Enter phone number"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="address">Address *</label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    required
                    placeholder="Enter address"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="city">City/Province *</label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    required
                    placeholder="Enter city/province"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="zipCode">Postal Code</label>
                  <input
                    type="text"
                    id="zipCode"
                    name="zipCode"
                    value={formData.zipCode}
                    onChange={handleChange}
                    placeholder="Enter postal code"
                  />
                </div>
              </section>
              <section className="form-section">
                <h2>Payment Method</h2>

                <div className="payment-methods">
                  <label className="payment-option">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="credit-card"
                      checked={formData.paymentMethod === "credit-card"}
                      onChange={handleChange}
                    />
                    <span>Credit Card</span>
                  </label>

                  <label className="payment-option">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="paypal"
                      checked={formData.paymentMethod === "paypal"}
                      onChange={handleChange}
                    />
                    <span>PayPal</span>
                  </label>

                  <label className="payment-option">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="bank-transfer"
                      checked={formData.paymentMethod === "bank-transfer"}
                      onChange={handleChange}
                    />
                    <span>Bank Transfer</span>
                  </label>
                </div>
              </section>
              <button type="submit" className="btn-place-order" disabled={isLoading}>
                {isLoading ? "Processing..." : "Place Order"}
              </button>
            </form>
          </div>

          <div className="order-summary-checkout">
            <h2>Order Summary</h2>

            {/* Product list */}
            <div className="order-items">
              {cart.map((item) => (
                <div key={item.id} className="order-item">
                  <div className="item-info">
                    <p className="item-name">{item.name}</p>
                    <p className="item-qty">Quantity: {item.quantity}</p>
                  </div>
                  <div className="item-price">
                    ${(item.price * item.quantity).toLocaleString("en-US")}
                  </div>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div className="order-totals">
              <div className="total-row">
                <span>Subtotal:</span>
                <span>${totalPrice.toLocaleString("en-US")}</span>
              </div>

              <div className="total-row">
                <span>Shipping:</span>
                <span>{shippingCost === 0 ? "Free" : `$${shippingCost}`}</span>
              </div>

              <div className="total-row grand-total">
                <span>Total Payment:</span>
                <span>${totalPayment.toLocaleString("en-US")}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default Checkout;
