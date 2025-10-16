import { useEffect } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import Header from "../Header/Header";
import { useAuth } from "../../../context/AuthContext";

export default function AuthLayout() {
  console.log("AuthLayout rendered");
  const { user, setUser, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (loading) return; // Wait for validation to finish

    if (!user) {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          if (parsedUser?.token) {
            setUser(parsedUser);
            return; // Auth restored, don’t redirect
          }
        } catch (e) {
          console.error("Error parsing user from localStorage", e);
        }
      }

      // No user found or invalid — go to login
      navigate("/login", { replace: true });
    } else {
      // If user logs in and we're on /login, redirect to /users
      if (location.pathname === "/login") {
        navigate("/users", { replace: true });
      }
    }
  }, [user, loading, setUser, navigate, location.pathname]);

  // While loading or checking user, show nothing (or loading spinner)
  if (loading) return null;

  // If not authenticated after validation, show nothing (redirecting)
  if (!user) return null;

  return (
    <div className="auth-layout">
      <Header />
      <main className="auth-content">
        <Outlet />
      </main>
    </div>
  );
}