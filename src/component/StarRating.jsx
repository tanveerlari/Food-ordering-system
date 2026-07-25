import { useState } from "react";

function StarRating({ rating, onRate }) {
  const [hovered, setHovered] = useState(0);

  return (
    <div className="star-rating">
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className={`star ${star <= (hovered || rating) ? "filled" : ""}`}
          onClick={() => onRate(star)}
          onMouseEnter={() => setHovered(star)}
          onMouseLeave={() => setHovered(0)}
        >
          ★
        </span>
      ))}
    </div>
  );
}

export default StarRating;