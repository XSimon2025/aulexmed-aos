import Link from "next/link";
import { Breadcrumb } from "@/components/Breadcrumb";
import { certificateDocuments } from "@/data/brand";
import { buildB2BMailto } from "@/data/b2b";
import { buildMetadata } from "@/lib/site";

export const metadata = buildMetadata({
  title: "AULEXMED Catalog Download",
  description:
    "AULEXMED B2B catalog request page for orthopedic support catalog, SKU list, factory profile, and approved business documents.",
  path: "/b2b/catalog-download"
});

export default function CatalogDownloadPage() {
  const mailto = buildB2BMailto("AULEXMED Catalog Request", [
    "Company:",
    "Country:",
    "Interested categories:",
    "Sales channel:",
    "Catalog / document needs:",
    "Questions:"
  ]);

  return (
    <>
      <section className="bg-white py-10">
        <div className="container-page">
          <Breadcrumb items={[{ href: "/b2b", label: "B2B" }, { label: "Catalog Download" }]} />
          <p className="eyebrow mt-6">Catalog Download</p>
          <h1 className="mt-3 max-w-4xl text-4xl font-bold text-brand-navy md:text-5xl">
            Catalog and document center for B2B review.
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600">
            Request catalog, SKU list, factory profile, and approved business documents for distributor, wholesale, and OEM / ODM review.
          </p>
          <Link href={mailto} className="mt-8 inline-flex rounded-md bg-brand-blue px-6 py-3 text-sm font-semibold text-white hover:bg-brand-navy">
            Request Catalog by Email
          </Link>
        </div>
      </section>

      <section className="section-y bg-slate-50">
        <div className="container-page grid gap-5 md:grid-cols-2">
          {certificateDocuments.map((item) => (
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
    </>
  );
}
