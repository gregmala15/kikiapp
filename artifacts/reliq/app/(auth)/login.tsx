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
} from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import Colors from "@/constants/colors";
import { useAuth } from "@/contexts/AuthContext";

export default function LoginScreen() {
  const insets = useSafeAreaInsets();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    if (!email.trim() || !password.trim()) {
      Alert.alert("Missing fields", "Please enter your email and password.");
      return;
    }
    setLoading(true);
    try {
      await login(email.trim(), password);
      // Route through the index gate so shop accounts land in
      // (shop-tabs) and shoppers in (tabs). Going straight to (tabs)
      // would force shops into the buyer experience.
      router.replace("/");
    } catch (e: any) {
      Alert.alert("Login failed", e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={[styles.container, { backgroundColor: Colors.background }]}>
      <ScrollView
        contentContainerStyle={[
          styles.scroll,
          { paddingTop: insets.top + 20, paddingBottom: insets.bottom + 40 },
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Pressable style={styles.back} onPress={() => router.back()}>
          <Feather name="arrow-left" size={22} color={Colors.text} />
        </Pressable>

        <Text style={styles.title}>Welcome{"\n"}back</Text>
        <Text style={styles.subtitle}>Sign in to your Reliq account</Text>

        <View style={styles.form}>
          <View style={styles.field}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="you@example.com"
              placeholderTextColor={Colors.textTertiary}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Password</Text>
            <View style={styles.passwordRow}>
              <TextInput
                style={[styles.input, { flex: 1, borderWidth: 0 }]}
                value={password}
                onChangeText={setPassword}
                placeholder="Your password"
                placeholderTextColor={Colors.textTertiary}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
              />
              <Pressable
                onPress={() => setShowPassword(!showPassword)}
                style={styles.eyeBtn}
              >
                <Feather
                  name={showPassword ? "eye-off" : "eye"}
                  size={18}
                  color={Colors.textSecondary}
                />
              </Pressable>
            </View>
          </View>

          <Pressable
            style={({ pressed }) => [
              styles.submitBtn,
              { opacity: loading || pressed ? 0.85 : 1 },
            ]}
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.submitText}>Sign In</Text>
            )}
          </Pressable>
        </View>

        <View style={styles.demoSection}>
          <View style={styles.demoRow}>
            <View style={styles.demoDivider} />
            <Text style={styles.demoLabel}>Demo accounts</Text>
            <View style={styles.demoDivider} />
          </View>
          <View style={styles.demoCards}>
            <Pressable
              style={({ pressed }) => [styles.demoCard, pressed && styles.demoCardPressed]}
              onPress={() => { setEmail("sophie@demo.reliq"); setPassword("reliq2024"); }}
            >
              <Text style={styles.demoCardTitle}>Sophie</Text>
              <Text style={styles.demoCardRole}>Shopper</Text>
              <Text style={styles.demoCardEmail}>sophie@demo.reliq</Text>
            </Pressable>
            <Pressable
              style={({ pressed }) => [styles.demoCard, pressed && styles.demoCardPressed]}
              onPress={() => { setEmail("vault@demo.reliq"); setPassword("reliq2024"); }}
            >
              <Text style={styles.demoCardTitle}>The Vault</Text>
              <Text style={styles.demoCardRole}>Shop Owner</Text>
              <Text style={styles.demoCardEmail}>vault@demo.reliq</Text>
            </Pressable>
          </View>
          <Text style={styles.demoHint}>Tap a card to fill in credentials, then sign in</Text>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Don't have an account?</Text>
          <Pressable onPress={() => router.replace("/(auth)/register")}>
            <Text style={styles.footerLink}> Sign up</Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: {
    paddingHorizontal: 28,
  },
  back: {
    width: 44,
    height: 44,
    justifyContent: "center",
    marginBottom: 32,
  },
  title: {
    fontFamily: "PlayfairDisplay_700Bold",
    fontSize: 42,
    color: Colors.text,
    lineHeight: 52,
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: "Inter_400Regular",
    fontSize: 15,
    color: Colors.textSecondary,
    marginBottom: 40,
  },
  form: { gap: 20 },
  field: { gap: 8 },
  label: {
    fontFamily: "Inter_500Medium",
    fontSize: 12,
    color: Colors.text,
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  input: {
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 6,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontFamily: "Inter_400Regular",
    fontSize: 15,
    color: Colors.text,
  },
  passwordRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 6,
    paddingRight: 12,
  },
  eyeBtn: {
    padding: 8,
  },
  submitBtn: {
    backgroundColor: Colors.text,
    paddingVertical: 16,
    borderRadius: 6,
    alignItems: "center",
    marginTop: 8,
  },
  submitText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 15,
    color: "#FFFFFF",
    letterSpacing: 0.5,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 28,
  },
  footerText: {
    fontFamily: "Inter_400Regular",
    fontSize: 14,
    color: Colors.textSecondary,
  },
  footerLink: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 14,
    color: Colors.text,
  },
  demoSection: { marginTop: 36, gap: 16 },
  demoRow: { flexDirection: "row", alignItems: "center", gap: 12 },
  demoDivider: { flex: 1, height: 1, backgroundColor: Colors.border },
  demoLabel: {
    fontFamily: "Inter_400Regular",
    fontSize: 11,
    color: Colors.textTertiary,
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  demoCards: { flexDirection: "row", gap: 12 },
  demoCard: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 10,
    padding: 14,
    gap: 3,
  },
  demoCardPressed: { opacity: 0.75 },
  demoCardTitle: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 14,
    color: Colors.text,
  },
  demoCardRole: {
    fontFamily: "Inter_400Regular",
    fontSize: 11,
    color: Colors.accent,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  demoCardEmail: {
    fontFamily: "Inter_400Regular",
    fontSize: 11,
    color: Colors.textTertiary,
    marginTop: 4,
  },
  demoHint: {
    fontFamily: "Inter_400Regular",
    fontSize: 12,
    color: Colors.textTertiary,
    textAlign: "center",
  },
});
