import React, { useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Platform,
} from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather, Ionicons } from "@expo/vector-icons";
import Colors from "@/constants/colors";
import { useAppContext } from "@/contexts/AppContext";
import { useAuth } from "@/contexts/AuthContext";

export default function ShopHomeScreen() {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const { userShop, orders } = useAppContext();
  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 120 : insets.bottom + 100;

  // No shop yet → the rest of the dashboard would be meaningless. We don't
  // auto-redirect because the tab bar should remain visible and stable;
  // the user just sees a clear "set up your shop" panel inside Home.
  if (!userShop) {
    return (
      <View
        style={[
          styles.emptyContainer,
          { paddingTop: topPad + 40, paddingBottom: bottomPad },
        ]}
      >
        <Ionicons
          name="storefront-outline"
          size={56}
          color={Colors.textTertiary}
        />
        <Text style={styles.emptyTitle}>Set up your shop</Text>
        <Text style={styles.emptyDesc}>
          Add your shop profile so buyers can find you and you can start
          listing pieces.
        </Text>
        <Pressable
          style={styles.cta}
          onPress={() => router.push("/shop-setup")}
        >
          <Text style={styles.ctaText}>Create shop profile</Text>
        </Pressable>
      </View>
    );
  }

  const revenue = orders.reduce((s, o) => s + o.total, 0);
  const pendingOrders = orders.filter(
    (o) => o.status === "created" || o.status === "label_created",
  );
  const inTransit = orders.filter((o) => o.status === "shipped");
  const availableCount = userShop.products.filter((p) => !p.isSold).length;

  const ordersThisMonth = useMemo(() => {
    const now = new Date();
    return orders.filter((o) => {
      const d = new Date(o.createdAt);
      return (
        d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
      );
    }).length;
  }, [orders]);

  const greeting = (() => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 18) return "Good afternoon";
    return "Good evening";
  })();

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: Colors.background }}
      contentContainerStyle={{ paddingBottom: bottomPad }}
      showsVerticalScrollIndicator={false}
    >
      <View style={[styles.header, { paddingTop: topPad + 16 }]}>
        <Text style={styles.greeting}>
          {greeting}
          {user?.username ? `, ${user.username}` : ""}
        </Text>
        <Text style={styles.shopName}>{userShop.name}</Text>
        <Text style={styles.location}>
          {userShop.city} ·{" "}
          {userShop.type === "vintage" ? "Vintage" : "Independent"}
        </Text>
      </View>

      <View style={styles.statsGrid}>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Revenue</Text>
          <Text style={styles.statValue}>£{revenue.toFixed(0)}</Text>
          <Text style={styles.statHint}>
            {ordersThisMonth} order{ordersThisMonth === 1 ? "" : "s"} this month
          </Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Listings live</Text>
          <Text style={styles.statValue}>{userShop.products.length}</Text>
          <Text style={styles.statHint}>{availableCount} available</Text>
        </View>
      </View>

      <View style={styles.statsGrid}>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Need action</Text>
          <Text
            style={[
              styles.statValue,
              pendingOrders.length > 0 && { color: Colors.danger },
            ]}
          >
            {pendingOrders.length}
          </Text>
          <Text style={styles.statHint}>orders to ship</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>In transit</Text>
          <Text style={styles.statValue}>{inTransit.length}</Text>
          <Text style={styles.statHint}>awaiting delivery</Text>
        </View>
      </View>

      {pendingOrders.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Action required</Text>
          {pendingOrders.slice(0, 3).map((o) => (
            <Pressable
              key={o.id}
              style={styles.actionRow}
              onPress={() => router.push("/(shop-tabs)/orders")}
            >
              <View style={styles.actionDot} />
              <View style={{ flex: 1 }}>
                <Text style={styles.actionTitle}>
                  Order #{o.id.slice(-6).toUpperCase()}
                </Text>
                <Text style={styles.actionSub}>
                  {o.items.length} item{o.items.length === 1 ? "" : "s"} · £
                  {o.total.toFixed(2)} ·{" "}
                  {o.status === "created"
                    ? "Print label"
                    : "Mark as shipped"}
                </Text>
              </View>
              <Feather name="chevron-right" size={18} color={Colors.textTertiary} />
            </Pressable>
          ))}
          {pendingOrders.length > 3 && (
            <Pressable onPress={() => router.push("/(shop-tabs)/orders")}>
              <Text style={styles.seeAll}>
                See all {pendingOrders.length} pending →
              </Text>
            </Pressable>
          )}
        </View>
      )}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick actions</Text>
        <View style={styles.quickRow}>
          <QuickAction
            icon="plus"
            label="Add product"
            onPress={() => router.push("/add-product")}
          />
          <QuickAction
            icon="edit-2"
            label="Edit shop"
            onPress={() => router.push("/shop-setup")}
          />
          <QuickAction
            icon="package"
            label="See orders"
            onPress={() => router.push("/(shop-tabs)/orders")}
          />
        </View>
      </View>
    </ScrollView>
  );
}

function QuickAction({
  icon,
  label,
  onPress,
}: {
  icon: keyof typeof Feather.glyphMap;
  label: string;
  onPress: () => void;
}) {
  return (
    <Pressable style={styles.quickAction} onPress={onPress}>
      <View style={styles.quickIcon}>
        <Feather name={icon} size={18} color={Colors.accent} />
      </View>
      <Text style={styles.quickText}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  emptyContainer: {
    flex: 1,
    backgroundColor: Colors.background,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
    gap: 14,
  },
  emptyTitle: {
    fontFamily: "PlayfairDisplay_700Bold",
    fontSize: 24,
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
    marginTop: 12,
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
  header: {
    paddingHorizontal: 20,
    paddingBottom: 18,
  },
  greeting: {
    fontFamily: "Inter_400Regular",
    fontSize: 13,
    color: Colors.textSecondary,
  },
  shopName: {
    fontFamily: "PlayfairDisplay_700Bold",
    fontSize: 28,
    color: Colors.text,
    letterSpacing: -0.5,
    marginTop: 2,
  },
  location: {
    fontFamily: "Inter_500Medium",
    fontSize: 11,
    color: Colors.textTertiary,
    letterSpacing: 0.8,
    textTransform: "uppercase",
    marginTop: 4,
  },
  statsGrid: {
    flexDirection: "row",
    gap: 12,
    paddingHorizontal: 20,
    marginTop: 12,
  },
  statCard: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 4,
  },
  statLabel: {
    fontFamily: "Inter_500Medium",
    fontSize: 11,
    color: Colors.textTertiary,
    letterSpacing: 0.8,
    textTransform: "uppercase",
  },
  statValue: {
    fontFamily: "PlayfairDisplay_700Bold",
    fontSize: 26,
    color: Colors.text,
    letterSpacing: -0.5,
  },
  statHint: {
    fontFamily: "Inter_400Regular",
    fontSize: 12,
    color: Colors.textSecondary,
  },
  section: {
    marginTop: 24,
    paddingHorizontal: 20,
    gap: 10,
  },
  sectionTitle: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 11,
    letterSpacing: 1.2,
    textTransform: "uppercase",
    color: Colors.textTertiary,
    marginBottom: 4,
  },
  actionRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 14,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 10,
  },
  actionDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.danger,
  },
  actionTitle: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 13,
    color: Colors.text,
  },
  actionSub: {
    fontFamily: "Inter_400Regular",
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  seeAll: {
    fontFamily: "Inter_500Medium",
    fontSize: 13,
    color: Colors.accent,
    paddingVertical: 6,
  },
  quickRow: {
    flexDirection: "row",
    gap: 10,
  },
  quickAction: {
    flex: 1,
    paddingVertical: 16,
    paddingHorizontal: 8,
    borderRadius: 10,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: "center",
    gap: 8,
  },
  quickIcon: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: Colors.accentLight,
    alignItems: "center",
    justifyContent: "center",
  },
  quickText: {
    fontFamily: "Inter_500Medium",
    fontSize: 12,
    color: Colors.text,
    textAlign: "center",
  },
});
