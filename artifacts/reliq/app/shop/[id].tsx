import React, { useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  FlatList,
  Dimensions,
  Platform,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather, Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import * as Haptics from "expo-haptics";
import Colors from "@/constants/colors";
import {
  SEED_SHOPS,
  getProductsByShop,
  getReviewsForShop,
  getShopRatingSummary,
} from "@/constants/seed-data";
import { useAppContext } from "@/contexts/AppContext";
import { useAuth } from "@/contexts/AuthContext";

const { width } = Dimensions.get("window");
const CARD_WIDTH = (width - 48) / 2;

export default function ShopProfileScreen() {
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user } = useAuth();
  const {
    isFollowingShop,
    toggleFollowShop,
    isSaved,
    toggleSaved,
    addToCart,
    sendMessage,
    showSaveToast,
    reviews,
    hasPurchasedFromShop,
    hasReviewedShop,
  } = useAppContext();

  const shop = SEED_SHOPS.find((s) => s.id === id);
  const products = useMemo(
    () => (shop ? getProductsByShop(shop.id) : []),
    [shop?.id]
  );
  const following = shop ? isFollowingShop(shop.id) : false;
  const shopReviews = useMemo(
    () => (shop ? getReviewsForShop(shop.id, reviews) : []),
    [shop?.id, reviews],
  );
  const rating = useMemo(
    () =>
      shop ? getShopRatingSummary(shop.id, reviews) : { avg: 0, count: 0 },
    [shop?.id, reviews],
  );
  const canReview = shop ? hasPurchasedFromShop(shop.id) : false;
  const alreadyReviewed = shop ? hasReviewedShop(shop.id) : false;

  if (!shop) {
    return (
      <View style={styles.container}>
        <Pressable
          style={[styles.backBtn, { top: insets.top + 10 }]}
          onPress={() => router.back()}
        >
          <Feather name="arrow-left" size={20} color="#fff" />
        </Pressable>
      </View>
    );
  }

  function handleFollow() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    toggleFollowShop(shop!.id);
  }

  async function handleMessage() {
    if (!user) {
      router.push("/(auth)/login");
      return;
    }
    await sendMessage({
      toId: shop!.id,
      toName: shop!.name,
      content: `Hi ${shop!.name}! I love your shop. Do you have any new arrivals coming soon?`,
      shopId: shop!.id,
    });
    router.push(`/conversation/${[user.id, shop!.id].sort().join("_")}`);
  }

  return (
    <View style={[styles.container, { backgroundColor: Colors.background }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.heroWrapper}>
          <Image
            source={{ uri: shop.storefrontImage }}
            style={[styles.hero, { height: 280 }]}
            contentFit="cover"
          />
          <View style={styles.heroOverlay} />
          <View
            style={[
              styles.heroNav,
              {
                paddingTop:
                  Platform.OS === "web" ? 67 : insets.top + 4,
              },
            ]}
          >
            <Pressable style={styles.navCircle} onPress={() => router.back()}>
              <Feather name="arrow-left" size={20} color="#fff" />
            </Pressable>
          </View>
          <View style={styles.heroInfo}>
            <View style={styles.heroTags}>
              <View
                style={[
                  styles.typeBadge,
                  shop.type === "vintage"
                    ? styles.vintageBadge
                    : styles.indyBadge,
                ]}
              >
                <Text style={styles.typeText}>
                  {shop.type === "vintage" ? "Vintage" : "Independent"}
                </Text>
              </View>
              <View style={styles.cityBadge}>
                <Text style={styles.cityText}>{shop.city}</Text>
              </View>
            </View>
            <Text style={styles.shopName}>{shop.name}</Text>
            <View style={styles.heroMetaRow}>
              <Text style={styles.followers}>
                {shop.followerCount.toLocaleString()} followers
              </Text>
              {rating.count > 0 && (
                <View style={styles.heroRating}>
                  <Ionicons name="star" size={12} color={Colors.accent} />
                  <Text style={styles.heroRatingText}>
                    {rating.avg.toFixed(1)} · {rating.count}
                  </Text>
                </View>
              )}
            </View>
          </View>
        </View>

        <View style={styles.content}>
          <View style={styles.actions}>
            <Pressable
              style={[styles.followBtn, following && styles.followingBtn]}
              onPress={handleFollow}
            >
              <Ionicons
                name={following ? "checkmark" : "add"}
                size={18}
                color={following ? Colors.accent : "#fff"}
              />
              <Text
                style={[
                  styles.followBtnText,
                  following && styles.followingBtnText,
                ]}
              >
                {following ? "Following" : "Follow"}
              </Text>
            </Pressable>
            <Pressable style={styles.msgBtn} onPress={handleMessage}>
              <Feather name="message-circle" size={18} color={Colors.text} />
            </Pressable>
          </View>

          <View style={styles.aboutSection}>
            <View style={styles.aboutHeaderRow}>
              <Text style={styles.aboutTitle}>Our Story</Text>
              {shop.founded !== undefined && (
                <Text style={styles.aboutMeta}>
                  Est. {shop.founded} · {shop.city}
                </Text>
              )}
            </View>
            <Text style={styles.description}>
              {shop.story ?? shop.description}
            </Text>
            {shop.story && (
              <Text style={styles.aboutTagline}>{shop.description}</Text>
            )}
            {shop.highlights && shop.highlights.length > 0 && (
              <View style={styles.highlights}>
                {shop.highlights.map((h) => (
                  <View key={h} style={styles.highlightChip}>
                    <Feather name="check" size={11} color={Colors.accent} />
                    <Text style={styles.highlightText}>{h}</Text>
                  </View>
                ))}
              </View>
            )}
          </View>

          <View style={styles.social}>
            <Feather name="instagram" size={14} color={Colors.textSecondary} />
            <Text style={styles.socialHandle}>{shop.socialHandle}</Text>
          </View>

          {shop.tags.length > 0 && (
            <View style={styles.tags}>
              {shop.tags.map((tag) => (
                <View key={tag} style={styles.tag}>
                  <Text style={styles.tagText}>#{tag}</Text>
                </View>
              ))}
            </View>
          )}

          <View style={styles.productsHeader}>
            <Text style={styles.productsTitle}>The Rack</Text>
            <Text style={styles.productsCount}>
              {products.length} piece{products.length !== 1 ? "s" : ""}
            </Text>
          </View>

          <View style={styles.productGrid}>
            {products.map((product) => {
              const saved = isSaved(product.id);
              return (
                <Pressable
                  key={product.id}
                  style={styles.productCard}
                  onPress={() => router.push(`/product/${product.id}`)}
                >
                  <View style={styles.productImageWrapper}>
                    <Image
                      source={{ uri: product.imageUrl }}
                      style={styles.productImage}
                      contentFit="cover"
                    />
                    {(product.isSold || product.quantity === 0) && (
                      <View style={styles.soldOverlay}>
                        <Text style={styles.soldText}>SOLD</Text>
                      </View>
                    )}
                    {product.isVintage && (
                      <View style={styles.vintagePill}>
                        <Text style={styles.vintagePillText}>V</Text>
                      </View>
                    )}
                    <Pressable
                      style={styles.saveBtn}
                      onPress={() => {
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                        const wasSaved = saved;
                        toggleSaved(product.id);
                        if (!wasSaved) showSaveToast(product.id);
                      }}
                    >
                      <Ionicons
                        name={saved ? "heart" : "heart-outline"}
                        size={16}
                        color={saved ? Colors.danger : "#fff"}
                      />
                    </Pressable>
                  </View>
                  <View style={styles.productInfo}>
                    <Text style={styles.productTitle} numberOfLines={1}>
                      {product.title}
                    </Text>
                    <View style={styles.productMeta}>
                      <Text style={styles.productPrice}>
                        £{product.price}
                      </Text>
                      <Text style={styles.productSize}>{product.size}</Text>
                    </View>
                  </View>
                </Pressable>
              );
            })}
          </View>

          <View style={styles.reviewsSection}>
            <View style={styles.reviewsHeaderRow}>
              <Text style={styles.reviewsTitle}>Reviews</Text>
              {rating.count > 0 && (
                <View style={styles.reviewsSummary}>
                  <Ionicons name="star" size={14} color={Colors.accent} />
                  <Text style={styles.reviewsSummaryText}>
                    {rating.avg.toFixed(1)}
                  </Text>
                  <Text style={styles.reviewsCount}>({rating.count})</Text>
                </View>
              )}
            </View>

            {shopReviews.length === 0 ? (
              <Text style={styles.reviewsEmpty}>
                No reviews yet — be the first.
              </Text>
            ) : (
              <View style={styles.reviewsList}>
                {shopReviews.slice(0, 3).map((r) => (
                  <View key={r.id} style={styles.reviewCard}>
                    <View style={styles.reviewHead}>
                      <View style={styles.reviewStars}>
                        {[1, 2, 3, 4, 5].map((n) => (
                          <Ionicons
                            key={n}
                            name={n <= r.rating ? "star" : "star-outline"}
                            size={12}
                            color={Colors.accent}
                          />
                        ))}
                      </View>
                      <Text style={styles.reviewAuthor}>{r.userName}</Text>
                    </View>
                    <Text style={styles.reviewProduct}>
                      Verified buyer
                      {r.productTitle ? ` · ${r.productTitle}` : ""}
                    </Text>
                    {r.body.length > 0 && (
                      <Text style={styles.reviewBody}>{r.body}</Text>
                    )}
                  </View>
                ))}
              </View>
            )}

            {alreadyReviewed ? (
              <View style={styles.reviewCta}>
                <Feather name="check" size={14} color={Colors.success} />
                <Text style={styles.reviewCtaTextMuted}>
                  You reviewed this shop
                </Text>
              </View>
            ) : canReview ? (
              <Pressable
                style={styles.reviewBtn}
                onPress={() => router.push(`/review/${shop.id}`)}
                testID="shop-write-review"
              >
                <Feather name="edit-3" size={14} color="#fff" />
                <Text style={styles.reviewBtnText}>Write a review</Text>
              </Pressable>
            ) : (
              <View style={styles.reviewCta}>
                <Feather name="lock" size={13} color={Colors.textTertiary} />
                <Text style={styles.reviewCtaTextMuted}>
                  Buy something from this shop to leave a review
                </Text>
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  heroWrapper: { position: "relative" },
  hero: { width: "100%" },
  heroOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 160,
    backgroundColor: "rgba(0,0,0,0.35)",
  },
  heroNav: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
  },
  navCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.4)",
    alignItems: "center",
    justifyContent: "center",
  },
  heroInfo: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
    gap: 6,
  },
  heroTags: { flexDirection: "row", gap: 8 },
  typeBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 4,
  },
  vintageBadge: { backgroundColor: Colors.accent },
  indyBadge: { backgroundColor: "rgba(255,255,255,0.25)" },
  typeText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 10,
    color: "#fff",
    letterSpacing: 0.5,
  },
  cityBadge: {
    backgroundColor: "rgba(0,0,0,0.4)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 4,
  },
  cityText: {
    fontFamily: "Inter_500Medium",
    fontSize: 10,
    color: "#fff",
  },
  shopName: {
    fontFamily: "PlayfairDisplay_700Bold",
    fontSize: 28,
    color: "#fff",
  },
  followers: {
    fontFamily: "Inter_400Regular",
    fontSize: 13,
    color: "rgba(255,255,255,0.8)",
  },
  content: { padding: 20, gap: 18 },
  actions: { flexDirection: "row", gap: 12 },
  followBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    backgroundColor: Colors.text,
    paddingVertical: 12,
    borderRadius: 6,
  },
  followingBtn: {
    backgroundColor: Colors.accentLight,
    borderWidth: 1.5,
    borderColor: Colors.accent,
  },
  followBtnText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 14,
    color: "#fff",
  },
  followingBtnText: { color: Colors.accent },
  msgBtn: {
    width: 48,
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
  },
  description: {
    fontFamily: "Inter_400Regular",
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 21,
  },
  aboutSection: {
    marginTop: 4,
    paddingTop: 18,
    paddingBottom: 18,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: Colors.border,
    gap: 10,
  },
  aboutHeaderRow: {
    flexDirection: "row",
    alignItems: "baseline",
    justifyContent: "space-between",
    gap: 12,
  },
  aboutTitle: {
    fontFamily: "PlayfairDisplay_700Bold",
    fontSize: 20,
    color: Colors.text,
    letterSpacing: -0.3,
  },
  aboutMeta: {
    fontFamily: "Inter_500Medium",
    fontSize: 11,
    color: Colors.textTertiary,
    letterSpacing: 0.8,
    textTransform: "uppercase",
  },
  aboutTagline: {
    fontFamily: "PlayfairDisplay_400Regular_Italic",
    fontSize: 13,
    color: Colors.textTertiary,
    lineHeight: 19,
    marginTop: -2,
  },
  highlights: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 4,
  },
  highlightChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: Colors.accentLight,
    borderRadius: 14,
  },
  highlightText: {
    fontFamily: "Inter_500Medium",
    fontSize: 12,
    color: Colors.accentDark,
  },
  heroMetaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    flexWrap: "wrap",
  },
  heroRating: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    backgroundColor: "rgba(0,0,0,0.4)",
    borderRadius: 4,
  },
  heroRatingText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 11,
    color: "#fff",
  },
  reviewsSection: {
    marginTop: 8,
    paddingTop: 18,
    borderTopWidth: 1,
    borderColor: Colors.border,
    gap: 14,
  },
  reviewsHeaderRow: {
    flexDirection: "row",
    alignItems: "baseline",
    justifyContent: "space-between",
  },
  reviewsTitle: {
    fontFamily: "PlayfairDisplay_700Bold",
    fontSize: 22,
    color: Colors.text,
    letterSpacing: -0.3,
  },
  reviewsSummary: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  reviewsSummaryText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 14,
    color: Colors.text,
  },
  reviewsCount: {
    fontFamily: "Inter_400Regular",
    fontSize: 13,
    color: Colors.textTertiary,
  },
  reviewsEmpty: {
    fontFamily: "Inter_400Regular",
    fontSize: 13,
    color: Colors.textTertiary,
    fontStyle: "italic",
  },
  reviewsList: {
    gap: 14,
  },
  reviewCard: {
    padding: 14,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 10,
    gap: 6,
  },
  reviewHead: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  reviewStars: {
    flexDirection: "row",
    gap: 2,
  },
  reviewAuthor: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 13,
    color: Colors.text,
  },
  reviewProduct: {
    fontFamily: "Inter_500Medium",
    fontSize: 11,
    color: Colors.accentDark,
    letterSpacing: 0.3,
  },
  reviewBody: {
    fontFamily: "Inter_400Regular",
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 19,
    marginTop: 2,
  },
  reviewBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: Colors.text,
    paddingVertical: 12,
    borderRadius: 6,
  },
  reviewBtnText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 13,
    color: "#fff",
  },
  reviewCta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 14,
    backgroundColor: Colors.card,
    borderRadius: 6,
  },
  reviewCtaTextMuted: {
    flex: 1,
    fontFamily: "Inter_400Regular",
    fontSize: 13,
    color: Colors.textSecondary,
  },
  social: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  socialHandle: {
    fontFamily: "Inter_500Medium",
    fontSize: 13,
    color: Colors.textSecondary,
  },
  tags: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  tag: {
    backgroundColor: Colors.card,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  tagText: {
    fontFamily: "Inter_400Regular",
    fontSize: 11,
    color: Colors.textSecondary,
  },
  productsHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 4,
  },
  productsTitle: {
    fontFamily: "PlayfairDisplay_700Bold",
    fontSize: 22,
    color: Colors.text,
  },
  productsCount: {
    fontFamily: "Inter_400Regular",
    fontSize: 13,
    color: Colors.textSecondary,
  },
  productGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  productCard: {
    width: CARD_WIDTH,
    backgroundColor: Colors.surface,
    borderRadius: 10,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: Colors.border,
  },
  productImageWrapper: {
    width: CARD_WIDTH,
    height: CARD_WIDTH,
    backgroundColor: Colors.card,
    position: "relative",
  },
  productImage: { width: "100%", height: "100%" },
  soldOverlay: {
    position: "absolute",
    inset: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    alignItems: "center",
    justifyContent: "center",
  },
  soldText: {
    fontFamily: "Inter_700Bold",
    fontSize: 14,
    color: "#fff",
    letterSpacing: 4,
  },
  vintagePill: {
    position: "absolute",
    top: 8,
    left: 8,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: Colors.accent,
    alignItems: "center",
    justifyContent: "center",
  },
  vintagePillText: {
    fontFamily: "Inter_700Bold",
    fontSize: 10,
    color: "#fff",
  },
  saveBtn: {
    position: "absolute",
    top: 6,
    right: 6,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "rgba(0,0,0,0.35)",
    alignItems: "center",
    justifyContent: "center",
  },
  productInfo: { padding: 10, gap: 3 },
  productTitle: {
    fontFamily: "Inter_500Medium",
    fontSize: 12,
    color: Colors.text,
  },
  productMeta: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  productPrice: {
    fontFamily: "Inter_700Bold",
    fontSize: 14,
    color: Colors.text,
  },
  productSize: {
    fontFamily: "Inter_400Regular",
    fontSize: 11,
    color: Colors.textSecondary,
  },
  backBtn: {
    position: "absolute",
    left: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.4)",
    alignItems: "center",
    justifyContent: "center",
  },
});
