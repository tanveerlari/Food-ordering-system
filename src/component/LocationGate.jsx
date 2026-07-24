import { useState } from "react";

function getDistanceInMeters(lat1, lon1, lat2, lon2) {
  const R = 6371000;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function LocationGate({ restaurantLocation, onResult, onClose }) {
  const [status, setStatus] = useState("idle"); // idle | checking | denied | error

  function requestLocation() {
    if (!navigator.geolocation) {
      setStatus("error");
      return;
    }

    setStatus("checking");

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const distance = getDistanceInMeters(
          latitude,
          longitude,
          restaurantLocation.latitude,
          restaurantLocation.longitude
        );
        const isInside = distance <= restaurantLocation.allowedRadiusMeters;
        onResult(isInside);
      },
      () => {
        setStatus("denied");
      },
      { enableHighAccuracy: true }
    );
  }

  return (
    <div className="location-gate-overlay">
      <div className="location-gate-box">
        <span className="location-icon">📍</span>
        <h2>Enable Location</h2>
        <p>
          To place an order, we need to confirm you're inside the restaurant.
        </p>

        {status === "denied" && (
          <p className="location-error">
            Location access denied. Please enable location permission in your
            browser settings and try again.
          </p>
        )}
        {status === "error" && (
          <p className="location-error">
            Location is not supported on this device/browser.
          </p>
        )}

        <button className="allow-location-btn" onClick={requestLocation}>
          {status === "checking" ? "Checking..." : "Allow Location Access"}
        </button>

        <button className="cancel-btn" onClick={onClose}>
          Cancel
        </button>
      </div>
    </div>
  );
}

export default LocationGate;