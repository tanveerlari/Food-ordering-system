import { useState, useEffect } from "react";
import { listenToAllOrders, updateOrderStatusInFirestore } from "../orderService";

function StaffOrderPanel({ onClose }) {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const unsubscribe = listenToAllOrders(setOrders);
    return () => unsubscribe();
  }, []);

  async function handleStatusChange(orderId, status) {
    await updateOrderStatusInFirestore(orderId, status);
  }

  return (
    <div className="staff-panel-overlay">
      <div className="staff-panel-box">
        <div className="tracking-topbar">
          <h2>🧑‍🍳 Staff Order Panel</h2>
          <button className="close-btn-feedback" onClick={onClose}>✕</button>
        </div>

        {orders.length === 0 ? (
          <p className="empty-text">No active orders right now.</p>
        ) : (
          orders.map((order) => (
            <div key={order.id} className="staff-order-card">
              <div className="tracking-items">
                {order.items && order.items.length > 0 ? (
                  order.items.map((item, i) => (
                    <span key={i} className="tracking-item-text">
                      {item.quantity} x {item.name}
                    </span>
                  ))
                ) : (
                  <span className="tracking-item-text empty-text">No items found</span>
                )}
              </div>

              <p className="staff-current-status">
                Status: <strong>{order.status || "unknown"}</strong>
              </p>

              <div className="staff-buttons">
                <button
                  className={`staff-status-btn ${order.status === "preparing" ? "active-status" : ""}`}
                  onClick={() => handleStatusChange(order.id, "preparing")}
                >
                  👨‍🍳 Preparing
                </button>
                <button
                  className={`staff-status-btn ${order.status === "ready" ? "active-status" : ""}`}
                  onClick={() => handleStatusChange(order.id, "ready")}
                >
                  🔔 Ready
                </button>
                <button
                  className={`staff-status-btn ${order.status === "served" ? "active-status" : ""}`}
                  onClick={() => handleStatusChange(order.id, "served")}
                >
                  ✅ Served
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default StaffOrderPanel;