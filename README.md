# AULEXMED Brand Website

Official AULEXMED brand website built with Next.js App Router, TypeScript, and Tailwind CSS.

## Current Scope

- Brand homepage
- Product category pages
- Product detail templates with marketplace and inquiry links
- Support center
- B2B inquiry page
- Guides / blog template
- Static product, category, guide, and manual data
- SEO metadata, robots, and sitemap

## Master Target

The long-term project direction is documented in `AULEXMED_MASTER_TARGET.md` at the project root.

Current email note: Google Workspace is a possible future business email direction, but the final email provider decision is postponed and should not block Version 1.1 work.

## Local Development

Install dependencies:

```bash
npm install
```

Start the local site:

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

Build for production:

```bash
npm run build
```

## Deployment

The project is ready for Vercel import from GitHub.

Recommended Vercel settings:

- Framework: Next.js
- Install command: `npm install`
- Build command: `npm run build`
- Output directory: leave empty

## Data Files

- `data/products.ts`: product catalog, purchase links, size guide placeholders, FAQ content
- `data/categories.ts`: product category navigation and category page data
- `data/guides.ts`: guide/blog content
- `data/manuals.ts`: manual and support-download placeholders

## Asset Rules

Deployable images should live in `public/`.

Local reference assets such as raw product folders and product catalogs should stay on the computer, but should not be committed to Git unless they are needed by the live website. The current `.gitignore` excludes `产品分类/` and `产品画册.pdf` for this reason.

## Commerce Rules

This version does not include checkout.

Product pages route customers to:

- Temu shop link for US purchase flow
- Amazon and TikTok search links
- International inquiry email
- B2B quote request

Future commerce options can include Stripe Payment Links, Shopify Buy Button, or a full checkout system.
