function RecommendedSection({ items, onOpen }) {
  if (items.length === 0) return null;

  return (
    <div className="recommended-section">
      <div className="recommended-header">
        <span className="ai-icon">✨</span>
        <h3>Recommended for You</h3>
      </div>
      <div className="recommended-scroll">
        {items.map((item) => (
          <div
            key={item.id}
            className="recommended-card"
            onClick={() => onOpen(item)}
          >
            <img src={item.image} alt={item.name} className="recommended-img" />
            <span className="recommended-name">{item.name}</span>
            <span className="recommended-price">{item.price.toFixed(2)} ₹</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default RecommendedSection;