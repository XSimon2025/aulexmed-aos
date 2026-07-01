import Image from "next/image";
import { Breadcrumb } from "@/components/Breadcrumb";
import { CategorySection } from "@/components/CategorySection";
import { ProductCard } from "@/components/ProductCard";
import { products } from "@/data/products";
import { buildMetadata } from "@/lib/site";

export const metadata = buildMetadata({
  title: "Orthopedic Recovery Support Solutions",
  description:
    "Explore AULEXMED orthopedic support solutions, including walking boots, ROM knee braces, ankle support, posture support, and daily recovery products.",
  path: "/products"
});

export default function ProductsPage() {
  const featuredProducts = products.filter((product) => ["BL-52036", "BL-42001", "BL-42008", "BL-52069"].includes(product.sku));

  return (
    <>
      <section className="relative isolate overflow-hidden bg-white py-12 sm:py-16 lg:py-20">
        <div className="absolute inset-y-0 right-0 hidden w-1/2 bg-brand-sky/70 lg:block" />
        <div className="container-page relative">
          <Breadcrumb items={[{ label: "Products" }]} />
          <div className="mt-10 grid gap-12 lg:grid-cols-[0.86fr_1.14fr] lg:items-center">
            <div>
              <p className="eyebrow">Orthopedic Support Solutions</p>
              <h1 className="mt-5 text-5xl font-bold tracking-tight text-brand-navy sm:text-6xl">
                Orthopedic Solutions Designed Around Recovery.
              </h1>
              <p className="mt-7 max-w-2xl text-xl leading-9 text-slate-600">
                From ankle protection to knee stability, AULEXMED develops professional orthopedic support solutions that help people move with
                confidence through every stage of recovery.
              </p>
              <div className="mt-10 flex flex-col gap-3.5 sm:flex-row sm:gap-4">
                <a href="#solutions" className="btn-premium btn-premium-primary px-7 py-3.5">
                  Explore Solutions
                </a>
                <a href="#featured-support" className="btn-premium btn-premium-secondary px-7 py-3.5">
                  Find Support
                </a>
              </div>
            </div>
            <div className="relative min-h-[460px] overflow-hidden rounded-xl bg-slate-50 shadow-soft">
              <Image
                src="/brand/homepage-hero-52036-v2.png"
                alt="AULEXMED walking boot orthopedic recovery solution"
                fill
                priority
                sizes="(min-width: 1024px) 58vw, 100vw"
                className="object-cover object-[64%_center]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/34 via-transparent to-white/10" />
              <div className="absolute bottom-0 left-0 right-0 p-7 text-white">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-white/76">Knee & Ankle Focus</p>
                <p className="mt-3 max-w-md text-3xl font-bold leading-tight">Support systems for confident movement.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div id="solutions">
        <CategorySection />
      </div>

      <section id="featured-support" className="bg-slate-50 py-24 sm:py-32">
        <div className="container-page">
          <div className="max-w-3xl">
            <p className="eyebrow">Featured Support</p>
            <h2 className="mt-4 text-4xl font-bold tracking-tight text-brand-navy sm:text-5xl">Start with the core recovery supports.</h2>
            <p className="mt-5 text-lg leading-8 text-slate-600">
              These products represent the core AULEXMED focus: walking boot support, controlled knee stability, and daily ankle protection.
            </p>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {featuredProducts.map((product) => (
              <ProductCard key={product.slug} product={product} />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-24 sm:py-32">
        <div className="container-page">
          <div className="max-w-3xl">
            <p className="eyebrow">Product Index</p>
            <h2 className="mt-4 text-4xl font-bold tracking-tight text-brand-navy sm:text-5xl">Browse the full support system.</h2>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product.slug} product={product} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
