import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Platform,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import Colors from "@/constants/colors";
import { useAppContext } from "@/contexts/AppContext";

const STATUSES = [
  { key: "created", label: "Order Created", icon: "check-circle" },
  { key: "label_created", label: "Label Created", icon: "printer" },
  { key: "shipped", label: "Shipped", icon: "truck" },
  { key: "delivered", label: "Delivered", icon: "home" },
];

export default function OrderConfirmationScreen() {
  const insets = useSafeAreaInsets();
  const { orderId } = useLocalSearchParams<{ orderId: string }>();
  const { orders } = useAppContext();

  const order = orders.find((o) => o.id === orderId);

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: topPad + 24,
          paddingBottom: bottomPad + 24,
          backgroundColor: Colors.background,
        },
      ]}
    >
      <View style={styles.successIcon}>
        <Feather name="check" size={36} color="#fff" />
      </View>

      <Text style={styles.headline}>Order placed!</Text>
      <Text style={styles.subheadline}>
        Your order has been confirmed. The shop will prepare your pieces shortly.
      </Text>

      {order && (
        <View style={styles.orderCard}>
          <View style={styles.orderCardHeader}>
            <Text style={styles.orderLabel}>ORDER</Text>
            <Text style={styles.orderId}>
              #{order.id.split("-").slice(-2).join("")}
            </Text>
          </View>
          <View style={styles.orderDetails}>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Items</Text>
              <Text style={styles.detailValue}>
                {order.items.length} piece{order.items.length !== 1 ? "s" : ""}
              </Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Total</Text>
              <Text style={styles.detailValue}>£{order.total.toFixed(2)}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Delivery to</Text>
              <Text
                style={[styles.detailValue, { flex: 1, textAlign: "right" }]}
                numberOfLines={2}
              >
                {order.address}
              </Text>
            </View>
          </View>
        </View>
      )}

      <View style={styles.trackingSection}>
        <Text style={styles.trackingTitle}>Tracking</Text>
        <View style={styles.statusTrack}>
          {STATUSES.map((status, index) => {
            const current = order?.status ?? "created";
            const currentIdx = STATUSES.findIndex((s) => s.key === current);
            const isActive = index <= currentIdx;
            return (
              <View key={status.key} style={styles.statusStep}>
                <View
                  style={[
                    styles.statusDot,
                    isActive && styles.statusDotActive,
                    index === currentIdx && styles.statusDotCurrent,
                  ]}
                >
                  <Feather
                    name={status.icon as any}
                    size={14}
                    color={isActive ? "#fff" : Colors.textTertiary}
                  />
                </View>
                <Text
                  style={[
                    styles.statusLabel,
                    isActive && styles.statusLabelActive,
                  ]}
                >
                  {status.label}
                </Text>
                {index < STATUSES.length - 1 && (
                  <View
                    style={[
                      styles.statusLine,
                      isActive && styles.statusLineActive,
                    ]}
                  />
                )}
              </View>
            );
          })}
        </View>
      </View>

      <View style={styles.buttons}>
        <Pressable
          style={styles.ordersBtn}
          onPress={() => {
            router.dismissAll();
            router.push("/orders");
          }}
        >
          <Feather name="package" size={16} color={Colors.text} />
          <Text style={styles.ordersBtnText}>View All Orders</Text>
        </Pressable>
        <Pressable
          style={styles.homeBtn}
          onPress={() => {
            router.dismissAll();
          }}
        >
          <Text style={styles.homeBtnText}>Continue Shopping</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    alignItems: "center",
  },
  successIcon: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: Colors.success,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },
  headline: {
    fontFamily: "PlayfairDisplay_700Bold",
    fontSize: 32,
    color: Colors.text,
    textAlign: "center",
    marginBottom: 12,
  },
  subheadline: {
    fontFamily: "Inter_400Regular",
    fontSize: 15,
    color: Colors.textSecondary,
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 28,
  },
  orderCard: {
    width: "100%",
    backgroundColor: Colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: "hidden",
    marginBottom: 28,
  },
  orderCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: Colors.card,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  orderLabel: {
    fontFamily: "Inter_400Regular",
    fontSize: 11,
    color: Colors.textTertiary,
    letterSpacing: 1,
  },
  orderId: {
    fontFamily: "Inter_700Bold",
    fontSize: 13,
    color: Colors.text,
    letterSpacing: 0.5,
  },
  orderDetails: { padding: 16, gap: 10 },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  detailLabel: {
    fontFamily: "Inter_400Regular",
    fontSize: 13,
    color: Colors.textSecondary,
  },
  detailValue: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 13,
    color: Colors.text,
  },
  trackingSection: { width: "100%", marginBottom: 32 },
  trackingTitle: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 12,
    color: Colors.text,
    letterSpacing: 1,
    textTransform: "uppercase",
    marginBottom: 16,
  },
  statusTrack: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
  statusStep: {
    flex: 1,
    alignItems: "center",
    gap: 6,
    position: "relative",
  },
  statusDot: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.card,
    borderWidth: 1.5,
    borderColor: Colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  statusDotActive: {
    backgroundColor: Colors.textSecondary,
    borderColor: Colors.textSecondary,
  },
  statusDotCurrent: {
    backgroundColor: Colors.accent,
    borderColor: Colors.accent,
  },
  statusLabel: {
    fontFamily: "Inter_400Regular",
    fontSize: 9,
    color: Colors.textTertiary,
    textAlign: "center",
    letterSpacing: 0.3,
  },
  statusLabelActive: { color: Colors.text },
  statusLine: {
    position: "absolute",
    top: 16,
    left: "60%",
    right: "-60%",
    height: 1.5,
    backgroundColor: Colors.border,
    zIndex: -1,
  },
  statusLineActive: { backgroundColor: Colors.textSecondary },
  buttons: { width: "100%", gap: 12, marginTop: "auto" as any },
  ordersBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderWidth: 1.5,
    borderColor: Colors.text,
    paddingVertical: 14,
    borderRadius: 6,
  },
  ordersBtnText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 14,
    color: Colors.text,
  },
  homeBtn: {
    backgroundColor: Colors.text,
    paddingVertical: 14,
    borderRadius: 6,
    alignItems: "center",
  },
  homeBtnText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 14,
    color: "#fff",
  },
});
