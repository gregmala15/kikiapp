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
import {
  SEED_PRODUCTS,
  Product,
  getProductById,
  getRecommendationsFromUsers,
  getUserById,
  getLikesForUser,
  SEED_USERS,
} from "@/constants/seed-data";
import { ProductCard } from "@/components/ProductCard";
import { useAppContext } from "@/contexts/AppContext";
import { useAuth } from "@/contexts/AuthContext";

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
  const { user } = useAuth();
  const {
    cartCount,
    followedShopIds,
    followedUserIds,
    toggleFollowUser,
    styleInfluences,
    savedProductIds,
    myStyleWeight,
  } = useAppContext();
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

  const followingFeed = useMemo<
    Array<{ product: Product; recommendedBy?: string; recommendedAt?: string }>
  >(() => {
    if (followedShopIds.length === 0 && followedUserIds.length === 0) {
      return [];
    }

    const seen = new Set<string>();
    const items: Array<{
      product: Product;
      recommendedBy?: string;
      recommendedAt?: string;
      sortKey: number;
    }> = [];

    // 1) Newest products from followed shops first
    const shopProducts = SEED_PRODUCTS.filter((p) =>
      followedShopIds.includes(p.shopId),
    );
    // Use trailing numeric portion of id as a recency proxy (higher = newer)
    shopProducts
      .map((p) => ({
        product: p,
        sortKey: parseInt(p.id.replace(/\D/g, ""), 10) || 0,
      }))
      .sort((a, b) => b.sortKey - a.sortKey)
      .forEach((entry) => {
        if (seen.has(entry.product.id)) return;
        seen.add(entry.product.id);
        items.push({ product: entry.product, sortKey: entry.sortKey + 1e12 });
      });

    // 2) Recommendations from followed users (newest recommendation first)
    const recs = getRecommendationsFromUsers(followedUserIds).sort(
      (a, b) =>
        new Date(b.recommendedAt).getTime() -
        new Date(a.recommendedAt).getTime(),
    );
    recs.forEach((rec) => {
      if (seen.has(rec.productId)) return;
      const product = getProductById(rec.productId);
      if (!product) return;
      const recommender = getUserById(rec.recommenderId);
      seen.add(product.id);
      items.push({
        product,
        recommendedBy: recommender?.fullName,
        recommendedAt: rec.recommendedAt,
        sortKey: new Date(rec.recommendedAt).getTime(),
      });
    });

    return items.sort((a, b) => b.sortKey - a.sortKey);
  }, [followedShopIds, followedUserIds]);

  // -------------------------------------------------------------------------
  // STYLE BLEND — Weighted For You feed composition
  // -------------------------------------------------------------------------
  // Each product gets a relevance score equal to the sum of every signal
  // that vouches for it, where each signal is the percentage (%) the user
  // has assigned to that source in their blend:
  //
  //   score(product) =
  //       (savedByMe ? myStyleWeight : 0)                       // "Me" share
  //     + sum( inf.weight  for each influence user that liked product )
  //     + DISCOVERY_BASELINE                                    // tie-breaker
  //
  // Why this works (no ML required):
  //   - If Luca = 40% and Sofia = 20%, a product Luca liked outranks one
  //     Sofia liked because 40 > 20 — exactly what the % means.
  //   - A product Luca AND Sofia both liked stacks (40 + 20 = 60), so
  //     consensus among influences floats to the top organically.
  //   - DISCOVERY_BASELINE keeps unrated items present (otherwise the feed
  //     would collapse once the user has any influences). Setting it to 1
  //     ensures any influenced product (which has weight ≥ STYLE_BLEND_STEP)
  //     always outranks pure discovery items.
  //   - Stable tie-break by SEED_PRODUCTS index so equal-score items keep
  //     a deterministic order across renders.
  // -------------------------------------------------------------------------
  const forYouFeed = useMemo<Product[]>(() => {
    const DISCOVERY_BASELINE = 1;

    // Defensive: only consider influences that belong to the current user.
    const ownInfluences = styleInfluences.filter(
      (inf) => !user || inf.userId === user.id,
    );

    // Pre-compute likes per influence user → kept as a list so we can score
    // per product in O(influences) rather than building a global set.
    const influenceLikes = ownInfluences.map((inf) => ({
      weight: inf.weight,
      likedSet: new Set(getLikesForUser(inf.influenceUserId)),
    }));

    const savedSet = new Set(savedProductIds);

    type Scored = { product: Product; score: number; index: number };
    const scored: Scored[] = SEED_PRODUCTS.map((product, index) => {
      let score = DISCOVERY_BASELINE;

      // "Me" share — only counts when the user has actually saved this piece.
      if (savedSet.has(product.id)) {
        score += myStyleWeight;
      }

      // Each matching influence adds its own % to the product's score.
      for (const inf of influenceLikes) {
        if (inf.likedSet.has(product.id)) score += inf.weight;
      }

      return { product, score, index };
    });

    scored.sort((a, b) =>
      b.score !== a.score ? b.score - a.score : a.index - b.index,
    );

    return scored.map((s) => s.product);
  }, [styleInfluences, savedProductIds, user?.id, myStyleWeight]);

  const filtered = useMemo(() => {
    let list: Product[] =
      feedMode === "following"
        ? followingFeed.map((f) => f.product)
        : forYouFeed;

    if (selectedCategory !== "All") {
      list = list.filter((p) => p.category === selectedCategory);
    }
    if (eraFilter) list = list.filter((p) => p.era === eraFilter);
    if (sizeFilter) list = list.filter((p) => p.size === sizeFilter);
    return list;
  }, [feedMode, followingFeed, forYouFeed, selectedCategory, eraFilter, sizeFilter]);

  const recommendationByProductId = useMemo(() => {
    const map = new Map<string, string>();
    followingFeed.forEach((f) => {
      if (f.recommendedBy) map.set(f.product.id, f.recommendedBy);
    });
    return map;
  }, [followingFeed]);

  const suggestedPeople = useMemo(
    () =>
      SEED_USERS.filter((u) => !followedUserIds.includes(u.id)).slice(0, 5),
    [followedUserIds],
  );

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
        renderItem={({ item }) => {
          const recBy = recommendationByProductId.get(item.id);
          return (
            <View>
              {feedMode === "following" && recBy && (
                <View style={styles.recBanner}>
                  <Feather name="star" size={11} color={Colors.accent} />
                  <Text style={styles.recBannerText}>
                    Recommended by {recBy}
                  </Text>
                </View>
              )}
              <ProductCard product={item} />
            </View>
          );
        }}
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
          feedMode === "following" &&
          followedShopIds.length === 0 &&
          followedUserIds.length === 0 ? (
            <View style={styles.empty}>
              <Feather name="users" size={36} color={Colors.textTertiary} />
              <Text style={styles.emptyTitle}>Build your feed</Text>
              <Text style={styles.emptyText}>
                Follow shops and people to build your feed.
              </Text>

              {suggestedPeople.length > 0 && (
                <View style={styles.suggestWrap}>
                  <Text style={styles.suggestLabel}>People to follow</Text>
                  {suggestedPeople.map((p) => (
                    <View key={p.id} style={styles.suggestRow}>
                      <Pressable
                        style={styles.suggestInfo}
                        onPress={() => router.push(`/user/${p.id}`)}
                        testID={`open-user-${p.id}`}
                      >
                        <View style={styles.suggestAvatar}>
                          <Text style={styles.suggestAvatarText}>
                            {p.fullName
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </Text>
                        </View>
                        <View>
                          <Text style={styles.suggestName}>{p.fullName}</Text>
                          <Text style={styles.suggestBio}>{p.bio}</Text>
                        </View>
                      </Pressable>
                      <Pressable
                        style={styles.followBtn}
                        onPress={() => toggleFollowUser(p.id)}
                        testID={`follow-user-${p.id}`}
                      >
                        <Text style={styles.followBtnText}>Follow</Text>
                      </Pressable>
                    </View>
                  ))}
                </View>
              )}

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
  recBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 8,
  },
  recBannerText: {
    fontFamily: "Inter_500Medium",
    fontSize: 11,
    color: Colors.textSecondary,
    letterSpacing: 0.3,
  },
  suggestWrap: {
    width: "100%",
    marginTop: 24,
    gap: 12,
  },
  suggestLabel: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 11,
    color: Colors.textTertiary,
    letterSpacing: 1.5,
    textTransform: "uppercase",
    marginBottom: 4,
  },
  suggestRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 8,
  },
  suggestInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  suggestAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  suggestAvatarText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 12,
    color: Colors.text,
    letterSpacing: 0.5,
  },
  suggestName: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 14,
    color: Colors.text,
  },
  suggestBio: {
    fontFamily: "Inter_400Regular",
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 1,
  },
  followBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: Colors.text,
  },
  followBtnText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 12,
    color: Colors.text,
  },
});
