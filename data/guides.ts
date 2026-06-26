export type Guide = {
  slug: string;
  title: string;
  category: string;
  excerpt: string;
  sections: { heading: string; body: string }[];
};

export const guides: Guide[] = [
  {
    slug: "how-to-choose-a-walking-boot",
    title: "How to Choose a Walking Boot",
    category: "Walking Boots",
    excerpt: "A practical buying guide for comparing height, fit, closure, and daily-use comfort.",
    sections: [
      {
        heading: "Start with boot height",
        body: "Short and tall walking boots support different coverage needs. Final product pages should explain height, sizing, and fit in simple language."
      },
      {
        heading: "Check comfort details",
        body: "Look for padded liners, adjustable straps, and a steady sole design. Avoid over-tightening during daily wear."
      }
    ]
  },
  {
    slug: "how-to-wear-a-rom-knee-brace",
    title: "How to Wear a ROM Knee Brace",
    category: "Knee Braces",
    excerpt: "A template article for step-by-step wearing instructions and common fit checks.",
    sections: [
      {
        heading: "Position first",
        body: "Align the brace around the knee before securing straps. Use final product photography for exact positioning."
      },
      {
        heading: "Secure evenly",
        body: "Fasten straps in sequence and check that the brace feels stable without restricting comfortable movement."
      }
    ]
  },
  {
    slug: "ankle-brace-vs-ankle-sleeve",
    title: "Ankle Brace vs Ankle Sleeve",
    category: "Ankle Braces",
    excerpt: "A comparison guide that helps customers understand support level, materials, and everyday use.",
    sections: [
      {
        heading: "Support profile",
        body: "Braces usually offer more adjustable structure, while sleeves are often lighter and simpler for daily routines."
      },
      {
        heading: "Fit and use",
        body: "The right choice depends on product design, shoe compatibility, and preferred fit."
      }
    ]
  }
];

export function getGuide(slug: string) {
  return guides.find((guide) => guide.slug === slug);
}
