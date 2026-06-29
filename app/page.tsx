import Image from "next/image";
import Link from "next/link";
import { buildMetadata } from "@/lib/site";

export const metadata = buildMetadata({
  title: "AULEXMED | Knee & Ankle Orthopedic Experts",
  description:
    "AULEXMED is a premium orthopedic support brand focused on knee and ankle recovery products, helping people return to everyday movement with confidence."
});

const complianceBadges = [
  { label: "CE", detail: "EU market readiness" },
  { label: "FDA", detail: "US registration path" },
  { label: "EU", detail: "EUDAMED aligned" },
  { label: "ISO", detail: "ISO 13485 system" }
];

const supportLinks = [
  { title: "Manuals", href: "/support/manuals" },
  { title: "Size Guide", href: "/support/size-guide" },
  { title: "Warranty", href: "/support/warranty" },
  { title: "Contact Support", href: "/support/contact-support" }
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
          className="scale-[1.02] object-cover object-[68%_center] transition duration-700"
        />
        <div className="absolute inset-0 bg-white/86 sm:bg-gradient-to-r sm:from-white sm:via-white/82 sm:to-white/12" />
        <div className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-white to-white/0" />

        <div className="container-page relative flex min-h-[calc(100vh-122px)] items-center py-20 sm:py-24 lg:py-28">
          <div className="max-w-2xl">
            <p className="eyebrow">AULEXMED — Knee & Ankle Orthopedic Experts</p>
            <h1 className="mt-5 text-5xl font-bold tracking-tight text-brand-navy sm:text-6xl lg:text-7xl">
              Back to Life. One Step at a Time.
            </h1>
            <p className="mt-7 max-w-xl text-xl leading-9 text-slate-600">
              Recovery is not only about healing. It is about returning to the life you love.
            </p>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <Link href="/products/walking-boots" className="rounded-md bg-brand-blue px-7 py-3.5 text-center text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-brand-navy">
                Explore Walking Boot 52036
              </Link>
              <Link href="/products/knee-braces" className="rounded-md border border-brand-line bg-white/80 px-7 py-3.5 text-center text-sm font-semibold text-brand-navy backdrop-blur transition hover:-translate-y-0.5 hover:border-brand-blue">
                Explore Knee Support
              </Link>
            </div>
          </div>
        </div>

        <div className="container-page relative -mt-28 pb-8 sm:-mt-24">
          <div className="ml-auto grid max-w-2xl grid-cols-2 gap-3 rounded-lg border border-white/70 bg-white/82 p-3 shadow-soft backdrop-blur-md sm:grid-cols-4">
            {complianceBadges.map((badge) => (
              <div key={badge.label} className="rounded-md border border-brand-line/80 bg-white/80 px-4 py-3">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-brand-blue/25 bg-brand-sky text-xs font-bold text-brand-blue">
                    {badge.label}
                  </span>
                  <span className="text-xs font-semibold leading-5 text-slate-600">{badge.detail}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-24 sm:py-32">
        <div className="container-page grid gap-12 lg:grid-cols-[1.08fr_0.92fr] lg:items-center">
          <div className="relative min-h-[520px] overflow-hidden rounded-lg bg-slate-100 shadow-soft">
            <Image
              src="/brand/homepage-hero-52036.png"
              alt="AULEXMED Walking Boot 52036 in a premium lifestyle scene"
              fill
              sizes="(min-width: 1024px) 58vw, 100vw"
              className="object-cover object-[64%_center]"
            />
          </div>
          <div className="lg:pl-8">
            <p className="eyebrow">Flagship Product</p>
            <h2 className="mt-5 text-4xl font-bold tracking-tight text-brand-navy sm:text-6xl">
              52036 Walking Boot
            </h2>
            <p className="mt-7 text-xl leading-9 text-slate-600">
              Stable ankle support for the steps between protection and everyday confidence.
            </p>
            <Link href="/products/walking-boots" className="mt-10 inline-flex rounded-md border border-brand-line bg-white px-7 py-3.5 text-sm font-semibold text-brand-navy transition hover:-translate-y-0.5 hover:border-brand-blue">
              View Walking Boots
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-slate-50 py-24 sm:py-32">
        <div className="container-page grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div className="lg:pr-8">
            <p className="eyebrow">Flagship Product</p>
            <h2 className="mt-5 text-4xl font-bold tracking-tight text-brand-navy sm:text-6xl">
              42001 ROM Knee Brace
            </h2>
            <p className="mt-7 text-xl leading-9 text-slate-600">
              Controlled knee support designed for careful adjustment, stable feel, and confident movement.
            </p>
            <Link href="/products/knee-braces" className="mt-10 inline-flex rounded-md border border-brand-line bg-white px-7 py-3.5 text-sm font-semibold text-brand-navy transition hover:-translate-y-0.5 hover:border-brand-blue">
              View Knee Braces
            </Link>
          </div>
          <div className="relative min-h-[540px] overflow-hidden rounded-lg bg-white shadow-soft">
            <Image
              src="/brand/homepage-rom-42001-story.png"
              alt="AULEXMED ROM Knee Brace 42001 during calm rehabilitation movement"
              fill
              sizes="(min-width: 1024px) 58vw, 100vw"
              className="object-cover"
            />
          </div>
        </div>
      </section>

      <section className="bg-brand-navy py-24 text-white sm:py-32">
        <div className="container-page grid gap-12 lg:grid-cols-[0.82fr_1.18fr] lg:items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-200">Brand Video</p>
            <h2 className="mt-5 text-4xl font-bold tracking-tight sm:text-6xl">
              See AULEXMED in Motion
            </h2>
            <p className="mt-7 max-w-xl text-lg leading-8 text-slate-200">
              Real support, real movement, and a closer look at how AULEXMED products are worn in daily use.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <a href="https://www.youtube.com/@aulexmed" className="rounded-md bg-white px-6 py-3 text-center text-sm font-semibold text-brand-navy transition hover:-translate-y-0.5 hover:bg-sky-100">
                YouTube Channel
              </a>
              <a href="https://www.youtube.com/watch?v=Wbu6YEePxbc" className="rounded-md border border-white/20 px-6 py-3 text-center text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:border-white/60">
                Original Video
              </a>
            </div>
          </div>
          <div className="min-w-0 overflow-hidden rounded-lg border border-white/15 bg-white/[0.06] p-2 shadow-soft">
            <video
              className="block aspect-video w-full max-w-full rounded-md bg-black object-cover"
              controls
              preload="metadata"
              poster="/brand/homepage-rom-42001-story.png"
            >
              <source src="/videos/aulexmed-42001-homepage.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        </div>
      </section>

      <section className="bg-white py-20 sm:py-28">
        <div className="container-page">
          <div className="max-w-3xl">
            <div>
              <p className="eyebrow">Support Center</p>
              <h2 className="mt-4 text-4xl font-bold tracking-tight text-brand-navy sm:text-5xl">
                Find the next step quickly.
              </h2>
            </div>
          </div>

          <div className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {supportLinks.map((entry) => (
              <Link key={entry.title} href={entry.href} className="rounded-md border border-brand-line bg-slate-50 px-6 py-5 text-base font-semibold text-brand-navy transition hover:-translate-y-0.5 hover:border-brand-blue hover:bg-white hover:shadow-soft">
                {entry.title}
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
