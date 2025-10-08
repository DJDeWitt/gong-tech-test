import { useState } from "react";
import { login } from "../../api/firebase";
import { useNavigate } from "react-router-dom";
import "./LoginPage.css";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    try {
      const result = await login(email, password);
      console.log('result: ', result);
      if (result.success && result.user) {
        console.log('login successful, storing user and secret in localStorage');
        localStorage.setItem("user", JSON.stringify(result.user));
        localStorage.setItem("secret", result.secret!);
        console.log('navigating to /hierarchy');
        navigate("/hierarchy");
      } else {
        setError(result.message || "Login failed");
      }
    } catch {
      setError("Something went wrong");
    }
  }

  return (
    <div className="login-container">
      <h1 className="login-title">Please login</h1>
      <form className="login-box" onSubmit={handleSubmit}>
        <div className="login-field">
          <label className="login-label">email address:</label>
          <input
            className="login-input"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="login-field">
          <label className="login-label">password:</label>
          <input
            className="login-input"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {error && <p className="error">{error}</p>}
        <button type="submit" className="login-button">Login</button>
      </form>
    </div>
  );
}