// src/App.js
import { useState, useEffect, useMemo } from "react";
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
import AdminMenuPanel from "./component/AdminMenuPanel";
import StaffOrderPanel from "./component/StaffOrderPanel";
import { OFFERS, RESTAURANT_LOCATION, ADMIN_EMAILS } from "./data";
import { getRecommendedItems } from "./recommendationEngine";
import { listenToMenuItems } from "./menuService";
import { createOrderInFirestore, clearOrderInFirestore } from "./orderService";
import "./App.css";


// Firebase auth imports hata diye gaye hain
// import { auth } from "./firebase";
// import { onAuthStateChanged } from "firebase/auth";

import "./App.css";

function App() {
  const path = window.location.pathname;

  const [items, setItems] = useState([]);
  const [activeCategory, setActiveCategory] = useState("popular");
  const [liked, setLiked] = useState({});
  const [cart, setCart] = useState([]);
  const [orderedItemIds, setOrderedItemIds] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [user, setUser] = useState(null); // Ab yeh state page refresh par reset ho jayega
  const [locationGateOpen, setLocationGateOpen] = useState(false);
  const [isInsideRestaurant, setIsInsideRestaurant] = useState(null);
  const [activeOrder, setActiveOrder] = useState(null);
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [lastOrderItems, setLastOrderItems] = useState([]);

  const isAdmin = user && ADMIN_EMAILS.includes(user.email);

  // Firebase auth state listener hata diya gaya hai
  // useEffect(() => {
  //   const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
  //     if (currentUser) {
  //       setUser({
  //         email: currentUser.email,
  //         name: currentUser.displayName,
  //         photoURL: currentUser.photoURL,
  //         uid: currentUser.uid,
  //       });
  //     } else {
  //       setUser(null);
  //     }
  //   });
  //   return () => unsubscribe();
  // }, []);

  useEffect(() => {
    const unsubscribe = listenToMenuItems(setItems);
    return () => unsubscribe();
  }, []);

  const totalQuantity = cart.reduce((sum, c) => sum + c.quantity, 0);
  const totalPrice = cart.reduce((sum, c) => sum + c.item.price * c.quantity, 0);


  const filteredItems = items.filter((i) => i.category === activeCategory);
  const likedIds = Object.keys(liked).filter((id) => liked[id]).map(Number);
  const recommendedItems = useMemo(
    () => getRecommendedItems(items, likedIds, orderedItemIds, 4),
    [items, liked, orderedItemIds]
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

  async function markOrderPlaced() {
    const newOrderedIds = cart.map((c) => c.item.id);
    setOrderedItemIds((prev) => [...prev, ...newOrderedIds]);
    setLastOrderItems(cart.map((c) => c.item));

    const orderId = `order_${Date.now()}`;
    const newOrder = {
      items: cart.map((c) => ({ name: c.item.name, quantity: c.quantity })),
      status: "preparing",
      createdAt: new Date().toISOString(),
    };

    await createOrderInFirestore(orderId, newOrder);
    setActiveOrder({ id: orderId, ...newOrder });
  }


  function handleOrderBarClick() {
    if (!user) {
      setLoginOpen(true);
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
      if (totalQuantity > 0) {
        setCartOpen(true);
      } else {
        alert("Your cart is empty. Please add items to order.");
      }
    } else {
      alert("You must be inside the restaurant to place an order.");
    }
  }

  // 👇 /admin route
  if (path === "/admin") {
    return (
      <div className="standalone-page">
        {!user ? (
          <LoginModal onClose={() => {}} onLoginSuccess={(userData) => setUser(userData)} />
        ) : !isAdmin ? (
          <div className="access-denied">
            <h2>🚫 Access Denied</h2>
            <p>You are not authorized to view this page.</p>
          </div>
        ) : (
          <AdminMenuPanel onClose={() => (window.location.href = "/")} />
        )}
      </div>
    );
  }

  // 👇 /staff route
  if (path === "/staff") {
    return (
      <div className="standalone-page">
        {!user ? (
          <LoginModal onClose={() => {}} onLoginSuccess={(userData) => setUser(userData)} />
        ) : !isAdmin ? (
          <div className="access-denied">
            <h2>🚫 Access Denied</h2>
            <p>You are not authorized to view this page.</p>
          </div>
        ) : (
          <StaffOrderPanel onClose={() => (window.location.href = "/")} />
        )}
      </div>
    );
  }

  // 👇 normal app ("/")
  return (
    <div className="app">
      <Header
        onLoginClick={() => setLoginOpen(true)}
        user={user}
        isAdmin={isAdmin}
        onAdminClick={() => window.open("/admin", "_blank")}
        onStaffClick={() => window.open("/staff", "_blank")}
      />

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
          totalQuantity={totalQuantity}
          onIncrease={increaseQty}
          onDecrease={decreaseQty}
          onClose={() => setCartOpen(false)}
          onOrderPlaced={markOrderPlaced}
          onAddNewItem={addToCart}
        />
      )}

      {activeOrder && (
        <OrderTracking
          order={activeOrder}
          onClose={async () => {
            await clearOrderInFirestore(activeOrder.id);
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
            setUser(userData);
            setLoginOpen(false);
            if (totalQuantity > 0) {
                if (isInsideRestaurant === true) {
                    setCartOpen(true);
                } else {
                    setLocationGateOpen(true);
                }
            }
          }}
        />
      )}
    </div>
  );
}

export default App; 