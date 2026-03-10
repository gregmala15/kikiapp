export type ShopType = "independent" | "vintage";
export type City = "Rome" | "London";

export interface Shop {
  id: string;
  name: string;
  type: ShopType;
  city: City;
  description: string;
  storefrontImage: string;
  socialHandle: string;
  email: string;
  followerCount: number;
  tags: string[];
}

export type ProductCategory =
  | "Outerwear"
  | "Tops"
  | "Dresses"
  | "Accessories"
  | "Footwear"
  | "Archive / Rare";

export type ProductCondition =
  | "New with tags"
  | "Excellent"
  | "Very Good"
  | "Good"
  | "Fair";

export interface Product {
  id: string;
  shopId: string;
  title: string;
  description: string;
  price: number;
  category: ProductCategory;
  size: string;
  condition: ProductCondition;
  era: string;
  imageUrl: string;
  quantity: number;
  isSold?: boolean;
  isVintage?: boolean;
  tags?: string[];
}

export const SEED_SHOPS: Shop[] = [
  // Rome shops
  {
    id: "shop-rome-1",
    name: "Mercato Antico",
    type: "vintage",
    city: "Rome",
    description:
      "A curated selection of Italian vintage treasures, from 1960s Florentine silk scarves to 90s Roman streetwear. Every piece tells a story of la dolce vita.",
    storefrontImage:
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
    socialHandle: "@mercatoantico",
    email: "mercatoantico@rome.it",
    followerCount: 2847,
    tags: ["vintage", "Italian", "silk", "60s", "90s"],
  },
  {
    id: "shop-rome-2",
    name: "Studio Rossi",
    type: "independent",
    city: "Rome",
    description:
      "Contemporary Italian fashion from designer Chiara Rossi. Minimal silhouettes, exceptional fabrics sourced directly from Como mills.",
    storefrontImage:
      "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80",
    socialHandle: "@studiorossi",
    email: "info@studiorossi.it",
    followerCount: 4213,
    tags: ["contemporary", "Italian", "minimal", "Como"],
  },
  {
    id: "shop-rome-3",
    name: "Via Condotti Archive",
    type: "vintage",
    city: "Rome",
    description:
      "Archive pieces from Rome's most iconic street. Deadstock Italian labels, pre-owned luxury, and rare finds from the golden age of Italian fashion.",
    storefrontImage:
      "https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=800&q=80",
    socialHandle: "@viacondottiarchive",
    email: "archive@viacondotti.com",
    followerCount: 1923,
    tags: ["archive", "luxury", "deadstock", "Italian labels"],
  },
  {
    id: "shop-rome-4",
    name: "Trastevere Threads",
    type: "vintage",
    city: "Rome",
    description:
      "Hidden in the cobblestone alleys of Trastevere, this shop is a labyrinth of curated vintage from 1950s–1990s Italy. A neighbourhood institution.",
    storefrontImage:
      "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800&q=80",
    socialHandle: "@trasteverethreads",
    email: "hello@trasteverethreads.com",
    followerCount: 987,
    tags: ["vintage", "50s", "60s", "70s", "Trastevere"],
  },
  {
    id: "shop-rome-5",
    name: "Pietra Dura",
    type: "independent",
    city: "Rome",
    description:
      "Handcrafted leather accessories made in a small Roman workshop. Each bag, belt, and wallet is hand-stitched using traditional techniques.",
    storefrontImage:
      "https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=800&q=80",
    socialHandle: "@pietraduraroma",
    email: "info@pietradura.it",
    followerCount: 3102,
    tags: ["leather", "handcrafted", "accessories", "artisan"],
  },
  {
    id: "shop-rome-6",
    name: "Colosseo Vintage",
    type: "vintage",
    city: "Rome",
    description:
      "Specialising in Italian sportswear and casual wear from the 1980s and 90s. Tracksuits, logo tees, and rare Italian athletics pieces.",
    storefrontImage:
      "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=800&q=80",
    socialHandle: "@colosseo_vintage",
    email: "colosseo@vintage.it",
    followerCount: 1544,
    tags: ["sportswear", "80s", "90s", "Italian athletics"],
  },
  {
    id: "shop-rome-7",
    name: "Luce Atelier",
    type: "independent",
    city: "Rome",
    description:
      "Elevated ready-to-wear for the modern Roman woman. Draping, texture, and quiet luxury define every collection from this small independent label.",
    storefrontImage:
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&q=80",
    socialHandle: "@luceatelier",
    email: "luce@atelier.com",
    followerCount: 5672,
    tags: ["ready-to-wear", "luxury", "draping", "contemporary"],
  },
  {
    id: "shop-rome-8",
    name: "Porta Portese Finds",
    type: "vintage",
    city: "Rome",
    description:
      "Online presence of Rome's legendary Sunday flea market. Eclectic vintage from every decade, always with fresh arrivals every week.",
    storefrontImage:
      "https://images.unsplash.com/photo-1445205170230-053b83016050?w=800&q=80",
    socialHandle: "@portaportese",
    email: "shop@portaportese.com",
    followerCount: 7831,
    tags: ["flea market", "eclectic", "all decades", "fresh arrivals"],
  },

  // London shops
  {
    id: "shop-london-1",
    name: "Portobello Archive",
    type: "vintage",
    city: "London",
    description:
      "The finest curated vintage from London's world-famous Portobello Road. Specialising in 1960s and 70s British fashion, mod pieces, and psychedelic prints.",
    storefrontImage:
      "https://images.unsplash.com/photo-1524863479829-916d8e77f114?w=800&q=80",
    socialHandle: "@portobelloarchive",
    email: "portobello@archive.co.uk",
    followerCount: 6243,
    tags: ["60s", "70s", "mod", "British", "psychedelic"],
  },
  {
    id: "shop-london-2",
    name: "East End Collective",
    type: "independent",
    city: "London",
    description:
      "Shoreditch-based independent brand championing East London designers. Bold graphics, oversized fits, and limited-run drops that sell out fast.",
    storefrontImage:
      "https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=800&q=80",
    socialHandle: "@eastendcollective",
    email: "drops@eastendcollective.co.uk",
    followerCount: 8921,
    tags: ["streetwear", "East London", "limited drops", "bold graphics"],
  },
  {
    id: "shop-london-3",
    name: "Brick Lane Wardrobe",
    type: "vintage",
    city: "London",
    description:
      "A cultural melting pot of vintage fashion in the heart of Brick Lane. South Asian textiles, 90s British streetwear, and global vintage blend here.",
    storefrontImage:
      "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&q=80",
    socialHandle: "@bricklanewrdrb",
    email: "hello@bricklanewardrobe.com",
    followerCount: 3817,
    tags: ["multicultural", "90s", "textiles", "streetwear", "global"],
  },
  {
    id: "shop-london-4",
    name: "Chelsea Girl",
    type: "vintage",
    city: "London",
    description:
      "Celebrating the legacy of Swinging London with carefully sourced dresses, coats, and accessories from the 1960s and 70s. For the modern Chelsea girl.",
    storefrontImage:
      "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=800&q=80",
    socialHandle: "@chelseagirlvtg",
    email: "info@chelseagirlvintage.co.uk",
    followerCount: 4109,
    tags: ["60s", "70s", "Swinging London", "dresses", "coats"],
  },
  {
    id: "shop-london-5",
    name: "Hackney Hands",
    type: "independent",
    city: "London",
    description:
      "Handmade knitwear and slow fashion from a small studio in Hackney. Each piece is hand-knitted or woven by local artisans. Made to last a lifetime.",
    storefrontImage:
      "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=800&q=80",
    socialHandle: "@hackneyhands",
    email: "studio@hackneyhands.co.uk",
    followerCount: 2331,
    tags: ["knitwear", "handmade", "slow fashion", "artisan"],
  },
  {
    id: "shop-london-6",
    name: "Camden Cult",
    type: "vintage",
    city: "London",
    description:
      "The spirit of Camden Market distilled into a curated edit. Punk, goth, grunge and everything in between — from original 80s pieces to 2000s Y2K.",
    storefrontImage:
      "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=800&q=80",
    socialHandle: "@camdencult",
    email: "camdencult@market.com",
    followerCount: 5588,
    tags: ["punk", "goth", "grunge", "80s", "Y2K"],
  },
  {
    id: "shop-london-7",
    name: "Notting Hill Edit",
    type: "independent",
    city: "London",
    description:
      "A refined edit of new and pre-loved luxury from the Notting Hill neighbourhood. Think quiet luxury, timeless investment pieces, and understated elegance.",
    storefrontImage:
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=80",
    socialHandle: "@nottinghilledit",
    email: "hello@nottinghilledit.co.uk",
    followerCount: 9134,
    tags: ["luxury", "timeless", "investment pieces", "Notting Hill"],
  },
  {
    id: "shop-london-8",
    name: "Dalston Dreams",
    type: "vintage",
    city: "London",
    description:
      "Where Dalston's creative energy meets vintage fashion. Eclectic, irreverent, and always interesting — a treasure trove of 70s–90s rarities.",
    storefrontImage:
      "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&q=80",
    socialHandle: "@dalstondreams",
    email: "dreams@dalston.co.uk",
    followerCount: 4456,
    tags: ["70s", "80s", "90s", "eclectic", "rarities"],
  },
];

export const SEED_PRODUCTS: Product[] = [
  // Mercato Antico (Rome vintage)
  {
    id: "prod-001",
    shopId: "shop-rome-1",
    title: "1960s Florentine Silk Scarf",
    description:
      "Exquisite hand-printed silk scarf from Florence, circa 1965. Features a botanical print in terracotta and sage on a cream ground. Perfect condition.",
    price: 145,
    category: "Accessories",
    size: "One Size",
    condition: "Excellent",
    era: "1960s",
    imageUrl:
      "https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=800&q=80",
    quantity: 1,
    isVintage: true,
    tags: ["silk", "scarf", "Florentine", "botanical"],
  },
  {
    id: "prod-002",
    shopId: "shop-rome-1",
    title: "90s Versace Medusa Logo Tee",
    description:
      "Genuine 1990s Versace logo tee in navy with gold Medusa graphic. Size M. Light vintage wash, no damage. A rare piece of Italian fashion history.",
    price: 320,
    category: "Tops",
    size: "M",
    condition: "Very Good",
    era: "1990s",
    imageUrl:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80",
    quantity: 1,
    isVintage: true,
    tags: ["Versace", "logo", "90s", "Italian"],
  },
  {
    id: "prod-003",
    shopId: "shop-rome-1",
    title: "1970s Leather Trench Coat",
    description:
      "Butter-soft cognac leather trench coat from 1970s Rome. Fully lined, double-breasted, belted. Size 40 IT (approx UK 12 / US 8). A true investment piece.",
    price: 485,
    category: "Outerwear",
    size: "IT 40 / M",
    condition: "Very Good",
    era: "1970s",
    imageUrl:
      "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&q=80",
    quantity: 1,
    isVintage: true,
    tags: ["leather", "trench", "70s", "cognac"],
  },
  {
    id: "prod-004",
    shopId: "shop-rome-1",
    title: "1980s Valentino Beaded Clutch",
    description:
      "Black beaded evening clutch from Valentino Roma, 1980s. Gold tone frame clasp, interior mirror. Some minor bead wear consistent with age. Iconic.",
    price: 260,
    category: "Accessories",
    size: "One Size",
    condition: "Good",
    era: "1980s",
    imageUrl:
      "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&q=80",
    quantity: 1,
    isVintage: true,
    tags: ["Valentino", "clutch", "beaded", "evening"],
  },
  {
    id: "prod-005",
    shopId: "shop-rome-1",
    title: "1960s Mod Mini Dress",
    description:
      "Geometric black and white mod mini dress in a wool-blend fabric. 1960s Italian, size S-M. Bold graphic pattern, side zip closure. Very wearable.",
    price: 195,
    category: "Dresses",
    size: "S-M",
    condition: "Excellent",
    era: "1960s",
    imageUrl:
      "https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=800&q=80",
    quantity: 1,
    isVintage: true,
    tags: ["mod", "60s", "geometric", "mini dress"],
  },

  // Studio Rossi (Rome independent)
  {
    id: "prod-006",
    shopId: "shop-rome-2",
    title: "Como Silk Slip Dress",
    description:
      "Pure silk slip dress cut from Como mill silk. Ivory with delicate lace trim. Available in XS–L. Wear alone or layered. A Chiara Rossi signature.",
    price: 385,
    category: "Dresses",
    size: "S",
    condition: "New with tags",
    era: "Contemporary",
    imageUrl:
      "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=800&q=80",
    quantity: 4,
    tags: ["silk", "slip dress", "Como", "ivory"],
  },
  {
    id: "prod-007",
    shopId: "shop-rome-2",
    title: "Cashmere Turtleneck",
    description:
      "Superfine 100% Mongolian cashmere turtleneck in ecru. Relaxed fit. A wardrobe essential from our current collection.",
    price: 295,
    category: "Tops",
    size: "M",
    condition: "New with tags",
    era: "Contemporary",
    imageUrl:
      "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=800&q=80",
    quantity: 6,
    tags: ["cashmere", "turtleneck", "ecru", "luxury basics"],
  },
  {
    id: "prod-008",
    shopId: "shop-rome-2",
    title: "Structured Linen Blazer",
    description:
      "Unlined Italian linen blazer in warm sand. Relaxed cut, notched lapels. Perfect for Roman summers. Single-breasted, two-button.",
    price: 445,
    category: "Outerwear",
    size: "L",
    condition: "New with tags",
    era: "Contemporary",
    imageUrl:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80",
    quantity: 3,
    tags: ["linen", "blazer", "sand", "Italian"],
  },
  {
    id: "prod-009",
    shopId: "shop-rome-2",
    title: "Leather Mule Sandals",
    description:
      "Hand-crafted vegetable-tanned leather mules in tan. Made in Rome. Block heel. Sizes 36–41 available.",
    price: 265,
    category: "Footwear",
    size: "EU 38",
    condition: "New with tags",
    era: "Contemporary",
    imageUrl:
      "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=800&q=80",
    quantity: 8,
    tags: ["leather", "mules", "handcrafted", "Roman"],
  },

  // Via Condotti Archive (Rome vintage)
  {
    id: "prod-010",
    shopId: "shop-rome-3",
    title: "Gucci Bamboo Handle Bag",
    description:
      "Authentic 1990s Gucci bamboo handle bag in black patent leather. Hardware in gold tone. Minor wear to patent consistent with age. Full authenticity verified.",
    price: 1250,
    category: "Accessories",
    size: "One Size",
    condition: "Very Good",
    era: "1990s",
    imageUrl:
      "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&q=80",
    quantity: 1,
    isVintage: true,
    tags: ["Gucci", "bamboo", "archive", "luxury"],
  },
  {
    id: "prod-011",
    shopId: "shop-rome-3",
    title: "1980s Fendi Zucca Silk Scarf",
    description:
      "Large-format Fendi FF/Zucca print silk scarf from the 1980s. In warm browns and cream. 90 x 90cm. Dry cleaned and pristine.",
    price: 380,
    category: "Accessories",
    size: "One Size",
    condition: "Excellent",
    era: "1980s",
    imageUrl:
      "https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=800&q=80",
    quantity: 1,
    isVintage: true,
    tags: ["Fendi", "silk", "scarf", "Zucca"],
  },
  {
    id: "prod-012",
    shopId: "shop-rome-3",
    title: "1970s Pucci Palazzo Pants",
    description:
      "Emilio Pucci psychedelic print palazzo pants in polyester. 1970s. Swirling purple, teal and coral on white. Italian size 42. Wild and wonderful.",
    price: 520,
    category: "Archive / Rare",
    size: "IT 42 / M",
    condition: "Very Good",
    era: "1970s",
    imageUrl:
      "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&q=80",
    quantity: 1,
    isVintage: true,
    tags: ["Pucci", "archive", "palazzo pants", "70s"],
  },
  {
    id: "prod-013",
    shopId: "shop-rome-3",
    title: "Deadstock 1990s Benetton Knitwear",
    description:
      "Unworn deadstock Benetton sweater from the 1990s, still in original bag with tags. Colourful horizontal stripe in the classic Benetton palette. Size M.",
    price: 185,
    category: "Tops",
    size: "M",
    condition: "New with tags",
    era: "1990s",
    imageUrl:
      "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800&q=80",
    quantity: 1,
    isVintage: true,
    tags: ["Benetton", "deadstock", "90s", "knitwear"],
  },

  // Trastevere Threads (Rome vintage)
  {
    id: "prod-014",
    shopId: "shop-rome-4",
    title: "1950s Pleated Midi Skirt",
    description:
      "New-look style pleated midi skirt in a warm caramel cotton. 1950s Italian, fully lined, side zip. Waist 27 inches. A dream of a skirt.",
    price: 165,
    category: "Dresses",
    size: "XS-S",
    condition: "Excellent",
    era: "1950s",
    imageUrl:
      "https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=800&q=80",
    quantity: 1,
    isVintage: true,
    tags: ["50s", "pleated", "midi", "skirt"],
  },
  {
    id: "prod-015",
    shopId: "shop-rome-4",
    title: "1970s Crochet Top",
    description:
      "Open-weave cream crochet top with flared sleeves. 1970s Italian. Stretchy. Size approx S/M. Excellent boho energy.",
    price: 95,
    category: "Tops",
    size: "S/M",
    condition: "Very Good",
    era: "1970s",
    imageUrl:
      "https://images.unsplash.com/photo-1562572159-4efc207f5aff?w=800&q=80",
    quantity: 1,
    isVintage: true,
    tags: ["crochet", "70s", "boho", "cream"],
  },
  {
    id: "prod-016",
    shopId: "shop-rome-4",
    title: "1960s Italian Loafers",
    description:
      "Classic Italian leather penny loafers from the 1960s. Dark chocolate brown. EU 40. Small scuffs on heels, otherwise excellent.",
    price: 125,
    category: "Footwear",
    size: "EU 40",
    condition: "Good",
    era: "1960s",
    imageUrl:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80",
    quantity: 1,
    isVintage: true,
    tags: ["loafers", "60s", "Italian leather", "brown"],
  },
  {
    id: "prod-017",
    shopId: "shop-rome-4",
    title: "1980s Oversized Blazer",
    description:
      "Oversized power-shoulder blazer in grey plaid. 1980s Italian, padded shoulders, two-button. Size 42 IT. The ultimate throwback power piece.",
    price: 145,
    category: "Outerwear",
    size: "IT 42 / L",
    condition: "Very Good",
    era: "1980s",
    imageUrl:
      "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&q=80",
    quantity: 1,
    isVintage: true,
    tags: ["blazer", "80s", "power shoulder", "plaid"],
  },

  // Pietra Dura (Rome independent - leather goods)
  {
    id: "prod-018",
    shopId: "shop-rome-5",
    title: "Hand-Stitched Leather Tote",
    description:
      "Large tan vegetable-tanned leather tote. Hand-stitched with natural linen thread. Internal zip pocket. Made to order in Rome.",
    price: 520,
    category: "Accessories",
    size: "One Size",
    condition: "New with tags",
    era: "Contemporary",
    imageUrl:
      "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&q=80",
    quantity: 5,
    tags: ["leather", "tote", "handmade", "vegetable-tanned"],
  },
  {
    id: "prod-019",
    shopId: "shop-rome-5",
    title: "Woven Leather Belt",
    description:
      "Hand-woven cognac leather belt with brass buckle. 3cm wide. Available in waist sizes 70–95cm. Ages beautifully.",
    price: 145,
    category: "Accessories",
    size: "80cm",
    condition: "New with tags",
    era: "Contemporary",
    imageUrl:
      "https://images.unsplash.com/photo-1607522370275-f6bca8773bd2?w=800&q=80",
    quantity: 10,
    tags: ["belt", "leather", "woven", "cognac"],
  },
  {
    id: "prod-020",
    shopId: "shop-rome-5",
    title: "Leather Card Wallet",
    description:
      "Slim bifold card wallet in dark green full-grain leather. Fits 6 cards and cash. Hand-stitched edges.",
    price: 95,
    category: "Accessories",
    size: "One Size",
    condition: "New with tags",
    era: "Contemporary",
    imageUrl:
      "https://images.unsplash.com/photo-1627123424574-724758594e93?w=800&q=80",
    quantity: 15,
    tags: ["wallet", "leather", "green", "slim"],
  },

  // Colosseo Vintage (Rome sportswear)
  {
    id: "prod-021",
    shopId: "shop-rome-6",
    title: "1990s Fila Tracksuit",
    description:
      "Original 1990s Fila two-piece tracksuit in navy and white. Chest logo and side stripe. Jacket and trousers. Size L. Incredibly clean for its age.",
    price: 225,
    category: "Outerwear",
    size: "L",
    condition: "Excellent",
    era: "1990s",
    imageUrl:
      "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800&q=80",
    quantity: 1,
    isVintage: true,
    tags: ["Fila", "tracksuit", "90s", "sportswear"],
  },
  {
    id: "prod-022",
    shopId: "shop-rome-6",
    title: "1980s Ellesse Tennis Polo",
    description:
      "Classic 1980s Ellesse tennis polo in white with red and navy stripe. Size M. Perfect vintage tennis vibes.",
    price: 85,
    category: "Tops",
    size: "M",
    condition: "Very Good",
    era: "1980s",
    imageUrl:
      "https://images.unsplash.com/photo-1583744946564-b52ac1c389c8?w=800&q=80",
    quantity: 1,
    isVintage: true,
    tags: ["Ellesse", "polo", "tennis", "80s"],
  },
  {
    id: "prod-023",
    shopId: "shop-rome-6",
    title: "1990s Nike Air Max 95",
    description:
      "OG 1990s Nike Air Max 95 in black/white/red. Size EU 43. Some sole yellowing and minor creasing. Collector's grail.",
    price: 395,
    category: "Footwear",
    size: "EU 43",
    condition: "Good",
    era: "1990s",
    imageUrl:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80",
    quantity: 1,
    isVintage: true,
    tags: ["Nike", "Air Max", "90s", "sneakers"],
  },

  // Luce Atelier (Rome independent contemporary)
  {
    id: "prod-024",
    shopId: "shop-rome-7",
    title: "Draped Jersey Column Dress",
    description:
      "Floor-length draped jersey column dress in deep ivory. Asymmetric neckline, fluid fit. A Luce signature silhouette.",
    price: 565,
    category: "Dresses",
    size: "S",
    condition: "New with tags",
    era: "Contemporary",
    imageUrl:
      "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=800&q=80",
    quantity: 3,
    tags: ["draped", "jersey", "column dress", "ivory"],
  },
  {
    id: "prod-025",
    shopId: "shop-rome-7",
    title: "Open-Back Silk Blouse",
    description:
      "Ivory silk crepe blouse with deep open back and self-tie. Front tuck. A piece for after-dark or elevated daywear.",
    price: 345,
    category: "Tops",
    size: "M",
    condition: "New with tags",
    era: "Contemporary",
    imageUrl:
      "https://images.unsplash.com/photo-1562572159-4efc207f5aff?w=800&q=80",
    quantity: 4,
    tags: ["silk", "blouse", "open back", "ivory"],
  },
  {
    id: "prod-026",
    shopId: "shop-rome-7",
    title: "Camel Wool Wrap Coat",
    description:
      "Double-faced camel wool wrap coat with self-tie belt. Clean, minimal cut. This coat is forever.",
    price: 895,
    category: "Outerwear",
    size: "M/L",
    condition: "New with tags",
    era: "Contemporary",
    imageUrl:
      "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&q=80",
    quantity: 2,
    tags: ["camel", "wool", "wrap coat", "minimal"],
  },

  // Porta Portese Finds (Rome eclectic vintage)
  {
    id: "prod-027",
    shopId: "shop-rome-8",
    title: "1970s Patchwork Denim Jacket",
    description:
      "Wild 1970s patchwork denim jacket featuring panels of different washes, embroidery and a corduroy collar. Size M. One of a kind.",
    price: 175,
    category: "Outerwear",
    size: "M",
    condition: "Good",
    era: "1970s",
    imageUrl:
      "https://images.unsplash.com/photo-1516257984-b1b4d707412e?w=800&q=80",
    quantity: 1,
    isVintage: true,
    tags: ["patchwork", "denim", "70s", "embroidery"],
  },
  {
    id: "prod-028",
    shopId: "shop-rome-8",
    title: "1950s Borsalino Hat",
    description:
      "Genuine Borsalino felt fedora from the 1950s in dark charcoal. Satin lining, hatband with original ribbon. Hat size 57. A true classic.",
    price: 240,
    category: "Accessories",
    size: "57",
    condition: "Very Good",
    era: "1950s",
    imageUrl:
      "https://images.unsplash.com/photo-1521369909029-2afed882baee?w=800&q=80",
    quantity: 1,
    isVintage: true,
    tags: ["Borsalino", "fedora", "hat", "50s"],
  },
  {
    id: "prod-029",
    shopId: "shop-rome-8",
    title: "Mixed Prints Blouse",
    description:
      "Incredible 1980s mixed prints blouse in silky polyester. Clashing florals in lilac, green and orange. Size S. Peak camp.",
    price: 65,
    category: "Tops",
    size: "S",
    condition: "Very Good",
    era: "1980s",
    imageUrl:
      "https://images.unsplash.com/photo-1614676471928-2ed0ad1061a4?w=800&q=80",
    quantity: 1,
    isVintage: true,
    tags: ["mixed print", "80s", "blouse", "camp"],
  },
  {
    id: "prod-030",
    shopId: "shop-rome-8",
    title: "1990s Platform Boots",
    description:
      "Massive 1990s platform lace-up boots in black faux leather. Platform height approx 8cm. EU 38. Gothic glam.",
    price: 145,
    category: "Footwear",
    size: "EU 38",
    condition: "Good",
    era: "1990s",
    imageUrl:
      "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=800&q=80",
    quantity: 1,
    isVintage: true,
    tags: ["platform", "boots", "90s", "gothic"],
  },

  // Portobello Archive (London 60s-70s)
  {
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
      "https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=800&q=80",
    quantity: 1,
    isVintage: true,
    tags: ["Biba", "archive", "60s", "Op-art"],
  },
  {
    id: "prod-032",
    shopId: "shop-london-1",
    title: "1970s Afghan Coat",
    description:
      "Iconic 1970s sheepskin Afghan coat with embroidered panels and fringe trim. Warm and wonderful. Size approx M-L.",
    price: 295,
    category: "Outerwear",
    size: "M-L",
    condition: "Good",
    era: "1970s",
    imageUrl:
      "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&q=80",
    quantity: 1,
    isVintage: true,
    tags: ["Afghan coat", "70s", "sheepskin", "fringe"],
  },
  {
    id: "prod-033",
    shopId: "shop-london-1",
    title: "Psychedelic Mini Dress",
    description:
      "1960s swirling psychedelic print mini dress in blue, orange, and yellow on white. Cotton-blend. UK 10. Party ready.",
    price: 185,
    category: "Dresses",
    size: "UK 10 / S-M",
    condition: "Very Good",
    era: "1960s",
    imageUrl:
      "https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=800&q=80",
    quantity: 1,
    isVintage: true,
    tags: ["psychedelic", "60s", "mini dress", "Carnaby"],
  },
  {
    id: "prod-034",
    shopId: "shop-london-1",
    title: "1970s Platform Chelsea Boots",
    description:
      "Original 1970s platform Chelsea boots in tan suede. Platform height 5cm. UK 6 / EU 39. Minor wear on heels.",
    price: 175,
    category: "Footwear",
    size: "UK 6 / EU 39",
    condition: "Very Good",
    era: "1970s",
    imageUrl:
      "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=800&q=80",
    quantity: 1,
    isVintage: true,
    tags: ["Chelsea boots", "platform", "70s", "suede"],
  },
  {
    id: "prod-035",
    shopId: "shop-london-1",
    title: "1960s Mod Blazer",
    description:
      "Slim-cut mod blazer in a black and white houndstooth check. 1960s British, single-breasted, narrow lapels. Size UK 10.",
    price: 215,
    category: "Outerwear",
    size: "UK 10 / S",
    condition: "Excellent",
    era: "1960s",
    imageUrl:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80",
    quantity: 1,
    isVintage: true,
    tags: ["mod", "blazer", "60s", "houndstooth"],
  },

  // East End Collective (London indie streetwear)
  {
    id: "prod-036",
    shopId: "shop-london-2",
    title: "Oversized Graphic Hoodie",
    description:
      "Heavy-weight cotton hoodie with East End Collective exclusive East London skyline graphic. Faded black, dropped shoulders. Unisex sizing.",
    price: 165,
    category: "Tops",
    size: "L/XL",
    condition: "New with tags",
    era: "Contemporary",
    imageUrl:
      "https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=800&q=80",
    quantity: 20,
    tags: ["hoodie", "graphic", "streetwear", "East London"],
  },
  {
    id: "prod-037",
    shopId: "shop-london-2",
    title: "Deadstock Denim Trousers",
    description:
      "Limited-run wide-leg denim trousers in unwashed indigo. Low rise, flared hem. Made from deadstock Cone Mills denim. Incredibly limited.",
    price: 195,
    category: "Archive / Rare",
    size: "W30 L32",
    condition: "New with tags",
    era: "Contemporary",
    imageUrl:
      "https://images.unsplash.com/photo-1551854838-212c9e876c88?w=800&q=80",
    quantity: 3,
    tags: ["denim", "wide-leg", "deadstock", "indigo"],
  },
  {
    id: "prod-038",
    shopId: "shop-london-2",
    title: "Bold Stripe Rugby Shirt",
    description:
      "Heavy cotton rugby shirt in cobalt blue and white bold stripe. Ribbed collar, chest pocket, traditional placket. Oversized fit. Drop 2.",
    price: 120,
    category: "Tops",
    size: "M",
    condition: "New with tags",
    era: "Contemporary",
    imageUrl:
      "https://images.unsplash.com/photo-1583744946564-b52ac1c389c8?w=800&q=80",
    quantity: 12,
    tags: ["rugby shirt", "stripe", "oversized", "cobalt"],
  },

  // Brick Lane Wardrobe (London multicultural vintage)
  {
    id: "prod-039",
    shopId: "shop-london-3",
    title: "1990s Kente Print Jacket",
    description:
      "Incredible 1990s jacket made from authentic Ghanaian Kente cloth panels. UK size 12. Full lining, padded shoulders. Genuinely one of a kind.",
    price: 285,
    category: "Outerwear",
    size: "UK 12 / M",
    condition: "Very Good",
    era: "1990s",
    imageUrl:
      "https://images.unsplash.com/photo-1516257984-b1b4d707412e?w=800&q=80",
    quantity: 1,
    isVintage: true,
    tags: ["Kente", "90s", "African print", "unique"],
  },
  {
    id: "prod-040",
    shopId: "shop-london-3",
    title: "1980s Shell Suit Jacket",
    description:
      "Peak 1980s shell suit top in neon orange and electric blue. Zip-front, elasticated cuffs and hem. Size M. Camp, wonderful, irreplaceable.",
    price: 95,
    category: "Outerwear",
    size: "M",
    condition: "Very Good",
    era: "1980s",
    imageUrl:
      "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800&q=80",
    quantity: 1,
    isVintage: true,
    tags: ["shell suit", "80s", "neon", "sports"],
  },
  {
    id: "prod-041",
    shopId: "shop-london-3",
    title: "Embroidered Silk Sari Blouse",
    description:
      "Hand-embroidered silk sari blouse in gold and emerald green. Cropped, short-sleeved, hook-and-eye closure. Could be 1970s or 1980s. Size XS-S.",
    price: 125,
    category: "Tops",
    size: "XS-S",
    condition: "Very Good",
    era: "1970s-80s",
    imageUrl:
      "https://images.unsplash.com/photo-1614676471928-2ed0ad1061a4?w=800&q=80",
    quantity: 1,
    isVintage: true,
    tags: ["embroidered", "silk", "sari", "gold"],
  },
  {
    id: "prod-042",
    shopId: "shop-london-3",
    title: "1990s Tommy Hilfiger Windbreaker",
    description:
      "Genuine 1990s Tommy Hilfiger logo windbreaker in red, white and navy. Full zip, chest logo. Size M. A 90s archival staple.",
    price: 175,
    category: "Outerwear",
    size: "M",
    condition: "Excellent",
    era: "1990s",
    imageUrl:
      "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=800&q=80",
    quantity: 1,
    isVintage: true,
    tags: ["Tommy Hilfiger", "windbreaker", "90s", "logo"],
  },

  // Chelsea Girl (London 60s-70s womenswear)
  {
    id: "prod-043",
    shopId: "shop-london-4",
    title: "1960s Boucle Shift Dress",
    description:
      "Pastel pink boucle wool shift dress. Beautifully constructed, UK 10. This is Swinging London at its most refined.",
    price: 295,
    category: "Dresses",
    size: "UK 10 / S-M",
    condition: "Very Good",
    era: "1960s",
    imageUrl:
      "https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=800&q=80",
    quantity: 1,
    isVintage: true,
    tags: ["boucle", "shift dress", "60s", "pastel"],
  },
  {
    id: "prod-044",
    shopId: "shop-london-4",
    title: "1970s Maxi Floral Dress",
    description:
      "Flowing 1970s maxi dress in a large-scale floral print of pinks and oranges on cream. Liberty-style print. UK 12. Fully lined, side zip.",
    price: 225,
    category: "Dresses",
    size: "UK 12 / M",
    condition: "Excellent",
    era: "1970s",
    imageUrl:
      "https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=800&q=80",
    quantity: 1,
    isVintage: true,
    tags: ["maxi dress", "floral", "70s", "Liberty print"],
  },
  {
    id: "prod-045",
    shopId: "shop-london-4",
    title: "1960s Mary Quant Vinyl Coat",
    description:
      "Rare original Mary Quant double-breasted vinyl (PVC) coat in pillar box red. Large buttons. UK 10. Provenance verified. Museum-quality piece.",
    price: 1800,
    category: "Archive / Rare",
    size: "UK 10 / S",
    condition: "Excellent",
    era: "1960s",
    imageUrl:
      "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&q=80",
    quantity: 1,
    isVintage: true,
    tags: ["Mary Quant", "archive", "60s", "vinyl"],
  },
  {
    id: "prod-046",
    shopId: "shop-london-4",
    title: "1970s Suede Knee Boots",
    description:
      "Caramel suede knee-high boots with stacked wooden heel. 1970s. UK 5 / EU 38. Minor wear to suede, heels intact.",
    price: 195,
    category: "Footwear",
    size: "UK 5 / EU 38",
    condition: "Good",
    era: "1970s",
    imageUrl:
      "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=800&q=80",
    quantity: 1,
    isVintage: true,
    tags: ["knee boots", "suede", "70s", "caramel"],
  },

  // Hackney Hands (London artisan knitwear)
  {
    id: "prod-047",
    shopId: "shop-london-5",
    title: "Hand-Knit Merino Oversized Jumper",
    description:
      "Hand-knit 100% merino wool jumper in oatmeal. Oversized, wide-neck, ribbed cuffs and hem. Each piece takes 3 weeks to make.",
    price: 395,
    category: "Tops",
    size: "One Size (Oversized)",
    condition: "New with tags",
    era: "Contemporary",
    imageUrl:
      "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=800&q=80",
    quantity: 4,
    tags: ["knit", "merino", "oatmeal", "handmade"],
  },
  {
    id: "prod-048",
    shopId: "shop-london-5",
    title: "Woven Linen Scarf",
    description:
      "Hand-woven natural linen scarf in a textured plain weave. 200 x 70cm. Oversized and incredibly versatile. Natural undyed linen.",
    price: 145,
    category: "Accessories",
    size: "One Size",
    condition: "New with tags",
    era: "Contemporary",
    imageUrl:
      "https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=800&q=80",
    quantity: 8,
    tags: ["linen", "woven", "scarf", "natural"],
  },
  {
    id: "prod-049",
    shopId: "shop-london-5",
    title: "Hand-Stitched Linen Shirt",
    description:
      "Boxy linen shirt in washed ecru. Exposed hand-stitching details, drop shoulder, collarless. Unisex fit. Made in the Hackney studio.",
    price: 225,
    category: "Tops",
    size: "M/L",
    condition: "New with tags",
    era: "Contemporary",
    imageUrl:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80",
    quantity: 6,
    tags: ["linen", "shirt", "collarless", "handmade"],
  },

  // Camden Cult (London punk/goth)
  {
    id: "prod-050",
    shopId: "shop-london-6",
    title: "1980s Punk Leather Jacket",
    description:
      "Authentic 1980s punk leather motorcycle jacket with studded lapels, original patches, and multiple buckles. Size M-L. The real deal. Non-negotiable.",
    price: 545,
    category: "Outerwear",
    size: "M-L",
    condition: "Good",
    era: "1980s",
    imageUrl:
      "https://images.unsplash.com/photo-1516257984-b1b4d707412e?w=800&q=80",
    quantity: 1,
    isVintage: true,
    tags: ["punk", "leather", "studded", "80s"],
  },
  {
    id: "prod-051",
    shopId: "shop-london-6",
    title: "1990s Goth Platform Creepers",
    description:
      "Chunky 1990s platform creepers in black leather with velvet upper. Sole height approx 6cm. UK 7 / EU 40. Classic Camden.",
    price: 185,
    category: "Footwear",
    size: "UK 7 / EU 40",
    condition: "Very Good",
    era: "1990s",
    imageUrl:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80",
    quantity: 1,
    isVintage: true,
    tags: ["creepers", "platform", "goth", "90s"],
  },
  {
    id: "prod-052",
    shopId: "shop-london-6",
    title: "1990s Slipknot Band Tee",
    description:
      "Original 1999 Slipknot tour tee in faded black. Front and back graphics. Size XL. Some fading on both prints consistent with age.",
    price: 145,
    category: "Tops",
    size: "XL",
    condition: "Good",
    era: "1990s",
    imageUrl:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80",
    quantity: 1,
    isVintage: true,
    tags: ["band tee", "90s", "metal", "vintage"],
  },
  {
    id: "prod-053",
    shopId: "shop-london-6",
    title: "Y2K Vinyl Mini Skirt",
    description:
      "Early 2000s black vinyl mini skirt with silver zip front. Fitted. UK 8. Very wearable and a total party piece.",
    price: 75,
    category: "Dresses",
    size: "UK 8 / XS-S",
    condition: "Very Good",
    era: "2000s",
    imageUrl:
      "https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=800&q=80",
    quantity: 1,
    isVintage: true,
    tags: ["Y2K", "vinyl", "mini skirt", "2000s"],
  },

  // Notting Hill Edit (London luxury)
  {
    id: "prod-054",
    shopId: "shop-london-7",
    title: "Pre-Loved Burberry Nova Check Coat",
    description:
      "Authentic Burberry double-breasted wool coat with signature Nova check lining. UK 12. Impeccably maintained. Authenticated.",
    price: 1450,
    category: "Outerwear",
    size: "UK 12 / M",
    condition: "Excellent",
    era: "2000s",
    imageUrl:
      "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&q=80",
    quantity: 1,
    tags: ["Burberry", "luxury", "pre-loved", "authenticated"],
  },
  {
    id: "prod-055",
    shopId: "shop-london-7",
    title: "Loro Piana Baby Cashmere Sweater",
    description:
      "Loro Piana baby cashmere crewneck in ivory. Featherweight but incredibly warm. Size IT 44. Near mint condition. Authenticated.",
    price: 685,
    category: "Tops",
    size: "IT 44 / M",
    condition: "Excellent",
    era: "2010s",
    imageUrl:
      "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=800&q=80",
    quantity: 1,
    tags: ["Loro Piana", "cashmere", "luxury", "ivory"],
  },
  {
    id: "prod-056",
    shopId: "shop-london-7",
    title: "Hermès Silk Twill Scarf",
    description:
      "Hermès 90cm silk twill scarf in the 'Cliquetis' design. Dark navy with gold equestrian print. Near perfect condition. Comes with box.",
    price: 475,
    category: "Accessories",
    size: "90 x 90cm",
    condition: "Excellent",
    era: "2010s",
    imageUrl:
      "https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=800&q=80",
    quantity: 1,
    tags: ["Hermès", "silk", "scarf", "equestrian"],
  },
  {
    id: "prod-057",
    shopId: "shop-london-7",
    title: "New Season Linen Wide Trousers",
    description:
      "New-season ivory linen wide-leg trousers from a prestigious Italian mill. High rise, side pockets. Available in S, M, L.",
    price: 285,
    category: "Archive / Rare",
    size: "M",
    condition: "New with tags",
    era: "Contemporary",
    imageUrl:
      "https://images.unsplash.com/photo-1551854838-212c9e876c88?w=800&q=80",
    quantity: 5,
    tags: ["linen", "trousers", "ivory", "wide-leg"],
  },

  // Dalston Dreams (London eclectic vintage)
  {
    id: "prod-058",
    shopId: "shop-london-8",
    title: "1970s Metallic Disco Jumpsuit",
    description:
      "Absolutely wild 1970s gold metallic disco jumpsuit. Flared legs, deep V neckline, wrap front, belt. UK 10. You will be the only person wearing this.",
    price: 265,
    category: "Dresses",
    size: "UK 10 / S-M",
    condition: "Very Good",
    era: "1970s",
    imageUrl:
      "https://images.unsplash.com/photo-1514995669114-6081e934b693?w=800&q=80",
    quantity: 1,
    isVintage: true,
    tags: ["disco", "70s", "metallic", "jumpsuit"],
  },
  {
    id: "prod-059",
    shopId: "shop-london-8",
    title: "1980s Power Suit",
    description:
      "Incredible 1980s cobalt blue power suit. Massive padded shoulders. Jacket and matching wide-leg trousers. UK 12. Absolute banger.",
    price: 225,
    category: "Outerwear",
    size: "UK 12 / M",
    condition: "Good",
    era: "1980s",
    imageUrl:
      "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&q=80",
    quantity: 1,
    isVintage: true,
    tags: ["power suit", "80s", "cobalt", "padded shoulders"],
  },
  {
    id: "prod-060",
    shopId: "shop-london-8",
    title: "1990s Rave Culture Bucket Hat",
    description:
      "1990s tie-dye bucket hat from the UK rave scene. Acid wash in pinks and purples. One size. This existed at a very specific time and place.",
    price: 65,
    category: "Accessories",
    size: "One Size",
    condition: "Good",
    era: "1990s",
    imageUrl:
      "https://images.unsplash.com/photo-1521369909029-2afed882baee?w=800&q=80",
    quantity: 1,
    isVintage: true,
    tags: ["rave", "bucket hat", "90s", "tie-dye"],
  },
  {
    id: "prod-061",
    shopId: "shop-london-8",
    title: "1970s Velvet Blazer",
    description:
      "Midnight blue velvet blazer from the 1970s. Single button, shawl collar, fully lined. Size UK 12. Decadent evening piece.",
    price: 195,
    category: "Outerwear",
    size: "UK 12 / M",
    condition: "Very Good",
    era: "1970s",
    imageUrl:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80",
    quantity: 1,
    isVintage: true,
    tags: ["velvet", "blazer", "70s", "midnight blue"],
  },
  {
    id: "prod-062",
    shopId: "shop-london-8",
    title: "1980s Sequin Party Dress",
    description:
      "All-over gold sequin mini dress from the 1980s. Spaghetti straps, fully lined. UK 10. Ready for any occasion where being the most interesting person is required.",
    price: 155,
    category: "Dresses",
    size: "UK 10 / S-M",
    condition: "Very Good",
    era: "1980s",
    imageUrl:
      "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=800&q=80",
    quantity: 1,
    isVintage: true,
    tags: ["sequin", "80s", "party dress", "gold"],
  },
];

export function getProductsByShop(shopId: string): Product[] {
  return SEED_PRODUCTS.filter((p) => p.shopId === shopId);
}

export function getShopById(shopId: string): Shop | undefined {
  return SEED_SHOPS.find((s) => s.id === shopId);
}

export function getProductById(productId: string): Product | undefined {
  return SEED_PRODUCTS.find((p) => p.id === productId);
}

export function getHiddenGemShops(): Shop[] {
  return SEED_SHOPS.filter((s) => s.followerCount < 3000);
}

export function getHiddenGemProducts(): Product[] {
  const hiddenGemShopIds = getHiddenGemShops().map((s) => s.id);
  return SEED_PRODUCTS.filter((p) => hiddenGemShopIds.includes(p.shopId));
}
