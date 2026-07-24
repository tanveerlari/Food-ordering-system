import { useRef, useEffect } from "react";
import { CATEGORIES } from "../data";

function CategoryTabs({ active, onSelect }) {
  const tabRefs = useRef({});

  useEffect(() => {
    const activeTab = tabRefs.current[active];
    if (activeTab) {
      activeTab.scrollIntoView({
        behavior: "smooth",
        inline: "center",
        block: "nearest",
      });
    }
  }, [active]);

  return (
    <div>
      <div className="tabs">
        {CATEGORIES.map((cat) => (
          <div
            key={cat.id}
            ref={(el) => (tabRefs.current[cat.id] = el)}
            className={`tab ${active === cat.id ? "active" : ""}`}
            onClick={() => onSelect(cat.id)}
          >
            <div className={`tab-icon ${cat.id === "popular" ? "popular" : ""}`}>
              {cat.emoji}
            </div>
            <span className="tab-label">{cat.label}</span>
          </div>
        ))}
      </div>
      <div className="tab-divider"></div>
    </div>
  );
}

export default CategoryTabs;