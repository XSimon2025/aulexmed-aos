import {
  autoReplyTemplate,
  b2bInquiryTemplate,
  chatbotEscalationTemplate,
  generalContactTemplate,
  quoteRequestTemplate,
  renderAulexmedEmail,
  supportRequestTemplate,
  type EmailField
} from "@/lib/emailTemplates";

type EmailAddressKey =
  | "support"
  | "sales"
  | "business"
  | "b2b"
  | "info"
  | "noreply";

type ResendSendInput = {
  to: string | string[];
  subject: string;
  html: string;
  replyTo?: string;
  from?: string;
};

export type EmailSendResult =
  | {
      ok: true;
      id?: string;
    }
  | {
      ok: false;
      skipped?: boolean;
      error: string;
    };

export type InquiryEmailInput = {
  name?: string;
  email?: string;
  phone?: string;
  company?: string;
  country?: string;
  product?: string;
  sku?: string;
  quantity?: string | number;
  channel?: string;
  source?: string;
  pageUrl?: string;
  message?: string;
};

export type AutoReplyInput = {
  to: string;
  name?: string;
  subject?: string;
  message?: string;
};

export type ChatbotEscalationInput = {
  sessionId?: string;
  userMessage?: string;
  assistantAnswer?: string;
  pageUrl?: string;
  language?: string;
  intent?: string;
  category?: string;
  country?: string;
};

function getEnv(name: string, fallback?: string) {
  return process.env[name] || fallback || "";
}

function getEmailAddress(key: EmailAddressKey) {
  const defaults: Record<EmailAddressKey, string> = {
    support: "support@aulexmed.com",
    sales: "sales@aulexmed.com",
    business: "business@aulexmed.com",
    b2b: "b2b@aulexmed.com",
    info: "info@aulexmed.com",
    noreply: "noreply@aulexmed.com"
  };

  const envKeys: Record<EmailAddressKey, string> = {
    support: "SUPPORT_EMAIL",
    sales: "SALES_EMAIL",
    business: "BUSINESS_EMAIL",
    b2b: "B2B_EMAIL",
    info: "INFO_EMAIL",
    noreply: "NOREPLY_EMAIL"
  };

  return getEnv(envKeys[key], defaults[key]);
}

function getMailFrom() {
  return getEnv("MAIL_FROM", "AULEXMED <noreply@aulexmed.com>");
}

function getSupportMailFrom() {
  return getEnv("MAIL_FROM_SUPPORT", `AULEXMED Support <${getEmailAddress("support")}>`);
}

function getBusinessMailFrom() {
  return getEnv("MAIL_FROM_BUSINESS", `AULEXMED Business <${getEmailAddress("business")}>`);
}

function getResendApiKey() {
  return process.env.RESEND_API_KEY || "";
}

function normalizeFields(input: InquiryEmailInput): EmailField[] {
  return [
    { label: "Name", value: input.name },
    { label: "Email", value: input.email },
    { label: "Phone", value: input.phone },
    { label: "Company", value: input.company },
    { label: "Country / Region", value: input.country },
    { label: "Product", value: input.product },
    { label: "SKU", value: input.sku },
    { label: "Quantity", value: input.quantity },
    { label: "Sales Channel", value: input.channel },
    { label: "Source", value: input.source },
    { label: "Page URL", value: input.pageUrl }
  ];
}

async function sendViaResend({ to, subject, html, replyTo, from }: ResendSendInput): Promise<EmailSendResult> {
  const apiKey = getResendApiKey();

  if (!apiKey) {
    console.error("AULEXMED email send skipped: RESEND_API_KEY is not configured.");
    return {
      ok: false,
      skipped: true,
      error: "RESEND_API_KEY is not configured."
    };
  }

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        from: from || getMailFrom(),
        to,
        subject,
        html,
        reply_to: replyTo
      })
    });

    const data = (await response.json().catch(() => null)) as { id?: string; message?: string } | null;

    if (!response.ok) {
      console.error("AULEXMED Resend request failed", {
        status: response.status,
        message: data?.message || "Unknown Resend error"
      });
      return {
        ok: false,
        error: data?.message || `Resend request failed with status ${response.status}.`
      };
    }

    return {
      ok: true,
      id: data?.id
    };
  } catch (error) {
    console.error("AULEXMED Resend request failed", error);
    return {
      ok: false,
      error: "Resend request failed."
    };
  }
}

export async function sendSupportEmail(input: InquiryEmailInput) {
  return sendViaResend({
    to: getEmailAddress("support"),
    subject: "AULEXMED Support Request",
    html: supportRequestTemplate(normalizeFields(input), input.message),
    replyTo: input.email
  });
}

export async function sendBusinessInquiryEmail(input: InquiryEmailInput) {
  return sendViaResend({
    to: getEmailAddress("business"),
    subject: "AULEXMED Business Inquiry",
    html: generalContactTemplate(normalizeFields(input), input.message),
    replyTo: input.email
  });
}

export async function sendB2BInquiryEmail(input: InquiryEmailInput) {
  return sendViaResend({
    to: getEmailAddress("b2b"),
    subject: "AULEXMED B2B Inquiry",
    html: b2bInquiryTemplate(normalizeFields(input), input.message),
    replyTo: input.email
  });
}

export async function sendQuoteEmail(input: InquiryEmailInput) {
  return sendViaResend({
    to: getEmailAddress("sales"),
    subject: "AULEXMED Quote Request",
    html: quoteRequestTemplate(normalizeFields(input), input.message),
    replyTo: input.email
  });
}

export async function sendAutoReplyEmail(input: AutoReplyInput) {
  return sendViaResend({
    to: input.to,
    subject: input.subject || "AULEXMED received your message",
    html: autoReplyTemplate(
      [
        { label: "Name", value: input.name },
        { label: "Email", value: input.to }
      ],
      input.message || "Your message has been received. The AULEXMED team will review it and respond when appropriate."
    )
  });
}

export async function sendChatbotEscalationEmail(input: ChatbotEscalationInput) {
  return sendViaResend({
    to: getEmailAddress("support"),
    subject: "AULEXMED Chatbot Escalation",
    html: chatbotEscalationTemplate(
      [
        { label: "Session ID", value: input.sessionId },
        { label: "Language", value: input.language },
        { label: "Intent", value: input.intent },
        { label: "Support Category", value: input.category },
        { label: "Country / Region", value: input.country },
        { label: "Page URL", value: input.pageUrl }
      ],
      [`User message:\n${input.userMessage || "Not provided"}`, `Assistant answer:\n${input.assistantAnswer || "Not provided"}`].join("\n\n")
    )
  });
}

export async function sendSupportCaseReplyEmail(input: {
  to: string;
  subject: string;
  body: string;
  channel?: "support" | "business";
  replyTo?: string;
}) {
  const from = input.channel === "business" ? getBusinessMailFrom() : getSupportMailFrom();

  return sendViaResend({
    from,
    to: input.to,
    subject: input.subject,
    replyTo: input.replyTo,
    html: renderAulexmedEmail({
      preview: "AULEXMED support reply.",
      eyebrow: input.channel === "business" ? "Business Support" : "Customer Support",
      title: "AULEXMED Response",
      intro: "AULEXMED has reviewed your message and is responding through the appropriate support channel.",
      fields: [
        { label: "To", value: input.to },
        { label: "Channel", value: input.channel === "business" ? "Business" : "Support" }
      ],
      message: input.body,
      footerNote: "This message is from the official AULEXMED support system. For medical advice, please consult a healthcare professional."
    })
  });
}
