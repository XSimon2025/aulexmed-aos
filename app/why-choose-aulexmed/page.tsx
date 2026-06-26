import Link from "next/link";
import { Breadcrumb } from "@/components/Breadcrumb";
import { CTASection } from "@/components/CTASection";
import { brandValues } from "@/data/brand";
import { buildMetadata } from "@/lib/site";

export const metadata = buildMetadata({
  title: "Why Choose AULEXMED",
  description:
    "Why customers and B2B buyers choose AULEXMED for clear orthopedic support product information, practical fit guidance, and inquiry-ready supply.",
  path: "/why-choose-aulexmed"
});

const decisionFactors = [
  {
    title: "Clear Product Categories",
    body: "Visitors can browse knee braces, ankle braces, walking boots, back support, wrist support, and more from one structured catalog."
  },
  {
    title: "Support Beyond Purchase",
    body: "The support center is prepared for manuals, how-to-wear guidance, size charts, warranty, and missing-parts help."
  },
  {
    title: "Safe Purchase Routing",
    body: "Product pages guide US visitors to Temu and marketplace search paths, while other regions can send inquiry emails."
  },
  {
    title: "B2B Workflow",
    body: "Wholesale, OEM / ODM, private label, and distributor visitors get a separate quotation path instead of a retail checkout flow."
  }
];

export default function WhyChoosePage() {
  return (
    <>
      <section className="bg-white py-10">
        <div className="container-page">
          <Breadcrumb items={[{ label: "Why Choose AULEXMED" }]} />
          <div className="mt-8 max-w-4xl">
            <p className="eyebrow">Why Choose AULEXMED</p>
            <h1 className="mt-3 text-4xl font-bold tracking-tight text-brand-navy md:text-5xl">
              Professional structure for product discovery, support, and business cooperation.
            </h1>
            <p className="mt-5 text-base leading-7 text-slate-600">
              AULEXMED is building a website that serves real customers from marketplace purchases, packaging QR codes, Google searches, and B2B
              inquiries. The goal is clear information, practical guidance, and a trustworthy path to the right next action.
            </p>
          </div>
        </div>
      </section>

      <section className="section-y bg-slate-50">
        <div className="container-page grid gap-5 md:grid-cols-2">
          {decisionFactors.map((factor) => (
            <article key={factor.title} className="rounded-lg border border-brand-line bg-white p-6">
              <h2 className="text-xl font-bold text-brand-navy">{factor.title}</h2>
              <p className="mt-3 text-sm leading-6 text-slate-600">{factor.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section-y bg-white">
        <div className="container-page">
          <p className="eyebrow">Brand Principles</p>
          <h2 className="mt-3 text-3xl font-bold text-brand-navy md:text-4xl">What the platform should keep improving</h2>
          <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {brandValues.map((value) => (
              <article key={value.title} className="rounded-lg border border-brand-line bg-slate-50 p-5">
                <h3 className="font-bold text-brand-navy">{value.title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-600">{value.body}</p>
              </article>
            ))}
          </div>
          <Link href="/guides" className="mt-8 inline-flex text-sm font-semibold text-brand-blue hover:text-brand-navy">
            Read AULEXMED guides
          </Link>
        </div>
      </section>

      <CTASection
        eyebrow="Need a starting point?"
        title="Choose by product category or contact the AULEXMED team."
        body="Use the product catalog for retail-style browsing, or use the B2B inquiry path for wholesale and custom projects."
        primaryHref="/products"
        primaryLabel="Browse Products"
        secondaryHref="/contact"
        secondaryLabel="Contact AULEXMED"
      />
    </>
  );
}
