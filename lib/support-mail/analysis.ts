import {
  detectIntent,
  detectLanguage,
  formatKnowledgeForPrompt,
  retrieveSupportKnowledge
} from "@/lib/supportChat";
import type { SupportEmailAnalysis, SupportEmailIngestInput } from "@/lib/support-mail/types";

type DeepSeekResponse = {
  choices?: Array<{
    message?: {
      content?: string;
    };
  }>;
};

type RawAnalysis = Partial<SupportEmailAnalysis>;

const HUMAN_CONTACT = [
  "Human support contacts:",
  "US phone: +1 302 465 5340",
  "CN phone: +86 18405056462",
  "Email: support@aulexmed.com"
].join("\n");

export function cleanEmailBody(value: string) {
  return value
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\r/g, "\n")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/[ \t]{2,}/g, " ")
    .trim()
    .slice(0, 12000);
}

export function normalizeEmailInput(input: SupportEmailIngestInput) {
  const rawBody = input.raw_body || input.body || input.text || input.html || "";
  const cleanBody = cleanEmailBody(rawBody);
  const fromEmail = input.from_email || input.from || "";

  return {
    source_email: input.source_email || "support@aulexmed.com",
    from_email: fromEmail,
    from_name: input.from_name,
    subject: input.subject || "(No subject)",
    raw_body: rawBody,
    clean_body: cleanBody,
    received_at: input.received_at || new Date().toISOString(),
    attachments: input.attachments ?? []
  };
}

function extractJson(content: string) {
  const fenced = content.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const candidate = fenced?.[1] || content;
  const firstBrace = candidate.indexOf("{");
  const lastBrace = candidate.lastIndexOf("}");

  if (firstBrace === -1 || lastBrace === -1 || lastBrace <= firstBrace) {
    return null;
  }

  try {
    return JSON.parse(candidate.slice(firstBrace, lastBrace + 1)) as RawAnalysis;
  } catch {
    return null;
  }
}

function normalizeUrgency(value?: string | null): SupportEmailAnalysis["urgency"] {
  const normalized = value?.toLowerCase();
  if (normalized === "high" || normalized === "medium" || normalized === "low") {
    return normalized;
  }
  return "medium";
}

function fallbackAnalysis(input: { subject: string; clean_body: string }): SupportEmailAnalysis {
  const combined = `${input.subject}\n${input.clean_body}`;
  const language = detectLanguage(combined);
  const intent = detectIntent(combined);
  const isBusiness = intent === "business_inquiry";

  return {
    language,
    detected_country: null,
    platform: null,
    product_model: null,
    product_category: null,
    issue_type: isBusiness ? "business_inquiry" : "general_support",
    urgency: "medium",
    summary: isBusiness
      ? "客户可能在咨询批发、OEM/ODM、经销或报价合作，需要人工确认公司、国家、产品类别和预计数量。"
      : "客户提交了售后邮件，需要人工查看原文并确认产品型号、购买平台、订单号和问题细节。",
    summary_en: isBusiness
      ? "The customer may be asking about wholesale, OEM/ODM, distributor, or quotation cooperation. Human review should confirm company, country, product category, and estimated quantity."
      : "The customer submitted a support email. Human review should confirm product model, purchase platform, order number, and issue details.",
    ai_recommendation: isBusiness
      ? "Route to business support. Ask for company name, country, target product category, estimated quantity, and sales channel."
      : "Route to human support. Ask for product model, purchase platform, order number, and photos or a short video if the issue involves fit, missing parts, or product condition.",
    ai_reply_draft: [
      "Thank you for contacting AULEXMED.",
      "",
      isBusiness
        ? "To help our business team review your request, please share your company name, country, product category, estimated quantity, and target sales channel."
        : "To help us review your request, please share your product model, purchase platform, order number, and a photo or short video if relevant.",
      "",
      HUMAN_CONTACT
    ].join("\n")
  };
}

export async function analyzeSupportEmail(input: {
  subject: string;
  clean_body: string;
  from_email: string;
  source_email: string;
}) {
  const contentForRetrieval = [input.subject, input.clean_body].filter(Boolean).join("\n\n");
  const intent = detectIntent(contentForRetrieval);
  const retrieval = await retrieveSupportKnowledge(contentForRetrieval, intent).catch((error) => {
    console.error("AULEXMED support email knowledge retrieval failed", error);
    return null;
  });
  const knowledgeText = retrieval?.knowledge?.length ? formatKnowledgeForPrompt(retrieval.knowledge) : "";

  const apiKey = process.env.DEEPSEEK_API_KEY;
  const model = process.env.DEEPSEEK_MODEL || "deepseek-v4-pro";

  if (!apiKey) {
    console.error("AULEXMED support email analysis skipped: DEEPSEEK_API_KEY is not configured.");
    return {
      analysis: fallbackAnalysis(input),
      knowledgeCount: retrieval?.knowledge?.length ?? 0,
      source: "fallback" as const
    };
  }

  const systemPrompt = [
    "You are the internal AULEXMED after-sales email triage assistant.",
    "Use the AULEXMED support knowledge below as the first source of truth.",
    "Do not hallucinate product details, policies, warranty outcomes, refund promises, replacement promises, or medical treatment claims.",
    "Avoid words or claims like cure, treat, heal, pain relief, doctor recommended, guaranteed recovery.",
    "If knowledge is insufficient, recommend human review and ask for minimum missing information.",
    "Classify C-end support and B2B/OEM/ODM/distributor inquiries clearly.",
    "Output JSON only. No markdown.",
    "Allowed urgency values: low, medium, high.",
    "Required JSON keys: language, detected_country, platform, product_model, product_category, issue_type, urgency, summary, summary_en, ai_recommendation, ai_reply_draft.",
    "summary must be concise Chinese. summary_en must be concise English. ai_reply_draft must be in the customer's likely language.",
    "",
    HUMAN_CONTACT,
    "",
    "AULEXMED knowledge:",
    knowledgeText || "No specific support knowledge matched. Use safe fallback and recommend human review when needed."
  ].join("\n");

  const response = await fetch("https://api.deepseek.com/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: "system", content: systemPrompt },
        {
          role: "user",
          content: [
            `Source mailbox: ${input.source_email}`,
            `From: ${input.from_email}`,
            `Subject: ${input.subject}`,
            "",
            input.clean_body
          ].join("\n")
        }
      ],
      temperature: 0.1,
      max_tokens: 1200
    })
  });

  if (!response.ok) {
    console.error("AULEXMED DeepSeek support email analysis failed", {
      status: response.status,
      message: await response.text().catch(() => "")
    });
    return {
      analysis: fallbackAnalysis(input),
      knowledgeCount: retrieval?.knowledge?.length ?? 0,
      source: "fallback" as const
    };
  }

  const data = (await response.json()) as DeepSeekResponse;
  const content = data.choices?.[0]?.message?.content?.trim() || "";
  const parsed = extractJson(content);

  if (!parsed) {
    console.error("AULEXMED DeepSeek support email analysis returned non-JSON content.");
    return {
      analysis: fallbackAnalysis(input),
      knowledgeCount: retrieval?.knowledge?.length ?? 0,
      source: "fallback" as const
    };
  }

  const analysis: SupportEmailAnalysis = {
    language: parsed.language || detectLanguage(contentForRetrieval),
    detected_country: parsed.detected_country || null,
    platform: parsed.platform || null,
    product_model: parsed.product_model || null,
    product_category: parsed.product_category || null,
    issue_type: parsed.issue_type || null,
    urgency: normalizeUrgency(parsed.urgency),
    summary: parsed.summary || fallbackAnalysis(input).summary,
    summary_en: parsed.summary_en || fallbackAnalysis(input).summary_en,
    ai_recommendation: parsed.ai_recommendation || fallbackAnalysis(input).ai_recommendation,
    ai_reply_draft: parsed.ai_reply_draft || fallbackAnalysis(input).ai_reply_draft
  };

  return {
    analysis,
    knowledgeCount: retrieval?.knowledge?.length ?? 0,
    source: retrieval?.knowledge?.length ? ("knowledge_deepseek" as const) : ("deepseek" as const)
  };
}
