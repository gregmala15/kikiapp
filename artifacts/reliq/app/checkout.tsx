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

export default function CheckoutScreen() {
  const insets = useSafeAreaInsets();
  const { cart, cartTotal, placeOrder } = useAppContext();
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [line1, setLine1] = useState("");
  const [line2, setLine2] = useState("");
  const [city, setCity] = useState("");
  const [postcode, setPostcode] = useState("");

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;

  async function handlePlaceOrder() {
    if (!name.trim() || !line1.trim() || !city.trim() || !postcode.trim()) {
      Alert.alert("Missing address", "Please complete your delivery address.");
      return;
    }
    setLoading(true);
    try {
      const address = `${name}, ${line1}${line2 ? ", " + line2 : ""}, ${city}, ${postcode}`;
      const order = await placeOrder(address);
      router.replace({
        pathname: "/order-confirmation",
        params: { orderId: order.id },
      });
    } catch (e: any) {
      Alert.alert("Order failed", e.message);
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
        <Text style={styles.title}>Checkout</Text>
        <Pressable onPress={() => router.back()} style={styles.closeBtn}>
          <Feather name="x" size={22} color={Colors.text} />
        </Pressable>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 24, paddingBottom: 120 }}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.sectionLabel}>Order Summary</Text>
        <View style={styles.summary}>
          {cart.map((item) => (
            <View key={item.product.id} style={styles.summaryRow}>
              <Text style={styles.summaryItem} numberOfLines={1}>
                {item.product.title}
              </Text>
              <Text style={styles.summaryQty}>×{item.quantity}</Text>
              <Text style={styles.summaryPrice}>
                £{(item.product.price * item.quantity).toFixed(2)}
              </Text>
            </View>
          ))}
          <View style={styles.divider} />
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.total}>£{cartTotal.toFixed(2)}</Text>
          </View>
        </View>

        <Text style={[styles.sectionLabel, { marginTop: 28 }]}>
          Delivery Address
        </Text>
        <View style={styles.form}>
          <View style={styles.field}>
            <Text style={styles.fieldLabel}>Full Name</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="Jane Smith"
              placeholderTextColor={Colors.textTertiary}
            />
          </View>
          <View style={styles.field}>
            <Text style={styles.fieldLabel}>Address Line 1</Text>
            <TextInput
              style={styles.input}
              value={line1}
              onChangeText={setLine1}
              placeholder="123 Fashion Street"
              placeholderTextColor={Colors.textTertiary}
            />
          </View>
          <View style={styles.field}>
            <Text style={styles.fieldLabel}>Address Line 2 (optional)</Text>
            <TextInput
              style={styles.input}
              value={line2}
              onChangeText={setLine2}
              placeholder="Flat 2B"
              placeholderTextColor={Colors.textTertiary}
            />
          </View>
          <View style={styles.row}>
            <View style={[styles.field, { flex: 1.6 }]}>
              <Text style={styles.fieldLabel}>City</Text>
              <TextInput
                style={styles.input}
                value={city}
                onChangeText={setCity}
                placeholder="London"
                placeholderTextColor={Colors.textTertiary}
              />
            </View>
            <View style={[styles.field, { flex: 1 }]}>
              <Text style={styles.fieldLabel}>Postcode</Text>
              <TextInput
                style={styles.input}
                value={postcode}
                onChangeText={setPostcode}
                placeholder="W1A 1AA"
                placeholderTextColor={Colors.textTertiary}
                autoCapitalize="characters"
              />
            </View>
          </View>
        </View>

        <View style={styles.mockNote}>
          <Feather name="info" size={14} color={Colors.accent} />
          <Text style={styles.mockText}>
            This is a prototype. No real payment is processed.
          </Text>
        </View>

        <Text style={[styles.sectionLabel, { marginTop: 28 }]}>
          Payment
        </Text>
        <View style={styles.paymentCard}>
          <Feather name="credit-card" size={20} color={Colors.textSecondary} />
          <Text style={styles.paymentText}>Simulated payment — no charge</Text>
          <View style={styles.paymentBadge}>
            <Text style={styles.paymentBadgeText}>DEMO</Text>
          </View>
        </View>
      </ScrollView>

      <View
        style={[
          styles.footer,
          { paddingBottom: bottomPad + 12, borderTopColor: Colors.border },
        ]}
      >
        <View style={styles.footerTotal}>
          <Text style={styles.footerTotalLabel}>Total due</Text>
          <Text style={styles.footerTotal2}>£{cartTotal.toFixed(2)}</Text>
        </View>
        <Pressable
          style={({ pressed }) => [
            styles.placeOrderBtn,
            { opacity: loading || pressed ? 0.85 : 1 },
          ]}
          onPress={handlePlaceOrder}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.placeOrderText}>Place Order</Text>
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
    fontSize: 26,
    color: Colors.text,
  },
  closeBtn: { padding: 8 },
  sectionLabel: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 12,
    color: Colors.text,
    letterSpacing: 1,
    textTransform: "uppercase",
    marginBottom: 12,
  },
  summary: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 16,
    gap: 8,
  },
  summaryRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  summaryItem: {
    flex: 1,
    fontFamily: "Inter_400Regular",
    fontSize: 13,
    color: Colors.text,
  },
  summaryQty: {
    fontFamily: "Inter_400Regular",
    fontSize: 13,
    color: Colors.textSecondary,
  },
  summaryPrice: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 13,
    color: Colors.text,
  },
  divider: { height: 1, backgroundColor: Colors.border, marginVertical: 4 },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  totalLabel: {
    fontFamily: "Inter_500Medium",
    fontSize: 15,
    color: Colors.textSecondary,
  },
  total: {
    fontFamily: "PlayfairDisplay_700Bold",
    fontSize: 22,
    color: Colors.text,
  },
  form: { gap: 16 },
  field: { gap: 6 },
  fieldLabel: {
    fontFamily: "Inter_500Medium",
    fontSize: 11,
    color: Colors.text,
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
  input: {
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 6,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontFamily: "Inter_400Regular",
    fontSize: 15,
    color: Colors.text,
  },
  row: { flexDirection: "row", gap: 12 },
  mockNote: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: Colors.accentLight,
    padding: 12,
    borderRadius: 8,
    marginTop: 20,
  },
  mockText: {
    fontFamily: "Inter_400Regular",
    fontSize: 12,
    color: Colors.accentDark,
    flex: 1,
  },
  paymentCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: Colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 16,
  },
  paymentText: {
    flex: 1,
    fontFamily: "Inter_400Regular",
    fontSize: 14,
    color: Colors.textSecondary,
  },
  paymentBadge: {
    backgroundColor: Colors.card,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  paymentBadgeText: {
    fontFamily: "Inter_700Bold",
    fontSize: 10,
    color: Colors.textSecondary,
    letterSpacing: 1,
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingTop: 16,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    backgroundColor: Colors.background,
    gap: 12,
  },
  footerTotal: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  footerTotalLabel: {
    fontFamily: "Inter_400Regular",
    fontSize: 14,
    color: Colors.textSecondary,
  },
  footerTotal2: {
    fontFamily: "PlayfairDisplay_700Bold",
    fontSize: 22,
    color: Colors.text,
  },
  placeOrderBtn: {
    backgroundColor: Colors.text,
    paddingVertical: 16,
    borderRadius: 6,
    alignItems: "center",
  },
  placeOrderText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 15,
    color: "#fff",
  },
});
