import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumb } from "@/components/Breadcrumb";
import { FAQSection } from "@/components/FAQSection";
import { PurchaseOptions } from "@/components/PurchaseOptions";
import { getCategory } from "@/data/categories";
import { getProduct, products } from "@/data/products";
import { buildMetadata } from "@/lib/site";
import { getProductDisplay } from "@/lib/productDisplay";

export function generateStaticParams() {
  return products.map((product) => ({
    category: product.categorySlug,
    slug: product.slug
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ category: string; slug: string }> }) {
  const { category, slug } = await params;
  const product = getProduct(category, slug);
  if (!product) return {};

  const display = getProductDisplay(product);

  return buildMetadata({
    title: `${display.title} | ${display.model} Orthopedic Support`,
    description: `${display.tagline} ${product.overview}`,
    path: `/products/${product.categorySlug}/${product.slug}`
  });
}

export default async function ProductDetailPage({ params }: { params: Promise<{ category: string; slug: string }> }) {
  const { category: categorySlug, slug } = await params;
  const product = getProduct(categorySlug, slug);
  const category = getCategory(categorySlug);
  if (!product || !category) notFound();

  const display = getProductDisplay(product);
  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: `${display.title} ${display.model}`,
    sku: product.sku,
    category: category.name,
    image: product.gallery,
    description: product.overview,
    brand: {
      "@type": "Brand",
      name: "AULEXMED"
    },
    offers: {
      "@type": "Offer",
      url: product.purchaseLinks.temuShop,
      availability: "https://schema.org/InStock"
    }
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }} />

      <section className="bg-white py-12 sm:py-16 lg:py-20">
        <div className="container-page">
          <Breadcrumb
            items={[
              { href: "/products", label: "Products" },
              { href: `/products/${category.slug}`, label: category.name },
              { label: display.title }
            ]}
          />
          <div className="mt-10 grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
            <div className="relative min-h-[560px] overflow-hidden rounded-xl bg-slate-50 shadow-soft">
              <Image
                src={product.image}
                alt={`AULEXMED ${display.title} ${display.model}`}
                fill
                priority
                sizes="(min-width: 1024px) 52vw, 100vw"
                className="object-contain p-12"
              />
            </div>
            <div>
              <p className="eyebrow">{category.name}</p>
              <h1 className="mt-5 text-5xl font-bold tracking-tight text-brand-navy sm:text-6xl">{display.title}</h1>
              <p className="mt-5 text-2xl font-semibold text-brand-blue">{display.tagline}</p>
              <p className="mt-4 text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">{display.model}</p>
              <p className="mt-7 max-w-xl text-xl leading-9 text-slate-600">{product.overview}</p>
              <div className="mt-10 flex flex-col gap-3.5 sm:flex-row sm:gap-4">
                <a href="#buy-now" className="btn-premium btn-premium-primary px-7 py-3.5">
                  Buy Now
                </a>
                <a href="#support-details" className="btn-premium btn-premium-secondary px-7 py-3.5">
                  View Support Details
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-slate-50 py-24 sm:py-32">
        <div className="container-page grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
          <div>
            <p className="eyebrow">Recovery Purpose</p>
            <h2 className="mt-4 text-4xl font-bold tracking-tight text-brand-navy sm:text-5xl">Support designed around movement.</h2>
          </div>
          <div className="grid gap-5 md:grid-cols-2">
            <article className="rounded-xl bg-white p-7 shadow-[0_14px_42px_rgba(18,50,74,0.06)] ring-1 ring-brand-line/70">
              <h3 className="text-2xl font-bold text-brand-navy">Who It Supports</h3>
              <p className="mt-5 text-base leading-7 text-slate-600">{display.purpose}</p>
            </article>
            <article className="rounded-xl bg-white p-7 shadow-[0_14px_42px_rgba(18,50,74,0.06)] ring-1 ring-brand-line/70">
              <h3 className="text-2xl font-bold text-brand-navy">How It Helps Movement</h3>
              <p className="mt-5 text-base leading-7 text-slate-600">{display.movement}</p>
            </article>
          </div>
        </div>
      </section>

      <section id="support-details" className="bg-white py-24 sm:py-32">
        <div className="container-page">
          <div className="max-w-3xl">
            <p className="eyebrow">Key Support Features</p>
            <h2 className="mt-4 text-4xl font-bold tracking-tight text-brand-navy sm:text-5xl">Practical details for everyday support.</h2>
          </div>
          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {product.features.map((feature, index) => (
              <article key={feature} className="rounded-xl bg-slate-50 p-6 ring-1 ring-brand-line/80">
                <p className="text-sm font-bold tracking-[0.22em] text-brand-blue">{String(index + 1).padStart(2, "0")}</p>
                <p className="mt-6 text-base font-semibold leading-7 text-brand-navy">{feature}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#f7fbfd] py-24 sm:py-32">
        <div className="container-page grid gap-8 lg:grid-cols-3">
          <article className="rounded-xl bg-white p-7 shadow-[0_14px_42px_rgba(18,50,74,0.06)] ring-1 ring-brand-line/70">
            <p className="eyebrow">Specifications</p>
            <dl className="mt-6 grid gap-4 text-sm leading-6 text-slate-600">
              <div>
                <dt className="font-semibold text-brand-navy">Model</dt>
                <dd>{display.model}</dd>
              </div>
              <div>
                <dt className="font-semibold text-brand-navy">SKU</dt>
                <dd>{product.sku}</dd>
              </div>
              <div>
                <dt className="font-semibold text-brand-navy">Category</dt>
                <dd>{category.name}</dd>
              </div>
            </dl>
          </article>
          <article className="rounded-xl bg-white p-7 shadow-[0_14px_42px_rgba(18,50,74,0.06)] ring-1 ring-brand-line/70">
            <p className="eyebrow">Size Guide</p>
            <ol className="mt-6 grid list-decimal gap-3 pl-5 text-sm leading-6 text-slate-600">
              {product.sizeGuide.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
          </article>
          <article className="rounded-xl bg-white p-7 shadow-[0_14px_42px_rgba(18,50,74,0.06)] ring-1 ring-brand-line/70">
            <p className="eyebrow">How to Wear</p>
            <ol className="mt-6 grid list-decimal gap-3 pl-5 text-sm leading-6 text-slate-600">
              {product.howToWear.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
          </article>
        </div>
      </section>

      <section className="bg-white py-24 sm:py-32">
        <div className="container-page grid gap-10 lg:grid-cols-[0.78fr_1.22fr]">
          <div>
            <p className="eyebrow">Support Center</p>
            <h2 className="mt-4 text-4xl font-bold tracking-tight text-brand-navy sm:text-5xl">Manuals, FAQ and product guidance.</h2>
            <p className="mt-6 text-base leading-7 text-slate-600">
              Match the SKU on your product package before using manual, size, or wearing guidance.
            </p>
            <Link href={product.manualUrl} className="btn-premium btn-premium-secondary mt-8 px-6 py-3">
              User Manual Center
            </Link>
          </div>
          <FAQSection faqs={product.faqs} />
        </div>
      </section>

      <section id="buy-now" className="bg-slate-50 py-24 sm:py-32">
        <div className="container-page">
          <div className="mx-auto max-w-3xl text-center">
            <p className="eyebrow">Buy Now</p>
            <h2 className="mt-4 text-4xl font-bold tracking-tight text-brand-navy sm:text-5xl">Choose the right purchase path.</h2>
            <p className="mt-6 text-lg leading-8 text-slate-600">
              United States customers can use the AULEXMED Temu shop link or search Aulexmed on Amazon and TikTok. Other regions can contact sales or
              request a quotation.
            </p>
          </div>
          <div className="mx-auto mt-12 max-w-4xl">
            <PurchaseOptions product={product} />
          </div>
        </div>
      </section>
    </>
  );
}
