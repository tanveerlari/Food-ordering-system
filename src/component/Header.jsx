import { useState } from "react";

function Header({ onLoginClick, user }) {
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

      {user ? (
        imgError || !user.photoURL ? (
          // 👇 Fallback: agar image load na ho, initials wala circle dikhao
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
  );
}

export default Header;

