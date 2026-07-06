# AULEXMED Mail Setup

Last updated: 2026-07-06

## Current Architecture

- Cloudflare Email Routing will receive mail for `aulexmed.com`.
- All configured AULEXMED receiving addresses will forward to `invosen.achao@gmail.com`.
- Resend will handle website transactional sending later.

## Cloudflare Status

- Cloudflare zone: `aulexmed.com`
- Zone status observed during setup: `pending`
- Cloudflare Email Routing status observed during setup: `unconfigured / disabled`
- Destination address added: `invosen.achao@gmail.com`
- Destination verification status observed during setup: `unverified`

Cloudflare requires verification of the destination address before routing rules can be created.

Action required:

Please verify the Cloudflare Email Routing confirmation email sent to `invosen.achao@gmail.com`.

## Receiving Addresses

After destination verification, configure these Cloudflare Email Routing addresses:

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

During setup, old Hostinger mail-related DNS records were found and should be treated as email-routing conflicts before Cloudflare Email Routing is activated:

- `MX aulexmed.com -> mx1.hostinger.com`
- `MX aulexmed.com -> mx2.hostinger.com`
- `TXT aulexmed.com -> v=spf1 include:_spf.mail.hostinger.com ~all`
- `CNAME autoconfig.aulexmed.com -> autoconfig.mail.hostinger.com`
- `CNAME autodiscover.aulexmed.com -> autodiscover.mail.hostinger.com`
- `CNAME hostingermail-a._domainkey.aulexmed.com -> hostingermail-a.dkim.mail.hostinger.com`
- `CNAME hostingermail-b._domainkey.aulexmed.com -> hostingermail-b.dkim.mail.hostinger.com`
- `CNAME hostingermail-c._domainkey.aulexmed.com -> hostingermail-c.dkim.mail.hostinger.com`

Cloudflare Email Routing expects Cloudflare MX records and Cloudflare SPF/DKIM TXT records. These should only replace old Hostinger mail records after confirming Hostinger mail is no longer needed.

Observed Cloudflare Email Routing DNS requirements:

- `MX aulexmed.com -> route1.mx.cloudflare.net`
- `MX aulexmed.com -> route2.mx.cloudflare.net`
- `MX aulexmed.com -> route3.mx.cloudflare.net`
- `TXT aulexmed.com -> v=spf1 include:_spf.mx.cloudflare.net ~all`
- `TXT cf2024-1._domainkey.aulexmed.com -> Cloudflare DKIM value`

## Future Sending Architecture

Resend will be used for website transactional emails later.

Future Vercel environment variables:

```env
RESEND_API_KEY=
MAIL_FROM=AULEXMED <noreply@aulexmed.com>
SUPPORT_EMAIL=support@aulexmed.com
SALES_EMAIL=sales@aulexmed.com
INFO_EMAIL=info@aulexmed.com
B2B_EMAIL=b2b@aulexmed.com
BUSINESS_EMAIL=business@aulexmed.com
NOREPLY_EMAIL=noreply@aulexmed.com
```

## Next Steps

1. Verify `invosen.achao@gmail.com` in the Cloudflare confirmation email.
2. Re-check destination status in Cloudflare.
3. Create the eight routing addresses listed above.
4. Resolve old Hostinger mail DNS conflicts only after confirming they are no longer needed.
5. Enable Cloudflare Email Routing DNS records.
6. Confirm website DNS remains unchanged and working.
