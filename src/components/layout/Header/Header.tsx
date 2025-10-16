import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import "./Header.css";

export default function Header() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  async function handleLogout() {
    logout(); // Clears user + localStorage inside AuthContext
    navigate("/login", { replace: true });
  }

  if (!user) return null;

  return (
    <header className="header">
      <div className="user-info">
        <span>
          {user.firstName} {user.lastName}
        </span>
        <button onClick={handleLogout}>Logout</button>
      </div>
    </header>
  );
}