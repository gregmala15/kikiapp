import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Dimensions,
} from "react-native";
import { Image } from "expo-image";
import { router } from "expo-router";
import { Feather, Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import Colors from "@/constants/colors";
import { Product, getShopById } from "@/constants/seed-data";
import { useAppContext } from "@/contexts/AppContext";

const { width } = Dimensions.get("window");

interface ProductCardProps {
  product: Product;
  shopName?: string;
}

export function ProductCard({ product, shopName }: ProductCardProps) {
  const { isSaved, toggleSaved, addToCart } = useAppContext();
  const saved = isSaved(product.id);
  const shop = getShopById(product.shopId);
  const displayShopName = shopName ?? shop?.name ?? "Unknown Shop";

  function handleSave() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    toggleSaved(product.id);
  }

  function handleAddToCart() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    addToCart(product);
  }

  function handleOpenProduct() {
    router.push(`/product/${product.id}`);
  }

  function handleOpenShop() {
    router.push(`/shop/${product.shopId}`);
  }

  return (
    <Pressable onPress={handleOpenProduct} style={styles.card}>
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: product.imageUrl }}
          style={styles.image}
          contentFit="cover"
          transition={200}
        />
        {(product.isSold || product.quantity === 0) && (
          <View style={styles.soldBadge}>
            <Text style={styles.soldText}>SOLD</Text>
          </View>
        )}
        {product.isVintage && (
          <View style={styles.vintageBadge}>
            <Text style={styles.vintageText}>VINTAGE</Text>
          </View>
        )}
        <Pressable
          style={[styles.saveBtn, saved && styles.saveBtnActive]}
          onPress={handleSave}
          hitSlop={8}
        >
          <Ionicons
            name={saved ? "heart" : "heart-outline"}
            size={22}
            color={saved ? Colors.danger : "#fff"}
          />
        </Pressable>
      </View>

      <View style={styles.info}>
        <View style={styles.infoTop}>
          <View style={styles.details}>
            <View style={styles.metaRow}>
              <Text style={styles.price}>£{product.price}</Text>
              <Text style={styles.dot}>·</Text>
              <Text style={styles.meta}>{product.size}</Text>
              <Text style={styles.dot}>·</Text>
              <Text style={styles.meta}>{product.condition}</Text>
            </View>
            {product.era !== "Contemporary" && (
              <Text style={styles.era}>{product.era}</Text>
            )}
            <Text style={styles.title} numberOfLines={1}>
              {product.title}
            </Text>
          </View>

          <Pressable
            style={({ pressed }) => [
              styles.cartBtn,
              { opacity: pressed ? 0.7 : 1 },
              product.quantity === 0 && styles.cartBtnDisabled,
            ]}
            onPress={handleAddToCart}
            disabled={product.quantity === 0}
          >
            <Feather
              name="shopping-bag"
              size={16}
              color={product.quantity === 0 ? Colors.textTertiary : "#fff"}
            />
          </Pressable>
        </View>

        <Pressable style={styles.shopRow} onPress={handleOpenShop}>
          <Feather name="chevron-right" size={13} color={Colors.textTertiary} />
          <Text style={styles.shopName}>{displayShopName}</Text>
          {shop && (
            <Text style={styles.shopCity}>· {shop.city}</Text>
          )}
        </Pressable>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: width - 32,
    marginHorizontal: 16,
    marginBottom: 28,
    backgroundColor: Colors.surface,
    borderRadius: 12,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  imageContainer: {
    width: "100%",
    height: width - 32,
    backgroundColor: Colors.card,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  soldBadge: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.55)",
    alignItems: "center",
    justifyContent: "center",
  },
  soldText: {
    fontFamily: "Inter_700Bold",
    fontSize: 22,
    color: "#fff",
    letterSpacing: 6,
  },
  vintageBadge: {
    position: "absolute",
    top: 14,
    left: 14,
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
  saveBtn: {
    position: "absolute",
    top: 12,
    right: 12,
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "rgba(0,0,0,0.35)",
    alignItems: "center",
    justifyContent: "center",
  },
  saveBtnActive: {
    backgroundColor: "rgba(255,255,255,0.9)",
  },
  info: {
    padding: 14,
    gap: 10,
  },
  infoTop: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 12,
  },
  details: { flex: 1, gap: 3 },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    flexWrap: "wrap",
  },
  price: {
    fontFamily: "Inter_700Bold",
    fontSize: 17,
    color: Colors.text,
  },
  dot: {
    fontFamily: "Inter_400Regular",
    fontSize: 14,
    color: Colors.textTertiary,
  },
  meta: {
    fontFamily: "Inter_400Regular",
    fontSize: 13,
    color: Colors.textSecondary,
  },
  era: {
    fontFamily: "PlayfairDisplay_400Regular_Italic",
    fontSize: 12,
    color: Colors.accent,
  },
  title: {
    fontFamily: "Inter_500Medium",
    fontSize: 14,
    color: Colors.text,
    marginTop: 2,
  },
  cartBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.text,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  cartBtnDisabled: {
    backgroundColor: Colors.card,
  },
  shopRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  shopName: {
    fontFamily: "Inter_500Medium",
    fontSize: 12,
    color: Colors.textSecondary,
  },
  shopCity: {
    fontFamily: "Inter_400Regular",
    fontSize: 12,
    color: Colors.textTertiary,
  },
});
