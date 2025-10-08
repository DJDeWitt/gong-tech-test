// # Optional: export custom hooks like `useAuth` if you separate logic

import { useState } from "react";
import { login, type User } from "../api/firebase";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);

  async function handleLogin(username: string, password: string) {
    const result = await login(username, password);
    if (result.success && result.user) {
      setUser(result.user);
    } else {
      alert(result.message);
    }
  }

  return { user, handleLogin };
}

// // Example hierarchy fetching
// async function loadHierarchy() {
//   const users = await getUsers();
//   const hierarchy = buildUserHierarchy(users);
//   console.log(hierarchy);
// }