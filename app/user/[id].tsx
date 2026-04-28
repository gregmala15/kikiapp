import React, { useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  Switch,
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
  Product,
} from "@/constants/seed-data";
import { useAppContext } from "@/contexts/AppContext";
import { Alert } from "react-native";

export default function UserProfileScreen() {
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const {
    isFollowingUser,
    toggleFollowUser,
    isStyleInfluence,
    toggleStyleInfluence,
    getStyleInfluenceWeight,
    myStyleWeight,
  } = useAppContext();

  const user = id ? getUserById(id) : undefined;
  const liked = useMemo<Product[]>(() => {
    if (!id) return [];
    return getLikesForUser(id)
      .map((pid) => getProductById(pid))
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
  const blended = isStyleInfluence(user.id);

  function handleFollowPress() {
    if (Platform.OS !== "web") {
      Haptics.selectionAsync();
    }
    toggleFollowUser(user!.id);
  }

  function handleBlendToggle(value: boolean) {
    if (Platform.OS !== "web") {
      Haptics.selectionAsync();
    }
    // If the user is trying to ADD this person but the blend is already at
    // 100% (no headroom), surface a friendly note instead of silently doing
    // nothing — the underlying toggleStyleInfluence refuses the add.
    if (value && !blended && myStyleWeight === 0) {
      Alert.alert(
        "Style Blend is full",
        "Lower another influence's % first, then add this person.",
      );
      return;
    }
    toggleStyleInfluence(user!.id);
  }

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: topPad }]}>
        <Pressable
          style={styles.headerBtn}
          onPress={() => router.back()}
          testID="profile-back"
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
          <Text style={styles.bio}>{user.bio}</Text>
          <View style={styles.cityRow}>
            <Feather name="map-pin" size={12} color={Colors.textSecondary} />
            <Text style={styles.cityText}>{user.city}</Text>
          </View>
        </View>

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

        {/*
          STYLE BLEND TOGGLE
          When ON, this user is added to the current account's style_influences.
          The For You feed merges products this user has liked into the
          current user's feed (see app/(tabs)/index.tsx → forYouFeed).
        */}
        <View style={styles.blendCard}>
          <View style={styles.blendCopy}>
            <Text style={styles.blendTitle}>Include in my feed</Text>
            <Text style={styles.blendSub}>
              Style Blend will surface pieces {user.fullName.split(" ")[0]} has
              saved in your For You.
            </Text>
          </View>
          <Switch
            value={blended}
            onValueChange={handleBlendToggle}
            testID="style-blend-toggle"
            trackColor={{ false: Colors.border, true: Colors.text }}
            thumbColor={Colors.surface}
            ios_backgroundColor={Colors.border}
          />
        </View>

        {blended && (
          <Pressable
            style={styles.adjustRow}
            onPress={() => router.push("/style-blend")}
            testID="adjust-blend-link"
          >
            <View style={styles.adjustInfo}>
              <Text style={styles.adjustLabel}>Their share of your feed</Text>
              <Text style={styles.adjustPct} testID="profile-blend-pct">
                {getStyleInfluenceWeight(user.id)}%
              </Text>
            </View>
            <View style={styles.adjustCta}>
              <Text style={styles.adjustCtaText}>Adjust</Text>
              <Feather
                name="chevron-right"
                size={14}
                color={Colors.textSecondary}
              />
            </View>
          </Pressable>
        )}

        <View style={styles.likesHeader}>
          <Text style={styles.likesTitle}>Recently liked</Text>
          <Text style={styles.likesCount}>{liked.length}</Text>
        </View>

        {liked.length === 0 ? (
          <View style={styles.empty}>
            <Text style={styles.emptyText}>No likes yet.</Text>
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
    marginBottom: 20,
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
  bio: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    color: Colors.textSecondary,
    textAlign: "center",
    marginBottom: 6,
  },
  cityRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  cityText: {
    fontSize: 12,
    fontFamily: "Inter_500Medium",
    color: Colors.textSecondary,
  },
  followBtn: {
    backgroundColor: Colors.text,
    borderRadius: 999,
    paddingVertical: 12,
    alignItems: "center",
    marginBottom: 16,
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
  blendCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: Colors.card,
    borderRadius: 14,
    padding: 16,
    marginBottom: 28,
  },
  blendCopy: {
    flex: 1,
  },
  blendTitle: {
    fontSize: 15,
    fontFamily: "Inter_600SemiBold",
    color: Colors.text,
    marginBottom: 4,
  },
  blendSub: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    color: Colors.textSecondary,
    lineHeight: 17,
  },
  adjustRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    padding: 14,
    marginTop: -16,
    marginBottom: 28,
  },
  adjustInfo: { flex: 1 },
  adjustLabel: {
    fontSize: 11,
    fontFamily: "Inter_500Medium",
    color: Colors.textSecondary,
    letterSpacing: 0.6,
    textTransform: "uppercase",
    marginBottom: 4,
  },
  adjustPct: {
    fontSize: 22,
    fontFamily: "PlayfairDisplay_700Bold",
    color: Colors.text,
  },
  adjustCta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  adjustCtaText: {
    fontSize: 13,
    fontFamily: "Inter_600SemiBold",
    color: Colors.textSecondary,
  },
  likesHeader: {
    flexDirection: "row",
    alignItems: "baseline",
    justifyContent: "space-between",
    marginBottom: 14,
  },
  likesTitle: {
    fontSize: 13,
    fontFamily: "Inter_600SemiBold",
    color: Colors.text,
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  likesCount: {
    fontSize: 12,
    fontFamily: "Inter_500Medium",
    color: Colors.textSecondary,
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
    paddingVertical: 40,
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
