import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Alert,
  Platform,
} from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import Colors from "@/constants/colors";
import { useAppContext, Order } from "@/contexts/AppContext";

const STATUS: Record<
  Order["status"],
  {
    label: string;
    color: string;
    next?: Order["status"];
    nextLabel?: string;
  }
> = {
  created: {
    label: "Created",
    color: Colors.textSecondary,
    next: "label_created",
    nextLabel: "Mark label printed",
  },
  label_created: {
    label: "Label printed",
    color: Colors.accent,
    next: "shipped",
    nextLabel: "Mark as shipped",
  },
  shipped: {
    label: "Shipped",
    color: "#2196F3",
    next: "delivered",
    nextLabel: "Mark as delivered",
  },
  delivered: { label: "Delivered", color: Colors.success },
};

export default function ShopOrdersScreen() {
  const insets = useSafeAreaInsets();
  const { userShop, orders, updateOrderStatus } = useAppContext();
  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 120 : insets.bottom + 100;

  if (!userShop) {
    return (
      <View
        style={[
          styles.empty,
          { paddingTop: topPad + 40, paddingBottom: bottomPad },
        ]}
      >
        <Ionicons name="cube-outline" size={48} color={Colors.textTertiary} />
        <Text style={styles.emptyTitle}>No shop yet</Text>
        <Pressable
          style={styles.cta}
          onPress={() => router.push("/shop-setup")}
        >
          <Text style={styles.ctaText}>Create shop</Text>
        </Pressable>
      </View>
    );
  }

  function advance(o: Order) {
    const cfg = STATUS[o.status];
    if (!cfg.next) return;
    Alert.alert(
      "Update status",
      `Move this order to "${STATUS[cfg.next].label}"?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Update",
          onPress: () => updateOrderStatus(o.id, cfg.next!),
        },
      ],
    );
  }

  // Most recent first; pending orders matter most so they bubble up by date
  // anyway — the home screen already filters strictly by status.
  const sorted = [...orders].sort((a, b) =>
    b.createdAt.localeCompare(a.createdAt),
  );

  return (
    <View style={{ flex: 1, backgroundColor: Colors.background }}>
      <View style={[styles.header, { paddingTop: topPad + 12 }]}>
        <View>
          <Text style={styles.title}>Orders</Text>
          <Text style={styles.subtitle}>
            {orders.length} total · £
            {orders.reduce((s, o) => s + o.total, 0).toFixed(0)} revenue
          </Text>
        </View>
      </View>
      <ScrollView
        contentContainerStyle={{
          paddingBottom: bottomPad,
          paddingHorizontal: 20,
          paddingTop: 12,
          gap: 12,
        }}
      >
        {sorted.length === 0 ? (
          <View style={styles.emptyInline}>
            <Text style={styles.emptyTitle}>No orders yet</Text>
            <Text style={styles.emptyDesc}>
              When buyers checkout, you'll see them here with shipping
              actions.
            </Text>
          </View>
        ) : (
          sorted.map((o) => {
            const cfg = STATUS[o.status];
            return (
              <View key={o.id} style={styles.card}>
                <View style={styles.cardHead}>
                  <Text style={styles.orderId}>
                    #{o.id.slice(-6).toUpperCase()}
                  </Text>
                  <View
                    style={[styles.statusPill, { backgroundColor: cfg.color }]}
                  >
                    <Text style={styles.statusText}>{cfg.label}</Text>
                  </View>
                </View>
                <Text style={styles.itemsLine}>
                  {o.items.length} item{o.items.length === 1 ? "" : "s"} · £
                  {o.total.toFixed(2)}
                </Text>
                <Text style={styles.dateLine}>
                  {new Date(o.createdAt).toLocaleDateString(undefined, {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </Text>
                {cfg.next && (
                  <Pressable
                    style={styles.advanceBtn}
                    onPress={() => advance(o)}
                  >
                    <Text style={styles.advanceText}>{cfg.nextLabel}</Text>
                  </Pressable>
                )}
              </View>
            );
          })
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 20,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  title: {
    fontFamily: "PlayfairDisplay_700Bold",
    fontSize: 28,
    color: Colors.text,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontFamily: "Inter_400Regular",
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  card: {
    padding: 14,
    borderRadius: 10,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 4,
  },
  cardHead: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  orderId: {
    fontFamily: "Inter_700Bold",
    fontSize: 13,
    letterSpacing: 1,
    color: Colors.text,
  },
  statusPill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 10,
    color: "#fff",
    letterSpacing: 0.6,
    textTransform: "uppercase",
  },
  itemsLine: {
    fontFamily: "Inter_500Medium",
    fontSize: 13,
    color: Colors.text,
    marginTop: 6,
  },
  dateLine: {
    fontFamily: "Inter_400Regular",
    fontSize: 12,
    color: Colors.textTertiary,
  },
  advanceBtn: {
    marginTop: 10,
    paddingVertical: 10,
    borderRadius: 6,
    backgroundColor: Colors.text,
    alignItems: "center",
  },
  advanceText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 13,
    color: "#fff",
  },
  empty: {
    flex: 1,
    backgroundColor: Colors.background,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
    gap: 14,
  },
  emptyInline: {
    alignItems: "center",
    paddingVertical: 60,
    gap: 10,
  },
  emptyTitle: {
    fontFamily: "PlayfairDisplay_700Bold",
    fontSize: 22,
    color: Colors.text,
  },
  emptyDesc: {
    fontFamily: "Inter_400Regular",
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: "center",
    lineHeight: 21,
    maxWidth: 320,
  },
  cta: {
    marginTop: 6,
    paddingHorizontal: 22,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.text,
    alignItems: "center",
    justifyContent: "center",
  },
  ctaText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 14,
    color: "#fff",
  },
});
