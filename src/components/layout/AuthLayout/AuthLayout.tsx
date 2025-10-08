import { Outlet } from "react-router-dom";
import Header from "../Header/Header";

export default function AuthLayout() {
  return (
    <div className="auth-layout">
      <Header />
      <main className="auth-content">
        <Outlet />
      </main>
    </div>
  );
}
