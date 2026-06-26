import Link from "next/link";
import { Breadcrumb } from "@/components/Breadcrumb";
import { categories } from "@/data/categories";
import { buildB2BMailto } from "@/data/b2b";
import { buildMetadata } from "@/lib/site";

export const metadata = buildMetadata({
  title: "AULEXMED Distributor Program",
  description:
    "AULEXMED distributor program page for local market partners, product category planning, catalog review, and long-term orthopedic support supply.",
  path: "/b2b/distributor-program"
});

const partnerFit = [
  "Local distributors building a multi-category orthopedic support catalog",
  "Retail suppliers with clinic, rehab, pharmacy, or marketplace channels",
  "Partners who need product documentation and support content",
  "Buyers who can plan repeat orders and market-specific product selection"
];

export default function DistributorProgramPage() {
  const mailto = buildB2BMailto("AULEXMED Distributor Program Inquiry", [
    "Company:",
    "Country / region:",
    "Current sales channels:",
    "Product categories of interest:",
    "Estimated first order quantity:",
    "Distributor questions:"
  ]);

  return (
    <>
      <section className="bg-white py-10">
        <div className="container-page">
          <Breadcrumb items={[{ href: "/b2b", label: "B2B" }, { label: "Distributor Program" }]} />
          <p className="eyebrow mt-6">Distributor Program</p>
          <h1 className="mt-3 max-w-4xl text-4xl font-bold text-brand-navy md:text-5xl">
            Build a local AULEXMED product catalog with long-term supply planning.
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600">
            Distributor conversations should focus on market fit, product line selection, content support, packaging needs, and repeat supply expectations.
          </p>
          <Link href={mailto} className="mt-8 inline-flex rounded-md bg-brand-blue px-6 py-3 text-sm font-semibold text-white hover:bg-brand-navy">
            Email Distributor Inquiry
          </Link>
        </div>
      </section>

      <section className="section-y bg-slate-50">
        <div className="container-page grid gap-5 md:grid-cols-2">
          {partnerFit.map((item) => (
            <div key={item} className="rounded-lg border border-brand-line bg-white p-6 text-sm font-semibold leading-6 text-slate-700">
              {item}
            </div>
          ))}
        </div>
      </section>

      <section className="section-y bg-white">
        <div className="container-page">
          <p className="eyebrow">Distributor Catalog Planning</p>
          <h2 className="mt-3 text-3xl font-bold text-brand-navy">Categories ready for market discussion</h2>
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
