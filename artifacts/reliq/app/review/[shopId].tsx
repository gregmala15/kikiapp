import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  TextInput,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
  Alert,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather, Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import Colors from "@/constants/colors";
import { SEED_SHOPS } from "@/constants/seed-data";
import { useAppContext } from "@/contexts/AppContext";
import { useAuth } from "@/contexts/AuthContext";

const MIN_BODY = 10;
const MAX_BODY = 500;

export default function WriteReviewScreen() {
  const insets = useSafeAreaInsets();
  const { shopId } = useLocalSearchParams<{ shopId: string }>();
  const { user } = useAuth();
  const { addReview, hasPurchasedFromShop, hasReviewedShop, orders } =
    useAppContext();

  const shop = SEED_SHOPS.find((s) => s.id === shopId);
  const [rating, setRating] = useState(0);
  const [body, setBody] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Pull the most recent purchased item from this shop so the form can
  // attribute the review (renders as "Reviewing your purchase of X" and
  // is sent through to addReview as productId/productTitle).
  const recentItem = useMemo(() => {
    if (!shop) return null;
    for (const o of orders) {
      const match = o.items.find((it) => it.product.shopId === shop.id);
      if (match) return match.product;
    }
    return null;
  }, [orders, shop?.id]);

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const eligible = shop ? hasPurchasedFromShop(shop.id) : false;
  const already = shop ? hasReviewedShop(shop.id) : false;

  if (!shop) {
    return (
      <View style={[styles.container, { paddingTop: topPad + 8 }]}>
        <Pressable style={styles.iconBtn} onPress={() => router.back()}>
          <Feather name="x" size={22} color={Colors.text} />
        </Pressable>
        <View style={styles.empty}>
          <Text style={styles.emptyText}>Shop not found</Text>
        </View>
      </View>
    );
  }

  if (!user) {
    router.replace("/(auth)/login");
    return null;
  }

  const blocked = !eligible || already;
  const blockedReason = already
    ? "You've already reviewed this shop."
    : "You can only review shops you've bought from.";

  const trimmedLen = body.trim().length;
  const canSubmit =
    !blocked && rating > 0 && trimmedLen >= MIN_BODY && !submitting;

  async function handleSubmit() {
    if (!canSubmit || !shop) return;
    setSubmitting(true);
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    try {
      await addReview({
        shopId: shop.id,
        rating,
        body,
        productId: recentItem?.id,
        productTitle: recentItem?.title,
      });
      router.back();
    } catch (e) {
      Alert.alert("Couldn't submit review", (e as Error).message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={styles.container}
    >
      <View style={[styles.header, { paddingTop: topPad + 8 }]}>
        <Pressable style={styles.iconBtn} onPress={() => router.back()}>
          <Feather name="x" size={22} color={Colors.text} />
        </Pressable>
        <Text style={styles.headerTitle}>Write a review</Text>
        <Pressable
          style={[styles.submitBtn, !canSubmit && styles.submitBtnDisabled]}
          onPress={handleSubmit}
          disabled={!canSubmit}
          testID="review-submit"
        >
          <Text
            style={[
              styles.submitText,
              !canSubmit && styles.submitTextDisabled,
            ]}
          >
            Post
          </Text>
        </Pressable>
      </View>

      <ScrollView
        contentContainerStyle={styles.body}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.shopName}>{shop.name}</Text>
        <Text style={styles.shopMeta}>
          {shop.type === "vintage" ? "Vintage" : "Independent"} · {shop.city}
        </Text>

        {recentItem && !blocked && (
          <Text style={styles.contextLine}>
            Reviewing your purchase of{" "}
            <Text style={styles.contextItem}>{recentItem.title}</Text>
          </Text>
        )}

        {blocked && (
          <View style={styles.blockedNote}>
            <Feather name="lock" size={14} color={Colors.textTertiary} />
            <Text style={styles.blockedText}>{blockedReason}</Text>
          </View>
        )}

        <Text style={styles.label}>Your rating</Text>
        <View style={styles.starsRow}>
          {[1, 2, 3, 4, 5].map((n) => (
            <Pressable
              key={n}
              hitSlop={6}
              onPress={() => {
                if (Platform.OS !== "web") Haptics.selectionAsync();
                setRating(n);
              }}
              testID={`review-star-${n}`}
              disabled={blocked}
            >
              <Ionicons
                name={n <= rating ? "star" : "star-outline"}
                size={36}
                color={Colors.accent}
              />
            </Pressable>
          ))}
        </View>

        <Text style={styles.label}>What stood out?</Text>
        <TextInput
          style={[styles.input, blocked && styles.inputDisabled]}
          placeholder="Share what arrived, how it was packed, how the seller communicated…"
          placeholderTextColor={Colors.textTertiary}
          value={body}
          onChangeText={setBody}
          multiline
          maxLength={MAX_BODY}
          editable={!blocked}
          testID="review-body"
        />
        <Text style={styles.helper}>
          {trimmedLen < MIN_BODY
            ? `${MIN_BODY - trimmedLen} more character${
                MIN_BODY - trimmedLen === 1 ? "" : "s"
              } to post`
            : `${body.length}/${MAX_BODY}`}
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
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
  submitBtn: {
    paddingHorizontal: 14,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.text,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },
  submitBtnDisabled: { backgroundColor: Colors.card },
  submitText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 13,
    color: "#fff",
  },
  submitTextDisabled: { color: Colors.textTertiary },
  body: { padding: 20, gap: 14, paddingBottom: 60 },
  shopName: {
    fontFamily: "PlayfairDisplay_700Bold",
    fontSize: 26,
    color: Colors.text,
  },
  shopMeta: {
    fontFamily: "Inter_500Medium",
    fontSize: 11,
    color: Colors.textTertiary,
    letterSpacing: 0.8,
    textTransform: "uppercase",
    marginTop: -8,
  },
  contextLine: {
    fontFamily: "Inter_400Regular",
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 19,
  },
  contextItem: { fontFamily: "Inter_600SemiBold", color: Colors.text },
  blockedNote: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    padding: 12,
    borderRadius: 8,
    backgroundColor: Colors.card,
  },
  blockedText: {
    flex: 1,
    fontFamily: "Inter_400Regular",
    fontSize: 13,
    color: Colors.textSecondary,
  },
  label: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 11,
    color: Colors.textTertiary,
    letterSpacing: 1.2,
    textTransform: "uppercase",
    marginTop: 6,
  },
  starsRow: { flexDirection: "row", gap: 12, marginTop: -6 },
  input: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 10,
    padding: 14,
    fontFamily: "Inter_400Regular",
    fontSize: 14,
    color: Colors.text,
    minHeight: 120,
    maxHeight: 220,
    textAlignVertical: "top",
  },
  inputDisabled: { opacity: 0.5 },
  helper: {
    fontFamily: "Inter_400Regular",
    fontSize: 12,
    color: Colors.textTertiary,
    marginTop: -8,
  },
  empty: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 40,
    paddingTop: 60,
  },
  emptyText: {
    fontFamily: "Inter_400Regular",
    fontSize: 14,
    color: Colors.textSecondary,
  },
});
