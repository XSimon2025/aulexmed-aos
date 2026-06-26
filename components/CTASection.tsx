import Link from "next/link";

export function CTASection({
  eyebrow = "Need help?",
  title,
  body,
  primaryHref,
  primaryLabel,
  secondaryHref,
  secondaryLabel
}: {
  eyebrow?: string;
  title: string;
  body: string;
  primaryHref: string;
  primaryLabel: string;
  secondaryHref?: string;
  secondaryLabel?: string;
}) {
  return (
    <section className="section-y bg-brand-sky">
      <div className="container-page">
        <div className="rounded-lg border border-brand-line bg-white p-6 shadow-sm md:p-10">
          <p className="eyebrow">{eyebrow}</p>
          <div className="mt-3 grid gap-6 md:grid-cols-[1fr_auto] md:items-center">
            <div>
              <h2 className="text-2xl font-bold text-brand-navy md:text-3xl">{title}</h2>
              <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600 md:text-base">{body}</p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row md:flex-col">
              <Link href={primaryHref} className="rounded-md bg-brand-blue px-5 py-3 text-center text-sm font-semibold text-white hover:bg-brand-navy">
                {primaryLabel}
              </Link>
              {secondaryHref && secondaryLabel ? (
                <Link href={secondaryHref} className="rounded-md border border-brand-line px-5 py-3 text-center text-sm font-semibold text-brand-navy hover:border-brand-blue">
                  {secondaryLabel}
                </Link>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
