import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  FlatList,
  Platform,
} from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather, Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import Colors from "@/constants/colors";
import { useAppContext } from "@/contexts/AppContext";
import { useAuth } from "@/contexts/AuthContext";

export default function CartScreen() {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const { cart, removeFromCart, updateCartQty, cartTotal } = useAppContext();

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;

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

      <FlatList
        data={cart}
        keyExtractor={(item) => item.product.id}
        renderItem={({ item }) => (
          <View style={styles.cartItem}>
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
                  onPress={() => updateCartQty(item.product.id, item.quantity - 1)}
                >
                  <Feather name="minus" size={14} color={Colors.text} />
                </Pressable>
                <Text style={styles.qty}>{item.quantity}</Text>
                <Pressable
                  style={styles.qtyBtn}
                  onPress={() => updateCartQty(item.product.id, item.quantity + 1)}
                >
                  <Feather name="plus" size={14} color={Colors.text} />
                </Pressable>
              </View>
            </View>
            <Pressable
              style={styles.removeBtn}
              onPress={() => removeFromCart(item.product.id)}
            >
              <Feather name="trash-2" size={16} color={Colors.textTertiary} />
            </Pressable>
          </View>
        )}
        ItemSeparatorComponent={() => (
          <View style={{ height: 1, backgroundColor: Colors.border }} />
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons
              name="bag-outline"
              size={52}
              color={Colors.textTertiary}
            />
            <Text style={styles.emptyTitle}>Your bag is empty</Text>
            <Text style={styles.emptyDesc}>
              Discover and add pieces you love from the feed
            </Text>
            <Pressable
              style={styles.browseBtn}
              onPress={() => router.back()}
            >
              <Text style={styles.browseBtnText}>Browse KIKI</Text>
            </Pressable>
          </View>
        }
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
      />

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
  cartItem: {
    flexDirection: "row",
    padding: 16,
    gap: 14,
    backgroundColor: Colors.surface,
  },
  itemImage: {
    width: 90,
    height: 110,
    borderRadius: 8,
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
    fontSize: 16,
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
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  qty: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 15,
    color: Colors.text,
    minWidth: 20,
    textAlign: "center",
  },
  removeBtn: { padding: 8, alignSelf: "flex-start" },
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
