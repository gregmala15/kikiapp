import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Alert,
  Platform,
} from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather, Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import Colors from "@/constants/colors";
import { useAppContext } from "@/contexts/AppContext";

export default function ListingsScreen() {
  const insets = useSafeAreaInsets();
  const { userShop, deleteProduct } = useAppContext();
  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 120 : insets.bottom + 100;

  function handleDelete(id: string, title: string) {
    Alert.alert("Remove listing", `Remove "${title}" from your rack?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Remove",
        style: "destructive",
        onPress: () => deleteProduct(id),
      },
    ]);
  }

  if (!userShop) {
    return (
      <View
        style={[
          styles.empty,
          { paddingTop: topPad + 40, paddingBottom: bottomPad },
        ]}
      >
        <Ionicons name="pricetag-outline" size={48} color={Colors.textTertiary} />
        <Text style={styles.emptyTitle}>No shop yet</Text>
        <Text style={styles.emptyDesc}>
          Set up your shop profile to start listing pieces.
        </Text>
        <Pressable
          style={styles.cta}
          onPress={() => router.push("/shop-setup")}
        >
          <Text style={styles.ctaText}>Create shop</Text>
        </Pressable>
      </View>
    );
  }

  const products = userShop.products;

  return (
    <View style={{ flex: 1, backgroundColor: Colors.background }}>
      <View style={[styles.header, { paddingTop: topPad + 12 }]}>
        <View>
          <Text style={styles.title}>Listings</Text>
          <Text style={styles.subtitle}>
            {products.length} piece{products.length === 1 ? "" : "s"} in your
            rack
          </Text>
        </View>
        <Pressable
          style={styles.addBtn}
          onPress={() => router.push("/add-product")}
        >
          <Feather name="plus" size={16} color="#fff" />
          <Text style={styles.addBtnText}>New</Text>
        </Pressable>
      </View>
      <ScrollView
        contentContainerStyle={{
          paddingBottom: bottomPad,
          paddingHorizontal: 20,
          paddingTop: 12,
          gap: 12,
        }}
      >
        {products.length === 0 ? (
          <View style={styles.emptyInline}>
            <Text style={styles.emptyTitle}>Your rack is empty</Text>
            <Text style={styles.emptyDesc}>
              List your first piece to start selling on Reliq.
            </Text>
            <Pressable
              style={styles.cta}
              onPress={() => router.push("/add-product")}
            >
              <Text style={styles.ctaText}>Add your first piece</Text>
            </Pressable>
          </View>
        ) : (
          products.map((p) => (
            <Pressable
              key={p.id}
              style={styles.row}
              onPress={() => router.push(`/product/${p.id}` as any)}
            >
              <Image
                source={p.imageUrl}
                style={styles.thumb}
                contentFit="cover"
              />
              <View style={{ flex: 1 }}>
                <Text style={styles.productTitle} numberOfLines={1}>
                  {p.title}
                </Text>
                <Text style={styles.productMeta}>
                  £{p.price.toFixed(2)} · {p.size}
                </Text>
                {p.isSold && <Text style={styles.soldTag}>SOLD</Text>}
              </View>
              <Pressable
                hitSlop={10}
                onPress={() => handleDelete(p.id, p.title)}
                style={styles.deleteBtn}
              >
                <Feather name="trash-2" size={18} color={Colors.danger} />
              </Pressable>
            </Pressable>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  title: {
    fontFamily: "PlayfairDisplay_700Bold",
    fontSize: 28,
    color: Colors.text,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontFamily: "Inter_400Regular",
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  addBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 14,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.text,
  },
  addBtnText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 13,
    color: "#fff",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 12,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 10,
  },
  thumb: {
    width: 64,
    height: 80,
    borderRadius: 6,
    backgroundColor: Colors.card,
  },
  productTitle: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 14,
    color: Colors.text,
  },
  productMeta: {
    fontFamily: "Inter_400Regular",
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  soldTag: {
    fontFamily: "Inter_700Bold",
    fontSize: 10,
    letterSpacing: 1.5,
    color: Colors.danger,
    marginTop: 4,
  },
  deleteBtn: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  empty: {
    flex: 1,
    backgroundColor: Colors.background,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
    gap: 14,
  },
  emptyInline: {
    alignItems: "center",
    paddingVertical: 60,
    gap: 14,
  },
  emptyTitle: {
    fontFamily: "PlayfairDisplay_700Bold",
    fontSize: 22,
    color: Colors.text,
  },
  emptyDesc: {
    fontFamily: "Inter_400Regular",
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: "center",
    lineHeight: 21,
    maxWidth: 320,
  },
  cta: {
    marginTop: 6,
    paddingHorizontal: 22,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.text,
    alignItems: "center",
    justifyContent: "center",
  },
  ctaText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 14,
    color: "#fff",
  },
});
