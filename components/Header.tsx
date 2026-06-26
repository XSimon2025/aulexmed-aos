import Image from "next/image";
import Link from "next/link";
import { categories } from "@/data/categories";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/products", label: "Products" },
  { href: "/support", label: "Support" },
  { href: "/b2b", label: "Wholesale" },
  { href: "/guides", label: "Guides" }
];

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-brand-line bg-white/95 backdrop-blur">
      <div className="container-page flex min-h-16 items-center justify-between gap-4 py-3">
        <Link href="/" className="flex items-center gap-3" aria-label="AULEXMED home">
          <Image
            src="/brand/aulexmed-logo.png"
            alt="AULEXMED"
            width={184}
            height={48}
            priority
            className="h-10 w-auto"
          />
        </Link>
        <nav className="hidden items-center gap-6 text-sm font-medium text-slate-700 lg:flex">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="transition hover:text-brand-blue">
              {item.label}
            </Link>
          ))}
        </nav>
        <Link
          href="/b2b#request-quotation"
          className="hidden rounded-md bg-brand-blue px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-navy sm:inline-flex"
        >
          Request Quote
        </Link>
      </div>
      <div className="border-t border-brand-line bg-brand-sky/70 lg:hidden">
        <nav className="container-page flex gap-4 overflow-x-auto py-2 text-sm font-semibold text-slate-700">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="whitespace-nowrap">
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
      <div className="hidden border-t border-brand-line bg-slate-50 lg:block">
        <div className="container-page flex gap-5 overflow-x-auto py-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
          {categories.map((category) => (
            <Link key={category.slug} href={`/products/${category.slug}`} className="whitespace-nowrap hover:text-brand-blue">
              {category.name}
            </Link>
          ))}
        </div>
      </div>
    </header>
  );
}
