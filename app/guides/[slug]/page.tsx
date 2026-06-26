import { notFound } from "next/navigation";
import { Breadcrumb } from "@/components/Breadcrumb";
import { guides, getGuide } from "@/data/guides";
import { buildMetadata } from "@/lib/site";

export function generateStaticParams() {
  return guides.map((guide) => ({ slug: guide.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const guide = getGuide(slug);
  if (!guide) return {};

  return buildMetadata({
    title: guide.title,
    description: guide.excerpt,
    path: `/guides/${guide.slug}`
  });
}

export default async function GuideDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const guide = getGuide(slug);
  if (!guide) notFound();

  return (
    <article className="bg-white">
      <div className="container-page py-10">
        <Breadcrumb items={[{ href: "/guides", label: "Guides" }, { label: guide.title }]} />
        <p className="eyebrow mt-8">{guide.category}</p>
        <h1 className="mt-3 max-w-4xl text-4xl font-bold text-brand-navy">{guide.title}</h1>
        <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600">{guide.excerpt}</p>
      </div>
      <div className="border-t border-brand-line bg-slate-50">
        <div className="container-page max-w-4xl py-12">
          <div className="grid gap-8">
            {guide.sections.map((section) => (
              <section key={section.heading} className="rounded-lg border border-brand-line bg-white p-6">
                <h2 className="text-2xl font-bold text-brand-navy">{section.heading}</h2>
                <p className="mt-4 text-base leading-7 text-slate-600">{section.body}</p>
              </section>
            ))}
          </div>
        </div>
      </div>
    </article>
  );
}
