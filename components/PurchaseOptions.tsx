import Link from "next/link";
import type { Product } from "@/data/products";

type PurchaseOptionsProps = {
  product: Product;
  compact?: boolean;
};

export function PurchaseOptions({ product, compact = false }: PurchaseOptionsProps) {
  const buttonBase = compact
    ? "rounded-md px-3 py-2 text-center text-xs font-semibold"
    : "rounded-md px-4 py-3 text-center text-sm font-semibold";

  return (
    <div className={compact ? "grid gap-2" : "grid gap-3 sm:grid-cols-2"}>
      <a
        href={product.purchaseLinks.temuShop}
        target="_blank"
        rel="noreferrer"
        className={`${buttonBase} bg-brand-blue text-white hover:bg-brand-navy`}
      >
        US: Buy on Temu Shop
      </a>
      <a
        href={product.purchaseLinks.amazonSearch}
        target="_blank"
        rel="noreferrer"
        className={`${buttonBase} border border-brand-line text-brand-navy hover:border-brand-blue`}
      >
        US: Search on Amazon
      </a>
      <a
        href={product.purchaseLinks.tiktokSearch}
        target="_blank"
        rel="noreferrer"
        className={`${buttonBase} border border-brand-line text-brand-navy hover:border-brand-blue`}
      >
        US: Search on TikTok
      </a>
      <a
        href={product.purchaseLinks.internationalEmail}
        className={`${buttonBase} border border-brand-line text-brand-navy hover:border-brand-blue`}
      >
        Other Regions: Contact Us
      </a>
      {!compact ? (
        <Link href={product.purchaseLinks.quote} className={`${buttonBase} bg-brand-navy text-white hover:bg-brand-blue sm:col-span-2`}>
          Bulk / Distributor Quote
        </Link>
      ) : null}
    </div>
  );
}
