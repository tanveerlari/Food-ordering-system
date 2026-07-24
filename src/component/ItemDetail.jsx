function ItemDetail({ item, liked, onToggleLike, onAdd, onClose }) {
  if (!item) return null;

  return (
    <div className="detail-overlay">
      <div className="detail-topbar">
        <button className="icon-btn" onClick={onClose}>‹</button>
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

      <button className="add-btn" onClick={() => onAdd(item)}>+</button>

      <p className="detail-description">{item.description}</p>
    </div>
  );
}

export default ItemDetail;