import { encode } from "../utils/encode";

const BASE_URL = "https://gongfetest.firebaseio.com";

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  title: string;
  managerId?: number | null;
  username: string;
  email: string;
  password: string;
  photo?: string;
}

export interface LoginResponse {
  success: boolean;
  user?: User;
  secret?: string;
  message?: string;
}

export async function getUserBySecret(secret: string): Promise<User | null> {
  try {
    console.log('getUserBySecret called with secret:', secret);
    const secretRes = await fetch(`${BASE_URL}/secrets/${secret}.json`);
    const userId = await secretRes.json();
    console.log('userId from secret:', userId);

    if (!userId) {
      console.warn("Invalid secret or user not found");
      return null;
    }

    // const userRes = await fetch(`${BASE_URL}/users/${userId}.json`);
    // const user = await userRes.json();

    const usersRes = await fetch(`${BASE_URL}/users.json`);
    if (!usersRes.ok) {
      throw new Error("Failed to fetch users");
    }

    const users: any[] = await usersRes.json();
    const user = Array.isArray(users)
      ? users.find((u) => u?.id === userId)
      : null;

    if (!user) {
      console.warn("User data not found for ID:", userId);
      return null;
    }

    return user;
  } catch (error) {
    console.error("Error fetching user by secret:", error);
    return null;
  }
}

export async function login(email: string, password: string): Promise<LoginResponse> {
  try {
    // 1) Encode credentials to get the secret
    const secret = encode(email, password);
    console.log('Encoded secret:', secret);

    // 2) Lookup userId from secrets
    const secretRes = await fetch(`${BASE_URL}/secrets/${encodeURIComponent(secret)}.json`);
    console.log('SecretRes:', secretRes);
    if (!secretRes.ok) return { success: false, message: "Network error while checking credentials" };

    const userId = await secretRes.json();
    console.log('secretRes.json():', userId);
    console.log('userId from secret:', userId);
    if (!userId) return { success: false, message: "Invalid email or password" };

    // 3) Fetch full users list and find the user by id
    const usersRes = await fetch(`${BASE_URL}/users.json`);
    if (!usersRes.ok) return { success: false, message: "Failed to fetch users list" };

    const users: any[] = await usersRes.json();
    const user = users.find(u => u?.id == userId); // == to tolerate string/number
    if (!user) return { success: false, message: "User not found in users list" };

    // 4) Success
    return { success: true, user, secret };
  } catch (err) {
    console.error("login error:", err);
    return { success: false, message: "Unexpected error during login" };
  }
}

export async function getUsers(): Promise<User[]> {
  const res = await fetch(`${BASE_URL}/users.json`);
  if (!res.ok) throw new Error("Failed to fetch users");
  return await res.json();
}

export interface UserNode extends User {
  reports: UserNode[];
}

export function buildUsersTree(users: User[]): UserNode[] {
  const map = new Map<number, UserNode>();
  users.forEach((u) => map.set(u.id, { ...u, reports: [] }));

  const roots: UserNode[] = [];
  for (const user of map.values()) {
    if (user.managerId != null) {
      const manager = map.get(user.managerId);
      if (manager) manager.reports.push(user);
    } else {
      roots.push(user);
    }
  }
  return roots;
}
