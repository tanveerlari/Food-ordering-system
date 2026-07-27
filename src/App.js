import { useState, useMemo } from "react";
import Header from "./component/Header";
import CategoryTabs from "./component/CategoryTabs";
import FoodCard from "./component/FoodCard";
import OrderBar from "./component/OrderBar";
import ItemDetail from "./component/ItemDetail";
import CartPage from "./component/CartPage";
import LoginModal from "./component/LoginModal";
import OfferSlider from "./component/OfferSlider";
import LocationGate from "./component/LocationGate";
import RecommendedSection from "./component/RecommendedSection";
import OrderTracking from "./component/OrderTracking";
import FeedbackModal from "./component/FeedbackModal";
import { ITEMS, OFFERS, RESTAURANT_LOCATION } from "./data";
import { getRecommendedItems } from "./recommendationEngine";
import "./App.css";

function App() {
  const [activeCategory, setActiveCategory] = useState("popular");
  const [liked, setLiked] = useState({});
  const [cart, setCart] = useState([]);
  const [orderedItemIds, setOrderedItemIds] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [locationGateOpen, setLocationGateOpen] = useState(false);
  const [isInsideRestaurant, setIsInsideRestaurant] = useState(null);

  const [activeOrder, setActiveOrder] = useState(null);       // 👈 naya
  const [feedbackOpen, setFeedbackOpen] = useState(false);     // 👈 naya
  const [lastOrderItems, setLastOrderItems] = useState([]);    // 👈 naya

  const filteredItems = ITEMS.filter((i) => i.category === activeCategory);

  const likedIds = Object.keys(liked).filter((id) => liked[id]).map(Number);
  const recommendedItems = useMemo(
    () => getRecommendedItems(likedIds, orderedItemIds, 4),
    [liked, orderedItemIds]
  );

  function toggleLike(id) {
    setLiked((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  function addToCart(item) {
    setCart((prev) => {
      const existing = prev.find((c) => c.item.id === item.id);
      if (existing) {
        return prev.map((c) =>
          c.item.id === item.id ? { ...c, quantity: c.quantity + 1 } : c
        );
      }
      return [...prev, { item, quantity: 1 }];
    });
    setSelectedItem(null);
  }

  function increaseQty(itemId) {
    setCart((prev) =>
      prev.map((c) => (c.item.id === itemId ? { ...c, quantity: c.quantity + 1 } : c))
    );
  }

  function decreaseQty(itemId) {
    setCart((prev) =>
      prev.map((c) => (c.item.id === itemId ? { ...c, quantity: c.quantity - 1 } : c))
        .filter((c) => c.quantity > 0)
    );
  }

  function markOrderPlaced() {
    const newOrderedIds = cart.map((c) => c.item.id);
    setOrderedItemIds((prev) => [...prev, ...newOrderedIds]);
    setLastOrderItems(cart.map((c) => c.item));

    const orderId = Date.now();
    setActiveOrder({
      id: orderId,
      items: cart.map((c) => ({ name: c.item.name, quantity: c.quantity })),
      status: "preparing",
    });
  }

  const totalQuantity = cart.reduce((sum, c) => sum + c.quantity, 0);
  const totalPrice = cart.reduce((sum, c) => sum + c.item.price * c.quantity, 0);

function handleOrderBarClick() {
  if (!user) {
    setLoginOpen(true);   // 👈 naya: pehle login mangna
    return;
  }
  if (isInsideRestaurant === true) {
    setCartOpen(true);
  } else {
    setLocationGateOpen(true);
  }
}

  function handleLocationResult(isInside) {
    setIsInsideRestaurant(isInside);
    setLocationGateOpen(false);
    if (isInside) {
      setCartOpen(true);
    } else {
      alert("You must be inside the restaurant to place an order.");
    }
  }

  return (
    <div className="app">
      <Header onLoginClick={() => setLoginOpen(true)} user={user} />
      <OfferSlider offers={OFFERS} />
      <CategoryTabs active={activeCategory} onSelect={setActiveCategory} />
      <RecommendedSection items={recommendedItems} onOpen={setSelectedItem} />

      <div className="grid" key={activeCategory}>
        {filteredItems.map((item, index) => (
          <FoodCard
            key={item.id}
            item={item}
            index={index}
            liked={!!liked[item.id]}
            onToggleLike={toggleLike}
            onOpen={setSelectedItem}
          />
        ))}
      </div>

      <OrderBar
        totalQuantity={totalQuantity}
        totalPrice={totalPrice}
        onClick={handleOrderBarClick}
      />

      {selectedItem && (
        <ItemDetail
          item={selectedItem}
          liked={!!liked[selectedItem.id]}
          onToggleLike={toggleLike}
          onAdd={addToCart}
          onClose={() => setSelectedItem(null)}
        />
      )}

      {locationGateOpen && (
        <LocationGate
          restaurantLocation={RESTAURANT_LOCATION}
          onResult={handleLocationResult}
          onClose={() => setLocationGateOpen(false)}
        />
      )}

      {cartOpen && (
        <CartPage
          cart={cart}
          totalPrice={totalPrice}
          onIncrease={increaseQty}
          onDecrease={decreaseQty}
          onClose={() => setCartOpen(false)}
          onOrderPlaced={markOrderPlaced}
          onAddNewItem={addToCart}
        />
      )}

      {/* 👇 YAHI PE Order Tracking dikhega — CartPage band hone ke baad */}
      {activeOrder && (
        <OrderTracking
          order={activeOrder}
          onStatusUpdate={(updatedOrder) => setActiveOrder(updatedOrder)}
          onClose={() => {
            setActiveOrder(null);
            setTimeout(() => setFeedbackOpen(true), 300);
          }}
        />
      )}

      {feedbackOpen && (
        <FeedbackModal
          orderItems={lastOrderItems}
          onClose={() => setFeedbackOpen(false)}
        />
      )}

{loginOpen && (
  <LoginModal
    onClose={() => setLoginOpen(false)}
    onLoginSuccess={(userData) => {
      setUser(userData); // 👈 ab pura object store hoga: { email, name, photoURL }
      setLoginOpen(false);

      if (isInsideRestaurant === true) {
        setCartOpen(true);
      } else {
        setLocationGateOpen(true);
      }
    }}
  />
)}
    </div>
  );
}

export default App;