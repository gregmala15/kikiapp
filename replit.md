# KIKI — Kreating Infrastructure for Kreative Independence

A mobile marketplace app for discovering and buying from independent fashion brands and vintage shops. Built with Expo + React Native (no backend — all persistence via AsyncStorage).

## Tech Stack

- **Frontend**: Expo (SDK 54), Expo Router v6, React Native
- **State**: React Context (AuthContext + AppContext) + AsyncStorage
- **Fonts**: Inter (body/UI) + Playfair Display (brand/headings)
- **Icons**: @expo/vector-icons (Ionicons + Feather)
- **Images**: expo-image
- **Navigation**: Expo Router with NativeTabs (liquid glass on iOS 26+) + classic Tabs fallback

## App Architecture

### Colors (constants/colors.ts)
- Background: `#FAF9F7` (cream), Surface: `#FFFFFF`, Card: `#F5F3EF`
- Text: `#1A1A1A` (charcoal), Accent: `#C9956C` (terracotta)
- Danger: `#E05252`, Success: `#4CAF50`

### Data (constants/seed-data.ts)
- 16 shops: 8 Rome + 8 London (mix of vintage + independent brands)
- 62 products across all categories
- Helper functions: getShopById, getProductById, getProductsByShop, getHiddenGemShops/Products

### Contexts
- `AuthContext` — login/register/logout, persists user to AsyncStorage
- `AppContext` — saved items, followed shops/users, cart, orders, user shop, messages

### Account Types
- **Shopper** (`user`): browse, save, cart, checkout, messages
- **Shop** (`shop`): + shop setup, add products, dashboard, order management

## Screen Structure

```
app/
  index.tsx              → redirects to welcome or tabs
  _layout.tsx            → root layout, fonts, providers
  (auth)/
    welcome.tsx          → KIKI welcome / sign-in entry
    login.tsx            → login form
    register.tsx         → register form
    account-type.tsx     → shopper vs shop selection
  (tabs)/
    index.tsx            → For You feed (category filter + product cards)
    hidden-gems.tsx      → Hidden Gems (boosted small shops — products/shops toggle)
    saved.tsx            → Saved items
    messages.tsx         → Conversations list
    profile.tsx          → User profile, stats, orders, following, shop info
  product/[id].tsx       → Product detail (image, meta, shop row, add to cart)
  shop/[id].tsx          → Shop profile (hero, follow, product grid)
  cart.tsx               → Shopping bag (qty controls, checkout)
  checkout.tsx           → Address + simulated payment
  order-confirmation.tsx → Success screen + order tracking steps
  orders.tsx             → Order history
  conversation/[id].tsx  → DM thread (product banner, message bubbles)
  recommend/[productId].tsx → Recommend a product to followed users
  user/[id].tsx          → Community user profile (Style Blend toggle, recently liked)
  style-blend.tsx        → Style Blend management (per-influence % with -/+ controls)
  shop-setup.tsx         → Create/edit shop profile
  add-product.tsx        → Add product to shop rack
  shop-dashboard.tsx     → Shop products + orders management
```

## Key Decisions
- No backend — AsyncStorage only (prototype)
- Dual font loading with explicit error handling
- Web platform insets: 67px top, 84px tab height, 34px bottom
- All routes registered in root `_layout.tsx` Stack
- Product/shop IDs: UUID-style for seed data, timestamp-based for user-created
