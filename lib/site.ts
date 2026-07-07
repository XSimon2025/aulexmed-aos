import type { Metadata } from "next";

export const siteConfig = {
  name: "AULEXMED",
  slogan: "Back to Life. One Step at a Time.",
  legacySlogan: "Knee & Ankle Orthopedic Experts",
  url: "https://aulexmed.com",
  email: "business@aulexmed.com",
  supportEmail: "support@aulexmed.com",
  ogImage: "/brand/back-to-life-hero.png",
  description:
    "AULEXMED builds practical orthopedic support products that help people return to everyday movement with confidence, including knee braces, ankle braces, walking boots, back support, and wrist support."
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
      type: "website",
      images: [
        {
          url: siteConfig.ogImage,
          width: 1600,
          height: 900,
          alt: "AULEXMED Back to Life brand visual"
        }
      ]
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [siteConfig.ogImage]
    }
  };
}
