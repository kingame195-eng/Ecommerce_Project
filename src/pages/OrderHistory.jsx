import { FiPackage, FiTruck, FiCheckCircle } from "react-icons/fi";
import "./OrderHistory.css";

function OrderHistory() {
  const orders = [
    {
      id: "ORD-001",
      date: "2024-11-20",
      total: 2599,
      status: "completed",
      items: [
        { name: "Dell XPS 13 Laptop", quantity: 1, price: 1200 },
        { name: "Logitech MX Master 3S Mouse", quantity: 2, price: 99 },
      ],
    },
    {
      id: "ORD-002",
      date: "2024-11-15",
      total: 1998,
      status: "shipping",
      items: [
        { name: "iPhone 14 Pro", quantity: 1, price: 999 },
        { name: "Sony WH-1000XM4 Headphones", quantity: 1, price: 349 },
      ],
    },
    {
      id: "ORD-003",
      date: "2024-11-10",
      total: 349,
      status: "pending",
      items: [{ name: "Sony WH-1000XM4 Headphones", quantity: 1, price: 349 }],
    },
  ];

  const renderStatusBadge = (status) => {
    const statusConfig = {
      pending: { label: "Pending", color: "warning", icon: FiPackage },
      shipping: { label: "Shipping", color: "info", icon: FiTruck },
      completed: {
        label: "Completed",
        color: "success",
        icon: FiCheckCircle,
      },
    };

    const config = statusConfig[status];
    const Icon = config.icon;

    return (
      <div className={`status-badge ${config.color}`}>
        <Icon size={16} />
        <span>{config.label}</span>
      </div>
    );
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("vi-VN");
  };

  return (
    <main className="order-history-page">
      <div className="container">
        <h1>Order History</h1>

        {orders.length === 0 ? (
          <div className="no-orders">
            <p>You have no orders</p>
          </div>
        ) : (
          <div className="orders-list">
            {orders.map((order) => (
              <div key={order.id} className="order-card">
                {/* Order header */}
                <div className="order-header">
                  <div className="order-info">
                    <h3>Order #{order.id}</h3>
                    <p className="order-date">
                      Order Date: {formatDate(order.date)}
                    </p>
                  </div>
                  <div className="order-status">
                    {renderStatusBadge(order.status)}
                  </div>
                </div>

                {/* Order items */}
                <div className="order-items">
                  <h4>Product Details</h4>
                  {order.items.map((item, index) => (
                    <div key={index} className="order-item">
                      <span className="item-name">{item.name}</span>
                      <span className="item-qty">x{item.quantity}</span>
                      <span className="item-price">
                        ${item.price.toLocaleString("en-US")}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Order footer */}
                <div className="order-footer">
                  <div className="order-total">
                    <strong>Total:</strong>
                    <strong className="total-amount">
                      ${order.total.toLocaleString("en-US")}
                    </strong>
                  </div>
                  <button className="btn-view-detail">View Details</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

export default OrderHistory;