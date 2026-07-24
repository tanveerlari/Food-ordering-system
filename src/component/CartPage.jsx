import { useState } from "react";

function CartPage({ cart, totalPrice, onIncrease, onDecrease, onClose }) {
  const [orderType, setOrderType] = useState("dinein");
  const [note, setNote] = useState("");
  const [table, setTable] = useState("");
  const [error, setError] = useState("");
  const [closing, setClosing] = useState(false);

  function handleClose() {
    setClosing(true);
    setTimeout(onClose, 250);
  }

  function handleOrder() {
    if (orderType === "dinein" && table.trim() === "") {
      setError("Please fill required fields");
      return;
    }
    setError("");
    alert("Order placed!");
    handleClose();
  }

  return (
    <div className={`cart-overlay ${closing ? "slide-down" : "slide-up"}`}>
      <div className="cart-topbar">
        <span>
          Order {cart.reduce((s, c) => s + c.quantity, 0)} for {totalPrice.toFixed(2)} ₹
        </span>
        <button className="close-btn" onClick={handleClose}>✕</button>
      </div>

      <div className="order-type-tabs">
        {["dinein", "takeaway", "delivery"].map((type) => (
          <button
            key={type}
            className={`type-tab ${orderType === type ? "active" : ""}`}
            onClick={() => setOrderType(type)}
          >
            {type === "dinein" ? "DINE IN" : type === "takeaway" ? "TAKEAWAY" : "DELIVERY"}
          </button>
        ))}
      </div>

      <div className="cart-items">
        {cart.map((c, index) => (
          <div
            className="cart-item-row fade-in"
            style={{ animationDelay: `${index * 60}ms` }}
            key={c.item.id}
          >
            <span className="cart-item-name">
              {c.quantity} x {c.item.name}
            </span>
            <div className="qty-controls">
              <button onClick={() => onIncrease(c.item.id)}>+</button>
              <button onClick={() => onDecrease(c.item.id)}>−</button>
            </div>
            <span className="cart-item-price">
              {(c.item.price * c.quantity).toFixed(2)} ₹
            </span>
          </div>
        ))}
      </div>

      <div className="cart-total-row">
        <span>Total:</span>
        <span className="total-amount">{totalPrice.toFixed(2)} ₹</span>
      </div>

      {orderType === "dinein" && (
        <input
          className="table-input fade-in"
          placeholder="Table..."
          value={table}
          onChange={(e) => setTable(e.target.value)}
        />
      )}

      {error && <div className="error-text shake">{error}</div>}

      <button className="place-order-btn" onClick={handleOrder}>
        ORDER
      </button>
    </div>
  );
}

export default CartPage;