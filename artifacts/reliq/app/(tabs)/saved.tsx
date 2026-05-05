import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Platform,
  Pressable,
  ScrollView,
  Modal,
  TextInput,
  Alert,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather, Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import Colors from "@/constants/colors";
import { SEED_PRODUCTS } from "@/constants/seed-data";
import { ProductCard } from "@/components/ProductCard";
import { useAppContext, Collection } from "@/contexts/AppContext";

const ALL_FILTER = "__all__";

export default function SavedScreen() {
  const insets = useSafeAreaInsets();
  const {
    savedProductIds,
    collections,
    createCollection,
    renameCollection,
    deleteCollection,
  } = useAppContext();

  const [activeFilter, setActiveFilter] = useState<string>(ALL_FILTER);
  const [createOpen, setCreateOpen] = useState(false);
  const [editing, setEditing] = useState<Collection | null>(null);
  const [nameInput, setNameInput] = useState("");

  // If the active collection got deleted, fall back to "All".
  const safeFilter =
    activeFilter === ALL_FILTER ||
    collections.some((c) => c.id === activeFilter)
      ? activeFilter
      : ALL_FILTER;

  const visibleIds: string[] =
    safeFilter === ALL_FILTER
      ? savedProductIds
      : collections.find((c) => c.id === safeFilter)?.productIds ?? [];

  const visibleProducts = SEED_PRODUCTS.filter((p) => visibleIds.includes(p.id));

  const topPad = Platform.OS === "web" ? 67 : insets.top;

  function handleSelectFilter(id: string) {
    Haptics.selectionAsync();
    setActiveFilter(id);
  }

  function handleLongPress(c: Collection) {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Alert.alert(c.name, "What would you like to do?", [
      {
        text: "Rename",
        onPress: () => {
          setEditing(c);
          setNameInput(c.name);
        },
      },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => {
          Alert.alert(
            "Delete collection?",
            `"${c.name}" will be removed. The items will stay in your Saved list.`,
            [
              { text: "Cancel", style: "cancel" },
              {
                text: "Delete",
                style: "destructive",
                onPress: () => {
                  deleteCollection(c.id);
                  if (activeFilter === c.id) setActiveFilter(ALL_FILTER);
                },
              },
            ]
          );
        },
      },
      { text: "Cancel", style: "cancel" },
    ]);
  }

  function handleSubmitName() {
    const trimmed = nameInput.trim();
    if (!trimmed) {
      Alert.alert("Name required", "Give your collection a name.");
      return;
    }
    if (editing) {
      renameCollection(editing.id, trimmed);
    } else {
      createCollection(trimmed);
    }
    setNameInput("");
    setEditing(null);
    setCreateOpen(false);
  }

  return (
    <View style={[styles.container, { backgroundColor: Colors.background }]}>
      <View
        style={[
          styles.header,
          { paddingTop: topPad + 12, borderBottomColor: Colors.border },
        ]}
      >
        <Text style={styles.title}>Saved</Text>
        {visibleProducts.length > 0 && (
          <Text style={styles.count}>
            {visibleProducts.length}{" "}
            {visibleProducts.length === 1 ? "item" : "items"}
          </Text>
        )}
      </View>

      <View style={styles.chipsWrapper}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipsRow}
        >
          <Pressable
            onPress={() => handleSelectFilter(ALL_FILTER)}
            style={[
              styles.chip,
              safeFilter === ALL_FILTER && styles.chipActive,
            ]}
          >
            <Ionicons
              name="heart"
              size={13}
              color={safeFilter === ALL_FILTER ? "#fff" : Colors.text}
            />
            <Text
              style={[
                styles.chipText,
                safeFilter === ALL_FILTER && styles.chipTextActive,
              ]}
            >
              All
            </Text>
            <Text
              style={[
                styles.chipCount,
                safeFilter === ALL_FILTER && styles.chipCountActive,
              ]}
            >
              {savedProductIds.length}
            </Text>
          </Pressable>

          {collections.map((c) => {
            const active = safeFilter === c.id;
            return (
              <Pressable
                key={c.id}
                onPress={() => handleSelectFilter(c.id)}
                onLongPress={() => handleLongPress(c)}
                delayLongPress={350}
                style={[styles.chip, active && styles.chipActive]}
              >
                <Feather
                  name="folder"
                  size={13}
                  color={active ? "#fff" : Colors.text}
                />
                <Text
                  style={[styles.chipText, active && styles.chipTextActive]}
                  numberOfLines={1}
                >
                  {c.name}
                </Text>
                <Text
                  style={[
                    styles.chipCount,
                    active && styles.chipCountActive,
                  ]}
                >
                  {c.productIds.length}
                </Text>
              </Pressable>
            );
          })}

          <Pressable
            onPress={() => {
              Haptics.selectionAsync();
              setNameInput("");
              setEditing(null);
              setCreateOpen(true);
            }}
            style={styles.newChip}
          >
            <Feather name="plus" size={14} color={Colors.accent} />
            <Text style={styles.newChipText}>New</Text>
          </Pressable>
        </ScrollView>
      </View>

      <FlatList
        data={visibleProducts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <ProductCard product={item} />}
        contentContainerStyle={[
          styles.list,
          { paddingBottom: Platform.OS === "web" ? 84 : insets.bottom + 100 },
        ]}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons
              name={safeFilter === ALL_FILTER ? "heart-outline" : "folder-open-outline"}
              size={52}
              color={Colors.textTertiary}
            />
            <Text style={styles.emptyTitle}>
              {safeFilter === ALL_FILTER
                ? "Nothing saved yet"
                : "This collection is empty"}
            </Text>
            <Text style={styles.emptyDesc}>
              {safeFilter === ALL_FILTER
                ? "Tap the heart on any product to save it here"
                : "Open a saved item and add it to this collection"}
            </Text>
          </View>
        }
      />

      <Modal
        visible={createOpen || editing !== null}
        transparent
        animationType="fade"
        onRequestClose={() => {
          setCreateOpen(false);
          setEditing(null);
          setNameInput("");
        }}
      >
        <Pressable
          style={styles.modalBackdrop}
          onPress={() => {
            setCreateOpen(false);
            setEditing(null);
            setNameInput("");
          }}
        >
          <Pressable style={styles.modalCard} onPress={(e) => e.stopPropagation()}>
            <Text style={styles.modalTitle}>
              {editing ? "Rename collection" : "New collection"}
            </Text>
            <TextInput
              value={nameInput}
              onChangeText={setNameInput}
              placeholder='e.g. "Night stuff", "Summer clothing"'
              placeholderTextColor={Colors.textTertiary}
              style={styles.modalInput}
              autoFocus
              maxLength={40}
              returnKeyType="done"
              onSubmitEditing={handleSubmitName}
            />
            <View style={styles.modalActions}>
              <Pressable
                style={styles.modalCancel}
                onPress={() => {
                  setCreateOpen(false);
                  setEditing(null);
                  setNameInput("");
                }}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </Pressable>
              <Pressable style={styles.modalConfirm} onPress={handleSubmitName}>
                <Text style={styles.modalConfirmText}>
                  {editing ? "Save" : "Create"}
                </Text>
              </Pressable>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
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
  title: {
    fontFamily: "PlayfairDisplay_700Bold",
    fontSize: 28,
    color: Colors.text,
  },
  count: {
    fontFamily: "Inter_400Regular",
    fontSize: 13,
    color: Colors.textSecondary,
  },
  chipsWrapper: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
    backgroundColor: Colors.background,
  },
  chipsRow: {
    paddingHorizontal: 20,
    paddingVertical: 14,
    gap: 8,
    alignItems: "center",
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
    maxWidth: 200,
  },
  chipActive: {
    backgroundColor: Colors.text,
    borderColor: Colors.text,
  },
  chipText: {
    fontFamily: "Inter_500Medium",
    fontSize: 13,
    color: Colors.text,
  },
  chipTextActive: { color: "#fff" },
  chipCount: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 11,
    color: Colors.textSecondary,
    marginLeft: 2,
  },
  chipCountActive: { color: "rgba(255,255,255,0.7)" },
  newChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.accent,
    borderStyle: "dashed",
    backgroundColor: Colors.background,
  },
  newChipText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 13,
    color: Colors.accent,
  },
  list: { paddingTop: 20 },
  empty: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 100,
    paddingHorizontal: 40,
    gap: 12,
  },
  emptyTitle: {
    fontFamily: "PlayfairDisplay_700Bold",
    fontSize: 22,
    color: Colors.text,
    textAlign: "center",
  },
  emptyDesc: {
    fontFamily: "Inter_400Regular",
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: "center",
    lineHeight: 20,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: Colors.overlay,
    justifyContent: "center",
    paddingHorizontal: 28,
  },
  modalCard: {
    backgroundColor: Colors.surface,
    borderRadius: 14,
    padding: 22,
    gap: 16,
  },
  modalTitle: {
    fontFamily: "PlayfairDisplay_700Bold",
    fontSize: 20,
    color: Colors.text,
  },
  modalInput: {
    fontFamily: "Inter_400Regular",
    fontSize: 15,
    color: Colors.text,
    paddingVertical: 12,
    paddingHorizontal: 14,
    backgroundColor: Colors.card,
    borderRadius: 8,
  },
  modalActions: { flexDirection: "row", gap: 10, justifyContent: "flex-end" },
  modalCancel: { paddingVertical: 10, paddingHorizontal: 14, borderRadius: 6 },
  modalCancelText: {
    fontFamily: "Inter_500Medium",
    fontSize: 14,
    color: Colors.textSecondary,
  },
  modalConfirm: {
    paddingVertical: 10,
    paddingHorizontal: 22,
    borderRadius: 6,
    backgroundColor: Colors.text,
  },
  modalConfirmText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 14,
    color: "#fff",
  },
});
