import { useState, useEffect } from "react";

function OfferSlider({ offers }) {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % offers.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [offers.length]);

  return (
    <div className="offer-slider-wrap">
      <div className="offer-slider-track-outer">
        <div
          className="offer-slider-track"
          style={{ transform: `translateX(-${activeIndex * 100}%)` }}
        >
          {offers.map((offer) => (
            <div key={offer.id} className="offer-slide">
              <img src={offer.image} alt={offer.title} className="offer-image" />
              <div className="offer-overlay" style={{ background: offer.bg }}>
                <span className="offer-title">{offer.title}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="offer-dots">
        {offers.map((_, index) => (
          <span
            key={index}
            className={`dot ${activeIndex === index ? "active" : ""}`}
            onClick={() => setActiveIndex(index)}
          />
        ))}
      </div>
    </div>
  );
}

export default OfferSlider;