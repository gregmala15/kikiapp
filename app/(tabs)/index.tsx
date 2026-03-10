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
import { Feather } from "@expo/vector-icons";
import Colors from "@/constants/colors";
import { SEED_PRODUCTS, Product } from "@/constants/seed-data";
import { ProductCard } from "@/components/ProductCard";
import { useAppContext } from "@/contexts/AppContext";

const CATEGORIES = [
  "All",
  "Outerwear",
  "Tops",
  "Dresses",
  "Accessories",
  "Footwear",
  "Archive / Rare",
];

export default function ForYouScreen() {
  const insets = useSafeAreaInsets();
  const { cartCount } = useAppContext();
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filtered =
    selectedCategory === "All"
      ? SEED_PRODUCTS
      : SEED_PRODUCTS.filter((p) => p.category === selectedCategory);

  const topPad = Platform.OS === "web" ? 67 : insets.top;

  return (
    <View style={[styles.container, { backgroundColor: Colors.background }]}>
      <View
        style={[
          styles.header,
          { paddingTop: topPad + 12, borderBottomColor: Colors.border },
        ]}
      >
        <Text style={styles.logo}>KIKI</Text>
        <Pressable
          style={styles.cartBtn}
          onPress={() => router.push("/cart")}
        >
          <Feather name="shopping-bag" size={22} color={Colors.text} />
          {cartCount > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{cartCount}</Text>
            </View>
          )}
        </Pressable>
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <ProductCard product={item} />}
        ListHeaderComponent={
          <View style={styles.categoriesWrapper}>
            <FlatList
              data={CATEGORIES}
              keyExtractor={(item) => item}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.categories}
              renderItem={({ item }) => (
                <Pressable
                  style={[
                    styles.chip,
                    selectedCategory === item && styles.chipActive,
                  ]}
                  onPress={() => setSelectedCategory(item)}
                >
                  <Text
                    style={[
                      styles.chipText,
                      selectedCategory === item && styles.chipTextActive,
                    ]}
                  >
                    {item}
                  </Text>
                </Pressable>
              )}
            />
          </View>
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <Feather name="inbox" size={40} color={Colors.textTertiary} />
            <Text style={styles.emptyText}>No products found</Text>
          </View>
        }
        contentContainerStyle={[
          styles.list,
          { paddingBottom: Platform.OS === "web" ? 84 : insets.bottom + 100 },
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
  cartBtn: {
    width: 44,
    height: 44,
    justifyContent: "center",
    alignItems: "center",
  },
  badge: {
    position: "absolute",
    top: 6,
    right: 6,
    backgroundColor: Colors.accent,
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 4,
  },
  badgeText: {
    fontFamily: "Inter_700Bold",
    fontSize: 9,
    color: "#fff",
  },
  list: { paddingTop: 16 },
  categoriesWrapper: { marginBottom: 16 },
  categories: { paddingHorizontal: 16, gap: 8 },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
  },
  chipActive: {
    backgroundColor: Colors.text,
    borderColor: Colors.text,
  },
  chipText: {
    fontFamily: "Inter_500Medium",
    fontSize: 13,
    color: Colors.textSecondary,
  },
  chipTextActive: {
    color: "#fff",
  },
  empty: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 80,
    gap: 12,
  },
  emptyText: {
    fontFamily: "Inter_400Regular",
    fontSize: 15,
    color: Colors.textSecondary,
  },
});
