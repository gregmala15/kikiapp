import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  Alert,
  Dimensions,
  Platform,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather, Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import * as Haptics from "expo-haptics";
import Colors from "@/constants/colors";
import { SEED_PRODUCTS, getShopById } from "@/constants/seed-data";
import { useAppContext } from "@/contexts/AppContext";
import { useAuth } from "@/contexts/AuthContext";

const { width } = Dimensions.get("window");

export default function ProductDetailScreen() {
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user } = useAuth();
  const { isSaved, toggleSaved, addToCart, sendMessage, cartCount } = useAppContext();
  const [messageText, setMessageText] = useState("");

  const product = SEED_PRODUCTS.find((p) => p.id === id);
  const shop = product ? getShopById(product.shopId) : undefined;
  const saved = product ? isSaved(product.id) : false;

  if (!product || !shop) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <Pressable style={styles.backBtn} onPress={() => router.back()}>
          <Feather name="x" size={22} color={Colors.text} />
        </Pressable>
        <View style={styles.notFound}>
          <Text style={styles.notFoundText}>Product not found</Text>
        </View>
      </View>
    );
  }

  function handleSave() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    toggleSaved(product!.id);
  }

  function handleAddToCart() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    addToCart(product!);
    Alert.alert("Added to cart", `${product!.title} has been added to your bag.`);
  }

  async function handleMessageShop() {
    if (!user) {
      router.push("/(auth)/login");
      return;
    }
    await sendMessage({
      toId: shop!.id,
      toName: shop!.name,
      content: `Hi! I'm interested in your "${product!.title}" (${product!.size}, ${product!.condition}). Is it still available?`,
      shopId: shop!.id,
      productId: product!.id,
    });
    router.push(`/conversation/${[user.id, shop!.id].sort().join("_")}`);
  }

  const isSold = product.isSold || product.quantity === 0;

  return (
    <View style={[styles.container, { backgroundColor: Colors.background }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        <View style={styles.imageWrapper}>
          <Image
            source={{ uri: product.imageUrl }}
            style={[styles.image, { height: width }]}
            contentFit="cover"
          />
          <View
            style={[
              styles.imageOverlay,
              { paddingTop: Platform.OS === "web" ? 67 : insets.top + 4 },
            ]}
          >
            <Pressable
              style={styles.backCircle}
              onPress={() => router.back()}
            >
              <Feather name="arrow-left" size={20} color="#fff" />
            </Pressable>
            <View style={styles.topRight}>
              <Pressable
                style={[styles.topCircle, saved && styles.topCircleSaved]}
                onPress={handleSave}
              >
                <Ionicons
                  name={saved ? "heart" : "heart-outline"}
                  size={20}
                  color={saved ? Colors.danger : "#fff"}
                />
              </Pressable>
              <Pressable
                style={styles.topCircle}
                onPress={() => router.push("/cart")}
              >
                <Feather name="shopping-bag" size={20} color="#fff" />
                {cartCount > 0 && (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>{cartCount}</Text>
                  </View>
                )}
              </Pressable>
            </View>
          </View>
          {isSold && (
            <View style={styles.soldOverlay}>
              <Text style={styles.soldText}>SOLD</Text>
            </View>
          )}
          <View style={styles.imageTags}>
            {product.isVintage && (
              <View style={styles.vintageBadge}>
                <Text style={styles.vintageText}>VINTAGE</Text>
              </View>
            )}
            {product.era !== "Contemporary" && (
              <View style={styles.eraBadge}>
                <Text style={styles.eraText}>{product.era}</Text>
              </View>
            )}
          </View>
        </View>

        <View style={styles.content}>
          <View style={styles.priceRow}>
            <Text style={styles.price}>£{product.price}</Text>
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryText}>{product.category}</Text>
            </View>
          </View>

          <Text style={styles.title}>{product.title}</Text>

          <View style={styles.metaGrid}>
            <View style={styles.metaItem}>
              <Text style={styles.metaLabel}>SIZE</Text>
              <Text style={styles.metaValue}>{product.size}</Text>
            </View>
            <View style={styles.metaDivider} />
            <View style={styles.metaItem}>
              <Text style={styles.metaLabel}>CONDITION</Text>
              <Text style={styles.metaValue}>{product.condition}</Text>
            </View>
            <View style={styles.metaDivider} />
            <View style={styles.metaItem}>
              <Text style={styles.metaLabel}>ERA</Text>
              <Text style={styles.metaValue}>{product.era}</Text>
            </View>
          </View>

          <Text style={styles.descLabel}>Description</Text>
          <Text style={styles.description}>{product.description}</Text>

          {product.tags && product.tags.length > 0 && (
            <View style={styles.tags}>
              {product.tags.map((tag) => (
                <View key={tag} style={styles.tag}>
                  <Text style={styles.tagText}>#{tag}</Text>
                </View>
              ))}
            </View>
          )}

          <Pressable
            style={styles.shopRow}
            onPress={() => router.push(`/shop/${shop.id}`)}
          >
            <Image
              source={{ uri: shop.storefrontImage }}
              style={styles.shopAvatar}
              contentFit="cover"
            />
            <View style={styles.shopInfo}>
              <Text style={styles.shopName}>{shop.name}</Text>
              <Text style={styles.shopMeta}>
                {shop.city} · {shop.followerCount.toLocaleString()} followers
              </Text>
            </View>
            <View style={styles.viewShopBtn}>
              <Text style={styles.viewShopText}>View Shop</Text>
            </View>
          </Pressable>
        </View>
      </ScrollView>

      <View
        style={[
          styles.footer,
          {
            paddingBottom: Platform.OS === "web" ? 24 : insets.bottom + 12,
            borderTopColor: Colors.border,
          },
        ]}
      >
        <Pressable
          style={styles.messageBtn}
          onPress={handleMessageShop}
        >
          <Feather name="message-circle" size={18} color={Colors.text} />
          <Text style={styles.messageBtnText}>Ask Shop</Text>
        </Pressable>
        <Pressable
          style={[styles.addToCartBtn, isSold && styles.addToCartBtnDisabled]}
          onPress={handleAddToCart}
          disabled={isSold}
        >
          <Feather
            name="shopping-bag"
            size={18}
            color={isSold ? Colors.textTertiary : "#fff"}
          />
          <Text
            style={[
              styles.addToCartText,
              isSold && styles.addToCartTextDisabled,
            ]}
          >
            {isSold ? "Sold Out" : "Add to Bag"}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  imageWrapper: { position: "relative" },
  image: { width: "100%" },
  imageOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  backCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.4)",
    alignItems: "center",
    justifyContent: "center",
  },
  topRight: { flexDirection: "row", gap: 8 },
  topCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.4)",
    alignItems: "center",
    justifyContent: "center",
  },
  topCircleSaved: { backgroundColor: "rgba(255,255,255,0.85)" },
  badge: {
    position: "absolute",
    top: 4,
    right: 4,
    backgroundColor: Colors.accent,
    borderRadius: 6,
    minWidth: 14,
    height: 14,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 3,
  },
  badgeText: {
    fontFamily: "Inter_700Bold",
    fontSize: 8,
    color: "#fff",
  },
  soldOverlay: {
    position: "absolute",
    inset: 0,
    backgroundColor: "rgba(0,0,0,0.55)",
    alignItems: "center",
    justifyContent: "center",
  },
  soldText: {
    fontFamily: "Inter_700Bold",
    fontSize: 28,
    color: "#fff",
    letterSpacing: 8,
  },
  imageTags: {
    position: "absolute",
    bottom: 14,
    left: 14,
    flexDirection: "row",
    gap: 6,
  },
  vintageBadge: {
    backgroundColor: Colors.accent,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 3,
  },
  vintageText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 9,
    color: "#fff",
    letterSpacing: 1.5,
  },
  eraBadge: {
    backgroundColor: "rgba(0,0,0,0.55)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 3,
  },
  eraText: {
    fontFamily: "Inter_400Regular",
    fontSize: 9,
    color: "#fff",
    letterSpacing: 1,
  },
  content: { padding: 20, gap: 18 },
  priceRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  price: {
    fontFamily: "PlayfairDisplay_700Bold",
    fontSize: 32,
    color: Colors.text,
  },
  categoryBadge: {
    backgroundColor: Colors.card,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  categoryText: {
    fontFamily: "Inter_500Medium",
    fontSize: 12,
    color: Colors.textSecondary,
  },
  title: {
    fontFamily: "PlayfairDisplay_400Regular",
    fontSize: 22,
    color: Colors.text,
    lineHeight: 30,
  },
  metaGrid: {
    flexDirection: "row",
    backgroundColor: Colors.card,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: "hidden",
  },
  metaItem: { flex: 1, alignItems: "center", paddingVertical: 14, gap: 4 },
  metaDivider: { width: 1, backgroundColor: Colors.border },
  metaLabel: {
    fontFamily: "Inter_400Regular",
    fontSize: 9,
    color: Colors.textTertiary,
    letterSpacing: 1,
  },
  metaValue: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 12,
    color: Colors.text,
    textAlign: "center",
  },
  descLabel: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 12,
    color: Colors.text,
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
  description: {
    fontFamily: "Inter_400Regular",
    fontSize: 15,
    color: Colors.textSecondary,
    lineHeight: 22,
  },
  tags: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  tag: {
    backgroundColor: Colors.card,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  tagText: {
    fontFamily: "Inter_400Regular",
    fontSize: 12,
    color: Colors.textSecondary,
  },
  shopRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    backgroundColor: Colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 14,
    marginTop: 4,
  },
  shopAvatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: Colors.card,
  },
  shopInfo: { flex: 1 },
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
  viewShopBtn: {
    backgroundColor: Colors.text,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 6,
  },
  viewShopText: {
    fontFamily: "Inter_500Medium",
    fontSize: 12,
    color: "#fff",
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    gap: 12,
    paddingTop: 14,
    paddingHorizontal: 20,
    backgroundColor: Colors.background,
    borderTopWidth: 1,
  },
  messageBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderWidth: 1.5,
    borderColor: Colors.text,
    paddingVertical: 15,
    borderRadius: 6,
  },
  messageBtnText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 15,
    color: Colors.text,
  },
  addToCartBtn: {
    flex: 2,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: Colors.text,
    paddingVertical: 15,
    borderRadius: 6,
  },
  addToCartBtnDisabled: { backgroundColor: Colors.card },
  addToCartText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 15,
    color: "#fff",
  },
  addToCartTextDisabled: { color: Colors.textTertiary },
  backBtn: { padding: 16 },
  notFound: { flex: 1, alignItems: "center", justifyContent: "center" },
  notFoundText: {
    fontFamily: "Inter_400Regular",
    fontSize: 16,
    color: Colors.textSecondary,
  },
});
