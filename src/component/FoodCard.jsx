function FoodCard({ item, liked, onToggleLike, onOpen, index }) {
  return (
    <div
      className="food-card fade-in"
      style={{ animationDelay: `${index * 60}ms` }}
      onClick={() => onOpen(item)}
    >
      <div className="food-img-wrap">
        <img src={item.image} alt={item.name} className="food-image" />
        <button
          className="heart-btn"
          onClick={(e) => {
            e.stopPropagation();
            onToggleLike(item.id);
          }}
        >
          {liked ? "❤️" : "🤍"}
        </button>
      </div>
      <div className="food-info">
        <span className="food-name">{item.name}</span>
        <span className="food-price">{item.price.toFixed(2)} ₹</span>
      </div>
    </div>
  );
}

export default FoodCard;