import Image from "next/image";
import Link from "next/link";
import { buildMetadata } from "@/lib/site";

export const metadata = buildMetadata({
  title: "AULEXMED | Knee & Ankle Orthopedic Experts",
  description:
    "AULEXMED is a knee and ankle orthopedic support brand helping people move steadily back to everyday life with walking boots, ROM knee braces, and clear product support."
});

const trustItems = [
  {
    label: "CE",
    title: "European market readiness.",
    detail: "A visual trust signal for EU-focused product compliance."
  },
  {
    label: "EUDAMED",
    title: "EU database alignment.",
    detail: "Built for the documentation needs of medical device markets."
  },
  {
    label: "FDA",
    title: "U.S. registration pathway.",
    detail: "Presented as registration support, not endorsement."
  },
  {
    label: "ISO 13485",
    title: "Quality management system.",
    detail: "Manufacturer discipline for medical device production."
  }
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
          src="/brand/homepage-hero-52036-v2.png"
          alt="AULEXMED Walking Boot worn during a calm return to everyday movement"
          fill
          priority
          sizes="100vw"
          className="object-cover object-[61%_center]"
        />
        <div className="absolute inset-0 bg-white/82 sm:bg-gradient-to-r sm:from-white sm:via-white/78 sm:to-white/10" />
        <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-white via-white/70 to-white/0" />

        <div className="container-page relative flex min-h-[calc(100vh-122px)] items-center py-20 sm:py-24 lg:py-28">
          <div className="max-w-2xl">
            <p className="eyebrow">AULEXMED — Knee & Ankle Orthopedic Experts</p>
            <h1 className="mt-5 text-5xl font-bold tracking-tight text-brand-navy sm:text-6xl lg:text-7xl">
              Back to Life.
              <span className="block">One Step at a Time.</span>
            </h1>
            <p className="mt-7 max-w-xl text-xl leading-9 text-slate-600">
              Recovery is not only about healing. It is about returning to the life you love.
            </p>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <Link href="/products/walking-boots" className="rounded-md bg-brand-blue px-7 py-3.5 text-center text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-brand-navy">
                Explore Walking Boots
              </Link>
              <Link href="/products/knee-braces" className="rounded-md border border-brand-line bg-white/82 px-7 py-3.5 text-center text-sm font-semibold text-brand-navy backdrop-blur transition hover:-translate-y-0.5 hover:border-brand-blue">
                Explore Knee Support
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-24 sm:py-32">
        <div className="container-page grid gap-12 lg:grid-cols-[0.78fr_1.22fr] lg:items-center">
          <div>
            <p className="eyebrow">Brand Video</p>
            <h2 className="mt-5 text-4xl font-bold tracking-tight text-brand-navy sm:text-6xl">
              See AULEXMED in Motion
            </h2>
            <p className="mt-7 max-w-xl text-lg leading-8 text-slate-600">
              Real support, real movement, and a closer look at how AULEXMED products are worn in daily use.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <a href="https://www.youtube.com/watch?v=Wbu6YEePxbc" className="rounded-md bg-brand-blue px-6 py-3 text-center text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-brand-navy">
                Watch on YouTube
              </a>
              <a href="https://www.youtube.com/@aulexmed" className="rounded-md border border-brand-line bg-white px-6 py-3 text-center text-sm font-semibold text-brand-navy transition hover:-translate-y-0.5 hover:border-brand-blue">
                Visit YouTube Channel
              </a>
            </div>
          </div>

          <div className="min-w-0 overflow-hidden rounded-lg bg-slate-100 p-2 shadow-soft">
            <div className="group relative aspect-video overflow-hidden rounded-md bg-black">
              <video
                className="absolute inset-0 h-full w-full object-cover"
                controls
                preload="metadata"
                poster="/brand/homepage-rom-42001-story.png"
              >
                <source src="/videos/aulexmed-42001-homepage.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/5 opacity-100 transition duration-300 group-hover:opacity-0 group-focus-within:opacity-0">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/88 shadow-soft backdrop-blur">
                  <span className="ml-1 block h-0 w-0 border-y-[10px] border-l-[16px] border-y-transparent border-l-brand-blue" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-slate-50 py-24 sm:py-32">
        <div className="container-page grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div className="relative min-h-[560px] overflow-hidden rounded-lg bg-white shadow-soft">
            <Image
              src="/brand/homepage-hero-52036-v2.png"
              alt="AULEXMED Walking Boot supporting confident daily movement"
              fill
              sizes="(min-width: 1024px) 58vw, 100vw"
              className="object-cover object-[68%_center]"
            />
          </div>
          <div className="lg:pl-8">
            <p className="eyebrow">Model 52036</p>
            <h2 className="mt-5 text-4xl font-bold tracking-tight text-brand-navy sm:text-6xl">
              Walking Boot
            </h2>
            <p className="mt-5 text-2xl font-semibold text-brand-blue">Stable Support. Confident Steps.</p>
            <p className="mt-7 text-xl leading-9 text-slate-600">
              Designed for ankle protection and everyday movement, helping each step feel steadier on the way back to daily life.
            </p>
            <Link href="/products/walking-boots" className="mt-10 inline-flex rounded-md border border-brand-line bg-white px-7 py-3.5 text-sm font-semibold text-brand-navy transition hover:-translate-y-0.5 hover:border-brand-blue">
              Explore Walking Boots
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-white py-24 sm:py-32">
        <div className="container-page grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div className="lg:pr-8">
            <p className="eyebrow">Model 42001</p>
            <h2 className="mt-5 text-4xl font-bold tracking-tight text-brand-navy sm:text-6xl">
              ROM Knee Brace
            </h2>
            <p className="mt-5 text-2xl font-semibold text-brand-blue">Controlled Support. Confident Recovery.</p>
            <p className="mt-7 text-xl leading-9 text-slate-600">
              Adjustable knee support designed for stability, protection and confidence through every stage of movement.
            </p>
            <Link href="/products/knee-braces" className="mt-10 inline-flex rounded-md border border-brand-line bg-white px-7 py-3.5 text-sm font-semibold text-brand-navy transition hover:-translate-y-0.5 hover:border-brand-blue">
              Explore Knee Braces
            </Link>
          </div>
          <div className="relative min-h-[560px] overflow-hidden rounded-lg bg-slate-100 shadow-soft">
            <Image
              src="/brand/homepage-rom-42001-story.png"
              alt="AULEXMED ROM Knee Brace used during steady rehabilitation movement"
              fill
              sizes="(min-width: 1024px) 58vw, 100vw"
              className="object-cover object-[52%_center]"
            />
          </div>
        </div>
      </section>

      <section className="bg-[#f7fbfd] py-20 sm:py-28">
        <div className="container-page">
          <div className="mx-auto max-w-3xl text-center">
            <p className="eyebrow">Quality. Compliance. Confidence.</p>
            <h2 className="mt-4 text-4xl font-bold tracking-tight text-brand-navy sm:text-5xl">
              Built for professional orthopedic support markets.
            </h2>
          </div>

          <div className="mt-12 grid gap-4 lg:grid-cols-4">
            {trustItems.map((item) => (
              <div key={item.label} className="rounded-lg bg-white/86 p-7 shadow-[0_18px_50px_rgba(18,50,74,0.07)] ring-1 ring-brand-line/70">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-sky text-sm font-bold text-brand-blue">
                  {item.label}
                </div>
                <h3 className="mt-6 text-lg font-bold text-brand-navy">{item.title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-600">{item.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-20 sm:py-28">
        <div className="container-page">
          <div className="max-w-3xl">
            <p className="eyebrow">Support Center</p>
            <h2 className="mt-4 text-4xl font-bold tracking-tight text-brand-navy sm:text-5xl">
              Find the next step quickly.
            </h2>
          </div>

          <div className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {supportLinks.map((entry) => (
              <Link key={entry.title} href={entry.href} className="rounded-md bg-slate-50 px-6 py-5 text-base font-semibold text-brand-navy ring-1 ring-brand-line transition hover:-translate-y-0.5 hover:bg-white hover:ring-brand-blue hover:shadow-soft">
                {entry.title}
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
