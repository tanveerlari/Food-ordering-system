import { signOut } from "firebase/auth";
import { auth } from "../firebase";

function AdminDashboard({ onManageItems, onStaffMenu, user }) {
  async function handleLogout() {
    await signOut(auth);
    window.location.href = "/";
  }

  return (
    <div className="admin-dashboard">
      <button className="admin-logout-btn" onClick={handleLogout}>
        🚪 Logout
      </button>

      <div className="admin-dashboard-header">
        <span className="admin-dashboard-eyebrow">ADMIN CONSOLE</span>
        <h1>Welcome back{user?.name ? `, ${user.name.split(" ")[0]}` : ""}</h1>
      </div>

      <div className="admin-dashboard-grid">
        <button className="admin-circle-btn" onClick={onManageItems}>
          <span className="admin-circle-icon">🍽️</span>
          <span className="admin-circle-label">Manage Items</span>
        </button>

        <button className="admin-circle-btn" onClick={onStaffMenu}>
          <span className="admin-circle-icon">🧑‍🍳</span>
          <span className="admin-circle-label">Staff Menu</span>
        </button>
      </div>
    </div>
  );
}

export default AdminDashboard;