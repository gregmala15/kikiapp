import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  StatusBar,
  Platform,
} from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Image } from "expo-image";
import Colors from "@/constants/colors";

export default function WelcomeScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <Image
        source={{ uri: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&q=90" }}
        style={StyleSheet.absoluteFill}
        contentFit="cover"
      />
      <View style={[StyleSheet.absoluteFill, styles.overlay]} />

      <View style={[styles.content, { paddingTop: insets.top + 60, paddingBottom: insets.bottom + 40 }]}>
        <View style={styles.top}>
          <Text style={styles.logo}>KIKI</Text>
          <Text style={styles.tagline}>
            Kreating Infrastructure{"\n"}for Kreative Independence
          </Text>
        </View>

        <View style={styles.bottom}>
          <Text style={styles.headline}>
            Discover independent fashion.{"\n"}Wear something rare.
          </Text>

          <View style={styles.buttons}>
            <Pressable
              style={({ pressed }) => [styles.primaryBtn, { opacity: pressed ? 0.9 : 1 }]}
              onPress={() => router.push("/(auth)/register")}
            >
              <Text style={styles.primaryBtnText}>Get Started</Text>
            </Pressable>
            <Pressable
              style={({ pressed }) => [styles.secondaryBtn, { opacity: pressed ? 0.7 : 1 }]}
              onPress={() => router.push("/(auth)/login")}
            >
              <Text style={styles.secondaryBtnText}>Sign In</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  overlay: {
    backgroundColor: "rgba(0,0,0,0.45)",
  },
  content: {
    flex: 1,
    paddingHorizontal: 32,
    justifyContent: "space-between",
  },
  top: {
    alignItems: "center",
    gap: 12,
  },
  logo: {
    fontFamily: "PlayfairDisplay_700Bold",
    fontSize: 52,
    color: "#FFFFFF",
    letterSpacing: 12,
  },
  tagline: {
    fontFamily: "Inter_400Regular",
    fontSize: 11,
    color: "rgba(255,255,255,0.65)",
    textAlign: "center",
    letterSpacing: 2,
    textTransform: "uppercase",
  },
  bottom: {
    gap: 32,
  },
  headline: {
    fontFamily: "PlayfairDisplay_400Regular_Italic",
    fontSize: 28,
    color: "#FFFFFF",
    lineHeight: 40,
  },
  buttons: {
    gap: 12,
  },
  primaryBtn: {
    backgroundColor: "#FFFFFF",
    paddingVertical: 17,
    borderRadius: 4,
    alignItems: "center",
  },
  primaryBtnText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 15,
    color: Colors.text,
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  secondaryBtn: {
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.5)",
    paddingVertical: 17,
    borderRadius: 4,
    alignItems: "center",
  },
  secondaryBtnText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 15,
    color: "#FFFFFF",
    letterSpacing: 1,
    textTransform: "uppercase",
  },
});
