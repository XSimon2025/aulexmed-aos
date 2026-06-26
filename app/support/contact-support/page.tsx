import Link from "next/link";
import { Breadcrumb } from "@/components/Breadcrumb";
import { supportFaqs } from "@/data/support";
import { FAQSection } from "@/components/FAQSection";
import { buildMetadata, siteConfig } from "@/lib/site";

export const metadata = buildMetadata({
  title: "Contact AULEXMED Support",
  description: "Contact AULEXMED support for manuals, sizing, how-to-wear questions, warranty, replacement parts, and product help.",
  path: "/support/contact-support"
});

export default function ContactSupportPage() {
  const mailto = `mailto:${siteConfig.email}?subject=AULEXMED%20Support%20Request&body=Product%20SKU:%0APurchase%20platform:%0ACountry:%0ARequest%20type:%0ADescription:%0A`;

  return (
    <>
      <section className="bg-white py-10">
        <div className="container-page">
          <Breadcrumb items={[{ href: "/support", label: "Support Center" }, { label: "Contact Support" }]} />
          <p className="eyebrow mt-6">Contact Support</p>
          <h1 className="mt-3 text-4xl font-bold text-brand-navy">Get help from AULEXMED support</h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600">
            Use this page for product manuals, sizing questions, how-to-wear guidance, warranty, replacement parts, and other support requests.
          </p>
          <Link href={mailto} className="mt-8 inline-flex rounded-md bg-brand-blue px-6 py-3 text-sm font-semibold text-white hover:bg-brand-navy">
            Email Support
          </Link>
        </div>
      </section>

      <section className="section-y bg-slate-50">
        <div className="container-page grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="eyebrow">Support FAQ</p>
            <h2 className="mt-3 text-3xl font-bold text-brand-navy">Before sending your request</h2>
          </div>
          <FAQSection faqs={supportFaqs} />
        </div>
      </section>
    </>
  );
}
