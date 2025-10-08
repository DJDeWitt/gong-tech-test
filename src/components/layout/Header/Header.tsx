// src/components/Header/Header.tsx
import React from "react";
import { useNavigate } from "react-router-dom";
import "./Header.css";

export default function Header() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "null");

  function handleLogout() {
    localStorage.removeItem("user");
    localStorage.removeItem("secret");
    navigate("/");
  }

  return (
    <header className="header">
      {user && (
        <div className="user-info">
          <span>
            {user.firstName} {user.lastName}
          </span>
          <button onClick={handleLogout}>Logout</button>
        </div>
      )}
    </header>
  );
}
