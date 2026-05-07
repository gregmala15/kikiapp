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
  // Optional indie-brand "Our Story" fields. Older listings may not have
  // them; the shop page falls back gracefully to description-only.
  founded?: number;
  story?: string;
  highlights?: string[];
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
    founded: 2008,
    story:
      "Started by Marco Conti as a Sunday-only stall at Porta Portese, Mercato Antico now operates from a small Trastevere studio. Every piece is hand-sourced from estate sales across Lazio and Tuscany, then steamed, repaired and photographed in-house.",
    highlights: ["Family-run since 2008","Hand-sourced in Italy","Repairs in-house"],
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
    founded: 2017,
    story:
      "Chiara Rossi trained at Polimoda before launching Studio Rossi from her grandmother's apartment in Trastevere. Every garment is cut to order in a two-person atelier, using surplus deadstock fabric from Como mills.",
    highlights: ["Cut-to-order in Rome","Deadstock Como silk","Two-person atelier"],
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
    founded: 2015,
    story:
      "Run by former Valentino archivist Lucia Marini, Via Condotti Archive specialises in deadstock and pre-owned pieces from Italian houses' golden eras. Each item is documented with provenance and original tags where available.",
    highlights: ["Provenance documented","Ex-Valentino curator","Authenticated"],
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
    founded: 1998,
    story:
      "A neighbourhood institution that began as a market stall and has occupied the same shopfront for over 25 years. Locals drop off pieces from grandmothers' wardrobes; everything is laundered and lightly mended before going on the rail.",
    highlights: ["25+ years in Trastevere","Locally sourced","Mending included"],
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
    founded: 2012,
    story:
      "Father-and-son leatherworkers Giorgio and Luca Pietra hand-stitch every piece in their workshop near Campo de' Fiori. Vegetable-tanned Tuscan leather, brass hardware, no machine seams. Made to outlast you.",
    highlights: ["Vegetable-tanned leather","Hand-stitched","Father-and-son craft"],
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
    founded: 2019,
    story:
      "Started by ex-footballer Fabrizio Greco from his personal collection of 80s and 90s Italian sportswear. The shop now sources rare athletic pieces from across Europe; every item is washed and authenticated before listing.",
    highlights: ["Sportswear specialist","Authenticated","EU-wide sourcing"],
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
    founded: 2020,
    story:
      "Luce Atelier launched in lockdown by designer Anna Greco, focused on slow-made ready-to-wear in small batches. Each capsule is produced in runs of 30, with surplus fabric returned to mills for recycling.",
    highlights: ["Batches of 30 only","Zero-waste cutting","Female-founded"],
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
    founded: 2010,
    story:
      "The online arm of Rome's legendary Sunday flea market, run by a rotating crew of three lifelong sellers. Fresh stock every Monday from the weekend's haul, photographed and listed within 48 hours.",
    highlights: ["Fresh stock every Monday","Three-seller collective","Flea market roots"],
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
    founded: 2003,
    story:
      "Portobello Archive grew out of a single stall on the Friday market and now stocks some of the rarest 60s and 70s British pieces in West London. Many items come with original receipts or magazine tear sheets from their era.",
    highlights: ["Portobello market origins","Tear-sheet provenance","British 60s/70s focus"],
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
    founded: 2018,
    story:
      "A platform for five East London designers sharing a Shoreditch studio. Limited drops of 50 pieces, screen-printed and sewn locally. Every drop tends to sell out in days; sign up for the next release.",
    highlights: ["Five designers, one roof","Drops of 50","Sewn in Shoreditch"],
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
    founded: 2011,
    story:
      "Founded by Priya Shah, this shop celebrates the layered identity of East London — South Asian textiles, 90s British streetwear, and global vintage all on one rail. Sourced through community networks and family trips.",
    highlights: ["Community-sourced","South Asian textiles","Female-founded"],
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
    founded: 2007,
    story:
      "Run by mother-and-daughter team Helen and Sophie Reid, Chelsea Girl specialises in 60s and 70s pieces from the Swinging London era. Many items come from estate sales of original King's Road shoppers.",
    highlights: ["Estate-sale sourced","Mother-daughter team","King's Road heritage"],
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
    founded: 2016,
    story:
      "Every piece is hand-knitted or hand-woven in a Hackney railway-arch studio by founder Aiko Tanaka and a small group of local artisans. Yarn is sourced from British wool collectives; nothing is machine-made.",
    highlights: ["Hand-knitted in Hackney","British wool only","Lifetime repairs"],
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
    founded: 2009,
    story:
      "Born from a Camden Lock stall, Camden Cult preserves the subcultural history of the market — punk, goth, grunge, Y2K. Items are sourced from the original wearers and dated to the decade they were first worn.",
    highlights: ["Subculture archive","Camden Lock origins","Original-wearer sourced"],
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
    founded: 2015,
    story:
      "A husband-and-wife edit of new and pre-loved investment pieces, run from a small Notting Hill studio. Every pre-loved item is steamed, condition-graded and photographed against the same neutral backdrop.",
    highlights: ["Husband-wife studio","Condition-graded","Investment pieces only"],
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
    founded: 2014,
    story:
      "Run by stylist-turned-buyer Femi Adesina, Dalston Dreams sources eclectic 70s–90s rarities from estate sales, charity warehouses and trips to Lagos. Loud prints, bold colour, nothing predictable.",
    highlights: ["Stylist-curated","Lagos x London sourcing","Loud-print specialist"],
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

export interface CommunityUser {
  id: string;
  username: string;
  fullName: string;
  avatarUrl: string;
  bio: string;
  city: City;
}

export const SEED_USERS: CommunityUser[] = [
  {
    id: "user-aria",
    username: "aria.s",
    fullName: "Aria Solano",
    avatarUrl:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80",
    bio: "Vintage hunter · Rome",
    city: "Rome",
  },
  {
    id: "user-luca",
    username: "luca.m",
    fullName: "Luca Marchetti",
    avatarUrl:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80",
    bio: "Archive collector",
    city: "Rome",
  },
  {
    id: "user-effie",
    username: "effie.k",
    fullName: "Effie Kerr",
    avatarUrl:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&q=80",
    bio: "London stylist",
    city: "London",
  },
  {
    id: "user-noah",
    username: "noah.w",
    fullName: "Noah Wells",
    avatarUrl:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80",
    bio: "Editor · menswear",
    city: "London",
  },
  {
    id: "user-mira",
    username: "mira.t",
    fullName: "Mira Tanaka",
    avatarUrl:
      "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=200&q=80",
    bio: "Y2K obsessive",
    city: "London",
  },
];

export interface ProductRecommendation {
  id: string;
  productId: string;
  recommenderId: string;
  recommendedAt: string;
  note?: string;
}

export const SEED_RECOMMENDATIONS: ProductRecommendation[] = [
  {
    id: "rec-1",
    productId: "prod-007",
    recommenderId: "user-aria",
    recommendedAt: "2026-04-27T10:14:00Z",
    note: "Best leather I've seen in months",
  },
  {
    id: "rec-2",
    productId: "prod-014",
    recommenderId: "user-luca",
    recommendedAt: "2026-04-26T17:32:00Z",
  },
  {
    id: "rec-3",
    productId: "prod-022",
    recommenderId: "user-effie",
    recommendedAt: "2026-04-25T08:05:00Z",
    note: "Obsessed with the cut",
  },
  {
    id: "rec-4",
    productId: "prod-033",
    recommenderId: "user-noah",
    recommendedAt: "2026-04-24T15:51:00Z",
  },
  {
    id: "rec-5",
    productId: "prod-041",
    recommenderId: "user-mira",
    recommendedAt: "2026-04-23T12:11:00Z",
    note: "Y2K dream",
  },
  {
    id: "rec-6",
    productId: "prod-050",
    recommenderId: "user-aria",
    recommendedAt: "2026-04-22T09:00:00Z",
  },
  {
    id: "rec-7",
    productId: "prod-018",
    recommenderId: "user-effie",
    recommendedAt: "2026-04-20T19:24:00Z",
  },
  {
    id: "rec-8",
    productId: "prod-055",
    recommenderId: "user-noah",
    recommendedAt: "2026-04-18T11:42:00Z",
  },
];

// SEED_USER_LIKES — what each seeded community user has saved/liked.
// Used by the Style Blend feature: when the current user adds a friend as
// a "style influence", their feed gets boosted with these products.
// Assignments are deterministic and reflect each user's bio so the influence
// feels personal (e.g. Mira → Y2K era, Luca → Archive / Rare).
export const SEED_USER_LIKES: Record<string, string[]> = {
  "user-aria": [
    "prod-001",
    "prod-007",
    "prod-014",
    "prod-022",
    "prod-031",
    "prod-038",
    "prod-045",
    "prod-050",
  ],
  "user-luca": [
    "prod-003",
    "prod-009",
    "prod-016",
    "prod-024",
    "prod-033",
    "prod-040",
    "prod-047",
    "prod-053",
  ],
  "user-effie": [
    "prod-002",
    "prod-008",
    "prod-018",
    "prod-026",
    "prod-035",
    "prod-042",
    "prod-049",
    "prod-055",
  ],
  "user-noah": [
    "prod-004",
    "prod-011",
    "prod-019",
    "prod-028",
    "prod-036",
    "prod-043",
    "prod-051",
    "prod-057",
  ],
  "user-mira": [
    "prod-005",
    "prod-013",
    "prod-021",
    "prod-029",
    "prod-037",
    "prod-044",
    "prod-052",
    "prod-058",
  ],
};

// Returns the list of product IDs liked by a given seed user. Empty array if
// the user has no recorded likes (e.g. the current user themselves).
export function getLikesForUser(userId: string): string[] {
  return SEED_USER_LIKES[userId] ?? [];
}

export function getProductsByShop(shopId: string): Product[] {
  return SEED_PRODUCTS.filter((p) => p.shopId === shopId);
}

export function getShopById(shopId: string): Shop | undefined {
  return SEED_SHOPS.find((s) => s.id === shopId);
}

export function getProductById(productId: string): Product | undefined {
  return SEED_PRODUCTS.find((p) => p.id === productId);
}

export function getUserById(userId: string): CommunityUser | undefined {
  return SEED_USERS.find((u) => u.id === userId);
}

export function getRecommendationsFromUsers(
  userIds: string[],
): ProductRecommendation[] {
  if (userIds.length === 0) return [];
  return SEED_RECOMMENDATIONS.filter((r) =>
    userIds.includes(r.recommenderId),
  );
}

// Recommendations sent BY a single user (for showing on their profile).
export function getRecommendationsByUser(
  userId: string,
): ProductRecommendation[] {
  return SEED_RECOMMENDATIONS.filter((r) => r.recommenderId === userId);
}

// -----------------------------------------------------------------------------
// Tiny deterministic string hash — stable across renders and reloads.
// Used wherever we need a reproducible "random" pick for a given user id
// (e.g. the followers mock below). Not cryptographic — just a spread function.
// -----------------------------------------------------------------------------
function hashUserId(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

// -----------------------------------------------------------------------------
// Followers mock — deterministic per-user list.
// In a real backend this would be a relational query; for the report demo we
// derive a stable subset of SEED_USERS keyed off the target user's id, so the
// numbers/lists stay identical across renders, reloads, and account switches.
// Excludes the user themselves. The size of the returned list is between
// 2 and (pool.length) inclusive, deterministically picked from the user-id
// hash so each profile gets a different but stable follower count.
// -----------------------------------------------------------------------------
export function getFollowersForUser(userId: string): CommunityUser[] {
  const pool = SEED_USERS.filter((u) => u.id !== userId);
  if (pool.length === 0) return [];
  const h = hashUserId(userId);
  // 2..pool.length followers, deterministic.
  const count = Math.max(2, Math.min(pool.length, (h % pool.length) + 2));
  const start = h % pool.length;
  const rotated = [...pool.slice(start), ...pool.slice(0, start)];
  return rotated.slice(0, count);
}

// Style tags for a user — derived from the tags of products they've liked.
// Counts tag frequency and returns the top N most common, so a user's
// "style tags" actually reflect their taste rather than being hard-coded.
export function getStyleTagsForUser(
  userId: string,
  limit: number = 5,
): string[] {
  const likes = getLikesForUser(userId);
  const counts = new Map<string, number>();
  for (const pid of likes) {
    const p = getProductById(pid);
    if (!p) continue;
    for (const t of p.tags ?? []) counts.set(t, (counts.get(t) ?? 0) + 1);
  }
  return Array.from(counts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([tag]) => tag);
}

// Followed-shops count mock for non-current users — deterministic per user id.
export function getFollowedShopsCountForUser(userId: string): number {
  const h = hashUserId(userId);
  return (h % 6) + 1; // 1..6 shops
}

export function getHiddenGemShops(): Shop[] {
  return SEED_SHOPS.filter((s) => s.followerCount < 3000);
}

export function getHiddenGemProducts(): Product[] {
  const hiddenGemShopIds = getHiddenGemShops().map((s) => s.id);
  return SEED_PRODUCTS.filter((p) => hiddenGemShopIds.includes(p.shopId));
}

// ───────────────────────── Reviews ─────────────────────────
// Buyer-verified shop reviews. In the live app a user can only post a
// review for a shop they've placed an order with; the AppContext gates
// addReview with hasPurchasedFromShop. SEED_REVIEWS represents historical
// buyers whose orders aren't stored in this build's local AsyncStorage.
export interface Review {
  id: string;
  shopId: string;
  userId: string;
  userName: string;
  rating: number; // 1-5
  body: string;
  createdAt: string; // ISO
  productId?: string;
  productTitle?: string;
}

export const SEED_REVIEWS: Review[] = [
  // Mercato Antico (shop-rome-1)
  { id: "rev-1", shopId: "shop-rome-1", userId: "user-luca", userName: "Luca Marchetti", rating: 5,
    body: "Marco messaged me before shipping to confirm sizing — the trench fits perfectly. Properly steamed and packed in tissue. Worth the wait.",
    createdAt: "2026-04-12T14:30:00Z", productId: "prod-003", productTitle: "1970s Leather Trench Coat" },
  { id: "rev-2", shopId: "shop-rome-1", userId: "user-aria", userName: "Aria Solano", rating: 5,
    body: "The Florentine scarf is even better in person. You can tell each piece is hand-picked.",
    createdAt: "2026-03-28T09:15:00Z", productId: "prod-001", productTitle: "1960s Florentine Silk Scarf" },
  { id: "rev-3", shopId: "shop-rome-1", userId: "user-mira", userName: "Mira Tanaka", rating: 4,
    body: "Beautiful piece, shipping took a bit longer than expected but the repair work on the lining is impeccable.",
    createdAt: "2026-02-14T18:00:00Z" },

  // Studio Rossi (shop-rome-2)
  { id: "rev-4", shopId: "shop-rome-2", userId: "user-effie", userName: "Effie Kerr", rating: 5,
    body: "Chiara replied to every fitting question within hours. The slip dress drapes like nothing else I own.",
    createdAt: "2026-04-05T11:45:00Z", productId: "prod-006", productTitle: "Como Silk Slip Dress" },
  { id: "rev-5", shopId: "shop-rome-2", userId: "user-noah", userName: "Noah Wells", rating: 5,
    body: "Cashmere turtleneck is the real thing — substantial but not heavy. Made-to-order really shows.",
    createdAt: "2026-03-19T16:20:00Z", productId: "prod-007", productTitle: "Cashmere Turtleneck" },

  // Pietra Dura (shop-rome-5) — leather artisan
  { id: "rev-6", shopId: "shop-rome-5", userId: "user-luca", userName: "Luca Marchetti", rating: 5,
    body: "Got my belt resized for free six months after buying. Giorgio remembered the order. This is what artisan means.",
    createdAt: "2026-04-22T10:00:00Z" },
  { id: "rev-7", shopId: "shop-rome-5", userId: "user-aria", userName: "Aria Solano", rating: 5,
    body: "Vegetable-tanned leather smells incredible and has aged beautifully in the year I've had it.",
    createdAt: "2026-01-30T13:10:00Z" },
  { id: "rev-8", shopId: "shop-rome-5", userId: "user-effie", userName: "Effie Kerr", rating: 4,
    body: "Bag is gorgeous. Lead time was three weeks which felt long but Giorgio kept me posted.",
    createdAt: "2025-12-08T20:00:00Z" },

  // Portobello Archive (shop-london-1)
  { id: "rev-9", shopId: "shop-london-1", userId: "user-mira", userName: "Mira Tanaka", rating: 5,
    body: "Came with the original 1971 receipt tucked into the pocket. Wild. Properly sourced.",
    createdAt: "2026-04-18T08:50:00Z" },
  { id: "rev-10", shopId: "shop-london-1", userId: "user-noah", userName: "Noah Wells", rating: 5,
    body: "Best vintage I've bought online. Condition notes were spot on, no surprises.",
    createdAt: "2026-03-02T14:00:00Z" },
  { id: "rev-11", shopId: "shop-london-1", userId: "user-effie", userName: "Effie Kerr", rating: 4,
    body: "Loved the piece — packaging could use less plastic though.",
    createdAt: "2026-02-21T09:30:00Z" },

  // East End Collective (shop-london-2)
  { id: "rev-12", shopId: "shop-london-2", userId: "user-noah", userName: "Noah Wells", rating: 5,
    body: "Made it into the latest drop and the fit is exactly as described. Watch the release alerts, they sell out fast.",
    createdAt: "2026-04-14T19:00:00Z" },
  { id: "rev-13", shopId: "shop-london-2", userId: "user-mira", userName: "Mira Tanaka", rating: 4,
    body: "Bold print, sturdy stitching. Wish more sizes were available but I get the small-batch thing.",
    createdAt: "2026-03-25T12:00:00Z" },

  // Hackney Hands (shop-london-5)
  { id: "rev-14", shopId: "shop-london-5", userId: "user-effie", userName: "Effie Kerr", rating: 5,
    body: "Aiko knit my jumper to a specific length and threw in repair instructions. Genuinely made-with-love energy.",
    createdAt: "2026-04-08T15:00:00Z" },
  { id: "rev-15", shopId: "shop-london-5", userId: "user-aria", userName: "Aria Solano", rating: 5,
    body: "British wool is so different from generic merino. Worth every penny and will outlast everything I own.",
    createdAt: "2026-03-11T10:30:00Z" },
  { id: "rev-16", shopId: "shop-london-5", userId: "user-luca", userName: "Luca Marchetti", rating: 5,
    body: "Hand-woven scarf, no two are the same. Got compliments at the office in Milan.",
    createdAt: "2026-02-02T17:45:00Z" },
];

export function getReviewsForShop(
  shopId: string,
  extra: Review[] = [],
): Review[] {
  return [...SEED_REVIEWS, ...extra]
    .filter((r) => r.shopId === shopId)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function getShopRatingSummary(
  shopId: string,
  extra: Review[] = [],
): { avg: number; count: number } {
  const list = [...SEED_REVIEWS, ...extra].filter((r) => r.shopId === shopId);
  if (list.length === 0) return { avg: 0, count: 0 };
  const sum = list.reduce((acc, r) => acc + r.rating, 0);
  return { avg: sum / list.length, count: list.length };
}
