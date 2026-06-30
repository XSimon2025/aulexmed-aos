import Image from "next/image";
import Link from "next/link";
import { buildMetadata } from "@/lib/site";

export const metadata = buildMetadata({
  title: "About AULEXMED | Helping People Return to Life",
  description:
    "Learn why customers and partners trust AULEXMED: orthopedic support built around recovery confidence, manufacturing capability, international readiness, and long-term partnership.",
  path: "/about"
});

const ecosystems = [
  {
    title: "Knee Support",
    image: "/products/knee-brace-42001.jpg"
  },
  {
    title: "Ankle Support",
    image: "/products/ankle-brace-52069.jpg"
  },
  {
    title: "Walking Boots",
    image: "/products/walking-boot-52036.jpg"
  },
  {
    title: "Posture Support",
    image: "/products/back-brace-70002.jpg"
  },
  {
    title: "Upper Limb Support",
    image: "/products/wrist-finger-83010.jpg"
  },
  {
    title: "Daily Recovery Products",
    image: "/products/support-product-main.jpg"
  }
];

const trustBlocks = [
  {
    label: "01",
    title: "Engineering",
    body: "Designed around movement, fit and long-term comfort."
  },
  {
    label: "02",
    title: "Manufacturing",
    body: "Factory-controlled production with strict quality standards."
  },
  {
    label: "03",
    title: "Compliance",
    body: "International medical device readiness for global markets."
  },
  {
    label: "04",
    title: "Partnership",
    body: "Long-term OEM, ODM and distributor support."
  }
];

const capabilities = ["Manufacturing facility", "Production capacity", "OEM", "ODM", "Quality Control"];

const certifications = [
  {
    label: "CE",
    title: "CE Mark"
  },
  {
    label: "EUDAMED",
    title: "EUDAMED"
  },
  {
    label: "FDA",
    title: "FDA Registration"
  },
  {
    label: "ISO 13485",
    title: "ISO 13485"
  }
];

export default function AboutPage() {
  return (
    <main>
      <section className="relative isolate min-h-[calc(100vh-122px)] overflow-hidden bg-white">
        <Image
          src="/brand/about-return-to-life-v1.png"
          alt="AULEXMED walking boot supporting a confident return to daily life"
          fill
          priority
          sizes="100vw"
          className="object-cover object-[64%_center]"
        />
        <div className="absolute inset-0 bg-white/86 sm:bg-gradient-to-r sm:from-white sm:via-white/82 sm:to-white/16" />
        <div className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-white via-white/72 to-white/0" />
        <div className="container-page relative flex min-h-[calc(100vh-122px)] items-center py-20 sm:py-24 lg:py-28">
          <div className="max-w-2xl">
            <p className="eyebrow">About AULEXMED</p>
            <h1 className="mt-5 text-5xl font-bold tracking-tight text-brand-navy sm:text-6xl lg:text-7xl">
              Helping People Return to Life.
            </h1>
            <p className="mt-7 max-w-xl text-xl leading-9 text-slate-600">
              At AULEXMED, we believe orthopedic support is about far more than protection.
            </p>
            <p className="mt-5 max-w-xl text-xl leading-9 text-slate-600">
              It is about helping people regain confidence, restore movement, and return to the life they love.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-white py-24 sm:py-32">
        <div className="container-page grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div className="lg:pr-8">
            <p className="eyebrow">Our Story</p>
            <h2 className="mt-5 text-4xl font-bold tracking-tight text-brand-navy sm:text-6xl">
              Trust begins with the journey back.
            </h2>
            <div className="mt-8 max-w-xl space-y-5 text-xl leading-9 text-slate-600">
              <p>An injury changes more than the body. It changes confidence.</p>
              <p>Simple movements become difficult. Daily routines become uncertain.</p>
              <p>
                At AULEXMED, we design orthopedic support that helps people move forward again. Every brace we create exists to support the journey
                back to everyday life.
              </p>
            </div>
          </div>
          <div className="relative min-h-[560px] overflow-hidden rounded-lg bg-slate-100 shadow-soft">
            <Image
              src="/brand/about-story-recovery-v1.png"
              alt="AULEXMED ROM knee brace supporting controlled movement practice"
              fill
              sizes="(min-width: 1024px) 55vw, 100vw"
              className="object-cover object-[48%_center]"
            />
          </div>
        </div>
      </section>

      <section className="bg-slate-50 py-24 sm:py-32">
        <div className="container-page">
          <div className="max-w-3xl">
            <p className="eyebrow">What We Build</p>
            <h2 className="mt-5 text-4xl font-bold tracking-tight text-brand-navy sm:text-5xl">
              A complete support ecosystem for everyday recovery.
            </h2>
          </div>
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {ecosystems.map((item) => (
              <article key={item.title} className="group overflow-hidden rounded-lg bg-white shadow-[0_14px_42px_rgba(18,50,74,0.06)] ring-1 ring-brand-line/70">
                <div className="relative aspect-[4/3] overflow-hidden bg-brand-sky">
                  <Image
                    src={item.image}
                    alt={`AULEXMED ${item.title}`}
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover transition duration-500 group-hover:scale-[1.03]"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-brand-navy">{item.title}</h3>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-24 sm:py-32">
        <div className="container-page">
          <div className="mx-auto max-w-3xl text-center">
            <p className="eyebrow">Why AULEXMED</p>
            <h2 className="mt-5 text-4xl font-bold tracking-tight text-brand-navy sm:text-5xl">
              People trust us because we help people return to life.
            </h2>
          </div>
          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {trustBlocks.map((item) => (
              <article key={item.title} className="rounded-xl bg-slate-50 p-7 ring-1 ring-brand-line/80 transition duration-200 hover:-translate-y-0.5 hover:bg-white hover:ring-brand-blue/35 hover:shadow-[0_16px_40px_rgba(18,50,74,0.08)]">
                <p className="text-sm font-bold tracking-[0.22em] text-brand-blue">{item.label}</p>
                <h3 className="mt-8 text-2xl font-bold text-brand-navy">{item.title}</h3>
                <p className="mt-4 text-base leading-7 text-slate-600">{item.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#f7fbfd] py-24 sm:py-32">
        <div className="container-page grid gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
          <div className="relative min-h-[540px] overflow-hidden rounded-lg bg-white shadow-soft">
            <Image
              src="/brand/about-manufacturing-v1.png"
              alt="AULEXMED manufacturing and quality capability"
              fill
              sizes="(min-width: 1024px) 58vw, 100vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/42 via-transparent to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-white/76">Manufacturing Capability</p>
              <p className="mt-3 max-w-lg text-3xl font-bold leading-tight">Built with controlled production and quality discipline.</p>
            </div>
          </div>
          <div className="lg:pl-8">
            <p className="eyebrow">Manufacturing</p>
            <h2 className="mt-5 text-4xl font-bold tracking-tight text-brand-navy sm:text-5xl">
              Capability that supports long-term trust.
            </h2>
            <p className="mt-7 text-xl leading-9 text-slate-600">
              AULEXMED combines product design, factory production, OEM and ODM collaboration, and quality control into one practical manufacturing
              system.
            </p>
            <div className="mt-10 flex flex-wrap gap-3">
              {capabilities.map((item) => (
                <span key={item} className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-brand-navy ring-1 ring-brand-line/80">
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-24 sm:py-32">
        <div className="container-page">
          <div className="mx-auto max-w-3xl text-center">
            <p className="eyebrow">Global Compliance</p>
            <h2 className="mt-5 text-4xl font-bold tracking-tight text-brand-navy sm:text-5xl">
              Professional. Reliable. International.
            </h2>
          </div>
          <div className="mt-12 overflow-hidden rounded-xl bg-white/72 shadow-[0_20px_60px_rgba(18,50,74,0.08)] ring-1 ring-brand-line/70 backdrop-blur">
            <div className="grid lg:grid-cols-4">
              {certifications.map((item) => (
                <div key={item.label} className="group relative min-h-[170px] p-7 transition duration-200 hover:bg-slate-50 lg:border-r lg:border-brand-line/70 lg:last:border-r-0">
                  <div className="absolute inset-x-7 top-0 h-px bg-gradient-to-r from-transparent via-brand-blue/25 to-transparent lg:hidden" />
                  <div className="flex items-start gap-5">
                    <div className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-brand-sky text-[11px] font-bold uppercase tracking-wide text-brand-blue ring-1 ring-brand-blue/15 transition group-hover:bg-white group-hover:ring-brand-blue/30">
                      <span className="absolute inset-x-3 top-3 h-px bg-brand-blue/25" />
                      <span className="absolute inset-x-3 bottom-3 h-px bg-brand-blue/20" />
                      <span className="relative text-center leading-tight">{item.label}</span>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-brand-navy">{item.title}</h3>
                      <p className="mt-3 text-sm leading-6 text-slate-600">Visual readiness signal for orthopedic support markets.</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-brand-navy py-24 text-white sm:py-32">
        <div className="container-page">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/62">Work With AULEXMED</p>
            <h2 className="mt-5 text-4xl font-bold tracking-tight sm:text-6xl">Let&apos;s Build Better Recovery Together.</h2>
            <p className="mt-7 text-xl leading-9 text-slate-200">
              Whether you&apos;re looking for professional orthopedic products, OEM manufacturing, or long-term business partnership, we&apos;re ready
              to support your journey.
            </p>
            <div className="mt-10 flex flex-col justify-center gap-3.5 sm:flex-row sm:gap-4">
              <Link href="/contact" className="btn-premium bg-white px-7 py-3.5 text-brand-navy shadow-[0_12px_30px_rgba(0,0,0,0.16)] hover:-translate-y-0.5 hover:bg-brand-sky">
                Contact Us
              </Link>
              <Link href="/b2b/distributor-program" className="btn-premium border border-white/22 bg-white/8 px-7 py-3.5 text-white backdrop-blur hover:-translate-y-0.5 hover:bg-white/14">
                Become a Distributor
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
