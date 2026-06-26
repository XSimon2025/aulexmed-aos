import Image from "next/image";
import Link from "next/link";
import { CategorySection } from "@/components/CategorySection";
import { CTASection } from "@/components/CTASection";
import { ProductCard } from "@/components/ProductCard";
import { guides } from "@/data/guides";
import { products } from "@/data/products";
import { siteConfig, buildMetadata } from "@/lib/site";

export const metadata = buildMetadata({
  title: "AULEXMED Knee & Ankle Orthopedic Experts",
  description: siteConfig.description
});

const trustStats = [
  "20+ years manufacturing experience",
  "2,550 m² facility",
  "OEM / ODM support",
  "Export-ready product catalog"
];

export default function HomePage() {
  return (
    <>
      <section className="bg-white">
        <div className="container-page grid min-h-[680px] gap-10 py-12 lg:grid-cols-[1fr_0.95fr] lg:items-center lg:py-16">
          <div>
            <p className="eyebrow">Official Brand Website</p>
            <h1 className="mt-4 max-w-4xl text-4xl font-bold tracking-tight text-brand-navy sm:text-5xl lg:text-6xl">
              AULEXMED — Knee & Ankle Orthopedic Experts.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
              Professional orthopedic support products for daily movement, clear user guidance, and scalable B2B supply.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/products" className="rounded-md bg-brand-blue px-6 py-3 text-center text-sm font-semibold text-white hover:bg-brand-navy">
                Explore Products
              </Link>
              <Link href="/support" className="rounded-md border border-brand-line px-6 py-3 text-center text-sm font-semibold text-brand-navy hover:border-brand-blue">
                Visit Support Center
              </Link>
            </div>
            <div className="mt-10 grid gap-3 sm:grid-cols-2">
              {trustStats.map((stat) => (
                <div key={stat} className="rounded-md border border-brand-line bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700">
                  {stat}
                </div>
              ))}
            </div>
          </div>
          <div className="relative min-h-[360px] overflow-hidden rounded-lg bg-brand-sky shadow-soft lg:min-h-[560px]">
            <Image src="/brand/hero.jpg" alt="AULEXMED orthopedic support product display" fill priority className="object-cover" />
          </div>
        </div>
      </section>

      <CategorySection />

      <section className="section-y bg-slate-50">
        <div className="container-page">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="eyebrow">Featured Products</p>
              <h2 className="mt-3 text-3xl font-bold text-brand-navy md:text-4xl">First catalog framework</h2>
            </div>
            <Link href="/products" className="text-sm font-semibold text-brand-blue hover:text-brand-navy">
              Browse catalog
            </Link>
          </div>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {products.slice(0, 4).map((product) => (
              <ProductCard key={product.slug} product={product} />
            ))}
          </div>
        </div>
      </section>

      <section className="section-y bg-white">
        <div className="container-page grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div>
            <p className="eyebrow">Support Center</p>
            <h2 className="mt-3 text-3xl font-bold text-brand-navy md:text-4xl">Built for package inserts, manuals, and product help.</h2>
            <p className="mt-4 text-base leading-7 text-slate-600">
              The first version includes placeholders for user manuals, size guides, how-to-wear content, warranty information, and missing parts support.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {["User Manuals", "How to Wear", "Size Guide", "Warranty & Parts"].map((item) => (
              <Link key={item} href="/support" className="rounded-lg border border-brand-line bg-slate-50 p-5 font-semibold text-brand-navy hover:border-brand-blue">
                {item}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section-y bg-slate-50">
        <div className="container-page">
          <p className="eyebrow">Guides & SEO</p>
          <h2 className="mt-3 text-3xl font-bold text-brand-navy md:text-4xl">Education content ready to expand</h2>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {guides.map((guide) => (
              <Link key={guide.slug} href={`/guides/${guide.slug}`} className="rounded-lg border border-brand-line bg-white p-6 hover:border-brand-blue">
                <p className="text-xs font-semibold uppercase tracking-wide text-brand-blue">{guide.category}</p>
                <h3 className="mt-3 text-xl font-bold text-brand-navy">{guide.title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-600">{guide.excerpt}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <CTASection
        eyebrow="B2B"
        title="Wholesale, OEM / ODM, and distributor inquiries"
        body="AULEXMED can present product catalogs, factory capability, and request-for-quotation workflows without adding checkout in the first phase."
        primaryHref="/b2b#request-quotation"
        primaryLabel="Request a Quote"
        secondaryHref="/b2b"
        secondaryLabel="View B2B Page"
      />
    </>
  );
}
