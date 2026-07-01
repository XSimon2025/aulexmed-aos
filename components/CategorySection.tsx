import Image from "next/image";
import Link from "next/link";
import { categories } from "@/data/categories";

const categoryFraming: Record<string, string> = {
  "walking-boots": "Ankle recovery support for confident steps.",
  "knee-braces": "Stability and control for knee movement.",
  "ankle-braces": "Daily ankle support for active movement.",
  "back-posture-support": "Support for everyday alignment and comfort.",
  "wrist-finger-support": "Targeted support for hand and upper-limb needs.",
  "neck-shoulder-support": "Neck and shoulder support for upper-body routines.",
  "elbow-arm-support": "Elbow and arm support for daily movement needs.",
  "daily-support-products": "Practical support products for everyday recovery."
};

export function CategorySection() {
  return (
    <section className="bg-white py-24 sm:py-32">
      <div className="container-page">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div className="max-w-3xl">
            <p className="eyebrow">Recovery Solution System</p>
            <h2 className="mt-4 text-4xl font-bold tracking-tight text-brand-navy sm:text-5xl">Find support by movement need.</h2>
            <p className="mt-5 text-lg leading-8 text-slate-600">
              AULEXMED organizes orthopedic support around the way people move, recover, and return to daily life.
            </p>
          </div>
          <Link href="/products" className="btn-premium btn-premium-secondary btn-premium-compact">
            View all products
          </Link>
        </div>
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((category) => (
            <Link
              key={category.slug}
              href={`/products/${category.slug}`}
              className="group overflow-hidden rounded-xl bg-slate-50 shadow-[0_12px_34px_rgba(18,50,74,0.05)] ring-1 ring-brand-line/70 transition duration-300 hover:-translate-y-1 hover:bg-white hover:ring-brand-blue/30 hover:shadow-[0_20px_48px_rgba(18,50,74,0.09)]"
            >
              <div className="relative aspect-[4/3] bg-white">
                <Image
                  src={category.image}
                  alt={`AULEXMED ${category.name} orthopedic support category`}
                  fill
                  sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                  className="object-contain p-7 transition duration-500 group-hover:scale-[1.04]"
                />
              </div>
              <div className="p-6">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-blue">{category.shortName}</p>
                <h3 className="mt-3 text-2xl font-bold tracking-tight text-brand-navy">{category.name}</h3>
                <p className="mt-4 text-sm leading-6 text-slate-600">{categoryFraming[category.slug] ?? category.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
