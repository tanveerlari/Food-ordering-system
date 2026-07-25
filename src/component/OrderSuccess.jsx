import { useEffect } from "react";

function OrderSuccess({ onDone }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onDone();
    }, 1800); // 1.8 second dikhne ke baad automatically aage badhega
    return () => clearTimeout(timer);
  }, [onDone]);

  return (
    <div className="success-overlay">
      <div className="success-content">
        <svg className="success-checkmark" viewBox="0 0 80 80">
          <circle
            className="success-circle"
            cx="40"
            cy="40"
            r="36"
            fill="none"
          />
          <path
            className="success-check"
            fill="none"
            d="M20 41 L34 55 L60 27"
          />
        </svg>
        <h2 className="success-text">Order Placed!</h2>
        <p className="success-subtext">Sit back, your food is on its way</p>
      </div>
    </div>
  );
}

export default OrderSuccess;
