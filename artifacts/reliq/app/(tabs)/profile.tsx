import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  Alert,
  Platform,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather, Ionicons } from "@expo/vector-icons";
import Colors from "@/constants/colors";
import { useAuth } from "@/contexts/AuthContext";
import { useAppContext } from "@/contexts/AppContext";
import { SEED_SHOPS, getShopById } from "@/constants/seed-data";
import { Image } from "expo-image";

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const { user, logout } = useAuth();
  const {
    savedProductIds,
    followedShopIds,
    followedUserIds,
    orders,
    userShop,
  } = useAppContext();

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 84 : insets.bottom + 100;

  function handleLogout() {
    Alert.alert("Sign out", "Are you sure you want to sign out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Sign Out",
        style: "destructive",
        onPress: async () => {
          await logout();
          router.replace("/(auth)/welcome");
        },
      },
    ]);
  }

  function handleResetDemo() {
    Alert.alert(
      "Reset demo data",
      "This will wipe all your activity and re-seed fresh demo data on next login.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Reset",
          style: "destructive",
          onPress: async () => {
            const keys = await AsyncStorage.getAllKeys();
            const demoKeys = keys.filter((k) => k.startsWith("kiki_"));
            await AsyncStorage.multiRemove(demoKeys);
            await logout();
            router.replace("/(auth)/welcome");
          },
        },
      ]
    );
  }

  const isDemoAccount = user?.id?.startsWith("demo-");

  const followedShops = followedShopIds
    .map((id) => SEED_SHOPS.find((s) => s.id === id))
    .filter(Boolean);

  if (!user) return null;

  const isShop = user.accountType === "shop";

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: Colors.background }]}
      contentContainerStyle={{ paddingBottom: bottomPad }}
      showsVerticalScrollIndicator={false}
    >
      <View
        style={[
          styles.header,
          { paddingTop: topPad + 12, borderBottomColor: Colors.border },
        ]}
      >
        <Text style={styles.title}>Profile</Text>
      </View>

      <View style={styles.profileSection}>
        <View style={styles.avatarLarge}>
          <Text style={styles.avatarText}>
            {user.username[0]?.toUpperCase() ?? "?"}
          </Text>
        </View>
        <View style={styles.profileInfo}>
          <Text style={styles.username}>@{user.username}</Text>
          <Text style={styles.email}>{user.email}</Text>
          <View
            style={[
              styles.accountBadge,
              isShop && styles.accountBadgeShop,
            ]}
          >
            <Text style={styles.accountBadgeText}>
              {isShop ? "Shop Account" : "Shopper"}
            </Text>
          </View>
        </View>
      </View>

      {isShop && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>My Shop</Text>
          {userShop ? (
            <Pressable
              style={styles.shopCard}
              onPress={() => router.push("/shop-setup")}
            >
              {userShop.storefrontImage ? (
                <Image
                  source={{ uri: userShop.storefrontImage }}
                  style={styles.shopImage}
                  contentFit="cover"
                />
              ) : (
                <View style={[styles.shopImage, styles.shopImagePlaceholder]}>
                  <Feather name="camera" size={24} color={Colors.textTertiary} />
                </View>
              )}
              <View style={styles.shopDetails}>
                <Text style={styles.shopName}>{userShop.name}</Text>
                <Text style={styles.shopCity}>{userShop.city}</Text>
                <Text style={styles.shopProductCount}>
                  {userShop.products.length} products
                </Text>
              </View>
              <Feather name="chevron-right" size={18} color={Colors.textTertiary} />
            </Pressable>
          ) : (
            <Pressable
              style={styles.createShopBtn}
              onPress={() => router.push("/shop-setup")}
            >
              <Feather name="plus" size={20} color={Colors.accent} />
              <Text style={styles.createShopText}>Create Your Shop</Text>
            </Pressable>
          )}

          {userShop && (
            <View style={styles.shopActions}>
              <Pressable
                style={styles.actionBtn}
                onPress={() => router.push("/add-product")}
              >
                <Feather name="plus" size={16} color={Colors.text} />
                <Text style={styles.actionBtnText}>Add Product</Text>
              </Pressable>
              <Pressable
                style={styles.actionBtn}
                onPress={() => router.push("/shop-dashboard")}
              >
                <Feather name="bar-chart-2" size={16} color={Colors.text} />
                <Text style={styles.actionBtnText}>Dashboard</Text>
              </Pressable>
            </View>
          )}
        </View>
      )}

      <View style={styles.statsRow}>
        <View style={styles.stat}>
          <Text style={styles.statNumber}>{savedProductIds.length}</Text>
          <Text style={styles.statLabel}>Saved</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.stat}>
          <Text style={styles.statNumber}>{followedUserIds.length}</Text>
          <Text style={styles.statLabel}>Following</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.stat}>
          <Text style={styles.statNumber}>{followedShopIds.length}</Text>
          <Text style={styles.statLabel}>Shops</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.stat}>
          <Text style={styles.statNumber}>{orders.length}</Text>
          <Text style={styles.statLabel}>Orders</Text>
        </View>
      </View>

      {orders.length > 0 && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Orders</Text>
            <Pressable onPress={() => router.push("/orders")}>
              <Text style={styles.seeAll}>See all</Text>
            </Pressable>
          </View>
          {orders.slice(0, 2).map((order) => (
            <Pressable key={order.id} style={styles.orderRow}>
              <View style={styles.orderIcon}>
                <Feather name="package" size={18} color={Colors.accent} />
              </View>
              <View style={styles.orderInfo}>
                <Text style={styles.orderItems}>
                  {order.items.length} item{order.items.length !== 1 ? "s" : ""}
                </Text>
                <Text style={styles.orderStatus}>
                  {order.status.replace("_", " ")}
                </Text>
              </View>
              <Text style={styles.orderTotal}>£{order.total.toFixed(2)}</Text>
            </Pressable>
          ))}
        </View>
      )}

      {followedShops.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Following</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.followingRow}>
              {followedShops.map((shop) =>
                shop ? (
                  <Pressable
                    key={shop.id}
                    style={styles.followingCard}
                    onPress={() => router.push(`/shop/${shop.id}`)}
                  >
                    <Image
                      source={{ uri: shop.storefrontImage }}
                      style={styles.followingImage}
                      contentFit="cover"
                    />
                    <Text style={styles.followingName} numberOfLines={1}>
                      {shop.name}
                    </Text>
                  </Pressable>
                ) : null
              )}
            </View>
          </ScrollView>
        </View>
      )}

      <View style={styles.menuSection}>
        <Pressable style={styles.menuRow} onPress={() => router.push("/orders")}>
          <Feather name="package" size={20} color={Colors.text} />
          <Text style={styles.menuText}>My Orders</Text>
          <Feather name="chevron-right" size={16} color={Colors.textTertiary} />
        </Pressable>
        <View style={styles.menuDivider} />
        <Pressable
          style={styles.menuRow}
          onPress={() => router.push("/style-blend")}
          testID="open-style-blend"
        >
          <Feather name="sliders" size={20} color={Colors.text} />
          <Text style={styles.menuText}>Style Blend</Text>
          <Feather name="chevron-right" size={16} color={Colors.textTertiary} />
        </Pressable>
        <View style={styles.menuDivider} />
        {isDemoAccount && (
          <>
            <Pressable style={styles.menuRow} onPress={handleResetDemo}>
              <Feather name="refresh-cw" size={20} color={Colors.textSecondary} />
              <Text style={styles.menuText}>Reset Demo Data</Text>
              <Feather name="chevron-right" size={16} color={Colors.textTertiary} />
            </Pressable>
            <View style={styles.menuDivider} />
          </>
        )}
        <Pressable style={styles.menuRow} onPress={handleLogout}>
          <Feather name="log-out" size={20} color={Colors.danger} />
          <Text style={[styles.menuText, { color: Colors.danger }]}>Sign Out</Text>
          <Feather name="chevron-right" size={16} color={Colors.textTertiary} />
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 14,
    borderBottomWidth: 1,
    backgroundColor: Colors.background,
  },
  title: {
    fontFamily: "PlayfairDisplay_700Bold",
    fontSize: 28,
    color: Colors.text,
  },
  profileSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 18,
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  avatarLarge: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: Colors.accentLight,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    fontFamily: "PlayfairDisplay_700Bold",
    fontSize: 28,
    color: Colors.accent,
  },
  profileInfo: { flex: 1, gap: 4 },
  username: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 18,
    color: Colors.text,
  },
  email: {
    fontFamily: "Inter_400Regular",
    fontSize: 13,
    color: Colors.textSecondary,
  },
  accountBadge: {
    alignSelf: "flex-start",
    backgroundColor: Colors.card,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 4,
    marginTop: 4,
  },
  accountBadgeShop: { backgroundColor: Colors.accentLight },
  accountBadgeText: {
    fontFamily: "Inter_500Medium",
    fontSize: 11,
    color: Colors.text,
  },
  statsRow: {
    flexDirection: "row",
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  stat: { flex: 1, alignItems: "center", gap: 4 },
  statNumber: {
    fontFamily: "PlayfairDisplay_700Bold",
    fontSize: 24,
    color: Colors.text,
  },
  statLabel: {
    fontFamily: "Inter_400Regular",
    fontSize: 12,
    color: Colors.textSecondary,
  },
  statDivider: { width: 1, backgroundColor: Colors.border },
  section: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    gap: 14,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  sectionTitle: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 14,
    color: Colors.text,
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
  seeAll: {
    fontFamily: "Inter_500Medium",
    fontSize: 13,
    color: Colors.accent,
  },
  shopCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    backgroundColor: Colors.surface,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: "hidden",
  },
  shopImage: { width: 70, height: 70 },
  shopImagePlaceholder: {
    backgroundColor: Colors.card,
    alignItems: "center",
    justifyContent: "center",
  },
  shopDetails: { flex: 1, gap: 2, paddingVertical: 10 },
  shopName: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 15,
    color: Colors.text,
  },
  shopCity: {
    fontFamily: "Inter_400Regular",
    fontSize: 12,
    color: Colors.textSecondary,
  },
  shopProductCount: {
    fontFamily: "Inter_400Regular",
    fontSize: 12,
    color: Colors.accent,
  },
  createShopBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    borderWidth: 1.5,
    borderColor: Colors.accent,
    borderStyle: "dashed",
    borderRadius: 10,
    paddingVertical: 16,
    paddingHorizontal: 20,
    justifyContent: "center",
  },
  createShopText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 15,
    color: Colors.accent,
  },
  shopActions: { flexDirection: "row", gap: 12 },
  actionBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: Colors.card,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  actionBtnText: {
    fontFamily: "Inter_500Medium",
    fontSize: 13,
    color: Colors.text,
  },
  orderRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    backgroundColor: Colors.surface,
    padding: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  orderIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.accentLight,
    alignItems: "center",
    justifyContent: "center",
  },
  orderInfo: { flex: 1 },
  orderItems: {
    fontFamily: "Inter_500Medium",
    fontSize: 14,
    color: Colors.text,
  },
  orderStatus: {
    fontFamily: "Inter_400Regular",
    fontSize: 12,
    color: Colors.textSecondary,
    textTransform: "capitalize",
  },
  orderTotal: {
    fontFamily: "Inter_700Bold",
    fontSize: 15,
    color: Colors.text,
  },
  followingRow: { flexDirection: "row", gap: 12 },
  followingCard: { alignItems: "center", gap: 6, width: 80 },
  followingImage: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: Colors.card,
  },
  followingName: {
    fontFamily: "Inter_500Medium",
    fontSize: 11,
    color: Colors.textSecondary,
    textAlign: "center",
  },
  menuSection: {
    marginTop: 12,
    marginHorizontal: 20,
    borderRadius: 12,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
    marginBottom: 20,
  },
  menuRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  menuDivider: { height: 1, backgroundColor: Colors.border, marginLeft: 50 },
  menuText: {
    flex: 1,
    fontFamily: "Inter_500Medium",
    fontSize: 15,
    color: Colors.text,
  },
});
