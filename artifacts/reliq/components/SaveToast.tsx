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
import { Feather, Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Colors from "@/constants/colors";
import { SEED_PRODUCTS } from "@/constants/seed-data";
import { useAppContext } from "@/contexts/AppContext";

const VISIBLE_MS = 5000;

export function SaveToast() {
  const { saveToast, hideSaveToast } = useAppContext();
  const insets = useSafeAreaInsets();
  const translateY = useRef(new Animated.Value(120)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const product = saveToast
    ? SEED_PRODUCTS.find((p) => p.id === saveToast.productId)
    : null;

  useEffect(() => {
    if (!saveToast) return;

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
  }, [saveToast?.key]);

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
      hideSaveToast();
    });
  }

  function openPicker() {
    if (!saveToast) return;
    const productId = saveToast.productId;
    if (timerRef.current) clearTimeout(timerRef.current);
    hideSaveToast();
    router.push({
      pathname: "/save-to-collection",
      params: { productId },
    });
  }

  if (!saveToast) return null;

  return (
    <Animated.View
      pointerEvents="box-none"
      style={[
        styles.wrap,
        // Sits above both the bottom tab bar (~80) and the product
        // detail / shop footer action bars (~80). 100px clears both.
        { bottom: insets.bottom + 100, opacity, transform: [{ translateY }] },
      ]}
    >
      <Pressable style={styles.toast} onPress={openPicker}>
        {product ? (
          <Image
            source={{ uri: product.imageUrl }}
            style={styles.thumb}
            contentFit="cover"
            transition={120}
          />
        ) : (
          <View style={[styles.thumb, styles.thumbFallback]}>
            <Ionicons name="heart" size={18} color={Colors.danger} />
          </View>
        )}
        <View style={styles.text}>
          <Text style={styles.title}>Item saved</Text>
          <Text style={styles.sub}>Tap to add to a collection</Text>
        </View>
        <Pressable
          onPress={dismiss}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          style={styles.close}
        >
          <Feather name="x" size={18} color={Colors.textSecondary} />
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
