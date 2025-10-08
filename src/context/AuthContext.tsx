// src/context/AuthContext.tsx
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { getUserBySecret } from "../api/firebase";
import { type User } from "../api/firebase";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  logout: () => void;
  setUser: (user: User | null) => void;
  revalidate: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  async function validateUser() {
    const secret = localStorage.getItem("secret");
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
        // secret no longer valid — remove and log out
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
    localStorage.removeItem("secret");
    localStorage.removeItem("user");
    setUser(null);
  }

  // Run validation on mount
  useEffect(() => {
    validateUser();
  }, []);

  const value: AuthContextType = {
    user,
    loading,
    logout,
    setUser,
    revalidate: validateUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
}
