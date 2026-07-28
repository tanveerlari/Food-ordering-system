import { useState } from "react";

function Header({ onLoginClick, user, onAdminClick, onStaffClick, isAdmin }) {
  const [imgError, setImgError] = useState(false);

  const initial = user?.name
    ? user.name.charAt(0).toUpperCase()
    : user?.email
    ? user.email.charAt(0).toUpperCase()
    : "";

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
          imgError || !user.photoURL ? (
            <div className="user-avatar" title={user.email}>
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
            />
          )
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