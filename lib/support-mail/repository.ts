import { supabaseAdminRequest } from "@/lib/supabaseAdmin";
import type {
  SupportEmailAnalysis,
  SupportEmailCase,
  SupportEmailEvent,
  SupportEmailMessage,
  SupportEmailStatus
} from "@/lib/support-mail/types";

function encodeFilter(value: string) {
  return encodeURIComponent(value);
}

export async function createSupportEmailCase(input: {
  source_email: string;
  from_email: string;
  from_name?: string;
  subject: string;
  raw_body: string;
  clean_body: string;
  attachments?: Array<Record<string, unknown>>;
  received_at?: string | null;
}) {
  const rows = await supabaseAdminRequest<SupportEmailCase[]>("support_email_cases", {
    method: "POST",
    headers: {
      Prefer: "return=representation"
    },
    body: JSON.stringify({
      source_email: input.source_email,
      from_email: input.from_email,
      from_name: input.from_name || null,
      subject: input.subject,
      raw_body: input.raw_body,
      clean_body: input.clean_body,
      attachments: input.attachments ?? [],
      received_at: input.received_at ?? new Date().toISOString()
    })
  });

  return rows[0];
}

export async function updateSupportEmailCaseAnalysis(caseId: string, analysis: SupportEmailAnalysis) {
  const rows = await supabaseAdminRequest<SupportEmailCase[]>(`support_email_cases?id=eq.${encodeFilter(caseId)}`, {
    method: "PATCH",
    headers: {
      Prefer: "return=representation"
    },
    body: JSON.stringify({
      language: analysis.language,
      detected_country: analysis.detected_country,
      platform: analysis.platform,
      product_model: analysis.product_model,
      product_category: analysis.product_category,
      issue_type: analysis.issue_type,
      summary: analysis.summary,
      summary_en: analysis.summary_en,
      urgency: analysis.urgency,
      ai_recommendation: analysis.ai_recommendation,
      ai_reply_draft: analysis.ai_reply_draft
    })
  });

  return rows[0];
}

export async function updateSupportEmailCaseStatus(caseId: string, status: SupportEmailStatus) {
  const rows = await supabaseAdminRequest<SupportEmailCase[]>(`support_email_cases?id=eq.${encodeFilter(caseId)}`, {
    method: "PATCH",
    headers: {
      Prefer: "return=representation"
    },
    body: JSON.stringify({ status })
  });

  return rows[0];
}

export async function getSupportEmailCase(caseId: string) {
  const rows = await supabaseAdminRequest<SupportEmailCase[]>(
    `support_email_cases?id=eq.${encodeFilter(caseId)}&select=*&limit=1`
  );

  return rows[0] ?? null;
}

export async function listSupportEmailCases({
  status,
  limit = 50
}: {
  status?: SupportEmailStatus | "all";
  limit?: number;
} = {}) {
  const params = new URLSearchParams({
    select: "*",
    order: "created_at.desc",
    limit: String(Math.min(Math.max(limit, 1), 100))
  });

  if (status && status !== "all") {
    params.set("status", `eq.${status}`);
  }

  return supabaseAdminRequest<SupportEmailCase[]>(`support_email_cases?${params.toString()}`);
}

export async function createSupportEmailMessage(input: {
  case_id: string;
  direction: "inbound" | "outbound" | "internal";
  from_email?: string | null;
  to_email?: string | null;
  subject?: string | null;
  body: string;
  sent_by?: string | null;
  resend_message_id?: string | null;
}) {
  const rows = await supabaseAdminRequest<SupportEmailMessage[]>("support_email_messages", {
    method: "POST",
    headers: {
      Prefer: "return=representation"
    },
    body: JSON.stringify(input)
  });

  return rows[0];
}

export async function listSupportEmailMessages(caseId: string) {
  return supabaseAdminRequest<SupportEmailMessage[]>(
    `support_email_messages?case_id=eq.${encodeFilter(caseId)}&select=*&order=created_at.asc`
  );
}

export async function createSupportEmailEvent(input: {
  case_id?: string | null;
  event_type: string;
  event_payload?: Record<string, unknown>;
}) {
  const rows = await supabaseAdminRequest<SupportEmailEvent[]>("support_email_events", {
    method: "POST",
    headers: {
      Prefer: "return=representation"
    },
    body: JSON.stringify({
      case_id: input.case_id ?? null,
      event_type: input.event_type,
      event_payload: input.event_payload ?? {}
    })
  });

  return rows[0];
}
