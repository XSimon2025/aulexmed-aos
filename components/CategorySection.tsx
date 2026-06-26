import Image from "next/image";
import Link from "next/link";
import { categories } from "@/data/categories";

export function CategorySection() {
  return (
    <section className="section-y bg-white">
      <div className="container-page">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="eyebrow">Product System</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-brand-navy md:text-4xl">Browse by support category</h2>
          </div>
          <Link href="/products" className="text-sm font-semibold text-brand-blue hover:text-brand-navy">
            View all products
          </Link>
        </div>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
          {categories.map((category) => (
            <Link
              key={category.slug}
              href={`/products/${category.slug}`}
              className="group rounded-lg border border-brand-line bg-slate-50 p-4 transition hover:border-brand-blue hover:bg-brand-sky"
            >
              <div className="relative aspect-square rounded-md bg-white">
                <Image src={category.image} alt={category.name} fill sizes="20vw" className="object-contain p-4" />
              </div>
              <h3 className="mt-4 font-bold text-brand-navy">{category.name}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">{category.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
