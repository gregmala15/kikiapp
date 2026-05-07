import React, { useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  Platform,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { Image } from "expo-image";
import * as Haptics from "expo-haptics";
import Colors from "@/constants/colors";
import {
  getUserById,
  getLikesForUser,
  getProductById,
  getStyleTagsForUser,
  getFollowersForUser,
  getFollowedShopsCountForUser,
  getRecommendationsByUser,
  Product,
} from "@/constants/seed-data";
import { useAppContext } from "@/contexts/AppContext";
import { useAuth } from "@/contexts/AuthContext";
import {
  InfluenceSelector,
  InfluenceSelection,
} from "@/components/InfluenceSelector";

// -----------------------------------------------------------------------------
// User profile (community user)
// -----------------------------------------------------------------------------
// Surfaces everything you'd want to know about another shopper before
// deciding to follow / message / influence-from them:
//   - identity:     avatar, full name, @username, city, bio
//   - taste:        style tags (derived from product tags they've liked)
//   - social:       followers / following / followed-shops counts
//   - actions:      follow / message
//   - influence:    Style Influence selector (Off · Light · Medium · Strong · Heavy)
//   - public picks: recently liked products grid
//   - rec'd items:  things they've recommended to the community
// -----------------------------------------------------------------------------
export default function UserProfileScreen() {
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user: currentUser } = useAuth();
  const {
    isFollowingUser,
    toggleFollowUser,
    getStyleInfluenceLevel,
    setStyleInfluenceLevel,
  } = useAppContext();

  const user = id ? getUserById(id) : undefined;

  const liked = useMemo<Product[]>(() => {
    if (!id) return [];
    return getLikesForUser(id)
      .map((pid) => getProductById(pid))
      .filter((p): p is Product => !!p);
  }, [id]);

  // Aggregate stats for the profile header.
  const styleTags = useMemo<string[]>(
    () => (id ? getStyleTagsForUser(id, 6) : []),
    [id],
  );
  // Seed followers + 1 if the current viewer is following this user, so
  // the count reflects the act of following live (the seed list never
  // changes; tapping Follow has to bump the visible number itself).
  const viewerFollowing = id ? isFollowingUser(id) : false;
  const followerCount = useMemo<number>(
    () =>
      id
        ? getFollowersForUser(id).length + (viewerFollowing ? 1 : 0)
        : 0,
    [id, viewerFollowing],
  );
  // For non-current users we don't have a real followedUserIds list (the
  // demo's social graph only exists for the auth user) — derive a stable
  // count from the seed-data hash so numbers feel real and don't churn.
  const followingCount = useMemo<number>(
    () => (id ? Math.max(2, getFollowersForUser(id).length + 1) : 0),
    [id],
  );
  const followedShopsCount = useMemo<number>(
    () => (id ? getFollowedShopsCountForUser(id) : 0),
    [id],
  );

  const recommended = useMemo<Product[]>(() => {
    if (!id) return [];
    return getRecommendationsByUser(id)
      .map((r) => getProductById(r.productId))
      .filter((p): p is Product => !!p);
  }, [id]);

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;

  if (!user) {
    return (
      <View style={[styles.container, { paddingTop: topPad }]}>
        <Pressable
          style={styles.headerBtn}
          onPress={() => router.back()}
          testID="profile-back"
        >
          <Feather name="chevron-left" size={24} color={Colors.text} />
        </Pressable>
        <View style={styles.empty}>
          <Text style={styles.emptyTitle}>User not found</Text>
        </View>
      </View>
    );
  }

  const following = isFollowingUser(user.id);
  // Current level the viewer has assigned to this user, or "off" when
  // they aren't in the blend. Drives the segmented selector below.
  const influenceLevel: InfluenceSelection = getStyleInfluenceLevel(user.id);

  function handleFollowPress() {
    if (Platform.OS !== "web") {
      Haptics.selectionAsync();
    }
    toggleFollowUser(user!.id);
  }

  // Open (or create on first send) a 1:1 conversation with this user.
  // The conversation route accepts the precomputed convId plus recipient
  // metadata so the empty conversation can render immediately, before the
  // first message has been sent. AppContext.sendMessage materialises the
  // Conversation row on first send.
  function handleMessagePress() {
    if (!currentUser) return;
    if (Platform.OS !== "web") {
      Haptics.selectionAsync();
    }
    const convId = [currentUser.id, user!.id].sort().join("_");
    router.push({
      pathname: "/conversation/[id]",
      params: {
        id: convId,
        recipientId: user!.id,
        recipientName: user!.fullName,
        recipientType: "user",
      },
    });
  }

  // Segmented selector → AppContext. No headroom logic, no alerts: levels
  // are independent boosts, so picking any of the five stops always works.
  function handleInfluenceChange(next: InfluenceSelection) {
    setStyleInfluenceLevel(user!.id, next);
  }

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: topPad }]}>
        <Pressable
          style={styles.headerBtn}
          onPress={() => router.back()}
          testID="profile-back"
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <Feather name="chevron-left" size={24} color={Colors.text} />
        </Pressable>
        <Text style={styles.headerTitle} numberOfLines={1}>
          @{user.username}
        </Text>
        <View style={styles.headerBtn} />
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.scroll,
          { paddingBottom: bottomPad + 32 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.profileBlock}>
          <Image source={{ uri: user.avatarUrl }} style={styles.avatar} />
          <Text style={styles.fullName}>{user.fullName}</Text>
          <View style={styles.cityRow}>
            <Feather name="map-pin" size={12} color={Colors.textSecondary} />
            <Text style={styles.cityText}>{user.city}</Text>
          </View>
          <Text style={styles.bio}>{user.bio}</Text>
        </View>

        {/* Stats — followers / following / followed shops */}
        <View style={styles.statsRow} testID="profile-stats">
          <View style={styles.statCell}>
            <Text style={styles.statValue} testID="profile-followers-count">
              {followerCount}
            </Text>
            <Text style={styles.statLabel}>Followers</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statCell}>
            <Text style={styles.statValue} testID="profile-following-count">
              {followingCount}
            </Text>
            <Text style={styles.statLabel}>Following</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statCell}>
            <Text style={styles.statValue} testID="profile-shops-count">
              {followedShopsCount}
            </Text>
            <Text style={styles.statLabel}>Shops</Text>
          </View>
        </View>

        {/* Style tags — derived from products this user has liked */}
        {styleTags.length > 0 && (
          <View style={styles.tagsRow} testID="profile-style-tags">
            {styleTags.map((t) => (
              <View key={t} style={styles.tagPill}>
                <Text style={styles.tagText}>{t}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Primary actions: Follow + Message */}
        <View style={styles.actionsRow}>
          <Pressable
            onPress={handleFollowPress}
            testID="profile-follow-btn"
            style={[styles.followBtn, following && styles.followingBtn]}
          >
            <Text
              style={[
                styles.followBtnText,
                following && styles.followingBtnText,
              ]}
            >
              {following ? "Following" : "Follow"}
            </Text>
          </Pressable>
          <Pressable
            onPress={handleMessagePress}
            testID="profile-message-btn"
            style={styles.messageBtn}
            accessibilityRole="button"
            accessibilityLabel={`Message ${user.fullName}`}
          >
            <Feather name="send" size={16} color={Colors.text} />
            <Text style={styles.messageBtnText}>Message</Text>
          </Pressable>
        </View>

        {/*
          STYLE INFLUENCE
          5-stop selector controlling how strongly this user nudges the
          viewer's For You feed. Off = not in the blend; Light/Medium/
          Strong/Heavy map to numeric boosts (1/2/3/4) used by the feed
          scorer in app/(tabs)/index.tsx. The user's own taste always
          remains the base of the feed — these levels only add to it.
        */}
        <View style={styles.influenceCard} testID="style-influence-card">
          <View style={styles.influenceHeader}>
            <Text style={styles.influenceTitle}>Style Influence</Text>
            <Text style={styles.influenceSub}>
              How much {user.fullName.split(" ")[0]}&apos;s taste nudges your
              For You feed.
            </Text>
          </View>
          <InfluenceSelector
            value={influenceLevel}
            onChange={handleInfluenceChange}
            testIDPrefix="profile-influence"
          />
        </View>

        {/* Recommended items — pieces they've publicly recommended */}
        {recommended.length > 0 && (
          <View style={styles.section} testID="profile-recommended-section">
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Recommended</Text>
              <Text style={styles.sectionCount}>{recommended.length}</Text>
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.hScroll}
            >
              {recommended.map((p) => (
                <Pressable
                  key={p.id}
                  style={styles.hCard}
                  onPress={() => router.push(`/product/${p.id}`)}
                  testID={`profile-rec-${p.id}`}
                >
                  <Image source={{ uri: p.imageUrl }} style={styles.hImage} />
                  <Text style={styles.hTitle} numberOfLines={1}>
                    {p.title}
                  </Text>
                  <Text style={styles.hPrice}>£{p.price}</Text>
                </Pressable>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Saved picks preview — what they've publicly saved */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Saved picks</Text>
            <Text style={styles.sectionCount}>{liked.length}</Text>
          </View>

          {liked.length === 0 ? (
            <View style={styles.empty}>
              <Text style={styles.emptyText}>No saves yet.</Text>
            </View>
          ) : (
            <View style={styles.grid}>
              {liked.map((product) => (
                <Pressable
                  key={product.id}
                  style={styles.gridItem}
                  onPress={() => router.push(`/product/${product.id}`)}
                  testID={`profile-liked-${product.id}`}
                >
                  <Image
                    source={{ uri: product.imageUrl }}
                    style={styles.gridImage}
                  />
                  <Text style={styles.gridTitle} numberOfLines={1}>
                    {product.title}
                  </Text>
                  <Text style={styles.gridPrice}>£{product.price}</Text>
                </Pressable>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    paddingBottom: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.borderLight,
    backgroundColor: Colors.background,
  },
  headerBtn: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 16,
    fontFamily: "Inter_600SemiBold",
    color: Colors.text,
    flex: 1,
    textAlign: "center",
  },
  scroll: {
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  profileBlock: {
    alignItems: "center",
    marginBottom: 18,
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    marginBottom: 12,
    backgroundColor: Colors.card,
  },
  fullName: {
    fontSize: 22,
    fontFamily: "PlayfairDisplay_700Bold",
    color: Colors.text,
    marginBottom: 4,
  },
  cityRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginBottom: 8,
  },
  cityText: {
    fontSize: 12,
    fontFamily: "Inter_500Medium",
    color: Colors.textSecondary,
  },
  bio: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    color: Colors.textSecondary,
    textAlign: "center",
  },
  statsRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.card,
    borderRadius: 14,
    paddingVertical: 14,
    marginBottom: 16,
  },
  statCell: { flex: 1, alignItems: "center" },
  statDivider: {
    width: 1,
    height: 28,
    backgroundColor: Colors.border,
  },
  statValue: {
    fontSize: 18,
    fontFamily: "PlayfairDisplay_700Bold",
    color: Colors.text,
  },
  statLabel: {
    fontSize: 11,
    fontFamily: "Inter_500Medium",
    color: Colors.textSecondary,
    letterSpacing: 0.6,
    textTransform: "uppercase",
    marginTop: 2,
  },
  tagsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 18,
  },
  tagPill: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  tagText: {
    fontSize: 11,
    fontFamily: "Inter_500Medium",
    color: Colors.text,
    letterSpacing: 0.3,
  },
  actionsRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 16,
  },
  followBtn: {
    flex: 1,
    backgroundColor: Colors.text,
    borderRadius: 999,
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  followingBtn: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  followBtnText: {
    fontSize: 14,
    fontFamily: "Inter_600SemiBold",
    color: Colors.surface,
    letterSpacing: 0.4,
  },
  followingBtnText: {
    color: Colors.text,
  },
  messageBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    backgroundColor: Colors.surface,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingVertical: 12,
  },
  messageBtnText: {
    fontSize: 14,
    fontFamily: "Inter_600SemiBold",
    color: Colors.text,
    letterSpacing: 0.4,
  },
  // Style Influence card — header copy on top, segmented selector below.
  // Vertical layout gives the 5-stop control room to breathe on a 375pt
  // phone; the brand's surface colour keeps it visually quiet so the
  // segmented control's active chip is what draws the eye.
  influenceCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 14,
    marginBottom: 16,
    gap: 12,
  },
  influenceHeader: { gap: 4 },
  influenceTitle: {
    fontSize: 15,
    fontFamily: "Inter_600SemiBold",
    color: Colors.text,
  },
  influenceSub: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    color: Colors.textSecondary,
    lineHeight: 17,
  },
  section: {
    marginTop: 14,
    marginBottom: 6,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "baseline",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 13,
    fontFamily: "Inter_600SemiBold",
    color: Colors.text,
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  sectionCount: {
    fontSize: 12,
    fontFamily: "Inter_500Medium",
    color: Colors.textSecondary,
  },
  hScroll: {
    gap: 12,
    paddingRight: 4,
  },
  hCard: {
    width: 130,
  },
  hImage: {
    width: "100%",
    aspectRatio: 0.85,
    borderRadius: 10,
    backgroundColor: Colors.card,
    marginBottom: 6,
  },
  hTitle: {
    fontSize: 12,
    fontFamily: "Inter_500Medium",
    color: Colors.text,
    marginBottom: 2,
  },
  hPrice: {
    fontSize: 12,
    fontFamily: "Inter_600SemiBold",
    color: Colors.text,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  gridItem: {
    width: "47%",
  },
  gridImage: {
    width: "100%",
    aspectRatio: 0.85,
    borderRadius: 10,
    backgroundColor: Colors.card,
    marginBottom: 6,
  },
  gridTitle: {
    fontSize: 12,
    fontFamily: "Inter_500Medium",
    color: Colors.text,
    marginBottom: 2,
  },
  gridPrice: {
    fontSize: 12,
    fontFamily: "Inter_600SemiBold",
    color: Colors.text,
  },
  empty: {
    paddingVertical: 28,
    alignItems: "center",
  },
  emptyTitle: {
    fontSize: 16,
    fontFamily: "PlayfairDisplay_700Bold",
    color: Colors.text,
  },
  emptyText: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    color: Colors.textSecondary,
  },
});
