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
import * as Haptics from "expo-haptics";
import Colors from "@/constants/colors";
import {
  SEED_PRODUCTS,
  SEED_USERS,
  CommunityUser,
  getShopById,
} from "@/constants/seed-data";
import { useAppContext } from "@/contexts/AppContext";
import { useAuth } from "@/contexts/AuthContext";

export default function RecommendScreen() {
  const insets = useSafeAreaInsets();
  const { productId } = useLocalSearchParams<{ productId: string }>();
  const { user } = useAuth();
  const { followedUserIds, sendMessage } = useAppContext();
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [note, setNote] = useState("");
  const [sending, setSending] = useState(false);

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;

  const product = SEED_PRODUCTS.find((p) => p.id === productId);
  const shop = product ? getShopById(product.shopId) : undefined;

  const friends = useMemo<CommunityUser[]>(
    () => SEED_USERS.filter((u) => followedUserIds.includes(u.id)),
    [followedUserIds],
  );

  function toggle(userId: string) {
    if (Platform.OS !== "web") {
      Haptics.selectionAsync();
    }
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(userId)) next.delete(userId);
      else next.add(userId);
      return next;
    });
  }

  async function handleSend() {
    if (!product || selected.size === 0 || sending) return;
    if (!user) {
      router.replace("/(auth)/login");
      return;
    }
    const targets = friends.filter((f) => selected.has(f.id));
    if (targets.length === 0) return;
    setSending(true);
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    const trimmed = note.trim();
    try {
      // Send sequentially so each sendMessage observes the prior state update.
      // Functional setState in AppContext also makes this safe under parallel
      // calls, but sequential is simpler to reason about for partial failures.
      for (const target of targets) {
        await sendMessage({
          toId: target.id,
          toName: target.fullName,
          toType: "user",
          content: trimmed,
          productId: product.id,
          isProductRecommendation: true,
        });
      }
      router.back();
    } finally {
      setSending(false);
    }
  }

  if (!product) {
    return (
      <View style={[styles.container, { paddingTop: topPad + 8 }]}>
        <Pressable style={styles.iconBtn} onPress={() => router.back()}>
          <Feather name="x" size={22} color={Colors.text} />
        </Pressable>
        <View style={styles.empty}>
          <Text style={styles.emptyText}>Product not found</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: topPad + 8 }]}>
        <Pressable style={styles.iconBtn} onPress={() => router.back()}>
          <Feather name="x" size={22} color={Colors.text} />
        </Pressable>
        <Text style={styles.headerTitle}>Recommend</Text>
        <Pressable
          style={[
            styles.sendHeaderBtn,
            (selected.size === 0 || sending) && styles.sendHeaderBtnDisabled,
          ]}
          onPress={handleSend}
          disabled={selected.size === 0 || sending}
          testID="recommend-send"
        >
          <Text
            style={[
              styles.sendHeaderText,
              (selected.size === 0 || sending) && styles.sendHeaderTextDisabled,
            ]}
          >
            Send{selected.size > 0 ? ` (${selected.size})` : ""}
          </Text>
        </Pressable>
      </View>

      <View style={styles.previewRow}>
        <Image
          source={{ uri: product.imageUrl }}
          style={styles.previewImage}
          contentFit="cover"
        />
        <View style={styles.previewInfo}>
          <Text style={styles.previewTitle} numberOfLines={2}>
            {product.title}
          </Text>
          <Text style={styles.previewMeta} numberOfLines={1}>
            {product.size} · {product.era}
          </Text>
          <Text style={styles.previewShop} numberOfLines={1}>
            {shop?.name ?? "Shop"} · £{product.price}
          </Text>
        </View>
      </View>

      <TextInput
        style={styles.noteInput}
        placeholder="Add a note (optional)"
        placeholderTextColor={Colors.textTertiary}
        value={note}
        onChangeText={setNote}
        multiline
        maxLength={240}
      />

      <Text style={styles.sectionLabel}>
        {friends.length > 0 ? "Friends" : ""}
      </Text>

      <FlatList
        data={friends}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          const initials = item.fullName
            .split(" ")
            .map((n) => n[0])
            .join("");
          const isSelected = selected.has(item.id);
          return (
            <Pressable
              style={styles.friendRow}
              onPress={() => toggle(item.id)}
              testID={`recommend-friend-${item.id}`}
            >
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{initials}</Text>
              </View>
              <View style={styles.friendInfo}>
                <Text style={styles.friendName}>{item.fullName}</Text>
                <Text style={styles.friendBio}>{item.bio}</Text>
              </View>
              <View
                style={[
                  styles.checkbox,
                  isSelected && styles.checkboxSelected,
                ]}
              >
                {isSelected && (
                  <Feather name="check" size={14} color="#fff" />
                )}
              </View>
            </Pressable>
          );
        }}
        ItemSeparatorComponent={() => <View style={styles.sep} />}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Feather name="users" size={36} color={Colors.textTertiary} />
            <Text style={styles.emptyTitle}>No friends yet</Text>
            <Text style={styles.emptyText}>
              Follow people to recommend pieces.
            </Text>
            <Pressable
              style={styles.emptyBtn}
              onPress={() => {
                router.back();
                router.push("/(tabs)");
              }}
            >
              <Text style={styles.emptyBtnText}>Find people</Text>
            </Pressable>
          </View>
        }
        contentContainerStyle={{ paddingBottom: bottomPad + 40 }}
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
  iconBtn: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    flex: 1,
    textAlign: "center",
    fontFamily: "Inter_600SemiBold",
    fontSize: 16,
    color: Colors.text,
  },
  sendHeaderBtn: {
    paddingHorizontal: 14,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.text,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },
  sendHeaderBtnDisabled: { backgroundColor: Colors.card },
  sendHeaderText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 13,
    color: "#fff",
  },
  sendHeaderTextDisabled: { color: Colors.textTertiary },
  previewRow: {
    flexDirection: "row",
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  previewImage: {
    width: 60,
    height: 76,
    borderRadius: 6,
    backgroundColor: Colors.card,
  },
  previewInfo: { flex: 1, gap: 3, justifyContent: "center" },
  previewTitle: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 14,
    color: Colors.text,
    lineHeight: 19,
  },
  previewMeta: {
    fontFamily: "Inter_400Regular",
    fontSize: 12,
    color: Colors.textSecondary,
    textTransform: "capitalize",
  },
  previewShop: {
    fontFamily: "Inter_500Medium",
    fontSize: 12,
    color: Colors.text,
  },
  noteInput: {
    marginHorizontal: 16,
    marginTop: 14,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    padding: 12,
    fontFamily: "Inter_400Regular",
    fontSize: 14,
    color: Colors.text,
    minHeight: 60,
    maxHeight: 120,
  },
  sectionLabel: {
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 8,
    fontFamily: "Inter_600SemiBold",
    fontSize: 11,
    letterSpacing: 1.5,
    textTransform: "uppercase",
    color: Colors.textTertiary,
  },
  friendRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 12,
    gap: 14,
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 12,
    color: Colors.text,
  },
  friendInfo: { flex: 1, gap: 2 },
  friendName: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 15,
    color: Colors.text,
  },
  friendBio: {
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
    backgroundColor: Colors.surface,
  },
  checkboxSelected: {
    backgroundColor: Colors.text,
    borderColor: Colors.text,
  },
  sep: { height: 1, backgroundColor: Colors.border, marginLeft: 76 },
  empty: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 40,
    paddingTop: 60,
    gap: 10,
  },
  emptyTitle: {
    fontFamily: "PlayfairDisplay_700Bold",
    fontSize: 20,
    color: Colors.text,
    marginTop: 6,
  },
  emptyText: {
    fontFamily: "Inter_400Regular",
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: "center",
  },
  emptyBtn: {
    marginTop: 16,
    paddingHorizontal: 22,
    paddingVertical: 12,
    backgroundColor: Colors.text,
    borderRadius: 28,
  },
  emptyBtnText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 13,
    color: "#fff",
    letterSpacing: 0.3,
  },
});
