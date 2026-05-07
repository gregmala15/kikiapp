// Pre-seeded AsyncStorage pairs for two investor demo accounts.
// Keys match AppContext's pattern: kiki_{base}_{userId}.
// Values are JSON-stringified strings ready for AsyncStorage.multiSet.

const VAULT_SHOP_ID = "user-shop-vault";

// ─── The Vault London — 18 products ─────────────────────────────────────────

const vaultProducts = [
  {
    id: "vault-p01",
    shopId: VAULT_SHOP_ID,
    title: "1960s Ossie Clark Crepe Dress",
    description:
      "Genuine Ossie Clark crepe dress in his signature fluid cut, circa 1968. Soft sage green with delicate smocking at the wrists. Fully lined. Vintage UK 10. An archive collector's dream.",
    price: 585,
    category: "Archive / Rare",
    size: "Vintage UK 10 / S",
    condition: "Excellent",
    era: "1960s",
    imageUrl:
      "https://images.unsplash.com/photo-1611241986754-db6b06ecfc13?w=800&q=80",
    quantity: 1,
    isVintage: true,
    isSold: true,
    tags: ["Ossie Clark", "archive", "60s", "crepe"],
  },
  {
    id: "vault-p02",
    shopId: VAULT_SHOP_ID,
    title: "1970s Schott Perfecto Biker Jacket",
    description:
      "Iconic Schott NYC Perfecto biker jacket in heavyweight black leather, 1970s. Original asymmetric zip, belted waist, padded shoulders. Size M. Battle-worn patina, no damage.",
    price: 420,
    category: "Outerwear",
    size: "M",
    condition: "Very Good",
    era: "1970s",
    imageUrl:
      "https://images.unsplash.com/photo-1548426196869-bfe7f0e36b32?w=800&q=80",
    quantity: 1,
    isVintage: true,
    tags: ["Schott", "biker jacket", "leather", "70s"],
  },
  {
    id: "vault-p03",
    shopId: VAULT_SHOP_ID,
    title: "1980s Vivienne Westwood Buffalo Boots",
    description:
      "Authentic Vivienne Westwood Buffalo platform boots from the seminal 1982 collection. UK 5 / EU 38. Original sole, no repairs. Museum-quality piece. Comes with original box.",
    price: 890,
    category: "Archive / Rare",
    size: "EU 38 / UK 5",
    condition: "Excellent",
    era: "1980s",
    imageUrl:
      "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=800&q=80",
    quantity: 1,
    isVintage: true,
    isSold: true,
    tags: ["Vivienne Westwood", "Buffalo", "archive", "80s"],
  },
  {
    id: "vault-p04",
    shopId: VAULT_SHOP_ID,
    title: "1990s Comme des Garçons Deconstructed Blazer",
    description:
      "Rei Kawakubo-era Comme des Garçons single-breasted blazer with asymmetric lapels and unfinished raw-edge seams. Size M. Navy wool. Fully authenticated. An architectural masterpiece.",
    price: 520,
    category: "Archive / Rare",
    size: "M / EU 40",
    condition: "Excellent",
    era: "1990s",
    imageUrl:
      "https://images.unsplash.com/photo-1591561954555-b5e8b9c05e64?w=800&q=80",
    quantity: 1,
    isVintage: true,
    isSold: true,
    tags: ["CdG", "archive", "deconstructed", "90s"],
  },
  {
    id: "vault-p05",
    shopId: VAULT_SHOP_ID,
    title: "1960s Mary Quant Miniskirt",
    description:
      "Authentic Mary Quant miniskirt from 1966. Geometric white and black print on heavyweight cotton twill. Original Quant label intact. Side zip. Vintage UK 10.",
    price: 285,
    category: "Dresses",
    size: "Vintage UK 10 / S",
    condition: "Excellent",
    era: "1960s",
    imageUrl:
      "https://images.unsplash.com/photo-1539032406093-6a8daa7a2b27?w=800&q=80",
    quantity: 1,
    isVintage: true,
    isSold: true,
    tags: ["Mary Quant", "miniskirt", "60s", "Swinging London"],
  },
  {
    id: "vault-p06",
    shopId: VAULT_SHOP_ID,
    title: "1970s Halston Jersey Wrap Top",
    description:
      "Silky matte jersey wrap top in deep claret, 1970s. Characteristic Halston drape and minimalist aesthetic. Size S/M. The ultimate 70s going-out piece.",
    price: 195,
    category: "Tops",
    size: "S / M",
    condition: "Very Good",
    era: "1970s",
    imageUrl:
      "https://images.unsplash.com/photo-1617137984326-9ad49ad3b3e0?w=800&q=80",
    quantity: 1,
    isVintage: true,
    tags: ["Halston", "70s", "jersey", "wrap"],
  },
  {
    id: "vault-p07",
    shopId: VAULT_SHOP_ID,
    title: "1985 Thierry Mugler Power Blazer",
    description:
      "The definitive power blazer — padded shoulders, nipped waist, structured boning. Black wool-blend, EU 38. This is the Mugler silhouette at its most iconic. Excellent condition.",
    price: 680,
    category: "Archive / Rare",
    size: "EU 38 / UK 10",
    condition: "Excellent",
    era: "1980s",
    imageUrl:
      "https://images.unsplash.com/photo-1566634762-8268c7a4e4e3?w=800&q=80",
    quantity: 1,
    isVintage: true,
    isSold: true,
    tags: ["Mugler", "power blazer", "80s", "archive"],
  },
  {
    id: "vault-p08",
    shopId: VAULT_SHOP_ID,
    title: "1990s Calvin Klein Minimalist Trench",
    description:
      "The mid-90s Calvin Klein trench that defined quiet luxury. Double-breasted, belted, bone-white cotton gabardine. Size M. Lining pristine, original buttons intact. The essential investment coat.",
    price: 395,
    category: "Outerwear",
    size: "M",
    condition: "Very Good",
    era: "1990s",
    imageUrl:
      "https://images.unsplash.com/photo-1612902153705-60e9a5c52c10?w=800&q=80",
    quantity: 1,
    isVintage: true,
    isSold: true,
    tags: ["Calvin Klein", "trench", "minimalism", "90s"],
  },
  {
    id: "vault-p09",
    shopId: VAULT_SHOP_ID,
    title: "1970s Platform Leather Ankle Boots",
    description:
      "Platform leather ankle boots in tan with stacked wooden heel. EU 38. Original sole, minor wear at toe consistent with age. A 70s staple.",
    price: 265,
    category: "Footwear",
    size: "EU 38 / UK 5",
    condition: "Good",
    era: "1970s",
    imageUrl:
      "https://images.unsplash.com/photo-1585487384849-3e7dc2b65be9?w=800&q=80",
    quantity: 1,
    isVintage: true,
    tags: ["platform boots", "leather", "70s", "tan"],
  },
  {
    id: "vault-p10",
    shopId: VAULT_SHOP_ID,
    title: "1968 Courrèges Space Age Mini Dress",
    description:
      "André Courrèges Space Age mini dress in white structured cotton with cut-out circle detail at hem. EU 36 / UK 8. Original Courrèges Paris label. Extraordinary piece.",
    price: 475,
    category: "Archive / Rare",
    size: "EU 36 / UK 8 / XS-S",
    condition: "Excellent",
    era: "1960s",
    imageUrl:
      "https://images.unsplash.com/photo-1582037928769-181f2644ecb7?w=800&q=80",
    quantity: 1,
    isVintage: true,
    isSold: true,
    tags: ["Courrèges", "Space Age", "60s", "archive"],
  },
  {
    id: "vault-p11",
    shopId: VAULT_SHOP_ID,
    title: "1985 Issey Miyake Pleated Skirt",
    description:
      "Classic Issey Miyake Pleats Please skirt in deep aubergine. Permanently pleated polyester, incredibly lightweight. Size S/M. Mint condition, no pulls. Wear forever.",
    price: 340,
    category: "Dresses",
    size: "S / M",
    condition: "Excellent",
    era: "1980s",
    imageUrl:
      "https://images.unsplash.com/photo-1617031380183-c6a48be08e69?w=800&q=80",
    quantity: 1,
    isVintage: true,
    isSold: true,
    tags: ["Issey Miyake", "pleated", "80s", "aubergine"],
  },
  {
    id: "vault-p12",
    shopId: VAULT_SHOP_ID,
    title: "1990s Chanel Logo Chain Belt",
    description:
      "Vintage 1990s Chanel gold-tone chain belt with interlocking CC turnlock. Adjustable 70–90cm. Gold plating in excellent condition. Original Chanel pouch included.",
    price: 320,
    category: "Accessories",
    size: "Adjustable 70–90cm",
    condition: "Very Good",
    era: "1990s",
    imageUrl:
      "https://images.unsplash.com/photo-1576051761929-2a0c2aef8a89?w=800&q=80",
    quantity: 1,
    isVintage: true,
    tags: ["Chanel", "belt", "chain", "90s"],
  },
  {
    id: "vault-p13",
    shopId: VAULT_SHOP_ID,
    title: "1970s Hand-Crochet Maxi Dress",
    description:
      "Exquisite hand-crocheted cotton maxi in natural ivory with tassel hem. 1970s, size S/M. Beach-festival ready. A labour of love; no two exactly alike.",
    price: 185,
    category: "Dresses",
    size: "S / M",
    condition: "Good",
    era: "1970s",
    imageUrl:
      "https://images.unsplash.com/photo-1598539255825-60df0fb63cad?w=800&q=80",
    quantity: 1,
    isVintage: true,
    isSold: true,
    tags: ["crochet", "maxi", "70s", "boho"],
  },
  {
    id: "vault-p14",
    shopId: VAULT_SHOP_ID,
    title: "1990s Versace Medusa Sunglasses",
    description:
      "Authentic 1990s Versace gold-tone metal sunglasses with Medusa head detail at temples. Dark tinted lenses. Original case included. The ultimate 90s luxury accessory.",
    price: 245,
    category: "Accessories",
    size: "One Size",
    condition: "Excellent",
    era: "1990s",
    imageUrl:
      "https://images.unsplash.com/photo-1571333492327-52aeec491b76?w=800&q=80",
    quantity: 1,
    isVintage: true,
    isSold: true,
    tags: ["Versace", "sunglasses", "Medusa", "90s"],
  },
  {
    id: "vault-p15",
    shopId: VAULT_SHOP_ID,
    title: "1960s Space Print Mod Shift Dress",
    description:
      "Striking 1960s mod shift dress in a cosmic print — orbiting planets on black cotton. UK 10. Side zip. Graphic impact is extraordinary. The kind of piece you build an outfit around.",
    price: 310,
    category: "Dresses",
    size: "Vintage UK 10 / S",
    condition: "Very Good",
    era: "1960s",
    imageUrl:
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=80",
    quantity: 1,
    isVintage: true,
    tags: ["mod", "60s", "space print", "shift dress"],
  },
  {
    id: "vault-p16",
    shopId: VAULT_SHOP_ID,
    title: "1980s Ralph Lauren Polo Denim Jacket",
    description:
      "Classic Ralph Lauren double RL denim jacket with embroidered pony logo. 1980s. Size S/M. Faded medium wash, contrast orange stitching. The definitive American denim jacket.",
    price: 195,
    category: "Outerwear",
    size: "S / M",
    condition: "Very Good",
    era: "1980s",
    imageUrl:
      "https://images.unsplash.com/photo-1542272201-b1d6ab8b5c84?w=800&q=80",
    quantity: 1,
    isVintage: true,
    tags: ["Ralph Lauren", "denim jacket", "80s", "polo"],
  },
  {
    id: "vault-p17",
    shopId: VAULT_SHOP_ID,
    title: "1970s Deadstock Flared Trousers",
    description:
      "Deadstock 1970s flares in a rich burnt sienna corduroy. W28 L32. Original shop tags still attached. Perfect wide flare opening. Unworn condition — a remarkable find.",
    price: 155,
    category: "Archive / Rare",
    size: "W28 L32",
    condition: "New with tags",
    era: "1970s",
    imageUrl:
      "https://images.unsplash.com/photo-1541232460-19eb6a7cc882?w=800&q=80",
    quantity: 1,
    isVintage: true,
    isSold: true,
    tags: ["flares", "deadstock", "70s", "corduroy"],
  },
  {
    id: "vault-p18",
    shopId: VAULT_SHOP_ID,
    title: "1990s Hunter Original Tall Wellies",
    description:
      "Vintage 1990s Hunter Original tall wellington boots in forest green. EU 38 / UK 5. Original sole, minimal use, no cracks. Pre-loved British countryside heritage.",
    price: 95,
    category: "Footwear",
    size: "EU 38 / UK 5",
    condition: "Good",
    era: "1990s",
    imageUrl:
      "https://images.unsplash.com/photo-1605518849116-e3dc6f6d8282?w=800&q=80",
    quantity: 1,
    isVintage: true,
    tags: ["Hunter", "wellies", "90s", "British"],
  },
];

// ─── The Vault London — 8 orders ────────────────────────────────────────────

function pI(id: string) {
  return vaultProducts.find((p) => p.id === id)!;
}

const vaultOrders = [
  {
    id: "order-vault-001",
    userId: "buyer-james",
    items: [{ product: pI("vault-p01"), quantity: 1 }],
    total: 585,
    status: "delivered",
    createdAt: "2026-04-08T10:22:00Z",
    shopId: VAULT_SHOP_ID,
    shopName: "The Vault London",
    address: "James H, 7 Sloane Avenue, London, SW3 3DD",
  },
  {
    id: "order-vault-002",
    userId: "buyer-claire",
    items: [
      { product: pI("vault-p04"), quantity: 1 },
      { product: pI("vault-p14"), quantity: 1 },
    ],
    total: 765,
    status: "delivered",
    createdAt: "2026-04-12T15:47:00Z",
    shopId: VAULT_SHOP_ID,
    shopName: "The Vault London",
    address: "Claire W, 23 Westbourne Grove, London, W11 2SE",
  },
  {
    id: "order-vault-003",
    userId: "demo-sophie",
    items: [{ product: pI("vault-p08"), quantity: 1 }],
    total: 395,
    status: "shipped",
    createdAt: "2026-04-28T09:15:00Z",
    shopId: VAULT_SHOP_ID,
    shopName: "The Vault London",
    address: "Sophie Chen, 12 Carnaby Street, London, W1F 9PW",
  },
  {
    id: "order-vault-004",
    userId: "buyer-tom",
    items: [{ product: pI("vault-p10"), quantity: 1 }],
    total: 475,
    status: "shipped",
    createdAt: "2026-04-25T11:03:00Z",
    shopId: VAULT_SHOP_ID,
    shopName: "The Vault London",
    address: "Tom B, 41 Golborne Road, London, W10 5PR",
  },
  {
    id: "order-vault-005",
    userId: "buyer-alice",
    items: [{ product: pI("vault-p03"), quantity: 1 }],
    total: 890,
    status: "label_created",
    createdAt: "2026-05-01T08:55:00Z",
    shopId: VAULT_SHOP_ID,
    shopName: "The Vault London",
    address: "Alice F, 15 Broadway Market, London, E8 4PH",
  },
  {
    id: "order-vault-006",
    userId: "buyer-emma",
    items: [{ product: pI("vault-p07"), quantity: 1 }],
    total: 680,
    status: "label_created",
    createdAt: "2026-05-02T13:31:00Z",
    shopId: VAULT_SHOP_ID,
    shopName: "The Vault London",
    address: "Emma D, 89 Columbia Road, London, E2 7RG",
  },
  {
    id: "order-vault-007",
    userId: "buyer-felix",
    items: [
      { product: pI("vault-p11"), quantity: 1 },
      { product: pI("vault-p13"), quantity: 1 },
    ],
    total: 525,
    status: "created",
    createdAt: "2026-05-05T17:44:00Z",
    shopId: VAULT_SHOP_ID,
    shopName: "The Vault London",
    address: "Felix R, 3 Lamb Street, London, E1 6EA",
  },
  {
    id: "order-vault-008",
    userId: "buyer-grace",
    items: [
      { product: pI("vault-p05"), quantity: 1 },
      { product: pI("vault-p17"), quantity: 1 },
    ],
    total: 440,
    status: "created",
    createdAt: "2026-05-06T09:12:00Z",
    shopId: VAULT_SHOP_ID,
    shopName: "The Vault London",
    address: "Grace L, 56 Portobello Road, London, W11 2DQ",
  },
];

// ─── The Vault London — UserShop ─────────────────────────────────────────────

const vaultUserShop = {
  id: VAULT_SHOP_ID,
  ownerId: "demo-vault",
  name: "The Vault London",
  type: "vintage",
  description:
    "A carefully curated edit of rare vintage from the 1960s through the 1990s. Every piece is sourced from London estate sales, authenticated in-house, and professionally steamed. Specialising in statement outerwear, archive knitwear, and pre-loved luxury accessories.",
  storefrontImage:
    "https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=800&q=80",
  socialHandle: "@thevaultlondon",
  email: "hello@thevaultlondon.com",
  isPhysical: true,
  address: "14 Portobello Road, Notting Hill",
  city: "London",
  products: vaultProducts,
  orders: vaultOrders,
};

// ─── The Vault — conversations + messages ────────────────────────────────────

const vaultConversations = [
  {
    id: "demo-sophie_demo-vault",
    participantIds: ["demo-sophie", "demo-vault"],
    participantNames: ["sophie_chen", "The Vault London"],
    participantTypes: ["user", "shop"],
    shopId: VAULT_SHOP_ID,
    lastMessage: "Can't wait to receive it!",
    lastTimestamp: "2026-04-29T16:45:00Z",
    productId: "vault-p08",
  },
  {
    id: "buyer-james_demo-vault",
    participantIds: ["buyer-james", "demo-vault"],
    participantNames: ["james.h", "The Vault London"],
    participantTypes: ["user", "shop"],
    shopId: VAULT_SHOP_ID,
    lastMessage: "Thank you — going to place an order now!",
    lastTimestamp: "2026-04-30T11:22:00Z",
    productId: "vault-p01",
  },
  {
    id: "buyer-emma_demo-vault",
    participantIds: ["buyer-emma", "demo-vault"],
    participantNames: ["emma.d", "The Vault London"],
    participantTypes: ["user", "shop"],
    shopId: VAULT_SHOP_ID,
    lastMessage: "Would the Mugler suit an hourglass figure?",
    lastTimestamp: "2026-05-02T09:44:00Z",
    productId: "vault-p07",
  },
];

const vaultMessages = [
  // ── Sophie ↔ The Vault ───────────────────────────────────────────────────
  {
    id: "msg-sv-001",
    fromId: "demo-sophie",
    fromName: "sophie_chen",
    toId: "demo-vault",
    conversationId: "demo-sophie_demo-vault",
    content:
      "Hi! I'm interested in the Calvin Klein trench. Is the collar area in good shape?",
    productId: "vault-p08",
    timestamp: "2026-04-27T14:22:00Z",
    senderType: "user",
    receiverType: "shop",
  },
  {
    id: "msg-sv-002",
    fromId: "demo-vault",
    fromName: "The Vault London",
    toId: "demo-sophie",
    conversationId: "demo-sophie_demo-vault",
    content:
      "Hi Sophie! The collar is in great shape — no pilling at all, the lining is clean and the original buttons are all intact. Happy to send more photos?",
    timestamp: "2026-04-27T15:10:00Z",
    senderType: "shop",
    receiverType: "user",
  },
  {
    id: "msg-sv-003",
    fromId: "demo-sophie",
    fromName: "sophie_chen",
    toId: "demo-vault",
    conversationId: "demo-sophie_demo-vault",
    content: "Yes please! And would you take £370 for it?",
    timestamp: "2026-04-27T15:45:00Z",
    senderType: "user",
    receiverType: "shop",
  },
  {
    id: "msg-sv-004",
    fromId: "demo-vault",
    fromName: "The Vault London",
    toId: "demo-sophie",
    conversationId: "demo-sophie_demo-vault",
    content:
      "Best I can do is £380, as it's truly an exceptional piece in this condition. Sending over 3 extra close-up photos now!",
    timestamp: "2026-04-27T16:02:00Z",
    senderType: "shop",
    receiverType: "user",
  },
  {
    id: "msg-sv-005",
    fromId: "demo-sophie",
    fromName: "sophie_chen",
    toId: "demo-vault",
    conversationId: "demo-sophie_demo-vault",
    content: "Sold! Just ordered at full price — can't wait to receive it!",
    timestamp: "2026-04-29T16:45:00Z",
    senderType: "user",
    receiverType: "shop",
  },
  // ── James ↔ The Vault ────────────────────────────────────────────────────
  {
    id: "msg-jv-001",
    fromId: "buyer-james",
    fromName: "james.h",
    toId: "demo-vault",
    conversationId: "buyer-james_demo-vault",
    content:
      "Hi! Is the Ossie Clark dress still available in UK 10? The colour in the photos is stunning.",
    productId: "vault-p01",
    timestamp: "2026-04-29T10:05:00Z",
    senderType: "user",
    receiverType: "shop",
  },
  {
    id: "msg-jv-002",
    fromId: "demo-vault",
    fromName: "The Vault London",
    toId: "buyer-james",
    conversationId: "buyer-james_demo-vault",
    content:
      "It is! Vintage UK 10 runs like a modern UK 8-10. Bust 86cm, waist 70cm. Original label intact, no repairs. Would you like measurement photos?",
    timestamp: "2026-04-29T11:15:00Z",
    senderType: "shop",
    receiverType: "user",
  },
  {
    id: "msg-jv-003",
    fromId: "buyer-james",
    fromName: "james.h",
    toId: "demo-vault",
    conversationId: "buyer-james_demo-vault",
    content: "Please! That would be very helpful.",
    timestamp: "2026-04-29T14:30:00Z",
    senderType: "user",
    receiverType: "shop",
  },
  {
    id: "msg-jv-004",
    fromId: "demo-vault",
    fromName: "The Vault London",
    toId: "buyer-james",
    conversationId: "buyer-james_demo-vault",
    content:
      "Photos sent! It's an extraordinary dress — the crepe holds its drape beautifully after all these years.",
    timestamp: "2026-04-30T09:44:00Z",
    senderType: "shop",
    receiverType: "user",
  },
  {
    id: "msg-jv-005",
    fromId: "buyer-james",
    fromName: "james.h",
    toId: "demo-vault",
    conversationId: "buyer-james_demo-vault",
    content: "Thank you — going to place an order now!",
    timestamp: "2026-04-30T11:22:00Z",
    senderType: "user",
    receiverType: "shop",
  },
  // ── Emma ↔ The Vault ─────────────────────────────────────────────────────
  {
    id: "msg-ev-001",
    fromId: "buyer-emma",
    fromName: "emma.d",
    toId: "demo-vault",
    conversationId: "buyer-emma_demo-vault",
    content:
      "Hi! The Mugler power blazer is incredible. Would it suit an hourglass figure?",
    productId: "vault-p07",
    timestamp: "2026-05-02T09:44:00Z",
    senderType: "user",
    receiverType: "shop",
  },
];

// ─── Sophie's product (prod-031) inline — needed in Sophie's orders ──────────

const prod031 = {
  id: "prod-031",
  shopId: "shop-london-1",
  title: "1960s Biba Shift Dress",
  description:
    "Authentic 1960s Biba shift dress in the brand's signature deep burgundy and black Op-art print. Size 10 vintage. A true collector's piece.",
  price: 645,
  category: "Archive / Rare",
  size: "Vintage UK 10 / S",
  condition: "Excellent",
  era: "1960s",
  imageUrl:
    "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&q=80",
  quantity: 1,
  isVintage: true,
  tags: ["Biba", "archive", "60s", "Op-art"],
};

// ─── Sophie's orders ─────────────────────────────────────────────────────────

const sophieOrders = [
  {
    id: "order-sophie-001",
    userId: "demo-sophie",
    items: [{ product: prod031, quantity: 1 }],
    total: 645,
    status: "delivered",
    createdAt: "2026-04-15T11:30:00Z",
    shopId: "shop-london-1",
    shopName: "Portobello Archive",
    address: "Sophie Chen, 12 Carnaby Street, London, W1F 9PW",
  },
  {
    id: "order-sophie-002",
    userId: "demo-sophie",
    items: [{ product: pI("vault-p08"), quantity: 1 }],
    total: 395,
    status: "shipped",
    createdAt: "2026-04-28T09:15:00Z",
    shopId: VAULT_SHOP_ID,
    shopName: "The Vault London",
    address: "Sophie Chen, 12 Carnaby Street, London, W1F 9PW",
  },
];

// ─── Sophie's conversations + messages ───────────────────────────────────────

const sophieConversations = [
  {
    id: "demo-sophie_demo-vault",
    participantIds: ["demo-sophie", "demo-vault"],
    participantNames: ["sophie_chen", "The Vault London"],
    participantTypes: ["user", "shop"],
    shopId: VAULT_SHOP_ID,
    lastMessage: "Can't wait to receive it!",
    lastTimestamp: "2026-04-29T16:45:00Z",
    productId: "vault-p08",
  },
  {
    id: "demo-sophie_shop-london-1",
    participantIds: ["demo-sophie", "shop-london-1"],
    participantNames: ["sophie_chen", "Portobello Archive"],
    participantTypes: ["user", "shop"],
    shopId: "shop-london-1",
    lastMessage: "Hi! Is the Mod Blazer still available? I'm a UK 10.",
    lastTimestamp: "2026-04-22T10:15:00Z",
    productId: "prod-035",
  },
];

// Sophie's messages include the full Sophie ↔ Vault thread + her Portobello message
const sophieMessages = [
  ...vaultMessages.filter((m) => m.conversationId === "demo-sophie_demo-vault"),
  {
    id: "msg-pa-001",
    fromId: "demo-sophie",
    fromName: "sophie_chen",
    toId: "shop-london-1",
    conversationId: "demo-sophie_shop-london-1",
    content: "Hi! Is the Mod Blazer still available? I'm a UK 10.",
    productId: "prod-035",
    timestamp: "2026-04-22T10:15:00Z",
    senderType: "user",
    receiverType: "shop",
  },
];

// ─── Sophie's review ─────────────────────────────────────────────────────────

const sophieReviews = [
  {
    id: "review-sophie-001",
    shopId: "shop-london-1",
    userId: "demo-sophie",
    userName: "sophie_chen",
    rating: 5,
    body: "Incredible shop — the Biba dress arrived beautifully packaged and exactly as described. Going straight back for more.",
    createdAt: "2026-04-20T14:22:00Z",
    productId: "prod-031",
    productTitle: "1960s Biba Shift Dress",
  },
];

// ─── Sophie's collections ─────────────────────────────────────────────────────

const sophieCollections = [
  {
    id: "col-sophie-001",
    name: "Italian Finds",
    productIds: ["prod-001", "prod-002", "prod-005", "prod-006", "prod-010"],
    createdAt: "2026-04-10T09:00:00Z",
  },
  {
    id: "col-sophie-002",
    name: "London Vintage",
    productIds: ["prod-033", "prod-035", "vault-p05"],
    createdAt: "2026-04-18T16:30:00Z",
  },
];

// ─── Sophie's saved product IDs ───────────────────────────────────────────────

const sophieSaved = [
  "prod-001",
  "prod-002",
  "prod-005",
  "prod-006",
  "prod-010",
  "prod-033",
  "prod-035",
  "prod-036",
  "prod-038",
  "prod-032",
  "vault-p02",
  "vault-p05",
  "vault-p11",
  "vault-p12",
];

// ─── Sophie's style influences ────────────────────────────────────────────────

const sophieInfluences = [
  { userId: "demo-sophie", influenceUserId: "user-aria", level: "heavy" },
  { userId: "demo-sophie", influenceUserId: "user-effie", level: "strong" },
  { userId: "demo-sophie", influenceUserId: "user-mira", level: "medium" },
  { userId: "demo-sophie", influenceUserId: "user-noah", level: "light" },
];

// ─── Sophie's friend conversations ───────────────────────────────────────────

const friendConversations = [
  {
    id: "demo-sophie_user-aria",
    participantIds: ["demo-sophie", "user-aria"],
    participantNames: ["sophie_chen", "aria.s"],
    participantTypes: ["user", "user"],
    lastMessage: "I'm running there Saturday morning, thank you for the tip 🙏",
    lastTimestamp: "2026-05-04T19:22:00Z",
  },
  {
    id: "demo-sophie_user-effie",
    participantIds: ["demo-sophie", "user-effie"],
    participantNames: ["sophie_chen", "effie.k"],
    participantTypes: ["user", "user"],
    lastMessage: "Of course you did 😂 you have to send me photos!",
    lastTimestamp: "2026-05-05T11:30:00Z",
  },
  {
    id: "demo-sophie_user-mira",
    participantIds: ["demo-sophie", "user-mira"],
    participantNames: ["sophie_chen", "mira.t"],
    participantTypes: ["user", "user"],
    lastMessage: "Done! I'll bring them Saturday 😊",
    lastTimestamp: "2026-05-06T14:55:00Z",
  },
];

const friendMessages = [
  // ── Aria ↔ Sophie ──────────────────────────────────────────────────────────
  {
    id: "msg-as-001",
    fromId: "user-aria",
    fromName: "aria.s",
    toId: "demo-sophie",
    conversationId: "demo-sophie_user-aria",
    content:
      "Sophie!! I was at Portobello this morning and spotted the most incredible 70s YSL blouse — it had your name written all over it 👀",
    timestamp: "2026-05-04T10:05:00Z",
    senderType: "user",
    receiverType: "user",
  },
  {
    id: "msg-as-002",
    fromId: "demo-sophie",
    fromName: "sophie_chen",
    toId: "user-aria",
    conversationId: "demo-sophie_user-aria",
    content: "Stop I'm obsessed, did you get it?? Was it still there??",
    timestamp: "2026-05-04T10:41:00Z",
    senderType: "user",
    receiverType: "user",
  },
  {
    id: "msg-as-003",
    fromId: "user-aria",
    fromName: "aria.s",
    toId: "demo-sophie",
    conversationId: "demo-sophie_user-aria",
    content:
      "I got it but they had a very similar one in ivory — the stall said it might still be there Saturday!",
    timestamp: "2026-05-04T18:50:00Z",
    senderType: "user",
    receiverType: "user",
  },
  {
    id: "msg-as-004",
    fromId: "demo-sophie",
    fromName: "sophie_chen",
    toId: "user-aria",
    conversationId: "demo-sophie_user-aria",
    content: "I'm running there Saturday morning, thank you for the tip 🙏",
    timestamp: "2026-05-04T19:22:00Z",
    senderType: "user",
    receiverType: "user",
  },
  // ── Effie ↔ Sophie ─────────────────────────────────────────────────────────
  {
    id: "msg-es-001",
    fromId: "user-effie",
    fromName: "effie.k",
    toId: "demo-sophie",
    conversationId: "demo-sophie_user-effie",
    content:
      "Have you tried layering the CK trench over a silk slip dress? For summer evenings it would be stunning",
    timestamp: "2026-05-05T09:15:00Z",
    senderType: "user",
    receiverType: "user",
  },
  {
    id: "msg-es-002",
    fromId: "demo-sophie",
    fromName: "sophie_chen",
    toId: "user-effie",
    conversationId: "demo-sophie_user-effie",
    content:
      "I tried it last week and couldn't believe how good it looked! You always know 🖤",
    timestamp: "2026-05-05T09:48:00Z",
    senderType: "user",
    receiverType: "user",
  },
  {
    id: "msg-es-003",
    fromId: "user-effie",
    fromName: "effie.k",
    toId: "demo-sophie",
    conversationId: "demo-sophie_user-effie",
    content: "Add some 90s kitten heels and you're done — effortless ✨",
    timestamp: "2026-05-05T10:02:00Z",
    senderType: "user",
    receiverType: "user",
  },
  {
    id: "msg-es-004",
    fromId: "demo-sophie",
    fromName: "sophie_chen",
    toId: "user-effie",
    conversationId: "demo-sophie_user-effie",
    content: "Already ordered a pair from a shop in Milan, arriving next week 😅",
    timestamp: "2026-05-05T11:10:00Z",
    senderType: "user",
    receiverType: "user",
  },
  {
    id: "msg-es-005",
    fromId: "user-effie",
    fromName: "effie.k",
    toId: "demo-sophie",
    conversationId: "demo-sophie_user-effie",
    content: "Of course you did 😂 you have to send me photos!",
    timestamp: "2026-05-05T11:30:00Z",
    senderType: "user",
    receiverType: "user",
  },
  // ── Mira ↔ Sophie ──────────────────────────────────────────────────────────
  {
    id: "msg-ms-001",
    fromId: "user-mira",
    fromName: "mira.t",
    toId: "demo-sophie",
    conversationId: "demo-sophie_user-mira",
    content:
      "Okay I found the most perfect vintage Levi's 501s for you at Spitalfields — 26 waist, that's you right?",
    timestamp: "2026-05-06T12:30:00Z",
    senderType: "user",
    receiverType: "user",
  },
  {
    id: "msg-ms-002",
    fromId: "demo-sophie",
    fromName: "sophie_chen",
    toId: "user-mira",
    conversationId: "demo-sophie_user-mira",
    content: "Yes! 26 is perfect, how much are they??",
    timestamp: "2026-05-06T12:44:00Z",
    senderType: "user",
    receiverType: "user",
  },
  {
    id: "msg-ms-003",
    fromId: "user-mira",
    fromName: "mira.t",
    toId: "demo-sophie",
    conversationId: "demo-sophie_user-mira",
    content:
      "£45 from a stall near the entrance — I can grab them if you want, transfer me?",
    timestamp: "2026-05-06T13:10:00Z",
    senderType: "user",
    receiverType: "user",
  },
  {
    id: "msg-ms-004",
    fromId: "demo-sophie",
    fromName: "sophie_chen",
    toId: "user-mira",
    conversationId: "demo-sophie_user-mira",
    content: "Please!! Transferring now 🙏 you're an actual legend",
    timestamp: "2026-05-06T13:25:00Z",
    senderType: "user",
    receiverType: "user",
  },
  {
    id: "msg-ms-005",
    fromId: "user-mira",
    fromName: "mira.t",
    toId: "demo-sophie",
    conversationId: "demo-sophie_user-mira",
    content: "Done! I'll bring them Saturday 😊",
    timestamp: "2026-05-06T14:55:00Z",
    senderType: "user",
    receiverType: "user",
  },
];

// ─── The Vault — extra buyer conversations ────────────────────────────────────

const extraVaultConversations = [
  {
    id: "buyer-felix_demo-vault",
    participantIds: ["buyer-felix", "demo-vault"],
    participantNames: ["felix.r", "The Vault London"],
    participantTypes: ["user", "shop"],
    shopId: VAULT_SHOP_ID,
    lastMessage:
      "They're wonderful pieces — the Issey Miyake in particular is very special. Enjoy! 🌿",
    lastTimestamp: "2026-05-05T18:30:00Z",
  },
  {
    id: "buyer-grace_demo-vault",
    participantIds: ["buyer-grace", "demo-vault"],
    participantNames: ["grace.l", "The Vault London"],
    participantTypes: ["user", "shop"],
    shopId: VAULT_SHOP_ID,
    lastMessage:
      "Wonderful! The Mugler is truly one of our best pieces — you're going to love it.",
    lastTimestamp: "2026-05-06T09:55:00Z",
  },
];

const extraVaultMessages = [
  // ── Felix ↔ The Vault ─────────────────────────────────────────────────────
  {
    id: "msg-fv-001",
    fromId: "buyer-felix",
    fromName: "felix.r",
    toId: "demo-vault",
    conversationId: "buyer-felix_demo-vault",
    content:
      "Hi! Just placed an order for the Issey Miyake skirt and crochet maxi. Confirming you ship to E1?",
    timestamp: "2026-05-05T17:55:00Z",
    senderType: "user",
    receiverType: "shop",
  },
  {
    id: "msg-fv-002",
    fromId: "demo-vault",
    fromName: "The Vault London",
    toId: "buyer-felix",
    conversationId: "buyer-felix_demo-vault",
    content:
      "Hi Felix! Yes we ship across London and the UK — your order is confirmed and we'll have it packed and dispatched within 1–2 days 🙌",
    timestamp: "2026-05-05T18:10:00Z",
    senderType: "shop",
    receiverType: "user",
  },
  {
    id: "msg-fv-003",
    fromId: "buyer-felix",
    fromName: "felix.r",
    toId: "demo-vault",
    conversationId: "buyer-felix_demo-vault",
    content: "Amazing, thank you! Really excited about both pieces.",
    timestamp: "2026-05-05T18:20:00Z",
    senderType: "user",
    receiverType: "shop",
  },
  {
    id: "msg-fv-004",
    fromId: "demo-vault",
    fromName: "The Vault London",
    toId: "buyer-felix",
    conversationId: "buyer-felix_demo-vault",
    content:
      "They're wonderful pieces — the Issey Miyake in particular is very special. Enjoy! 🌿",
    timestamp: "2026-05-05T18:30:00Z",
    senderType: "shop",
    receiverType: "user",
  },
  // ── Grace ↔ The Vault ─────────────────────────────────────────────────────
  {
    id: "msg-gv-001",
    fromId: "buyer-grace",
    fromName: "grace.l",
    toId: "demo-vault",
    conversationId: "buyer-grace_demo-vault",
    content:
      "Hi! Are the Mary Quant miniskirt and the Mugler power blazer still available? I'd love to order both.",
    productId: "vault-p07",
    timestamp: "2026-05-06T09:12:00Z",
    senderType: "user",
    receiverType: "shop",
  },
  {
    id: "msg-gv-002",
    fromId: "demo-vault",
    fromName: "The Vault London",
    toId: "buyer-grace",
    conversationId: "buyer-grace_demo-vault",
    content:
      "Hi Grace! The Mugler is still here but the Mary Quant just sold — apologies! We do have a gorgeous similar 60s geometric piece coming in next week. Want me to ping you when it's listed?",
    timestamp: "2026-05-06T09:32:00Z",
    senderType: "shop",
    receiverType: "user",
  },
  {
    id: "msg-gv-003",
    fromId: "buyer-grace",
    fromName: "grace.l",
    toId: "demo-vault",
    conversationId: "buyer-grace_demo-vault",
    content: "Yes please! And I'll order the Mugler right now 🙌",
    timestamp: "2026-05-06T09:44:00Z",
    senderType: "user",
    receiverType: "shop",
  },
  {
    id: "msg-gv-004",
    fromId: "demo-vault",
    fromName: "The Vault London",
    toId: "buyer-grace",
    conversationId: "buyer-grace_demo-vault",
    content:
      "Wonderful! The Mugler is truly one of our best pieces — you're going to love it. I'll message as soon as the 60s piece is listed.",
    timestamp: "2026-05-06T09:55:00Z",
    senderType: "shop",
    receiverType: "user",
  },
];

// ─── Export: AsyncStorage pairs ready for multiSet ───────────────────────────

export const SOPHIE_STORAGE_PAIRS: Array<[string, string]> = [
  ["kiki_saved_demo-sophie", JSON.stringify(sophieSaved)],
  ["kiki_collections_demo-sophie", JSON.stringify(sophieCollections)],
  ["kiki_follow_shops_demo-sophie", JSON.stringify([
    "shop-rome-1",
    "shop-rome-2",
    "shop-london-1",
    "shop-london-2",
    "shop-london-7",
    VAULT_SHOP_ID,
  ])],
  ["kiki_follow_users_demo-sophie", JSON.stringify([
    "user-aria",
    "user-effie",
    "user-mira",
    "user-noah",
  ])],
  ["kiki_style_influences_demo-sophie", JSON.stringify(sophieInfluences)],
  ["kiki_cart_demo-sophie", JSON.stringify([])],
  ["kiki_orders_demo-sophie", JSON.stringify(sophieOrders)],
  ["kiki_user_shop_demo-sophie", JSON.stringify(null)],
  ["kiki_conversations_demo-sophie", JSON.stringify([...sophieConversations, ...friendConversations])],
  ["kiki_messages_demo-sophie", JSON.stringify([...sophieMessages, ...friendMessages])],
  ["kiki_reviews_demo-sophie", JSON.stringify(sophieReviews)],
];

export const VAULT_STORAGE_PAIRS: Array<[string, string]> = [
  ["kiki_saved_demo-vault", JSON.stringify([])],
  ["kiki_collections_demo-vault", JSON.stringify([])],
  ["kiki_follow_shops_demo-vault", JSON.stringify([])],
  ["kiki_follow_users_demo-vault", JSON.stringify([])],
  ["kiki_style_influences_demo-vault", JSON.stringify([])],
  ["kiki_cart_demo-vault", JSON.stringify([])],
  ["kiki_orders_demo-vault", JSON.stringify(vaultOrders)],
  ["kiki_user_shop_demo-vault", JSON.stringify(vaultUserShop)],
  ["kiki_conversations_demo-vault", JSON.stringify([...vaultConversations, ...extraVaultConversations])],
  ["kiki_messages_demo-vault", JSON.stringify([...vaultMessages, ...extraVaultMessages])],
  ["kiki_reviews_demo-vault", JSON.stringify([])],
];
