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
import Colors from "@/constants/colors";
import { getUserById } from "@/constants/seed-data";
import {
  useAppContext,
  InfluenceLevel,
  INFLUENCE_LEVEL_WEIGHTS,
} from "@/contexts/AppContext";
import { useAuth } from "@/contexts/AuthContext";
import {
  InfluenceSelector,
  InfluenceSelection,
} from "@/components/InfluenceSelector";

// -----------------------------------------------------------------------------
// Style Blend (now called "Style Influence" in copy)
// -----------------------------------------------------------------------------
// Lists every user who currently influences the For You feed, with a 5-stop
// segmented control per row (Off · Light · Medium · Strong · Heavy).
//
// What changed vs the older percentage UI:
//   - There is no "Me" row, no totals, no stacked bar.
//   - Levels are independent boosts — the user's own taste is always the
//     base of the feed, and nothing here can "use it up" or replace it.
//   - Setting a row to Off removes that person from the blend entirely.
// -----------------------------------------------------------------------------
export default function StyleBlendScreen() {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const { styleInfluences, setStyleInfluenceLevel } = useAppContext();

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;

  // Filter to current user's rows so the screen never reflects stale state
  // from a previously logged-in account. Sort by boost strength (heavy
  // first) so the rows the feed weighs most heavily are visually on top.
  const rows = useMemo(
    () =>
      styleInfluences
        .filter((i) => !user || i.userId === user.id)
        .map((i) => ({
          influenceUserId: i.influenceUserId,
          level: i.level,
          user: getUserById(i.influenceUserId),
        }))
        .filter((r) => r.user)
        .sort(
          (a, b) =>
            INFLUENCE_LEVEL_WEIGHTS[b.level] - INFLUENCE_LEVEL_WEIGHTS[a.level],
        ),
    [styleInfluences, user?.id],
  );

  // The selector reports its full 5-stop selection, but at this screen
  // we only ever render rows for users that ARE currently influences.
  // Picking "Off" therefore removes the row from the list — that's the
  // only side-effect we care about here.
  function handleChange(targetUserId: string, next: InfluenceSelection) {
    setStyleInfluenceLevel(targetUserId, next);
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
        <Text style={styles.headerTitle}>Style Influence</Text>
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
          Your taste anchors the For You feed. Add the people you trust and
          choose how strongly each one nudges your recommendations.
        </Text>

        {rows.length === 0 ? (
          <View style={styles.empty} testID="blend-empty">
            <Text style={styles.emptyTitle}>No influences yet</Text>
            <Text style={styles.emptyText}>
              Open someone&apos;s profile and pick a Style Influence level —
              Light, Medium, Strong, or Heavy — to add them here.
            </Text>
          </View>
        ) : (
          rows.map((r) => {
            if (!r.user) return null;
            // Currently-influenced rows always have a real level (never
            // "off"), but the selector control's value type is the union
            // because tapping "Off" inside it removes the row.
            const value: InfluenceSelection = r.level as InfluenceLevel;
            return (
              <View
                key={r.influenceUserId}
                style={styles.row}
                testID={`blend-row-${r.influenceUserId}`}
              >
                <View style={styles.rowHead}>
                  <Image
                    source={{ uri: r.user.avatarUrl }}
                    style={styles.avatar}
                  />
                  <View style={styles.info}>
                    <Text style={styles.name}>{r.user.fullName}</Text>
                    <Text style={styles.sub}>@{r.user.username}</Text>
                  </View>
                </View>
                <InfluenceSelector
                  value={value}
                  onChange={(next) => handleChange(r.influenceUserId, next)}
                  testIDPrefix={`blend-influence-${r.influenceUserId}`}
                />
              </View>
            );
          })
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
    marginBottom: 22,
  },
  // Each influenced user gets a card-style block: identity on top, then
  // the segmented selector underneath. This vertical layout keeps the
  // 5-stop control comfortably tappable on a 375pt phone — laying it
  // out beside the avatar would squash the chip labels.
  row: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 14,
    marginBottom: 12,
    gap: 12,
  },
  rowHead: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.card,
  },
  info: { flex: 1 },
  name: {
    fontSize: 15,
    fontFamily: "Inter_600SemiBold",
    color: Colors.text,
  },
  sub: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    color: Colors.textSecondary,
    marginTop: 2,
  },
  empty: { paddingVertical: 32, alignItems: "center" },
  emptyTitle: {
    fontSize: 16,
    fontFamily: "PlayfairDisplay_700Bold",
    color: Colors.text,
    marginBottom: 6,
  },
  emptyText: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    color: Colors.textSecondary,
    textAlign: "center",
    lineHeight: 18,
    paddingHorizontal: 12,
  },
});
