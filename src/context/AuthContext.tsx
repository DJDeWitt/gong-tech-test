// src/context/AuthContext.tsx
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { getUserBySecret, type User } from "../api/firebase";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  logout: () => void;
  setUser: (user: User | null) => void;
  revalidate: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  async function validateUser() {
    setLoading(true);
    const secret = localStorage.getItem("secret");

    // No secret means no logged-in user
    if (!secret) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const validUser = await getUserBySecret(secret);

      if (validUser) {
        setUser(validUser);
        localStorage.setItem("user", JSON.stringify(validUser));
      } else {
        logout();
      }
    } catch (err) {
      console.error("Error validating user:", err);
      logout();
    } finally {
      setLoading(false);
    }
  }

  function logout() {
    console.log("Logging out user");
    localStorage.removeItem("secret");
    localStorage.removeItem("user");
    setUser(null);
  }

  // On mount: restore user from localStorage quickly, then verify with Firebase for freshness.
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.warn("Corrupt user in localStorage, clearing it.");
        logout();
      }
    }

    validateUser();
  }, []);

  const value: AuthContextType = {
    user,
    loading,
    logout,
    setUser,
    revalidate: validateUser,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
}