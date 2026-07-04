import { NextResponse } from "next/server";
import {
  buildFallbackAnswer,
  createOrUpdateChatSession,
  formatKnowledgeForPrompt,
  needsHumanFollowUp,
  type RetrievedKnowledge,
  retrieveSupportKnowledge,
  storeChatMessage
} from "@/lib/supportChat";

export const runtime = "nodejs";

type ChatRequest = {
  message?: string;
  sessionId?: string;
  pageUrl?: string;
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

function getSafeSupportSystemPrompt(knowledgeText: string) {
  return [
    "You are AULEXMED after-sales support.",
    "You must answer primarily from the AULEXMED support knowledge provided below.",
    "Do not invent product details, warranty promises, refund promises, replacement promises, or medical claims.",
    "Avoid diagnosis and medical treatment advice. If the user asks for medical advice, tell them to consult a healthcare professional.",
    "Use a polite, professional, simple, customer-friendly tone.",
    "If information is missing, ask for the minimum necessary details such as product model, order number, purchase platform, photo, or short video.",
    "If the retrieved knowledge does not answer the question, say that support should review it rather than guessing.",
    "",
    "AULEXMED support knowledge:",
    knowledgeText
  ].join("\n");
}

async function askDeepSeek(question: string, knowledgeText: string) {
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
          content: getSafeSupportSystemPrompt(knowledgeText)
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

  let knowledge: RetrievedKnowledge[] = [];

  try {
    knowledge = await retrieveSupportKnowledge(message);
  } catch (error) {
    console.error("AULEXMED knowledge retrieval failed", error);
  }

  const supportCategory = knowledge[0]?.category;
  const humanFollowUpRequired = needsHumanFollowUp(message, knowledge);
  const retrievedKnowledgeIds = knowledge.map((item) => item.id);

  let answer = buildFallbackAnswer();
  let source: "supabase_deepseek" | "supabase_template" | "fallback" = "fallback";

  if (knowledge.length > 0) {
    const knowledgeText = formatKnowledgeForPrompt(knowledge);

    try {
      const deepSeekAnswer = await askDeepSeek(message, knowledgeText);
      if (deepSeekAnswer) {
        answer = deepSeekAnswer;
        source = "supabase_deepseek";
      } else {
        answer = knowledge[0].reply_template_en || buildFallbackAnswer();
        source = "supabase_template";
      }
    } catch (error) {
      console.error("AULEXMED DeepSeek request failed", error);
      answer = knowledge[0].reply_template_en || buildFallbackAnswer();
    }
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
          source: "website_chatbot"
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
    humanFollowUpRequired,
    retrievedKnowledgeCount: knowledge.length
  });
}
