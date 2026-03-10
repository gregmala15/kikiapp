import React, { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  FlatList,
  TextInput,
  Platform,
  KeyboardAvoidingView,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { Image } from "expo-image";
import Colors from "@/constants/colors";
import { useAppContext, Message } from "@/contexts/AppContext";
import { useAuth } from "@/contexts/AuthContext";
import { getShopById, getProductById } from "@/constants/seed-data";

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function ConversationScreen() {
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user } = useAuth();
  const { conversations, getConversationMessages, sendMessage } = useAppContext();
  const [text, setText] = useState("");
  const listRef = useRef<FlatList>(null);

  const conv = conversations.find((c) => c.id === id);
  const messages = getConversationMessages(id ?? "");

  const otherName = conv
    ? (() => {
        const otherId = conv.participantIds.find((pid) => pid !== user?.id);
        const idx = conv.participantIds.indexOf(otherId ?? "");
        return conv.participantNames[idx] ?? "Unknown";
      })()
    : "Conversation";

  const topPad = Platform.OS === "web" ? 67 : insets.top;

  async function handleSend() {
    if (!text.trim() || !conv || !user) return;
    const otherId = conv.participantIds.find((pid) => pid !== user.id) ?? "";
    await sendMessage({
      toId: otherId,
      toName: otherName,
      content: text.trim(),
      shopId: conv.shopId,
    });
    setText("");
  }

  const shop = conv?.shopId ? getShopById(conv.shopId) : undefined;
  const product = conv?.productId ? getProductById(conv.productId) : undefined;

  return (
    <View style={[styles.container, { backgroundColor: Colors.background }]}>
      <View
        style={[
          styles.header,
          { paddingTop: topPad + 8, borderBottomColor: Colors.border },
        ]}
      >
        <Pressable style={styles.backBtn} onPress={() => router.back()}>
          <Feather name="arrow-left" size={22} color={Colors.text} />
        </Pressable>
        <View style={styles.headerInfo}>
          {shop ? (
            <Image
              source={{ uri: shop.storefrontImage }}
              style={styles.headerAvatar}
              contentFit="cover"
            />
          ) : (
            <View style={[styles.headerAvatar, styles.headerAvatarPlaceholder]}>
              <Text style={styles.headerAvatarText}>
                {otherName[0]?.toUpperCase() ?? "?"}
              </Text>
            </View>
          )}
          <View style={styles.headerText}>
            <Text style={styles.headerName}>{otherName}</Text>
            {shop && (
              <Text style={styles.headerSub}>{shop.city} shop</Text>
            )}
          </View>
        </View>
      </View>

      {product && (
        <Pressable
          style={styles.productBanner}
          onPress={() => router.push(`/product/${product.id}`)}
        >
          <Image
            source={{ uri: product.imageUrl }}
            style={styles.productBannerImage}
            contentFit="cover"
          />
          <View style={styles.productBannerInfo}>
            <Text style={styles.productBannerTitle} numberOfLines={1}>
              {product.title}
            </Text>
            <Text style={styles.productBannerPrice}>£{product.price}</Text>
          </View>
          <Feather name="external-link" size={14} color={Colors.textSecondary} />
        </Pressable>
      )}

      <FlatList
        ref={listRef}
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          const isOwn = item.fromId === user?.id;
          return (
            <View
              style={[
                styles.msgWrapper,
                isOwn ? styles.msgWrapperOwn : styles.msgWrapperOther,
              ]}
            >
              {item.isProductRecommendation && (
                <View style={styles.recLabel}>
                  <Feather name="gift" size={11} color={Colors.accent} />
                  <Text style={styles.recLabelText}>Product recommendation</Text>
                </View>
              )}
              <View
                style={[styles.bubble, isOwn ? styles.bubbleOwn : styles.bubbleOther]}
              >
                <Text
                  style={[
                    styles.bubbleText,
                    isOwn ? styles.bubbleTextOwn : styles.bubbleTextOther,
                  ]}
                >
                  {item.content}
                </Text>
              </View>
              <Text style={styles.msgTime}>{formatTime(item.timestamp)}</Text>
            </View>
          );
        }}
        contentContainerStyle={[styles.msgList, { paddingBottom: 20 }]}
        showsVerticalScrollIndicator={false}
        onContentSizeChange={() =>
          listRef.current?.scrollToEnd({ animated: true })
        }
        ListEmptyComponent={
          <View style={styles.emptyChat}>
            <Text style={styles.emptyChatText}>
              Start a conversation with {otherName}
            </Text>
          </View>
        }
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={0}
      >
        <View
          style={[
            styles.inputBar,
            {
              paddingBottom:
                Platform.OS === "web" ? 24 : insets.bottom + 8,
              borderTopColor: Colors.border,
            },
          ]}
        >
          <TextInput
            style={styles.input}
            value={text}
            onChangeText={setText}
            placeholder="Message..."
            placeholderTextColor={Colors.textTertiary}
            multiline
            maxLength={500}
            returnKeyType="send"
            onSubmitEditing={handleSend}
          />
          <Pressable
            style={[styles.sendBtn, !text.trim() && styles.sendBtnDisabled]}
            onPress={handleSend}
            disabled={!text.trim()}
          >
            <Feather name="send" size={18} color={text.trim() ? "#fff" : Colors.textTertiary} />
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingBottom: 12,
    borderBottomWidth: 1,
    gap: 4,
  },
  backBtn: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  headerInfo: { flex: 1, flexDirection: "row", alignItems: "center", gap: 12 },
  headerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.card,
  },
  headerAvatarPlaceholder: {
    backgroundColor: Colors.accentLight,
    alignItems: "center",
    justifyContent: "center",
  },
  headerAvatarText: {
    fontFamily: "PlayfairDisplay_700Bold",
    fontSize: 16,
    color: Colors.accent,
  },
  headerText: { gap: 1 },
  headerName: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 15,
    color: Colors.text,
  },
  headerSub: {
    fontFamily: "Inter_400Regular",
    fontSize: 12,
    color: Colors.textSecondary,
  },
  productBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    backgroundColor: Colors.accentLight,
  },
  productBannerImage: {
    width: 40,
    height: 40,
    borderRadius: 6,
    backgroundColor: Colors.card,
  },
  productBannerInfo: { flex: 1 },
  productBannerTitle: {
    fontFamily: "Inter_500Medium",
    fontSize: 13,
    color: Colors.text,
  },
  productBannerPrice: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 12,
    color: Colors.accent,
  },
  msgList: { padding: 16, gap: 12 },
  msgWrapper: { maxWidth: "80%", gap: 4 },
  msgWrapperOwn: { alignSelf: "flex-end", alignItems: "flex-end" },
  msgWrapperOther: { alignSelf: "flex-start", alignItems: "flex-start" },
  recLabel: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginBottom: 2,
  },
  recLabelText: {
    fontFamily: "Inter_400Regular",
    fontSize: 10,
    color: Colors.accent,
  },
  bubble: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 16,
    maxWidth: "100%",
  },
  bubbleOwn: {
    backgroundColor: Colors.text,
    borderBottomRightRadius: 4,
  },
  bubbleOther: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderBottomLeftRadius: 4,
  },
  bubbleText: {
    fontFamily: "Inter_400Regular",
    fontSize: 15,
    lineHeight: 21,
  },
  bubbleTextOwn: { color: "#fff" },
  bubbleTextOther: { color: Colors.text },
  msgTime: {
    fontFamily: "Inter_400Regular",
    fontSize: 10,
    color: Colors.textTertiary,
  },
  emptyChat: {
    alignItems: "center",
    paddingTop: 80,
    paddingHorizontal: 40,
  },
  emptyChatText: {
    fontFamily: "Inter_400Regular",
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: "center",
  },
  inputBar: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 10,
    paddingTop: 10,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    backgroundColor: Colors.background,
  },
  input: {
    flex: 1,
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 22,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontFamily: "Inter_400Regular",
    fontSize: 15,
    color: Colors.text,
    maxHeight: 100,
  },
  sendBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: Colors.text,
    alignItems: "center",
    justifyContent: "center",
  },
  sendBtnDisabled: { backgroundColor: Colors.card },
});
