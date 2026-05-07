import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  Platform,
  Dimensions,
} from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Image } from "expo-image";
import * as Haptics from "expo-haptics";
import {
  getHiddenGemProducts,
  getHiddenGemShops,
  Product,
  ProductCategory,
} from "@/constants/seed-data";
import { useAppContext } from "@/contexts/AppContext";
import { ProductCardSmall } from "@/components/ProductCardSmall";

const { width } = Dimensions.get("window");

const GEM_BG = "#0F0F0D";
const GEM_SURFACE = "#1A1A17";
const GEM_ACCENT = "#C9A84C";
const GEM_BORDER = "#222";

const CATEGORIES: Array<"all" | ProductCategory> = [
  "all",
  "Outerwear",
  "Tops",
  "Dresses",
  "Accessories",
  "Footwear",
  "Archive / Rare",
];

function FeaturedGem({ product }: { product: Product }) {
  const { isSaved, toggleSaved, showSaveToast } = useAppContext();
  const saved = isSaved(product.id);
  const import_shop = product.shopId;

  return (
    <Pressable
      style={styles.featured}
      onPress={() => router.push(`/product/${product.id}`)}
    >
      <Image
        source={{ uri: product.imageUrl }}
        style={StyleSheet.absoluteFill}
        contentFit="cover"
        transition={400}
      />
      <LinearGradient
        colors={["rgba(15,15,13,0)", "rgba(15,15,13,0.65)", "rgba(15,15,13,0.96)"]}
        style={StyleSheet.absoluteFill}
      />
      <View style={styles.featuredContent}>
        <View style={styles.gemLabel}>
          <Ionicons name="diamond" size={10} color={GEM_ACCENT} />
          <Text style={styles.gemLabelText}>GEM OF THE DAY</Text>
        </View>
        <Text style={styles.featuredTitle} numberOfLines={2}>
          {product.title}
        </Text>
        <Text style={styles.featuredMeta}>
          {product.size} · {product.condition}
        </Text>
        <Text style={styles.featuredPrice}>£{product.price}</Text>
      </View>
      <Pressable
        style={[styles.featuredSave, saved && styles.featuredSaveActive]}
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          const wasSaved = saved;
          toggleSaved(product.id);
          if (!wasSaved) showSaveToast(product.id);
        }}
      >
        <Ionicons
          name={saved ? "heart" : "heart-outline"}
          size={20}
          color={saved ? "#E05252" : "#fff"}
        />
      </Pressable>
    </Pressable>
  );
}

export default function HiddenGemsScreen() {
  const insets = useSafeAreaInsets();
  const [category, setCategory] = useState<"all" | ProductCategory>("all");
  const [view, setView] = useState<"products" | "shops">("products");

  const topPad = Platform.OS === "web" ? 67 : insets.top;

  const allProducts = getHiddenGemProducts();
  const filteredProducts =
    category === "all"
      ? allProducts
      : allProducts.filter((p) => p.category === category);
  const shops = getHiddenGemShops();

  const featured = filteredProducts[0];
  const rest = filteredProducts.slice(1);

  const pairs: [Product, Product | null][] = [];
  for (let i = 0; i < rest.length; i += 2) {
    pairs.push([rest[i], rest[i + 1] ?? null]);
  }

  const renderHeader = () => (
    <View>
      <View style={styles.header}>
        <View style={styles.headerText}>
          <Text style={styles.headerTitle}>Hidden Gems</Text>
          <Text style={styles.headerSub}>Rare finds. Small shops. Big stories.</Text>
        </View>
        <View style={styles.headerActions}>
          <Pressable
            style={[styles.viewToggle, view === "products" && styles.viewToggleActive]}
            onPress={() => setView("products")}
          >
            <Ionicons
              name="grid-outline"
              size={16}
              color={view === "products" ? GEM_ACCENT : "#555"}
            />
          </Pressable>
          <Pressable
            style={[styles.viewToggle, view === "shops" && styles.viewToggleActive]}
            onPress={() => setView("shops")}
          >
            <Ionicons
              name="storefront-outline"
              size={16}
              color={view === "shops" ? GEM_ACCENT : "#555"}
            />
          </Pressable>
        </View>
      </View>

      {view === "products" && (
        <>
          <FlatList
            data={CATEGORIES}
            keyExtractor={(item) => item}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categories}
            renderItem={({ item }) => (
              <Pressable
                style={[styles.catChip, category === item && styles.catChipActive]}
                onPress={() => setCategory(item)}
              >
                <Text
                  style={[
                    styles.catChipText,
                    category === item && styles.catChipTextActive,
                  ]}
                >
                  {item === "all" ? "All" : item}
                </Text>
              </Pressable>
            )}
          />

          {featured && <FeaturedGem product={featured} />}

          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>More Gems</Text>
            <Text style={styles.sectionCount}>{rest.length} pieces</Text>
          </View>
        </>
      )}

      {view === "shops" && (
        <View style={styles.shopsContainer}>
          {shops.map((shop) => (
            <Pressable
              key={shop.id}
              style={styles.shopCard}
              onPress={() => router.push(`/shop/${shop.id}`)}
            >
              <Image
                source={{ uri: shop.storefrontImage }}
                style={styles.shopImage}
                contentFit="cover"
              />
              <LinearGradient
                colors={["rgba(15,15,13,0)", "rgba(15,15,13,0.85)"]}
                style={StyleSheet.absoluteFill}
              />
              <View style={styles.shopInfo}>
                <View style={styles.shopType}>
                  <Text style={styles.shopTypeText}>
                    {shop.type === "vintage" ? "Vintage" : "Independent"}
                  </Text>
                </View>
                <Text style={styles.shopName}>{shop.name}</Text>
                <Text style={styles.shopCity}>
                  {shop.city} · {shop.followerCount.toLocaleString()} followers
                </Text>
              </View>
            </Pressable>
          ))}
          <View style={{ height: Platform.OS === "web" ? 84 : insets.bottom + 100 }} />
        </View>
      )}
    </View>
  );

  return (
    <View style={[styles.root]}>
      <View
        style={[
          styles.topBar,
          { paddingTop: topPad + 8, borderBottomColor: GEM_BORDER },
        ]}
      >
        <Text style={styles.wordmark}>Reliq</Text>
        <Ionicons name="diamond-outline" size={20} color={GEM_ACCENT} />
      </View>

      {view === "products" ? (
        <FlatList
          data={pairs}
          keyExtractor={(_, i) => i.toString()}
          renderItem={({ item: [left, right] }) => (
            <View style={styles.row}>
              <ProductCardSmall product={left} />
              {right ? (
                <ProductCardSmall product={right} />
              ) : (
                <View style={{ flex: 1, backgroundColor: GEM_BG }} />
              )}
            </View>
          )}
          ListHeaderComponent={renderHeader}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => (
            <View style={{ height: 3, backgroundColor: GEM_BG }} />
          )}
          contentContainerStyle={{
            paddingBottom: Platform.OS === "web" ? 84 : insets.bottom + 100,
          }}
        />
      ) : (
        <FlatList
          data={[{ key: "header" }]}
          keyExtractor={(item) => item.key}
          renderItem={() => null}
          ListHeaderComponent={renderHeader}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: GEM_BG,
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: 0.5,
    backgroundColor: GEM_BG,
  },
  wordmark: {
    fontFamily: "PlayfairDisplay_700Bold",
    fontSize: 20,
    letterSpacing: 5,
    color: GEM_ACCENT,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 8,
  },
  headerText: { gap: 3 },
  headerTitle: {
    fontFamily: "PlayfairDisplay_700Bold",
    fontSize: 26,
    color: "#F0EDE6",
    letterSpacing: -0.5,
  },
  headerSub: {
    fontFamily: "Inter_400Regular",
    fontSize: 12,
    color: "#555",
    letterSpacing: 0.2,
  },
  headerActions: {
    flexDirection: "row",
    gap: 4,
    backgroundColor: "#1A1A17",
    padding: 3,
    borderRadius: 8,
    borderWidth: 0.5,
    borderColor: GEM_BORDER,
  },
  viewToggle: {
    width: 34,
    height: 34,
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
  },
  viewToggleActive: {
    backgroundColor: "#2A2A24",
  },
  categories: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  catChip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 0.5,
    borderColor: "#2A2A24",
    backgroundColor: GEM_SURFACE,
  },
  catChipActive: {
    backgroundColor: GEM_ACCENT,
    borderColor: GEM_ACCENT,
  },
  catChipText: {
    fontFamily: "Inter_400Regular",
    fontSize: 12,
    color: "#666",
  },
  catChipTextActive: {
    fontFamily: "Inter_600SemiBold",
    color: "#0F0F0D",
  },
  featured: {
    height: width * 1.18,
    backgroundColor: GEM_SURFACE,
    position: "relative",
  },
  featuredContent: {
    position: "absolute",
    bottom: 20,
    left: 16,
    right: 64,
    gap: 5,
  },
  gemLabel: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    marginBottom: 4,
  },
  gemLabelText: {
    fontFamily: "Inter_700Bold",
    fontSize: 10,
    color: GEM_ACCENT,
    letterSpacing: 2,
  },
  featuredTitle: {
    fontFamily: "PlayfairDisplay_700Bold",
    fontSize: 22,
    color: "#fff",
    lineHeight: 28,
    letterSpacing: -0.3,
  },
  featuredMeta: {
    fontFamily: "Inter_400Regular",
    fontSize: 12,
    color: "rgba(255,255,255,0.55)",
  },
  featuredPrice: {
    fontFamily: "Inter_700Bold",
    fontSize: 18,
    color: GEM_ACCENT,
    marginTop: 2,
  },
  featuredSave: {
    position: "absolute",
    bottom: 22,
    right: 16,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255,255,255,0.1)",
    alignItems: "center",
    justifyContent: "center",
  },
  featuredSaveActive: {
    backgroundColor: "rgba(255,255,255,0.88)",
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 12,
  },
  sectionTitle: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 16,
    color: "#E8E6E0",
    letterSpacing: -0.3,
  },
  sectionCount: {
    fontFamily: "Inter_400Regular",
    fontSize: 12,
    color: "#555",
  },
  row: {
    flexDirection: "row",
    gap: 3,
  },
  shopsContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
    gap: 12,
  },
  shopCard: {
    height: 180,
    borderRadius: 4,
    overflow: "hidden",
    backgroundColor: GEM_SURFACE,
    position: "relative",
  },
  shopImage: {
    ...StyleSheet.absoluteFillObject,
  },
  shopInfo: {
    position: "absolute",
    bottom: 16,
    left: 16,
    right: 16,
    gap: 4,
  },
  shopType: {
    alignSelf: "flex-start",
    borderWidth: 0.5,
    borderColor: "rgba(255,255,255,0.3)",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 2,
    marginBottom: 4,
  },
  shopTypeText: {
    fontFamily: "Inter_500Medium",
    fontSize: 9,
    color: "rgba(255,255,255,0.7)",
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  shopName: {
    fontFamily: "PlayfairDisplay_700Bold",
    fontSize: 18,
    color: "#fff",
  },
  shopCity: {
    fontFamily: "Inter_400Regular",
    fontSize: 12,
    color: "rgba(255,255,255,0.55)",
  },
});
