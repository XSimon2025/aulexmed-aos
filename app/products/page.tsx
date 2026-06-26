import { Breadcrumb } from "@/components/Breadcrumb";
import { CategorySection } from "@/components/CategorySection";
import { ProductCard } from "@/components/ProductCard";
import { products } from "@/data/products";
import { buildMetadata } from "@/lib/site";

export const metadata = buildMetadata({
  title: "Orthopedic Support Products",
  description: "Browse AULEXMED knee braces, ankle braces, walking boots, back support, and wrist support products.",
  path: "/products"
});

export default function ProductsPage() {
  return (
    <>
      <section className="bg-white py-10">
        <div className="container-page">
          <Breadcrumb items={[{ label: "Products" }]} />
          <h1 className="mt-6 text-4xl font-bold text-brand-navy">Product Catalog</h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600">
            Browse AULEXMED products by category. Each product page includes United States purchase links, Amazon and TikTok search guidance,
            international inquiry routing, support content, and B2B quotation paths.
          </p>
        </div>
      </section>
      <CategorySection />
      <section className="section-y bg-slate-50">
        <div className="container-page grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      </section>
    </>
  );
}
