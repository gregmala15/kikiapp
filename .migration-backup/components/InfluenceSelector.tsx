import React from "react";
import { View, Text, StyleSheet, Pressable, Platform } from "react-native";
import * as Haptics from "expo-haptics";
import Colors from "@/constants/colors";
import { InfluenceLevel, INFLUENCE_LEVELS } from "@/contexts/AppContext";

// -----------------------------------------------------------------------------
// InfluenceSelector
// -----------------------------------------------------------------------------
// A 5-stop segmented selector — Off · Light · Medium · Strong · Heavy — used
// in two places:
//   1. The user profile screen, to set the influence level for one person.
//   2. The Style Blend management screen, on every influenced user row.
//
// "Off" is treated as just another stop in the same control rather than a
// separate switch. That's what gives the new UX its calm, premium feel —
// you don't toggle someone in and then adjust a slider; you just pick one
// of five levels in a single tap, and Off is one of those five.
//
// The component is intentionally pure: it renders the current `value` and
// fires `onChange` when the user picks a different stop. All persistence
// lives in AppContext (setStyleInfluenceLevel).
// -----------------------------------------------------------------------------

export type InfluenceSelection = InfluenceLevel | "off";

// Keep the order Off → Heavy so visual reading order matches the boost
// magnitude (left = no influence, right = maximum boost).
const STOPS: InfluenceSelection[] = ["off", ...INFLUENCE_LEVELS];

const LABELS: Record<InfluenceSelection, string> = {
  off: "Off",
  light: "Light",
  medium: "Medium",
  strong: "Strong",
  heavy: "Heavy",
};

interface Props {
  value: InfluenceSelection;
  onChange: (next: InfluenceSelection) => void;
  // Used to namespace per-stop testIDs in tests:
  //   `${testIDPrefix}-off`, `${testIDPrefix}-light`, etc.
  // Also exposed as a single container testID at `${testIDPrefix}-selector`.
  testIDPrefix: string;
}

export function InfluenceSelector({ value, onChange, testIDPrefix }: Props) {
  function pick(stop: InfluenceSelection) {
    // No-op when re-tapping the active stop — avoids superfluous re-renders
    // and keeps haptics from firing on every accidental touch.
    if (stop === value) return;
    if (Platform.OS !== "web") {
      Haptics.selectionAsync();
    }
    onChange(stop);
  }

  // Accessibility: this is a mutually-exclusive choice control, so the
  // container is announced as a radio group and each chip as a radio
  // button. Screen-readers will speak something like "Style influence,
  // Medium, selected, 3 of 5" — much clearer than five independent
  // buttons that all happen to look segmented.
  return (
    <View
      style={styles.row}
      testID={`${testIDPrefix}-selector`}
      accessibilityRole="radiogroup"
      accessibilityLabel="Style influence level"
    >
      {STOPS.map((stop) => {
        const active = stop === value;
        return (
          <Pressable
            key={stop}
            onPress={() => pick(stop)}
            style={[styles.chip, active && styles.chipActive]}
            testID={`${testIDPrefix}-${stop}`}
            accessibilityRole="radio"
            accessibilityState={{ checked: active, selected: active }}
            accessibilityLabel={LABELS[stop]}
            accessibilityHint={
              active
                ? "Currently selected"
                : `Set style influence to ${LABELS[stop]}`
            }
          >
            <Text style={[styles.chipText, active && styles.chipTextActive]}>
              {LABELS[stop]}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  // Pill-shaped track that holds the five stops. Inset 4px of padding so
  // the active chip's filled background "floats" inside the track without
  // touching the outer edge — the iOS Settings segmented look.
  row: {
    flexDirection: "row",
    backgroundColor: Colors.card,
    borderRadius: 999,
    padding: 4,
    gap: 2,
  },
  chip: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
  },
  // Active chip is filled with the brand's strongest text colour for
  // strong contrast against the cream track. The inactive chips inherit
  // the track colour and are visually quiet by design.
  chipActive: {
    backgroundColor: Colors.text,
  },
  chipText: {
    fontSize: 12,
    fontFamily: "Inter_500Medium",
    color: Colors.textSecondary,
    letterSpacing: 0.3,
  },
  chipTextActive: {
    color: Colors.surface,
    fontFamily: "Inter_600SemiBold",
  },
});
