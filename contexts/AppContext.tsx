import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
  ReactNode,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuth } from "./AuthContext";
import { Product, Shop } from "@/constants/seed-data";

interface CartItem {
  product: Product;
  quantity: number;
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  total: number;
  status: "created" | "label_created" | "shipped" | "delivered";
  createdAt: string;
  shopId: string;
  shopName: string;
  address: string;
}

export type ParticipantType = "user" | "shop";

export interface Message {
  id: string;
  fromId: string;
  fromName: string;
  toId: string;
  conversationId: string;
  content: string;
  productId?: string;
  timestamp: string;
  isProductRecommendation?: boolean;
  senderType: ParticipantType;
  receiverType: ParticipantType;
}

export interface Conversation {
  id: string;
  participantIds: string[];
  participantNames: string[];
  participantTypes: ParticipantType[];
  shopId?: string;
  lastMessage?: string;
  lastTimestamp?: string;
  productId?: string;
}

// StyleInfluence — one entry in the user's "Style Blend":
// the current user (userId) is including products that influenceUserId has
// liked/saved/recommended into their own For You feed.
//
// `level` is a coarse, fashion-friendly setting (Light → Heavy) that the
// For You scorer turns into a numeric BOOST. There is no fixed "share"
// of the feed — the user's own taste is always the base of the feed and
// influences only nudge specific pieces upward. See app/(tabs)/index.tsx
// for the exact scoring formula and the rationale behind the constants.
//
// "Off" is represented by the absence of a row, NOT by a stored level.
// This keeps the data model trivially correct: if it's in the array, it
// influences the feed; if it isn't, it doesn't.
export type InfluenceLevel = "light" | "medium" | "strong" | "heavy";

export const INFLUENCE_LEVELS: InfluenceLevel[] = [
  "light",
  "medium",
  "strong",
  "heavy",
];

// Numeric boosts used by the For You feed scorer. Light = 1 means even
// four Light influences (sum 4) cannot beat a single self-saved item
// (which scores MY_TASTE_BOOST = 8). One Heavy = 4 still nudges items up
// noticeably without overpowering the user's own taste.
export const INFLUENCE_LEVEL_WEIGHTS: Record<InfluenceLevel, number> = {
  light: 1,
  medium: 2,
  strong: 3,
  heavy: 4,
};

// Default level applied when toggling a user INTO the blend (e.g. via the
// generic toggleStyleInfluence helper). Medium = a sensible middle ground
// for "I trust this person's taste, surface their picks sometimes".
export const DEFAULT_INFLUENCE_LEVEL: InfluenceLevel = "medium";

export interface StyleInfluence {
  userId: string;
  influenceUserId: string;
  level: InfluenceLevel;
}

export interface UserShop {
  id: string;
  ownerId: string;
  name: string;
  type: "independent" | "vintage";
  description: string;
  storefrontImage?: string;
  socialHandle: string;
  email: string;
  isPhysical: boolean;
  address?: string;
  city: string;
  products: Product[];
  orders: Order[];
}

interface AppContextValue {
  savedProductIds: string[];
  toggleSaved: (productId: string) => void;
  isSaved: (productId: string) => boolean;
  followedShopIds: string[];
  toggleFollowShop: (shopId: string) => void;
  isFollowingShop: (shopId: string) => boolean;
  followedUserIds: string[];
  toggleFollowUser: (userId: string) => void;
  isFollowingUser: (userId: string) => boolean;
  styleInfluences: StyleInfluence[];
  // Adds the user at DEFAULT_INFLUENCE_LEVEL when off; removes when on.
  // Kept as a convenience for older callers — new code should prefer
  // setStyleInfluenceLevel which expresses the user's intent more clearly.
  toggleStyleInfluence: (userId: string) => void;
  isStyleInfluence: (userId: string) => boolean;
  // Returns "off" when the user is not in the current account's blend,
  // otherwise the InfluenceLevel that has been assigned to them.
  getStyleInfluenceLevel: (userId: string) => InfluenceLevel | "off";
  // Sets a user's influence level. Passing "off" removes them from the
  // blend; any InfluenceLevel either inserts a new row or updates the
  // existing row in place. There is no clamping/headroom logic — levels
  // are independent boosts, not a percentage allocation.
  setStyleInfluenceLevel: (
    userId: string,
    level: InfluenceLevel | "off",
  ) => void;
  cart: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateCartQty: (productId: string, qty: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartTotal: number;
  orders: Order[];
  placeOrder: (address: string) => Promise<Order>;
  userShop: UserShop | null;
  createShop: (shopData: Omit<UserShop, "id" | "ownerId" | "products" | "orders">) => Promise<void>;
  addProduct: (product: Omit<Product, "id">) => Promise<void>;
  updateProduct: (productId: string, updates: Partial<Product>) => Promise<void>;
  deleteProduct: (productId: string) => Promise<void>;
  updateOrderStatus: (orderId: string, status: Order["status"]) => Promise<void>;
  conversations: Conversation[];
  messages: Message[];
  sendMessage: (params: {
    toId: string;
    toName: string;
    toType?: ParticipantType;
    content: string;
    shopId?: string;
    productId?: string;
    isProductRecommendation?: boolean;
  }) => Promise<string>;
  getConversationMessages: (conversationId: string) => Message[];
  getOrComputeConvId: (otherId: string) => string;
}

const AppContext = createContext<AppContextValue | null>(null);

function getKey(base: string, userId: string) {
  return `kiki_${base}_${userId}`;
}

export function AppProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [savedProductIds, setSavedProductIds] = useState<string[]>([]);
  const [followedShopIds, setFollowedShopIds] = useState<string[]>([]);
  const [followedUserIds, setFollowedUserIds] = useState<string[]>([]);
  const [styleInfluences, setStyleInfluences] = useState<StyleInfluence[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [userShop, setUserShop] = useState<UserShop | null>(null);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);

  // Refs are the source of truth for messages/conversations so that successive
  // sendMessage calls in the same render (e.g. recommending to multiple
  // friends) don't read stale closure values and overwrite each other.
  const messagesRef = useRef<Message[]>([]);
  const conversationsRef = useRef<Conversation[]>([]);

  function commitMessages(next: Message[]) {
    messagesRef.current = next;
    setMessages(next);
  }

  function commitConversations(next: Conversation[]) {
    conversationsRef.current = next;
    setConversations(next);
  }

  useEffect(() => {
    if (user) {
      loadAll(user.id);
    } else {
      setSavedProductIds([]);
      setFollowedShopIds([]);
      setFollowedUserIds([]);
      setStyleInfluences([]);
      setCart([]);
      setOrders([]);
      setUserShop(null);
      commitConversations([]);
      commitMessages([]);
    }
  }, [user?.id]);

  async function loadAll(userId: string) {
    try {
      const [saved, shops, users, influences, cartData, ordersData, shopData, convsData, msgsData] =
        await Promise.all([
          AsyncStorage.getItem(getKey("saved", userId)),
          AsyncStorage.getItem(getKey("follow_shops", userId)),
          AsyncStorage.getItem(getKey("follow_users", userId)),
          AsyncStorage.getItem(getKey("style_influences", userId)),
          AsyncStorage.getItem(getKey("cart", userId)),
          AsyncStorage.getItem(getKey("orders", userId)),
          AsyncStorage.getItem(getKey("user_shop", userId)),
          AsyncStorage.getItem(getKey("conversations", userId)),
          AsyncStorage.getItem(getKey("messages", userId)),
        ]);
      // Always overwrite state with the loaded value (or a default when the
      // key is missing). This prevents cross-account contamination when
      // switching users — without this, a missing key would leave the
      // previous user's state in memory.
      setSavedProductIds(saved ? JSON.parse(saved) : []);
      setFollowedShopIds(shops ? JSON.parse(shops) : []);
      setFollowedUserIds(users ? JSON.parse(users) : []);
      // Normalize on load. Two shapes can exist in storage:
      //   - NEW: { userId, influenceUserId, level: InfluenceLevel }
      //   - LEGACY: { userId, influenceUserId, weight: number (0-100) }
      // Legacy rows are migrated to the closest matching level so users
      // who tested an earlier build don't lose their blend. Anything that
      // can't be made sense of is silently dropped.
      const rawInfluences: unknown[] = influences
        ? (JSON.parse(influences) as unknown[])
        : [];
      // Dedup map keyed by `${userId}__${influenceUserId}` so a single
      // (owner, influencer) pair can never appear twice in the loaded
      // state. If the persisted blob ever contains duplicates (legacy
      // bug, hand-edited storage, etc.) the LAST entry wins — and we
      // prefer the new-shape row over a legacy weight row when both
      // exist for the same pair, since the new shape is more precise.
      const byPair = new Map<
        string,
        { row: StyleInfluence; isNewShape: boolean }
      >();
      for (const entry of rawInfluences) {
        if (
          !entry ||
          typeof (entry as { userId?: unknown }).userId !== "string" ||
          typeof (entry as { influenceUserId?: unknown }).influenceUserId !==
            "string"
        ) {
          continue;
        }
        const e = entry as {
          userId: string;
          influenceUserId: string;
          level?: unknown;
          weight?: unknown;
        };
        const key = `${e.userId}__${e.influenceUserId}`;
        let parsed: { row: StyleInfluence; isNewShape: boolean } | null = null;
        // Prefer the new shape if present and valid.
        if (
          typeof e.level === "string" &&
          (INFLUENCE_LEVELS as string[]).includes(e.level)
        ) {
          parsed = {
            row: {
              userId: e.userId,
              influenceUserId: e.influenceUserId,
              level: e.level as InfluenceLevel,
            },
            isNewShape: true,
          };
        } else if (typeof e.weight === "number") {
          // Fall back to the legacy weight → level bucket mapping.
          if (e.weight <= 0) continue; // was effectively "off" — drop
          const w = e.weight;
          const level: InfluenceLevel =
            w <= 20 ? "light" : w <= 40 ? "medium" : w <= 60 ? "strong" : "heavy";
          parsed = {
            row: {
              userId: e.userId,
              influenceUserId: e.influenceUserId,
              level,
            },
            isNewShape: false,
          };
        }
        if (!parsed) continue;
        const existing = byPair.get(key);
        // New-shape entries always beat legacy entries for the same pair;
        // among same-shape entries the later occurrence wins. This means
        // the scorer can never accidentally double-count a duplicate row.
        if (
          !existing ||
          (parsed.isNewShape && !existing.isNewShape) ||
          parsed.isNewShape === existing.isNewShape
        ) {
          byPair.set(key, parsed);
        }
      }
      setStyleInfluences(Array.from(byPair.values()).map((v) => v.row));
      setCart(cartData ? JSON.parse(cartData) : []);
      setOrders(ordersData ? JSON.parse(ordersData) : []);
      setUserShop(shopData ? JSON.parse(shopData) : null);
      commitConversations(convsData ? JSON.parse(convsData) : []);
      commitMessages(msgsData ? JSON.parse(msgsData) : []);
    } catch (e) {
      console.error("Failed to load app data:", e);
    }
  }

  async function persist(key: string, value: unknown) {
    if (!user) return;
    await AsyncStorage.setItem(getKey(key, user.id), JSON.stringify(value));
  }

  function toggleSaved(productId: string) {
    setSavedProductIds((prev) => {
      const next = prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId];
      persist("saved", next);
      return next;
    });
  }

  function isSaved(productId: string) {
    return savedProductIds.includes(productId);
  }

  function toggleFollowShop(shopId: string) {
    setFollowedShopIds((prev) => {
      const next = prev.includes(shopId)
        ? prev.filter((id) => id !== shopId)
        : [...prev, shopId];
      persist("follow_shops", next);
      return next;
    });
  }

  function isFollowingShop(shopId: string) {
    return followedShopIds.includes(shopId);
  }

  function toggleFollowUser(userId: string) {
    setFollowedUserIds((prev) => {
      const next = prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId];
      persist("follow_users", next);
      return next;
    });
  }

  function isFollowingUser(userId: string) {
    return followedUserIds.includes(userId);
  }

  // ---------------------------------------------------------------------
  // STYLE BLEND — level management
  // ---------------------------------------------------------------------
  // The model is intentionally simple: each (userId, influenceUserId) row
  // either exists (with one of four levels) or it doesn't (= "off"). There
  // is no percentage allocation, no headroom, no totals — adding more
  // influences cannot "use up" the user's feed, because levels are boosts
  // applied per-product on top of the user's own taste signal.

  function isStyleInfluence(targetUserId: string) {
    if (!user) return false;
    // Defensive filter on userId — guards against any stale/corrupt entries
    // that don't belong to the current account leaking into the UI.
    return styleInfluences.some(
      (i) => i.userId === user.id && i.influenceUserId === targetUserId,
    );
  }

  function getStyleInfluenceLevel(
    targetUserId: string,
  ): InfluenceLevel | "off" {
    if (!user) return "off";
    const found = styleInfluences.find(
      (i) => i.userId === user.id && i.influenceUserId === targetUserId,
    );
    return found?.level ?? "off";
  }

  // Upsert / remove an influence row. "off" is the only value that
  // removes; any InfluenceLevel either inserts or replaces in place.
  function setStyleInfluenceLevel(
    targetUserId: string,
    next: InfluenceLevel | "off",
  ): void {
    if (!user) return;
    if (targetUserId === user.id) return; // can't influence yourself
    setStyleInfluences((prev) => {
      const idx = prev.findIndex(
        (i) => i.userId === user.id && i.influenceUserId === targetUserId,
      );
      let result: StyleInfluence[];
      if (next === "off") {
        if (idx === -1) return prev; // already off — no-op, no re-render
        result = prev.filter((_, i) => i !== idx);
      } else if (idx === -1) {
        // Insert.
        result = [
          ...prev,
          { userId: user.id, influenceUserId: targetUserId, level: next },
        ];
      } else if (prev[idx].level === next) {
        return prev; // unchanged — no-op
      } else {
        // Replace level in place, preserving order so the management
        // screen doesn't jump rows around as the user adjusts levels.
        result = prev.map((i, ix) => (ix === idx ? { ...i, level: next } : i));
      }
      persist("style_influences", result);
      return result;
    });
  }

  // Convenience: adds at DEFAULT_INFLUENCE_LEVEL when off, removes when on.
  // Kept so existing call sites (e.g. legacy switches) keep working.
  function toggleStyleInfluence(targetUserId: string) {
    const current = getStyleInfluenceLevel(targetUserId);
    setStyleInfluenceLevel(
      targetUserId,
      current === "off" ? DEFAULT_INFLUENCE_LEVEL : "off",
    );
  }

  function addToCart(product: Product) {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      const next = existing
        ? prev.map((item) =>
            item.product.id === product.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          )
        : [...prev, { product, quantity: 1 }];
      persist("cart", next);
      return next;
    });
  }

  function removeFromCart(productId: string) {
    setCart((prev) => {
      const next = prev.filter((item) => item.product.id !== productId);
      persist("cart", next);
      return next;
    });
  }

  function updateCartQty(productId: string, qty: number) {
    if (qty <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) => {
      const next = prev.map((item) =>
        item.product.id === productId ? { ...item, quantity: qty } : item
      );
      persist("cart", next);
      return next;
    });
  }

  function clearCart() {
    setCart([]);
    persist("cart", []);
  }

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  async function placeOrder(address: string): Promise<Order> {
    if (!user) throw new Error("Not logged in");
    const firstItem = cart[0];
    const shopId = firstItem?.product.shopId ?? "unknown";
    const order: Order = {
      id: `order-${Date.now()}`,
      userId: user.id,
      items: [...cart],
      total: cartTotal,
      status: "created",
      createdAt: new Date().toISOString(),
      shopId,
      shopName: firstItem?.product.shopId ?? "Shop",
      address,
    };
    const newOrders = [order, ...orders];
    setOrders(newOrders);
    await persist("orders", newOrders);
    clearCart();
    return order;
  }

  async function createShop(
    shopData: Omit<UserShop, "id" | "ownerId" | "products" | "orders">
  ) {
    if (!user) return;
    const shop: UserShop = {
      ...shopData,
      id: `user-shop-${Date.now()}`,
      ownerId: user.id,
      products: [],
      orders: [],
    };
    setUserShop(shop);
    await persist("user_shop", shop);
  }

  async function addProduct(product: Omit<Product, "id">) {
    if (!userShop) return;
    const newProduct: Product = {
      ...product,
      id: `prod-user-${Date.now()}`,
    };
    const updated = {
      ...userShop,
      products: [...userShop.products, newProduct],
    };
    setUserShop(updated);
    await persist("user_shop", updated);
  }

  async function updateProduct(productId: string, updates: Partial<Product>) {
    if (!userShop) return;
    const updated = {
      ...userShop,
      products: userShop.products.map((p) =>
        p.id === productId ? { ...p, ...updates } : p
      ),
    };
    setUserShop(updated);
    await persist("user_shop", updated);
  }

  async function deleteProduct(productId: string) {
    if (!userShop) return;
    const updated = {
      ...userShop,
      products: userShop.products.filter((p) => p.id !== productId),
    };
    setUserShop(updated);
    await persist("user_shop", updated);
  }

  async function updateOrderStatus(orderId: string, status: Order["status"]) {
    const updateInList = (list: Order[]) =>
      list.map((o) => (o.id === orderId ? { ...o, status } : o));
    const newOrders = updateInList(orders);
    setOrders(newOrders);
    await persist("orders", newOrders);
    if (userShop) {
      const updatedShop = {
        ...userShop,
        orders: updateInList(userShop.orders),
      };
      setUserShop(updatedShop);
      await persist("user_shop", updatedShop);
    }
  }

  function getOrComputeConvId(otherId: string): string {
    if (!user) return "";
    return [user.id, otherId].sort().join("_");
  }

  async function sendMessage({
    toId,
    toName,
    toType = "user",
    content,
    shopId,
    productId,
    isProductRecommendation,
  }: {
    toId: string;
    toName: string;
    toType?: ParticipantType;
    content: string;
    shopId?: string;
    productId?: string;
    isProductRecommendation?: boolean;
  }): Promise<string> {
    if (!user) return "";
    const senderType: ParticipantType = userShop ? "shop" : "user";
    const convId = [user.id, toId].sort().join("_");
    const existingConv = conversationsRef.current.find((c) => c.id === convId);

    // Rule: shops can only reply, not initiate.
    if (senderType === "shop" && !existingConv) {
      return "";
    }

    // Receiver type is whoever is on the other side, regardless of whether a
    // shop context (shopId) is attached to the conversation.
    const receiverType: ParticipantType = toType;

    const msg: Message = {
      id: `msg-${Date.now()}`,
      fromId: user.id,
      fromName: user.username,
      toId,
      conversationId: convId,
      content,
      productId,
      isProductRecommendation,
      senderType,
      receiverType,
      timestamp: new Date().toISOString(),
    };
    // Source of truth is the ref — synchronous so concurrent sendMessage
    // calls (e.g. recommending to multiple friends back-to-back) all observe
    // the latest state instead of a stale closure copy.
    const newMsgs = [...messagesRef.current, msg];
    commitMessages(newMsgs);

    let newConvs: Conversation[];
    if (!existingConv) {
      const otherType: ParticipantType = receiverType;
      const newConv: Conversation = {
        id: convId,
        participantIds: [user.id, toId],
        participantNames: [user.username, toName],
        participantTypes: [senderType, otherType],
        shopId,
        lastMessage: content,
        lastTimestamp: msg.timestamp,
        productId,
      };
      newConvs = [...conversationsRef.current, newConv];
    } else {
      newConvs = conversationsRef.current.map((c) =>
        c.id === convId
          ? { ...c, lastMessage: content, lastTimestamp: msg.timestamp }
          : c,
      );
    }
    commitConversations(newConvs);

    await Promise.all([
      persist("messages", newMsgs),
      persist("conversations", newConvs),
    ]);
    return convId;
  }

  function getConversationMessages(conversationId: string): Message[] {
    return messages
      .filter((m) => m.conversationId === conversationId)
      .sort(
        (a, b) =>
          new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
      );
  }

  return (
    <AppContext.Provider
      value={{
        savedProductIds,
        toggleSaved,
        isSaved,
        followedShopIds,
        toggleFollowShop,
        isFollowingShop,
        followedUserIds,
        toggleFollowUser,
        isFollowingUser,
        styleInfluences,
        toggleStyleInfluence,
        isStyleInfluence,
        getStyleInfluenceLevel,
        setStyleInfluenceLevel,
        cart,
        addToCart,
        removeFromCart,
        updateCartQty,
        clearCart,
        cartCount,
        cartTotal,
        orders,
        placeOrder,
        userShop,
        createShop,
        addProduct,
        updateProduct,
        deleteProduct,
        updateOrderStatus,
        conversations,
        messages,
        sendMessage,
        getConversationMessages,
        getOrComputeConvId,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useAppContext must be used within AppProvider");
  return ctx;
}
