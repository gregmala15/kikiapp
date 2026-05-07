import React, { useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  Platform,
} from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather, Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import Colors from "@/constants/colors";
import { useAppContext } from "@/contexts/AppContext";
import { useAuth } from "@/contexts/AuthContext";
import { getShopById, Shop } from "@/constants/seed-data";

// Rome shops ship internationally — slower estimate. London ships locally — faster.
// Stable per-shop estimate; no schema change required.
function shipEstimate(shop: Shop | undefined): string {
  if (!shop) return "Standard delivery";
  return shop.city === "Rome" ? "Ships in 5–8 days" : "Ships in 2–4 days";
}

export default function CartScreen() {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const { cart, removeFromCart, updateCartQty, cartTotal } = useAppContext();

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;

  // Bundle cart by shop so the bag mirrors how the order will actually
  // arrive: one parcel per shop, each with its own ship estimate.
  const groups = useMemo(() => {
    const map = new Map<
      string,
      { shop: Shop | undefined; items: typeof cart; subtotal: number }
    >();
    for (const item of cart) {
      const shopId = item.product.shopId;
      const existing = map.get(shopId);
      const lineTotal = item.product.price * item.quantity;
      if (existing) {
        existing.items.push(item);
        existing.subtotal += lineTotal;
      } else {
        map.set(shopId, {
          shop: getShopById(shopId),
          items: [item],
          subtotal: lineTotal,
        });
      }
    }
    return Array.from(map.entries()).map(([shopId, v]) => ({ shopId, ...v }));
  }, [cart]);

  return (
    <View style={[styles.container, { backgroundColor: Colors.background }]}>
      <View
        style={[
          styles.header,
          { paddingTop: topPad + 12, borderBottomColor: Colors.border },
        ]}
      >
        <Text style={styles.title}>My Bag</Text>
        <Pressable onPress={() => router.back()} style={styles.closeBtn}>
          <Feather name="x" size={22} color={Colors.text} />
        </Pressable>
      </View>

      {cart.length === 0 ? (
        <View style={styles.empty}>
          <Ionicons name="bag-outline" size={52} color={Colors.textTertiary} />
          <Text style={styles.emptyTitle}>Your bag is empty</Text>
          <Text style={styles.emptyDesc}>
            Discover and add pieces you love from the feed
          </Text>
          <Pressable style={styles.browseBtn} onPress={() => router.back()}>
            <Text style={styles.browseBtnText}>Browse Reliq</Text>
          </Pressable>
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 24 }}
        >
          {groups.length > 1 && (
            <View style={styles.bundleNotice}>
              <Feather name="package" size={13} color={Colors.accentDark} />
              <Text style={styles.bundleNoticeText}>
                {groups.length} shops · {groups.length} parcels, one checkout
              </Text>
            </View>
          )}

          {groups.map((group) => (
            <View key={group.shopId} style={styles.group}>
              <Pressable
                style={styles.groupHeader}
                onPress={() =>
                  group.shop && router.push(`/shop/${group.shop.id}`)
                }
                disabled={!group.shop}
              >
                {group.shop ? (
                  <Image
                    source={{ uri: group.shop.storefrontImage }}
                    style={styles.shopAvatar}
                    contentFit="cover"
                  />
                ) : (
                  <View style={[styles.shopAvatar, { backgroundColor: Colors.card }]} />
                )}
                <View style={{ flex: 1 }}>
                  <Text style={styles.shopName} numberOfLines={1}>
                    {group.shop?.name ?? "Shop"}
                  </Text>
                  <Text style={styles.shopMeta} numberOfLines={1}>
                    {shipEstimate(group.shop)}
                  </Text>
                </View>
                <Text style={styles.groupSubtotal}>
                  £{group.subtotal.toFixed(2)}
                </Text>
              </Pressable>

              {group.items.map((item, idx) => (
                <View
                  key={item.product.id}
                  style={[
                    styles.cartItem,
                    idx < group.items.length - 1 && styles.itemBorder,
                  ]}
                >
                  <Image
                    source={{ uri: item.product.imageUrl }}
                    style={styles.itemImage}
                    contentFit="cover"
                  />
                  <View style={styles.itemInfo}>
                    <Text style={styles.itemTitle} numberOfLines={2}>
                      {item.product.title}
                    </Text>
                    <Text style={styles.itemMeta}>
                      {item.product.size} · {item.product.condition}
                    </Text>
                    <Text style={styles.itemPrice}>
                      £{(item.product.price * item.quantity).toFixed(2)}
                    </Text>
                    <View style={styles.qtyRow}>
                      <Pressable
                        style={styles.qtyBtn}
                        onPress={() =>
                          updateCartQty(item.product.id, item.quantity - 1)
                        }
                      >
                        <Feather name="minus" size={14} color={Colors.text} />
                      </Pressable>
                      <Text style={styles.qty}>{item.quantity}</Text>
                      <Pressable
                        style={styles.qtyBtn}
                        onPress={() =>
                          updateCartQty(item.product.id, item.quantity + 1)
                        }
                      >
                        <Feather name="plus" size={14} color={Colors.text} />
                      </Pressable>
                    </View>
                  </View>
                  <Pressable
                    style={styles.removeBtn}
                    onPress={() => removeFromCart(item.product.id)}
                  >
                    <Feather
                      name="trash-2"
                      size={16}
                      color={Colors.textTertiary}
                    />
                  </Pressable>
                </View>
              ))}
            </View>
          ))}
        </ScrollView>
      )}

      {cart.length > 0 && (
        <View
          style={[
            styles.footer,
            { paddingBottom: bottomPad + 12, borderTopColor: Colors.border },
          ]}
        >
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.total}>£{cartTotal.toFixed(2)}</Text>
          </View>
          <Pressable
            style={styles.checkoutBtn}
            onPress={() => {
              if (!user) {
                router.push("/(auth)/login");
                return;
              }
              router.push("/checkout");
            }}
          >
            <Feather name="arrow-right" size={18} color="#fff" />
            <Text style={styles.checkoutText}>Proceed to Checkout</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingBottom: 14,
    borderBottomWidth: 1,
  },
  title: {
    fontFamily: "PlayfairDisplay_700Bold",
    fontSize: 26,
    color: Colors.text,
  },
  closeBtn: { padding: 8 },
  bundleNotice: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: Colors.accentLight,
    marginHorizontal: 16,
    marginTop: 16,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
  },
  bundleNoticeText: {
    fontFamily: "Inter_500Medium",
    fontSize: 12,
    color: Colors.accentDark,
    flex: 1,
  },
  group: {
    marginTop: 16,
    marginHorizontal: 16,
    backgroundColor: Colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: "hidden",
  },
  groupHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    backgroundColor: Colors.card,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  shopAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.card,
  },
  shopName: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 14,
    color: Colors.text,
  },
  shopMeta: {
    fontFamily: "Inter_400Regular",
    fontSize: 11,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  groupSubtotal: {
    fontFamily: "Inter_700Bold",
    fontSize: 14,
    color: Colors.text,
  },
  cartItem: {
    flexDirection: "row",
    padding: 14,
    gap: 14,
  },
  itemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  itemImage: {
    width: 80,
    height: 100,
    borderRadius: 6,
    backgroundColor: Colors.card,
  },
  itemInfo: { flex: 1, gap: 4 },
  itemTitle: {
    fontFamily: "Inter_500Medium",
    fontSize: 14,
    color: Colors.text,
    lineHeight: 20,
  },
  itemMeta: {
    fontFamily: "Inter_400Regular",
    fontSize: 12,
    color: Colors.textSecondary,
  },
  itemPrice: {
    fontFamily: "Inter_700Bold",
    fontSize: 15,
    color: Colors.text,
    marginTop: 2,
  },
  qtyRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    marginTop: 8,
  },
  qtyBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  qty: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 14,
    color: Colors.text,
    minWidth: 18,
    textAlign: "center",
  },
  removeBtn: { padding: 6, alignSelf: "flex-start" },
  empty: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 40,
    gap: 12,
    paddingTop: 60,
  },
  emptyTitle: {
    fontFamily: "PlayfairDisplay_700Bold",
    fontSize: 22,
    color: Colors.text,
    textAlign: "center",
  },
  emptyDesc: {
    fontFamily: "Inter_400Regular",
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: "center",
    lineHeight: 20,
  },
  browseBtn: {
    borderWidth: 1.5,
    borderColor: Colors.text,
    paddingHorizontal: 28,
    paddingVertical: 12,
    borderRadius: 6,
    marginTop: 8,
  },
  browseBtnText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 14,
    color: Colors.text,
  },
  footer: {
    paddingTop: 16,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    gap: 14,
    backgroundColor: Colors.background,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  totalLabel: {
    fontFamily: "Inter_400Regular",
    fontSize: 16,
    color: Colors.textSecondary,
  },
  total: {
    fontFamily: "PlayfairDisplay_700Bold",
    fontSize: 24,
    color: Colors.text,
  },
  checkoutBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    backgroundColor: Colors.text,
    paddingVertical: 16,
    borderRadius: 6,
  },
  checkoutText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 15,
    color: "#fff",
  },
});
