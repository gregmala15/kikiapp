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
import { ProductCategory, ProductCondition } from "@/constants/seed-data";

const CATEGORIES: ProductCategory[] = [
  "Outerwear",
  "Tops",
  "Dresses",
  "Accessories",
  "Footwear",
  "Archive / Rare",
];

const CONDITIONS: ProductCondition[] = [
  "New with tags",
  "Excellent",
  "Very Good",
  "Good",
  "Fair",
];

const ERAS = [
  "Contemporary",
  "2010s",
  "2000s",
  "1990s",
  "1980s",
  "1970s",
  "1960s",
  "1950s",
  "Pre-1950s",
];

export default function AddProductScreen() {
  const insets = useSafeAreaInsets();
  const { addProduct, userShop } = useAppContext();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState<ProductCategory>("Tops");
  const [size, setSize] = useState("");
  const [condition, setCondition] = useState<ProductCondition>("Very Good");
  const [era, setEra] = useState("Contemporary");
  const [imageUrl, setImageUrl] = useState("");
  const [quantity, setQuantity] = useState("1");
  const [isVintage, setIsVintage] = useState(false);
  const [loading, setLoading] = useState(false);

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;

  async function handleSave() {
    if (!title.trim() || !description.trim() || !price.trim() || !size.trim()) {
      Alert.alert("Missing fields", "Please fill in title, description, price, and size.");
      return;
    }
    const priceNum = parseFloat(price);
    if (isNaN(priceNum) || priceNum <= 0) {
      Alert.alert("Invalid price", "Please enter a valid price.");
      return;
    }
    setLoading(true);
    try {
      await addProduct({
        shopId: userShop?.id ?? "",
        title: title.trim(),
        description: description.trim(),
        price: priceNum,
        category,
        size: size.trim(),
        condition,
        era,
        imageUrl: imageUrl.trim() ||
          "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
        quantity: parseInt(quantity) || 1,
        isVintage,
      });
      Alert.alert("Product added!", "Your piece is now on your rack.", [
        { text: "Add another", onPress: () => {
          setTitle(""); setDescription(""); setPrice(""); setSize(""); setImageUrl("");
        }},
        { text: "Done", onPress: () => router.back() },
      ]);
    } catch (e: any) {
      Alert.alert("Error", e.message);
    } finally {
      setLoading(false);
    }
  }

  function SelectGroup<T extends string>({
    options,
    selected,
    onSelect,
  }: {
    options: T[];
    selected: T;
    onSelect: (v: T) => void;
  }) {
    return (
      <View style={styles.chips}>
        {options.map((opt) => (
          <Pressable
            key={opt}
            style={[styles.chip, selected === opt && styles.chipActive]}
            onPress={() => onSelect(opt)}
          >
            <Text
              style={[
                styles.chipText,
                selected === opt && styles.chipTextActive,
              ]}
            >
              {opt}
            </Text>
          </Pressable>
        ))}
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: Colors.background }]}>
      <View
        style={[
          styles.header,
          { paddingTop: topPad + 12, borderBottomColor: Colors.border },
        ]}
      >
        <Text style={styles.title}>Add Product</Text>
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
        <View style={styles.field}>
          <Text style={styles.fieldLabel}>Product Title *</Text>
          <TextInput
            style={styles.input}
            value={title}
            onChangeText={setTitle}
            placeholder="e.g. 1970s Leather Trench Coat"
            placeholderTextColor={Colors.textTertiary}
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.fieldLabel}>Description *</Text>
          <TextInput
            style={[styles.input, styles.textarea]}
            value={description}
            onChangeText={setDescription}
            placeholder="Describe your piece: fabric, fit, provenance, any flaws..."
            placeholderTextColor={Colors.textTertiary}
            multiline
            numberOfLines={4}
          />
        </View>

        <View style={styles.row}>
          <View style={[styles.field, { flex: 1 }]}>
            <Text style={styles.fieldLabel}>Price (£) *</Text>
            <TextInput
              style={styles.input}
              value={price}
              onChangeText={setPrice}
              placeholder="0.00"
              placeholderTextColor={Colors.textTertiary}
              keyboardType="decimal-pad"
            />
          </View>
          <View style={[styles.field, { flex: 1 }]}>
            <Text style={styles.fieldLabel}>Size *</Text>
            <TextInput
              style={styles.input}
              value={size}
              onChangeText={setSize}
              placeholder="e.g. M, UK 10, EU 38"
              placeholderTextColor={Colors.textTertiary}
            />
          </View>
        </View>

        <View style={styles.row}>
          <View style={[styles.field, { flex: 1 }]}>
            <Text style={styles.fieldLabel}>Quantity</Text>
            <TextInput
              style={styles.input}
              value={quantity}
              onChangeText={setQuantity}
              placeholder="1"
              placeholderTextColor={Colors.textTertiary}
              keyboardType="number-pad"
            />
          </View>
          <View style={[styles.field, { flex: 2 }]}>
            <Text style={styles.fieldLabel}>Image URL</Text>
            <TextInput
              style={styles.input}
              value={imageUrl}
              onChangeText={setImageUrl}
              placeholder="https://..."
              placeholderTextColor={Colors.textTertiary}
              autoCapitalize="none"
            />
          </View>
        </View>

        <View style={styles.field}>
          <Text style={styles.fieldLabel}>Category</Text>
          <SelectGroup
            options={CATEGORIES}
            selected={category}
            onSelect={setCategory}
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.fieldLabel}>Condition</Text>
          <SelectGroup
            options={CONDITIONS}
            selected={condition}
            onSelect={setCondition}
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.fieldLabel}>Era</Text>
          <SelectGroup options={ERAS} selected={era} onSelect={setEra} />
        </View>

        <View style={styles.toggleRow}>
          <Text style={styles.toggleLabel}>Is this a vintage piece?</Text>
          <Pressable
            style={[styles.toggle, isVintage && styles.toggleActive]}
            onPress={() => setIsVintage(!isVintage)}
          >
            <View
              style={[
                styles.toggleThumb,
                isVintage && styles.toggleThumbActive,
              ]}
            />
          </Pressable>
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
            <Text style={styles.saveBtnText}>Add to Rack</Text>
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
  scroll: { paddingHorizontal: 20, paddingTop: 24, gap: 20 },
  field: { gap: 8 },
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
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 13,
    fontFamily: "Inter_400Regular",
    fontSize: 15,
    color: Colors.text,
  },
  textarea: { minHeight: 100, textAlignVertical: "top", paddingTop: 12 },
  row: { flexDirection: "row", gap: 12 },
  chips: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
  },
  chipActive: { backgroundColor: Colors.text, borderColor: Colors.text },
  chipText: {
    fontFamily: "Inter_400Regular",
    fontSize: 13,
    color: Colors.textSecondary,
  },
  chipTextActive: { color: "#fff" },
  toggleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 8,
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
