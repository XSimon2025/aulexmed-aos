import type { MetadataRoute } from "next";
import { categories } from "@/data/categories";
import { guides } from "@/data/guides";
import { products } from "@/data/products";
import { siteConfig } from "@/lib/site";

const staticRoutes = ["/", "/products", "/support", "/b2b", "/guides"];

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
