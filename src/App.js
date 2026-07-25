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
import ComboSuggestions from "./component/ComboSuggestions";
import { ITEMS, OFFERS, RESTAURANT_LOCATION } from "./data";
import { getRecommendedItems } from "./recommendationEngine";
import "./App.css";

function App() {
  const [activeCategory, setActiveCategory] = useState("popular");
  const [liked, setLiked] = useState({});
  const [cart, setCart] = useState([]);
  const [orderedItemIds, setOrderedItemIds] = useState([]); // 👈 naya: past orders track
  const [selectedItem, setSelectedItem] = useState(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [locationGateOpen, setLocationGateOpen] = useState(false);
  const [isInsideRestaurant, setIsInsideRestaurant] = useState(null); // null | true | false

  const filteredItems = ITEMS.filter((i) => i.category === activeCategory);

  // 👇 naya: liked items ki id list nikalna
  const likedIds = Object.keys(liked)
    .filter((id) => liked[id])
    .map(Number);

  // 👇 naya: recommendations calculate karna (sirf jab liked/ordered change ho)
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
      prev.map((c) =>
        c.item.id === itemId ? { ...c, quantity: c.quantity + 1 } : c
      )
    );
  }

  function decreaseQty(itemId) {
    setCart((prev) =>
      prev
        .map((c) =>
          c.item.id === itemId ? { ...c, quantity: c.quantity - 1 } : c
        )
        .filter((c) => c.quantity > 0)
    );
  }

  // 👇 naya: order place hone ke baad ordered items track karna
  function markOrderPlaced() {
    const newOrderedIds = cart.map((c) => c.item.id);
    setOrderedItemIds((prev) => [...prev, ...newOrderedIds]);
  }

  const totalQuantity = cart.reduce((sum, c) => sum + c.quantity, 0);
  const totalPrice = cart.reduce((sum, c) => sum + c.item.price * c.quantity, 0);

  function handleOrderBarClick() {
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

      {/* 👇 naya: Recommended section, CategoryTabs ke baad aur grid se pehle */}
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
            onAddNewItem={addToCart}   // 👈 ye line add karo
         />
      )}

      {loginOpen && (
        <LoginModal
          onClose={() => setLoginOpen(false)}
          onLoginSuccess={(email) => {
            setUser({ email });
            setLoginOpen(false);
          }}
        />
      )}
    </div>
  );
}

export default App;