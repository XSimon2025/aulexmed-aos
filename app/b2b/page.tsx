import Image from "next/image";
import Link from "next/link";
import { Breadcrumb } from "@/components/Breadcrumb";
import { categories } from "@/data/categories";
import { buildB2BMailto, b2bPaths, rfqChecklist } from "@/data/b2b";
import { buildMetadata, siteConfig } from "@/lib/site";

export const metadata = buildMetadata({
  title: "Orthopedic Manufacturing Partner, OEM / ODM, Wholesale",
  description:
    "AULEXMED B2B manufacturing page for orthopedic support distributors, importers, OEM partners, ODM projects, private label programs, and international compliance review.",
  path: "/b2b"
});

const partnerTypes = ["Distributors", "Importers", "Medical brands", "Retail chains", "OEM partners", "ODM partners"];

const capabilityItems = [
  {
    label: "OEM",
    title: "OEM Manufacturing",
    body: "Existing orthopedic support SKUs prepared for brand, packaging, and market-specific project planning."
  },
  {
    label: "ODM",
    title: "ODM Development",
    body: "Product development support for partners who need structure, material, sizing, or positioning adjustments."
  },
  {
    label: "PL",
    title: "Private Label",
    body: "Logo, label, instruction insert, product card, and retail presentation support for long-term brand programs."
  },
  {
    label: "PKG",
    title: "Packaging Customization",
    body: "Retail box, user manual, size guide, package insert, and channel-ready documentation coordination."
  },
  {
    label: "QC",
    title: "Quality Control",
    body: "Factory-controlled production with inspection discipline across materials, assembly, packaging, and shipment."
  },
  {
    label: "R&D",
    title: "Product Development",
    body: "Category planning for walking boots, knee braces, ankle support, posture support, and upper limb support."
  }
];

const manufacturingFacts = [
  "2,550 m² manufacturing facility",
  "180,000+ units monthly capacity",
  "200,000+ pieces stock capacity",
  "Orthopedic support from neck to foot",
  "OEM and ODM project support",
  "Factory-controlled quality process"
];

const workflowSteps = ["Design", "Sampling", "Testing", "Production", "Inspection", "Shipping"];

type ComplianceItem = {
  title: string;
  code: string;
  body: string;
  visual: "mark" | "image";
  image?: string;
  imageAlt?: string;
};

const complianceItems: ComplianceItem[] = [
  {
    title: "CE Mark",
    code: "CE",
    body: "European market readiness and product documentation support for partner review.",
    visual: "mark"
  },
  {
    title: "EUDAMED",
    code: "EU",
    body: "EU medical device database alignment for manufacturer and actor information review.",
    visual: "image",
    image: "/brand/b2b-eudamed-registration.png",
    imageAlt: "AULEXMED EUDAMED manufacturer registration preview"
  },
  {
    title: "FDA Registration",
    code: "FDA",
    body: "U.S. market registration pathway and device listing documentation for importer evaluation.",
    visual: "image",
    image: "/brand/b2b-fda-registration.png",
    imageAlt: "AULEXMED FDA establishment registration and device listing preview"
  },
  {
    title: "ISO 13485",
    code: "ISO",
    body: "Medical device quality management system mindset for repeatable production and supplier confidence.",
    visual: "mark"
  }
];

const productLines = categories.map((category) => ({
  name: category.name,
  href: `/products/${category.slug}`,
  image: category.image
}));

export default function B2BPage() {
  const mailto = buildB2BMailto("AULEXMED B2B Quotation Request", [
    "Company name:",
    "Country / market:",
    "Product category or SKU:",
    "Estimated order quantity:",
    "Sales channel:",
    "OEM / ODM / packaging needs:",
    "Required documents:",
    "Expected sample or delivery timeline:"
  ]);

  return (
    <>
      <section className="relative overflow-hidden bg-[linear-gradient(145deg,#f8fbff_0%,#ffffff_48%,#eaf4ff_100%)] py-10 md:py-14">
        <div className="container-page">
          <Breadcrumb items={[{ label: "B2B" }]} />
          <div className="mt-10 grid gap-12 lg:grid-cols-[0.92fr_1.08fr] lg:items-center">
            <div>
              <p className="eyebrow">Capability · Compliance · Partnership · Trust</p>
              <h1 className="mt-5 max-w-4xl text-4xl font-semibold text-brand-navy md:text-6xl">
                Your Trusted Orthopedic Manufacturing Partner.
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-8 text-slate-600 md:text-lg">
                From OEM manufacturing to global distribution support, AULEXMED helps orthopedic brands bring reliable
                medical support products to market with confidence.
              </p>
              <div className="mt-8 flex flex-wrap gap-3 text-sm font-semibold text-slate-600">
                {partnerTypes.map((type) => (
                  <span key={type} className="rounded-full border border-white/80 bg-white/80 px-4 py-2 shadow-[0_10px_30px_rgba(15,55,90,0.06)]">
                    {type}
                  </span>
                ))}
              </div>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/b2b/request-quotation"
                  className="inline-flex items-center justify-center rounded-full bg-brand-blue px-7 py-3.5 text-sm font-semibold text-white shadow-[0_14px_35px_rgba(30,111,216,0.22)] transition hover:-translate-y-0.5 hover:bg-brand-navy"
                >
                  Request Quote
                </Link>
                <Link
                  href="/b2b/distributor-program"
                  className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white/80 px-7 py-3.5 text-sm font-semibold text-brand-navy transition hover:-translate-y-0.5 hover:border-brand-blue hover:text-brand-blue"
                >
                  Become a Distributor
                </Link>
              </div>
            </div>
            <div className="relative min-h-[420px] overflow-hidden rounded-[2rem] bg-white shadow-[0_30px_80px_rgba(19,45,74,0.14)]">
              <Image
                src="/brand/about-manufacturing-v1.png"
                alt="AULEXMED orthopedic manufacturing and quality control workspace"
                fill
                priority
                sizes="(min-width: 1024px) 52vw, 100vw"
                className="object-cover"
              />
              <div className="absolute inset-x-5 bottom-5 rounded-3xl border border-white/50 bg-white/[0.82] p-5 shadow-[0_18px_45px_rgba(15,55,90,0.12)] backdrop-blur">
                <p className="text-xs font-bold uppercase text-brand-blue">Manufacturing partnership</p>
                <p className="mt-2 text-lg font-semibold text-brand-navy">
                  Built for partners seeking a long-term orthopedic supply relationship.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-y bg-white">
        <div className="container-page">
          <div className="max-w-3xl">
            <p className="eyebrow">Business Capability</p>
            <h2 className="mt-4 text-3xl font-semibold text-brand-navy md:text-5xl">
              More than sourcing. A system for building orthopedic product programs.
            </h2>
          </div>
          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {capabilityItems.map((item) => (
              <article
                key={item.title}
                className="group rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_18px_45px_rgba(15,55,90,0.05)] transition hover:-translate-y-1 hover:border-brand-blue/35 hover:shadow-[0_26px_70px_rgba(15,55,90,0.09)]"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-sky text-xs font-bold text-brand-blue">
                  {item.label}
                </div>
                <h3 className="mt-6 text-xl font-semibold text-brand-navy">{item.title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">{item.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section-y bg-slate-50">
        <div className="container-page grid gap-12 lg:grid-cols-[1.04fr_0.96fr] lg:items-center">
          <div className="relative min-h-[460px] overflow-hidden rounded-[2rem] bg-slate-200 shadow-[0_26px_70px_rgba(15,55,90,0.1)]">
            <Image
              src="/brand/about-manufacturing-v1.png"
              alt="AULEXMED manufacturing facility quality control and product review"
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
          <div>
            <p className="eyebrow">Manufacturing</p>
            <h2 className="mt-4 text-3xl font-semibold text-brand-navy md:text-5xl">
              Factory capability, presented for partner confidence.
            </h2>
            <p className="mt-5 text-base leading-8 text-slate-600">
              International buyers are not only comparing unit price. They are evaluating consistency, communication,
              documentation, quality discipline, and whether the factory can support repeated orders over time.
            </p>
            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {manufacturingFacts.map((fact) => (
                <div key={fact} className="rounded-2xl border border-white bg-white px-5 py-4 text-sm font-semibold leading-6 text-brand-navy shadow-[0_12px_32px_rgba(15,55,90,0.05)]">
                  {fact}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section-y bg-white">
        <div className="container-page">
          <div className="grid gap-8 lg:grid-cols-[0.78fr_1.22fr] lg:items-end">
            <div>
              <p className="eyebrow">Manufacturing Workflow</p>
              <h2 className="mt-4 text-3xl font-semibold text-brand-navy md:text-5xl">
                A clear path from idea to shipment.
              </h2>
            </div>
            <p className="max-w-3xl text-base leading-8 text-slate-600 lg:justify-self-end">
              The workflow is designed to reduce uncertainty for partners: confirm the product direction, validate samples,
              control production, inspect details, and prepare the shipment with clear documentation.
            </p>
          </div>
          <div className="mt-12 grid gap-4 md:grid-cols-3 lg:grid-cols-6">
            {workflowSteps.map((step, index) => (
              <article key={step} className="relative rounded-3xl border border-slate-200 bg-slate-50 p-5 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-white text-sm font-bold text-brand-blue shadow-[0_12px_30px_rgba(15,55,90,0.08)]">
                  {String(index + 1).padStart(2, "0")}
                </div>
                <h3 className="mt-5 text-base font-semibold text-brand-navy">{step}</h3>
                {index < workflowSteps.length - 1 ? (
                  <span className="absolute -right-2 top-1/2 hidden h-px w-4 bg-brand-blue/30 lg:block" aria-hidden="true" />
                ) : null}
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section-y overflow-hidden bg-brand-navy text-white">
        <div className="container-page">
          <div className="grid gap-10 lg:grid-cols-[0.82fr_1.18fr]">
            <div>
              <p className="text-xs font-bold uppercase text-blue-200">Quality. Compliance. Confidence.</p>
              <h2 className="mt-4 text-3xl font-semibold md:text-5xl">
                Compliance signals for international orthopedic markets.
              </h2>
              <p className="mt-5 text-base leading-8 text-blue-100">
                For distributors, importers, and private label brands, compliance materials help verify manufacturing
                readiness, documentation discipline, and long-term supplier reliability.
              </p>
              <Link
                href="/certificates"
                className="mt-8 inline-flex items-center justify-center rounded-full border border-white/20 bg-white px-6 py-3 text-sm font-semibold text-brand-navy transition hover:-translate-y-0.5 hover:bg-blue-50"
              >
                View Certificates
              </Link>
            </div>
            <div className="grid gap-5 md:grid-cols-2">
              {complianceItems.map((item) => (
                <article key={item.title} className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.08] shadow-[0_24px_70px_rgba(0,0,0,0.18)] backdrop-blur">
                  <div className="relative h-36 bg-white/95">
                    {item.visual === "image" && item.image ? (
                      <Image
                        src={item.image}
                        alt={item.imageAlt ?? `${item.title} preview`}
                        fill
                        sizes="(min-width: 768px) 24vw, 100vw"
                        className="object-cover object-top"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center bg-[radial-gradient(circle_at_top_left,#e6f1ff,#ffffff_58%,#dbeafe)]">
                        <div className="rounded-2xl border border-brand-blue/20 bg-white px-8 py-5 text-3xl font-semibold text-brand-blue shadow-[0_18px_45px_rgba(15,55,90,0.08)]">
                          {item.code}
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <p className="text-xs font-bold uppercase text-blue-200">{item.code}</p>
                    <h3 className="mt-2 text-xl font-semibold text-white">{item.title}</h3>
                    <p className="mt-3 text-sm leading-7 text-blue-100">{item.body}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section-y bg-white">
        <div className="container-page">
          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div>
              <p className="eyebrow">Product Lines</p>
              <h2 className="mt-4 text-3xl font-semibold text-brand-navy md:text-5xl">
                Orthopedic categories ready for partner programs.
              </h2>
            </div>
            <Link href="/products" className="text-sm font-semibold text-brand-blue transition hover:text-brand-navy">
              View product catalog
            </Link>
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {productLines.map((line) => (
              <Link
                key={line.name}
                href={line.href}
                className="group rounded-3xl border border-slate-200 bg-white p-4 shadow-[0_14px_40px_rgba(15,55,90,0.04)] transition hover:-translate-y-1 hover:border-brand-blue/40"
              >
                <div className="relative aspect-square overflow-hidden rounded-2xl bg-slate-50">
                  <Image src={line.image} alt={`${line.name} category for B2B orthopedic programs`} fill sizes="20vw" className="object-contain p-5 transition group-hover:scale-105" />
                </div>
                <h3 className="mt-4 text-base font-semibold text-brand-navy">{line.name}</h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section-y bg-slate-50">
        <div className="container-page">
          <div className="grid gap-8 lg:grid-cols-[0.82fr_1.18fr]">
            <div>
              <p className="eyebrow">Cooperation Path</p>
              <h2 className="mt-4 text-3xl font-semibold text-brand-navy md:text-5xl">
                Choose the partnership model that matches your market.
              </h2>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {b2bPaths.map((path) => (
                <Link key={path.href} href={path.href} className="rounded-3xl border border-white bg-white p-6 shadow-[0_14px_40px_rgba(15,55,90,0.05)] transition hover:-translate-y-1 hover:border-brand-blue/35">
                  <h3 className="text-lg font-semibold text-brand-navy">{path.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-600">{path.body}</p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="request-quotation" className="section-y bg-white">
        <div className="container-page overflow-hidden rounded-[2rem] bg-[linear-gradient(135deg,#0e2f55_0%,#184e83_52%,#2f7bd8_100%)] p-6 text-white shadow-[0_30px_90px_rgba(15,55,90,0.2)] md:p-12">
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div>
              <p className="text-xs font-bold uppercase text-blue-200">Partnership CTA</p>
              <h2 className="mt-4 text-3xl font-semibold md:text-5xl">
                Let&apos;s Build Better Orthopedic Solutions Together.
              </h2>
              <p className="mt-5 max-w-2xl text-base leading-8 text-blue-100">
                Whether you&apos;re building your own orthopedic brand or expanding your existing product portfolio,
                AULEXMED is ready to become your long-term manufacturing partner.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  href={mailto}
                  className="inline-flex items-center justify-center rounded-full bg-white px-7 py-3.5 text-sm font-semibold text-brand-navy transition hover:-translate-y-0.5 hover:bg-blue-50"
                >
                  Request Quote
                </Link>
                <Link
                  href="/b2b/distributor-program"
                  className="inline-flex items-center justify-center rounded-full border border-white/25 px-7 py-3.5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-white/10"
                >
                  Become a Distributor
                </Link>
              </div>
            </div>
            <div className="rounded-3xl border border-white/15 bg-white/10 p-6 backdrop-blur md:p-8">
              <h3 className="text-xl font-semibold">RFQ checklist</h3>
              <div className="mt-5 grid gap-3 text-sm leading-6 text-blue-50 sm:grid-cols-2">
                {rfqChecklist.map((item) => (
                  <div key={item} className="rounded-2xl bg-white/10 px-4 py-3">
                    {item}
                  </div>
                ))}
              </div>
              <div className="mt-6 rounded-2xl bg-white px-5 py-4 text-sm leading-6 text-brand-navy">
                Email:{" "}
                <a href={`mailto:${siteConfig.email}`} className="font-semibold text-brand-blue">
                  {siteConfig.email}
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
