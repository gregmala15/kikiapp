import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
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
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [userShop, setUserShop] = useState<UserShop | null>(null);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    if (user) {
      loadAll(user.id);
    } else {
      setSavedProductIds([]);
      setFollowedShopIds([]);
      setFollowedUserIds([]);
      setCart([]);
      setOrders([]);
      setUserShop(null);
      setConversations([]);
      setMessages([]);
    }
  }, [user?.id]);

  async function loadAll(userId: string) {
    try {
      const [saved, shops, users, cartData, ordersData, shopData, convsData, msgsData] =
        await Promise.all([
          AsyncStorage.getItem(getKey("saved", userId)),
          AsyncStorage.getItem(getKey("follow_shops", userId)),
          AsyncStorage.getItem(getKey("follow_users", userId)),
          AsyncStorage.getItem(getKey("cart", userId)),
          AsyncStorage.getItem(getKey("orders", userId)),
          AsyncStorage.getItem(getKey("user_shop", userId)),
          AsyncStorage.getItem(getKey("conversations", userId)),
          AsyncStorage.getItem(getKey("messages", userId)),
        ]);
      if (saved) setSavedProductIds(JSON.parse(saved));
      if (shops) setFollowedShopIds(JSON.parse(shops));
      if (users) setFollowedUserIds(JSON.parse(users));
      if (cartData) setCart(JSON.parse(cartData));
      if (ordersData) setOrders(JSON.parse(ordersData));
      if (shopData) setUserShop(JSON.parse(shopData));
      if (convsData) setConversations(JSON.parse(convsData));
      if (msgsData) setMessages(JSON.parse(msgsData));
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
    const existingConv = conversations.find((c) => c.id === convId);

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
    const newMsgs = [...messages, msg];
    setMessages(newMsgs);
    await persist("messages", newMsgs);

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
      const newConvs = [...conversations, newConv];
      setConversations(newConvs);
      await persist("conversations", newConvs);
    } else {
      const newConvs = conversations.map((c) =>
        c.id === convId
          ? { ...c, lastMessage: content, lastTimestamp: msg.timestamp }
          : c
      );
      setConversations(newConvs);
      await persist("conversations", newConvs);
    }
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
