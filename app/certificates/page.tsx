import Link from "next/link";
import { Breadcrumb } from "@/components/Breadcrumb";
import { CTASection } from "@/components/CTASection";
import { certificatePlaceholders } from "@/data/brand";
import { buildMetadata } from "@/lib/site";

export const metadata = buildMetadata({
  title: "AULEXMED Certificates",
  description:
    "AULEXMED certificate and document center placeholder for approved business, product compliance, factory capability, and B2B catalog files.",
  path: "/certificates"
});

export default function CertificatesPage() {
  return (
    <>
      <section className="bg-white py-10">
        <div className="container-page">
          <Breadcrumb items={[{ label: "Certificates" }]} />
          <div className="mt-8 max-w-4xl">
            <p className="eyebrow">Certificates & Documents</p>
            <h1 className="mt-3 text-4xl font-bold tracking-tight text-brand-navy md:text-5xl">
              A structured place for verified AULEXMED documents.
            </h1>
            <p className="mt-5 text-base leading-7 text-slate-600">
              This page is prepared for approved certificates, compliance documents, factory files, and B2B catalog downloads. Only verified files
              should be published here after the final public version is confirmed.
            </p>
          </div>
        </div>
      </section>

      <section className="section-y bg-slate-50">
        <div className="container-page grid gap-5 md:grid-cols-2">
          {certificatePlaceholders.map((item) => (
            <article key={item.title} className="rounded-lg border border-brand-line bg-white p-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h2 className="text-xl font-bold text-brand-navy">{item.title}</h2>
                <span className="rounded-full bg-brand-sky px-3 py-1 text-xs font-semibold text-brand-blue">{item.status}</span>
              </div>
              <p className="mt-4 text-sm leading-6 text-slate-600">{item.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section-y bg-white">
        <div className="container-page rounded-lg border border-brand-line bg-slate-50 p-6 md:p-8">
          <p className="eyebrow">Document Policy</p>
          <h2 className="mt-3 text-2xl font-bold text-brand-navy md:text-3xl">Use placeholders until approved files are ready</h2>
          <p className="mt-4 max-w-3xl text-sm leading-6 text-slate-600">
            The first version should avoid uploading unverified documents. When approved PDFs are ready, they can be placed in `public/downloads/`
            and linked from this page and the B2B catalog area.
          </p>
          <Link href="/b2b#request-quotation" className="mt-6 inline-flex text-sm font-semibold text-brand-blue hover:text-brand-navy">
            Request documents for B2B review
          </Link>
        </div>
      </section>

      <CTASection
        eyebrow="B2B Documents"
        title="Need catalog, capability, or compliance information?"
        body="Send a quotation request with your target market and document needs so the team can respond with the appropriate files."
        primaryHref="/b2b#request-quotation"
        primaryLabel="Request Documents"
        secondaryHref="/factory"
        secondaryLabel="View Factory Capability"
      />
    </>
  );
}
