import { useState, useEffect, useMemo } from "react";
import { onAuthStateChanged } from "firebase/auth";
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
import AdminDashboard from "./component/AdminDashboard";
import BottomNav from "./component/BottomNav";
import BillingSection from "./component/BillingSection";
import { saveCompletedOrder } from "./orderHistoryService";
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
  const [authChecked, setAuthChecked] = useState(false);
  const [locationGateOpen, setLocationGateOpen] = useState(false);
  const [isInsideRestaurant, setIsInsideRestaurant] = useState(null);
  const [activeOrder, setActiveOrder] = useState(null);
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [lastOrderItems, setLastOrderItems] = useState([]);
  const [activeTab, setActiveTab] = useState("home");

  const isAdmin = user && ADMIN_EMAILS.includes(user.email);

  // Firebase auth state check — page load / naye tab pe bhi login yaad rahega
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

  // Firestore se real-time menu items
  useEffect(() => {
    const unsubscribe = listenToMenuItems(setItems);
    return () => unsubscribe();
  }, []);

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
    items: cart.map((c) => ({
      name: c.item.name,
      quantity: c.quantity,
      price: c.item.price, // 👈 ab price bhi save ho raha hai
    })),
    status: "preparing",
    createdAt: new Date().toISOString(),
  };

  await createOrderInFirestore(orderId, newOrder);
  setActiveOrder({ id: orderId, ...newOrder });
}

  const totalQuantity = cart.reduce((sum, c) => sum + c.quantity, 0);
  const totalPrice = cart.reduce((sum, c) => sum + c.item.price * c.quantity, 0);

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
      setCartOpen(true);
    } else {
      alert("You must be inside the restaurant to place an order.");
    }
  }

  // ===================== /admin route =====================
  if (path === "/admin") {
    if (!authChecked) {
      return (
        <div className="standalone-page">
          <p className="empty-text">Loading...</p>
        </div>
      );
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

  // ===================== /staff route =====================
  if (path === "/staff") {
    if (!authChecked) {
      return (
        <div className="standalone-page">
          <p className="empty-text">Loading...</p>
        </div>
      );
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

  // ===================== "/" route — login check → admin/user decide =====================
  if (path === "/") {
    if (!authChecked) {
      return (
        <div className="standalone-page">
          <p className="empty-text">Loading...</p>
        </div>
      );
    }

    // 1. Login nahi hai → login page dikhao
    if (!user) {
      return (
        <div className="standalone-page">
          <LoginModal
            onClose={() => {}}
            onLoginSuccess={(userData) => setUser(userData)}
          />
        </div>
      );
    }

    // 2. Login hai aur admin hai → Admin Dashboard
    if (isAdmin) {
      return (
        <AdminDashboard
          user={user}
          onManageItems={() => (window.location.href = "/admin")}
          onStaffMenu={() => (window.location.href = "/staff")}
        />
      );
    }

    // 3. Login hai aur normal user hai → customer interface
return (
  <div className="app">
    <Header
      onLoginClick={() => setLoginOpen(true)}
      user={user}
      isAdmin={isAdmin}
      onAdminClick={() => window.open("/admin", "_blank")}
      onStaffClick={() => window.open("/staff", "_blank")}
    />

    {activeTab === "home" ? (
      <>
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
      </>
    ) : (
      <BillingSection userEmail={user.email} />
    )}

    <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />

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

    {activeOrder && (
      <OrderTracking
        order={activeOrder}
        onClose={async () => {
          await saveCompletedOrder({
            customerEmail: user.email,
            items: activeOrder.items,
            totalPrice: activeOrder.items.reduce((sum, i) => sum + i.price * i.quantity, 0),
            orderType: "dinein",
            createdAt: new Date().toISOString(),
          });

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

  // Fallback (agar koi aur unknown path ho)
  return (
    <div className="standalone-page">
      <p className="empty-text">Page not found.</p>
    </div>
  );
}

export default App;