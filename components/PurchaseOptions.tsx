import Link from "next/link";
import type { Product } from "@/data/products";

type PurchaseOptionsProps = {
  product: Product;
  compact?: boolean;
};

export function PurchaseOptions({ product, compact = false }: PurchaseOptionsProps) {
  const buttonBase = compact ? "btn-premium btn-premium-compact" : "btn-premium px-5 py-3";

  return (
    <div className={compact ? "grid gap-2" : "grid gap-6 lg:grid-cols-2"}>
      <div className="rounded-xl bg-white p-5 ring-1 ring-brand-line/80">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-blue">United States</p>
        <p className="mt-2 text-sm leading-6 text-slate-600">Use the AULEXMED Temu shop link, or search Aulexmed on Amazon and TikTok.</p>
        <div className={compact ? "mt-4 grid gap-2" : "mt-5 grid gap-3"}>
          <a href={product.purchaseLinks.temuShop} target="_blank" rel="noreferrer" className={`${buttonBase} btn-premium-primary`}>
            Buy on Temu Shop
          </a>
          <a href={product.purchaseLinks.amazonSearch} target="_blank" rel="noreferrer" className={`${buttonBase} btn-premium-secondary`}>
            Search on Amazon
          </a>
          <a href={product.purchaseLinks.tiktokSearch} target="_blank" rel="noreferrer" className={`${buttonBase} btn-premium-secondary`}>
            Search on TikTok
          </a>
        </div>
      </div>
      <div className="rounded-xl bg-slate-50 p-5 ring-1 ring-brand-line/80">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-blue">Other Regions</p>
        <p className="mt-2 text-sm leading-6 text-slate-600">Share your country, SKU and quantity so our team can guide retail, wholesale or distributor options.</p>
        <div className={compact ? "mt-4 grid gap-2" : "mt-5 grid gap-3"}>
          <a href={product.purchaseLinks.internationalEmail} className={`${buttonBase} btn-premium-secondary`}>
            Contact Sales
          </a>
          {!compact ? (
            <Link href={product.purchaseLinks.quote} className={`${buttonBase} btn-premium-primary`}>
              Request a Quote
            </Link>
          ) : null}
        </div>
      </div>
    </div>
  );
}
