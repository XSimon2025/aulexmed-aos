export type ProductCategory = {
  slug: string;
  name: string;
  shortName: string;
  description: string;
  image: string;
};

export const categories: ProductCategory[] = [
  {
    slug: "knee-braces",
    name: "Knee Braces",
    shortName: "Knee",
    description:
      "Adjustable knee support options for daily movement, controlled fit, and stable feel.",
    image: "/products/knee-brace-42001.jpg"
  },
  {
    slug: "ankle-braces",
    name: "Ankle Braces",
    shortName: "Ankle",
    description:
      "Breathable ankle support products designed for easy wear and everyday stability.",
    image: "/products/ankle-brace-52069.jpg"
  },
  {
    slug: "walking-boots",
    name: "Walking Boots",
    shortName: "Walking Boots",
    description:
      "Walking boot designs with protective shells, padded liners, and adjustable fastening.",
    image: "/products/walking-boot-52036.jpg"
  },
  {
    slug: "back-posture-support",
    name: "Back, Thoracic & Posture Support",
    shortName: "Back",
    description:
      "Support belts, thoracic braces, and posture products built for comfortable daily routines.",
    image: "/catalog/70002.jpg"
  },
  {
    slug: "wrist-finger-support",
    name: "Wrist & Finger Support",
    shortName: "Wrist",
    description:
      "Wrist and finger support products with simple adjustment and soft contact materials.",
    image: "/catalog/83010.jpg"
  },
  {
    slug: "neck-shoulder-support",
    name: "Neck & Shoulder Support",
    shortName: "Neck",
    description:
      "Neck collars, shoulder supports, and upper-body support products for catalog and B2B selection.",
    image: "/catalog/12001.jpg"
  },
  {
    slug: "elbow-arm-support",
    name: "Elbow & Arm Support",
    shortName: "Elbow",
    description:
      "Elbow, arm, and sling-style support products with practical adjustment and daily-use materials.",
    image: "/catalog/32001.jpg"
  },
  {
    slug: "daily-support-products",
    name: "Daily Support Products",
    shortName: "Daily",
    description:
      "Additional everyday support products prepared for future manuals, size charts, and purchase links.",
    image: "/catalog/60008.jpg"
  }
];

export function getCategory(slug: string) {
  return categories.find((category) => category.slug === slug);
}
