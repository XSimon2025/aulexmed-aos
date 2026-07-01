import { notFound } from "next/navigation";
import Image from "next/image";
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
    title: `${category.name} Orthopedic Support Solutions`,
    description: `${category.description} Explore AULEXMED ${category.name.toLowerCase()} products with size, support, and purchase guidance.`,
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
      <section className="bg-white py-12 sm:py-16 lg:py-20">
        <div className="container-page">
          <Breadcrumb items={[{ href: "/products", label: "Products" }, { label: category.name }]} />
          <div className="mt-10 grid gap-10 lg:grid-cols-[0.82fr_1.18fr] lg:items-center">
            <div>
              <p className="eyebrow">Support Category</p>
              <h1 className="mt-5 text-5xl font-bold tracking-tight text-brand-navy sm:text-6xl">{category.name}</h1>
              <p className="mt-7 max-w-2xl text-xl leading-9 text-slate-600">{category.description}</p>
              <p className="mt-5 max-w-2xl text-base leading-7 text-slate-500">
                Explore products by recovery purpose first, then choose purchase options on the product detail page.
              </p>
            </div>
            <div className="relative min-h-[420px] overflow-hidden rounded-xl bg-slate-50 shadow-soft">
              <Image
                src={category.image}
                alt={`AULEXMED ${category.name} orthopedic support solution`}
                fill
                priority
                sizes="(min-width: 1024px) 58vw, 100vw"
                className="object-contain p-12"
              />
            </div>
          </div>
        </div>
      </section>
      <section className="bg-slate-50 py-24 sm:py-32">
        <div className="container-page">
          <div className="max-w-3xl">
            <p className="eyebrow">Available Support</p>
            <h2 className="mt-4 text-4xl font-bold tracking-tight text-brand-navy sm:text-5xl">Choose the support that fits your movement need.</h2>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {categoryProducts.map((product) => (
              <ProductCard key={product.slug} product={product} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
