import React, { useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  Platform,
} from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { Image } from "expo-image";
import * as Haptics from "expo-haptics";
import Colors from "@/constants/colors";
import { getUserById } from "@/constants/seed-data";
import {
  useAppContext,
  STYLE_BLEND_TOTAL,
  STYLE_BLEND_STEP,
} from "@/contexts/AppContext";
import { useAuth } from "@/contexts/AuthContext";

// -----------------------------------------------------------------------------
// Style Blend management screen
// -----------------------------------------------------------------------------
// Shows the user's full % allocation as a stacked bar at the top, then lists:
//   1) "Me" — the implicit, derived row (myStyleWeight = 100 - sum of all
//             influence weights). Cannot be edited directly; it grows/shrinks
//             as a side-effect of changing the others.
//   2) One row per influence — each with a − / + control in 5% increments
//      and a remove (×) button.
//
// All weight changes are clamped in AppContext.setStyleInfluenceWeight so the
// sum can never exceed 100. The "+" button on a row is disabled when the
// blend total is already 100 (no headroom left).
// -----------------------------------------------------------------------------
export default function StyleBlendScreen() {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const {
    styleInfluences,
    setStyleInfluenceWeight,
    toggleStyleInfluence,
    myStyleWeight,
  } = useAppContext();

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;

  // Filter to current user's rows so the screen never reflects stale state
  // from a previously logged-in account.
  const rows = useMemo(
    () =>
      styleInfluences
        .filter((i) => !user || i.userId === user.id)
        .map((i) => ({
          influenceUserId: i.influenceUserId,
          weight: i.weight,
          user: getUserById(i.influenceUserId),
        }))
        .filter((r) => r.user)
        .sort((a, b) => b.weight - a.weight),
    [styleInfluences, user?.id],
  );

  const blendFull = myStyleWeight === 0;

  function bump(targetUserId: string, delta: number) {
    if (Platform.OS !== "web") {
      Haptics.selectionAsync();
    }
    const current = rows.find((r) => r.influenceUserId === targetUserId);
    const nextRequested = (current?.weight ?? 0) + delta;
    setStyleInfluenceWeight(targetUserId, nextRequested);
  }

  function remove(targetUserId: string) {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    toggleStyleInfluence(targetUserId);
  }

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: topPad }]}>
        <Pressable
          style={styles.headerBtn}
          onPress={() => router.back()}
          testID="blend-back"
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <Feather name="chevron-left" size={24} color={Colors.text} />
        </Pressable>
        <Text style={styles.headerTitle}>Style Blend</Text>
        <View style={styles.headerBtn} />
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.scroll,
          { paddingBottom: bottomPad + 32 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.intro}>
          Choose how much of your For You feed comes from you versus the
          people whose taste you trust. Total stays at {STYLE_BLEND_TOTAL}%.
        </Text>

        {/* Stacked bar — visual summary of the full 100% allocation. */}
        <View style={styles.bar} testID="blend-bar">
          <View
            style={[styles.barSegmentMe, { flex: Math.max(myStyleWeight, 0.001) }]}
          />
          {rows.map((r) => (
            <View
              key={r.influenceUserId}
              style={[
                styles.barSegmentInfluence,
                { flex: Math.max(r.weight, 0.001) },
              ]}
            />
          ))}
        </View>

        {/* "Me" row — derived, not editable. */}
        <View style={[styles.row, styles.rowMe]} testID="blend-row-me">
          <View style={styles.avatarMe}>
            <Feather name="user" size={18} color={Colors.surface} />
          </View>
          <View style={styles.info}>
            <Text style={styles.name}>Me</Text>
            <Text style={styles.sub}>Your own taste</Text>
          </View>
          <Text style={styles.pct} testID="blend-pct-me">
            {myStyleWeight}%
          </Text>
        </View>

        {rows.length === 0 ? (
          <View style={styles.empty}>
            <Text style={styles.emptyTitle}>No influences yet</Text>
            <Text style={styles.emptyText}>
              Open someone&apos;s profile and turn on “Include in my feed” to
              add them to your blend.
            </Text>
          </View>
        ) : (
          rows.map((r) => {
            if (!r.user) return null;
            const cannotIncrease = blendFull;
            const cannotDecrease = r.weight <= 0;
            return (
              <View
                key={r.influenceUserId}
                style={styles.row}
                testID={`blend-row-${r.influenceUserId}`}
              >
                <Image
                  source={{ uri: r.user.avatarUrl }}
                  style={styles.avatar}
                />
                <View style={styles.info}>
                  <Text style={styles.name}>{r.user.fullName}</Text>
                  <Text style={styles.sub}>@{r.user.username}</Text>
                </View>
                <View style={styles.controls}>
                  <Pressable
                    style={[
                      styles.stepBtn,
                      cannotDecrease && styles.stepBtnDisabled,
                    ]}
                    onPress={() => bump(r.influenceUserId, -STYLE_BLEND_STEP)}
                    disabled={cannotDecrease}
                    testID={`blend-dec-${r.influenceUserId}`}
                    accessibilityRole="button"
                    accessibilityLabel={`Decrease ${r.user.fullName}'s share`}
                    accessibilityHint={`Reduces by ${STYLE_BLEND_STEP} percent`}
                  >
                    <Feather
                      name="minus"
                      size={16}
                      color={cannotDecrease ? Colors.textTertiary : Colors.text}
                    />
                  </Pressable>
                  <Text
                    style={styles.pct}
                    testID={`blend-pct-${r.influenceUserId}`}
                  >
                    {r.weight}%
                  </Text>
                  <Pressable
                    style={[
                      styles.stepBtn,
                      cannotIncrease && styles.stepBtnDisabled,
                    ]}
                    onPress={() => bump(r.influenceUserId, STYLE_BLEND_STEP)}
                    disabled={cannotIncrease}
                    testID={`blend-inc-${r.influenceUserId}`}
                    accessibilityRole="button"
                    accessibilityLabel={`Increase ${r.user.fullName}'s share`}
                    accessibilityHint={`Adds ${STYLE_BLEND_STEP} percent`}
                  >
                    <Feather
                      name="plus"
                      size={16}
                      color={cannotIncrease ? Colors.textTertiary : Colors.text}
                    />
                  </Pressable>
                </View>
                <Pressable
                  style={styles.removeBtn}
                  onPress={() => remove(r.influenceUserId)}
                  testID={`blend-remove-${r.influenceUserId}`}
                  accessibilityRole="button"
                  accessibilityLabel={`Remove ${r.user.fullName} from blend`}
                >
                  <Feather name="x" size={16} color={Colors.textSecondary} />
                </Pressable>
              </View>
            );
          })
        )}

        {blendFull && rows.length > 0 && (
          <Text style={styles.fullNote}>
            Blend is full — lower someone&apos;s % to free up room for more of
            your own taste.
          </Text>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    paddingBottom: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.borderLight,
    backgroundColor: Colors.background,
  },
  headerBtn: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 16,
    fontFamily: "Inter_600SemiBold",
    color: Colors.text,
    flex: 1,
    textAlign: "center",
  },
  scroll: { paddingHorizontal: 20, paddingTop: 24 },
  intro: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    color: Colors.textSecondary,
    lineHeight: 19,
    marginBottom: 18,
  },
  bar: {
    flexDirection: "row",
    height: 10,
    borderRadius: 5,
    overflow: "hidden",
    backgroundColor: Colors.card,
    marginBottom: 24,
  },
  barSegmentMe: { backgroundColor: Colors.text },
  barSegmentInfluence: {
    backgroundColor: Colors.accent,
    borderLeftWidth: 1,
    borderLeftColor: Colors.background,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 12,
    backgroundColor: Colors.surface,
    borderRadius: 14,
    marginBottom: 10,
    gap: 10,
  },
  rowMe: { backgroundColor: Colors.card },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.card,
  },
  avatarMe: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.text,
    alignItems: "center",
    justifyContent: "center",
  },
  info: { flex: 1 },
  name: {
    fontSize: 14,
    fontFamily: "Inter_600SemiBold",
    color: Colors.text,
  },
  sub: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    color: Colors.textSecondary,
  },
  controls: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  stepBtn: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.surface,
  },
  stepBtnDisabled: { backgroundColor: Colors.borderLight, borderColor: Colors.borderLight },
  pct: {
    fontSize: 13,
    fontFamily: "Inter_600SemiBold",
    color: Colors.text,
    minWidth: 38,
    textAlign: "center",
  },
  removeBtn: {
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
  },
  empty: { paddingVertical: 28, alignItems: "center" },
  emptyTitle: {
    fontSize: 15,
    fontFamily: "PlayfairDisplay_700Bold",
    color: Colors.text,
    marginBottom: 4,
  },
  emptyText: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    color: Colors.textSecondary,
    textAlign: "center",
    lineHeight: 17,
  },
  fullNote: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    color: Colors.textSecondary,
    textAlign: "center",
    marginTop: 12,
    lineHeight: 17,
  },
});
