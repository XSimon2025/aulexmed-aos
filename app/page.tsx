import Image from "next/image";
import Link from "next/link";
import { CategorySection } from "@/components/CategorySection";
import { CTASection } from "@/components/CTASection";
import { ProductCard } from "@/components/ProductCard";
import { b2bPaths } from "@/data/b2b";
import { guides } from "@/data/guides";
import { homeInfrastructureSteps, homePlatformSystems, homeTrustStats, homeUserJourneys } from "@/data/home";
import { products } from "@/data/products";
import { supportTopics } from "@/data/support";
import { siteConfig, buildMetadata } from "@/lib/site";

export const metadata = buildMetadata({
  title: "AULEXMED Knee & Ankle Orthopedic Experts",
  description: siteConfig.description
});

export default function HomePage() {
  return (
    <>
      <section className="bg-white">
        <div className="container-page grid gap-10 py-12 lg:min-h-[700px] lg:grid-cols-[1fr_0.92fr] lg:items-center lg:py-16">
          <div>
            <p className="eyebrow">Official Brand Platform</p>
            <h1 className="mt-4 max-w-4xl text-4xl font-bold tracking-tight text-brand-navy sm:text-5xl lg:text-6xl">
              AULEXMED — Knee & Ankle Orthopedic Experts.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
              A professional orthopedic support brand website built for product discovery, customer support, SEO growth, and B2B inquiries.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/products" className="rounded-md bg-brand-blue px-6 py-3 text-center text-sm font-semibold text-white hover:bg-brand-navy">
                Explore Products
              </Link>
              <Link href="/support" className="rounded-md border border-brand-line px-6 py-3 text-center text-sm font-semibold text-brand-navy hover:border-brand-blue">
                Visit Support Center
              </Link>
              <Link href="/b2b/request-quotation" className="rounded-md border border-brand-line px-6 py-3 text-center text-sm font-semibold text-brand-navy hover:border-brand-blue">
                Request Quote
              </Link>
            </div>
            <div className="mt-10 grid gap-3 sm:grid-cols-2">
              {homeTrustStats.map((stat) => (
                <div key={stat} className="rounded-md border border-brand-line bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700">
                  {stat}
                </div>
              ))}
            </div>
          </div>
          <div className="relative min-h-[360px] overflow-hidden rounded-lg bg-brand-sky shadow-soft lg:min-h-[560px]">
            <Image src="/brand/hero.jpg" alt="AULEXMED orthopedic support product display" fill priority className="object-cover" />
            <div className="absolute inset-x-4 bottom-4 rounded-lg border border-white/60 bg-white/90 p-4 shadow-sm backdrop-blur">
              <p className="text-xs font-semibold uppercase tracking-wide text-brand-blue">Version 1.1 Focus</p>
              <p className="mt-1 text-sm font-semibold leading-6 text-brand-navy">
                Clear journeys for marketplace customers, package QR visitors, SEO readers, and B2B buyers.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="section-y bg-slate-50">
        <div className="container-page">
          <p className="eyebrow">User Journeys</p>
          <h2 className="mt-3 max-w-4xl text-3xl font-bold text-brand-navy md:text-4xl">
            Built for the real traffic AULEXMED already receives.
          </h2>
          <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {homeUserJourneys.map((journey) => (
              <Link key={journey.title} href={journey.href} className="rounded-lg border border-brand-line bg-white p-6 hover:border-brand-blue">
                <p className="text-xs font-semibold uppercase tracking-wide text-brand-blue">{journey.label}</p>
                <h3 className="mt-3 text-xl font-bold text-brand-navy">{journey.title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-600">{journey.body}</p>
                <span className="mt-5 inline-flex text-sm font-semibold text-brand-blue">{journey.cta}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <CategorySection />

      <section className="section-y bg-white">
        <div className="container-page">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="eyebrow">Featured Products</p>
              <h2 className="mt-3 text-3xl font-bold text-brand-navy md:text-4xl">Product pages designed for purchase routing and future scale</h2>
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

      <section className="section-y bg-slate-50">
        <div className="container-page">
          <p className="eyebrow">Platform Systems</p>
          <h2 className="mt-3 max-w-4xl text-3xl font-bold text-brand-navy md:text-4xl">
            One website connecting brand, products, support, SEO, and B2B.
          </h2>
          <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {homePlatformSystems.map((system) => (
              <Link key={system.title} href={system.href} className="rounded-lg border border-brand-line bg-white p-6 hover:border-brand-blue">
                <h3 className="text-xl font-bold text-brand-navy">{system.title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-600">{system.body}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section-y bg-white">
        <div className="container-page grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div>
            <p className="eyebrow">Support Center</p>
            <h2 className="mt-3 text-3xl font-bold text-brand-navy md:text-4xl">Built for package inserts, QR codes, manuals, and product help.</h2>
            <p className="mt-4 text-base leading-7 text-slate-600">
              Support pages should become clearer than paper manuals and reduce back-and-forth for existing customers.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {supportTopics.slice(0, 4).map((topic) => (
              <Link key={topic.href} href={topic.href} className="rounded-lg border border-brand-line bg-slate-50 p-5 hover:border-brand-blue">
                <h3 className="font-semibold text-brand-navy">{topic.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{topic.body}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section-y bg-slate-50">
        <div className="container-page">
          <p className="eyebrow">Guides & SEO</p>
          <h2 className="mt-3 max-w-4xl text-3xl font-bold text-brand-navy md:text-4xl">
            Useful education content should lead readers into product and support pages.
          </h2>
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

      <section className="section-y bg-white">
        <div className="container-page grid gap-8 lg:grid-cols-[0.85fr_1.15fr]">
          <div>
            <p className="eyebrow">B2B Center</p>
            <h2 className="mt-3 text-3xl font-bold text-brand-navy md:text-4xl">Business buyers need a different path than retail customers.</h2>
            <p className="mt-4 text-base leading-7 text-slate-600">
              Wholesale, OEM / ODM, distributor, catalog, and RFQ pages are separated so international buyers can evaluate AULEXMED more efficiently.
            </p>
            <Link href="/b2b" className="mt-6 inline-flex rounded-md bg-brand-blue px-5 py-3 text-sm font-semibold text-white hover:bg-brand-navy">
              Open B2B Center
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {b2bPaths.map((path) => (
              <Link key={path.href} href={path.href} className="rounded-lg border border-brand-line bg-slate-50 p-5 hover:border-brand-blue">
                <h3 className="font-semibold text-brand-navy">{path.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{path.body}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section-y bg-slate-50">
        <div className="container-page">
          <p className="eyebrow">Version 1.1 Infrastructure Direction</p>
          <h2 className="mt-3 max-w-4xl text-3xl font-bold text-brand-navy md:text-4xl">
            Keep the deployment path clean before adding heavier systems.
          </h2>
          <div className="mt-8 grid gap-3 md:grid-cols-5">
            {homeInfrastructureSteps.map((step, index) => (
              <div key={step} className="rounded-lg border border-brand-line bg-white p-5">
                <p className="text-xs font-bold text-brand-blue">{String(index + 1).padStart(2, "0")}</p>
                <p className="mt-3 text-sm font-semibold leading-6 text-brand-navy">{step}</p>
              </div>
            ))}
          </div>
          <p className="mt-5 max-w-3xl text-sm leading-6 text-slate-600">
            Email provider selection is intentionally postponed. Google Workspace remains a future option, but it should not block homepage, product, support, SEO, B2B, or deployment work.
          </p>
        </div>
      </section>

      <CTASection
        eyebrow="Next Step"
        title="Explore products, find support, or start a B2B inquiry."
        body="Version 1.1 keeps the platform practical: no checkout yet, no email system decision yet, and no unnecessary services before the deployment and content foundation are stable."
        primaryHref="/products"
        primaryLabel="Explore Products"
        secondaryHref="/b2b/request-quotation"
        secondaryLabel="Request a Quote"
      />
    </>
  );
}
