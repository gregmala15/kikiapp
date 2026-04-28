import React, { useMemo, useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  FlatList,
  Platform,
  Keyboard,
} from "react-native";
import { router, Stack } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { Image } from "expo-image";
import Colors from "@/constants/colors";
import {
  SEED_PRODUCTS,
  SEED_SHOPS,
  Product,
  Shop,
  ProductCategory,
} from "@/constants/seed-data";

const CATEGORIES: ProductCategory[] = [
  "Outerwear",
  "Tops",
  "Dresses",
  "Accessories",
  "Footwear",
  "Archive / Rare",
];

const ERAS = ["Y2K", "90s", "80s", "70s", "60s", "Contemporary"];
const SIZES = ["XS", "S", "M", "L", "XL", "One Size"];

type Tab = "all" | "products" | "shops";

interface SearchResults {
  products: Product[];
  shops: Shop[];
  categories: string[];
  eras: string[];
  sizes: string[];
}

function search(query: string): SearchResults {
  const q = query.trim().toLowerCase();
  if (!q) {
    return { products: [], shops: [], categories: [], eras: [], sizes: [] };
  }

  const products = SEED_PRODUCTS.filter((p) => {
    const haystack = [
      p.title,
      p.description,
      p.category,
      p.era,
      p.size,
      p.condition,
      ...(p.tags ?? []),
    ]
      .join(" ")
      .toLowerCase();
    return haystack.includes(q);
  }).slice(0, 30);

  const shops = SEED_SHOPS.filter((s) => {
    const haystack = [s.name, s.description, s.city, s.type, ...s.tags]
      .join(" ")
      .toLowerCase();
    return haystack.includes(q);
  }).slice(0, 15);

  const categories = CATEGORIES.filter((c) => c.toLowerCase().includes(q));
  const eras = ERAS.filter((e) => e.toLowerCase().includes(q));
  const sizes = SIZES.filter((s) => s.toLowerCase() === q || s.toLowerCase().startsWith(q));

  return { products, shops, categories, eras, sizes };
}

export default function SearchScreen() {
  const insets = useSafeAreaInsets();
  const [query, setQuery] = useState("");
  const [tab, setTab] = useState<Tab>("all");
  const topPad = Platform.OS === "web" ? 67 : insets.top;

  const results = useMemo(() => search(query), [query]);

  const hasQuery = query.trim().length > 0;
  const hasResults =
    results.products.length > 0 ||
    results.shops.length > 0 ||
    results.categories.length > 0 ||
    results.eras.length > 0 ||
    results.sizes.length > 0;

  const trending = ["Vintage Levis", "Archive", "Y2K", "Italian leather", "Rome"];

  function applyFilter(kind: "category" | "era" | "size", value: string) {
    Keyboard.dismiss();
    router.replace({
      pathname: "/(tabs)",
      params: { [kind]: value },
    });
  }

  return (
    <View style={[styles.root, { backgroundColor: Colors.background }]}>
      <Stack.Screen options={{ headerShown: false }} />
      <View
        style={[
          styles.searchBar,
          { paddingTop: topPad + 10, borderBottomColor: Colors.border },
        ]}
      >
        <Pressable style={styles.backBtn} onPress={() => router.back()}>
          <Feather name="chevron-left" size={26} color={Colors.text} />
        </Pressable>
        <View style={styles.inputWrap}>
          <Feather
            name="search"
            size={16}
            color={Colors.textTertiary}
            style={{ marginRight: 8 }}
          />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Search pieces, shops, era, size…"
            placeholderTextColor={Colors.textTertiary}
            style={styles.input}
            autoFocus
            returnKeyType="search"
            autoCapitalize="none"
            autoCorrect={false}
          />
          {query.length > 0 && (
            <Pressable onPress={() => setQuery("")} hitSlop={8}>
              <Feather name="x-circle" size={16} color={Colors.textTertiary} />
            </Pressable>
          )}
        </View>
      </View>

      {hasQuery && (
        <View style={styles.tabs}>
          {(["all", "products", "shops"] as Tab[]).map((t) => (
            <Pressable
              key={t}
              style={[styles.tab, tab === t && styles.tabActive]}
              onPress={() => setTab(t)}
            >
              <Text
                style={[styles.tabText, tab === t && styles.tabTextActive]}
              >
                {t === "all" ? "All" : t === "products" ? "Pieces" : "Shops"}
              </Text>
            </Pressable>
          ))}
        </View>
      )}

      <FlatList
        data={[1]}
        keyExtractor={() => "content"}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        contentContainerStyle={{
          paddingBottom: insets.bottom + 40,
        }}
        renderItem={() => (
          <View>
            {!hasQuery && (
              <View style={styles.emptyState}>
                <Text style={styles.sectionLabel}>Trending</Text>
                <View style={styles.trendingWrap}>
                  {trending.map((t) => (
                    <Pressable
                      key={t}
                      style={styles.trendChip}
                      onPress={() => setQuery(t)}
                    >
                      <Feather
                        name="trending-up"
                        size={12}
                        color={Colors.textSecondary}
                      />
                      <Text style={styles.trendChipText}>{t}</Text>
                    </Pressable>
                  ))}
                </View>

                <Text style={[styles.sectionLabel, { marginTop: 36 }]}>
                  Browse by category
                </Text>
                <View style={styles.browseGrid}>
                  {CATEGORIES.map((c) => (
                    <Pressable
                      key={c}
                      style={styles.browseItem}
                      onPress={() => applyFilter("category", c)}
                    >
                      <Text style={styles.browseText}>{c}</Text>
                      <Feather
                        name="arrow-up-right"
                        size={16}
                        color={Colors.textTertiary}
                      />
                    </Pressable>
                  ))}
                </View>

                <Text style={[styles.sectionLabel, { marginTop: 36 }]}>
                  Era
                </Text>
                <View style={styles.eraRow}>
                  {ERAS.map((e) => (
                    <Pressable
                      key={e}
                      style={styles.eraChip}
                      onPress={() => applyFilter("era", e)}
                    >
                      <Text style={styles.eraChipText}>{e}</Text>
                    </Pressable>
                  ))}
                </View>
              </View>
            )}

            {hasQuery && !hasResults && (
              <View style={styles.noResults}>
                <Feather
                  name="search"
                  size={32}
                  color={Colors.textTertiary}
                />
                <Text style={styles.noResultsTitle}>No matches</Text>
                <Text style={styles.noResultsSub}>
                  Try a different word, era, or size
                </Text>
              </View>
            )}

            {hasQuery &&
              (tab === "all" || tab === "products") &&
              (results.categories.length > 0 ||
                results.eras.length > 0 ||
                results.sizes.length > 0) && (
                <View style={styles.section}>
                  <Text style={styles.sectionLabel}>Filters</Text>
                  <View style={styles.filterChips}>
                    {results.categories.map((c) => (
                      <Pressable
                        key={`cat-${c}`}
                        style={styles.filterChip}
                        onPress={() => applyFilter("category", c)}
                      >
                        <Feather name="tag" size={12} color={Colors.text} />
                        <Text style={styles.filterChipText}>{c}</Text>
                      </Pressable>
                    ))}
                    {results.eras.map((e) => (
                      <Pressable
                        key={`era-${e}`}
                        style={styles.filterChip}
                        onPress={() => applyFilter("era", e)}
                      >
                        <Feather name="clock" size={12} color={Colors.text} />
                        <Text style={styles.filterChipText}>{e}</Text>
                      </Pressable>
                    ))}
                    {results.sizes.map((s) => (
                      <Pressable
                        key={`size-${s}`}
                        style={styles.filterChip}
                        onPress={() => applyFilter("size", s)}
                      >
                        <Feather name="maximize-2" size={12} color={Colors.text} />
                        <Text style={styles.filterChipText}>Size {s}</Text>
                      </Pressable>
                    ))}
                  </View>
                </View>
              )}

            {hasQuery && (tab === "all" || tab === "shops") && results.shops.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionLabel}>
                  Shops · {results.shops.length}
                </Text>
                {results.shops.map((s) => (
                  <Pressable
                    key={s.id}
                    style={styles.shopRow}
                    onPress={() => router.push(`/shop/${s.id}`)}
                  >
                    <Image
                      source={{ uri: s.storefrontImage }}
                      style={styles.shopAvatar}
                      contentFit="cover"
                    />
                    <View style={{ flex: 1 }}>
                      <Text style={styles.shopName}>{s.name}</Text>
                      <Text style={styles.shopMeta}>
                        {s.city} · {s.type === "vintage" ? "Vintage" : "Independent"}
                      </Text>
                    </View>
                    <Feather
                      name="chevron-right"
                      size={18}
                      color={Colors.textTertiary}
                    />
                  </Pressable>
                ))}
              </View>
            )}

            {hasQuery && (tab === "all" || tab === "products") && results.products.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionLabel}>
                  Pieces · {results.products.length}
                </Text>
                <View style={styles.productGrid}>
                  {results.products.map((p) => (
                    <Pressable
                      key={p.id}
                      style={styles.productItem}
                      onPress={() => router.push(`/product/${p.id}`)}
                    >
                      <Image
                        source={{ uri: p.imageUrl }}
                        style={styles.productImg}
                        contentFit="cover"
                      />
                      <Text style={styles.productPrice}>£{p.price}</Text>
                      <Text style={styles.productTitle} numberOfLines={1}>
                        {p.title}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              </View>
            )}
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    gap: 4,
  },
  backBtn: {
    width: 36,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  inputWrap: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.surface,
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 40,
  },
  input: {
    flex: 1,
    fontFamily: "Inter_400Regular",
    fontSize: 15,
    color: Colors.text,
    padding: 0,
  },
  tabs: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingTop: 14,
    gap: 8,
  },
  tab: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  tabActive: {
    backgroundColor: Colors.text,
    borderColor: Colors.text,
  },
  tabText: {
    fontFamily: "Inter_500Medium",
    fontSize: 12,
    color: Colors.textSecondary,
  },
  tabTextActive: { color: "#fff" },
  emptyState: { paddingHorizontal: 20, paddingTop: 28 },
  sectionLabel: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 11,
    color: Colors.textTertiary,
    letterSpacing: 1.5,
    textTransform: "uppercase",
    marginBottom: 14,
  },
  trendingWrap: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  trendChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 9,
    backgroundColor: Colors.surface,
    borderRadius: 20,
  },
  trendChipText: {
    fontFamily: "Inter_500Medium",
    fontSize: 13,
    color: Colors.text,
  },
  browseGrid: { gap: 1, backgroundColor: Colors.border, borderRadius: 8, overflow: "hidden" },
  browseItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 18,
    paddingVertical: 18,
    backgroundColor: Colors.background,
  },
  browseText: {
    fontFamily: "PlayfairDisplay_700Bold",
    fontSize: 18,
    color: Colors.text,
  },
  eraRow: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  eraChip: {
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  eraChipText: {
    fontFamily: "Inter_500Medium",
    fontSize: 13,
    color: Colors.text,
  },
  section: { paddingHorizontal: 20, paddingTop: 28 },
  filterChips: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  filterChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: Colors.surface,
    borderRadius: 20,
  },
  filterChipText: {
    fontFamily: "Inter_500Medium",
    fontSize: 13,
    color: Colors.text,
  },
  shopRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    gap: 14,
  },
  shopAvatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: Colors.surface,
  },
  shopName: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 15,
    color: Colors.text,
  },
  shopMeta: {
    fontFamily: "Inter_400Regular",
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  productGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  productItem: {
    width: "48%",
  },
  productImg: {
    width: "100%",
    aspectRatio: 0.85,
    backgroundColor: Colors.surface,
    borderRadius: 4,
    marginBottom: 8,
  },
  productPrice: {
    fontFamily: "Inter_700Bold",
    fontSize: 14,
    color: Colors.text,
  },
  productTitle: {
    fontFamily: "Inter_400Regular",
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  noResults: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 80,
    gap: 10,
  },
  noResultsTitle: {
    fontFamily: "PlayfairDisplay_700Bold",
    fontSize: 18,
    color: Colors.text,
  },
  noResultsSub: {
    fontFamily: "Inter_400Regular",
    fontSize: 13,
    color: Colors.textSecondary,
  },
});
