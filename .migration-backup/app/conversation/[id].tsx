import React, { useState, useRef, useMemo } from "react";
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
import { useAppContext, Message, ParticipantType } from "@/contexts/AppContext";
import { useAuth } from "@/contexts/AuthContext";
import {
  getShopById,
  getProductById,
  getUserById,
} from "@/constants/seed-data";

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

const SHOP_ACCOUNT_TYPES = ["shop"];

export default function ConversationScreen() {
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{
    id: string;
    recipientId?: string;
    recipientName?: string;
    recipientType?: ParticipantType;
    shopId?: string;
  }>();
  const { user } = useAuth();
  const { conversations, getConversationMessages, sendMessage } =
    useAppContext();
  const [text, setText] = useState("");
  const listRef = useRef<FlatList>(null);

  const conv = conversations.find((c) => c.id === params.id);
  const messages = getConversationMessages(params.id ?? "");

  const otherInfo = useMemo<{
    id: string;
    name: string;
    type: ParticipantType;
    shopId?: string;
  }>(() => {
    if (conv && user) {
      const otherId = conv.participantIds.find((pid) => pid !== user.id) ?? "";
      const idx = conv.participantIds.indexOf(otherId);
      const type =
        (conv.participantTypes && conv.participantTypes[idx]) ??
        (conv.shopId ? "shop" : "user");
      return {
        id: otherId,
        name: conv.participantNames[idx] ?? "Unknown",
        type,
        shopId: conv.shopId,
      };
    }
    return {
      id: params.recipientId ?? "",
      name: params.recipientName ?? "New message",
      type: (params.recipientType as ParticipantType) ?? "user",
      shopId: params.shopId,
    };
  }, [conv, user, params.recipientId, params.recipientName, params.recipientType, params.shopId]);

  const isShopAccount = user
    ? SHOP_ACCOUNT_TYPES.includes(user.accountType ?? "")
    : false;

  // Need a recipient to send. If we don't have a conv yet, we must have
  // recipient params from the new-message flow.
  const hasRecipient = !!otherInfo.id;

  // Shops cannot initiate. They can only reply to existing conversations.
  const canSend = hasRecipient && (!isShopAccount || !!conv);

  const topPad = Platform.OS === "web" ? 67 : insets.top;

  async function handleSend() {
    if (!text.trim() || !user || !canSend || !otherInfo.id) return;
    await sendMessage({
      toId: otherInfo.id,
      toName: otherInfo.name,
      toType: otherInfo.type,
      content: text.trim(),
      shopId: otherInfo.shopId,
    });
    setText("");
  }

  function handleAttachProduct() {
    if (!canSend || !otherInfo.id) return;
    router.push({
      pathname: "/share-product",
      params: {
        convId: params.id ?? "",
        recipientId: otherInfo.id,
        recipientName: otherInfo.name,
        recipientType: otherInfo.type,
      },
    });
  }

  // Header avatar/source
  const headerShop =
    otherInfo.type === "shop"
      ? getShopById(otherInfo.shopId ?? otherInfo.id)
      : undefined;
  const headerUser =
    otherInfo.type === "user" ? getUserById(otherInfo.id) : undefined;

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
          {headerShop ? (
            <Image
              source={{ uri: headerShop.storefrontImage }}
              style={styles.headerAvatar}
              contentFit="cover"
            />
          ) : headerUser ? (
            <Image
              source={{ uri: headerUser.avatarUrl }}
              style={styles.headerAvatar}
              contentFit="cover"
            />
          ) : (
            <View style={[styles.headerAvatar, styles.headerAvatarPlaceholder]}>
              <Text style={styles.headerAvatarText}>
                {otherInfo.name[0]?.toUpperCase() ?? "?"}
              </Text>
            </View>
          )}
          <View style={styles.headerText}>
            <Text style={styles.headerName}>{otherInfo.name}</Text>
            <Text style={styles.headerSub}>
              {otherInfo.type === "shop"
                ? headerShop?.city
                  ? `${headerShop.city} shop`
                  : "Shop"
                : headerUser?.bio ?? "Member"}
            </Text>
          </View>
        </View>
      </View>

      <FlatList
        ref={listRef}
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <MessageBubble message={item} ownId={user?.id ?? ""} />
        )}
        contentContainerStyle={[styles.msgList, { paddingBottom: 20 }]}
        showsVerticalScrollIndicator={false}
        onContentSizeChange={() =>
          listRef.current?.scrollToEnd({ animated: true })
        }
        ListEmptyComponent={
          <View style={styles.emptyChat}>
            <Text style={styles.emptyChatText}>
              {canSend
                ? `Say hi to ${otherInfo.name}`
                : "Shops can only reply to existing conversations."}
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
              paddingBottom: Platform.OS === "web" ? 24 : insets.bottom + 8,
              borderTopColor: Colors.border,
            },
          ]}
        >
          <Pressable
            style={[styles.attachBtn, !canSend && styles.attachBtnDisabled]}
            onPress={handleAttachProduct}
            disabled={!canSend}
            testID="attach-product"
          >
            <Feather
              name="image"
              size={18}
              color={canSend ? Colors.text : Colors.textTertiary}
            />
          </Pressable>
          <TextInput
            style={styles.input}
            value={text}
            onChangeText={setText}
            placeholder={canSend ? "Message..." : "Reply not available"}
            placeholderTextColor={Colors.textTertiary}
            multiline
            maxLength={500}
            returnKeyType="send"
            onSubmitEditing={handleSend}
            editable={canSend}
          />
          <Pressable
            style={[
              styles.sendBtn,
              (!text.trim() || !canSend) && styles.sendBtnDisabled,
            ]}
            onPress={handleSend}
            disabled={!text.trim() || !canSend}
            testID="send-btn"
          >
            <Feather
              name="arrow-up"
              size={18}
              color={text.trim() && canSend ? "#fff" : Colors.textTertiary}
            />
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

function MessageBubble({ message, ownId }: { message: Message; ownId: string }) {
  const isOwn = message.fromId === ownId;
  const product = message.productId
    ? getProductById(message.productId)
    : undefined;
  // For product recommendations, content holds the explicit user-typed note.
  // For non-recommendation product shares (legacy share-product flow that set
  // content = product.title), suppress the note bubble.
  const noteText =
    product && message.isProductRecommendation
      ? (message.content ?? "").trim()
      : product
        ? ""
        : message.content;

  return (
    <View
      style={[
        bubbleStyles.wrapper,
        isOwn ? bubbleStyles.wrapperOwn : bubbleStyles.wrapperOther,
      ]}
    >
      {product ? (
        <>
          <Pressable
            onPress={() => router.push(`/product/${product.id}`)}
            style={[
              bubbleStyles.productCard,
              isOwn ? bubbleStyles.productCardOwn : bubbleStyles.productCardOther,
            ]}
          >
            <Image
              source={{ uri: product.imageUrl }}
              style={bubbleStyles.productImage}
              contentFit="cover"
            />
            <View style={bubbleStyles.productInfo}>
              <View style={bubbleStyles.recTag}>
                <Feather name="gift" size={10} color={Colors.accent} />
                <Text style={bubbleStyles.recTagText}>Recommendation</Text>
              </View>
              <Text style={bubbleStyles.productTitle} numberOfLines={2}>
                {product.title}
              </Text>
              <Text style={bubbleStyles.productMeta} numberOfLines={1}>
                {product.size} · {product.era}
              </Text>
              <Text style={bubbleStyles.productMeta} numberOfLines={1}>
                {getShopById(product.shopId)?.name ?? "Shop"}
              </Text>
              <View style={bubbleStyles.productFooter}>
                <Text style={bubbleStyles.productPrice}>£{product.price}</Text>
                <View style={bubbleStyles.openLink}>
                  <Text style={bubbleStyles.openLinkText}>Open</Text>
                  <Feather
                    name="arrow-right"
                    size={11}
                    color={Colors.text}
                  />
                </View>
              </View>
            </View>
          </Pressable>
          {noteText.length > 0 && (
            <View
              style={[
                bubbleStyles.bubble,
                isOwn ? bubbleStyles.bubbleOwn : bubbleStyles.bubbleOther,
                bubbleStyles.noteBubble,
              ]}
            >
              <Text
                style={[
                  bubbleStyles.bubbleText,
                  isOwn
                    ? bubbleStyles.bubbleTextOwn
                    : bubbleStyles.bubbleTextOther,
                ]}
              >
                {noteText}
              </Text>
            </View>
          )}
        </>
      ) : (
        <View
          style={[
            bubbleStyles.bubble,
            isOwn ? bubbleStyles.bubbleOwn : bubbleStyles.bubbleOther,
          ]}
        >
          <Text
            style={[
              bubbleStyles.bubbleText,
              isOwn ? bubbleStyles.bubbleTextOwn : bubbleStyles.bubbleTextOther,
            ]}
          >
            {message.content}
          </Text>
        </View>
      )}
      <Text style={bubbleStyles.time}>{formatTime(message.timestamp)}</Text>
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
  msgList: { padding: 16, gap: 12 },
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
    gap: 8,
    paddingTop: 10,
    paddingHorizontal: 12,
    borderTopWidth: 1,
    backgroundColor: Colors.background,
  },
  attachBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 2,
  },
  attachBtnDisabled: { opacity: 0.5 },
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
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: Colors.text,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 2,
  },
  sendBtnDisabled: { backgroundColor: Colors.card },
});

const bubbleStyles = StyleSheet.create({
  wrapper: { maxWidth: "80%", gap: 4 },
  wrapperOwn: { alignSelf: "flex-end", alignItems: "flex-end" },
  wrapperOther: { alignSelf: "flex-start", alignItems: "flex-start" },
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
  productCard: {
    width: 240,
    borderRadius: 14,
    overflow: "hidden",
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  productCardOwn: {
    borderBottomRightRadius: 4,
  },
  productCardOther: {
    borderBottomLeftRadius: 4,
  },
  productImage: {
    width: "100%",
    height: 240,
    backgroundColor: Colors.card,
  },
  productInfo: {
    padding: 12,
    gap: 4,
  },
  recTag: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginBottom: 2,
  },
  recTagText: {
    fontFamily: "Inter_500Medium",
    fontSize: 10,
    color: Colors.accent,
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
  productTitle: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 14,
    color: Colors.text,
    lineHeight: 19,
  },
  productMeta: {
    fontFamily: "Inter_400Regular",
    fontSize: 12,
    color: Colors.textSecondary,
  },
  productPrice: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 14,
    color: Colors.text,
  },
  productFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 6,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  openLink: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  openLinkText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 11,
    color: Colors.text,
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
  noteBubble: { marginTop: 4 },
  time: {
    fontFamily: "Inter_400Regular",
    fontSize: 10,
    color: Colors.textTertiary,
  },
});
