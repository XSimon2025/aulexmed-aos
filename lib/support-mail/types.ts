export type SupportEmailStatus = "new" | "pending" | "replied" | "resolved" | "ignored";
export type SupportEmailUrgency = "low" | "medium" | "high";
export type SupportEmailDirection = "inbound" | "outbound" | "internal";

export type SupportEmailCase = {
  id: string;
  source_email: string;
  from_email: string;
  from_name: string | null;
  subject: string;
  raw_body: string;
  clean_body: string;
  attachments: Array<Record<string, unknown>>;
  language: string | null;
  detected_country: string | null;
  platform: string | null;
  product_model: string | null;
  product_category: string | null;
  issue_type: string | null;
  summary: string | null;
  summary_en: string | null;
  urgency: SupportEmailUrgency;
  ai_recommendation: string | null;
  ai_reply_draft: string | null;
  status: SupportEmailStatus;
  assigned_to: string | null;
  received_at: string | null;
  created_at: string;
  updated_at: string;
};

export type SupportEmailMessage = {
  id: string;
  case_id: string;
  direction: SupportEmailDirection;
  from_email: string | null;
  to_email: string | null;
  subject: string | null;
  body: string;
  sent_by: string | null;
  resend_message_id: string | null;
  created_at: string;
};

export type SupportEmailEvent = {
  id: string;
  case_id: string | null;
  event_type: string;
  event_payload: Record<string, unknown>;
  created_at: string;
};

export type SupportEmailAnalysis = {
  language: string;
  detected_country: string | null;
  platform: string | null;
  product_model: string | null;
  product_category: string | null;
  issue_type: string | null;
  urgency: SupportEmailUrgency;
  summary: string;
  summary_en: string;
  ai_recommendation: string;
  ai_reply_draft: string;
};

export type SupportEmailIngestInput = {
  source_email?: string;
  from_email?: string;
  from?: string;
  from_name?: string;
  subject?: string;
  raw_body?: string;
  body?: string;
  text?: string;
  html?: string;
  received_at?: string;
  attachments?: Array<Record<string, unknown>>;
};
