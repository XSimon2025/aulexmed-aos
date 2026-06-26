import Image from "next/image";
import Link from "next/link";
import { Breadcrumb } from "@/components/Breadcrumb";
import { CTASection } from "@/components/CTASection";
import { brandTrustPoints, brandValues } from "@/data/brand";
import { buildMetadata } from "@/lib/site";

export const metadata = buildMetadata({
  title: "About AULEXMED",
  description:
    "Learn about AULEXMED, a professional orthopedic support brand building product, support, B2B, and education content for long-term customer trust.",
  path: "/about"
});

export default function AboutPage() {
  return (
    <>
      <section className="bg-white py-10">
        <div className="container-page">
          <Breadcrumb items={[{ label: "About AULEXMED" }]} />
          <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_0.95fr] lg:items-center">
            <div>
              <p className="eyebrow">Brand Official Website</p>
              <h1 className="mt-3 text-4xl font-bold tracking-tight text-brand-navy md:text-5xl">
                AULEXMED builds practical orthopedic support products for daily movement.
              </h1>
              <p className="mt-5 max-w-3xl text-base leading-7 text-slate-600">
                AULEXMED focuses on knee braces, ankle braces, walking boots, back and posture support, wrist and finger support, and daily support
                products. This website is designed as the central hub for brand trust, product display, customer support, SEO content, and B2B inquiry.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link href="/products" className="rounded-md bg-brand-blue px-6 py-3 text-center text-sm font-semibold text-white hover:bg-brand-navy">
                  View Products
                </Link>
                <Link href="/factory" className="rounded-md border border-brand-line px-6 py-3 text-center text-sm font-semibold text-brand-navy hover:border-brand-blue">
                  Factory Capability
                </Link>
              </div>
            </div>
            <div className="relative min-h-[340px] overflow-hidden rounded-lg border border-brand-line bg-brand-sky shadow-soft">
              <Image src="/brand/hero.jpg" alt="AULEXMED orthopedic support product display" fill priority sizes="(min-width: 1024px) 45vw, 100vw" className="object-cover" />
            </div>
          </div>
        </div>
      </section>

      <section className="section-y bg-slate-50">
        <div className="container-page grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {brandTrustPoints.map((point) => (
            <div key={point} className="rounded-lg border border-brand-line bg-white p-5 text-sm font-semibold leading-6 text-slate-700">
              {point}
            </div>
          ))}
        </div>
      </section>

      <section className="section-y bg-white">
        <div className="container-page">
          <p className="eyebrow">Platform Direction</p>
          <h2 className="mt-3 text-3xl font-bold text-brand-navy md:text-4xl">Built for customers, support visitors, and business buyers</h2>
          <div className="mt-8 grid gap-5 md:grid-cols-2">
            {brandValues.map((value) => (
              <article key={value.title} className="rounded-lg border border-brand-line bg-slate-50 p-6">
                <h3 className="text-lg font-bold text-brand-navy">{value.title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-600">{value.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <CTASection
        eyebrow="Next Step"
        title="Need product support or business cooperation?"
        body="Retail visitors can use the support center, while distributors and B2B buyers can send a structured quotation request."
        primaryHref="/support"
        primaryLabel="Visit Support Center"
        secondaryHref="/b2b#request-quotation"
        secondaryLabel="Request Quote"
      />
    </>
  );
}
