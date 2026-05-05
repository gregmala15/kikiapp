import { View, Text, StyleSheet, Pressable } from "react-native";
import { router } from "expo-router";
import Colors from "@/constants/colors";
import { Feather } from "@expo/vector-icons";

export default function NotFoundScreen() {
  return (
    <View style={styles.container}>
      <Feather name="compass" size={52} color={Colors.textTertiary} />
      <Text style={styles.title}>Page not found</Text>
      <Text style={styles.subtitle}>
        This page doesn't exist or has been moved.
      </Text>
      <Pressable
        style={styles.btn}
        onPress={() => router.replace("/(tabs)")}
      >
        <Text style={styles.btnText}>Go to Feed</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    alignItems: "center",
    justifyContent: "center",
    padding: 40,
    gap: 12,
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    color: Colors.text,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 15,
    color: Colors.textSecondary,
    textAlign: "center",
    lineHeight: 22,
  },
  btn: {
    marginTop: 8,
    backgroundColor: Colors.text,
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderRadius: 6,
  },
  btnText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#fff",
  },
});
