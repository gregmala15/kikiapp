import React, { useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  FlatList,
  Dimensions,
  Platform,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from "react-native";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import Colors from "@/constants/colors";
import { useAuth } from "@/contexts/AuthContext";

const { width } = Dimensions.get("window");

// Bumped whenever the slideshow content changes — lets us re-show
// onboarding to existing users when there's a meaningful update.
const ONBOARDING_KEY = "reliq_onboarding_seen_v1";

type Slide = {
  key: string;
  eyebrow?: string;
  title: string;
  body: string;
  icon: keyof typeof Ionicons.glyphMap;
  accent?: boolean; // dark accent panel (used for the welcome slide)
};

const SLIDES: Slide[] = [
  {
    key: "welcome",
    title: "Welcome to Reliq",
    body: "A new home for independent fashion and vintage finds — built for people who care where their clothes come from.",
    icon: "diamond-outline",
    accent: true,
  },
  {
    key: "certified",
    eyebrow: "Curated, not crowded",
    title: "Only certified shops",
    body: "Every shop on Reliq is a real, registered business. We verify each one before they can list a single piece — so you never wonder who you're buying from.",
    icon: "shield-checkmark-outline",
  },
  {
    key: "hidden-gems",
    eyebrow: "Discovery",
    title: "Find hidden gems",
    body: "Our editors surface under-the-radar shops and one-of-a-kind pieces in our Hidden Gems section — the things no generic algorithm would put in front of you.",
    icon: "sparkles-outline",
  },
  {
    key: "influences",
    eyebrow: "Style, with people",
    title: "Get influenced by people you trust",
    body: "Follow friends and tastemakers, set how much their style shapes your feed, and blend tastes together — your For You is yours, but informed by the people you admire.",
    icon: "people-outline",
  },
  {
    key: "recommend",
    eyebrow: "Share the find",
    title: "Send a piece to a friend",
    body: "Found something perfect for someone? Recommend it in one tap and start a conversation around it — fashion is more fun when it's social.",
    icon: "paper-plane-outline",
  },
];

export default function OnboardingScreen() {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const listRef = useRef<FlatList<Slide>>(null);
  const [index, setIndex] = useState(0);

  const isLast = index === SLIDES.length - 1;

  async function finish() {
    await AsyncStorage.setItem(ONBOARDING_KEY, "1");
    if (user) router.replace("/(tabs)");
    else router.replace("/(auth)/welcome");
  }

  function next() {
    if (Platform.OS !== "web") Haptics.selectionAsync();
    if (isLast) {
      finish();
      return;
    }
    listRef.current?.scrollToIndex({ index: index + 1, animated: true });
  }

  function onMomentumEnd(e: NativeSyntheticEvent<NativeScrollEvent>) {
    const i = Math.round(e.nativeEvent.contentOffset.x / width);
    if (i !== index) setIndex(i);
  }

  return (
    <View style={styles.root}>
      <View style={[styles.topBar, { paddingTop: insets.top + 12 }]}>
        <Text style={styles.brand}>Reliq</Text>
        {!isLast && (
          <Pressable
            onPress={finish}
            hitSlop={10}
            testID="onboarding-skip"
          >
            <Text style={styles.skip}>Skip</Text>
          </Pressable>
        )}
      </View>

      <FlatList
        ref={listRef}
        data={SLIDES}
        keyExtractor={(s) => s.key}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={onMomentumEnd}
        renderItem={({ item }) => (
          <View style={[styles.slide, { width }]}>
            <View
              style={[
                styles.iconWrap,
                item.accent && styles.iconWrapAccent,
              ]}
            >
              <Ionicons
                name={item.icon}
                size={item.accent ? 56 : 48}
                color={item.accent ? "#fff" : Colors.accent}
              />
            </View>
            {item.eyebrow && (
              <Text style={styles.eyebrow}>{item.eyebrow}</Text>
            )}
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.body}>{item.body}</Text>
          </View>
        )}
      />

      <View
        style={[
          styles.bottom,
          { paddingBottom: Math.max(insets.bottom, 20) + 16 },
        ]}
      >
        <View style={styles.dots}>
          {SLIDES.map((_, i) => (
            <View
              key={i}
              style={[styles.dot, i === index && styles.dotActive]}
            />
          ))}
        </View>
        <Pressable
          style={styles.cta}
          onPress={next}
          testID="onboarding-next"
        >
          <Text style={styles.ctaText}>
            {isLast ? "Get started" : "Next"}
          </Text>
          <Ionicons
            name={isLast ? "arrow-forward" : "chevron-forward"}
            size={18}
            color="#fff"
          />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingBottom: 12,
  },
  brand: {
    fontFamily: "PlayfairDisplay_700Bold",
    fontSize: 22,
    color: Colors.text,
    letterSpacing: -0.5,
  },
  skip: {
    fontFamily: "Inter_500Medium",
    fontSize: 13,
    color: Colors.textSecondary,
  },
  slide: {
    flex: 1,
    paddingHorizontal: 32,
    alignItems: "center",
    justifyContent: "center",
    gap: 18,
  },
  iconWrap: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: Colors.accentLight,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  iconWrapAccent: {
    backgroundColor: Colors.text,
  },
  eyebrow: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 11,
    letterSpacing: 1.5,
    textTransform: "uppercase",
    color: Colors.accent,
  },
  title: {
    fontFamily: "PlayfairDisplay_700Bold",
    fontSize: 30,
    color: Colors.text,
    letterSpacing: -0.5,
    textAlign: "center",
    lineHeight: 36,
  },
  body: {
    fontFamily: "Inter_400Regular",
    fontSize: 15,
    color: Colors.textSecondary,
    textAlign: "center",
    lineHeight: 23,
    maxWidth: 340,
  },
  bottom: {
    paddingHorizontal: 24,
    paddingTop: 16,
    gap: 18,
  },
  dots: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 6,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.cardBorder,
  },
  dotActive: {
    backgroundColor: Colors.text,
    width: 20,
  },
  cta: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: Colors.text,
    height: 54,
    borderRadius: 27,
  },
  ctaText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 15,
    color: "#fff",
    letterSpacing: 0.3,
  },
});
