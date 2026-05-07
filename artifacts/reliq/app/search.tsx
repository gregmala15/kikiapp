import React, { useEffect, useMemo, useState, useCallback } from "react";
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
import AsyncStorage from "@react-native-async-storage/async-storage";
import Colors from "@/constants/colors";
import {
  SEED_PRODUCTS,
  SEED_SHOPS,
  SEED_USERS,
  Product,
  Shop,
  CommunityUser,
  ProductCategory,
  getProductsByShop,
  getShopById,
} from "@/constants/seed-data";
import { useAuth } from "@/contexts/AuthContext";

const CATEGORIES: ProductCategory[] = [
  "Outerwear",
  "Tops",
  "Dresses",
  "Accessories",
  "Footwear",
  "Archive / Rare",
];

const ERAS = ["Y2K", "90s", "80s", "70s", "60s", "Contemporary"];
const TRENDING = ["Vintage Levis", "Archive", "Y2K", "Italian leather", "Rome"];
const RECENT_KEY = "kiki:recent_searches";
const VERIFIED_THRESHOLD = 2500;
const MIN_QUERY_LEN = 3;

interface SearchResults {
  products: Product[];
  shops: Shop[];
  users: CommunityUser[];
  categories: string[];
  eras: string[];
  sizes: string[];
}

type SearchTab = "items" | "shops" | "people";

function normalize(s: string): string {
  return s.toLowerCase().trim();
}

function matchesEra(era: string, q: string): boolean {
  const e = normalize(era);
  if (e.includes(q)) return true;
  // Strip "19" prefix: "1990s" → "90s"
  const stripped = e.replace(/^19/, "");
  if (stripped.includes(q)) return true;
  // Allow "1990" or "90" to match "90s"
  const digits = q.replace(/\D/g, "");
  if (digits && (e.includes(digits) || e.includes(digits.slice(-2)))) return true;
  return false;
}

function search(query: string, currentUserId?: string): SearchResults {
  const q = normalize(query);
  if (!q) {
    return {
      products: [],
      shops: [],
      users: [],
      categories: [],
      eras: [],
      sizes: [],
    };
  }

  const products = SEED_PRODUCTS.filter((p) => {
    const fields = [
      p.title,
      p.description,
      p.category,
      p.size,
      p.condition,
      ...(p.tags ?? []),
    ]
      .join(" ")
      .toLowerCase();
    if (fields.includes(q)) return true;
    if (matchesEra(p.era, q)) return true;
    const shop = getShopById(p.shopId);
    if (shop && shop.name.toLowerCase().includes(q)) return true;
    return false;
  }).slice(0, 50);

  const shops = SEED_SHOPS.filter((s) => {
    const haystack = [s.name, s.description, s.city, s.type, ...s.tags]
      .join(" ")
      .toLowerCase();
    return haystack.includes(q);
  }).slice(0, 20);

  // Match across name / username / city / bio so users can be found by
  // taste hints ("vintage", "Rome") not just exact names. Excludes self.
  const users = SEED_USERS.filter((u) => {
    if (currentUserId && u.id === currentUserId) return false;
    const haystack = [u.fullName, u.username, u.city, u.bio]
      .join(" ")
      .toLowerCase();
    return haystack.includes(q);
  }).slice(0, 30);

  const categories = CATEGORIES.filter((c) => c.toLowerCase().includes(q));
  const eras = ERAS.filter((e) => matchesEra(e, q));
  const sizes = ["XS", "S", "M", "L", "XL", "One Size"].filter(
    (s) => s.toLowerCase() === q || s.toLowerCase().startsWith(q),
  );

  return { products, shops, users, categories, eras, sizes };
}

export default function SearchScreen() {
  const insets = useSafeAreaInsets();
  const { user: currentUser } = useAuth();
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [recent, setRecent] = useState<string[]>([]);
  const [tab, setTab] = useState<SearchTab>("items");
  const topPad = Platform.OS === "web" ? 67 : insets.top;

  // Debounce input by 300ms. Treat queries shorter than 3 chars as empty
  // so we don't show noisy "match anything containing 'a'" results.
  useEffect(() => {
    const t = setTimeout(() => {
      setDebouncedQuery(query.trim().length < MIN_QUERY_LEN ? "" : query);
    }, 300);
    return () => clearTimeout(t);
  }, [query]);

  // Load recent searches
  useEffect(() => {
    AsyncStorage.getItem(RECENT_KEY).then((v) => {
      if (v) {
        try {
          const arr = JSON.parse(v);
          if (Array.isArray(arr)) setRecent(arr.slice(0, 6));
        } catch {}
      }
    });
  }, []);

  const saveRecent = useCallback(
    async (term: string) => {
      const t = term.trim();
      if (!t) return;
      const next = [t, ...recent.filter((r) => r.toLowerCase() !== t.toLowerCase())].slice(0, 6);
      setRecent(next);
      await AsyncStorage.setItem(RECENT_KEY, JSON.stringify(next));
    },
    [recent],
  );

  const clearRecent = useCallback(async () => {
    setRecent([]);
    await AsyncStorage.removeItem(RECENT_KEY);
  }, []);

  const results = useMemo(
    () => search(debouncedQuery, currentUser?.id),
    [debouncedQuery, currentUser?.id],
  );

  const hasQuery = debouncedQuery.trim().length > 0;
  const hasResults =
    results.products.length > 0 ||
    results.shops.length > 0 ||
    results.users.length > 0 ||
    results.categories.length > 0 ||
    results.eras.length > 0 ||
    results.sizes.length > 0;

  function openUser(u: CommunityUser) {
    saveRecent(debouncedQuery || u.fullName);
    router.push(`/user/${u.id}`);
  }

  function applyFilter(kind: "category" | "era" | "size", value: string) {
    Keyboard.dismiss();
    saveRecent(value);
    router.replace({
      pathname: "/(tabs)",
      params: { [kind]: value },
    });
  }

  function openProduct(p: Product) {
    saveRecent(debouncedQuery || p.title);
    router.push(`/product/${p.id}`);
  }

  function openShop(s: Shop) {
    saveRecent(debouncedQuery || s.name);
    router.push(`/shop/${s.id}`);
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
            onSubmitEditing={() => saveRecent(query)}
          />
          {query.length > 0 && (
            <Pressable onPress={() => setQuery("")} hitSlop={8}>
              <Feather name="x-circle" size={16} color={Colors.textTertiary} />
            </Pressable>
          )}
        </View>
      </View>

      {hasQuery && hasResults && (
        <View style={[styles.tabBar, { borderBottomColor: Colors.border }]}>
          {([
            { key: "items", label: "Items", count: results.products.length },
            { key: "shops", label: "Shops", count: results.shops.length },
            { key: "people", label: "People", count: results.users.length },
          ] as { key: SearchTab; label: string; count: number }[]).map((t) => {
            const active = tab === t.key;
            return (
              <Pressable
                key={t.key}
                style={styles.tab}
                onPress={() => setTab(t.key)}
                testID={`search-tab-${t.key}`}
              >
                <Text style={[styles.tabLabel, active && styles.tabLabelActive]}>
                  {t.label}
                  {t.count > 0 ? ` · ${t.count}` : ""}
                </Text>
                {active && <View style={styles.tabUnderline} />}
              </Pressable>
            );
          })}
        </View>
      )}

      <FlatList
        data={[1]}
        keyExtractor={() => "content"}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        contentContainerStyle={{ paddingBottom: insets.bottom + 40 }}
        renderItem={() => (
          <View>
            {/* EMPTY STATE */}
            {!hasQuery && (
              <View style={styles.emptyState}>
                {recent.length > 0 && (
                  <View style={{ marginBottom: 28 }}>
                    <View style={styles.recentHeader}>
                      <Text style={styles.sectionLabel}>Recent</Text>
                      <Pressable onPress={clearRecent} hitSlop={8}>
                        <Text style={styles.clearText}>Clear</Text>
                      </Pressable>
                    </View>
                    <View style={styles.trendingWrap}>
                      {recent.map((r) => (
                        <Pressable
                          key={r}
                          style={styles.trendChip}
                          onPress={() => setQuery(r)}
                        >
                          <Feather
                            name="clock"
                            size={12}
                            color={Colors.textSecondary}
                          />
                          <Text style={styles.trendChipText}>{r}</Text>
                        </Pressable>
                      ))}
                    </View>
                  </View>
                )}

                <Text style={styles.sectionLabel}>Trending</Text>
                <View style={styles.trendingWrap}>
                  {TRENDING.map((t) => (
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

                <Text style={[styles.sectionLabel, { marginTop: 36 }]}>Era</Text>
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

            {/* KEEP TYPING — user has 1-2 chars, debounce is holding back */}
            {!hasQuery && query.trim().length > 0 && (
              <View style={styles.noResults}>
                <Feather name="edit-3" size={28} color={Colors.textTertiary} />
                <Text style={styles.noResultsTitle}>Keep typing</Text>
                <Text style={styles.noResultsSub}>
                  Enter at least {MIN_QUERY_LEN} letters to search
                </Text>
              </View>
            )}

            {/* NO RESULTS */}
            {hasQuery && !hasResults && (
              <View style={styles.noResults}>
                <Feather name="search" size={32} color={Colors.textTertiary} />
                <Text style={styles.noResultsTitle}>No matches</Text>
                <Text style={styles.noResultsSub}>
                  Try a different word, era, or size
                </Text>
              </View>
            )}

            {/* FILTER QUICK CHIPS — only relevant on Items tab */}
            {hasQuery && tab === "items" &&
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

            {/* PRODUCTS — compact rows */}
            {hasQuery && tab === "items" && results.products.length > 0 && (
              <View style={styles.section}>
                <View style={styles.sectionHeaderRow}>
                  <Text style={styles.sectionLabel}>
                    Products · {results.products.length}
                  </Text>
                </View>
                <View style={styles.divider} />
                {results.products.map((p, idx) => {
                  const shop = getShopById(p.shopId);
                  return (
                    <Pressable
                      key={p.id}
                      style={[
                        styles.productRow,
                        idx < results.products.length - 1 && styles.rowBorder,
                      ]}
                      onPress={() => openProduct(p)}
                    >
                      <Image
                        source={{ uri: p.imageUrl }}
                        style={styles.productThumb}
                        contentFit="cover"
                      />
                      <View style={styles.productInfo}>
                        <View style={styles.productTopRow}>
                          <Text style={styles.productTitle} numberOfLines={1}>
                            {p.title}
                          </Text>
                          <Text style={styles.productPrice}>£{p.price}</Text>
                        </View>
                        <Text style={styles.productMeta}>
                          {p.size} · {p.era}
                        </Text>
                        {shop && (
                          <Text style={styles.productShop} numberOfLines={1}>
                            {shop.name}
                          </Text>
                        )}
                      </View>
                    </Pressable>
                  );
                })}
              </View>
            )}

            {/* PEOPLE */}
            {hasQuery && tab === "people" && results.users.length > 0 && (
              <View style={styles.section}>
                <View style={styles.sectionHeaderRow}>
                  <Text style={styles.sectionLabel}>
                    People · {results.users.length}
                  </Text>
                </View>
                <View style={styles.divider} />
                {results.users.map((u, idx) => (
                  <Pressable
                    key={u.id}
                    style={[
                      styles.shopRow,
                      idx < results.users.length - 1 && styles.rowBorder,
                    ]}
                    onPress={() => openUser(u)}
                    testID={`search-user-${u.id}`}
                  >
                    <Image
                      source={{ uri: u.avatarUrl }}
                      style={styles.shopAvatar}
                      contentFit="cover"
                    />
                    <View style={{ flex: 1 }}>
                      <Text style={styles.shopName} numberOfLines={1}>
                        {u.fullName}
                      </Text>
                      <Text style={styles.shopMeta} numberOfLines={1}>
                        @{u.username} · {u.city}
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

            {/* PER-TAB EMPTY STATE — query has results overall but not on this tab */}
            {hasQuery && hasResults && (
              (tab === "items" && results.products.length === 0) ||
              (tab === "shops" && results.shops.length === 0) ||
              (tab === "people" && results.users.length === 0)
            ) && (
              <View style={styles.noResults}>
                <Feather name="search" size={28} color={Colors.textTertiary} />
                <Text style={styles.noResultsTitle}>
                  No {tab === "items" ? "items" : tab === "shops" ? "shops" : "people"} match
                </Text>
                <Text style={styles.noResultsSub}>
                  Try the other tabs or a different word
                </Text>
              </View>
            )}

            {/* SHOPS */}
            {hasQuery && tab === "shops" && results.shops.length > 0 && (
              <View style={styles.section}>
                <View style={styles.sectionHeaderRow}>
                  <Text style={styles.sectionLabel}>
                    Shops · {results.shops.length}
                  </Text>
                </View>
                <View style={styles.divider} />
                {results.shops.map((s, idx) => {
                  const productCount = getProductsByShop(s.id).length;
                  const isVerified = s.followerCount >= VERIFIED_THRESHOLD;
                  return (
                    <Pressable
                      key={s.id}
                      style={[
                        styles.shopRow,
                        idx < results.shops.length - 1 && styles.rowBorder,
                      ]}
                      onPress={() => openShop(s)}
                    >
                      <Image
                        source={{ uri: s.storefrontImage }}
                        style={styles.shopAvatar}
                        contentFit="cover"
                      />
                      <View style={{ flex: 1 }}>
                        <View style={styles.shopNameRow}>
                          <Text style={styles.shopName} numberOfLines={1}>
                            {s.name}
                          </Text>
                          {isVerified && (
                            <Feather
                              name="check-circle"
                              size={13}
                              color={Colors.accent}
                            />
                          )}
                        </View>
                        <Text style={styles.shopMeta}>
                          {s.city} · {productCount}{" "}
                          {productCount === 1 ? "piece" : "pieces"}
                        </Text>
                      </View>
                      <Feather
                        name="chevron-right"
                        size={18}
                        color={Colors.textTertiary}
                      />
                    </Pressable>
                  );
                })}
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
  emptyState: { paddingHorizontal: 20, paddingTop: 28 },
  recentHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 14,
  },
  clearText: {
    fontFamily: "Inter_500Medium",
    fontSize: 11,
    color: Colors.textSecondary,
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
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
  browseGrid: {
    gap: 1,
    backgroundColor: Colors.border,
    borderRadius: 8,
    overflow: "hidden",
  },
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
  sectionHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginBottom: 4,
  },
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
  // Compact product row
  productRow: {
    flexDirection: "row",
    paddingVertical: 14,
    gap: 14,
  },
  rowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  productThumb: {
    width: 64,
    height: 80,
    borderRadius: 4,
    backgroundColor: Colors.surface,
  },
  productInfo: {
    flex: 1,
    justifyContent: "center",
    gap: 3,
  },
  productTopRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
  },
  productTitle: {
    flex: 1,
    fontFamily: "Inter_600SemiBold",
    fontSize: 14,
    color: Colors.text,
    letterSpacing: -0.2,
  },
  productPrice: {
    fontFamily: "Inter_700Bold",
    fontSize: 14,
    color: Colors.text,
  },
  productMeta: {
    fontFamily: "Inter_400Regular",
    fontSize: 12,
    color: Colors.textSecondary,
  },
  productShop: {
    fontFamily: "Inter_500Medium",
    fontSize: 11,
    color: Colors.textTertiary,
    letterSpacing: 0.4,
    textTransform: "uppercase",
    marginTop: 1,
  },
  // Shop row
  shopRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    gap: 14,
  },
  shopAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.surface,
  },
  shopNameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  shopName: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 14,
    color: Colors.text,
  },
  shopMeta: {
    fontFamily: "Inter_400Regular",
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  tabBar: {
    flexDirection: "row",
    paddingHorizontal: 8,
    borderBottomWidth: 1,
  },
  tab: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: "center",
  },
  tabLabel: {
    fontFamily: "Inter_500Medium",
    fontSize: 13,
    color: Colors.textSecondary,
    letterSpacing: 0.2,
  },
  tabLabelActive: {
    fontFamily: "Inter_600SemiBold",
    color: Colors.text,
  },
  tabUnderline: {
    position: "absolute",
    left: 12,
    right: 12,
    bottom: -1,
    height: 2,
    backgroundColor: Colors.text,
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
