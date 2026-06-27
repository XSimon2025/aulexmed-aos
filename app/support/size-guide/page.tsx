import Link from "next/link";
import { Breadcrumb } from "@/components/Breadcrumb";
import { sizeGuideGroups } from "@/data/support";
import { buildMetadata, siteConfig } from "@/lib/site";

export const metadata = buildMetadata({
  title: "AULEXMED Size Guide",
  description: "AULEXMED central size guide for knee braces, ankle braces, walking boots, back support, wrist support, and finger support.",
  path: "/support/size-guide"
});

export default function SizeGuidePage() {
  const mailto = `mailto:${siteConfig.email}?subject=AULEXMED%20Size%20Guide%20Question&body=Product%20SKU:%0AMeasurements:%0ACountry:%0AQuestion:%0A`;

  return (
    <>
      <section className="bg-white py-10">
        <div className="container-page">
          <Breadcrumb items={[{ href: "/support", label: "Support Center" }, { label: "Size Guide" }]} />
          <p className="eyebrow mt-6">Size Guide</p>
          <h1 className="mt-3 text-4xl font-bold text-brand-navy">Central size guide</h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600">
            Use the category guidance below as a starting point, then check the product page or contact support with your SKU and measurements.
          </p>
        </div>
      </section>

      <section className="section-y bg-slate-50">
        <div className="container-page grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {sizeGuideGroups.map((group) => (
            <article key={group.title} className="rounded-lg border border-brand-line bg-white p-6">
              <h2 className="text-xl font-bold text-brand-navy">{group.title}</h2>
              <p className="mt-3 text-sm leading-6 text-slate-600">{group.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section-y bg-white">
        <div className="container-page rounded-lg border border-brand-line bg-brand-sky p-6 md:p-8">
          <h2 className="text-2xl font-bold text-brand-navy">Not sure which size to choose?</h2>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">
            Send your product SKU and measurements before purchase. The support team can help route your question to the right size chart.
          </p>
          <Link href={mailto} className="mt-5 inline-flex rounded-md bg-brand-blue px-5 py-3 text-sm font-semibold text-white hover:bg-brand-navy">
            Ask About Sizing
          </Link>
        </div>
      </section>
    </>
  );
}
