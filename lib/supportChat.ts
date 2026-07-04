import { siteConfig } from "@/lib/site";

export type SupportKnowledgeItem = {
  id: string;
  category: string;
  issue_type: string;
  customer_intent: string | null;
  product_type: string | null;
  product_model: string | null;
  product_keywords: string[];
  trigger_keywords: string[];
  priority: number;
  recommended_action: string;
  required_info: string[];
  reply_template_en: string;
  reply_template_cn: string | null;
  platform_policy: string | null;
  youtube_hint: string | null;
  tiktok_hint: string | null;
  risk_level: "Low" | "Medium" | "High";
  human_review_required: boolean;
  is_active: boolean;
};

export type RetrievedKnowledge = SupportKnowledgeItem & {
  score: number;
};

type SupabaseConfig = {
  url: string;
  serviceRoleKey: string;
};

export type ChatStorageInput = {
  sessionId?: string;
  pageUrl?: string;
  referrer?: string;
  visitorIp?: string;
  country?: string;
  userAgent?: string;
};

export type StoredChatSession = {
  id: string;
};

function getSupabaseConfig(): SupabaseConfig | null {
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    return null;
  }

  return {
    url: url.replace(/\/$/, ""),
    serviceRoleKey
  };
}

async function supabaseRequest<T>(path: string, init: RequestInit = {}): Promise<T> {
  const config = getSupabaseConfig();

  if (!config) {
    throw new Error("Supabase environment variables are not configured.");
  }

  const response = await fetch(`${config.url}/rest/v1/${path}`, {
    ...init,
    headers: {
      apikey: config.serviceRoleKey,
      Authorization: `Bearer ${config.serviceRoleKey}`,
      "Content-Type": "application/json",
      ...(init.headers ?? {})
    },
    cache: "no-store"
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(`Supabase request failed: ${response.status} ${message}`);
  }

  if (response.status === 204) {
    return null as T;
  }

  return response.json() as Promise<T>;
}

function tokenize(value: string): string[] {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, " ")
    .split(/\s+/)
    .filter((token) => token.length >= 2);
}

function scoreKnowledgeItem(question: string, item: SupportKnowledgeItem): number {
  const lowerQuestion = question.toLowerCase();
  const questionTokens = new Set(tokenize(question));
  let score = 0;

  for (const keyword of item.trigger_keywords ?? []) {
    const normalized = keyword.toLowerCase();
    if (normalized && lowerQuestion.includes(normalized)) {
      score += 8;
    }
  }

  for (const keyword of item.product_keywords ?? []) {
    const normalized = keyword.toLowerCase();
    if (normalized && lowerQuestion.includes(normalized)) {
      score += 6;
    }
  }

  for (const token of tokenize([item.category, item.issue_type, item.customer_intent ?? "", item.product_type ?? "", item.product_model ?? ""].join(" "))) {
    if (questionTokens.has(token)) {
      score += 2;
    }
  }

  if (/(refund|return|replacement|warranty|missing|broken|damaged|wrong size|too small|too large)/i.test(question)) {
    if (item.human_review_required) {
      score += 3;
    }
  }

  return score;
}

export async function retrieveSupportKnowledge(question: string): Promise<RetrievedKnowledge[]> {
  const config = getSupabaseConfig();

  if (!config) {
    return [];
  }

  const params = new URLSearchParams({
    select:
      "id,category,issue_type,customer_intent,product_type,product_model,product_keywords,trigger_keywords,priority,recommended_action,required_info,reply_template_en,reply_template_cn,platform_policy,youtube_hint,tiktok_hint,risk_level,human_review_required,is_active",
    is_active: "eq.true",
    order: "priority.asc",
    limit: "50"
  });

  const rows = await supabaseRequest<SupportKnowledgeItem[]>(`support_knowledge_base?${params.toString()}`);

  return rows
    .map((item) => ({ ...item, score: scoreKnowledgeItem(question, item) }))
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score || a.priority - b.priority)
    .slice(0, 4);
}

export async function createOrUpdateChatSession(input: ChatStorageInput, supportCategory?: string, humanFollowUpRequired = false): Promise<StoredChatSession | null> {
  if (!getSupabaseConfig()) {
    return null;
  }

  if (input.sessionId) {
    const rows = await supabaseRequest<StoredChatSession[]>(`chat_sessions?id=eq.${encodeURIComponent(input.sessionId)}&select=id`, {
      method: "PATCH",
      headers: {
        Prefer: "return=representation"
      },
      body: JSON.stringify({
        page_url: input.pageUrl,
        referrer: input.referrer,
        country: input.country,
        user_agent: input.userAgent,
        support_category: supportCategory,
        human_follow_up_required: humanFollowUpRequired,
        status: humanFollowUpRequired ? "human_follow_up" : "open"
      })
    });

    if (rows[0]?.id) {
      return rows[0];
    }
  }

  const rows = await supabaseRequest<StoredChatSession[]>("chat_sessions", {
    method: "POST",
    headers: {
      Prefer: "return=representation"
    },
    body: JSON.stringify({
      page_url: input.pageUrl,
      referrer: input.referrer,
      visitor_ip: input.visitorIp,
      country: input.country,
      user_agent: input.userAgent,
      support_category: supportCategory,
      human_follow_up_required: humanFollowUpRequired,
      status: humanFollowUpRequired ? "human_follow_up" : "open"
    })
  });

  return rows[0] ?? null;
}

export async function storeChatMessage({
  sessionId,
  role,
  content,
  supportCategory,
  retrievedKnowledgeIds,
  humanFollowUpRequired,
  metadata
}: {
  sessionId: string;
  role: "user" | "assistant" | "system";
  content: string;
  supportCategory?: string;
  retrievedKnowledgeIds?: string[];
  humanFollowUpRequired?: boolean;
  metadata?: Record<string, unknown>;
}) {
  if (!getSupabaseConfig()) {
    return;
  }

  await supabaseRequest("chat_messages", {
    method: "POST",
    headers: {
      Prefer: "return=minimal"
    },
    body: JSON.stringify({
      session_id: sessionId,
      role,
      content,
      support_category: supportCategory,
      retrieved_knowledge_ids: retrievedKnowledgeIds ?? [],
      human_follow_up_required: humanFollowUpRequired ?? false,
      metadata: metadata ?? {}
    })
  });
}

export function buildFallbackAnswer() {
  return `I want to make sure I give you accurate AULEXMED support information. I do not have enough matching support content for this question yet. Please contact ${siteConfig.supportEmail} with your product model, order number, purchase platform, and a photo or short video if relevant. Our support team will help you review the next step.`;
}

export function needsHumanFollowUp(question: string, knowledge: RetrievedKnowledge[]) {
  if (knowledge.some((item) => item.human_review_required || item.risk_level === "High")) {
    return true;
  }

  return /(refund|return|replacement|warranty|missing|broken|damaged|wrong size|b2b|wholesale|distributor|email|whatsapp|phone)/i.test(question);
}

export function formatKnowledgeForPrompt(knowledge: RetrievedKnowledge[]) {
  return knowledge
    .map((item, index) => {
      return [
        `Knowledge ${index + 1}`,
        `Category: ${item.category}`,
        `Issue type: ${item.issue_type}`,
        `Product type: ${item.product_type ?? "General"}`,
        `Product model: ${item.product_model ?? "General"}`,
        `Recommended action: ${item.recommended_action}`,
        `Required information: ${item.required_info.join(", ") || "None"}`,
        `Reply template: ${item.reply_template_en}`,
        item.platform_policy ? `Platform policy: ${item.platform_policy}` : "",
        item.youtube_hint ? `YouTube hint: ${item.youtube_hint}` : "",
        item.tiktok_hint ? `TikTok hint: ${item.tiktok_hint}` : "",
        `Human review required: ${item.human_review_required ? "Yes" : "No"}`
      ]
        .filter(Boolean)
        .join("\n");
    })
    .join("\n\n");
}
