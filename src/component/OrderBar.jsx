function OrderBar({ totalQuantity = 0, totalPrice = 0, onClick }) {
  if (totalQuantity === 0) return null;

  return (
    <div className="order-bar" onClick={onClick}>
      <div className="order-bar-inner">
        <span className="order-bar-text">
          Order {totalQuantity} for {totalPrice.toFixed(2)} ₹
        </span>
        <span className="order-bar-icon">🛍️</span>
      </div>
    </div>
  );
}

export default OrderBar;