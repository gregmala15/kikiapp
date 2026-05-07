import React, { useEffect, useRef } from "react";
import {
  Animated,
  Pressable,
  StyleSheet,
  Text,
  View,
  Easing,
} from "react-native";
import { Image } from "expo-image";
import { router } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Colors from "@/constants/colors";
import { useAppContext } from "@/contexts/AppContext";

const VISIBLE_MS = 3500;

export function CartToast() {
  const { cartToast, hideCartToast } = useAppContext();
  const insets = useSafeAreaInsets();
  const translateY = useRef(new Animated.Value(120)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!cartToast) return;

    Animated.parallel([
      Animated.timing(translateY, {
        toValue: 0,
        duration: 260,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();

    timerRef.current = setTimeout(() => {
      dismiss();
    }, VISIBLE_MS);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cartToast?.key]);

  function dismiss() {
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: 120,
        duration: 220,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 180,
        useNativeDriver: true,
      }),
    ]).start(() => {
      hideCartToast();
    });
  }

  function openBag() {
    if (timerRef.current) clearTimeout(timerRef.current);
    hideCartToast();
    router.push("/(tabs)/bag");
  }

  if (!cartToast) return null;

  return (
    <Animated.View
      pointerEvents="box-none"
      style={[
        styles.wrap,
        { bottom: insets.bottom + 100, opacity, transform: [{ translateY }] },
      ]}
    >
      <Pressable style={styles.toast} onPress={openBag}>
        {cartToast.imageUrl ? (
          <Image
            source={{ uri: cartToast.imageUrl }}
            style={styles.thumb}
            contentFit="cover"
            transition={120}
          />
        ) : (
          <View style={[styles.thumb, styles.thumbFallback]}>
            <Feather name="shopping-bag" size={18} color="#fff" />
          </View>
        )}
        <View style={styles.text}>
          <Text style={styles.title} numberOfLines={1}>{cartToast.title}</Text>
          <Text style={styles.sub}>Added to bag · Tap to view</Text>
        </View>
        <Pressable
          onPress={dismiss}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          style={styles.close}
        >
          <Feather name="x" size={18} color="rgba(255,255,255,0.7)" />
        </Pressable>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: "absolute",
    left: 14,
    right: 14,
    zIndex: 9999,
    elevation: 12,
  },
  toast: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: Colors.text,
    borderRadius: 14,
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 16,
  },
  thumb: {
    width: 44,
    height: 44,
    borderRadius: 8,
    backgroundColor: "#333",
  },
  thumbFallback: {
    alignItems: "center",
    justifyContent: "center",
  },
  text: { flex: 1 },
  title: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 14,
    color: "#fff",
    letterSpacing: -0.2,
  },
  sub: {
    fontFamily: "Inter_400Regular",
    fontSize: 12,
    color: "rgba(255,255,255,0.7)",
    marginTop: 2,
  },
  close: {
    width: 28,
    height: 28,
    alignItems: "center",
    justifyContent: "center",
  },
});
