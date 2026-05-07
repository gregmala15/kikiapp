import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  FlatList,
  TextInput,
  Platform,
} from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather, Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import Colors from "@/constants/colors";
import {
  SEED_USERS,
  CommunityUser,
  getUserById,
  getFollowersForUser,
} from "@/constants/seed-data";
import {
  useAppContext,
  Conversation,
  ParticipantType,
} from "@/contexts/AppContext";
import { useAuth } from "@/contexts/AuthContext";
import { getShopById, getProductById } from "@/constants/seed-data";

// -----------------------------------------------------------------------------
// SOCIAL — unified taste-network screen
// -----------------------------------------------------------------------------
// Replaces the old "Messages" tab. Three top-level sections:
//
//   1) Following — users the current user follows.
//   2) Followers — users following the current user (deterministic mock).
//   3) Inbox     — messaging, split into "People" and "Shops" sub-tabs so
//                  product chats with a brand and casual recs with friends
//                  don't drown each other out.
//
// A persistent "Search users" input lives at the top: when typed into, the
// page swaps to a global user search. This is the only social search and it
// is deliberately scoped to USERS — products, shops, categories, era, size
// and condition belong to the global product search elsewhere in the app.
//
// Messaging policy (enforced in AppContext.sendMessage):
//   - users may message users
//   - users may message shops
//   - shops may only REPLY, never initiate
//   - no group chats — each conversation has exactly two participants
// -----------------------------------------------------------------------------

type SocialTab = "discover" | "following" | "followers" | "inbox";
type InboxTab = "people" | "shops";

function formatTime(iso: string): string {
  const d = new Date(iso);
  const diff = Date.now() - d.getTime();
  if (diff < 60_000) return "just now";
  if (diff < 3_600_000) return `${Math.floor(diff / 60_000)}m`;
  if (diff < 86_400_000) return `${Math.floor(diff / 3_600_000)}h`;
  return d.toLocaleDateString();
}

const SHOP_ACCOUNT_TYPES: ReadonlyArray<string> = ["shop"];

export default function SocialScreen() {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const { conversations, followedUserIds, toggleFollowUser, isFollowingUser } =
    useAppContext();
  const [tab, setTab] = useState<SocialTab>("inbox");
  const [inboxTab, setInboxTab] = useState<InboxTab>("people");
  const [search, setSearch] = useState<string>("");

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad =
    Platform.OS === "web" ? 84 + 20 : insets.bottom + 100;

  const isShopAccount = user
    ? SHOP_ACCOUNT_TYPES.includes(user.accountType ?? "")
    : false;

  // ---------------------------------------------------------------------------
  // Following / Followers data
  // ---------------------------------------------------------------------------
  // "Following" comes from real persisted state in AppContext. "Followers" is
  // a deterministic seed-derived list — the demo doesn't have a bidirectional
  // social graph, so we generate a stable subset per user id (see
  // getFollowersForUser in seed-data.ts).
  const followingUsers = useMemo<CommunityUser[]>(() => {
    return followedUserIds
      .map((id) => getUserById(id))
      .filter((u): u is CommunityUser => !!u);
  }, [followedUserIds]);

  const followerUsers = useMemo<CommunityUser[]>(() => {
    if (!user) return [];
    return getFollowersForUser(user.id);
  }, [user?.id]);

  // ---------------------------------------------------------------------------
  // Discover — everyone the current user isn't already following.
  // ---------------------------------------------------------------------------
  // Excludes self and already-followed users so the list is purely "new
  // people to find". Once the user taps Follow, the row stays in place
  // (button flips to Following) instead of vanishing — disappearing rows
  // make a follow-spree feel jarring. The list re-evaluates on next mount
  // so it stays manageable across sessions.
  const discoverUsers = useMemo<CommunityUser[]>(() => {
    return SEED_USERS.filter(
      (u) => u.id !== user?.id && !followedUserIds.includes(u.id),
    );
  }, [user?.id]);

  // ---------------------------------------------------------------------------
  // Inbox — split conversations into People (user↔user) vs Shops (involves shop)
  // ---------------------------------------------------------------------------
  // A conversation is classified by participant types, not by who started it.
  // If any participant is a shop, the conversation belongs in the Shops tab;
  // otherwise it lives in People.
  const visibleConvs = useMemo<Conversation[]>(
    () => conversations.filter((c) => !!c.lastMessage),
    [conversations],
  );

  // Defensive classifier — older persisted conversations may not have a
  // populated participantTypes array, so we fall back to the presence of a
  // shopId (which is only set on shop chats) before assuming "people".
  function isShopConversation(c: Conversation): boolean {
    if (Array.isArray(c.participantTypes) && c.participantTypes.length > 0) {
      return c.participantTypes.includes("shop" as ParticipantType);
    }
    return !!c.shopId;
  }

  const peopleConvs = useMemo<Conversation[]>(
    () => visibleConvs.filter((c) => !isShopConversation(c)),
    [visibleConvs],
  );

  const shopConvs = useMemo<Conversation[]>(
    () => visibleConvs.filter((c) => isShopConversation(c)),
    [visibleConvs],
  );

  // ---------------------------------------------------------------------------
  // Search — users only
  // ---------------------------------------------------------------------------
  // Matches across fullName / username / city / bio so the user can find
  // someone by taste hints ("vintage", "Rome") not just exact names.
  const trimmedSearch = search.trim().toLowerCase();
  const searching = trimmedSearch.length > 0;
  const userSearchResults = useMemo<CommunityUser[]>(() => {
    if (!searching) return [];
    return SEED_USERS.filter(
      (u) =>
        u.id !== user?.id &&
        (u.fullName.toLowerCase().includes(trimmedSearch) ||
          u.username.toLowerCase().includes(trimmedSearch) ||
          u.city.toLowerCase().includes(trimmedSearch) ||
          u.bio.toLowerCase().includes(trimmedSearch)),
    );
  }, [searching, trimmedSearch, user?.id]);

  function getConvName(conv: Conversation): string {
    if (!user) return "Unknown";
    const otherIdx = conv.participantIds.findIndex((id) => id !== user.id);
    if (otherIdx === -1) return conv.participantNames[0] ?? "Unknown";
    return conv.participantNames[otherIdx] ?? "Unknown";
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

  function renderUserRow(u: CommunityUser) {
    return (
      <Pressable
        style={styles.userRow}
        onPress={() => router.push(`/user/${u.id}`)}
        testID={`social-user-${u.id}`}
      >
        <Image source={{ uri: u.avatarUrl }} style={styles.userAvatar} />
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{u.fullName}</Text>
          <Text style={styles.userSub}>@{u.username} · {u.city}</Text>
        </View>
        <Feather name="chevron-right" size={16} color={Colors.textTertiary} />
      </Pressable>
    );
  }

  // User row with a Follow / Following toggle button on the right
  // instead of a chevron. Used by both Discover (where rows start as
  // "Follow") and Following (where every row starts as "Following" and
  // tapping unfollows). Tapping the row body navigates to the profile;
  // the button stops propagation so following doesn't double-fire.
  function renderFollowableRow(u: CommunityUser, testIdPrefix: string) {
    const following = isFollowingUser(u.id);
    return (
      <Pressable
        style={styles.userRow}
        onPress={() => router.push(`/user/${u.id}`)}
        testID={`${testIdPrefix}-user-${u.id}`}
      >
        <Image source={{ uri: u.avatarUrl }} style={styles.userAvatar} />
        <View style={styles.userInfo}>
          <Text style={styles.userName} numberOfLines={1}>
            {u.fullName}
          </Text>
          <Text style={styles.userSub} numberOfLines={1}>
            @{u.username} · {u.city}
          </Text>
          {!!u.bio && (
            <Text style={styles.userBio} numberOfLines={1}>
              {u.bio}
            </Text>
          )}
        </View>
        <Pressable
          style={[
            styles.followBtn,
            following && styles.followBtnActive,
          ]}
          onPress={(e) => {
            e.stopPropagation();
            toggleFollowUser(u.id);
          }}
          testID={`${testIdPrefix}-follow-${u.id}`}
          accessibilityRole="button"
          accessibilityLabel={following ? "Unfollow" : "Follow"}
        >
          <Text
            style={[
              styles.followBtnText,
              following && styles.followBtnTextActive,
            ]}
          >
            {following ? "Following" : "Follow"}
          </Text>
        </Pressable>
      </Pressable>
    );
  }

  function renderConvRow(conv: Conversation) {
    const name = getConvName(conv);
    return (
      <Pressable
        style={styles.convRow}
        onPress={() => router.push(`/conversation/${conv.id}`)}
        testID={`social-conv-${conv.id}`}
      >
        <View style={styles.convAvatar}>
          <Text style={styles.convAvatarText}>
            {name[0]?.toUpperCase() ?? "?"}
          </Text>
        </View>
        <View style={styles.convInfo}>
          <View style={styles.convTop}>
            <Text style={styles.convName} numberOfLines={1}>
              {name}
            </Text>
            {conv.lastTimestamp && (
              <Text style={styles.convTime}>
                {formatTime(conv.lastTimestamp)}
              </Text>
            )}
          </View>
          <Text style={styles.convPreview} numberOfLines={1}>
            {getConvSubtitle(conv)}
          </Text>
        </View>
        <Feather name="chevron-right" size={16} color={Colors.textTertiary} />
      </Pressable>
    );
  }

  // ---------------------------------------------------------------------------
  // Body — what to render in the content area
  // ---------------------------------------------------------------------------
  // 1) If the user is searching, the entire body becomes user-search results.
  // 2) Otherwise show the active tab's content.
  function renderBody() {
    if (searching) {
      return (
        <FlatList
          data={userSearchResults}
          keyExtractor={(u) => u.id}
          renderItem={({ item }) => renderUserRow(item)}
          ItemSeparatorComponent={() => <View style={styles.sep} />}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Text style={styles.emptyTitle}>No people found</Text>
              <Text style={styles.emptyDesc}>
                Try a different name, city, or vibe
              </Text>
            </View>
          }
          contentContainerStyle={{ paddingBottom: bottomPad }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        />
      );
    }

    if (tab === "discover") {
      return (
        <FlatList
          data={discoverUsers}
          keyExtractor={(u) => u.id}
          renderItem={({ item }) => renderFollowableRow(item, "discover")}
          ItemSeparatorComponent={() => <View style={styles.sep} />}
          ListHeaderComponent={
            <View style={styles.discoverHeader}>
              <Text style={styles.discoverHeaderTitle}>People to follow</Text>
              <Text style={styles.discoverHeaderDesc}>
                Find taste you trust. Follow to shape your feed.
              </Text>
            </View>
          }
          ListEmptyComponent={
            <View style={styles.empty}>
              <Ionicons
                name="sparkles-outline"
                size={42}
                color={Colors.textTertiary}
              />
              <Text style={styles.emptyTitle}>You're following everyone</Text>
              <Text style={styles.emptyDesc}>
                Nice taste. New people will show up here as the community grows.
              </Text>
            </View>
          }
          contentContainerStyle={{ paddingBottom: bottomPad, flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
        />
      );
    }

    if (tab === "following") {
      return (
        <FlatList
          data={followingUsers}
          keyExtractor={(u) => u.id}
          renderItem={({ item }) => renderFollowableRow(item, "following")}
          ItemSeparatorComponent={() => <View style={styles.sep} />}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Ionicons
                name="people-outline"
                size={42}
                color={Colors.textTertiary}
              />
              <Text style={styles.emptyTitle}>Not following anyone yet</Text>
              <Text style={styles.emptyDesc}>
                Follow people whose taste you trust to shape your feed
              </Text>
            </View>
          }
          contentContainerStyle={{ paddingBottom: bottomPad, flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
        />
      );
    }

    if (tab === "followers") {
      return (
        <FlatList
          data={followerUsers}
          keyExtractor={(u) => u.id}
          renderItem={({ item }) => renderUserRow(item)}
          ItemSeparatorComponent={() => <View style={styles.sep} />}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Ionicons
                name="people-outline"
                size={42}
                color={Colors.textTertiary}
              />
              <Text style={styles.emptyTitle}>No followers yet</Text>
              <Text style={styles.emptyDesc}>
                Share recommendations and pieces — taste finds taste
              </Text>
            </View>
          }
          contentContainerStyle={{ paddingBottom: bottomPad, flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
        />
      );
    }

    // INBOX — sub-tabs People / Shops
    const data = inboxTab === "people" ? peopleConvs : shopConvs;
    return (
      <View style={{ flex: 1 }}>
        <View style={styles.subPills} testID="inbox-subtabs">
          <Pressable
            style={[
              styles.subPill,
              inboxTab === "people" && styles.subPillActive,
            ]}
            onPress={() => setInboxTab("people")}
            testID="inbox-tab-people"
          >
            <Text
              style={[
                styles.subPillText,
                inboxTab === "people" && styles.subPillTextActive,
              ]}
            >
              People
            </Text>
          </Pressable>
          <Pressable
            style={[
              styles.subPill,
              inboxTab === "shops" && styles.subPillActive,
            ]}
            onPress={() => setInboxTab("shops")}
            testID="inbox-tab-shops"
          >
            <Text
              style={[
                styles.subPillText,
                inboxTab === "shops" && styles.subPillTextActive,
              ]}
            >
              Shops
            </Text>
          </Pressable>
        </View>

        <FlatList
          data={data}
          keyExtractor={(c) => c.id}
          renderItem={({ item }) => renderConvRow(item)}
          ItemSeparatorComponent={() => <View style={styles.sepIndent} />}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Ionicons
                name="chatbubble-outline"
                size={42}
                color={Colors.textTertiary}
              />
              <Text style={styles.emptyTitle}>
                {inboxTab === "people"
                  ? "No conversations yet"
                  : "No shop chats yet"}
              </Text>
              <Text style={styles.emptyDesc}>
                {inboxTab === "people"
                  ? "Recommend a piece to a friend or message someone whose taste you love"
                  : "Ask a shop about a product to start a conversation"}
              </Text>
            </View>
          }
          contentContainerStyle={{ paddingBottom: bottomPad, flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.header,
          { paddingTop: topPad + 12 },
        ]}
      >
        <Text style={styles.title}>Social</Text>
        {!isShopAccount && (
          <Pressable
            style={styles.composeBtn}
            onPress={() => router.push("/new-message")}
            testID="compose-message"
            accessibilityRole="button"
            accessibilityLabel="Start a new conversation"
          >
            <Feather name="edit-3" size={18} color={Colors.text} />
          </Pressable>
        )}
      </View>

      <View style={styles.searchWrap}>
        <Feather name="search" size={16} color={Colors.textTertiary} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search users"
          placeholderTextColor={Colors.textTertiary}
          value={search}
          onChangeText={setSearch}
          autoCapitalize="none"
          autoCorrect={false}
          testID="social-search-input"
          returnKeyType="search"
        />
        {searching && (
          <Pressable
            onPress={() => setSearch("")}
            testID="social-search-clear"
            accessibilityRole="button"
            accessibilityLabel="Clear search"
          >
            <Feather name="x" size={16} color={Colors.textTertiary} />
          </Pressable>
        )}
      </View>

      {!searching && (
        <View style={styles.pills} testID="social-tabs">
          {(
            [
              { key: "discover", label: "Discover" },
              { key: "following", label: "Following" },
              { key: "followers", label: "Followers" },
              { key: "inbox", label: "Inbox" },
            ] as { key: SocialTab; label: string }[]
          ).map((t) => (
            <Pressable
              key={t.key}
              style={[styles.pill, tab === t.key && styles.pillActive]}
              onPress={() => setTab(t.key)}
              testID={`social-tab-${t.key}`}
            >
              <Text
                style={[
                  styles.pillText,
                  tab === t.key && styles.pillTextActive,
                ]}
              >
                {t.label}
              </Text>
            </Pressable>
          ))}
        </View>
      )}

      {renderBody()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingBottom: 14,
    backgroundColor: Colors.background,
  },
  title: {
    fontFamily: "PlayfairDisplay_700Bold",
    fontSize: 28,
    color: Colors.text,
  },
  composeBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  searchWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginHorizontal: 20,
    marginBottom: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: Colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  searchInput: {
    flex: 1,
    fontFamily: "Inter_400Regular",
    fontSize: 14,
    color: Colors.text,
    paddingVertical: 0,
  },
  pills: {
    flexDirection: "row",
    paddingHorizontal: 20,
    gap: 8,
    marginBottom: 12,
  },
  pill: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
  },
  pillActive: {
    backgroundColor: Colors.text,
    borderColor: Colors.text,
  },
  pillText: {
    fontFamily: "Inter_500Medium",
    fontSize: 13,
    color: Colors.text,
  },
  pillTextActive: {
    color: Colors.surface,
  },
  subPills: {
    flexDirection: "row",
    paddingHorizontal: 20,
    gap: 8,
    marginBottom: 8,
  },
  subPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
  },
  subPillActive: {
    backgroundColor: Colors.card,
  },
  subPillText: {
    fontFamily: "Inter_500Medium",
    fontSize: 12,
    color: Colors.textSecondary,
    letterSpacing: 0.4,
  },
  subPillTextActive: {
    color: Colors.text,
    fontFamily: "Inter_600SemiBold",
  },
  userRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 12,
    gap: 14,
    backgroundColor: Colors.background,
  },
  userAvatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: Colors.card,
  },
  userInfo: { flex: 1, gap: 2 },
  userName: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 15,
    color: Colors.text,
  },
  userSub: {
    fontFamily: "Inter_400Regular",
    fontSize: 12,
    color: Colors.textSecondary,
  },
  userBio: {
    fontFamily: "Inter_400Regular",
    fontSize: 12,
    color: Colors.textTertiary,
    marginTop: 2,
  },
  followBtn: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 999,
    backgroundColor: Colors.text,
    borderWidth: 1,
    borderColor: Colors.text,
  },
  followBtnActive: {
    backgroundColor: Colors.surface,
    borderColor: Colors.border,
  },
  followBtnText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 12,
    color: Colors.surface,
    letterSpacing: 0.3,
  },
  followBtnTextActive: {
    color: Colors.textSecondary,
  },
  discoverHeader: {
    paddingHorizontal: 20,
    paddingTop: 4,
    paddingBottom: 14,
    gap: 4,
  },
  discoverHeaderTitle: {
    fontFamily: "PlayfairDisplay_700Bold",
    fontSize: 18,
    color: Colors.text,
  },
  discoverHeaderDesc: {
    fontFamily: "Inter_400Regular",
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
  convRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 14,
    gap: 14,
    backgroundColor: Colors.surface,
  },
  convAvatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: Colors.accentLight,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  convAvatarText: {
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
    flexShrink: 1,
  },
  convTime: {
    fontFamily: "Inter_400Regular",
    fontSize: 11,
    color: Colors.textTertiary,
    marginLeft: 8,
  },
  convPreview: {
    fontFamily: "Inter_400Regular",
    fontSize: 13,
    color: Colors.textSecondary,
  },
  sep: {
    height: 1,
    backgroundColor: Colors.borderLight,
    marginLeft: 80,
  },
  sepIndent: {
    height: 1,
    backgroundColor: Colors.border,
    marginLeft: 80,
  },
  empty: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 40,
    paddingTop: 60,
    gap: 10,
  },
  emptyTitle: {
    fontFamily: "PlayfairDisplay_700Bold",
    fontSize: 20,
    color: Colors.text,
    textAlign: "center",
  },
  emptyDesc: {
    fontFamily: "Inter_400Regular",
    fontSize: 13,
    color: Colors.textSecondary,
    textAlign: "center",
    lineHeight: 19,
  },
});
