import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  Platform,
} from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons, Feather } from "@expo/vector-icons";
import Colors from "@/constants/colors";
import { useAppContext, Conversation } from "@/contexts/AppContext";
import { useAuth } from "@/contexts/AuthContext";
import { getShopById, getProductById } from "@/constants/seed-data";

function formatTime(iso: string) {
  const d = new Date(iso);
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  if (diff < 60000) return "just now";
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}h`;
  return d.toLocaleDateString();
}

export default function MessagesScreen() {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const { conversations } = useAppContext();

  const topPad = Platform.OS === "web" ? 67 : insets.top;

  function getConvName(conv: Conversation): string {
    if (!user) return "Unknown";
    const otherId = conv.participantIds.find((id) => id !== user.id);
    const otherIndex = conv.participantIds.indexOf(otherId ?? "");
    return conv.participantNames[otherIndex] ?? "Unknown";
  }

  function getConvSubtitle(conv: Conversation): string {
    if (conv.shopId) {
      const shop = getShopById(conv.shopId);
      return shop ? `Re: ${shop.name}` : "Shop enquiry";
    }
    if (conv.productId) {
      const product = getProductById(conv.productId);
      return product ? `Re: ${product.title}` : "Product recommendation";
    }
    return conv.lastMessage ?? "";
  }

  return (
    <View style={[styles.container, { backgroundColor: Colors.background }]}>
      <View
        style={[
          styles.header,
          { paddingTop: topPad + 12, borderBottomColor: Colors.border },
        ]}
      >
        <Text style={styles.title}>Messages</Text>
      </View>

      <FlatList
        data={conversations}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Pressable
            style={styles.convRow}
            onPress={() => router.push(`/conversation/${item.id}`)}
          >
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {getConvName(item)[0]?.toUpperCase() ?? "?"}
              </Text>
            </View>
            <View style={styles.convInfo}>
              <View style={styles.convTop}>
                <Text style={styles.convName}>{getConvName(item)}</Text>
                {item.lastTimestamp && (
                  <Text style={styles.convTime}>
                    {formatTime(item.lastTimestamp)}
                  </Text>
                )}
              </View>
              <Text style={styles.convPreview} numberOfLines={1}>
                {getConvSubtitle(item)}
              </Text>
            </View>
            <Feather name="chevron-right" size={16} color={Colors.textTertiary} />
          </Pressable>
        )}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons
              name="chatbubble-outline"
              size={52}
              color={Colors.textTertiary}
            />
            <Text style={styles.emptyTitle}>No messages yet</Text>
            <Text style={styles.emptyDesc}>
              Message a shop about a product or recommend pieces to friends
            </Text>
          </View>
        }
        contentContainerStyle={[
          { flexGrow: 1 },
          { paddingBottom: Platform.OS === "web" ? 84 : insets.bottom + 100 },
        ]}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 14,
    borderBottomWidth: 1,
    backgroundColor: Colors.background,
  },
  title: {
    fontFamily: "PlayfairDisplay_700Bold",
    fontSize: 28,
    color: Colors.text,
  },
  convRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 14,
    gap: 14,
    backgroundColor: Colors.surface,
  },
  avatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: Colors.accentLight,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  avatarText: {
    fontFamily: "PlayfairDisplay_700Bold",
    fontSize: 18,
    color: Colors.accent,
  },
  convInfo: { flex: 1, gap: 3 },
  convTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  convName: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 15,
    color: Colors.text,
  },
  convTime: {
    fontFamily: "Inter_400Regular",
    fontSize: 11,
    color: Colors.textTertiary,
  },
  convPreview: {
    fontFamily: "Inter_400Regular",
    fontSize: 13,
    color: Colors.textSecondary,
  },
  separator: {
    height: 1,
    backgroundColor: Colors.border,
    marginLeft: 80,
  },
  empty: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 40,
    gap: 12,
    paddingTop: 100,
  },
  emptyTitle: {
    fontFamily: "PlayfairDisplay_700Bold",
    fontSize: 22,
    color: Colors.text,
    textAlign: "center",
  },
  emptyDesc: {
    fontFamily: "Inter_400Regular",
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: "center",
    lineHeight: 20,
  },
});
