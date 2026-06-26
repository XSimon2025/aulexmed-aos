import { notFound } from "next/navigation";
import { Breadcrumb } from "@/components/Breadcrumb";
import { ProductCard } from "@/components/ProductCard";
import { categories, getCategory } from "@/data/categories";
import { getProductsByCategory } from "@/data/products";
import { buildMetadata } from "@/lib/site";

export function generateStaticParams() {
  return categories.map((category) => ({ category: category.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ category: string }> }) {
  const { category: categorySlug } = await params;
  const category = getCategory(categorySlug);
  if (!category) return {};

  return buildMetadata({
    title: category.name,
    description: category.description,
    path: `/products/${category.slug}`
  });
}

export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category: categorySlug } = await params;
  const category = getCategory(categorySlug);
  if (!category) notFound();

  const categoryProducts = getProductsByCategory(category.slug);

  return (
    <>
      <section className="bg-white py-10">
        <div className="container-page">
          <Breadcrumb items={[{ href: "/products", label: "Products" }, { label: category.name }]} />
          <p className="eyebrow mt-6">Product Category</p>
          <h1 className="mt-3 text-4xl font-bold text-brand-navy">{category.name}</h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600">{category.description}</p>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-500">
            Product cards include direct purchase/search paths for United States shoppers and inquiry routing for other regions.
          </p>
        </div>
      </section>
      <section className="section-y bg-slate-50">
        <div className="container-page grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {categoryProducts.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      </section>
    </>
  );
}
