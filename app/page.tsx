import Image from "next/image";
import Link from "next/link";
import { CategorySection } from "@/components/CategorySection";
import { CTASection } from "@/components/CTASection";
import { ProductCard } from "@/components/ProductCard";
import { b2bPaths } from "@/data/b2b";
import { guides } from "@/data/guides";
import { homeBrandValues, homePlatformSystems, homeTrustStats, homeUserJourneys } from "@/data/home";
import { products } from "@/data/products";
import { supportTopics } from "@/data/support";
import { siteConfig, buildMetadata } from "@/lib/site";

export const metadata = buildMetadata({
  title: "AULEXMED | Back to Life. One Step at a Time.",
  description: siteConfig.description
});

export default function HomePage() {
  return (
    <>
      <section className="overflow-hidden bg-white">
        <div className="container-page grid gap-10 py-12 lg:min-h-[720px] lg:grid-cols-[0.92fr_1.08fr] lg:items-center lg:py-16">
          <div className="relative z-10">
            <p className="eyebrow">AULEXMED Official Brand</p>
            <h1 className="mt-4 max-w-4xl text-4xl font-bold tracking-tight text-brand-navy sm:text-5xl lg:text-6xl">
              Back to Life. One Step at a Time.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
              Recovery is not only about healing. It is about returning to the life you love. AULEXMED builds practical orthopedic support for everyday confidence, movement, and progress.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/products/walking-boots/bl-52036-short-air-walking-boot" className="rounded-md bg-brand-blue px-6 py-3 text-center text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-brand-navy">
                View Walking Boot 52036
              </Link>
              <Link href="/products" className="rounded-md border border-brand-line px-6 py-3 text-center text-sm font-semibold text-brand-navy transition hover:-translate-y-0.5 hover:border-brand-blue">
                Explore Products
              </Link>
              <Link href="/support" className="rounded-md border border-brand-line px-6 py-3 text-center text-sm font-semibold text-brand-navy transition hover:-translate-y-0.5 hover:border-brand-blue">
                Visit Support Center
              </Link>
            </div>
            <div className="mt-10 grid gap-3 sm:grid-cols-2">
              {homeTrustStats.map((stat) => (
                <div key={stat} className="rounded-md border border-brand-line bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm">
                  {stat}
                </div>
              ))}
            </div>
          </div>
          <div className="relative min-h-[390px] overflow-hidden rounded-lg bg-brand-sky shadow-soft lg:min-h-[590px]">
            <Image
              src="/brand/back-to-life-hero.png"
              alt="AULEXMED walking boot supporting a confident return to daily life"
              fill
              priority
              sizes="(min-width: 1024px) 52vw, 100vw"
              className="object-cover"
            />
            <div className="absolute inset-y-0 left-0 w-2/5 bg-gradient-to-r from-white/90 to-white/0" />
            <div className="absolute inset-x-4 bottom-4 max-w-md rounded-lg border border-white/70 bg-white/90 p-5 shadow-sm backdrop-blur">
              <p className="text-xs font-semibold uppercase tracking-wide text-brand-blue">Every Step Is Progress</p>
              <p className="mt-2 text-sm font-semibold leading-6 text-brand-navy">
                Walking Boot 52036 appears as part of a larger story: helping people move back into everyday routines with confidence.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="section-y bg-slate-50">
        <div className="container-page">
          <p className="eyebrow">Brand Journey</p>
          <h2 className="mt-3 max-w-4xl text-3xl font-bold text-brand-navy md:text-4xl">
            From first product question to long-term support, every path should feel clear.
          </h2>
          <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {homeUserJourneys.map((journey) => (
              <Link key={journey.title} href={journey.href} className="rounded-lg border border-brand-line bg-white p-6 transition hover:-translate-y-1 hover:border-brand-blue hover:shadow-soft">
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
              <h2 className="mt-3 text-3xl font-bold text-brand-navy md:text-4xl">Orthopedic support products for everyday movement</h2>
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
          <p className="eyebrow">Official Website</p>
          <h2 className="mt-3 max-w-4xl text-3xl font-bold text-brand-navy md:text-4xl">
            One place for brand trust, product guidance, support resources, and business cooperation.
          </h2>
          <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {homePlatformSystems.map((system) => (
              <Link key={system.title} href={system.href} className="rounded-lg border border-brand-line bg-white p-6 transition hover:-translate-y-1 hover:border-brand-blue hover:shadow-soft">
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
            <h2 className="mt-3 text-3xl font-bold text-brand-navy md:text-4xl">Support that continues after purchase.</h2>
            <p className="mt-4 text-base leading-7 text-slate-600">
              Manuals, warranty information, size guidance, wearing steps, video tutorials, and contact paths help customers get clear answers faster.
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
            Useful education content helps customers choose support products with confidence.
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
            <h2 className="mt-3 text-3xl font-bold text-brand-navy md:text-4xl">International buyers need a manufacturer-level view.</h2>
            <p className="mt-4 text-base leading-7 text-slate-600">
              Wholesale, OEM / ODM, distributor, catalog, compliance, and RFQ paths help business buyers evaluate AULEXMED as a long-term orthopedic support partner.
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
        <div className="container-page grid gap-8 lg:grid-cols-[0.85fr_1.15fr]">
          <div>
            <p className="eyebrow">Brand Manifesto</p>
            <h2 className="mt-3 text-3xl font-bold text-brand-navy md:text-4xl">
              We build more than orthopedic support.
            </h2>
            <p className="mt-4 text-base leading-7 text-slate-600">
              We build confidence for every journey back to life. Products are the bridge between injury and everyday routines, not the destination.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {homeBrandValues.map((value) => (
              <div key={value} className="rounded-lg border border-brand-line bg-white p-5 text-sm font-semibold leading-6 text-brand-navy shadow-sm">
                {value}
              </div>
            ))}
          </div>
        </div>
      </section>

      <CTASection
        eyebrow="AULEXMED"
        title="Find the right support for your next step."
        body="Explore product categories, get help from the support center, or contact the AULEXMED team for wholesale and OEM / ODM cooperation."
        primaryHref="/products"
        primaryLabel="Explore Products"
        secondaryHref="/b2b/request-quotation"
        secondaryLabel="Request a Quote"
      />
    </>
  );
}
