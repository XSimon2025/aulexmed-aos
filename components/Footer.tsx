import Link from "next/link";
import { b2bPaths } from "@/data/b2b";
import { categories } from "@/data/categories";
import { siteConfig } from "@/lib/site";

export function Footer() {
  return (
    <footer className="border-t border-brand-line bg-brand-navy text-white">
      <div className="container-page grid gap-10 py-12 md:grid-cols-5">
        <div className="md:col-span-2">
          <p className="text-xl font-bold">AULEXMED</p>
          <p className="mt-2 max-w-xl text-sm leading-6 text-slate-200">
            {siteConfig.slogan}. Practical orthopedic support products for daily movement, retail channels, and B2B partners.
          </p>
          <a className="mt-4 inline-flex text-sm font-semibold text-sky-200" href={`mailto:${siteConfig.email}`}>
            {siteConfig.email}
          </a>
        </div>
        <div>
          <p className="font-semibold">Brand</p>
          <div className="mt-3 grid gap-2 text-sm text-slate-200">
            <Link href="/about" className="hover:text-white">About</Link>
            <Link href="/why-choose-aulexmed" className="hover:text-white">Why Choose</Link>
            <Link href="/factory" className="hover:text-white">Factory</Link>
            <Link href="/certificates" className="hover:text-white">Certificates</Link>
            <Link href="/contact" className="hover:text-white">Contact</Link>
          </div>
        </div>
        <div>
          <p className="font-semibold">Products</p>
          <div className="mt-3 grid gap-2 text-sm text-slate-200">
            {categories.map((category) => (
              <Link key={category.slug} href={`/products/${category.slug}`} className="hover:text-white">
                {category.name}
              </Link>
            ))}
          </div>
        </div>
        <div>
          <p className="font-semibold">Support</p>
          <div className="mt-3 grid gap-2 text-sm text-slate-200">
            <Link href="/support/manuals">User Manuals</Link>
            <Link href="/support/how-to-wear">How to Wear</Link>
            <Link href="/support/size-guide">Size Guide</Link>
            <Link href="/support/warranty">Warranty</Link>
            <Link href="/support/replacement-parts">Replacement Parts</Link>
            <Link href="/b2b">Wholesale</Link>
            {b2bPaths.map((path) => (
              <Link key={path.href} href={path.href}>{path.title}</Link>
            ))}
            <Link href="/guides">Guides</Link>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 py-4">
        <div className="container-page text-xs text-slate-300">Copyright © 2026 AULEXMED. First-phase website framework.</div>
      </div>
    </footer>
  );
}
