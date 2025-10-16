import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";

export default function GuestLayout() {
  const { isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && isAuthenticated) {
      navigate("/users", { replace: true });
    }
  }, [loading, isAuthenticated, navigate]);

  if (loading) return null;

  return (
    <div className="guest-layout">
      <main>
        <Outlet />
      </main>
    </div>
  );
}