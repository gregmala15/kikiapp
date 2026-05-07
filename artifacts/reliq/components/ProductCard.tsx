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
import { Ionicons, Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import Colors from "@/constants/colors";
import { Product, getShopById } from "@/constants/seed-data";
import { useAppContext } from "@/contexts/AppContext";

const { width } = Dimensions.get("window");
const CARD_HEIGHT = width * 1.28;

interface ProductCardProps {
  product: Product;
  shopName?: string;
  style?: object;
}

export function ProductCard({ product, shopName, style }: ProductCardProps) {
  const { isSaved, toggleSaved, showSaveToast } = useAppContext();
  const saved = isSaved(product.id);
  const shop = getShopById(product.shopId);
  const displayShopName = shopName ?? shop?.name ?? "";

  const isSold = product.isSold || product.quantity === 0;
  const isOneLeft = product.quantity === 1 && !isSold;
  const isArchive = product.category === "Archive / Rare";

  function handleSave() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const wasSaved = saved;
    toggleSaved(product.id);
    if (!wasSaved) showSaveToast(product.id);
  }

  function handleRecommend(e?: { stopPropagation?: () => void }) {
    e?.stopPropagation?.();
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push({
      pathname: "/recommend/[productId]",
      params: { productId: product.id },
    });
  }

  return (
    <Pressable
      style={[styles.card, style]}
      onPress={() => router.push(`/product/${product.id}`)}
    >
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: product.imageUrl }}
          style={styles.image}
          contentFit="cover"
          transition={300}
        />

        {isSold && (
          <View style={styles.soldOverlay}>
            <Text style={styles.soldText}>SOLD</Text>
          </View>
        )}

        {isOneLeft && (
          <View style={styles.oneLeftBadge}>
            <Text style={styles.oneLeftText}>1 LEFT</Text>
          </View>
        )}

        {isArchive && !isOneLeft && (
          <View style={styles.archiveBadge}>
            <Text style={styles.archiveText}>ARCHIVE</Text>
          </View>
        )}

        <View style={styles.actionStack}>
          <Pressable
            style={[styles.saveButton, saved && styles.saveButtonActive]}
            onPress={handleSave}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            testID={`save-${product.id}`}
          >
            <Ionicons
              name={saved ? "heart" : "heart-outline"}
              size={22}
              color={saved ? Colors.danger : "#fff"}
            />
          </Pressable>
          <Pressable
            style={styles.recommendButton}
            onPress={handleRecommend}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            testID={`recommend-card-${product.id}`}
          >
            <Feather name="send" size={18} color="#fff" />
          </Pressable>
        </View>
      </View>

      <View style={styles.info}>
        {displayShopName ? (
          <Text style={styles.shopName} numberOfLines={1}>
            {displayShopName}
          </Text>
        ) : null}
        <View style={styles.titleRow}>
          <Text style={styles.title} numberOfLines={2}>
            {product.title}
          </Text>
          <Text style={styles.price}>£{product.price}</Text>
        </View>
        <View style={styles.metaRow}>
          <Text style={styles.meta}>{product.size}</Text>
          <Text style={styles.metaDot}>·</Text>
          <Text style={styles.meta}>{product.condition}</Text>
          {product.era && product.era !== "Contemporary" && (
            <>
              <Text style={styles.metaDot}>·</Text>
              <Text style={styles.meta}>{product.era}</Text>
            </>
          )}
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    marginBottom: 2,
  },
  imageContainer: {
    width: "100%",
    height: CARD_HEIGHT,
    backgroundColor: Colors.card,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  soldOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.45)",
    alignItems: "center",
    justifyContent: "center",
  },
  soldText: {
    color: "#fff",
    fontFamily: "Inter_700Bold",
    fontSize: 18,
    letterSpacing: 4,
  },
  oneLeftBadge: {
    position: "absolute",
    bottom: 14,
    left: 14,
    backgroundColor: Colors.accent,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 2,
  },
  oneLeftText: {
    color: "#fff",
    fontFamily: "Inter_700Bold",
    fontSize: 10,
    letterSpacing: 1.5,
  },
  archiveBadge: {
    position: "absolute",
    bottom: 14,
    left: 14,
    backgroundColor: Colors.text,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 2,
  },
  archiveText: {
    color: "#fff",
    fontFamily: "Inter_700Bold",
    fontSize: 10,
    letterSpacing: 1.5,
  },
  actionStack: {
    position: "absolute",
    top: 14,
    right: 14,
    gap: 8,
    alignItems: "center",
  },
  saveButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.25)",
    alignItems: "center",
    justifyContent: "center",
  },
  saveButtonActive: {
    backgroundColor: "rgba(255,255,255,0.92)",
  },
  recommendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.25)",
    alignItems: "center",
    justifyContent: "center",
  },
  info: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 18,
  },
  shopName: {
    fontFamily: "Inter_500Medium",
    fontSize: 11,
    color: Colors.textTertiary,
    letterSpacing: 1,
    textTransform: "uppercase",
    marginBottom: 4,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 12,
  },
  title: {
    flex: 1,
    fontFamily: "Inter_600SemiBold",
    fontSize: 15,
    color: Colors.text,
    letterSpacing: -0.2,
    lineHeight: 21,
  },
  price: {
    fontFamily: "Inter_700Bold",
    fontSize: 15,
    color: Colors.text,
    letterSpacing: -0.3,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
    gap: 4,
  },
  meta: {
    fontFamily: "Inter_400Regular",
    fontSize: 12,
    color: Colors.textSecondary,
    textTransform: "capitalize",
  },
  metaDot: {
    fontFamily: "Inter_400Regular",
    fontSize: 12,
    color: Colors.textTertiary,
  },
});
