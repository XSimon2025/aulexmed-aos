import type { SupportEmailCase } from "@/lib/support-mail/types";

type FeishuNotifyInput = {
  title: string;
  event: string;
  emailCase: SupportEmailCase;
  extra?: Record<string, string | number | null | undefined>;
};

function getCaseUrl(caseId: string) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL || "https://www.aulexmed.com";
  return `${baseUrl.replace(/\/$/, "")}/support-center?case=${encodeURIComponent(caseId)}`;
}

function formatLine(label: string, value?: string | number | null) {
  return `${label}: ${value || "Not provided"}`;
}

export async function sendFeishuSupportNotification({ title, event, emailCase, extra = {} }: FeishuNotifyInput) {
  const webhookUrl = process.env.FEISHU_WEBHOOK_URL;

  if (!webhookUrl) {
    console.error("AULEXMED Feishu notification skipped: FEISHU_WEBHOOK_URL is not configured.");
    return { ok: false, skipped: true, error: "FEISHU_WEBHOOK_URL is not configured." };
  }

  const lines = [
    `AULEXMED Support Center - ${title}`,
    "",
    formatLine("Event", event),
    formatLine("From", emailCase.from_email),
    formatLine("Source mailbox", emailCase.source_email),
    formatLine("Subject", emailCase.subject),
    formatLine("Platform", emailCase.platform),
    formatLine("Product model", emailCase.product_model),
    formatLine("Issue type", emailCase.issue_type),
    formatLine("Urgency", emailCase.urgency),
    formatLine("Status", emailCase.status),
    "",
    "Chinese summary:",
    emailCase.summary || "Not available",
    "",
    "Recommended action:",
    emailCase.ai_recommendation || "Not available",
    "",
    "Draft preview:",
    (emailCase.ai_reply_draft || "Not available").slice(0, 600),
    "",
    `Case link: ${getCaseUrl(emailCase.id)}`
  ];

  for (const [key, value] of Object.entries(extra)) {
    lines.push(formatLine(key, value));
  }

  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        msg_type: "text",
        content: {
          text: lines.join("\n")
        }
      })
    });

    if (!response.ok) {
      return {
        ok: false,
        error: `Feishu webhook failed with status ${response.status}.`
      };
    }

    return { ok: true };
  } catch (error) {
    console.error("AULEXMED Feishu notification failed", error);
    return {
      ok: false,
      error: "Feishu webhook request failed."
    };
  }
}
