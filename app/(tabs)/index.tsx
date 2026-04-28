import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  Platform,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import Colors from "@/constants/colors";
import { SEED_PRODUCTS } from "@/constants/seed-data";
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

type FeedMode = "foryou" | "following";

export default function ForYouScreen() {
  const insets = useSafeAreaInsets();
  const { cartCount, followedShopIds } = useAppContext();
  const params = useLocalSearchParams<{
    category?: string;
    era?: string;
    size?: string;
  }>();

  const [feedMode, setFeedMode] = useState<FeedMode>("foryou");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [eraFilter, setEraFilter] = useState<string | null>(null);
  const [sizeFilter, setSizeFilter] = useState<string | null>(null);

  // Apply filters from search screen
  useEffect(() => {
    if (params.category && CATEGORIES.includes(params.category as string)) {
      setSelectedCategory(params.category as string);
    }
    if (params.era) setEraFilter(params.era as string);
    if (params.size) setSizeFilter(params.size as string);
    if (params.category || params.era || params.size) {
      router.setParams({ category: undefined, era: undefined, size: undefined });
    }
  }, [params.category, params.era, params.size]);

  const filtered = useMemo(() => {
    let list = SEED_PRODUCTS;
    if (feedMode === "following") {
      if (followedShopIds.length === 0) return [];
      list = list.filter((p) => followedShopIds.includes(p.shopId));
    }
    if (selectedCategory !== "All") {
      list = list.filter((p) => p.category === selectedCategory);
    }
    if (eraFilter) list = list.filter((p) => p.era === eraFilter);
    if (sizeFilter) list = list.filter((p) => p.size === sizeFilter);
    return list;
  }, [feedMode, followedShopIds, selectedCategory, eraFilter, sizeFilter]);

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const activeFilters = [eraFilter, sizeFilter].filter(Boolean) as string[];

  return (
    <View style={[styles.container, { backgroundColor: Colors.background }]}>
      <View
        style={[
          styles.header,
          { paddingTop: topPad + 12, borderBottomColor: Colors.border },
        ]}
      >
        <Text style={styles.logo}>KIKI</Text>
        <View style={styles.headerActions}>
          <Pressable
            style={styles.iconBtn}
            onPress={() => router.push("/search")}
            hitSlop={8}
          >
            <Feather name="search" size={22} color={Colors.text} />
          </Pressable>
          <Pressable
            style={styles.iconBtn}
            onPress={() => router.push("/cart")}
            hitSlop={8}
          >
            <Feather name="shopping-bag" size={22} color={Colors.text} />
            {cartCount > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{cartCount}</Text>
              </View>
            )}
          </Pressable>
        </View>
      </View>

      <View style={styles.feedSelector}>
        {(["foryou", "following"] as FeedMode[]).map((mode) => (
          <Pressable
            key={mode}
            style={styles.feedTab}
            onPress={() => setFeedMode(mode)}
          >
            <Text
              style={[
                styles.feedTabText,
                feedMode === mode && styles.feedTabTextActive,
              ]}
            >
              {mode === "foryou" ? "For You" : "Following"}
            </Text>
            {feedMode === mode && <View style={styles.feedTabIndicator} />}
          </Pressable>
        ))}
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <ProductCard product={item} />}
        ListHeaderComponent={
          <View>
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

            {activeFilters.length > 0 && (
              <View style={styles.activeFilters}>
                {activeFilters.map((f) => (
                  <Pressable
                    key={f}
                    style={styles.activeFilter}
                    onPress={() => {
                      if (eraFilter === f) setEraFilter(null);
                      if (sizeFilter === f) setSizeFilter(null);
                    }}
                  >
                    <Text style={styles.activeFilterText}>{f}</Text>
                    <Feather name="x" size={12} color={Colors.text} />
                  </Pressable>
                ))}
              </View>
            )}
          </View>
        }
        ListEmptyComponent={
          feedMode === "following" && followedShopIds.length === 0 ? (
            <View style={styles.empty}>
              <Feather name="users" size={40} color={Colors.textTertiary} />
              <Text style={styles.emptyTitle}>No shops yet</Text>
              <Text style={styles.emptyText}>
                Follow shops to see their pieces here
              </Text>
              <Pressable
                style={styles.emptyBtn}
                onPress={() => setFeedMode("foryou")}
              >
                <Text style={styles.emptyBtnText}>Discover shops</Text>
              </Pressable>
            </View>
          ) : (
            <View style={styles.empty}>
              <Feather name="inbox" size={40} color={Colors.textTertiary} />
              <Text style={styles.emptyText}>No products found</Text>
            </View>
          )
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
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  iconBtn: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  badge: {
    position: "absolute",
    top: 4,
    right: 2,
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
  feedSelector: {
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingTop: 16,
    gap: 24,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    backgroundColor: Colors.background,
  },
  feedTab: {
    paddingBottom: 12,
    alignItems: "center",
  },
  feedTabText: {
    fontFamily: "Inter_500Medium",
    fontSize: 15,
    color: Colors.textTertiary,
    letterSpacing: -0.2,
  },
  feedTabTextActive: {
    fontFamily: "Inter_600SemiBold",
    color: Colors.text,
  },
  feedTabIndicator: {
    position: "absolute",
    bottom: -1,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: Colors.text,
  },
  list: { paddingTop: 16 },
  categoriesWrapper: { marginBottom: 12 },
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
  activeFilters: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 16,
    gap: 6,
    marginBottom: 12,
  },
  activeFilter: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  activeFilterText: {
    fontFamily: "Inter_500Medium",
    fontSize: 11,
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
    fontSize: 20,
    color: Colors.text,
    marginTop: 4,
  },
  emptyText: {
    fontFamily: "Inter_400Regular",
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: "center",
  },
  emptyBtn: {
    marginTop: 8,
    paddingHorizontal: 22,
    paddingVertical: 12,
    backgroundColor: Colors.text,
    borderRadius: 28,
  },
  emptyBtnText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 13,
    color: "#fff",
    letterSpacing: 0.3,
  },
});
