import Image from "next/image";
import Link from "next/link";
import { Breadcrumb } from "@/components/Breadcrumb";
import { capabilityItems } from "@/data/brand";
import { categories } from "@/data/categories";
import { buildMetadata } from "@/lib/site";

export const metadata = buildMetadata({
  title: "AULEXMED Factory Capability",
  description:
    "AULEXMED factory capability overview for orthopedic support product categories, OEM / ODM cooperation, and B2B supply discussions.",
  path: "/factory"
});

export default function FactoryPage() {
  return (
    <>
      <section className="bg-white py-10">
        <div className="container-page">
          <Breadcrumb items={[{ label: "Factory Capability" }]} />
          <div className="mt-8 grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
            <div>
              <p className="eyebrow">Factory Capability</p>
              <h1 className="mt-3 text-4xl font-bold tracking-tight text-brand-navy md:text-5xl">
                Manufacturing capability for orthopedic support product lines.
              </h1>
              <p className="mt-5 text-base leading-7 text-slate-600">
                The factory capability page gives B2B buyers a fast overview before they request samples, packaging support, private label work, or
                quotation details. Final certificates, factory photos, and downloadable catalogs can be added as approved assets become ready.
              </p>
              <Link href="/b2b#request-quotation" className="mt-8 inline-flex rounded-md bg-brand-blue px-6 py-3 text-sm font-semibold text-white hover:bg-brand-navy">
                Request Quotation
              </Link>
            </div>
            <div className="relative min-h-[340px] overflow-hidden rounded-lg border border-brand-line bg-brand-sky shadow-soft">
              <Image src="/brand/hero.jpg" alt="AULEXMED product and factory capability presentation" fill sizes="(min-width: 1024px) 48vw, 100vw" className="object-cover" />
            </div>
          </div>
        </div>
      </section>

      <section className="section-y bg-slate-50">
        <div className="container-page">
          <p className="eyebrow">Capability Snapshot</p>
          <h2 className="mt-3 text-3xl font-bold text-brand-navy md:text-4xl">Information B2B buyers check first</h2>
          <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {capabilityItems.map((item) => (
              <div key={item} className="rounded-lg border border-brand-line bg-white p-5 text-sm font-semibold leading-6 text-slate-700">
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-y bg-white">
        <div className="container-page">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="eyebrow">Product Coverage</p>
              <h2 className="mt-3 text-3xl font-bold text-brand-navy md:text-4xl">Category range prepared for catalog expansion</h2>
            </div>
            <Link href="/products" className="text-sm font-semibold text-brand-blue hover:text-brand-navy">
              View catalog
            </Link>
          </div>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {categories.map((category) => (
              <Link key={category.slug} href={`/products/${category.slug}`} className="rounded-lg border border-brand-line bg-slate-50 p-5 hover:border-brand-blue">
                <h3 className="font-bold text-brand-navy">{category.name}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-600">{category.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
