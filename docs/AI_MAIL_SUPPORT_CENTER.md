# AULEXMED AI Mail Support Center

This document records the first backend build of the internal AULEXMED AI Mail Support Center.

## Scope

- Public website pages are unchanged.
- Email cases are stored in Supabase.
- AULEXMED `support_knowledge_base` remains the first support knowledge source.
- DeepSeek analyzes inbound email only after knowledge retrieval.
- Feishu receives internal notifications for new cases and sent replies.
- Resend sends human-reviewed replies.

## Supabase Tables

Existing knowledge and chat tables:

- `support_knowledge_base`: primary support knowledge source.
- `chat_sessions`: website chatbot sessions.
- `chat_messages`: website chatbot messages.
- `support_voicemails`: earlier voice support MVP table.

New email support tables:

- `support_email_cases`: one row per email case.
- `support_email_messages`: inbound and outbound thread messages.
- `support_email_events`: audit events for ingest, AI analysis, notifications, status changes, and replies.

Migration file:

- `supabase/migrations/20260706090000_create_support_email_center.sql`

## Email Ingest API

Endpoint:

- `POST /api/support/email-ingest`

Authentication:

- Header `Authorization: Bearer <SUPPORT_INGEST_SECRET>`
- or header `x-support-ingest-secret: <SUPPORT_INGEST_SECRET>`

Expected JSON:

```json
{
  "source_email": "support@aulexmed.com",
  "from_email": "customer@example.com",
  "from_name": "Customer Name",
  "subject": "Question about my walking boot",
  "body": "Email body text",
  "received_at": "2026-07-06T10:00:00.000Z",
  "attachments": []
}
```

Processing flow:

```text
Inbound email
-> create support_email_cases row
-> create inbound support_email_messages row
-> retrieve support_knowledge_base matches
-> DeepSeek analysis
-> update support_email_cases with classification, summary, recommendation, and reply draft
-> Feishu notification
```

## Internal UI

Route:

- `/support-center`

Access:

- `SUPPORT_CENTER_PASSWORD` for browser access.
- `SUPPORT_ADMIN_TOKEN` for API access.

The page is not linked from public navigation and is set to `noindex`.

## Environment Variables

Required for production:

```text
DEEPSEEK_API_KEY=
DEEPSEEK_MODEL=deepseek-v4-pro
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
RESEND_API_KEY=
FEISHU_WEBHOOK_URL=
SUPPORT_INGEST_SECRET=
SUPPORT_CENTER_PASSWORD=
SUPPORT_ADMIN_TOKEN=
SUPPORT_EMAIL=support@aulexmed.com
BUSINESS_EMAIL=business@aulexmed.com
MAIL_FROM_SUPPORT=AULEXMED Support <support@aulexmed.com>
MAIL_FROM_BUSINESS=AULEXMED Business <business@aulexmed.com>
```

## Safety Rules

- DeepSeek must not answer from general knowledge alone when AULEXMED knowledge exists.
- If no knowledge match is found, the system should ask for minimum missing information and route to human support when appropriate.
- Avoid medical treatment claims and promises.
- Do not promise refunds, replacements, warranty approval, or platform outcomes before human review.

## Manual Test

1. Send a test JSON request to `/api/support/email-ingest` with `SUPPORT_INGEST_SECRET`.
2. Confirm a row appears in `support_email_cases`.
3. Confirm `support_email_messages` contains the inbound message.
4. Confirm `support_email_events` contains ingest, AI, and Feishu events.
5. Open `/support-center`.
6. Review the draft, edit if needed, and send a reply.
7. Confirm Resend delivery and `status = replied`.
