import Link from "next/link";
import { Breadcrumb } from "@/components/Breadcrumb";
import { buildMetadata, siteConfig } from "@/lib/site";

export const metadata = buildMetadata({
  title: "AULEXMED Warranty Support",
  description: "AULEXMED warranty support framework for marketplace customers, product documentation, and future warranty registration.",
  path: "/support/warranty"
});

const warrantyItems = [
  "Product SKU and product name",
  "Purchase platform or store",
  "Order date and country",
  "Photos or short video when relevant",
  "Short description of the support request"
];

export default function WarrantyPage() {
  const mailto = `mailto:${siteConfig.email}?subject=AULEXMED%20Warranty%20Support&body=Product%20SKU:%0APurchase%20platform:%0AOrder%20date:%0ACountry:%0ASupport%20request:%0A`;

  return (
    <>
      <section className="bg-white py-10">
        <div className="container-page">
          <Breadcrumb items={[{ href: "/support", label: "Support Center" }, { label: "Warranty" }]} />
          <p className="eyebrow mt-6">Warranty</p>
          <h1 className="mt-3 text-4xl font-bold text-brand-navy">Warranty support framework</h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600">
            This first version provides a clean support path. Final warranty terms can be added after marketplace, distributor, and legal wording is confirmed.
          </p>
        </div>
      </section>

      <section className="section-y bg-slate-50">
        <div className="container-page grid gap-8 lg:grid-cols-[0.85fr_1.15fr]">
          <div>
            <p className="eyebrow">Before Contacting Support</p>
            <h2 className="mt-3 text-3xl font-bold text-brand-navy">Prepare these details</h2>
          </div>
          <div className="grid gap-3">
            {warrantyItems.map((item) => (
              <div key={item} className="rounded-md border border-brand-line bg-white px-4 py-3 text-sm font-semibold text-slate-700">
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-y bg-white">
        <div className="container-page rounded-lg border border-brand-line bg-brand-sky p-6 md:p-8">
          <h2 className="text-2xl font-bold text-brand-navy">Contact warranty support</h2>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">
            Include clear details so the team can understand the product and purchase context.
          </p>
          <Link href={mailto} className="mt-5 inline-flex rounded-md bg-brand-blue px-5 py-3 text-sm font-semibold text-white hover:bg-brand-navy">
            Email Warranty Support
          </Link>
        </div>
      </section>
    </>
  );
}
