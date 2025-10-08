import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";

import AuthLayout from "./components/layout/AuthLayout/AuthLayout";
import GuestLayout from "./components/layout/GuestLayout/GuestLayout";

import LoginPage from "./pages/LoginPage/LoginPage";
import HierarchyPage from "./pages/HierarchyPage/HierarchyPage";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Guest routes */}
          <Route element={<GuestLayout />}>
            <Route path="/" element={<LoginPage />} />
          </Route>

          {/* Auth routes */}
          <Route element={<AuthLayout />}>
            <Route path="/hierarchy" element={<HierarchyPage />} />
          </Route>

          {/* Catch-all route */}
          <Route path="*" element={<LoginPage />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}