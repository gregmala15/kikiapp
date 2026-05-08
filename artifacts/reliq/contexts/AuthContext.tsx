import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SOPHIE_STORAGE_PAIRS, VAULT_STORAGE_PAIRS } from "@/constants/demo-seed";

export type AccountType = "user" | "shop";

export interface UserProfile {
  id: string;
  username: string;
  email: string;
  accountType: AccountType;
  bio?: string;
  avatar?: string;
  shopId?: string;
}

// ─── Investor demo accounts ──────────────────────────────────────────────────
// Hardcoded so they work on a fresh device with no prior registration.
// Seeded with rich pre-populated state so every screen shows real content.

const DEMO_ACCOUNTS: Record<string, UserProfile & { password: string }> = {
  "demo-sophie": {
    id: "demo-sophie",
    username: "sophie_chen",
    email: "sophie@demo.reliq",
    accountType: "user",
    bio: "Vintage hunter based in London. Obsessed with 60s mod and Italian archive.",
    password: "reliq2024",
  },
  "demo-vault": {
    id: "demo-vault",
    username: "The Vault London",
    email: "vault@demo.reliq",
    accountType: "shop",
    bio: "Curated rare vintage from the 60s–90s. Portobello Road.",
    password: "reliq2024",
  },
};

const DEMO_SEED_MAP: Record<string, Array<[string, string]>> = {
  "demo-sophie": SOPHIE_STORAGE_PAIRS,
  "demo-vault": VAULT_STORAGE_PAIRS,
};

async function seedDemoStateIfNeeded(userId: string) {
  const pairs = DEMO_SEED_MAP[userId];
  if (!pairs) return;
  const flag = `kiki_demo_seeded_${userId}`;
  const already = await AsyncStorage.getItem(flag);
  if (already) return;
  await AsyncStorage.multiSet(pairs);
  await AsyncStorage.setItem(flag, "1");
}

interface AuthContextValue {
  user: UserProfile | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (
    username: string,
    email: string,
    password: string,
    accountType: AccountType
  ) => Promise<UserProfile>;
  logout: () => Promise<void>;
  updateUser: (updates: Partial<UserProfile>) => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const STORAGE_KEY = "kiki_auth_user";
const ACCOUNTS_KEY = "kiki_accounts";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadUser();
  }, []);

  async function loadUser() {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        setUser(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Failed to load user:", e);
    } finally {
      setIsLoading(false);
    }
  }

  async function getAccounts(): Promise<Record<string, UserProfile & { password: string }>> {
    const stored = await AsyncStorage.getItem(ACCOUNTS_KEY);
    return stored ? JSON.parse(stored) : {};
  }

  async function saveAccounts(accounts: Record<string, UserProfile & { password: string }>) {
    await AsyncStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
  }

  async function login(email: string, password: string) {
    // Check demo accounts before AsyncStorage so they work on any fresh device.
    const demoAccount = Object.values(DEMO_ACCOUNTS).find(
      (a) => a.email.toLowerCase() === email.toLowerCase()
    );
    if (demoAccount) {
      if (demoAccount.password !== password) throw new Error("Incorrect password.");
      const { password: _, ...profile } = demoAccount;
      await seedDemoStateIfNeeded(profile.id);
      setUser(profile);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
      return;
    }

    const accounts = await getAccounts();
    const account = Object.values(accounts).find(
      (a) => a.email.toLowerCase() === email.toLowerCase()
    );
    if (!account) throw new Error("No account found with that email.");
    if (account.password !== password) throw new Error("Incorrect password.");
    const { password: _, ...profile } = account;
    setUser(profile);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
  }

  async function register(
    username: string,
    email: string,
    password: string,
    accountType: AccountType
  ): Promise<UserProfile> {
    const accounts = await getAccounts();
    const exists = Object.values(accounts).find(
      (a) => a.email.toLowerCase() === email.toLowerCase()
    );
    if (exists) throw new Error("An account with this email already exists.");
    const id = `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const profile: UserProfile = { id, username, email, accountType };
    accounts[id] = { ...profile, password };
    await saveAccounts(accounts);
    setUser(profile);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
    return profile;
  }

  async function logout() {
    setUser(null);
    await AsyncStorage.removeItem(STORAGE_KEY);
  }

  async function updateUser(updates: Partial<UserProfile>) {
    if (!user) return;
    const updated = { ...user, ...updates };
    setUser(updated);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    const accounts = await getAccounts();
    if (accounts[user.id]) {
      accounts[user.id] = { ...accounts[user.id], ...updates };
      await saveAccounts(accounts);
    }
  }

  return (
    <AuthContext.Provider
      value={{ user, isLoading, login, register, logout, updateUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
