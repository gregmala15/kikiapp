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
import Colors from "@/constants/colors";
import { useAppContext, Order } from "@/contexts/AppContext";

type FeatherIconName = React.ComponentProps<typeof Feather>["name"];

const STATUS_CONFIG: Record<Order["status"], { color: string; label: string; icon: FeatherIconName }> = {
  created: { color: Colors.textSecondary, label: "Order Created", icon: "check-circle" },
  label_created: { color: Colors.accent, label: "Label Created", icon: "printer" },
  shipped: { color: "#2196F3", label: "Shipped", icon: "truck" },
  delivered: { color: Colors.success, label: "Delivered", icon: "home" },
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function OrdersScreen() {
  const insets = useSafeAreaInsets();
  const { orders } = useAppContext();

  const topPad = Platform.OS === "web" ? 67 : insets.top;

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
        <Text style={styles.title}>My Orders</Text>
        <View style={{ width: 44 }} />
      </View>

      <FlatList
        data={orders}
        keyExtractor={(item) => item.id}
        renderItem={({ item: order }) => {
          const config = STATUS_CONFIG[order.status];
          return (
            <View style={styles.orderCard}>
              <View style={styles.orderTop}>
                <View style={styles.orderInfo}>
                  <Text style={styles.orderId}>
                    Order #{order.id.split("-").slice(-2).join("")}
                  </Text>
                  <Text style={styles.orderDate}>{formatDate(order.createdAt)}</Text>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: config.color + "20" }]}>
                  <Feather name={config.icon} size={12} color={config.color} />
                  <Text style={[styles.statusText, { color: config.color }]}>
                    {config.label}
                  </Text>
                </View>
              </View>

              <View style={styles.orderItems}>
                {order.items.map((item) => (
                  <View key={item.product.id} style={styles.itemRow}>
                    <Text style={styles.itemName} numberOfLines={1}>
                      {item.product.title}
                    </Text>
                    <Text style={styles.itemMeta}>
                      ×{item.quantity} · £{(item.product.price * item.quantity).toFixed(2)}
                    </Text>
                  </View>
                ))}
              </View>

              <View style={styles.orderBottom}>
                <View style={styles.addressRow}>
                  <Feather name="map-pin" size={12} color={Colors.textTertiary} />
                  <Text style={styles.address} numberOfLines={1}>
                    {order.address}
                  </Text>
                </View>
                <View style={styles.orderFooter}>
                  <Text style={styles.orderTotal}>£{order.total.toFixed(2)}</Text>
                </View>
              </View>
            </View>
          );
        }}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="receipt-outline" size={52} color={Colors.textTertiary} />
            <Text style={styles.emptyTitle}>No orders yet</Text>
            <Text style={styles.emptyDesc}>
              Your order history will appear here
            </Text>
            <Pressable
              style={styles.browseBtn}
              onPress={() => router.replace("/(tabs)")}
            >
              <Text style={styles.browseBtnText}>Start Shopping</Text>
            </Pressable>
          </View>
        }
        contentContainerStyle={[
          styles.list,
          { paddingBottom: Platform.OS === "web" ? 34 : insets.bottom + 24 },
        ]}
        showsVerticalScrollIndicator={false}
      />
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
    fontSize: 24,
    color: Colors.text,
    textAlign: "center",
  },
  list: { padding: 20, gap: 16 },
  orderCard: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: "hidden",
  },
  orderTop: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  orderInfo: { gap: 3 },
  orderId: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 14,
    color: Colors.text,
  },
  orderDate: {
    fontFamily: "Inter_400Regular",
    fontSize: 12,
    color: Colors.textSecondary,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
  },
  statusText: {
    fontFamily: "Inter_500Medium",
    fontSize: 11,
  },
  orderItems: {
    padding: 16,
    gap: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  itemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 8,
  },
  itemName: {
    flex: 1,
    fontFamily: "Inter_400Regular",
    fontSize: 13,
    color: Colors.text,
  },
  itemMeta: {
    fontFamily: "Inter_500Medium",
    fontSize: 13,
    color: Colors.textSecondary,
  },
  orderBottom: { padding: 16, gap: 8 },
  addressRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  address: {
    flex: 1,
    fontFamily: "Inter_400Regular",
    fontSize: 12,
    color: Colors.textSecondary,
  },
  orderFooter: { flexDirection: "row", justifyContent: "flex-end" },
  orderTotal: {
    fontFamily: "PlayfairDisplay_700Bold",
    fontSize: 20,
    color: Colors.text,
  },
  empty: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 80,
    paddingHorizontal: 40,
    gap: 12,
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
    backgroundColor: Colors.text,
    paddingHorizontal: 28,
    paddingVertical: 12,
    borderRadius: 6,
    marginTop: 8,
  },
  browseBtnText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 14,
    color: "#fff",
  },
});
