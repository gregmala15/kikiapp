import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  FlatList,
  TextInput,
  Platform,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { Image } from "expo-image";
import Colors from "@/constants/colors";
import { SEED_PRODUCTS, Product, getShopById } from "@/constants/seed-data";
import { useAppContext } from "@/contexts/AppContext";

export default function ShareProductScreen() {
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{
    convId?: string;
    recipientId?: string;
    recipientName?: string;
    recipientType?: "user" | "shop";
  }>();
  const { sendMessage, savedProductIds } = useAppContext();
  const [query, setQuery] = useState("");

  const topPad = Platform.OS === "web" ? 67 : insets.top;

  const products = useMemo<Product[]>(() => {
    const saved = SEED_PRODUCTS.filter((p) =>
      savedProductIds.includes(p.id),
    );
    const rest = SEED_PRODUCTS.filter((p) => !savedProductIds.includes(p.id));
    let list = [...saved, ...rest];
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter((p) => {
        const shopName = getShopById(p.shopId)?.name ?? "";
        return (
          p.title.toLowerCase().includes(q) ||
          shopName.toLowerCase().includes(q)
        );
      });
    }
    return list.slice(0, 60);
  }, [query, savedProductIds]);

  async function handleShare(product: Product) {
    if (!params.recipientId || !params.recipientName) {
      router.back();
      return;
    }
    await sendMessage({
      toId: params.recipientId,
      toName: params.recipientName,
      toType: (params.recipientType as "user" | "shop") ?? "user",
      content: product.title,
      productId: product.id,
      isProductRecommendation: true,
    });
    router.back();
  }

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: topPad + 8 }]}>
        <Pressable style={styles.iconBtn} onPress={() => router.back()}>
          <Feather name="x" size={22} color={Colors.text} />
        </Pressable>
        <Text style={styles.headerTitle}>Share a piece</Text>
        <View style={styles.iconBtn} />
      </View>

      <View style={styles.searchWrap}>
        <Feather name="search" size={16} color={Colors.textTertiary} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search products"
          placeholderTextColor={Colors.textTertiary}
          value={query}
          onChangeText={setQuery}
          autoCapitalize="none"
        />
      </View>

      <FlatList
        data={products}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          const shopName = getShopById(item.shopId)?.name ?? "Shop";
          return (
            <Pressable
              style={styles.row}
              onPress={() => handleShare(item)}
              testID={`share-${item.id}`}
            >
              <Image
                source={{ uri: item.imageUrl }}
                style={styles.thumb}
                contentFit="cover"
              />
              <View style={styles.info}>
                <Text style={styles.title} numberOfLines={1}>
                  {item.title}
                </Text>
                <Text style={styles.meta} numberOfLines={1}>
                  {shopName} · £{item.price}
                </Text>
              </View>
              <Feather name="send" size={16} color={Colors.textSecondary} />
            </Pressable>
          );
        }}
        ItemSeparatorComponent={() => <View style={styles.sep} />}
        contentContainerStyle={{ paddingBottom: insets.bottom + 40 }}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  iconBtn: { width: 44, height: 44, alignItems: "center", justifyContent: "center" },
  headerTitle: {
    flex: 1,
    textAlign: "center",
    fontFamily: "Inter_600SemiBold",
    fontSize: 16,
    color: Colors.text,
  },
  searchWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    margin: 16,
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: Colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  searchInput: {
    flex: 1,
    fontFamily: "Inter_400Regular",
    fontSize: 14,
    color: Colors.text,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 10,
    gap: 14,
  },
  thumb: {
    width: 56,
    height: 70,
    borderRadius: 6,
    backgroundColor: Colors.card,
  },
  info: { flex: 1, gap: 3 },
  title: {
    fontFamily: "Inter_500Medium",
    fontSize: 14,
    color: Colors.text,
  },
  meta: {
    fontFamily: "Inter_400Regular",
    fontSize: 12,
    color: Colors.textSecondary,
  },
  sep: { height: 1, backgroundColor: Colors.border, marginLeft: 90 },
});
