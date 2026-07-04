import { NextResponse } from "next/server";
import {
  buildFallbackAnswer,
  createOrUpdateChatSession,
  detectIntent,
  detectLanguage,
  formatKnowledgeForPrompt,
  needsHumanFollowUp,
  type RetrievedKnowledge,
  type RetrievalDebugInfo,
  retrieveSupportKnowledge,
  storeChatMessage
} from "@/lib/supportChat";

export const runtime = "nodejs";

type ChatRequest = {
  message?: string;
  sessionId?: string;
  pageUrl?: string;
  debug?: boolean;
};

type DeepSeekResponse = {
  choices?: Array<{
    message?: {
      content?: string;
    };
  }>;
};

function getClientIp(request: Request) {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0]?.trim();
  }

  return request.headers.get("x-real-ip") ?? undefined;
}

function getSafeSupportSystemPrompt({
  knowledgeText,
  language,
  intent
}: {
  knowledgeText: string;
  language: string;
  intent: string;
}) {
  return [
    "You are AULEXMED after-sales support.",
    "Use AULEXMED support knowledge as the primary source of truth when it is provided.",
    "If the knowledge is partial, give a safe helpful answer and ask only for the minimum missing information.",
    "Do not immediately send every customer to email support.",
    "Do not invent product details, warranty promises, refund promises, replacement promises, or medical claims.",
    "Avoid diagnosis and medical treatment advice. If the user asks for medical advice, tell them to consult a healthcare professional.",
    "Use a polite, professional, simple, customer-friendly tone.",
    "If information is missing, ask for the minimum necessary details such as product model, order number, purchase platform, photo, or short video.",
    "For B2B, wholesale, OEM/ODM, distributor, catalog, certification, or quote questions, route toward sales/contact/quotation and ask for company, country, product category, estimated quantity, and channel.",
    "Reply in the user's language. If the language is unclear, reply in simple English.",
    `Detected language: ${language}`,
    `Detected intent: ${intent}`,
    "",
    "AULEXMED support knowledge:",
    knowledgeText || "No specific knowledge match was found. Answer safely and ask for the minimum details needed."
  ].join("\n");
}

async function askDeepSeek({
  question,
  knowledgeText,
  language,
  intent
}: {
  question: string;
  knowledgeText: string;
  language: string;
  intent: string;
}) {
  const apiKey = process.env.DEEPSEEK_API_KEY;
  const model = process.env.DEEPSEEK_MODEL || "deepseek-v4-pro";

  if (!apiKey) {
    return null;
  }

  const response = await fetch("https://api.deepseek.com/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model,
      messages: [
        {
          role: "system",
          content: getSafeSupportSystemPrompt({ knowledgeText, language, intent })
        },
        {
          role: "user",
          content: question
        }
      ],
      temperature: 0.2,
      max_tokens: 700
    })
  });

  if (!response.ok) {
    return null;
  }

  const data = (await response.json()) as DeepSeekResponse;
  return data.choices?.[0]?.message?.content?.trim() || null;
}

export async function POST(request: Request) {
  let body: ChatRequest;

  try {
    body = (await request.json()) as ChatRequest;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const message = body.message?.trim();

  if (!message) {
    return NextResponse.json({ error: "Message is required." }, { status: 400 });
  }

  if (message.length > 1200) {
    return NextResponse.json({ error: "Message is too long." }, { status: 400 });
  }

  const pageUrl = body.pageUrl || request.headers.get("referer") || undefined;
  const referrer = request.headers.get("referer") || undefined;
  const visitorIp = getClientIp(request);
  const country = request.headers.get("x-vercel-ip-country") || undefined;
  const userAgent = request.headers.get("user-agent") || undefined;
  const language = detectLanguage(message);
  const intent = detectIntent(message);

  let knowledge: RetrievedKnowledge[] = [];
  let retrievalDebug: RetrievalDebugInfo = {
    supabaseConfigured: false,
    fetchedRows: 0,
    matchedRows: 0,
    topMatches: []
  };

  try {
    const retrieval = await retrieveSupportKnowledge(message, intent);
    knowledge = retrieval.knowledge;
    retrievalDebug = retrieval.debug;
  } catch (error) {
    console.error("AULEXMED knowledge retrieval failed", error);
  }

  const supportCategory = intent === "business_inquiry" ? "B2B Inquiry" : knowledge[0]?.category;
  const humanFollowUpRequired = needsHumanFollowUp(message, knowledge);
  const retrievedKnowledgeIds = knowledge.map((item) => item.id);

  let answer = buildFallbackAnswer(language, intent);
  let source: "supabase_deepseek" | "supabase_template" | "fallback" = "fallback";
  const knowledgeText = knowledge.length > 0 ? formatKnowledgeForPrompt(knowledge) : "";

  if (knowledge.length > 0 || intent === "business_inquiry" || intent === "medical_advice" || intent === "general_support") {
    try {
      const deepSeekAnswer = await askDeepSeek({
        question: message,
        knowledgeText,
        language,
        intent
      });
      if (deepSeekAnswer) {
        answer = deepSeekAnswer;
        source = knowledge.length > 0 ? "supabase_deepseek" : "fallback";
      } else if (knowledge.length > 0) {
        answer = knowledge[0].reply_template_en || buildFallbackAnswer(language, intent);
        source = "supabase_template";
      }
    } catch (error) {
      console.error("AULEXMED DeepSeek request failed", error);
      if (knowledge.length > 0) {
        answer = knowledge[0].reply_template_en || buildFallbackAnswer(language, intent);
        source = "supabase_template";
      }
    }
  }

  if (process.env.AULEXMED_CHAT_DEBUG === "true") {
    console.info("AULEXMED chat retrieval", {
      messagePreview: message.slice(0, 160),
      language,
      intent,
      fetchedRows: retrievalDebug.fetchedRows,
      matchedRows: retrievalDebug.matchedRows,
      topMatches: retrievalDebug.topMatches,
      contextPassedToDeepSeek: knowledgeText.length > 0,
      source
    });
  }

  let sessionId = body.sessionId;

  try {
    const session = await createOrUpdateChatSession(
      {
        sessionId,
        pageUrl,
        referrer,
        visitorIp,
        country,
        userAgent
      },
      supportCategory,
      humanFollowUpRequired
    );

    if (session?.id) {
      sessionId = session.id;
      await storeChatMessage({
        sessionId,
        role: "user",
        content: message,
        supportCategory,
        retrievedKnowledgeIds,
        humanFollowUpRequired,
        metadata: {
          pageUrl,
          country,
          source: "website_chatbot",
          language,
          intent
        }
      });
      await storeChatMessage({
        sessionId,
        role: "assistant",
        content: answer,
        supportCategory,
        retrievedKnowledgeIds,
        humanFollowUpRequired,
        metadata: {
          source,
          model: process.env.DEEPSEEK_MODEL || "deepseek-v4-pro",
          language,
          intent,
          contextPassedToDeepSeek: knowledgeText.length > 0,
          knowledgeMatches: knowledge.map((item) => ({
            id: item.id,
            category: item.category,
            issueType: item.issue_type,
            score: item.score
          }))
        }
      });
    }
  } catch (error) {
    console.error("AULEXMED chat storage failed", error);
  }

  return NextResponse.json({
    answer,
    sessionId,
    source,
    supportCategory,
    language,
    intent,
    humanFollowUpRequired,
    retrievedKnowledgeCount: knowledge.length,
    debug:
      body.debug && process.env.AULEXMED_CHAT_DEBUG === "true"
        ? {
            retrieval: retrievalDebug,
            contextPassedToDeepSeek: knowledgeText.length > 0,
            fallbackReason:
              source === "fallback"
                ? knowledge.length === 0
                  ? "no_useful_knowledge_match_or_missing_model_response"
                  : "model_unavailable"
                : null
          }
        : undefined
  });
}
