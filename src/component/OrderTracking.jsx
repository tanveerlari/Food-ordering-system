import { useEffect, useState } from "react";
import { listenToOrder } from "../orderService";

const STEPS = [
  { key: "preparing", label: "Preparing", icon: "👨‍🍳" },
  { key: "ready", label: "Ready", icon: "🔔" },
  { key: "served", label: "Served", icon: "✅" },
];

function OrderTracking({ order, onClose }) {
  const [currentOrder, setCurrentOrder] = useState(order);

  useEffect(() => {
    // 👇 ab polling nahi, real-time listener — turant update aayega
    const unsubscribe = listenToOrder(order.id, setCurrentOrder);
    return () => unsubscribe();
  }, [order.id]);

  const currentStepIndex = STEPS.findIndex((s) => s.key === currentOrder.status);

  return (
    <div className="tracking-overlay">
      <div className="tracking-box">
        <div className="tracking-topbar">
          <h2>Order Status</h2>
          {currentOrder.status === "served" && (
            <button className="close-btn-feedback" onClick={onClose}>✕</button>
          )}
        </div>

        <div className="tracking-items">
          {currentOrder.items.map((item, i) => (
            <span key={i} className="tracking-item-text">
              {item.quantity} x {item.name}
            </span>
          ))}
        </div>

        <div className="tracking-steps">
          {STEPS.map((step, index) => {
            const isDone = index < currentStepIndex;
            const isActive = index === currentStepIndex;
            return (
              <div key={step.key} className="tracking-step-wrap">
                <div className={`tracking-step-circle ${isDone ? "done" : isActive ? "active" : ""}`}>
                  {isDone ? "✓" : step.icon}
                </div>
                <span className={`tracking-step-label ${isActive ? "active-label" : ""}`}>
                  {step.label}
                </span>
                {index < STEPS.length - 1 && (
                  <div className={`tracking-connector ${isDone ? "done" : ""}`} />
                )}
              </div>
            );
          })}
        </div>

        {currentOrder.status === "served" ? (
          <p className="tracking-done-text">🎉 Your order has been served. Enjoy your meal!</p>
        ) : (
          <p className="tracking-waiting-text">Waiting for restaurant to update status...</p>
        )}
      </div>
    </div>
  );
}

export default OrderTracking;