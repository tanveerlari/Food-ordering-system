function BottomNav({ activeTab, onTabChange }) {
  return (
    
    <div className="bottom-nav">
      <button
        className={`bottom-nav-item ${activeTab === "home" ? "active" : ""}`}
        onClick={() => onTabChange("home")}
      >
        <span className="bottom-nav-icon">🏠</span>
        <span className="bottom-nav-label">Home</span>
      </button>

      <button
        className={`bottom-nav-item ${activeTab === "billing" ? "active" : ""}`}
        onClick={() => onTabChange("billing")}
      >
        <span className="bottom-nav-icon">🧾</span>
        <span className="bottom-nav-label">Billing</span>
      </button>
    </div>
  );
}

export default BottomNav;