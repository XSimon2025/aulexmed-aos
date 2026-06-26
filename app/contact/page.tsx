import Link from "next/link";
import { Breadcrumb } from "@/components/Breadcrumb";
import { buildMetadata, siteConfig } from "@/lib/site";

export const metadata = buildMetadata({
  title: "Contact AULEXMED",
  description:
    "Contact AULEXMED for customer support, product manuals, size guide questions, B2B quotation requests, wholesale, OEM / ODM, and distributor inquiries.",
  path: "/contact"
});

const contactPaths = [
  {
    title: "Customer Support",
    body: "For product manuals, how-to-wear questions, size guide help, warranty, or replacement and missing-parts support.",
    href: "/support",
    label: "Open Support Center"
  },
  {
    title: "Product Purchase",
    body: "For product browsing, US Temu routing, Amazon or TikTok search guidance, and international purchase inquiry.",
    href: "/products",
    label: "Browse Products"
  },
  {
    title: "B2B Inquiry",
    body: "For wholesale, private label, OEM / ODM, distributor program, catalog, sample, and quotation requests.",
    href: "/b2b#request-quotation",
    label: "Request Quote"
  }
];

export default function ContactPage() {
  const supportMail = `mailto:${siteConfig.email}?subject=AULEXMED%20Support%20Request&body=Order%20platform%20or%20country:%0AProduct%20SKU:%0AQuestion:%0A`;
  const b2bMail = `mailto:${siteConfig.email}?subject=AULEXMED%20B2B%20Inquiry&body=Company:%0ACountry:%0AProduct%20category%20or%20SKU:%0AQuantity:%0ACustomization%20needs:%0A`;

  return (
    <>
      <section className="bg-white py-10">
        <div className="container-page">
          <Breadcrumb items={[{ label: "Contact" }]} />
          <div className="mt-8 max-w-4xl">
            <p className="eyebrow">Contact AULEXMED</p>
            <h1 className="mt-3 text-4xl font-bold tracking-tight text-brand-navy md:text-5xl">
              Choose the right contact path for faster support.
            </h1>
            <p className="mt-5 text-base leading-7 text-slate-600">
              AULEXMED visitors may arrive from product packaging, marketplace purchases, Google searches, or B2B sourcing. Use the path below that
              best matches your request.
            </p>
          </div>
        </div>
      </section>

      <section className="section-y bg-slate-50">
        <div className="container-page grid gap-5 md:grid-cols-3">
          {contactPaths.map((item) => (
            <article key={item.title} className="rounded-lg border border-brand-line bg-white p-6">
              <h2 className="text-xl font-bold text-brand-navy">{item.title}</h2>
              <p className="mt-3 text-sm leading-6 text-slate-600">{item.body}</p>
              <Link href={item.href} className="mt-5 inline-flex text-sm font-semibold text-brand-blue hover:text-brand-navy">
                {item.label}
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="section-y bg-white">
        <div className="container-page grid gap-6 lg:grid-cols-2">
          <div className="rounded-lg border border-brand-line bg-slate-50 p-6 md:p-8">
            <p className="eyebrow">Email</p>
            <h2 className="mt-3 text-2xl font-bold text-brand-navy">General support and business email</h2>
            <a href={`mailto:${siteConfig.email}`} className="mt-4 inline-flex text-lg font-bold text-brand-blue hover:text-brand-navy">
              {siteConfig.email}
            </a>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Link href={supportMail} className="rounded-md bg-brand-blue px-5 py-3 text-center text-sm font-semibold text-white hover:bg-brand-navy">
                Email Support
              </Link>
              <Link href={b2bMail} className="rounded-md border border-brand-line px-5 py-3 text-center text-sm font-semibold text-brand-navy hover:border-brand-blue">
                Email B2B Inquiry
              </Link>
            </div>
          </div>
          <div className="rounded-lg border border-brand-line bg-brand-sky p-6 md:p-8">
            <p className="eyebrow">Before You Contact</p>
            <h2 className="mt-3 text-2xl font-bold text-brand-navy">Helpful details to include</h2>
            <ul className="mt-5 grid gap-3 text-sm leading-6 text-slate-700">
              <li>• Product SKU or product page link</li>
              <li>• Country or purchase platform</li>
              <li>• Order quantity for B2B inquiries</li>
              <li>• Size, manual, replacement part, or packaging question</li>
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}
