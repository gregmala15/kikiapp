import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  Platform,
} from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather, Ionicons } from "@expo/vector-icons";
import Colors from "@/constants/colors";
import {
  getHiddenGemProducts,
  getHiddenGemShops,
  getProductsByShop,
} from "@/constants/seed-data";
import { ProductCard } from "@/components/ProductCard";
import { Image } from "expo-image";

export default function HiddenGemsScreen() {
  const insets = useSafeAreaInsets();
  const [view, setView] = useState<"products" | "shops">("products");

  const products = getHiddenGemProducts();
  const shops = getHiddenGemShops();

  const topPad = Platform.OS === "web" ? 67 : insets.top;

  return (
    <View style={[styles.container, { backgroundColor: Colors.background }]}>
      <View
        style={[
          styles.header,
          { paddingTop: topPad + 12, borderBottomColor: Colors.border },
        ]}
      >
        <View>
          <Text style={styles.logo}>KIKI</Text>
          <Text style={styles.subtitle}>Hidden Gems</Text>
        </View>
        <View style={styles.toggle}>
          <Pressable
            style={[styles.toggleBtn, view === "products" && styles.toggleActive]}
            onPress={() => setView("products")}
          >
            <Feather
              name="grid"
              size={16}
              color={view === "products" ? "#fff" : Colors.textSecondary}
            />
          </Pressable>
          <Pressable
            style={[styles.toggleBtn, view === "shops" && styles.toggleActive]}
            onPress={() => setView("shops")}
          >
            <Feather
              name="shopping-bag"
              size={16}
              color={view === "shops" ? "#fff" : Colors.textSecondary}
            />
          </Pressable>
        </View>
      </View>

      <View style={styles.banner}>
        <Ionicons name="sparkles" size={14} color={Colors.accent} />
        <Text style={styles.bannerText}>
          Smaller shops with incredible finds — boosted just for you
        </Text>
      </View>

      {view === "products" ? (
        <FlatList
          data={products}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <ProductCard product={item} />}
          contentContainerStyle={[
            styles.list,
            { paddingBottom: Platform.OS === "web" ? 84 : insets.bottom + 100 },
          ]}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <FlatList
          data={shops}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Pressable
              style={styles.shopCard}
              onPress={() => router.push(`/shop/${item.id}`)}
            >
              <Image
                source={{ uri: item.storefrontImage }}
                style={styles.shopImage}
                contentFit="cover"
              />
              <View style={styles.shopInfo}>
                <View style={styles.shopTop}>
                  <Text style={styles.shopName}>{item.name}</Text>
                  <View
                    style={[
                      styles.typeBadge,
                      item.type === "vintage"
                        ? styles.vintageBadge
                        : styles.indyBadge,
                    ]}
                  >
                    <Text style={styles.typeText}>
                      {item.type === "vintage" ? "Vintage" : "Independent"}
                    </Text>
                  </View>
                </View>
                <Text style={styles.shopCity}>
                  {item.city} · {item.followerCount.toLocaleString()} followers
                </Text>
                <Text style={styles.shopDesc} numberOfLines={2}>
                  {item.description}
                </Text>
                <View style={styles.shopFooter}>
                  <Text style={styles.productCount}>
                    {getProductsByShop(item.id).length} products
                  </Text>
                  <Feather name="arrow-right" size={14} color={Colors.accent} />
                </View>
              </View>
            </Pressable>
          )}
          contentContainerStyle={[
            styles.shopList,
            { paddingBottom: Platform.OS === "web" ? 84 : insets.bottom + 100 },
          ]}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingBottom: 14,
    borderBottomWidth: 1,
    backgroundColor: Colors.background,
  },
  logo: {
    fontFamily: "PlayfairDisplay_700Bold",
    fontSize: 26,
    color: Colors.text,
    letterSpacing: 6,
  },
  subtitle: {
    fontFamily: "Inter_400Regular",
    fontSize: 11,
    color: Colors.textSecondary,
    letterSpacing: 2,
    textTransform: "uppercase",
    marginTop: 2,
  },
  toggle: {
    flexDirection: "row",
    gap: 4,
    backgroundColor: Colors.card,
    padding: 3,
    borderRadius: 8,
  },
  toggleBtn: {
    width: 34,
    height: 34,
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
  },
  toggleActive: { backgroundColor: Colors.text },
  banner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: Colors.accentLight,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  bannerText: {
    fontFamily: "Inter_400Regular",
    fontSize: 12,
    color: Colors.accentDark,
    flex: 1,
  },
  list: { paddingTop: 16 },
  shopList: { padding: 16, gap: 16 },
  shopCard: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: Colors.border,
  },
  shopImage: { width: "100%", height: 180 },
  shopInfo: { padding: 16, gap: 6 },
  shopTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },
  shopName: {
    fontFamily: "PlayfairDisplay_700Bold",
    fontSize: 18,
    color: Colors.text,
    flex: 1,
  },
  typeBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 4,
  },
  vintageBadge: { backgroundColor: Colors.accentLight },
  indyBadge: { backgroundColor: "#E8F4E8" },
  typeText: {
    fontFamily: "Inter_500Medium",
    fontSize: 11,
    color: Colors.text,
  },
  shopCity: {
    fontFamily: "Inter_400Regular",
    fontSize: 12,
    color: Colors.textSecondary,
  },
  shopDesc: {
    fontFamily: "Inter_400Regular",
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
  shopFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 4,
  },
  productCount: {
    fontFamily: "Inter_500Medium",
    fontSize: 12,
    color: Colors.accent,
  },
});
