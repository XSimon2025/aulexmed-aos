import Link from "next/link";
import { Breadcrumb } from "@/components/Breadcrumb";
import { manuals } from "@/data/manuals";
import { buildMetadata, siteConfig } from "@/lib/site";

export const metadata = buildMetadata({
  title: "AULEXMED User Manuals",
  description: "Find AULEXMED user manual placeholders by SKU and request the correct manual for knee braces, walking boots, ankle braces, and more.",
  path: "/support/manuals"
});

export default function ManualsPage() {
  const mailto = `mailto:${siteConfig.email}?subject=AULEXMED%20Manual%20Request&body=Product%20SKU:%0APurchase%20platform:%0ACountry:%0AQuestion:%0A`;

  return (
    <>
      <section className="bg-white py-10">
        <div className="container-page">
          <Breadcrumb items={[{ href: "/support", label: "Support Center" }, { label: "User Manuals" }]} />
          <p className="eyebrow mt-6">Manuals</p>
          <h1 className="mt-3 text-4xl font-bold text-brand-navy">User manual download center</h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600">
            Match the SKU on your product, package, or instruction card. Approved PDFs can be added here as final files become ready.
          </p>
        </div>
      </section>

      <section className="section-y bg-slate-50">
        <div className="container-page grid gap-4">
          {manuals.map((manual) => (
            <article key={manual.sku} className="grid gap-4 rounded-lg border border-brand-line bg-white p-5 md:grid-cols-[1fr_auto] md:items-center">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-brand-blue">{manual.category}</p>
                <h2 className="mt-2 text-xl font-bold text-brand-navy">{manual.title}</h2>
                <p className="mt-1 text-sm text-slate-500">{manual.sku}</p>
              </div>
              <button className="rounded-md border border-brand-line px-4 py-2 text-sm font-semibold text-slate-500" disabled>
                {manual.status}
              </button>
            </article>
          ))}
        </div>
      </section>

      <section className="section-y bg-white">
        <div className="container-page rounded-lg border border-brand-line bg-brand-sky p-6 md:p-8">
          <h2 className="text-2xl font-bold text-brand-navy">Cannot find your SKU?</h2>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">
            Send your product SKU and purchase channel so the support team can point you to the right manual or product page.
          </p>
          <Link href={mailto} className="mt-5 inline-flex rounded-md bg-brand-blue px-5 py-3 text-sm font-semibold text-white hover:bg-brand-navy">
            Request a Manual
          </Link>
        </div>
      </section>
    </>
  );
}
