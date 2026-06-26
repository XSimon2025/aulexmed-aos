import Image from "next/image";
import Link from "next/link";
import { getCategory } from "@/data/categories";
import type { Product } from "@/data/products";
import { PurchaseOptions } from "@/components/PurchaseOptions";

export function ProductCard({ product }: { product: Product }) {
  const category = getCategory(product.categorySlug);

  return (
    <article className="group overflow-hidden rounded-lg border border-brand-line bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-soft">
      <div className="relative aspect-square bg-slate-50">
        <Link href={`/products/${product.categorySlug}/${product.slug}`} className="block h-full">
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
            className="object-contain p-6 transition duration-300 group-hover:scale-105"
          />
        </Link>
      </div>
      <div className="p-5">
        <p className="text-xs font-semibold uppercase tracking-wide text-brand-blue">{category?.name ?? "AULEXMED"}</p>
        <Link href={`/products/${product.categorySlug}/${product.slug}`} className="mt-2 block">
          <h3 className="text-lg font-bold text-brand-navy hover:text-brand-blue">{product.name}</h3>
        </Link>
        <p className="mt-1 text-sm font-semibold text-slate-500">{product.sku}</p>
        <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-600">{product.overview}</p>
        <Link href={`/products/${product.categorySlug}/${product.slug}`} className="mt-5 inline-flex text-sm font-semibold text-brand-blue">
          View details
        </Link>
        <div className="mt-4 border-t border-brand-line pt-4">
          <PurchaseOptions product={product} compact />
        </div>
      </div>
    </article>
  );
}
