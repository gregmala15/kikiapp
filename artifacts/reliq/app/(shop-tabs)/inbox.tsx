import React, { useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Platform,
} from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import Colors from "@/constants/colors";
import { useAppContext } from "@/contexts/AppContext";
import { useAuth } from "@/contexts/AuthContext";

export default function ShopInboxScreen() {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const { conversations } = useAppContext();
  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 120 : insets.bottom + 100;

  const myConvs = useMemo(() => {
    if (!user) return [];
    return conversations
      .filter((c) => c.participantIds.includes(user.id))
      .sort((a, b) =>
        (b.lastTimestamp ?? "").localeCompare(a.lastTimestamp ?? ""),
      );
  }, [conversations, user?.id]);

  return (
    <View style={{ flex: 1, backgroundColor: Colors.background }}>
      <View style={[styles.header, { paddingTop: topPad + 12 }]}>
        <Text style={styles.title}>Inbox</Text>
        <Text style={styles.subtitle}>
          {myConvs.length} conversation{myConvs.length === 1 ? "" : "s"}
        </Text>
      </View>
      <ScrollView contentContainerStyle={{ paddingBottom: bottomPad }}>
        {myConvs.length === 0 ? (
          <View style={styles.empty}>
            <Ionicons name="mail-outline" size={48} color={Colors.textTertiary} />
            <Text style={styles.emptyTitle}>No messages yet</Text>
            <Text style={styles.emptyDesc}>
              When buyers reach out about your pieces, you'll see them here.
            </Text>
          </View>
        ) : (
          myConvs.map((c) => {
            const otherIdx = c.participantIds.findIndex((id) => id !== user?.id);
            const otherName =
              (otherIdx >= 0 ? c.participantNames[otherIdx] : null) ?? "Buyer";
            return (
              <Pressable
                key={c.id}
                style={styles.row}
                onPress={() => router.push({ pathname: "/conversation/[id]", params: { id: c.id } })}
              >
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>
                    {otherName.slice(0, 1).toUpperCase()}
                  </Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.rowName}>{otherName}</Text>
                  <Text style={styles.rowLast} numberOfLines={1}>
                    {c.lastMessage ?? "Start the conversation"}
                  </Text>
                </View>
                {c.lastTimestamp && (
                  <Text style={styles.rowTime}>
                    {new Date(c.lastTimestamp).toLocaleDateString(undefined, {
                      day: "numeric",
                      month: "short",
                    })}
                  </Text>
                )}
              </Pressable>
            );
          })
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 20,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  title: {
    fontFamily: "PlayfairDisplay_700Bold",
    fontSize: 28,
    color: Colors.text,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontFamily: "Inter_400Regular",
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.accent,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    fontFamily: "Inter_700Bold",
    fontSize: 16,
    color: "#fff",
  },
  rowName: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 14,
    color: Colors.text,
  },
  rowLast: {
    fontFamily: "Inter_400Regular",
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  rowTime: {
    fontFamily: "Inter_400Regular",
    fontSize: 11,
    color: Colors.textTertiary,
  },
  empty: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 80,
    paddingHorizontal: 32,
    gap: 12,
  },
  emptyTitle: {
    fontFamily: "PlayfairDisplay_700Bold",
    fontSize: 22,
    color: Colors.text,
  },
  emptyDesc: {
    fontFamily: "Inter_400Regular",
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: "center",
    lineHeight: 21,
    maxWidth: 320,
  },
});
