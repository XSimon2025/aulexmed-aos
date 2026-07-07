# AULEXMED Mail Setup

Last updated: 2026-07-06

## Current Architecture

- Cloudflare Email Routing receives mail for `aulexmed.com`.
- All configured AULEXMED receiving addresses forward to `invosen.achao@gmail.com`.
- Resend sends website, AI assistant, support, and system transactional email.
- The internal AI Mail Support Center can send human-reviewed replies through Resend.
- Human replies can be handled later through Gmail "Send mail as" / SMTP configuration.

## Cloudflare Status

- Cloudflare zone: `aulexmed.com`
- Zone status after nameserver cutover: active
- Cloudflare Email Routing status after final fix: enabled
- Destination address added: `invosen.achao@gmail.com`
- Destination verification status: `verified`
- Routing addresses status: created and enabled in Cloudflare
- Old Hostinger mail DNS records: removed from Cloudflare DNS after backup
- Cloudflare Email Routing DNS records: enabled and locked in Cloudflare Email Routing
- External test observed in Cloudflare activity log: `business@aulexmed.com` forwarded successfully

## Receiving Addresses

Configured Cloudflare Email Routing addresses:

- `support@aulexmed.com` -> `invosen.achao@gmail.com`
- `sales@aulexmed.com` -> `invosen.achao@gmail.com`
- `info@aulexmed.com` -> `invosen.achao@gmail.com`
- `hello@aulexmed.com` -> `invosen.achao@gmail.com`
- `service@aulexmed.com` -> `invosen.achao@gmail.com`
- `b2b@aulexmed.com` -> `invosen.achao@gmail.com`
- `business@aulexmed.com` -> `invosen.achao@gmail.com`
- `noreply@aulexmed.com` -> `invosen.achao@gmail.com`

## DNS Notes

Do not modify existing website DNS records for:

- `aulexmed.com`
- `www.aulexmed.com`
- Vercel-related website records, if present later

During setup, old Hostinger mail-related DNS records were found and removed after backup:

- `MX aulexmed.com -> mx1.hostinger.com`
- `MX aulexmed.com -> mx2.hostinger.com`
- `TXT aulexmed.com -> v=spf1 include:_spf.mail.hostinger.com ~all`
- `CNAME autoconfig.aulexmed.com -> autoconfig.mail.hostinger.com`
- `CNAME autodiscover.aulexmed.com -> autodiscover.mail.hostinger.com`
- `CNAME hostingermail-a._domainkey.aulexmed.com -> hostingermail-a.dkim.mail.hostinger.com`
- `CNAME hostingermail-b._domainkey.aulexmed.com -> hostingermail-b.dkim.mail.hostinger.com`
- `CNAME hostingermail-c._domainkey.aulexmed.com -> hostingermail-c.dkim.mail.hostinger.com`

The removed records are backed up in `HOSTINGER_MAIL_DNS_BACKUP.md`.

Configured Cloudflare Email Routing DNS records:

- `MX aulexmed.com -> route1.mx.cloudflare.net`
- `MX aulexmed.com -> route2.mx.cloudflare.net`
- `MX aulexmed.com -> route3.mx.cloudflare.net`
- `TXT aulexmed.com -> v=spf1 include:_spf.mx.cloudflare.net ~all`
- `TXT cf2024-1._domainkey.aulexmed.com -> Cloudflare DKIM value`

## Future Sending Architecture

Resend is the planned official sending provider for website and system transactional email.

Required Vercel environment variables:

```env
RESEND_API_KEY=
MAIL_FROM=AULEXMED <noreply@aulexmed.com>
MAIL_FROM_SUPPORT=AULEXMED Support <support@aulexmed.com>
MAIL_FROM_BUSINESS=AULEXMED Business <business@aulexmed.com>
SUPPORT_EMAIL=support@aulexmed.com
SALES_EMAIL=sales@aulexmed.com
INFO_EMAIL=info@aulexmed.com
B2B_EMAIL=b2b@aulexmed.com
BUSINESS_EMAIL=business@aulexmed.com
NOREPLY_EMAIL=noreply@aulexmed.com
```

Do not store the real `RESEND_API_KEY` in this repository. Configure it only in Vercel Project Settings and local `.env.local` when needed.

## Resend Sending Integration

Code location:

- `lib/email.ts`: centralized server-side sending utility using the Resend API.
- `lib/emailTemplates.ts`: AULEXMED-branded transactional HTML templates.
- `app/api/support/cases/[id]/reply/route.ts`: internal support-center reply sending endpoint.

Prepared reusable functions:

- `sendSupportEmail()`
- `sendBusinessInquiryEmail()`
- `sendB2BInquiryEmail()`
- `sendQuoteEmail()`
- `sendAutoReplyEmail()`
- `sendChatbotEscalationEmail()`
- `sendSupportCaseReplyEmail()`

Prepared templates:

- Support request
- B2B inquiry
- Quote request
- General contact
- Chatbot escalation
- Auto reply

Behavior:

- If `RESEND_API_KEY` is missing, sending fails gracefully and logs a server-side message.
- The API key is never exposed to browser code.
- No marketing, newsletter, or mass-email logic is included.
- Resend domain DNS records have been added in Cloudflare and verified in Resend.
- Support-center replies use `MAIL_FROM_SUPPORT` for consumer support and `MAIL_FROM_BUSINESS` for B2B/business cases.

Configured Resend DNS records:

- `TXT resend._domainkey.aulexmed.com -> Resend DKIM value`
- `MX send.aulexmed.com -> feedback-smtp.us-east-1.amazonses.com`, priority `10`
- `TXT send.aulexmed.com -> v=spf1 include:amazonses.com ~all`

The root domain SPF remains reserved for Cloudflare Email Routing and was not modified.

## How to Test Resend

1. Confirm the domain remains verified in Resend.
2. Confirm the required environment variables are present in Vercel Production and Preview.
3. Deploy the website after environment variable changes.
4. Trigger a server-side transactional email function from a form or API route.
5. Confirm the email appears in the Resend dashboard and arrives at the target inbox.
6. Confirm DKIM and SPF pass in the recipient inbox message details.

## Future Gmail Send As Setup

For human replies from Gmail:

1. In Gmail, open Settings -> Accounts and Import -> Send mail as.
2. Add the desired address, for example `support@aulexmed.com`.
3. Use a verified SMTP provider when available.
4. Keep Cloudflare Email Routing as the receiving layer.

## Next Steps

1. Connect the prepared email functions to forms/API routes when those workflows are ready.
2. Complete a live inbox delivery test from a network environment that can resolve `api.resend.com`.
3. Configure Gmail "Send mail as" for human replies when needed.
