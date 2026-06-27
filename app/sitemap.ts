import type { MetadataRoute } from "next";
import { categories } from "@/data/categories";
import { guides } from "@/data/guides";
import { products } from "@/data/products";
import { siteConfig } from "@/lib/site";

const staticRoutes = [
  "/",
  "/about",
  "/why-choose-aulexmed",
  "/factory",
  "/certificates",
  "/contact",
  "/products",
  "/support",
  "/support/manuals",
  "/support/how-to-wear",
  "/support/size-guide",
  "/support/video-tutorials",
  "/support/warranty",
  "/support/return-policy",
  "/support/replacement-parts",
  "/support/contact-support",
  "/b2b",
  "/b2b/wholesale",
  "/b2b/oem-odm",
  "/b2b/distributor-program",
  "/b2b/catalog-download",
  "/b2b/request-quotation",
  "/guides"
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const urls = [
    ...staticRoutes,
    ...categories.map((category) => `/products/${category.slug}`),
    ...products.map((product) => `/products/${product.categorySlug}/${product.slug}`),
    ...guides.map((guide) => `/guides/${guide.slug}`)
  ];

  return urls.map((path) => ({
    url: new URL(path, siteConfig.url).toString(),
    lastModified: now
  }));
}
