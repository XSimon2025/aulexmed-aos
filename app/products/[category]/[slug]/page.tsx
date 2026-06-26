import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumb } from "@/components/Breadcrumb";
import { CTASection } from "@/components/CTASection";
import { FAQSection } from "@/components/FAQSection";
import { PurchaseOptions } from "@/components/PurchaseOptions";
import { getCategory } from "@/data/categories";
import { getProduct, products } from "@/data/products";
import { buildMetadata } from "@/lib/site";

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

  return buildMetadata({
    title: `${product.name} ${product.sku}`,
    description: product.overview,
    path: `/products/${product.categorySlug}/${product.slug}`
  });
}

export default async function ProductDetailPage({ params }: { params: Promise<{ category: string; slug: string }> }) {
  const { category: categorySlug, slug } = await params;
  const product = getProduct(categorySlug, slug);
  const category = getCategory(categorySlug);
  if (!product || !category) notFound();

  return (
    <>
      <section className="bg-white py-10">
        <div className="container-page">
          <Breadcrumb
            items={[
              { href: "/products", label: "Products" },
              { href: `/products/${category.slug}`, label: category.name },
              { label: product.name }
            ]}
          />
          <div className="mt-8 grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
            <div className="relative aspect-square rounded-lg border border-brand-line bg-slate-50">
              <Image src={product.image} alt={product.name} fill priority sizes="(min-width: 1024px) 45vw, 100vw" className="object-contain p-8" />
            </div>
            <div>
              <p className="eyebrow">{category.name}</p>
              <h1 className="mt-3 text-4xl font-bold text-brand-navy">{product.name}</h1>
              <p className="mt-2 text-sm font-semibold text-slate-500">{product.sku}</p>
              <p className="mt-5 text-base leading-7 text-slate-600">{product.overview}</p>

              <div className="mt-8 rounded-lg border border-brand-line bg-slate-50 p-5">
                <h2 className="text-xl font-bold text-brand-navy">Purchase Options</h2>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  United States customers can use the AULEXMED Temu shop link. Amazon and TikTok buttons guide you to search for Aulexmed and this SKU.
                  Customers outside the United States can contact us for the right purchase or quotation path.
                </p>
                <div className="mt-5">
                  <PurchaseOptions product={product} />
                </div>
              </div>

              <div className="mt-5 grid gap-3 text-sm leading-6 text-slate-600 sm:grid-cols-2">
                <div className="rounded-md border border-brand-line bg-white p-4">
                  <p className="font-semibold text-brand-navy">For US shoppers</p>
                  <p className="mt-1">Use Temu Shop first. For Amazon or TikTok, search Aulexmed with the SKU.</p>
                </div>
                <div className="rounded-md border border-brand-line bg-white p-4">
                  <p className="font-semibold text-brand-navy">For other regions</p>
                  <p className="mt-1">Send your country, SKU, and quantity. We will suggest retail, wholesale, or distributor options.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-y bg-slate-50">
        <div className="container-page grid gap-8 lg:grid-cols-3">
          <div className="rounded-lg border border-brand-line bg-white p-6">
            <h2 className="text-xl font-bold text-brand-navy">Key Features</h2>
            <ul className="mt-4 grid gap-3 text-sm leading-6 text-slate-600">
              {product.features.map((feature) => (
                <li key={feature}>• {feature}</li>
              ))}
            </ul>
          </div>
          <div className="rounded-lg border border-brand-line bg-white p-6">
            <h2 className="text-xl font-bold text-brand-navy">Size Guide</h2>
            <ol className="mt-4 grid list-decimal gap-3 pl-5 text-sm leading-6 text-slate-600">
              {product.sizeGuide.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
          </div>
          <div className="rounded-lg border border-brand-line bg-white p-6">
            <h2 className="text-xl font-bold text-brand-navy">How to Wear</h2>
            <ol className="mt-4 grid list-decimal gap-3 pl-5 text-sm leading-6 text-slate-600">
              {product.howToWear.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <section className="section-y bg-white">
        <div className="container-page grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="eyebrow">Product Help</p>
            <h2 className="mt-3 text-3xl font-bold text-brand-navy">FAQ and manual download area</h2>
            <Link href={product.manualUrl} className="mt-5 inline-flex rounded-md border border-brand-line px-5 py-3 text-sm font-semibold text-brand-navy hover:border-brand-blue">
              User Manual Placeholder
            </Link>
          </div>
          <FAQSection faqs={product.faqs} />
        </div>
      </section>

      <CTASection
        title="Need bulk pricing or custom packaging?"
        body="Send SKU, quantity, target market, and any packaging requirements. The first version routes inquiries to the B2B page and sales email."
        primaryHref="/b2b#request-quotation"
        primaryLabel="Request a Quote"
        secondaryHref={`mailto:business@aulexmed.com?subject=AULEXMED%20Inquiry%20${product.sku}`}
        secondaryLabel="Contact Sales"
      />
    </>
  );
}
