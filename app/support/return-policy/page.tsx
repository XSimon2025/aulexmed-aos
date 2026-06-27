import Link from "next/link";
import { Breadcrumb } from "@/components/Breadcrumb";
import { buildMetadata } from "@/lib/site";

export const metadata = buildMetadata({
  title: "Return Policy",
  description: "AULEXMED return policy guidance for marketplace purchases, missing parts, product questions, and support contact preparation.",
  path: "/support/return-policy"
});

const returnSteps = [
  "Check the purchase channel first, such as Temu, Amazon, TikTok Shop, distributor, or local seller.",
  "Prepare SKU, order channel, order date, country, product photos, and package photos if relevant.",
  "For marketplace purchases, start the return process inside the original marketplace account when required.",
  "Contact AULEXMED support for product identification, missing parts, manuals, or guidance before sending repeated requests."
];

export default function ReturnPolicyPage() {
  return (
    <section className="bg-white py-10">
      <div className="container-page">
        <Breadcrumb items={[{ href: "/support", label: "Support Center" }, { label: "Return Policy" }]} />
        <p className="eyebrow mt-6">Purchase Support</p>
        <h1 className="mt-3 text-4xl font-bold text-brand-navy">Return Policy</h1>
        <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600">
          Return handling depends on where the product was purchased. This page helps you prepare the right information before contacting the marketplace, seller, or AULEXMED support team.
        </p>
        <ol className="mt-8 grid gap-4">
          {returnSteps.map((step) => (
            <li key={step} className="rounded-lg border border-brand-line bg-slate-50 p-5 text-sm leading-6 text-slate-600">
              {step}
            </li>
          ))}
        </ol>
        <Link href="/support/contact-support" className="mt-8 inline-flex rounded-md bg-brand-blue px-5 py-3 text-sm font-semibold text-white hover:bg-brand-navy">
          Contact Support
        </Link>
      </div>
    </section>
  );
}
