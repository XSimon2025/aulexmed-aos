import Image from "next/image";
import Link from "next/link";
import { buildMetadata, siteConfig } from "@/lib/site";

export const metadata = buildMetadata({
  title: "AULEXMED | Back to Life. One Step at a Time.",
  description:
    "AULEXMED is an international orthopedic rehabilitation brand helping people return to everyday life with confidence, support, and clear product guidance."
});

const supportEntries = [
  { title: "Product Support", href: "/support", body: "Manuals, sizing, wearing guidance, and support contact in one place." },
  { title: "For Business Buyers", href: "/b2b", body: "Manufacturing capability, OEM / ODM, and distributor cooperation." }
];

export default function HomePage() {
  return (
    <>
      <section className="relative isolate min-h-[calc(100vh-122px)] overflow-hidden bg-white">
        <Image
          src="/brand/homepage-hero-52036.png"
          alt="AULEXMED Walking Boot 52036 supporting a confident return to daily life"
          fill
          priority
          sizes="100vw"
          className="object-cover object-[62%_center]"
        />
        <div className="absolute inset-0 bg-white/78 sm:bg-gradient-to-r sm:from-white sm:via-white/82 sm:to-white/8" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-white to-white/0" />

        <div className="container-page relative flex min-h-[calc(100vh-122px)] items-center py-20 sm:py-24 lg:py-28">
          <div className="max-w-2xl">
            <p className="eyebrow">AULEXMED Official Brand</p>
            <h1 className="mt-5 text-5xl font-bold tracking-tight text-brand-navy sm:text-6xl lg:text-7xl">
              Back to Life. One Step at a Time.
            </h1>
            <p className="mt-7 max-w-xl text-lg leading-8 text-slate-600">
              Recovery is not just about healing. It is about returning to the life you love.
            </p>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <Link href="/products" className="rounded-md bg-brand-blue px-7 py-3.5 text-center text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-brand-navy">
                Explore AULEXMED
              </Link>
              <Link href="/support" className="rounded-md border border-brand-line bg-white/80 px-7 py-3.5 text-center text-sm font-semibold text-brand-navy backdrop-blur transition hover:-translate-y-0.5 hover:border-brand-blue">
                Get Product Support
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-28 sm:py-32">
        <div className="container-page max-w-5xl">
          <p className="eyebrow">Brand Philosophy</p>
          <h2 className="mt-5 text-4xl font-bold tracking-tight text-brand-navy sm:text-6xl">
            AULEXMED helps people move from injury back into everyday life.
          </h2>
          <p className="mt-8 max-w-3xl text-xl leading-9 text-slate-600">
            Our products are not the destination. They are the bridge between uncertainty and routine, between protection and progress, between support and confidence.
          </p>
        </div>
      </section>

      <section className="bg-slate-50 py-28 sm:py-32">
        <div className="container-page">
          <div className="max-w-3xl">
            <p className="eyebrow">Flagship Products</p>
            <h2 className="mt-4 text-4xl font-bold tracking-tight text-brand-navy sm:text-5xl">
              Knee and ankle support, shown through life rather than catalog pages.
            </h2>
          </div>

          <div className="mt-14 grid gap-8 lg:grid-cols-2">
            <article className="overflow-hidden rounded-lg bg-white shadow-soft">
              <div className="relative min-h-[420px]">
                <Image
                  src="/brand/homepage-hero-52036.png"
                  alt="AULEXMED Walking Boot 52036 in a premium lifestyle scene"
                  fill
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className="object-cover object-[62%_center]"
                />
              </div>
              <div className="p-7 sm:p-9">
                <p className="text-xs font-semibold uppercase tracking-wide text-brand-blue">BL-52036</p>
                <h3 className="mt-3 text-2xl font-bold text-brand-navy">Walking Boot 52036</h3>
                <p className="mt-4 text-base leading-7 text-slate-600">Ankle support designed to feel stable, practical, and part of the journey back to daily movement.</p>
              </div>
            </article>
            <article className="overflow-hidden rounded-lg bg-white shadow-soft">
              <div className="relative min-h-[420px]">
              <Image
                src="/brand/homepage-flagship-42001.png"
                alt="AULEXMED ROM Knee Brace 42001 used during rehabilitation training"
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover"
              />
              </div>
              <div className="p-7 sm:p-9">
                <p className="text-xs font-semibold uppercase tracking-wide text-brand-blue">BL-42001</p>
                <h3 className="mt-3 text-2xl font-bold text-brand-navy">ROM Knee Brace 42001</h3>
                <p className="mt-4 text-base leading-7 text-slate-600">Knee support built for controlled movement, careful adjustment, and confident progress.</p>
              </div>
            </article>
          </div>

          <div className="mt-12 flex justify-center">
            <Link href="/products" className="rounded-md border border-brand-line bg-white px-7 py-3.5 text-sm font-semibold text-brand-navy transition hover:-translate-y-0.5 hover:border-brand-blue">
              View Product Categories
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-white py-28 sm:py-32">
        <div className="container-page grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <p className="eyebrow">Support Center</p>
            <h2 className="mt-4 text-4xl font-bold tracking-tight text-brand-navy sm:text-5xl">
              Clear support keeps the brand promise after purchase.
            </h2>
            <p className="mt-6 max-w-xl text-base leading-7 text-slate-600">
              Manuals, sizing, wearing guidance, warranty, and B2B paths live in dedicated areas so the homepage can stay calm and focused.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {supportEntries.map((entry) => (
              <Link key={entry.title} href={entry.href} className="group rounded-lg border border-brand-line bg-slate-50 p-8 transition hover:-translate-y-1 hover:border-brand-blue hover:bg-white hover:shadow-soft">
                <h3 className="text-xl font-bold text-brand-navy">{entry.title}</h3>
                <p className="mt-4 text-sm leading-6 text-slate-600">{entry.body}</p>
                <span className="mt-8 inline-flex text-sm font-semibold text-brand-blue">Open</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-brand-navy py-28 text-white sm:py-32">
        <div className="container-page grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-200">Video Introduction</p>
            <h2 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">
              See AULEXMED in action.
            </h2>
            <p className="mt-6 max-w-xl text-base leading-7 text-slate-200">
              Watch the official AULEXMED brand video and see how support products, movement, and confidence come together in real use.
            </p>
            <a href="https://www.youtube.com/@aulexmed" className="mt-8 inline-flex rounded-md bg-white px-6 py-3 text-sm font-semibold text-brand-navy transition hover:-translate-y-0.5 hover:bg-sky-100">
              Visit YouTube Channel
            </a>
          </div>
          <div className="overflow-hidden rounded-lg border border-white/15 bg-white/[0.06] p-3 shadow-soft">
            <div className="relative aspect-video overflow-hidden rounded-md bg-black">
              <iframe
                className="absolute inset-0 h-full w-full"
                src="https://www.youtube-nocookie.com/embed/Wbu6YEePxbc"
                title="AULEXMED official video"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
