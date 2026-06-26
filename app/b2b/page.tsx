import Image from "next/image";
import Link from "next/link";
import { Breadcrumb } from "@/components/Breadcrumb";
import { b2bPaths } from "@/data/b2b";
import { categories } from "@/data/categories";
import { products } from "@/data/products";
import { buildMetadata, siteConfig } from "@/lib/site";

export const metadata = buildMetadata({
  title: "Orthopedic Brace Manufacturer, Wholesale, OEM / ODM",
  description:
    "AULEXMED B2B inquiry page for orthopedic brace wholesale, private label, OEM / ODM customization, catalog requests, and quotation preparation.",
  path: "/b2b"
});

const buyerTypes = [
  {
    title: "Importers & Distributors",
    body: "Compare supplier capability, product range, packaging support, and stable communication before building a local catalog."
  },
  {
    title: "Retail & Marketplace Sellers",
    body: "Prepare product photos, instruction cards, package inserts, user manuals, and channel-ready SKU information."
  },
  {
    title: "Private Label Brands",
    body: "Discuss logo placement, color, packaging, product card content, size chart format, and market positioning."
  },
  {
    title: "Clinics, Rehab Suppliers & B2B Buyers",
    body: "Source practical support products with clear specifications, repeatable sizing, and straightforward after-sales documentation."
  }
];

const factoryFacts = [
  "Xiamen Benli Medical Technology Co., Ltd.",
  "2,550 m² manufacturing facility",
  "180,000+ units monthly production capacity referenced by current website",
  "200,000+ pieces in stock referenced by current website",
  "Orthopedic braces from neck to foot",
  "OEM and customized development support"
];

const customOptions = [
  {
    title: "Product Selection",
    points: ["Walking boots", "Knee braces", "Ankle braces", "Back and waist support", "Wrist and finger support"]
  },
  {
    title: "Branding & Packaging",
    points: ["Logo placement", "Color direction", "Retail box", "Product card", "Instruction insert"]
  },
  {
    title: "Content Support",
    points: ["Size guide", "How-to-wear steps", "Product specification sheet", "Manual placeholder", "Marketplace image set"]
  },
  {
    title: "Order Planning",
    points: ["Target market", "Quantity range", "Sample request", "Packaging requirements", "Shipping destination"]
  }
];

const cooperationSteps = [
  {
    step: "01",
    title: "Send Requirement",
    body: "Share product category, target channel, quantity range, destination country, packaging needs, and any reference product."
  },
  {
    step: "02",
    title: "Confirm Product Match",
    body: "We match existing SKUs first, then discuss color, logo, packaging, manuals, or structural adjustments if needed."
  },
  {
    step: "03",
    title: "Sample & Quotation",
    body: "Sample, unit price, package details, and timeline can be discussed after specifications are clear."
  },
  {
    step: "04",
    title: "Bulk Order Preparation",
    body: "Finalize product details, packaging files, shipment plan, and after-sales content before production or fulfillment."
  }
];

const rfqChecklist = [
  "Product category or SKU",
  "Estimated order quantity",
  "Target market or country",
  "Sales channel: distributor, retail, Amazon, TikTok, clinic, or wholesale",
  "Branding needs: logo, color, box, insert, manual",
  "Required documents or test reports, if any",
  "Expected sample or delivery timeline"
];

export default function B2BPage() {
  const mailto = `mailto:${siteConfig.email}?subject=AULEXMED%20B2B%20Quotation%20Request&body=Product%20category%20or%20SKU:%0AQuantity:%0ATarget%20market:%0ASales%20channel:%0ACustomization%20needs:%0ARequired%20documents:%0ATimeline:%0A`;

  return (
    <>
      <section className="bg-white py-10">
        <div className="container-page">
          <Breadcrumb items={[{ label: "B2B" }]} />
          <div className="mt-8 grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
            <div>
              <p className="eyebrow">Manufacturer Cooperation</p>
              <h1 className="mt-3 text-4xl font-bold tracking-tight text-brand-navy md:text-5xl">
                Orthopedic brace wholesale, private label, and OEM / ODM support.
              </h1>
              <p className="mt-5 max-w-3xl text-base leading-7 text-slate-600">
                B2B buyers usually do not come here to buy one item. They need to know whether AULEXMED can support repeatable supply,
                customization, packaging, product documentation, and a clear quotation workflow.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link href="/b2b/request-quotation" className="rounded-md bg-brand-blue px-6 py-3 text-center text-sm font-semibold text-white hover:bg-brand-navy">
                  Request Quotation
                </Link>
                <Link href="/b2b/oem-odm" className="rounded-md border border-brand-line px-6 py-3 text-center text-sm font-semibold text-brand-navy hover:border-brand-blue">
                  View Custom Options
                </Link>
              </div>
            </div>
            <div className="relative min-h-[340px] overflow-hidden rounded-lg border border-brand-line bg-brand-sky shadow-soft">
              <Image
                src="/brand/hero.jpg"
                alt="AULEXMED orthopedic brace product and manufacturing presentation"
                fill
                priority
                sizes="(min-width: 1024px) 45vw, 100vw"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="section-y bg-slate-50">
        <div className="container-page">
          <p className="eyebrow">B2B Buyer Paths</p>
          <h2 className="mt-3 text-3xl font-bold text-brand-navy md:text-4xl">Choose the right cooperation path</h2>
          <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-5">
            {b2bPaths.map((path) => (
              <Link key={path.href} href={path.href} className="rounded-lg border border-brand-line bg-white p-5 hover:border-brand-blue">
                <h3 className="font-bold text-brand-navy">{path.title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-600">{path.body}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section-y bg-white">
        <div className="container-page">
          <p className="eyebrow">Who This Page Is For</p>
          <h2 className="mt-3 text-3xl font-bold text-brand-navy md:text-4xl">Different from retail product pages</h2>
          <p className="mt-4 max-w-3xl text-sm leading-6 text-slate-600">
            Retail visitors compare one product and where to buy it. B2B visitors compare supplier fit, cooperation risk,
            customization ability, and whether the product line can support their market.
          </p>
          <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {buyerTypes.map((buyer) => (
              <article key={buyer.title} className="rounded-lg border border-brand-line bg-white p-6">
                <h3 className="text-lg font-bold text-brand-navy">{buyer.title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-600">{buyer.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section-y bg-slate-50">
        <div className="container-page grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="eyebrow">Factory Capability</p>
            <h2 className="mt-3 text-3xl font-bold text-brand-navy md:text-4xl">Direct from manufacturer, built for long-term supply.</h2>
            <p className="mt-4 text-sm leading-6 text-slate-600">
              The current AULEXMED website presents Benli Medical as a brace manufacturer with orthopedic support products across multiple body areas.
              This B2B page turns that information into a clearer buyer decision path.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {factoryFacts.map((fact) => (
              <div key={fact} className="rounded-md border border-brand-line bg-slate-50 px-4 py-4 text-sm font-semibold leading-6 text-slate-700">
                {fact}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-y bg-white">
        <div className="container-page">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="eyebrow">Product Lines</p>
              <h2 className="mt-3 text-3xl font-bold text-brand-navy md:text-4xl">Core orthopedic support categories</h2>
            </div>
            <Link href="/products" className="text-sm font-semibold text-brand-blue hover:text-brand-navy">
              View product catalog
            </Link>
          </div>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
            {categories.map((category) => (
              <Link key={category.slug} href={`/products/${category.slug}`} className="rounded-lg border border-brand-line bg-white p-5 hover:border-brand-blue">
                <div className="relative aspect-square rounded-md bg-slate-50">
                  <Image src={category.image} alt={category.name} fill sizes="20vw" className="object-contain p-4" />
                </div>
                <h3 className="mt-4 font-bold text-brand-navy">{category.name}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{category.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section id="customization" className="section-y bg-slate-50">
        <div className="container-page">
          <p className="eyebrow">Customization Logic</p>
          <h2 className="mt-3 text-3xl font-bold text-brand-navy md:text-4xl">What B2B buyers usually need to confirm</h2>
          <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {customOptions.map((option) => (
              <article key={option.title} className="rounded-lg border border-brand-line bg-slate-50 p-6">
                <h3 className="text-lg font-bold text-brand-navy">{option.title}</h3>
                <ul className="mt-4 grid gap-2 text-sm leading-6 text-slate-600">
                  {option.points.map((point) => (
                    <li key={point}>• {point}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section-y bg-white">
        <div className="container-page grid gap-10 lg:grid-cols-[0.85fr_1.15fr]">
          <div>
            <p className="eyebrow">Cooperation Process</p>
            <h2 className="mt-3 text-3xl font-bold text-brand-navy md:text-4xl">From product match to quotation</h2>
            <p className="mt-4 text-sm leading-6 text-slate-600">
              The first goal is not checkout. It is to reduce back-and-forth and help buyers send enough information for a realistic quote.
            </p>
          </div>
          <div className="grid gap-4">
            {cooperationSteps.map((item) => (
              <article key={item.step} className="grid gap-4 rounded-lg border border-brand-line bg-white p-5 sm:grid-cols-[72px_1fr]">
                <div className="flex h-12 w-12 items-center justify-center rounded-md bg-brand-sky text-sm font-bold text-brand-blue">{item.step}</div>
                <div>
                  <h3 className="text-lg font-bold text-brand-navy">{item.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{item.body}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section-y bg-slate-50">
        <div className="container-page">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="eyebrow">Sample SKUs</p>
              <h2 className="mt-3 text-3xl font-bold text-brand-navy md:text-4xl">Start from existing products, then customize when needed</h2>
            </div>
            <Link href="/products" className="text-sm font-semibold text-brand-blue hover:text-brand-navy">
              Browse all products
            </Link>
          </div>
          <div className="mt-8 overflow-hidden rounded-lg border border-brand-line">
            <div className="grid bg-brand-navy px-5 py-3 text-sm font-semibold text-white md:grid-cols-[1fr_1fr_1fr]">
              <span>SKU</span>
              <span>Product</span>
              <span>Best B2B Use</span>
            </div>
            {products.slice(0, 5).map((product) => (
              <div key={product.slug} className="grid gap-1 border-t border-brand-line bg-white px-5 py-4 text-sm md:grid-cols-[1fr_1fr_1fr]">
                <Link href={`/products/${product.categorySlug}/${product.slug}`} className="font-semibold text-brand-blue">
                  {product.sku}
                </Link>
                <span className="font-semibold text-brand-navy">{product.name}</span>
                <span className="text-slate-600">Catalog, sample request, private label discussion</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="request-quotation" className="section-y bg-brand-sky">
        <div className="container-page grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="eyebrow">Request Quotation</p>
            <h2 className="mt-3 text-3xl font-bold text-brand-navy md:text-4xl">Send a complete inquiry for faster reply</h2>
            <p className="mt-4 text-sm leading-6 text-slate-600">
              This first version uses email instead of a backend form. The email button opens a prepared RFQ template so buyers can provide the right details.
            </p>
            <Link href={mailto} className="mt-6 inline-flex rounded-md bg-brand-blue px-5 py-3 text-sm font-semibold text-white hover:bg-brand-navy">
              Email Quotation Request
            </Link>
          </div>
          <div className="rounded-lg border border-brand-line bg-white p-6 md:p-8">
            <h3 className="text-xl font-bold text-brand-navy">RFQ checklist</h3>
            <ul className="mt-5 grid gap-3 text-sm leading-6 text-slate-600">
              {rfqChecklist.map((item) => (
                <li key={item}>• {item}</li>
              ))}
            </ul>
            <div className="mt-6 rounded-md bg-slate-50 p-4 text-sm leading-6 text-slate-600">
              Email:{" "}
              <a href={`mailto:${siteConfig.email}`} className="font-semibold text-brand-blue">
                {siteConfig.email}
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
