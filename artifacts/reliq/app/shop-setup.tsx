import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  TextInput,
  ScrollView,
  Alert,
  ActivityIndicator,
  Platform,
} from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import Colors from "@/constants/colors";
import { useAppContext } from "@/contexts/AppContext";
import { useAuth } from "@/contexts/AuthContext";

// Reliq is curated to vintage shops only — the platform's editorial
// positioning is built around verified, physical vintage stores. The
// independent-brand path was removed from the UI; the underlying union
// type still includes "independent" because seeded demo shops in
// constants/seed-data.ts use it. User-created shops are always
// { type: "vintage", isPhysical: true } and must provide an address.
export default function ShopSetupScreen() {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const { createShop, userShop } = useAppContext();

  const [name, setName] = useState(userShop?.name ?? "");
  const [description, setDescription] = useState(userShop?.description ?? "");
  const [city, setCity] = useState(userShop?.city ?? "");
  const [socialHandle, setSocialHandle] = useState(userShop?.socialHandle ?? "@");
  const [email, setEmail] = useState(userShop?.email ?? user?.email ?? "");
  const [address, setAddress] = useState(userShop?.address ?? "");
  const [loading, setLoading] = useState(false);

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;

  async function handleSave() {
    if (
      !name.trim() ||
      !description.trim() ||
      !city.trim() ||
      !email.trim() ||
      !address.trim()
    ) {
      Alert.alert(
        "Missing fields",
        "Please fill in all required fields, including your storefront address.",
      );
      return;
    }
    // Capture the create-vs-edit distinction before the save flips state,
    // so the post-save routing is correct: brand-new shops go forward
    // into the dashboard; edits just pop back to wherever they came from.
    const wasCreating = !userShop;
    setLoading(true);
    try {
      await createShop({
        name: name.trim(),
        type: "vintage",
        description: description.trim(),
        city: city.trim(),
        socialHandle: socialHandle.trim(),
        email: email.trim(),
        isPhysical: true,
        address: address.trim(),
      });
      if (wasCreating) {
        Alert.alert(
          "Shop created!",
          "Your shop is ready. Start adding products to your rack.",
          [
            {
              text: "Great!",
              onPress: () => router.replace("/(shop-tabs)"),
            },
          ],
        );
      } else {
        Alert.alert("Shop updated", "Your changes have been saved.", [
          { text: "OK", onPress: () => router.back() },
        ]);
      }
    } catch (e: any) {
      Alert.alert("Error", e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={[styles.container, { backgroundColor: Colors.background }]}>
      <View
        style={[
          styles.header,
          { paddingTop: topPad + 12, borderBottomColor: Colors.border },
        ]}
      >
        <Text style={styles.title}>
          {userShop ? "Edit Shop" : "Create Shop"}
        </Text>
        <Pressable style={styles.closeBtn} onPress={() => router.back()}>
          <Feather name="x" size={22} color={Colors.text} />
        </Pressable>
      </View>

      <ScrollView
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scroll,
          { paddingBottom: bottomPad + 100 },
        ]}
      >
        <Text style={styles.sectionLabel}>Shop Details</Text>

        <View style={styles.field}>
          <Text style={styles.fieldLabel}>Shop Name *</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="Your shop name"
            placeholderTextColor={Colors.textTertiary}
          />
        </View>

        {/* Type is fixed to "vintage" — Reliq only onboards vintage
            stores. Render as a static badge so shop owners understand
            why there's no choice rather than just hiding the field. */}
        <View style={styles.field}>
          <Text style={styles.fieldLabel}>Shop Type</Text>
          <View style={styles.typeBadge}>
            <Feather name="archive" size={16} color={Colors.text} />
            <Text style={styles.typeBadgeText}>Vintage Shop</Text>
          </View>
          <Text style={styles.fieldHint}>
            Reliq is curated to vintage stores only.
          </Text>
        </View>

        <View style={styles.field}>
          <Text style={styles.fieldLabel}>Description *</Text>
          <TextInput
            style={[styles.input, styles.textarea]}
            value={description}
            onChangeText={setDescription}
            placeholder="Tell us about your shop, your style, your story..."
            placeholderTextColor={Colors.textTertiary}
            multiline
            numberOfLines={4}
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.fieldLabel}>City *</Text>
          <TextInput
            style={styles.input}
            value={city}
            onChangeText={setCity}
            placeholder="e.g. London, Rome, Paris"
            placeholderTextColor={Colors.textTertiary}
          />
        </View>

        <Text style={[styles.sectionLabel, { marginTop: 28 }]}>
          Contact & Presence
        </Text>

        <View style={styles.field}>
          <Text style={styles.fieldLabel}>Instagram Handle</Text>
          <TextInput
            style={styles.input}
            value={socialHandle}
            onChangeText={setSocialHandle}
            placeholder="@yourshop"
            placeholderTextColor={Colors.textTertiary}
            autoCapitalize="none"
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.fieldLabel}>Email *</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="shop@example.com"
            placeholderTextColor={Colors.textTertiary}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <Text style={[styles.sectionLabel, { marginTop: 28 }]}>
          Physical Storefront
        </Text>

        {/* Every Reliq shop is required to have a real, physical
            storefront — it's part of how we keep the marketplace
            authentic and verifiable. The toggle was removed so the
            address is always required. */}
        <View style={styles.field}>
          <Text style={styles.fieldLabel}>Storefront Address *</Text>
          <TextInput
            style={styles.input}
            value={address}
            onChangeText={setAddress}
            placeholder="123 Fashion Street"
            placeholderTextColor={Colors.textTertiary}
          />
          <Text style={styles.fieldHint}>
            All Reliq shops must operate from a verifiable physical
            location.
          </Text>
        </View>
      </ScrollView>

      <View
        style={[
          styles.footer,
          {
            paddingBottom: bottomPad + 12,
            borderTopColor: Colors.border,
          },
        ]}
      >
        <Pressable
          style={({ pressed }) => [
            styles.saveBtn,
            { opacity: loading || pressed ? 0.85 : 1 },
          ]}
          onPress={handleSave}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.saveBtnText}>
              {userShop ? "Save Changes" : "Create Shop"}
            </Text>
          )}
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingBottom: 14,
    borderBottomWidth: 1,
  },
  title: {
    fontFamily: "PlayfairDisplay_700Bold",
    fontSize: 24,
    color: Colors.text,
  },
  closeBtn: { padding: 8 },
  scroll: { paddingHorizontal: 20, paddingTop: 24 },
  sectionLabel: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 12,
    color: Colors.text,
    letterSpacing: 1,
    textTransform: "uppercase",
    marginBottom: 16,
  },
  field: { marginBottom: 16 },
  fieldLabel: {
    fontFamily: "Inter_500Medium",
    fontSize: 11,
    color: Colors.text,
    letterSpacing: 0.5,
    textTransform: "uppercase",
    marginBottom: 8,
  },
  input: {
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 13,
    fontFamily: "Inter_400Regular",
    fontSize: 15,
    color: Colors.text,
  },
  textarea: { minHeight: 100, textAlignVertical: "top", paddingTop: 12 },
  typeRow: { flexDirection: "row", gap: 10 },
  typeBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 14,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
  },
  typeBtnActive: {
    backgroundColor: Colors.text,
    borderColor: Colors.text,
  },
  typeBtnText: {
    fontFamily: "Inter_500Medium",
    fontSize: 13,
    color: Colors.textSecondary,
  },
  typeBtnTextActive: { color: "#fff" },
  typeBadge: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    gap: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  typeBadgeText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 13,
    color: Colors.text,
    letterSpacing: 0.4,
  },
  fieldHint: {
    fontFamily: "Inter_400Regular",
    fontSize: 12,
    color: Colors.textTertiary,
    marginTop: 6,
    lineHeight: 17,
  },
  toggleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  toggleLabel: {
    fontFamily: "Inter_500Medium",
    fontSize: 15,
    color: Colors.text,
  },
  toggle: {
    width: 50,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.border,
    padding: 3,
  },
  toggleActive: { backgroundColor: Colors.accent },
  toggleThumb: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: "#fff",
  },
  toggleThumbActive: { transform: [{ translateX: 22 }] },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingTop: 16,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    backgroundColor: Colors.background,
  },
  saveBtn: {
    backgroundColor: Colors.text,
    paddingVertical: 16,
    borderRadius: 6,
    alignItems: "center",
  },
  saveBtnText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 15,
    color: "#fff",
  },
});
