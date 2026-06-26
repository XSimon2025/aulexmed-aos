import Link from "next/link";
import { Breadcrumb } from "@/components/Breadcrumb";
import { guides } from "@/data/guides";
import { buildMetadata } from "@/lib/site";

export const metadata = buildMetadata({
  title: "Guides and Blog",
  description: "AULEXMED guide and blog templates for product education, size guide articles, comparisons, and use and care content.",
  path: "/guides"
});

export default function GuidesPage() {
  return (
    <>
      <section className="bg-white py-10">
        <div className="container-page">
          <Breadcrumb items={[{ label: "Guides" }]} />
          <p className="eyebrow mt-6">Knowledge / SEO</p>
          <h1 className="mt-3 text-4xl font-bold text-brand-navy">Guides & Blog</h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600">
            Article templates for choosing products, comparing support options, size guides, and use and care topics.
          </p>
        </div>
      </section>
      <section className="section-y bg-slate-50">
        <div className="container-page grid gap-5 md:grid-cols-3">
          {guides.map((guide) => (
            <Link key={guide.slug} href={`/guides/${guide.slug}`} className="rounded-lg border border-brand-line bg-white p-6 hover:border-brand-blue">
              <p className="text-xs font-semibold uppercase tracking-wide text-brand-blue">{guide.category}</p>
              <h2 className="mt-3 text-xl font-bold text-brand-navy">{guide.title}</h2>
              <p className="mt-3 text-sm leading-6 text-slate-600">{guide.excerpt}</p>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
