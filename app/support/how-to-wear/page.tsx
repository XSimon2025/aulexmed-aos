import Link from "next/link";
import { Breadcrumb } from "@/components/Breadcrumb";
import { howToWearSteps } from "@/data/support";
import { buildMetadata } from "@/lib/site";

export const metadata = buildMetadata({
  title: "How to Wear AULEXMED Support Products",
  description: "General how-to-wear guidance for AULEXMED orthopedic support products with safe, practical fit checks and links to product pages.",
  path: "/support/how-to-wear"
});

export default function HowToWearPage() {
  return (
    <>
      <section className="bg-white py-10">
        <div className="container-page">
          <Breadcrumb items={[{ href: "/support", label: "Support Center" }, { label: "How to Wear" }]} />
          <p className="eyebrow mt-6">How to Wear</p>
          <h1 className="mt-3 text-4xl font-bold text-brand-navy">General wearing guidance</h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600">
            Start with these practical fit checks, then use the product page or manual for SKU-specific details when available.
          </p>
        </div>
      </section>

      <section className="section-y bg-slate-50">
        <div className="container-page grid gap-4">
          {howToWearSteps.map((step, index) => (
            <article key={step} className="grid gap-4 rounded-lg border border-brand-line bg-white p-5 sm:grid-cols-[64px_1fr]">
              <div className="flex h-12 w-12 items-center justify-center rounded-md bg-brand-sky text-sm font-bold text-brand-blue">
                {String(index + 1).padStart(2, "0")}
              </div>
              <p className="text-sm leading-6 text-slate-700">{step}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section-y bg-white">
        <div className="container-page rounded-lg border border-brand-line bg-slate-50 p-6 md:p-8">
          <h2 className="text-2xl font-bold text-brand-navy">Need product-specific instructions?</h2>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">
            Use the product catalog to find your SKU. Each product page connects manuals, size guidance, FAQ, and how-to-wear support.
          </p>
          <Link href="/products" className="mt-5 inline-flex text-sm font-semibold text-brand-blue hover:text-brand-navy">
            Browse product pages
          </Link>
        </div>
      </section>
    </>
  );
}
