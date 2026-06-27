import Link from "next/link";
import { Breadcrumb } from "@/components/Breadcrumb";
import { FAQSection } from "@/components/FAQSection";
import { manuals } from "@/data/manuals";
import { supportTopics } from "@/data/support";
import { buildMetadata, siteConfig } from "@/lib/site";

export const metadata = buildMetadata({
  title: "Support Center",
  description: "Find AULEXMED user manuals, how-to-wear guides, size guides, FAQ, warranty, video tutorials, return policy, and replacement parts support.",
  path: "/support"
});

const faqs = [
  {
    question: "Where can I find my product manual?",
    answer: "Use the manual list below and match the SKU on your package or product card. If your exact file is not listed, contact support with the SKU."
  },
  {
    question: "How do I choose the right size?",
    answer: "Start with the product-specific size guide and measure before purchase. If you are between sizes, contact support before ordering."
  },
  {
    question: "Who should I contact for wholesale support?",
    answer: "Use the B2B inquiry page or email the AULEXMED team with SKU, quantity, and market details."
  }
];

export default function SupportPage() {
  return (
    <>
      <section className="bg-white py-10">
        <div className="container-page">
          <Breadcrumb items={[{ label: "Support Center" }]} />
          <p className="eyebrow mt-6">Customer Support</p>
          <h1 className="mt-3 text-4xl font-bold text-brand-navy">Support Center</h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600">
            A central place for manuals, wearing instructions, size guides, video tutorials, FAQ, warranty, return policy, replacement parts, and direct support.
          </p>
        </div>
      </section>

      <section id="manuals" className="section-y bg-slate-50">
        <div className="container-page">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="eyebrow">Manuals</p>
              <h2 className="mt-3 text-3xl font-bold text-brand-navy">User manual download center</h2>
            </div>
            <a href={`mailto:${siteConfig.email}`} className="text-sm font-semibold text-brand-blue">
              Request a manual
            </a>
          </div>
          <div className="mt-8 grid gap-4">
            {manuals.map((manual) => (
              <div key={manual.sku} className="grid gap-3 rounded-lg border border-brand-line bg-white p-5 md:grid-cols-[1fr_auto] md:items-center">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-brand-blue">{manual.category}</p>
                  <h3 className="mt-2 text-lg font-bold text-brand-navy">{manual.title}</h3>
                  <p className="mt-1 text-sm text-slate-500">{manual.sku}</p>
                </div>
                <button className="rounded-md border border-brand-line px-4 py-2 text-sm font-semibold text-slate-500" disabled>
                  {manual.status}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-y bg-white">
        <div className="container-page grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {supportTopics.map((topic) => (
            <Link key={topic.href} href={topic.href} className="rounded-lg border border-brand-line bg-slate-50 p-6 hover:border-brand-blue">
              <h2 className="text-xl font-bold text-brand-navy">{topic.title}</h2>
              <p className="mt-3 text-sm leading-6 text-slate-600">{topic.body}</p>
            </Link>
          ))}
        </div>
      </section>

      <section id="faq" className="section-y bg-slate-50">
        <div className="container-page grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="eyebrow">FAQ</p>
            <h2 className="mt-3 text-3xl font-bold text-brand-navy">Common support questions</h2>
          </div>
          <FAQSection faqs={faqs} />
        </div>
      </section>

      <section className="section-y bg-white">
        <div className="container-page rounded-lg border border-brand-line bg-brand-sky p-6 md:p-10">
          <h2 className="text-2xl font-bold text-brand-navy">Contact Support</h2>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">
            Include your SKU, marketplace order channel, photos if relevant, and a short description of the issue.
          </p>
          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            <Link href="/support/contact-support" className="inline-flex rounded-md bg-brand-blue px-5 py-3 text-sm font-semibold text-white hover:bg-brand-navy">
              Email Support
            </Link>
            <a href={`mailto:${siteConfig.supportEmail}`} className="inline-flex rounded-md border border-brand-line bg-white px-5 py-3 text-sm font-semibold text-brand-navy hover:border-brand-blue">
              {siteConfig.supportEmail}
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
