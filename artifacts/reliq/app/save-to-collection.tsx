import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  TextInput,
  Platform,
  Alert,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather, Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import * as Haptics from "expo-haptics";
import Colors from "@/constants/colors";
import { SEED_PRODUCTS } from "@/constants/seed-data";
import { useAppContext } from "@/contexts/AppContext";

export default function SaveToCollectionScreen() {
  const insets = useSafeAreaInsets();
  const { productId } = useLocalSearchParams<{ productId: string }>();
  const {
    collections,
    createCollection,
    addProductToCollection,
    removeProductFromCollection,
    getCollectionsForProduct,
  } = useAppContext();

  const product = SEED_PRODUCTS.find((p) => p.id === productId);
  const [creating, setCreating] = useState(false);
  const [newName, setNewName] = useState("");

  if (!product) {
    return (
      <View style={[styles.container, { paddingTop: insets.top + 20 }]}>
        <Text style={styles.notFound}>Product not found.</Text>
        <Pressable style={styles.doneBtn} onPress={() => router.back()}>
          <Text style={styles.doneText}>Close</Text>
        </Pressable>
      </View>
    );
  }

  const inCollections = new Set(getCollectionsForProduct(product.id).map((c) => c.id));

  function handleToggleCollection(collectionId: string) {
    Haptics.selectionAsync();
    if (inCollections.has(collectionId)) {
      removeProductFromCollection(collectionId, product!.id);
    } else {
      addProductToCollection(collectionId, product!.id);
    }
  }

  function handleCreate() {
    const trimmed = newName.trim();
    if (!trimmed) {
      Alert.alert("Name required", "Give your collection a name.");
      return;
    }
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    createCollection(trimmed, product!.id);
    setNewName("");
    setCreating(false);
  }

  const topPad = Platform.OS === "web" ? 24 : insets.top + 8;

  return (
    <View style={[styles.container, { backgroundColor: Colors.background }]}>
      <View style={[styles.header, { paddingTop: topPad }]}>
        <Pressable
          style={styles.closeBtn}
          onPress={() => router.back()}
          hitSlop={12}
        >
          <Feather name="x" size={22} color={Colors.text} />
        </Pressable>
        <Text style={styles.headerTitle}>Save to collection</Text>
        <Pressable
          style={styles.doneInline}
          onPress={() => router.back()}
          hitSlop={12}
        >
          <Text style={styles.doneInlineText}>Done</Text>
        </Pressable>
      </View>

      <View style={styles.productRow}>
        <Image
          source={{ uri: product.imageUrl }}
          style={styles.productImage}
          contentFit="cover"
        />
        <View style={styles.productInfo}>
          <Text style={styles.productTitle} numberOfLines={1}>
            {product.title}
          </Text>
          <Text style={styles.productPrice}>£{product.price}</Text>
        </View>
        <View style={styles.savedBadge}>
          <Ionicons name="heart" size={14} color={Colors.danger} />
          <Text style={styles.savedBadgeText}>Saved</Text>
        </View>
      </View>

      <ScrollView
        style={styles.list}
        contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}
        showsVerticalScrollIndicator={false}
      >
        {creating ? (
          <View style={styles.createCard}>
            <TextInput
              value={newName}
              onChangeText={setNewName}
              placeholder='e.g. "Night stuff", "Summer clothing"'
              placeholderTextColor={Colors.textTertiary}
              style={styles.input}
              autoFocus
              maxLength={40}
              returnKeyType="done"
              onSubmitEditing={handleCreate}
            />
            <View style={styles.createActions}>
              <Pressable
                style={styles.cancelBtn}
                onPress={() => {
                  setCreating(false);
                  setNewName("");
                }}
              >
                <Text style={styles.cancelText}>Cancel</Text>
              </Pressable>
              <Pressable style={styles.createBtn} onPress={handleCreate}>
                <Text style={styles.createBtnText}>Create</Text>
              </Pressable>
            </View>
          </View>
        ) : (
          <Pressable
            style={styles.newRow}
            onPress={() => {
              Haptics.selectionAsync();
              setCreating(true);
            }}
          >
            <View style={styles.newIcon}>
              <Feather name="plus" size={20} color={Colors.accent} />
            </View>
            <Text style={styles.newText}>Create new collection</Text>
          </Pressable>
        )}

        {collections.length === 0 && !creating && (
          <View style={styles.empty}>
            <Text style={styles.emptyTitle}>No collections yet</Text>
            <Text style={styles.emptyDesc}>
              Group your saved pieces into themes like "Night stuff" or
              "Summer clothing".
            </Text>
          </View>
        )}

        {collections.map((c) => {
          const isIn = inCollections.has(c.id);
          return (
            <Pressable
              key={c.id}
              style={styles.collectionRow}
              onPress={() => handleToggleCollection(c.id)}
            >
              <View style={styles.collectionThumb}>
                <Feather name="folder" size={18} color={Colors.text} />
              </View>
              <View style={styles.collectionInfo}>
                <Text style={styles.collectionName} numberOfLines={1}>
                  {c.name}
                </Text>
                <Text style={styles.collectionCount}>
                  {c.productIds.length}{" "}
                  {c.productIds.length === 1 ? "item" : "items"}
                </Text>
              </View>
              <View
                style={[styles.checkbox, isIn && styles.checkboxOn]}
              >
                {isIn && <Feather name="check" size={16} color="#fff" />}
              </View>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  closeBtn: { width: 36, alignItems: "flex-start" },
  headerTitle: {
    flex: 1,
    fontFamily: "PlayfairDisplay_700Bold",
    fontSize: 18,
    color: Colors.text,
    textAlign: "center",
  },
  doneInline: { width: 50, alignItems: "flex-end" },
  doneInlineText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 14,
    color: Colors.accent,
  },
  productRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  productImage: {
    width: 52,
    height: 52,
    borderRadius: 6,
    backgroundColor: Colors.card,
  },
  productInfo: { flex: 1, gap: 2 },
  productTitle: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 14,
    color: Colors.text,
  },
  productPrice: {
    fontFamily: "PlayfairDisplay_700Bold",
    fontSize: 14,
    color: Colors.text,
  },
  savedBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: Colors.accentLight,
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 4,
  },
  savedBadgeText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 10,
    color: Colors.accentDark,
    letterSpacing: 0.5,
  },
  list: { flex: 1, paddingHorizontal: 20, paddingTop: 14 },
  newRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    paddingVertical: 14,
    paddingHorizontal: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.accent,
    borderStyle: "dashed",
    marginBottom: 10,
  },
  newIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.accentLight,
    alignItems: "center",
    justifyContent: "center",
  },
  newText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 14,
    color: Colors.text,
  },
  createCard: {
    backgroundColor: Colors.surface,
    padding: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 14,
    gap: 12,
  },
  input: {
    fontFamily: "Inter_400Regular",
    fontSize: 15,
    color: Colors.text,
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: Colors.card,
    borderRadius: 6,
  },
  createActions: { flexDirection: "row", gap: 10, justifyContent: "flex-end" },
  cancelBtn: {
    paddingVertical: 9,
    paddingHorizontal: 14,
    borderRadius: 6,
  },
  cancelText: {
    fontFamily: "Inter_500Medium",
    fontSize: 13,
    color: Colors.textSecondary,
  },
  createBtn: {
    paddingVertical: 9,
    paddingHorizontal: 18,
    borderRadius: 6,
    backgroundColor: Colors.text,
  },
  createBtnText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 13,
    color: "#fff",
  },
  empty: { paddingVertical: 24, alignItems: "center", gap: 6 },
  emptyTitle: {
    fontFamily: "PlayfairDisplay_700Bold",
    fontSize: 16,
    color: Colors.text,
  },
  emptyDesc: {
    fontFamily: "Inter_400Regular",
    fontSize: 13,
    color: Colors.textSecondary,
    textAlign: "center",
    lineHeight: 19,
    paddingHorizontal: 20,
  },
  collectionRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 10,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    marginBottom: 8,
  },
  collectionThumb: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: Colors.card,
    alignItems: "center",
    justifyContent: "center",
  },
  collectionInfo: { flex: 1, gap: 2 },
  collectionName: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 14,
    color: Colors.text,
  },
  collectionCount: {
    fontFamily: "Inter_400Regular",
    fontSize: 12,
    color: Colors.textSecondary,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: Colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxOn: {
    backgroundColor: Colors.text,
    borderColor: Colors.text,
  },
  notFound: {
    fontFamily: "Inter_400Regular",
    fontSize: 15,
    color: Colors.textSecondary,
    textAlign: "center",
  },
  doneBtn: {
    marginHorizontal: 40,
    marginTop: 20,
    paddingVertical: 14,
    backgroundColor: Colors.text,
    borderRadius: 8,
    alignItems: "center",
  },
  doneText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 14,
    color: "#fff",
  },
});
