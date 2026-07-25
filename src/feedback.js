// src/feedback.js

export function saveFeedback(feedback) {
  const existing = JSON.parse(localStorage.getItem("feedbacks") || "[]");
  const newFeedback = {
    id: Date.now(),
    ...feedback,
    timestamp: new Date().toISOString(),
  };
  localStorage.setItem("feedbacks", JSON.stringify([...existing, newFeedback]));
  return newFeedback;
}

export function getAllFeedbacks() {
  return JSON.parse(localStorage.getItem("feedbacks") || "[]");
}

// Average rating nikalna (analytics dashboard ke liye)
export function getAverageRatings() {
  const feedbacks = getAllFeedbacks();
  if (feedbacks.length === 0) return { food: 0, service: 0, total: 0 };

  const foodSum = feedbacks.reduce((sum, f) => sum + f.foodRating, 0);
  const serviceSum = feedbacks.reduce((sum, f) => sum + f.serviceRating, 0);

  return {
    food: (foodSum / feedbacks.length).toFixed(1),
    service: (serviceSum / feedbacks.length).toFixed(1),
    total: feedbacks.length,
  };
}