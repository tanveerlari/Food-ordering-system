import { useState } from "react";

function ItemDetail({ item, liked, onToggleLike, onAdd, onClose }) {
  const [closing, setClosing] = useState(false);

  if (!item) return null;

  function handleClose() {
    setClosing(true);
    setTimeout(onClose, 250); // animation khatam hone tak wait karo
  }

  function handleAdd() {
    setClosing(true);
    setTimeout(() => onAdd(item), 250);
  }

  return (
    <div className={`detail-overlay ${closing ? "detail-closing" : "detail-opening"}`}>
      <div className="detail-topbar">
        <button className="icon-btn" onClick={handleClose}>‹</button>
        <button
          className="icon-btn"
          onClick={() => onToggleLike(item.id)}
        >
          {liked ? "❤️" : "🤍"}
        </button>
      </div>

      <div className="detail-image-wrap">
        <img src={item.image} alt={item.name} className="detail-image" />
      </div>

      <div className="detail-info-row">
        <h2 className="detail-name">{item.name}</h2>
        <span className="detail-price">{item.price.toFixed(2)} ₹</span>
      </div>

      <button className="add-btn" onClick={handleAdd}>+</button>

      <p className="detail-description">{item.description}</p>
    </div>
  );
}

export default ItemDetail;