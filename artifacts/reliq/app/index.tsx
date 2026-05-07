import { useEffect } from "react";
import { router } from "expo-router";
import { View, ActivityIndicator } from "react-native";
import { useAuth } from "@/contexts/AuthContext";
import Colors from "@/constants/colors";

// The intro slideshow is shown only at shopper signup (see
// app/(auth)/account-type.tsx) so it never appears twice for the same
// person. App launches just route into the feed or welcome.
export default function Index() {
  const { user, isLoading } = useAuth();

  useEffect(() => {
    if (isLoading) return;
    if (!user) {
      router.replace("/(auth)/welcome");
      return;
    }
    // Shops and shoppers get completely different tab bars. The
    // (shop-tabs) layout itself handles the case where the shop hasn't
    // set up a profile yet (it shows a "Set up your shop" panel rather
    // than auto-bouncing to /shop-setup).
    if (user.accountType === "shop") {
      router.replace("/(shop-tabs)");
    } else {
      router.replace("/(tabs)");
    }
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
