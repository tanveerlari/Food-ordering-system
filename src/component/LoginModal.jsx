import { useState } from "react";

function LoginModal({ onClose, onLoginSuccess }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleLogin() {
    if (!email || !password) {
      alert("Please enter email and password");
      return;
    }
    onLoginSuccess(email);
  }

  return (
    <div className="login-overlay">
      <div className="login-box">
        <div className="login-topbar">
          <h2>Login</h2>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        <input
          className="login-input"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="login-input"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="login-submit-btn" onClick={handleLogin}>
          Login
        </button>

        <p className="signup-text">
          Don't have an account? <span className="signup-link">Sign up</span>
        </p>
      </div>
    </div>
  );
}

export default LoginModal;