import { useState } from "react";
import ComboSuggestions from "./ComboSuggestions";
import OrderSuccess from "./OrderSuccess";
import { getComboSuggestions } from "../recommendationEngine";


function CartPage({ cart, totalPrice, totalQuantity, onIncrease, onDecrease, onClose, onOrderPlaced, onAddNewItem }) {
  const [orderType, setOrderType] = useState("dinein");
  const [note, setNote] = useState("");
  const [table, setTable] = useState("");
  const [cartError, setCartError] = useState(""); // <-- Naya state
  const [closing, setClosing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  function handleClose() {
    setClosing(true);
    setTimeout(onClose, 250);
  }

  function handleOrder() {
    // Har baar order attempt se pehle error ko clear kar do
    setCartError("");

    // PROBLEM SOLVED: Cart empty hone par order place nahi hoga
    if (totalQuantity === 0) {
      setCartError("Your cart is empty. Please add items before placing an order."); // <-- Yahan message set kiya
      return;
    }

    if (orderType === "dinein" && table.trim() === "") {
      setCartError("Please enter your Table number for dine-in."); // <-- Yahan message set kiya
      return;
    }
    
    // Agar sab theek hai toh success dikhao
    setShowSuccess(true);
  }

  function handleSuccessDone() {
    if (onOrderPlaced) onOrderPlaced();
    onClose(); // seedha close, animation already khatam ho chuki
  }

  const cartItemIds = cart.map((c) => c.item.id);
  const comboItems = getComboSuggestions(cartItemIds);

  function handleComboAdd(item) {
    onAddNewItem(item);
  }
    if (showSuccess) {
    return <OrderSuccess onDone={handleSuccessDone} />;
  }

  // Order button ko disable karein agar cart empty hai
  const isOrderButtonDisabled = totalQuantity === 0;


  return (
    <div className={`cart-overlay ${closing ? "slide-down" : "slide-up"}`}>
      <div className="cart-topbar">
        <span>
          Order {totalQuantity} for {totalPrice.toFixed(2)} ₹
        </span>
        <button className="close-btn" onClick={handleClose}>✕</button>
      </div>

      <div className="order-type-tabs">
        {["dinein"].map((type) => (
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
        {cart.length === 0 ? (
          <p className="empty-cart-message">Your cart is empty. Add some delicious food!</p>
        ) : (
          cart.map((c, index) => (
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
          ))
        )}
      </div>

      {/* Combo suggestions tabhi dikhao jab cart mein items hon */}
      {cart.length > 0 && <ComboSuggestions items={comboItems} onAdd={handleComboAdd} />}

      <div className="cart-total-row">
        <span>Total:</span>
        <span className="total-amount">{totalPrice.toFixed(2)} ₹</span>
      </div>

      <textarea
        className="note-input"
        placeholder="Add note ..."
        value={note}
        onChange={(e) => setNote(e.target.value)}
      />



      {orderType === "dinein" && (
        <input
          className="table-input fade-in"
          placeholder="Table..."
          value={table}
          onChange={(e) => setTable(e.target.value)}
        />
      )}

      {cartError && <div className="error-text shake">{cartError}</div>} {/* <-- Yahan error message display hoga */}

      <button
        className="place-order-btn"
        onClick={handleOrder}
        disabled={isOrderButtonDisabled} // Button disable kiya
      >
        ORDER
      </button>
    </div>
  );
}

export default CartPage;