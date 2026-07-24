function Header({ onLoginClick, user }) {
    const initial = user ? user.email.charAt(0).toUpperCase() : "";
  return (
    <div className="header">
      <div className="header-left">
        <span className="star">🏰 FOODIE PALACE</span>
      </div>

      {user ? (
        <div className="user-avatar" title={user.email}>
          {initial}
        </div>
      ) : (
        <button className="login-btn" onClick={onLoginClick}>
          Login
        </button>
      )}
    </div>
  );
}

export default Header;