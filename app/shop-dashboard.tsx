import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  FlatList,
  Alert,
  Platform,
} from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather, Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import Colors from "@/constants/colors";
import { useAppContext, Order } from "@/contexts/AppContext";

const STATUS_ORDER: Order["status"][] = [
  "created",
  "label_created",
  "shipped",
  "delivered",
];

const STATUS_CONFIG: Record<
  Order["status"],
  { color: string; label: string; next?: Order["status"]; nextLabel?: string }
> = {
  created: {
    color: Colors.textSecondary,
    label: "Created",
    next: "label_created",
    nextLabel: "Mark Label Created",
  },
  label_created: {
    color: Colors.accent,
    label: "Label Created",
    next: "shipped",
    nextLabel: "Mark Shipped",
  },
  shipped: {
    color: "#2196F3",
    label: "Shipped",
    next: "delivered",
    nextLabel: "Mark Delivered",
  },
  delivered: { color: Colors.success, label: "Delivered" },
};

export default function ShopDashboardScreen() {
  const insets = useSafeAreaInsets();
  const { userShop, orders, updateOrderStatus, deleteProduct } = useAppContext();
  const [tab, setTab] = useState<"products" | "orders">("products");

  const topPad = Platform.OS === "web" ? 67 : insets.top;

  if (!userShop) {
    return (
      <View
        style={[
          styles.container,
          {
            paddingTop: topPad + 12,
            backgroundColor: Colors.background,
          },
        ]}
      >
        <View style={styles.noShop}>
          <Ionicons name="storefront-outline" size={52} color={Colors.textTertiary} />
          <Text style={styles.noShopTitle}>No shop yet</Text>
          <Text style={styles.noShopDesc}>
            Create your shop profile to start selling on KIKI
          </Text>
          <Pressable
            style={styles.createBtn}
            onPress={() => router.push("/shop-setup")}
          >
            <Text style={styles.createBtnText}>Create Shop</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  function handleAdvanceStatus(orderId: string, next: Order["status"]) {
    Alert.alert(
      "Update status",
      `Mark this order as ${next.replace("_", " ")}?`,
      [
        { text: "Cancel", style: "cancel" },
        { text: "Update", onPress: () => updateOrderStatus(orderId, next) },
      ]
    );
  }

  function handleDeleteProduct(productId: string, productTitle: string) {
    Alert.alert(
      "Remove product",
      `Remove "${productTitle}" from your rack?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          style: "destructive",
          onPress: () => deleteProduct(productId),
        },
      ]
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: Colors.background }]}>
      <View
        style={[
          styles.header,
          { paddingTop: topPad + 12, borderBottomColor: Colors.border },
        ]}
      >
        <Pressable style={styles.backBtn} onPress={() => router.back()}>
          <Feather name="arrow-left" size={22} color={Colors.text} />
        </Pressable>
        <Text style={styles.title}>{userShop.name}</Text>
        <Pressable
          style={styles.editBtn}
          onPress={() => router.push("/shop-setup")}
        >
          <Feather name="edit-2" size={18} color={Colors.text} />
        </Pressable>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.stat}>
          <Text style={styles.statNumber}>{userShop.products.length}</Text>
          <Text style={styles.statLabel}>Products</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.stat}>
          <Text style={styles.statNumber}>{orders.length}</Text>
          <Text style={styles.statLabel}>Orders</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.stat}>
          <Text style={styles.statNumber}>
            £
            {orders
              .reduce((s, o) => s + o.total, 0)
              .toFixed(0)}
          </Text>
          <Text style={styles.statLabel}>Revenue</Text>
        </View>
      </View>

      <View style={styles.tabBar}>
        <Pressable
          style={[styles.tabBtn, tab === "products" && styles.tabBtnActive]}
          onPress={() => setTab("products")}
        >
          <Text
            style={[styles.tabText, tab === "products" && styles.tabTextActive]}
          >
            Products ({userShop.products.length})
          </Text>
        </Pressable>
        <Pressable
          style={[styles.tabBtn, tab === "orders" && styles.tabBtnActive]}
          onPress={() => setTab("orders")}
        >
          <Text
            style={[styles.tabText, tab === "orders" && styles.tabTextActive]}
          >
            Orders ({orders.length})
          </Text>
        </Pressable>
      </View>

      {tab === "products" ? (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            styles.content,
            {
              paddingBottom:
                Platform.OS === "web" ? 34 : insets.bottom + 24,
            },
          ]}
        >
          <Pressable
            style={styles.addProductBtn}
            onPress={() => router.push("/add-product")}
          >
            <Feather name="plus" size={18} color={Colors.accent} />
            <Text style={styles.addProductText}>Add New Product</Text>
          </Pressable>

          {userShop.products.length === 0 ? (
            <View style={styles.emptyProducts}>
              <Text style={styles.emptyText}>No products yet</Text>
              <Text style={styles.emptySubtext}>
                Add your first piece to start selling
              </Text>
            </View>
          ) : (
            userShop.products.map((product) => (
              <View key={product.id} style={styles.productRow}>
                <Image
                  source={{ uri: product.imageUrl }}
                  style={styles.productImage}
                  contentFit="cover"
                />
                <View style={styles.productInfo}>
                  <Text style={styles.productTitle} numberOfLines={1}>
                    {product.title}
                  </Text>
                  <Text style={styles.productMeta}>
                    £{product.price} · {product.size} · {product.condition}
                  </Text>
                  <Text style={styles.productQty}>
                    {product.quantity === 0 ? "Sold" : `${product.quantity} available`}
                  </Text>
                </View>
                <Pressable
                  style={styles.deleteBtn}
                  onPress={() => handleDeleteProduct(product.id, product.title)}
                >
                  <Feather name="trash-2" size={16} color={Colors.danger} />
                </Pressable>
              </View>
            ))
          )}
        </ScrollView>
      ) : (
        <FlatList
          data={orders}
          keyExtractor={(item) => item.id}
          renderItem={({ item: order }) => {
            const config = STATUS_CONFIG[order.status];
            return (
              <View style={styles.orderCard}>
                <View style={styles.orderTop}>
                  <Text style={styles.orderId}>
                    #{order.id.split("-").slice(-2).join("")}
                  </Text>
                  <View
                    style={[
                      styles.statusBadge,
                      { backgroundColor: config.color + "22" },
                    ]}
                  >
                    <Text style={[styles.statusText, { color: config.color }]}>
                      {config.label}
                    </Text>
                  </View>
                </View>
                <Text style={styles.orderItems}>
                  {order.items.length} item{order.items.length !== 1 ? "s" : ""} ·
                  £{order.total.toFixed(2)}
                </Text>
                <Text style={styles.orderAddress} numberOfLines={1}>
                  {order.address}
                </Text>
                {config.next && (
                  <Pressable
                    style={styles.advanceBtn}
                    onPress={() =>
                      handleAdvanceStatus(order.id, config.next!)
                    }
                  >
                    <Feather name="arrow-right" size={14} color={Colors.text} />
                    <Text style={styles.advanceBtnText}>{config.nextLabel}</Text>
                  </Pressable>
                )}
              </View>
            );
          }}
          contentContainerStyle={[
            styles.content,
            {
              paddingBottom: Platform.OS === "web" ? 34 : insets.bottom + 24,
              flexGrow: 1,
            },
          ]}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyOrders}>
              <Feather name="inbox" size={40} color={Colors.textTertiary} />
              <Text style={styles.emptyText}>No orders yet</Text>
              <Text style={styles.emptySubtext}>
                Orders from customers will appear here
              </Text>
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingBottom: 14,
    borderBottomWidth: 1,
  },
  backBtn: { width: 44, height: 44, justifyContent: "center", alignItems: "center" },
  title: {
    flex: 1,
    fontFamily: "PlayfairDisplay_700Bold",
    fontSize: 20,
    color: Colors.text,
    textAlign: "center",
    paddingHorizontal: 8,
  },
  editBtn: { width: 44, height: 44, justifyContent: "center", alignItems: "center" },
  statsRow: {
    flexDirection: "row",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    backgroundColor: Colors.surface,
  },
  stat: { flex: 1, alignItems: "center", gap: 2 },
  statNumber: {
    fontFamily: "PlayfairDisplay_700Bold",
    fontSize: 22,
    color: Colors.text,
  },
  statLabel: {
    fontFamily: "Inter_400Regular",
    fontSize: 11,
    color: Colors.textSecondary,
  },
  statDivider: { width: 1, backgroundColor: Colors.border },
  tabBar: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 14,
    alignItems: "center",
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  tabBtnActive: { borderBottomColor: Colors.text },
  tabText: {
    fontFamily: "Inter_500Medium",
    fontSize: 13,
    color: Colors.textSecondary,
  },
  tabTextActive: { color: Colors.text },
  content: { padding: 16, gap: 12 },
  addProductBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    borderWidth: 1.5,
    borderColor: Colors.accent,
    borderStyle: "dashed",
    borderRadius: 10,
    paddingVertical: 14,
  },
  addProductText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 14,
    color: Colors.accent,
  },
  productRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    backgroundColor: Colors.surface,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: "hidden",
  },
  productImage: {
    width: 72,
    height: 72,
    backgroundColor: Colors.card,
  },
  productInfo: { flex: 1, paddingVertical: 10, gap: 3 },
  productTitle: {
    fontFamily: "Inter_500Medium",
    fontSize: 14,
    color: Colors.text,
  },
  productMeta: {
    fontFamily: "Inter_400Regular",
    fontSize: 12,
    color: Colors.textSecondary,
  },
  productQty: {
    fontFamily: "Inter_400Regular",
    fontSize: 11,
    color: Colors.accent,
  },
  deleteBtn: {
    padding: 14,
  },
  orderCard: {
    backgroundColor: Colors.surface,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 14,
    gap: 8,
  },
  orderTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  orderId: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 14,
    color: Colors.text,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusText: {
    fontFamily: "Inter_500Medium",
    fontSize: 11,
  },
  orderItems: {
    fontFamily: "Inter_400Regular",
    fontSize: 13,
    color: Colors.textSecondary,
  },
  orderAddress: {
    fontFamily: "Inter_400Regular",
    fontSize: 12,
    color: Colors.textTertiary,
  },
  advanceBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    alignSelf: "flex-start",
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 6,
    marginTop: 4,
    backgroundColor: Colors.card,
  },
  advanceBtnText: {
    fontFamily: "Inter_500Medium",
    fontSize: 13,
    color: Colors.text,
  },
  emptyProducts: {
    alignItems: "center",
    paddingTop: 40,
    gap: 8,
  },
  emptyOrders: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 60,
    gap: 12,
  },
  emptyText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 16,
    color: Colors.text,
  },
  emptySubtext: {
    fontFamily: "Inter_400Regular",
    fontSize: 13,
    color: Colors.textSecondary,
    textAlign: "center",
  },
  noShop: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 40,
    gap: 12,
  },
  noShopTitle: {
    fontFamily: "PlayfairDisplay_700Bold",
    fontSize: 24,
    color: Colors.text,
  },
  noShopDesc: {
    fontFamily: "Inter_400Regular",
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: "center",
    lineHeight: 20,
  },
  createBtn: {
    backgroundColor: Colors.text,
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderRadius: 6,
    marginTop: 8,
  },
  createBtnText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 14,
    color: "#fff",
  },
});
