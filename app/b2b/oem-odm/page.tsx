import Link from "next/link";
import { Breadcrumb } from "@/components/Breadcrumb";
import { customizationOptions, buildB2BMailto } from "@/data/b2b";
import { buildMetadata } from "@/lib/site";

export const metadata = buildMetadata({
  title: "AULEXMED OEM / ODM Orthopedic Brace Support",
  description:
    "AULEXMED OEM / ODM page for private label orthopedic support products, packaging, logo, product cards, manuals, and catalog planning.",
  path: "/b2b/oem-odm"
});

export default function OEMODMPage() {
  const mailto = buildB2BMailto("AULEXMED OEM / ODM Inquiry", [
    "Company:",
    "Country:",
    "Product category or SKU:",
    "Customization needs:",
    "Logo / color / packaging requirements:",
    "Estimated quantity:",
    "Timeline:"
  ]);

  return (
    <>
      <section className="bg-white py-10">
        <div className="container-page">
          <Breadcrumb items={[{ href: "/b2b", label: "B2B" }, { label: "OEM / ODM" }]} />
          <p className="eyebrow mt-6">OEM / ODM</p>
          <h1 className="mt-3 max-w-4xl text-4xl font-bold text-brand-navy md:text-5xl">
            Private label and customization support for orthopedic braces.
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600">
            OEM / ODM buyers usually need more than price. They need product fit, branding scope, packaging requirements, content files, and production planning to be clear.
          </p>
          <Link href={mailto} className="mt-8 inline-flex rounded-md bg-brand-blue px-6 py-3 text-sm font-semibold text-white hover:bg-brand-navy">
            Email OEM / ODM Inquiry
          </Link>
        </div>
      </section>

      <section className="section-y bg-slate-50">
        <div className="container-page">
          <p className="eyebrow">Customization Scope</p>
          <h2 className="mt-3 text-3xl font-bold text-brand-navy">Start from existing SKUs, then confirm custom requirements</h2>
          <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {customizationOptions.map((option) => (
              <article key={option.title} className="rounded-lg border border-brand-line bg-white p-6">
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
        <div className="container-page rounded-lg border border-brand-line bg-brand-sky p-6 md:p-8">
          <h2 className="text-2xl font-bold text-brand-navy">Recommended next step</h2>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">
            Send reference products, target market, expected order size, and packaging direction. Existing AULEXMED SKUs can be matched before custom work is discussed.
          </p>
          <Link href="/b2b/request-quotation" className="mt-5 inline-flex text-sm font-semibold text-brand-blue hover:text-brand-navy">
            Prepare a quotation request
          </Link>
        </div>
      </section>
    </>
  );
}
