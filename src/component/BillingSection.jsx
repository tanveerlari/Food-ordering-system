import { useState, useEffect } from "react";
import { listenToUserOrders } from "../orderHistoryService";

function BillingSection({ userEmail }) {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (!userEmail) return;
    const unsubscribe = listenToUserOrders(userEmail, setOrders);
    return () => unsubscribe();
  }, [userEmail]);

  return (
    <div className="billing-section">
      <div className="billing-header">
        <h2>Your Bills</h2>
        <span className="billing-count">{orders.length} orders</span>
      </div>

      {orders.length === 0 ? (
        <div className="billing-empty">
          <span className="billing-empty-icon">🧾</span>
          <p>No bills yet</p>
          <span className="billing-empty-sub">Your order receipts will appear here</span>
        </div>
      ) : (
        <div className="billing-list">
          {orders.map((order) => (
            <div key={order.id} className="bill-card">
              <div className="bill-card-top">
                <span className="bill-date">
                  {new Date(order.createdAt).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </span>
                <span className="bill-total">{order.totalPrice.toFixed(2)} ₹</span>
              </div>

              <div className="bill-items">
                {order.items.map((item, i) => (
                  <div key={i} className="bill-item-row">
                    <span>{item.quantity} x {item.name}</span>
                    <span>{(item.price * item.quantity).toFixed(2)} ₹</span>
                  </div>
                ))}
              </div>

              <div className="bill-footer">
                <span className={`bill-status-tag ${order.orderType}`}>
                  {order.orderType?.toUpperCase() || "DINE IN"}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default BillingSection;