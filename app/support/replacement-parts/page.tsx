import Link from "next/link";
import { Breadcrumb } from "@/components/Breadcrumb";
import { buildMetadata, siteConfig } from "@/lib/site";

export const metadata = buildMetadata({
  title: "AULEXMED Replacement and Missing Parts",
  description: "Request support for AULEXMED replacement parts, missing parts, straps, liners, accessories, and package-related questions.",
  path: "/support/replacement-parts"
});

const partTypes = ["Straps", "Liners", "Fasteners", "Air pumps", "Pads", "Instruction inserts", "Other accessories"];

export default function ReplacementPartsPage() {
  const mailto = `mailto:${siteConfig.email}?subject=AULEXMED%20Replacement%20or%20Missing%20Parts&body=Product%20SKU:%0APurchase%20platform:%0AMissing%20or%20replacement%20part:%0ACountry:%0ADescription:%0A`;

  return (
    <>
      <section className="bg-white py-10">
        <div className="container-page">
          <Breadcrumb items={[{ href: "/support", label: "Support Center" }, { label: "Replacement / Missing Parts" }]} />
          <p className="eyebrow mt-6">Replacement / Missing Parts</p>
          <h1 className="mt-3 text-4xl font-bold text-brand-navy">Support for parts and package issues</h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600">
            Use this page when you need help identifying a missing accessory, damaged package component, or replacement part request path.
          </p>
        </div>
      </section>

      <section className="section-y bg-slate-50">
        <div className="container-page">
          <p className="eyebrow">Common Request Types</p>
          <h2 className="mt-3 text-3xl font-bold text-brand-navy">Parts to identify before support follow-up</h2>
          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {partTypes.map((part) => (
              <div key={part} className="rounded-md border border-brand-line bg-white px-4 py-4 text-sm font-semibold text-slate-700">
                {part}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-y bg-white">
        <div className="container-page rounded-lg border border-brand-line bg-brand-sky p-6 md:p-8">
          <h2 className="text-2xl font-bold text-brand-navy">Send a parts request</h2>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">
            Include SKU, purchase platform, country, the part you need, and photos of the product or package when possible.
          </p>
          <Link href={mailto} className="mt-5 inline-flex rounded-md bg-brand-blue px-5 py-3 text-sm font-semibold text-white hover:bg-brand-navy">
            Email Parts Support
          </Link>
        </div>
      </section>
    </>
  );
}
