import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  useFonts as useInterFonts,
} from "@expo-google-fonts/inter";
import {
  PlayfairDisplay_400Regular,
  PlayfairDisplay_700Bold,
  PlayfairDisplay_400Regular_Italic,
  useFonts as usePlayfairFonts,
} from "@expo-google-fonts/playfair-display";
import { QueryClientProvider } from "@tanstack/react-query";
import { setBaseUrl } from "@workspace/api-client-react";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { SaveToast } from "@/components/SaveToast";
import { queryClient } from "@/lib/query-client";
import { AuthProvider } from "@/contexts/AuthContext";
import { AppProvider } from "@/contexts/AppContext";

const domain = process.env.EXPO_PUBLIC_DOMAIN;
if (domain) setBaseUrl(`https://${domain}`);

SplashScreen.preventAutoHideAsync();

function RootLayoutNav() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="onboarding" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen
        name="(auth)"
        options={{ presentation: "modal", headerShown: false }}
      />
      <Stack.Screen
        name="search"
        options={{ headerShown: false, presentation: "modal" }}
      />
      <Stack.Screen name="product/[id]" options={{ headerShown: false }} />
      <Stack.Screen name="shop/[id]" options={{ headerShown: false }} />
      <Stack.Screen name="user/[id]" options={{ headerShown: false }} />
      <Stack.Screen
        name="style-blend"
        options={{ headerShown: false, presentation: "modal" }}
      />
      <Stack.Screen
        name="cart"
        options={{ headerShown: false, presentation: "modal" }}
      />
      <Stack.Screen
        name="checkout"
        options={{ headerShown: false, presentation: "modal" }}
      />
      <Stack.Screen
        name="order-confirmation"
        options={{ headerShown: false, presentation: "modal" }}
      />
      <Stack.Screen name="orders" options={{ headerShown: false }} />
      <Stack.Screen name="conversation/[id]" options={{ headerShown: false }} />
      <Stack.Screen
        name="new-message"
        options={{ headerShown: false, presentation: "modal" }}
      />
      <Stack.Screen
        name="share-product"
        options={{ headerShown: false, presentation: "modal" }}
      />
      <Stack.Screen
        name="recommend/[productId]"
        options={{ headerShown: false, presentation: "modal" }}
      />
      <Stack.Screen
        name="shop-setup"
        options={{ headerShown: false, presentation: "modal" }}
      />
      <Stack.Screen
        name="add-product"
        options={{ headerShown: false, presentation: "modal" }}
      />
      <Stack.Screen name="shop-dashboard" options={{ headerShown: false }} />
      <Stack.Screen
        name="save-to-collection"
        options={{ headerShown: false, presentation: "modal" }}
      />
      <Stack.Screen
        name="review/[shopId]"
        options={{ headerShown: false, presentation: "modal" }}
      />
    </Stack>
  );
}

export default function RootLayout() {
  const [interLoaded, interError] = useInterFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  const [playfairLoaded, playfairError] = usePlayfairFonts({
    PlayfairDisplay_400Regular,
    PlayfairDisplay_700Bold,
    PlayfairDisplay_400Regular_Italic,
  });

  const fontsLoaded = interLoaded && playfairLoaded;
  const fontError = interError || playfairError;

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) return null;

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <SafeAreaProvider>
          <AuthProvider>
            <AppProvider>
              <GestureHandlerRootView style={{ flex: 1 }}>
                <RootLayoutNav />
                <SaveToast />
              </GestureHandlerRootView>
            </AppProvider>
          </AuthProvider>
        </SafeAreaProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}
