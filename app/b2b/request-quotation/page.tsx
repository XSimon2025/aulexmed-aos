import Link from "next/link";
import { Breadcrumb } from "@/components/Breadcrumb";
import { rfqChecklist, buildB2BMailto } from "@/data/b2b";
import { buildMetadata, siteConfig } from "@/lib/site";

export const metadata = buildMetadata({
  title: "Request AULEXMED B2B Quotation",
  description:
    "Request an AULEXMED B2B quotation for orthopedic brace wholesale, OEM / ODM, distributor orders, samples, packaging, and catalog planning.",
  path: "/b2b/request-quotation"
});

export default function RequestQuotationPage() {
  const mailto = buildB2BMailto("AULEXMED B2B Quotation Request", [
    "Company:",
    "Country:",
    "Product category or SKU:",
    "Estimated quantity:",
    "Sales channel:",
    "Customization needs:",
    "Required documents:",
    "Expected sample or delivery timeline:",
    "Questions:"
  ]);

  return (
    <>
      <section className="bg-white py-10">
        <div className="container-page">
          <Breadcrumb items={[{ href: "/b2b", label: "B2B" }, { label: "Request Quotation" }]} />
          <p className="eyebrow mt-6">Request Quotation</p>
          <h1 className="mt-3 max-w-4xl text-4xl font-bold text-brand-navy md:text-5xl">
            Send a complete B2B inquiry for faster quotation.
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600">
            Use the prepared email template to send enough information for product matching, sample planning, packaging review, and quotation discussion.
          </p>
          <Link href={mailto} className="mt-8 inline-flex rounded-md bg-brand-blue px-6 py-3 text-sm font-semibold text-white hover:bg-brand-navy">
            Open RFQ Email Template
          </Link>
        </div>
      </section>

      <section className="section-y bg-slate-50">
        <div className="container-page grid gap-8 lg:grid-cols-[0.85fr_1.15fr]">
          <div>
            <p className="eyebrow">RFQ Checklist</p>
            <h2 className="mt-3 text-3xl font-bold text-brand-navy">Include these details</h2>
            <p className="mt-4 text-sm leading-6 text-slate-600">
              More complete requests reduce back-and-forth before sample, price, packaging, and timeline discussion.
            </p>
          </div>
          <div className="grid gap-3">
            {rfqChecklist.map((item) => (
              <div key={item} className="rounded-md border border-brand-line bg-white px-4 py-3 text-sm font-semibold text-slate-700">
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-y bg-white">
        <div className="container-page rounded-lg border border-brand-line bg-brand-sky p-6 md:p-8">
          <h2 className="text-2xl font-bold text-brand-navy">Email contact</h2>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            Send RFQ details to{" "}
            <a href={`mailto:${siteConfig.email}`} className="font-semibold text-brand-blue">
              {siteConfig.email}
            </a>
            .
          </p>
        </div>
      </section>
    </>
  );
}
