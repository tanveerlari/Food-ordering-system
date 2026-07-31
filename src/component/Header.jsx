import { useState } from "react";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";

function Header({ onLoginClick, user, onAdminClick, onStaffClick, isAdmin }) {
  const [imgError, setImgError] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const initial = user?.name
    ? user.name.charAt(0).toUpperCase()
    : user?.email
    ? user.email.charAt(0).toUpperCase()
    : "";

  async function handleLogout() {
    await signOut(auth);
    setMenuOpen(false);
    window.location.href = "/"; // logout ke baad refresh, login page pe le jayega
  }

  return (
    <div className="header">
      <div className="header-left">
        <span className="star">🏰 FOODIE PALACE</span>
      </div>

      <div className="header-right">
        {isAdmin && (
          <>
            <button className="header-icon-btn" onClick={onAdminClick} title="Admin Panel">
              ⚙️
            </button>
            <button className="header-icon-btn" onClick={onStaffClick} title="Staff Panel">
              🧑‍🍳
            </button>
          </>
        )}

        {user ? (
          <div className="user-menu-wrap">
            {imgError || !user.photoURL ? (
              <div
                className="user-avatar"
                title={user.email}
                onClick={() => setMenuOpen((prev) => !prev)}
              >
                {initial}
              </div>
            ) : (
              <img
                src={user.photoURL}
                alt=""
                title={user.email}
                className="user-avatar-img"
                referrerPolicy="no-referrer"
                onError={() => setImgError(true)}
                onClick={() => setMenuOpen((prev) => !prev)}
              />
            )}

            {menuOpen && (
              <>
                <div className="user-menu-backdrop" onClick={() => setMenuOpen(false)} />
                <div className="user-dropdown">
                  <p className="user-dropdown-email">{user.email}</p>
                  <button className="user-dropdown-logout" onClick={handleLogout}>
                    🚪 Logout
                  </button>
                </div>
              </>
            )}
          </div>
        ) : (
          <button className="login-btn" onClick={onLoginClick}>
            Login
          </button>
        )}
      </div>
    </div>
  );
}

export default Header;