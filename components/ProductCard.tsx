import Image from "next/image";
import Link from "next/link";
import { getCategory } from "@/data/categories";
import type { Product } from "@/data/products";
import { getProductDisplay } from "@/lib/productDisplay";

export function ProductCard({ product }: { product: Product }) {
  const category = getCategory(product.categorySlug);
  const display = getProductDisplay(product);

  return (
    <article className="group overflow-hidden rounded-xl bg-white shadow-[0_14px_42px_rgba(18,50,74,0.06)] ring-1 ring-brand-line/70 transition duration-300 hover:-translate-y-1 hover:shadow-[0_22px_58px_rgba(18,50,74,0.10)] hover:ring-brand-blue/25">
      <div className="relative aspect-[4/3] bg-slate-50">
        <Link href={`/products/${product.categorySlug}/${product.slug}`} className="block h-full">
          <Image
            src={product.image}
            alt={`AULEXMED ${display.title} ${display.model}`}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
            className="object-contain p-7 transition duration-500 group-hover:scale-[1.04]"
          />
        </Link>
      </div>
      <div className="p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-blue">{category?.name ?? "AULEXMED"}</p>
        <Link href={`/products/${product.categorySlug}/${product.slug}`} className="mt-2 block">
          <h3 className="text-2xl font-bold tracking-tight text-brand-navy transition hover:text-brand-blue">{display.title}</h3>
        </Link>
        <p className="mt-2 text-base font-semibold text-brand-blue">{display.tagline}</p>
        <p className="mt-2 text-sm font-semibold text-slate-500">{display.model}</p>
        <p className="mt-5 line-clamp-3 text-sm leading-6 text-slate-600">{product.overview}</p>
        <div className="mt-7 flex flex-col gap-3 sm:flex-row">
          <Link href={`/products/${product.categorySlug}/${product.slug}`} className="btn-premium btn-premium-secondary btn-premium-compact">
            View Details
          </Link>
          <Link href={`/products/${product.categorySlug}/${product.slug}#buy-now`} className="btn-premium btn-premium-primary btn-premium-compact">
            Buy Now
          </Link>
        </div>
      </div>
    </article>
  );
}
