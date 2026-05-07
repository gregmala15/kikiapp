import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  Alert,
  Platform,
} from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather, Ionicons } from "@expo/vector-icons";
import Colors from "@/constants/colors";
import { useAuth } from "@/contexts/AuthContext";
import { useAppContext } from "@/contexts/AppContext";

export default function ShopProfileScreen() {
  const insets = useSafeAreaInsets();
  const { user, logout } = useAuth();
  const { userShop } = useAppContext();
  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 120 : insets.bottom + 100;

  function handleLogout() {
    Alert.alert("Sign out", "Are you sure you want to sign out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Sign out",
        style: "destructive",
        onPress: async () => {
          await logout();
          router.replace("/(auth)/welcome");
        },
      },
    ]);
  }

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: Colors.background }}
      contentContainerStyle={{
        paddingBottom: bottomPad,
        paddingTop: topPad + 16,
      }}
    >
      <View style={styles.hero}>
        <View style={styles.heroAvatar}>
          <Ionicons name="storefront" size={28} color="#fff" />
        </View>
        <Text style={styles.shopName}>
          {userShop?.name ?? user?.username ?? "Your shop"}
        </Text>
        <Text style={styles.email}>{user?.email}</Text>
      </View>

      {userShop ? (
        <>
          <Section>
            <Row
              icon="edit-2"
              label="Edit shop profile"
              onPress={() => router.push("/shop-setup")}
            />
            <Row
              icon="plus"
              label="Add product"
              onPress={() => router.push("/add-product")}
            />
          </Section>
          <Section title="Shop details">
            <Row icon="map-pin" label={userShop.city} />
            <Row icon="mail" label={userShop.email} />
            {userShop.address ? (
              <Row icon="home" label={userShop.address} />
            ) : null}
            <Row icon="tag" label="Vintage" />
          </Section>
        </>
      ) : (
        <Section>
          <Row
            icon="plus-circle"
            label="Set up shop profile"
            onPress={() => router.push("/shop-setup")}
          />
        </Section>
      )}

      <Section>
        <Row icon="log-out" label="Sign out" onPress={handleLogout} danger />
      </Section>
    </ScrollView>
  );
}

function Section({
  title,
  children,
}: {
  title?: string;
  children: React.ReactNode;
}) {
  return (
    <View style={styles.section}>
      {title ? <Text style={styles.sectionTitle}>{title}</Text> : null}
      <View style={styles.sectionInner}>{children}</View>
    </View>
  );
}

function Row({
  icon,
  label,
  onPress,
  danger,
}: {
  icon: keyof typeof Feather.glyphMap;
  label: string;
  onPress?: () => void;
  danger?: boolean;
}) {
  const Inner = (
    <View style={styles.row}>
      <Feather
        name={icon}
        size={18}
        color={danger ? Colors.danger : Colors.text}
      />
      <Text style={[styles.rowText, danger && { color: Colors.danger }]}>
        {label}
      </Text>
      {onPress && (
        <Feather name="chevron-right" size={18} color={Colors.textTertiary} />
      )}
    </View>
  );
  if (onPress) {
    return <Pressable onPress={onPress}>{Inner}</Pressable>;
  }
  return Inner;
}

const styles = StyleSheet.create({
  hero: {
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 16,
    gap: 8,
  },
  heroAvatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: Colors.text,
    alignItems: "center",
    justifyContent: "center",
  },
  shopName: {
    fontFamily: "PlayfairDisplay_700Bold",
    fontSize: 24,
    color: Colors.text,
    letterSpacing: -0.5,
    marginTop: 6,
  },
  email: {
    fontFamily: "Inter_400Regular",
    fontSize: 13,
    color: Colors.textSecondary,
  },
  section: {
    marginTop: 22,
    paddingHorizontal: 20,
    gap: 8,
  },
  sectionTitle: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 11,
    letterSpacing: 1.2,
    textTransform: "uppercase",
    color: Colors.textTertiary,
    marginBottom: 4,
  },
  sectionInner: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    overflow: "hidden",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.borderLight,
  },
  rowText: {
    flex: 1,
    fontFamily: "Inter_500Medium",
    fontSize: 14,
    color: Colors.text,
  },
});
