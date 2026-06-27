import Image from "next/image";
import Link from "next/link";
import { categories } from "@/data/categories";
import { buildMetadata, siteConfig } from "@/lib/site";

export const metadata = buildMetadata({
  title: "AULEXMED | Back to Life. One Step at a Time.",
  description:
    "AULEXMED is an international orthopedic rehabilitation brand helping people return to everyday life with confidence, support, and clear product guidance."
});

const supportEntries = [
  { title: "User Manuals", href: "/support/manuals", body: "Find SKU-based product guidance." },
  { title: "Size Guide", href: "/support/size-guide", body: "Measure before choosing support." },
  { title: "Contact Support", href: "/support/contact-support", body: "Get help with product questions." }
];

const featuredProducts = [
  {
    sku: "BL-52036",
    title: "Walking Boot 52036",
    body: "A short air walking boot for confident daily movement.",
    image: "/catalog/52036.jpg",
    href: "/products/walking-boots/bl-52036-short-air-walking-boot"
  },
  {
    sku: "BL-42001",
    title: "ROM Knee Brace 42001",
    body: "Structured knee support for controlled rehabilitation training.",
    image: "/catalog/42001.jpg",
    href: "/products/knee-braces/bl-42001-adjustable-rom-knee-brace"
  },
  {
    sku: "BL-42008",
    title: "Knee Brace 42008",
    body: "Everyday knee support with a stable, adjustable fit.",
    image: "/catalog/42008.jpg",
    href: "/products/knee-braces/bl-42008-knee-stabilizer-brace"
  }
];

const trustMetrics = [
  "20+ years manufacturing experience",
  "2,550 m² production facility",
  "180,000+ units monthly capacity",
  "OEM / ODM cooperation"
];

const certifications = [
  {
    title: "CE",
    body: "European market compliance preparation for qualified product and business review."
  },
  {
    title: "FDA",
    body: "Documentation readiness for buyers evaluating U.S. market requirements."
  },
  {
    title: "EUDAMED",
    body: "Traceability and regulatory readiness for European medical device conversations."
  },
  {
    title: "ISO 13485",
    body: "Quality management practices for medical device manufacturing and repeatable production."
  }
];

export default function HomePage() {
  return (
    <>
      <section className="relative isolate min-h-[calc(100vh-122px)] overflow-hidden bg-white">
        <Image
          src="/brand/homepage-hero-52036.png"
          alt="AULEXMED Walking Boot 52036 supporting a confident return to daily life"
          fill
          priority
          sizes="100vw"
          className="object-cover object-[62%_center]"
        />
        <div className="absolute inset-0 bg-white/78 sm:bg-gradient-to-r sm:from-white sm:via-white/82 sm:to-white/8" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-white to-white/0" />

        <div className="container-page relative flex min-h-[calc(100vh-122px)] items-center py-20 sm:py-24 lg:py-28">
          <div className="max-w-2xl">
            <p className="eyebrow">AULEXMED Official Brand</p>
            <h1 className="mt-5 text-5xl font-bold tracking-tight text-brand-navy sm:text-6xl lg:text-7xl">
              Back to Life. One Step at a Time.
            </h1>
            <p className="mt-7 max-w-xl text-lg leading-8 text-slate-600">
              We build more than orthopedic support. We build confidence for every journey back to everyday movement, work, family, and life.
            </p>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <Link href="/products" className="rounded-md bg-brand-blue px-7 py-3.5 text-center text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-brand-navy">
                Explore Support Products
              </Link>
              <Link href="/support" className="rounded-md border border-brand-line bg-white/80 px-7 py-3.5 text-center text-sm font-semibold text-brand-navy backdrop-blur transition hover:-translate-y-0.5 hover:border-brand-blue">
                Get Product Support
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-20 sm:py-24">
        <div className="container-page grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
          <div>
            <p className="eyebrow">Support First</p>
            <h2 className="mt-4 max-w-3xl text-3xl font-bold tracking-tight text-brand-navy sm:text-4xl">
              Clear help after every purchase.
            </h2>
            <p className="mt-5 max-w-2xl text-base leading-7 text-slate-600">
              Product owners often arrive from package cards, marketplace orders, or sizing questions. The support center gives them a direct path without noise.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            {supportEntries.map((entry) => (
              <Link key={entry.title} href={entry.href} className="group rounded-lg border border-brand-line bg-slate-50 p-5 transition hover:-translate-y-1 hover:border-brand-blue hover:bg-white hover:shadow-soft">
                <h3 className="text-base font-bold text-brand-navy">{entry.title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-600">{entry.body}</p>
                <span className="mt-5 inline-flex text-sm font-semibold text-brand-blue">Open</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-slate-50 py-24 sm:py-28">
        <div className="container-page">
          <div className="max-w-3xl">
            <p className="eyebrow">Orthopedic Support</p>
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-brand-navy sm:text-5xl">
              Products are the bridge. Life is the destination.
            </h2>
          </div>

          <div className="mt-12 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="relative min-h-[420px] overflow-hidden rounded-lg bg-white shadow-soft">
              <Image
                src="/brand/homepage-rehab-42001.png"
                alt="AULEXMED ROM Knee Brace 42001 used during rehabilitation training"
                fill
                sizes="(min-width: 1024px) 58vw, 100vw"
                className="object-cover"
              />
            </div>
            <div className="grid gap-4">
              {featuredProducts.map((product) => (
                <Link key={product.sku} href={product.href} className="grid grid-cols-[112px_1fr] gap-5 rounded-lg border border-brand-line bg-white p-4 transition hover:-translate-y-1 hover:border-brand-blue hover:shadow-soft">
                  <div className="relative aspect-square rounded-md bg-slate-50">
                    <Image src={product.image} alt={product.title} fill sizes="112px" className="object-contain p-4" />
                  </div>
                  <div className="self-center">
                    <p className="text-xs font-semibold uppercase tracking-wide text-brand-blue">{product.sku}</p>
                    <h3 className="mt-2 text-lg font-bold text-brand-navy">{product.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-600">{product.body}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <div className="mt-10 flex flex-wrap gap-3">
            {categories.slice(0, 5).map((category) => (
              <Link key={category.slug} href={`/products/${category.slug}`} className="rounded-full border border-brand-line bg-white px-5 py-2.5 text-sm font-semibold text-brand-navy transition hover:border-brand-blue hover:text-brand-blue">
                {category.name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-24 sm:py-28">
        <div className="container-page grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
          <div>
            <p className="eyebrow">Manufacturer Trust</p>
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-brand-navy sm:text-5xl">
              Built for product owners, distributors, and international buyers.
            </h2>
            <p className="mt-6 max-w-xl text-base leading-7 text-slate-600">
              AULEXMED combines orthopedic product development, manufacturing capability, support documentation, and OEM / ODM cooperation in one long-term brand platform.
            </p>
            <Link href="/b2b" className="mt-8 inline-flex rounded-md bg-brand-navy px-6 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-brand-blue">
              View Manufacturer Capability
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {trustMetrics.map((metric) => (
              <div key={metric} className="rounded-lg border border-brand-line bg-slate-50 p-6">
                <p className="text-lg font-bold text-brand-navy">{metric}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-brand-navy py-24 text-white sm:py-28">
        <div className="container-page">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-200">Certifications</p>
            <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-5xl">
              Trust signals for global rehabilitation markets.
            </h2>
          </div>
          <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {certifications.map((item) => (
              <article key={item.title} className="rounded-lg border border-white/15 bg-white/[0.06] p-6 backdrop-blur">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-sky-100 text-sm font-bold text-brand-navy">
                  {item.title.slice(0, 2)}
                </div>
                <h3 className="mt-6 text-xl font-bold">{item.title}</h3>
                <p className="mt-4 text-sm leading-6 text-slate-200">{item.body}</p>
              </article>
            ))}
          </div>
          <div className="mt-12 max-w-3xl border-t border-white/15 pt-8 text-2xl font-semibold leading-10 text-slate-100">
            AULEXMED builds confidence for every journey back to life.
          </div>
        </div>
      </section>
    </>
  );
}
