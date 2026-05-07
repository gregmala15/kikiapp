import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Alert,
  ActivityIndicator,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import Colors from "@/constants/colors";
import { useAuth, AccountType } from "@/contexts/AuthContext";

export default function AccountTypeScreen() {
  const insets = useSafeAreaInsets();
  const { register } = useAuth();
  const params = useLocalSearchParams<{
    username: string;
    email: string;
    password: string;
  }>();
  const [selected, setSelected] = useState<AccountType | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleCreate() {
    if (!selected) {
      Alert.alert("Choose account type", "Please select User or Shop.");
      return;
    }
    setLoading(true);
    try {
      await register(params.username, params.email, params.password, selected);
      // Shoppers always see the intro slideshow on signup so we can
      // showcase what makes Reliq different (verified shops, hidden
      // gems, style influences, recommendations) before they land in
      // the feed. Shop accounts skip it — they go straight to setting
      // up their store.
      if (selected === "user") {
        router.replace("/onboarding");
      } else {
        router.replace("/(tabs)");
      }
    } catch (e: any) {
      Alert.alert("Registration failed", e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: insets.top + 20,
          paddingBottom: insets.bottom + 40,
          backgroundColor: Colors.background,
        },
      ]}
    >
      <Pressable style={styles.back} onPress={() => router.back()}>
        <Feather name="arrow-left" size={22} color={Colors.text} />
      </Pressable>

      <Text style={styles.title}>I am a...</Text>
      <Text style={styles.subtitle}>
        Choose how you want to use Reliq. You can always change this later.
      </Text>

      <View style={styles.options}>
        <Pressable
          style={[
            styles.option,
            selected === "user" && styles.optionSelected,
          ]}
          onPress={() => setSelected("user")}
        >
          <View style={styles.optionIcon}>
            <Feather
              name="user"
              size={28}
              color={selected === "user" ? Colors.accent : Colors.textSecondary}
            />
          </View>
          <View style={styles.optionText}>
            <Text
              style={[
                styles.optionTitle,
                selected === "user" && { color: Colors.text },
              ]}
            >
              Shopper
            </Text>
            <Text style={styles.optionDesc}>
              Discover and buy from independent brands and vintage shops
            </Text>
          </View>
          {selected === "user" && (
            <Feather name="check-circle" size={22} color={Colors.accent} />
          )}
        </Pressable>

        <Pressable
          style={[
            styles.option,
            selected === "shop" && styles.optionSelected,
          ]}
          onPress={() => setSelected("shop")}
        >
          <View style={styles.optionIcon}>
            <Feather
              name="shopping-bag"
              size={28}
              color={
                selected === "shop" ? Colors.accent : Colors.textSecondary
              }
            />
          </View>
          <View style={styles.optionText}>
            <Text
              style={[
                styles.optionTitle,
                selected === "shop" && { color: Colors.text },
              ]}
            >
              Shop
            </Text>
            <Text style={styles.optionDesc}>
              Sell your products and grow your independent fashion brand
            </Text>
          </View>
          {selected === "shop" && (
            <Feather name="check-circle" size={22} color={Colors.accent} />
          )}
        </Pressable>
      </View>

      <Pressable
        style={({ pressed }) => [
          styles.createBtn,
          { opacity: !selected || loading || pressed ? 0.6 : 1 },
        ]}
        onPress={handleCreate}
        disabled={!selected || loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.createBtnText}>Create Account</Text>
        )}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 28 },
  back: { width: 44, height: 44, justifyContent: "center", marginBottom: 32 },
  title: {
    fontFamily: "PlayfairDisplay_700Bold",
    fontSize: 38,
    color: Colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: "Inter_400Regular",
    fontSize: 15,
    color: Colors.textSecondary,
    lineHeight: 22,
    marginBottom: 40,
  },
  options: { flex: 1, gap: 16 },
  option: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
    gap: 16,
  },
  optionSelected: {
    borderColor: Colors.accent,
    backgroundColor: Colors.accentLight,
  },
  optionIcon: { width: 48, alignItems: "center" },
  optionText: { flex: 1, gap: 4 },
  optionTitle: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 17,
    color: Colors.textSecondary,
  },
  optionDesc: {
    fontFamily: "Inter_400Regular",
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
  createBtn: {
    backgroundColor: Colors.text,
    paddingVertical: 16,
    borderRadius: 6,
    alignItems: "center",
    marginTop: 24,
  },
  createBtnText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 15,
    color: "#FFFFFF",
    letterSpacing: 0.5,
  },
});
