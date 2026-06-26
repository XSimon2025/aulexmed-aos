import Link from "next/link";
import { Breadcrumb } from "@/components/Breadcrumb";
import { categories } from "@/data/categories";
import { b2bBuyerNeeds, buildB2BMailto } from "@/data/b2b";
import { buildMetadata } from "@/lib/site";

export const metadata = buildMetadata({
  title: "AULEXMED Wholesale Orthopedic Support Products",
  description:
    "AULEXMED wholesale page for orthopedic support product sourcing, category planning, repeat supply, samples, and quotation preparation.",
  path: "/b2b/wholesale"
});

export default function WholesalePage() {
  const mailto = buildB2BMailto("AULEXMED Wholesale Inquiry", [
    "Company:",
    "Country:",
    "Product category or SKU:",
    "Estimated quantity:",
    "Sales channel:",
    "Timeline:",
    "Questions:"
  ]);

  return (
    <>
      <section className="bg-white py-10">
        <div className="container-page">
          <Breadcrumb items={[{ href: "/b2b", label: "B2B" }, { label: "Wholesale" }]} />
          <p className="eyebrow mt-6">Wholesale</p>
          <h1 className="mt-3 max-w-4xl text-4xl font-bold text-brand-navy md:text-5xl">
            Wholesale orthopedic support products for repeatable supply.
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600">
            This page is for buyers who need category coverage, SKU selection, sample discussion, and clear quotation preparation instead of a single retail purchase.
          </p>
          <Link href={mailto} className="mt-8 inline-flex rounded-md bg-brand-blue px-6 py-3 text-sm font-semibold text-white hover:bg-brand-navy">
            Email Wholesale Inquiry
          </Link>
        </div>
      </section>

      <section className="section-y bg-slate-50">
        <div className="container-page">
          <p className="eyebrow">Wholesale Buyer Needs</p>
          <h2 className="mt-3 text-3xl font-bold text-brand-navy">What to confirm before quotation</h2>
          <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {b2bBuyerNeeds.map((item) => (
              <div key={item} className="rounded-lg border border-brand-line bg-white p-5 text-sm font-semibold leading-6 text-slate-700">
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-y bg-white">
        <div className="container-page">
          <p className="eyebrow">Category Coverage</p>
          <h2 className="mt-3 text-3xl font-bold text-brand-navy">Start with the current product catalog</h2>
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
