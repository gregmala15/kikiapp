import { useEffect } from "react";
import { router } from "expo-router";
import { View, ActivityIndicator } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuth } from "@/contexts/AuthContext";
import Colors from "@/constants/colors";

// Bumped whenever the onboarding slideshow content changes so existing
// users see the updated intro on next launch. Keep in sync with
// ONBOARDING_KEY in app/onboarding.tsx.
const ONBOARDING_KEY = "reliq_onboarding_seen_v1";

export default function Index() {
  const { user, isLoading } = useAuth();

  useEffect(() => {
    if (isLoading) return;
    let cancelled = false;
    (async () => {
      const seen = await AsyncStorage.getItem(ONBOARDING_KEY);
      if (cancelled) return;
      if (!seen) {
        router.replace("/onboarding");
      } else if (user) {
        router.replace("/(tabs)");
      } else {
        router.replace("/(auth)/welcome");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [user, isLoading]);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: Colors.background,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <ActivityIndicator color={Colors.accent} />
    </View>
  );
}
