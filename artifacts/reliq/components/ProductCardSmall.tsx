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
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { Product, getShopById } from "@/constants/seed-data";
import { useAppContext } from "@/contexts/AppContext";

const { width } = Dimensions.get("window");
const CARD_WIDTH = (width - 3) / 2;
const CARD_HEIGHT = CARD_WIDTH * 1.35;

const GEM_ACCENT = "#C9A84C";
const GEM_SURFACE = "#1A1A17";

interface Props {
  product: Product;
}

export function ProductCardSmall({ product }: Props) {
  const { isSaved, toggleSaved, showSaveToast } = useAppContext();
  const saved = isSaved(product.id);
  const shop = getShopById(product.shopId);
  const isSold = product.isSold || product.quantity === 0;

  return (
    <Pressable
      style={styles.card}
      onPress={() => router.push(`/product/${product.id}`)}
    >
      <View style={styles.imageWrapper}>
        <Image
          source={{ uri: product.imageUrl }}
          style={styles.image}
          contentFit="cover"
          transition={200}
        />
        {isSold && (
          <View style={styles.soldOverlay}>
            <Text style={styles.soldText}>SOLD</Text>
          </View>
        )}
        <Pressable
          style={[styles.saveBtn, saved && styles.saveBtnActive]}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            const wasSaved = saved;
            toggleSaved(product.id);
            if (!wasSaved) showSaveToast(product.id);
          }}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Ionicons
            name={saved ? "heart" : "heart-outline"}
            size={16}
            color={saved ? "#E05252" : "#fff"}
          />
        </Pressable>
      </View>
      <View style={styles.info}>
        <Text style={styles.price}>£{product.price}</Text>
        <Text style={styles.title} numberOfLines={1}>
          {product.title}
        </Text>
        <Text style={styles.meta} numberOfLines={1}>
          {shop?.name ?? ""} · {product.size}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: GEM_SURFACE,
  },
  imageWrapper: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    backgroundColor: "#111",
    position: "relative",
  },
  image: { width: "100%", height: "100%" },
  soldOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.5)",
    alignItems: "center",
    justifyContent: "center",
  },
  soldText: {
    color: "#fff",
    fontFamily: "Inter_700Bold",
    fontSize: 12,
    letterSpacing: 3,
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
  saveBtnActive: { backgroundColor: "rgba(255,255,255,0.88)" },
  info: {
    paddingHorizontal: 10,
    paddingTop: 9,
    paddingBottom: 12,
    gap: 2,
  },
  price: {
    fontFamily: "Inter_700Bold",
    fontSize: 14,
    color: GEM_ACCENT,
    letterSpacing: -0.2,
  },
  title: {
    fontFamily: "Inter_500Medium",
    fontSize: 12,
    color: "#E8E6E0",
    letterSpacing: -0.1,
  },
  meta: {
    fontFamily: "Inter_400Regular",
    fontSize: 10,
    color: "#555",
    letterSpacing: 0.2,
  },
});
