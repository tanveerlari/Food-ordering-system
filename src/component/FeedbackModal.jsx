import { useState } from "react";
import StarRating from "./StarRating";
import { saveFeedback } from "../feedback";

function FeedbackModal({ orderItems, onClose }) {
  const [foodRating, setFoodRating] = useState(0);
  const [serviceRating, setServiceRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit() {
    if (foodRating === 0 || serviceRating === 0) {
      alert("Please rate both food and service");
      return;
    }

    saveFeedback({
      foodRating,
      serviceRating,
      comment,
      items: orderItems ? orderItems.map((i) => i.name) : [],
    });

    setSubmitted(true);
    setTimeout(onClose, 1500);
  }

  if (submitted) {
    return (
      <div className="feedback-overlay">
        <div className="feedback-box feedback-success">
          <span className="success-icon">🎉</span>
          <h3>Thank you for your feedback!</h3>
        </div>
      </div>
    );
  }

  return (
    <div className="feedback-overlay">
      <div className="feedback-box">
        <button className="close-btn-feedback" onClick={onClose}>✕</button>

        <h2>Rate Your Experience</h2>

        <div className="rating-row">
          <span className="rating-label">Food Quality</span>
          <StarRating rating={foodRating} onRate={setFoodRating} />
        </div>

        <div className="rating-row">
          <span className="rating-label">Service</span>
          <StarRating rating={serviceRating} onRate={setServiceRating} />
        </div>

        <textarea
          className="feedback-comment"
          placeholder="Tell us more (optional)..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />

        <button className="feedback-submit-btn" onClick={handleSubmit}>
          Submit Feedback
        </button>
      </div>
    </div>
  );
}

export default FeedbackModal;