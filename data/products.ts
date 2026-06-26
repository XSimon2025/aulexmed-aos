export type Product = {
  slug: string;
  categorySlug: string;
  sku: string;
  name: string;
  overview: string;
  image: string;
  gallery: string[];
  features: string[];
  sizeGuide: string[];
  howToWear: string[];
  faqs: { question: string; answer: string }[];
  manualUrl: string;
  purchaseLinks: {
    temuShop: string;
    amazonSearch: string;
    tiktokSearch: string;
    internationalEmail: string;
    quote: string;
    sales: string;
  };
};

const temuShopLink = "https://www.temu.com/mall.html?_bg_fs=1&mall_id=634418214452602";
const quoteLink = "/b2b#request-quotation";
const salesEmail = "business@aulexmed.com";

type ProductSeed = {
  sku: string;
  categorySlug: string;
  image: string;
  name?: string;
  overview?: string;
  features?: string[];
};

const catalogSeeds: ProductSeed[] = [
  { sku: "BL-12001", categorySlug: "neck-shoulder-support", image: "12001.jpg", name: "Cervical Collar", overview: "A neck support product prepared for catalog browsing, sizing content, and inquiry-based ordering." },
  { sku: "BL-12006", categorySlug: "neck-shoulder-support", image: "12006.jpg", name: "Neck Support Collar" },
  { sku: "BL-12006-A", categorySlug: "neck-shoulder-support", image: "12006-.jpg", name: "Neck Support Collar Variant" },
  { sku: "BL-12007", categorySlug: "neck-shoulder-support", image: "12007.jpg", name: "Adjustable Neck Support" },
  { sku: "BL-12008", categorySlug: "neck-shoulder-support", image: "12008.jpg", name: "Soft Neck Collar" },
  { sku: "BL-1907", categorySlug: "daily-support-products", image: "1907.jpg", name: "Daily Support Product" },
  { sku: "BL-2012", categorySlug: "daily-support-products", image: "2012.jpg", name: "Daily Support Brace" },
  { sku: "BL-20229", categorySlug: "daily-support-products", image: "20229.jpg", name: "Daily Orthopedic Support" },
  { sku: "BL-22001", categorySlug: "back-posture-support", image: "22001.jpg", name: "Thoracolumbar Brace with Air Bladder" },
  { sku: "BL-22003", categorySlug: "neck-shoulder-support", image: "22003.jpg", name: "Shoulder Support Brace" },
  { sku: "BL-22005", categorySlug: "neck-shoulder-support", image: "22005.jpg", name: "Shoulder Immobilizer" },
  { sku: "BL-22006", categorySlug: "neck-shoulder-support", image: "22006.jpg", name: "Shoulder Support Brace" },
  { sku: "BL-22006-A", categorySlug: "neck-shoulder-support", image: "22006-.jpg", name: "Shoulder Support Brace Variant" },
  { sku: "BL-22039", categorySlug: "back-posture-support", image: "22039.jpg", name: "Thoracic Support Brace" },
  { sku: "BL-22076", categorySlug: "back-posture-support", image: "22076.jpg", name: "Thoracolumbar Brace with Air Bladder" },
  { sku: "BL-32001", categorySlug: "elbow-arm-support", image: "32001.jpg", name: "Elbow Support Brace" },
  { sku: "BL-32002", categorySlug: "elbow-arm-support", image: "32002.jpg", name: "Adjustable Elbow Support" },
  { sku: "BL-32005", categorySlug: "back-posture-support", image: "32005.jpg", name: "Open Mesh Back Support Brace", overview: "A breathable back support design with structured panels and adjustable closure for everyday support." },
  { sku: "BL-32008", categorySlug: "elbow-arm-support", image: "32008.jpg", name: "Arm Support Brace" },
  { sku: "BL-420001", categorySlug: "knee-braces", image: "420001.jpg", name: "Knee Support Brace" },
  { sku: "BL-42001", categorySlug: "knee-braces", image: "42001.jpg", name: "Adjustable ROM Knee Brace", overview: "A long adjustable knee brace with ROM-style hinge controls and multiple straps for a stable daily support feel." },
  { sku: "BL-42003", categorySlug: "knee-braces", image: "42003.jpg", name: "Hinged Knee Brace", overview: "A hinged knee brace designed with side support and adjustable fastening for controlled fit." },
  { sku: "BL-42006", categorySlug: "knee-braces", image: "42006.jpg", name: "Rigid Knee Immobilizer Brace", overview: "A rigid knee support brace with structured panels and adjustable fastening for stable positioning." },
  { sku: "BL-42007", categorySlug: "knee-braces", image: "42007.jpg", name: "Knee Support Brace" },
  { sku: "BL-42008", categorySlug: "knee-braces", image: "42008.jpg", name: "Knee Stabilizer Brace" },
  { sku: "BL-42010", categorySlug: "knee-braces", image: "42010.jpg", name: "Knee Immobilizer Brace" },
  { sku: "BL-42011", categorySlug: "knee-braces", image: "42011.jpg", name: "Knee Immobilizer Brace" },
  { sku: "BL-42012", categorySlug: "knee-braces", image: "42012.jpg", name: "Dial Adjustable Knee Brace", overview: "A knee support brace with a dial-style tension structure and adjustable fit for everyday movement." },
  { sku: "BL-42013", categorySlug: "knee-braces", image: "42013.jpg", name: "Knee Support Brace" },
  { sku: "BL-42019", categorySlug: "knee-braces", image: "42019.jpg", name: "Patella Stabilizing Knee Brace", overview: "A patella support knee brace with an open-knee profile and adjustable fastening for light daily activity." },
  { sku: "BL-52001", categorySlug: "ankle-braces", image: "52001.jpg", name: "Ankle Support Brace" },
  { sku: "BL-52002", categorySlug: "ankle-braces", image: "52002.jpg", name: "Ankle Support Brace" },
  { sku: "BL-52002L", categorySlug: "ankle-braces", image: "52002L.jpg", name: "Ankle Support Brace - Long" },
  { sku: "BL-52004", categorySlug: "ankle-braces", image: "52004.jpg", name: "Ankle Stabilizer Brace" },
  { sku: "BL-52005", categorySlug: "ankle-braces", image: "52005.jpg", name: "Ankle Support Brace" },
  { sku: "BL-52006", categorySlug: "ankle-braces", image: "52006.jpg", name: "Ankle Support Brace" },
  { sku: "BL-52007", categorySlug: "ankle-braces", image: "52007.jpg", name: "Ankle Support Brace" },
  { sku: "BL-52014", categorySlug: "ankle-braces", image: "52014.jpg", name: "Ankle Support Brace" },
  { sku: "BL-52014L", categorySlug: "ankle-braces", image: "52014长.jpg", name: "Long Ankle Support Brace" },
  { sku: "BL-52015", categorySlug: "ankle-braces", image: "52015.jpg", name: "Ankle Support Brace" },
  { sku: "BL-52015L", categorySlug: "ankle-braces", image: "52015长.jpg", name: "Long Ankle Support Brace" },
  { sku: "BL-52016", categorySlug: "ankle-braces", image: "52016.jpg", name: "Ankle Support Brace" },
  { sku: "BL-52017", categorySlug: "ankle-braces", image: "52017.jpg", name: "Ankle Support Brace" },
  { sku: "BL-52017L", categorySlug: "ankle-braces", image: "52017长款.jpg", name: "Long Ankle Support Brace" },
  { sku: "BL-52036", categorySlug: "walking-boots", image: "52036.jpg", name: "Short Air Walking Boot", overview: "A short pneumatic walking boot with a protective shell, padded liner, and adjustable straps." },
  { sku: "BL-52036A", categorySlug: "walking-boots", image: "52036长.jpg", name: "Tall Air Walking Boot" },
  { sku: "BL-52069", categorySlug: "ankle-braces", image: "52069.jpg", name: "Cross Strap Ankle Brace", overview: "A cross-strap ankle brace with adjustable fastening and a close daily-use fit." },
  { sku: "BL-60008", categorySlug: "daily-support-products", image: "60008.jpg", name: "Daily Support Product" },
  { sku: "BL-60241", categorySlug: "daily-support-products", image: "60241.jpg", name: "Daily Support Brace" },
  { sku: "BL-70002", categorySlug: "back-posture-support", image: "70002.jpg", name: "Full Back Posture Support Brace", overview: "A full-back support brace with adjustable straps and broad contact panels for comfortable daily support." },
  { sku: "BL-70003", categorySlug: "back-posture-support", image: "70003.jpg", name: "Back Support Brace" },
  { sku: "BL-70004", categorySlug: "back-posture-support", image: "70004.jpg", name: "Back Support Belt" },
  { sku: "BL-70005", categorySlug: "back-posture-support", image: "70005.jpg", name: "Black Full Back Support Brace", overview: "A full-back support design with a black profile and adjustable fit for daily posture support." },
  { sku: "BL-70006", categorySlug: "back-posture-support", image: "70006.jpg", name: "Pulley Adjustment Back Support Brace", overview: "A back support brace with dual pull-ring pulley adjustment for a stable and easy-to-adjust feel." },
  { sku: "BL-70007", categorySlug: "back-posture-support", image: "70007.jpg", name: "Four-Stay Breathable Back Support Brace", overview: "A breathable back support brace with structured stays and adjustable closure." },
  { sku: "BL-70008", categorySlug: "back-posture-support", image: "70008.jpg", name: "Back Support Belt" },
  { sku: "BL-72020", categorySlug: "back-posture-support", image: "72020.jpg", name: "Posture Support Brace" },
  { sku: "BL-82010", categorySlug: "wrist-finger-support", image: "82010.jpg", name: "Wrist Support Brace" },
  { sku: "BL-82018", categorySlug: "wrist-finger-support", image: "82018.jpg", name: "Wrist Support Brace" },
  { sku: "BL-82019", categorySlug: "wrist-finger-support", image: "82019.jpg", name: "Wrist Support Brace" },
  { sku: "BL-83010", categorySlug: "wrist-finger-support", image: "83010.jpg", name: "Wrist & Finger Support Brace", overview: "A compact wrist and finger support product with adjustable fastening and soft contact materials." },
  { sku: "BL-85010", categorySlug: "wrist-finger-support", image: "85010.jpg", name: "Finger Support Splint" },
  { sku: "BL-86010", categorySlug: "wrist-finger-support", image: "86010.jpg", name: "Finger Support Splint" },
  { sku: "BL-86222", categorySlug: "wrist-finger-support", image: "86222.jpg", name: "Finger Support Splint" }
];

function slugifySku(sku: string) {
  return sku.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function queryFor(product: Pick<ProductSeed, "sku" | "name">) {
  return encodeURIComponent(`Aulexmed ${product.sku} ${product.name ?? ""}`.trim());
}

function mailtoFor(product: Pick<ProductSeed, "sku" | "name">) {
  const subject = encodeURIComponent(`AULEXMED ${product.sku} purchase inquiry`);
  const body = encodeURIComponent(
    `Hello AULEXMED,\n\nI am interested in ${product.sku} ${product.name ?? ""}.\nMy country/region:\nQuantity:\nQuestions:\n`
  );

  return `mailto:${salesEmail}?subject=${subject}&body=${body}`;
}

function defaultOverview(seed: ProductSeed) {
  return (
    seed.overview ??
    `${seed.name ?? seed.sku} is part of the AULEXMED orthopedic support catalog, prepared for product display, size guide content, and purchase inquiry routing.`
  );
}

function defaultFeatures(seed: ProductSeed) {
  return (
    seed.features ?? [
      "Adjustable design for a personalized fit",
      "Daily support profile with practical materials",
      "Catalog-ready SKU for retail, marketplace, and B2B inquiry",
      "Prepared for manuals, size guides, and future marketplace links"
    ]
  );
}

export const products: Product[] = catalogSeeds.map((seed) => {
  const query = queryFor(seed);
  const mailto = mailtoFor(seed);

  return {
    slug: `${slugifySku(seed.sku)}-${slugifySku(seed.name ?? "support-product")}`,
    categorySlug: seed.categorySlug,
    sku: seed.sku,
    name: seed.name ?? `${seed.sku} Support Product`,
    overview: defaultOverview(seed),
    image: `/catalog/${seed.image}`,
    gallery: [`/catalog/${seed.image}`],
    features: defaultFeatures(seed),
    sizeGuide: [
      "Check the product image and SKU before choosing a size.",
      "Use the final AULEXMED size chart when it is added to this page.",
      "If between two sizes, contact support before purchase."
    ],
    howToWear: [
      "Open all straps or fasteners before wearing.",
      "Position the support product according to the product area.",
      "Fasten evenly and adjust until it feels stable without over-tightening.",
      "Stop use and ask for support if the fit feels uncomfortable."
    ],
    faqs: [
      {
        question: "Where can I buy this product in the United States?",
        answer: "Use the Temu Shop button for the AULEXMED shop link. Amazon and TikTok buttons guide you to search for Aulexmed and the SKU."
      },
      {
        question: "What if I am outside the United States?",
        answer: "Use the international inquiry button and include your country, target product, and quantity so the team can recommend the right purchase or quotation path."
      }
    ],
    manualUrl: "/support#manuals",
    purchaseLinks: {
      temuShop: temuShopLink,
      amazonSearch: `https://www.amazon.com/s?k=${query}`,
      tiktokSearch: `https://www.tiktok.com/search?q=${query}`,
      internationalEmail: mailto,
      quote: quoteLink,
      sales: mailto
    }
  };
});

export function getProductsByCategory(categorySlug: string) {
  return products.filter((product) => product.categorySlug === categorySlug);
}

export function getProduct(categorySlug: string, slug: string) {
  return products.find((product) => product.categorySlug === categorySlug && product.slug === slug);
}
