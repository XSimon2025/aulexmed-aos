export type FAQItem = {
  question: string;
  answer: string;
};

export function FAQSection({ faqs }: { faqs: FAQItem[] }) {
  return (
    <div className="grid gap-3">
      {faqs.map((faq) => (
        <details key={faq.question} className="rounded-lg border border-brand-line bg-white p-4">
          <summary className="cursor-pointer font-semibold text-brand-navy">{faq.question}</summary>
          <p className="mt-3 text-sm leading-6 text-slate-600">{faq.answer}</p>
        </details>
      ))}
    </div>
  );
}
