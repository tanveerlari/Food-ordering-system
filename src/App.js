import { useState, useEffect, useMemo } from "react";
import { auth } from "./firebase";
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
import { onAuthStateChanged, signOut } from "firebase/auth";
import { OFFERS, RESTAURANT_LOCATION, ADMIN_EMAILS } from "./data";
import { getRecommendedItems } from "./recommendationEngine";
import { listenToMenuItems } from "./menuService";
import { createOrderInFirestore, clearOrderInFirestore } from "./orderService";
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
  const [user, setUser] = useState(null);
  const [authChecked, setAuthChecked] = useState(true);
  const [locationGateOpen, setLocationGateOpen] = useState(false);
  const [isInsideRestaurant, setIsInsideRestaurant] = useState(null);
  const [activeOrder, setActiveOrder] = useState(null);
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [lastOrderItems, setLastOrderItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const isAdmin = user && ADMIN_EMAILS.includes(user.email);

  // 👇 search ke hisaab se ya category ke hisaab se items filter honge
  const filteredItems = searchQuery.trim()
    ? items.filter((i) =>
        i.name.toLowerCase().includes(searchQuery.trim().toLowerCase())
      )
    : items.filter((i) => i.category === activeCategory);

  /*
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser({
          email: firebaseUser.email,
          name: firebaseUser.displayName,
          photoURL: firebaseUser.photoURL,
        });
      } else {
        setUser(null);
      }
      setAuthChecked(true);
    });
    return () => unsubscribe();
  }, []);
  */

  useEffect(() => {
    const unsubscribe = listenToMenuItems(setItems);
    return () => unsubscribe();
  }, []);

  const totalQuantity = cart.reduce((sum, c) => sum + c.quantity, 0);
  const totalPrice = cart.reduce((sum, c) => sum + c.item.price * c.quantity, 0);

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
      prev
        .map((c) => (c.item.id === itemId ? { ...c, quantity: c.quantity - 1 } : c))
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

  async function handleLogout() {
    await signOut(auth);
    setUser(null);
    window.location.reload();
  }

  // 👇 /admin route
  if (path === "/admin") {
    if (!authChecked) {
      return <div className="standalone-page"><p className="empty-text">Loading...</p></div>;
    }
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
    if (!authChecked) {
      return <div className="standalone-page"><p className="empty-text">Loading...</p></div>;
    }
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
        onLogout={handleLogout}
      />

      <OfferSlider offers={OFFERS} />

      <div className="search-bar-wrapper">
        <input
          type="text"
          className="search-bar-input"
          placeholder="🔍 Search for items..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

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

            // 👇 agar admin hai, to seedha /admin bhej do
            if (ADMIN_EMAILS.includes(userData.email)) {
              window.location.href = "/admin";
              return;
            }

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