AULEXMED Digital Platform - Master Target

Current project note:

Google Workspace is listed as the likely future business email direction, but the final email provider decision is postponed for now. Email system implementation should not block Version 1.1 homepage, infrastructure, product, support, SEO, or B2B work.

1. Project Goal

This project is not only an official website.

The long-term goal is to build the digital infrastructure of the AULEXMED brand for the next 3–5 years.

The platform should gradually become the central hub for:

* Brand credibility
* Product presentation
* Customer support
* SEO growth
* B2B inquiries
* Email automation
* Warranty registration
* Future independent checkout
* Future customer portal
* Future AI-assisted operations

The website should evolve continuously instead of being rebuilt from scratch.

Do not treat this as a one-time website project.

⸻

2. Current Business Context

AULEXMED is not starting from zero.

Current traffic and customer sources include:

* TikTok Shop
* Temu
* Amazon
* Existing overseas customers
* Product manuals
* Review cards
* Package inserts
* QR codes
* Brand search traffic
* Future SEO traffic
* Future B2B leads

The business currently has daily overseas sales volume and historical customer accumulation.

Therefore, the platform should serve both:

1. New visitors
2. Existing customers

⸻

3. Core Positioning

AULEXMED should be positioned as a professional orthopedic support brand.

Main slogan:

AULEXMED — Knee & Ankle Orthopedic Experts.

The website should feel:

* Professional
* Trustworthy
* Clean
* Medical-rehabilitation inspired
* International
* Suitable for both B2C customers and B2B buyers

Avoid looking like a cheap dropshipping store.

⸻

4. Core Technology Stack

Source Code

GitHub

Purpose:

* Source of truth
* Version control
* Collaboration
* Automatic deployment trigger

GitHub should be the only code repository.

⸻

Website Deployment

Vercel

Purpose:

* Next.js hosting
* Global CDN
* Automatic deployment
* Preview deployments

Deployment workflow:

Local Development

↓

GitHub Push

↓

Vercel Build

↓

Production

Never deploy manually.

Do not upload website files by FTP.

⸻

DNS

Cloudflare

Purpose:

* DNS management
* CDN
* SSL
* Security
* Future caching

Cloudflare should become the only DNS provider.

Do not continue using Hostinger DNS.

⸻

Domain Registrar

Alibaba Cloud

Purpose:

Only domain ownership and renewal.

Alibaba Cloud should not be used for:

* DNS management
* Hosting
* Website deployment
* Email hosting

⸻

Email

Future provider:

Google Workspace

Purpose:

Professional business email.

Planned email accounts:

* hello@aulexmed.com
* support@aulexmed.com
* sales@aulexmed.com
* b2b@aulexmed.com
* warranty@aulexmed.com

Use cases:

* Customer support
* B2B inquiries
* Sales communication
* Warranty communication
* Team collaboration

⸻

Email Automation

Future provider:

Resend

Purpose:

Transactional and automated email.

Use cases:

* Contact form confirmation
* B2B inquiry notification
* Warranty registration confirmation
* Manual download email
* Support follow-up
* Review request
* Newsletter
* Product education sequence

Do not use raw SMTP directly inside the application unless absolutely necessary.

⸻

Database

Future provider:

Supabase

Purpose:

* Warranty registration
* Customer information
* B2B leads
* Support requests
* Manual download history
* Future customer portal

Do not introduce Supabase until the business requirement is clear.

⸻

Payment

Future provider:

Stripe

Purpose:

* Independent checkout
* European customers
* Direct payment
* B2B invoice payment
* Future subscription or service payments if needed

Current phase should not build full checkout yet.

Current purchase flow should use:

* Buy on TikTok
* Buy on Amazon
* Buy on Temu
* Request a Quote
* Contact Sales

⸻

5. Platform Systems

The platform should gradually support six core systems.

1. Brand System

Purpose:

Build trust.

Target users:

* Customers
* Creators
* Distributors
* Clinics
* Hospitals
* Platforms
* B2B buyers

Pages / sections:

* Home
* About AULEXMED
* Why Choose AULEXMED
* Factory Capability
* Certificates
* Contact

⸻

2. Product System

Purpose:

Present products professionally and clearly.

Product categories:

* Knee Braces
* Ankle Braces
* Walking Boots
* Back & Posture Support
* Wrist & Finger Support

Each product page should include:

* Product images
* Product overview
* Key features
* Specifications
* Size guide
* How to wear
* FAQ
* Manual download
* Purchase links
* Request quote button

Every product page should be SEO optimized.

⸻

3. Customer Support System

Purpose:

Reduce customer service pressure and improve user experience.

Many users will visit from QR codes inside product packaging, review cards, and manuals.

Pages / sections:

* Support Center
* User Manuals
* Video Tutorials
* How to Wear
* Size Guide
* FAQ
* Warranty
* Replacement / Missing Parts
* Contact Support

Support content should be clearer and more useful than paper manuals.

⸻

4. Knowledge & SEO System

Purpose:

Build long-term organic traffic from Google.

Content types:

* Buying Guides
* Size Guides
* Comparison Articles
* How-to Articles
* Use & Care Articles
* Product Education Articles

Example topics:

* How to Choose a Walking Boot
* Walking Boot Size Guide
* How to Wear a ROM Knee Brace
* Ankle Brace vs Ankle Sleeve
* Posture Corrector Size Guide
* How to Choose the Right Knee Brace

Do not publish low-quality SEO articles.

Every article should genuinely help users.

⸻

5. B2B System

Purpose:

Attract distributors, wholesale buyers, clinics, local businesses, and overseas partners.

Pages / sections:

* Wholesale
* OEM / ODM
* Distributor Program
* Factory Capability
* Certificates
* Catalog Download
* Request Quotation

The B2B section should look professional enough for international buyers.

⸻

6. Commerce System

Purpose:

Support future independent sales.

Current phase:

Do not build full checkout yet.

Use external purchase links:

* TikTok Shop
* Amazon
* Temu

Also provide:

* Request a Quote
* Contact Sales

Future phases:

* Stripe Payment Links
* Stripe Checkout
* Shopify Buy Button
* Independent checkout
* Customer accounts
* Order tracking

⸻

6. Multilingual Requirement

The current website has not yet implemented multilingual support.

This is a known gap.

Future versions should support international expansion.

Priority languages:

1. English
2. Spanish
3. German
4. French
5. Italian

Possible future structure:

* /en
* /es
* /de
* /fr
* /it

Do not implement multilingual support immediately unless requested.

However, every new feature should be designed with future internationalization in mind.

Avoid hardcoding too much text into components.

Keep content structured so translation can be added later.

⸻

7. Design Direction

The current design is acceptable for Version 1.0, but the overall design quality still needs improvement.

This is a known gap.

Design should be improved gradually through future versions.

The future visual direction should be:

* More premium
* More professional
* More medical-rehabilitation inspired
* Cleaner layout
* Better spacing
* Stronger typography
* Better mobile experience
* Better product image hierarchy
* Better trust-building sections
* Better B2B presentation

Do not redesign everything at once.

Improve design in staged versions.

⸻

8. Design Reference Library

Do not copy any website directly.

Analyze the following websites and extract useful patterns.

Orthopedic / Brace Category References

BraceAbility

Use for:

* Product category structure
* Product detail layout
* Buying guide structure
* FAQ placement
* Support content
* SEO article structure

Do not copy the visual design directly.

DonJoy / Enovis

Use for:

* Professional medical brand tone
* Product presentation
* Trust-building language

Össur

Use for:

* Premium medical brand feeling
* Clean spacing
* Brand confidence
* B2B and professional credibility

Ottobock

Use for:

* International medical brand positioning
* Factory / capability / professional trust
* B2B presentation

⸻

Modern Design References

Apple

Use for:

* Hero layout
* Premium spacing
* Product-focused storytelling
* Clean visual rhythm

Stripe

Use for:

* Information hierarchy
* Grid layout
* CTA structure
* Modern layout system

Vercel

Use for:

* Minimal interface
* Developer-level polish
* Clean interaction
* Performance-focused feel

Linear

Use for:

* Subtle motion
* Modern UI details
* Smooth hover states
* Premium SaaS-like interaction

⸻

SEO / Content References

Healthline

Use for:

* Article structure
* Table of contents
* FAQ
* Internal linking
* Readability

Verywell Health

Use for:

* Educational tone
* Helpful content structure
* Medical-adjacent trust

⸻

9. User Interaction Principles

Think in user journeys, not only pages.

Important user journeys:

TikTok / Temu / Amazon Customer

Purchase product

↓

Receive package

↓

Scan QR code

↓

Visit support/manual page

↓

Register warranty

↓

Receive email follow-up

↓

Leave review or repurchase

⸻

Google SEO Visitor

Search problem or product guide

↓

Read article

↓

View product page

↓

Buy on platform or contact sales

⸻

B2B Buyer

Search brand or product category

↓

Visit factory / certificates / B2B page

↓

Download catalog

↓

Submit quote request

↓

Receive email follow-up

↓

Sales communication

⸻

Existing Customer

Visit support center

↓

Find manual / size guide / FAQ

↓

Contact support if needed

↓

Receive automated email

⸻

10. Compliance Writing Rules

Avoid exaggerated medical claims.

Avoid words like:

* cure
* treat
* heal
* guaranteed recovery
* doctor recommended
* medical treatment
* pain relief

Use safer wording:

* daily support
* comfortable fit
* adjustable design
* stable feel
* breathable materials
* easy to wear
* support for everyday movement
* designed for daily use

The website should feel professional, but should avoid risky medical claims.

⸻

11. DNS Philosophy

The DNS structure should become clean and easy to maintain.

Current target:

Domain registrar:

Alibaba Cloud

DNS:

Cloudflare

Website:

Vercel

Email:

Google Workspace

Automation email:

Resend

Future verification records:

Google Search Console

Analytics

Resend

Stripe

Only keep records that are actually required.

Remove unnecessary Hostinger DNS records after migration is complete.

⸻

12. Hosting Philosophy

Do not use traditional shared hosting for the official website.

Do not deploy manually.

Do not upload files through FTP.

Do not rely on Hostinger for the new website.

Everything should follow:

Local

↓

GitHub

↓

Vercel

↓

Production

⸻

13. Development Rules

Always prefer maintainability.

Never introduce unnecessary dependencies.

Keep component structure clean.

Avoid duplicated code.

Prefer SEO-friendly rendering when beneficial.

Every page should be mobile-first.

Every product page should be SEO optimized.

Every new feature should consider future internationalization.

Always explain major architectural changes before implementation.

If a feature should be postponed, explain why.

Think like the long-term CTO of AULEXMED.

⸻

14. Version Roadmap

Version 1.0 - Current Foundation

Status:

Mostly completed.

Includes:

* Brand website
* Product pages
* Responsive design
* GitHub
* Vercel deployment
* Basic page structure

Known gaps:

* No multilingual support yet
* Design quality needs future improvement
* Email system not yet connected
* Support center not fully developed
* SEO content system not fully developed
* B2B system needs strengthening

⸻

Version 1.1 - Infrastructure Cleanup

Goals:

* Move DNS to Cloudflare
* Connect custom domain
* Remove Hostinger dependency
* Set up clean DNS structure
* Connect Google Search Console
* Connect Google Analytics
* Confirm Vercel production deployment

⸻

Version 1.2 - Email Foundation

Goals:

* Set up Google Workspace
* Create professional emails
* Configure MX / SPF / DKIM / DMARC
* Prepare support@, hello@, sales@, b2b@
* Plan Resend integration

⸻

Version 1.3 - Support Center

Goals:

* User manuals
* How-to-wear pages
* Size guide pages
* FAQ
* Warranty page
* Contact support page
* QR code landing pages

⸻

Version 1.4 - B2B Center

Goals:

* Wholesale page
* Distributor page
* OEM / ODM page
* Factory capability
* Certificates
* Catalog download
* Request quote form

⸻

Version 1.5 - SEO Knowledge Center

Goals:

* Guides
* Blog
* Product comparison
* Size guide articles
* Internal linking structure
* FAQ schema where appropriate

⸻

Version 1.6 - Design Upgrade

Goals:

* Improve hero section
* Improve typography
* Improve spacing
* Improve product cards
* Improve mobile experience
* Improve trust sections
* Improve B2B visual presentation
* Use the design reference library for inspiration

Do not copy any reference website.

Build a unique AULEXMED design system.

⸻

Version 2.0 - Email Automation & Lead System

Goals:

* Resend integration
* Contact form email
* B2B inquiry notification
* Warranty confirmation email
* Manual download email
* Review follow-up email
* Store leads in Supabase if needed

⸻

Version 3.0 - Multilingual Expansion

Goals:

* Spanish
* German
* French
* Italian
* Localized SEO
* Localized product content
* Localized B2B pages

⸻

Version 4.0 - Commerce Expansion

Goals:

* Stripe Payment Links
* Stripe Checkout
* Shopify Buy Button
* Direct purchase flow for countries not covered by TikTok / Temu / Amazon
* B2B invoice payment

⸻

Version 5.0 - Customer / Distributor Portal

Goals:

* Customer login
* Warranty management
* Manual download history
* Distributor login
* B2B quote tracking
* Future AI customer support

⸻

15. Current Instruction for Codex

Do not try to build everything immediately.

The current priority is to stabilize Version 1.0 and complete Version 1.1.

Focus next on:

1. Cloudflare DNS migration
2. Vercel custom domain connection
3. Clean deployment workflow
4. Google Search Console
5. Google Analytics
6. Preparing the project for future email, SEO, B2B, and multilingual expansion

All future development should follow this master target.
