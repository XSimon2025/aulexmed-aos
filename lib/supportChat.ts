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

export type SupportedLanguage = "en" | "es" | "fr" | "de" | "pt" | "zh";

export type ChatIntent = "consumer_support" | "business_inquiry" | "medical_advice" | "general_support";

export type RetrievalDebugInfo = {
  supabaseConfigured: boolean;
  fetchedRows: number;
  matchedRows: number;
  topMatches: Array<{
    id: string;
    category: string;
    issueType: string;
    score: number;
    priority: number;
  }>;
};

type SupabaseConfig = {
  url: string;
  apiKey: string;
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
  const apiKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.SUPABASE_ANON_KEY ||
    process.env.SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!url || !apiKey) {
    return null;
  }

  return {
    url: url.replace(/\/$/, ""),
    apiKey
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
      apikey: config.apiKey,
      Authorization: `Bearer ${config.apiKey}`,
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

export function detectLanguage(message: string): SupportedLanguage {
  const text = message.toLowerCase();

  if (/[\u4e00-\u9fff]/.test(message)) {
    return "zh";
  }

  if (/[¿¡ñáéíóúü]/.test(text) || /\b(talla|pedido|garant[ií]a|reembolso|devoluci[oó]n|compr[eé]|ayuda)\b/.test(text)) {
    return "es";
  }

  if (/[àâçéèêëîïôùûüÿœ]/.test(text) || /\b(taille|commande|remboursement|garantie|pi[eè]ce|aide)\b/.test(text)) {
    return "fr";
  }

  if (/[äöüß]/.test(text) || /\b(gr[oö][sß]e|bestellung|r[uü]ckerstattung|garantie|hilfe|ersatzteil)\b/.test(text)) {
    return "de";
  }

  if (/[ãõçáâêíóôú]/.test(text) || /\b(tamanho|pedido|garantia|reembolso|devolu[cç][aã]o|ajuda)\b/.test(text)) {
    return "pt";
  }

  return "en";
}

export function detectIntent(message: string): ChatIntent {
  const text = message.toLowerCase();

  if (/\b(distributor|wholesale|oem|odm|private label|factory|manufacturer|manufacturing|importer|retail chain|quote|quotation|catalog|certificate|ce mark|fda|iso|eudamed|sales)\b/.test(text)) {
    return "business_inquiry";
  }

  if (/\b(doctor|diagnose|diagnosis|medical advice|treat|treatment|cure|heal|pain relief|can i walk|can i exercise|injury getting worse|swelling|blood|infection)\b/.test(text)) {
    return "medical_advice";
  }

  if (/\b(order|refund|return|replacement|warranty|missing|broken|damaged|wrong size|too small|too large|manual|size|wear|adjust|strap|buckle|temu|amazon|tiktok|tracking|package|delivery|support)\b/.test(text)) {
    return "consumer_support";
  }

  return "general_support";
}

function expandQuestionForRetrieval(question: string, intent: ChatIntent): string {
  const text = question.toLowerCase();
  const additions: string[] = [];

  const synonymGroups = [
    {
      pattern: /\b(talla|taille|gr[oö][sß]e|tamanho|尺码|尺寸)\b/,
      terms: ["size", "wrong size", "too small", "too large", "exchange"]
    },
    {
      pattern: /\b(garant[ií]a|garantie|garantia|保修|质保)\b/,
      terms: ["warranty", "support", "order number"]
    },
    {
      pattern: /\b(reembolso|remboursement|r[uü]ckerstattung|devolu[cç][aã]o|退款|退货)\b/,
      terms: ["refund", "return", "platform", "order"]
    },
    {
      pattern: /\b(pedido|commande|bestellung|订单)\b/,
      terms: ["order", "tracking", "delivery", "purchase platform"]
    },
    {
      pattern: /\b(pieza|pi[eè]ce|ersatzteil|pe[cç]a|配件|零件)\b/,
      terms: ["part", "replacement part", "missing", "buckle", "strap", "accessory"]
    },
    {
      pattern: /\b(usar|porter|tragen|usar|使用|佩戴|ajustar|r[eé]gler|einstellen|ajustar)\b/,
      terms: ["wear", "adjust", "use", "manual", "instruction"]
    }
  ];

  for (const group of synonymGroups) {
    if (group.pattern.test(text)) {
      additions.push(...group.terms);
    }
  }

  if (intent === "business_inquiry") {
    additions.push("wholesale", "distributor", "oem", "odm", "quote", "catalog", "factory", "certificates");
  }

  if (intent === "medical_advice") {
    additions.push("support", "product usage", "manual", "size");
  }

  return [question, ...additions].join(" ");
}

function scoreKnowledgeItem(question: string, item: SupportKnowledgeItem, intent: ChatIntent): number {
  const expandedQuestion = expandQuestionForRetrieval(question, intent);
  const lowerQuestion = expandedQuestion.toLowerCase();
  const questionTokens = new Set(tokenize(expandedQuestion));
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

  if (intent === "consumer_support" && item.category !== "Other") {
    score += 1;
  }

  return score;
}

export async function retrieveSupportKnowledge(
  question: string,
  intent: ChatIntent = detectIntent(question)
): Promise<{ knowledge: RetrievedKnowledge[]; debug: RetrievalDebugInfo }> {
  const config = getSupabaseConfig();

  if (!config) {
    return {
      knowledge: [],
      debug: {
        supabaseConfigured: false,
        fetchedRows: 0,
        matchedRows: 0,
        topMatches: []
      }
    };
  }

  const params = new URLSearchParams({
    select:
      "id,category,issue_type,customer_intent,product_type,product_model,product_keywords,trigger_keywords,priority,recommended_action,required_info,reply_template_en,reply_template_cn,platform_policy,youtube_hint,tiktok_hint,risk_level,human_review_required,is_active",
    is_active: "eq.true",
    order: "priority.asc",
    limit: "50"
  });

  const rows = await supabaseRequest<SupportKnowledgeItem[]>(`support_knowledge_base?${params.toString()}`);

  const knowledge = rows
    .map((item) => ({ ...item, score: scoreKnowledgeItem(question, item, intent) }))
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score || a.priority - b.priority)
    .slice(0, 4);

  return {
    knowledge,
    debug: {
      supabaseConfigured: true,
      fetchedRows: rows.length,
      matchedRows: knowledge.length,
      topMatches: knowledge.map((item) => ({
        id: item.id,
        category: item.category,
        issueType: item.issue_type,
        score: item.score,
        priority: item.priority
      }))
    }
  };
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

export function buildFallbackAnswer(language: SupportedLanguage, intent: ChatIntent) {
  if (intent === "medical_advice") {
    const answers: Record<SupportedLanguage, string> = {
      en: "Please consult a healthcare professional for medical advice. I can help with AULEXMED product usage, sizing, manuals, warranty, and support information.",
      es: "Consulta a un profesional de la salud para recibir consejo médico. Puedo ayudarte con el uso del producto AULEXMED, tallas, manuales, garantía e información de soporte.",
      fr: "Veuillez consulter un professionnel de santé pour tout avis médical. Je peux vous aider avec l'utilisation du produit AULEXMED, les tailles, les manuels, la garantie et le support.",
      de: "Bitte wenden Sie sich für medizinischen Rat an eine medizinische Fachkraft. Ich kann bei AULEXMED Produktnutzung, Größen, Handbüchern, Garantie und Support helfen.",
      pt: "Consulte um profissional de saúde para orientação médica. Posso ajudar com uso do produto AULEXMED, tamanhos, manuais, garantia e suporte.",
      zh: "请咨询医疗专业人士获取医疗建议。我可以帮助解答 AULEXMED 产品使用、尺码、说明书、保修和售后支持信息。"
    };
    return answers[language];
  }

  if (intent === "business_inquiry") {
    const answers: Record<SupportedLanguage, string> = {
      en: `Thanks for your interest in AULEXMED. For wholesale, OEM/ODM, distributor, catalog, or quotation questions, please share your company name, country, product category, estimated quantity, and target sales channel. You can also contact ${siteConfig.email}.`,
      es: `Gracias por tu interés en AULEXMED. Para consultas de distribución, mayorista, OEM/ODM, catálogo o cotización, indícanos el nombre de tu empresa, país, categoría de producto, cantidad estimada y canal de venta. También puedes escribir a ${siteConfig.email}.`,
      fr: `Merci pour votre intérêt pour AULEXMED. Pour les demandes grossiste, OEM/ODM, distributeur, catalogue ou devis, indiquez le nom de votre entreprise, le pays, la catégorie de produit, la quantité estimée et le canal de vente. Vous pouvez aussi écrire à ${siteConfig.email}.`,
      de: `Vielen Dank für Ihr Interesse an AULEXMED. Für Großhandel, OEM/ODM, Vertrieb, Katalog oder Angebote nennen Sie bitte Firmenname, Land, Produktkategorie, geschätzte Menge und Vertriebskanal. Sie können auch ${siteConfig.email} kontaktieren.`,
      pt: `Obrigado pelo interesse na AULEXMED. Para atacado, OEM/ODM, distribuição, catálogo ou cotação, informe o nome da empresa, país, categoria do produto, quantidade estimada e canal de venda. Você também pode contatar ${siteConfig.email}.`,
      zh: `感谢你关注 AULEXMED。若是批发、OEM/ODM、经销、目录或报价需求，请提供公司名称、国家、产品类别、预计数量和销售渠道，也可以联系 ${siteConfig.email}。`
    };
    return answers[language];
  }

  const answers: Record<SupportedLanguage, string> = {
    en: "I may need a little more information to help accurately. Could you tell me which AULEXMED product you purchased and where you bought it? If this is about an order, please include your order number or purchase platform. A photo or short video can also help for missing parts, fit, or product issues.",
    es: "Necesito un poco más de información para ayudarte con precisión. ¿Qué producto AULEXMED compraste y dónde lo compraste? Si es sobre un pedido, incluye el número de pedido o la plataforma de compra. Una foto o video corto también ayuda si faltan piezas, hay dudas de ajuste o un problema del producto.",
    fr: "J'ai besoin d'un peu plus d'informations pour vous aider correctement. Quel produit AULEXMED avez-vous acheté et où l'avez-vous acheté ? Si cela concerne une commande, indiquez le numéro de commande ou la plateforme d'achat. Une photo ou une courte vidéo peut aussi aider pour les pièces manquantes, l'ajustement ou un problème produit.",
    de: "Ich brauche noch ein paar Informationen, um genau helfen zu können. Welches AULEXMED Produkt haben Sie gekauft und wo haben Sie es gekauft? Wenn es um eine Bestellung geht, nennen Sie bitte die Bestellnummer oder die Kaufplattform. Ein Foto oder kurzes Video hilft auch bei fehlenden Teilen, Passform- oder Produktfragen.",
    pt: "Preciso de um pouco mais de informação para ajudar com precisão. Qual produto AULEXMED você comprou e onde comprou? Se for sobre um pedido, informe o número do pedido ou a plataforma de compra. Uma foto ou vídeo curto também ajuda em casos de peças faltando, ajuste ou problema do produto.",
    zh: "我需要更多信息才能准确帮助你。请告诉我你购买的是哪款 AULEXMED 产品，以及在哪个平台购买。如果是订单问题，请提供订单号或购买平台；如果是缺件、佩戴或产品问题，照片或短视频也会有帮助。"
  };

  return answers[language];
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
