import Link from "next/link";
import { Breadcrumb } from "@/components/Breadcrumb";
import { buildMetadata } from "@/lib/site";

export const metadata = buildMetadata({
  title: "Video Tutorials",
  description: "AULEXMED video tutorial center for product wearing, adjustment, sizing, and everyday support guidance.",
  path: "/support/video-tutorials"
});

const videoGroups = [
  "Walking boot fitting and strap adjustment",
  "ROM knee brace setup and wearing sequence",
  "Ankle brace positioning and fastening",
  "Back and posture support adjustment",
  "Wrist and finger support wearing guidance"
];

export default function VideoTutorialsPage() {
  return (
    <section className="bg-white py-10">
      <div className="container-page">
        <Breadcrumb items={[{ href: "/support", label: "Support Center" }, { label: "Video Tutorials" }]} />
        <p className="eyebrow mt-6">Support Videos</p>
        <h1 className="mt-3 text-4xl font-bold text-brand-navy">Video Tutorials</h1>
        <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600">
          Product-specific videos will be organized here for wearing, adjustment, sizing, and care. Contact support if you need guidance for a specific SKU.
        </p>
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {videoGroups.map((group) => (
            <div key={group} className="rounded-lg border border-brand-line bg-slate-50 p-6">
              <h2 className="text-lg font-bold text-brand-navy">{group}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">Video resource being prepared for SKU-level support.</p>
            </div>
          ))}
        </div>
        <Link href="/support/contact-support" className="mt-8 inline-flex rounded-md bg-brand-blue px-5 py-3 text-sm font-semibold text-white hover:bg-brand-navy">
          Contact Support
        </Link>
      </div>
    </section>
  );
}
