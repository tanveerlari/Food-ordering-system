function ComboSuggestions({ items, onAdd }) {
  if (items.length === 0) return null;

  return (
    <div className="combo-section">
      <div className="combo-header">
        <span className="ai-icon">✨</span>
        <span>Frequently ordered together</span>
      </div>
      {items.map((item) => (
        <div key={item.id} className="combo-item-row">
          <img src={item.image} alt={item.name} className="combo-item-img" />
          <div className="combo-item-info">
            <span className="combo-item-name">{item.name}</span>
            <span className="combo-item-price">{item.price.toFixed(2)} ₹</span>
          </div>
          <button className="combo-add-btn" onClick={() => onAdd(item)}>
            Add +
          </button>
        </div>
      ))}
    </div>
  );
}

export default ComboSuggestions;