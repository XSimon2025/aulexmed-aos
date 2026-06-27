import { siteConfig } from "@/lib/site";

export const b2bPaths = [
  {
    href: "/b2b/wholesale",
    title: "Wholesale",
    body: "For importers, retailers, clinics, and marketplace sellers sourcing repeatable orthopedic support products."
  },
  {
    href: "/b2b/oem-odm",
    title: "OEM / ODM",
    body: "For private label projects involving logo, color, packaging, product cards, manuals, and product selection."
  },
  {
    href: "/b2b/distributor-program",
    title: "Distributor Program",
    body: "For local distributors building an AULEXMED catalog across knee, ankle, walking boot, back, wrist, and support products."
  },
  {
    href: "/b2b/catalog-download",
    title: "Catalog Download",
    body: "For buyers who need catalog, SKU list, product line overview, and approved document review before quotation."
  },
  {
    href: "/b2b/request-quotation",
    title: "Request Quotation",
    body: "For buyers ready to send product category, quantity, market, packaging, and document requirements."
  }
];

export const b2bBuyerNeeds = [
  "Repeatable product supply and clear SKU selection",
  "Packaging, product card, and instruction insert support",
  "Size chart, manual, and support content preparation",
  "Sample, quotation, and delivery timeline communication",
  "Target market and sales-channel fit",
  "Document and catalog review before order planning"
];

export const customizationOptions = [
  {
    title: "Product Selection",
    points: ["Existing SKU matching", "Category planning", "Sample product list", "Marketplace-ready product grouping"]
  },
  {
    title: "Branding",
    points: ["Logo position", "Color direction", "Retail box", "Product card", "Package insert"]
  },
  {
    title: "Content",
    points: ["Size guide", "How-to-wear steps", "Manual content", "FAQ copy", "Listing content support"]
  },
  {
    title: "Order Planning",
    points: ["Quantity range", "Target market", "Destination country", "Required documents", "Timeline"]
  }
];

export const rfqChecklist = [
  "Company name and country",
  "Product category or SKU",
  "Estimated order quantity",
  "Sales channel: distributor, retail, Amazon, TikTok, clinic, or wholesale",
  "Branding needs: logo, color, box, insert, manual",
  "Required documents or test reports, if any",
  "Expected sample or delivery timeline"
];

export function buildB2BMailto(subject: string, bodyLines: string[]) {
  const body = encodeURIComponent(bodyLines.join("\n"));
  return `mailto:${siteConfig.email}?subject=${encodeURIComponent(subject)}&body=${body}`;
}
