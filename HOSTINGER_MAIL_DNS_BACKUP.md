# Hostinger Mail DNS Backup

Backup created: 2026-07-06

These records were present in Cloudflare before switching `aulexmed.com` receiving mail to Cloudflare Email Routing.

## Old Hostinger Mail Records

| Type | Name | Content | Priority | Proxied | TTL |
| --- | --- | --- | --- | --- | --- |
| CNAME | `autoconfig.aulexmed.com` | `autoconfig.mail.hostinger.com` |  | `true` | `1` |
| CNAME | `autodiscover.aulexmed.com` | `autodiscover.mail.hostinger.com` |  | `true` | `1` |
| CNAME | `hostingermail-a._domainkey.aulexmed.com` | `hostingermail-a.dkim.mail.hostinger.com` |  | `true` | `1` |
| CNAME | `hostingermail-b._domainkey.aulexmed.com` | `hostingermail-b.dkim.mail.hostinger.com` |  | `true` | `1` |
| CNAME | `hostingermail-c._domainkey.aulexmed.com` | `hostingermail-c.dkim.mail.hostinger.com` |  | `true` | `1` |
| MX | `aulexmed.com` | `mx1.hostinger.com` | `5` | `false` | `1` |
| MX | `aulexmed.com` | `mx2.hostinger.com` | `10` | `false` | `1` |
| TXT | `aulexmed.com` | `"v=spf1 include:_spf.mail.hostinger.com ~all"` |  | `false` | `1` |

## Notes

- These records were mail-related only.
- Website records for `aulexmed.com` and `www.aulexmed.com` were not part of this backup and should not be changed for email routing.
- Cloudflare Email Routing uses Cloudflare MX, SPF, and DKIM records instead.
