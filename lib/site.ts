import type { Metadata } from "next";

export const siteConfig = {
  name: "AULEXMED",
  slogan: "Knee & Ankle Orthopedic Experts",
  url: "https://www.aulexmed.com",
  email: "business@aulexmed.com",
  description:
    "AULEXMED builds practical orthopedic support products for daily movement, including knee braces, ankle braces, walking boots, back support, and wrist support."
};

export function buildMetadata({
  title,
  description,
  path = "/"
}: {
  title: string;
  description: string;
  path?: string;
}): Metadata {
  const fullTitle = title.includes("AULEXMED") ? title : `${title} | AULEXMED`;
  const url = new URL(path, siteConfig.url).toString();

  return {
    title,
    description,
    alternates: {
      canonical: url
    },
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: siteConfig.name,
      type: "website"
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description
    }
  };
}
