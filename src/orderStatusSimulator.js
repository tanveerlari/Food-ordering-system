// src/orderStatusSimulator.js

// Real production mein ye status backend/kitchen staff app se update hoga (WebSocket ya polling se).
// Abhi demo ke liye hum time-based simulation kar rahe hain.
export function simulateOrderProgress(order, onStatusChange) {
  const timers = [];

  timers.push(
    setTimeout(() => {
      onStatusChange({ ...order, status: "ready" });
    }, 8000) // 8 second baad "ready"
  );

  timers.push(
    setTimeout(() => {
      onStatusChange({ ...order, status: "served" });
    }, 16000) // 16 second baad "served"
  );

  return () => timers.forEach(clearTimeout); // cleanup function
}