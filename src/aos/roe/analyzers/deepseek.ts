import type { NormalizedReview, ReviewAnalysis } from "../types/review.ts";
import { extractJsonObject } from "../utils/json.ts";
import { optionalEnv } from "../utils/env.ts";
import { fallbackReviewAnalysis } from "./fallback.ts";
import { buildReviewAnalysisPrompt } from "../prompts/reviewAnalysisPrompt.ts";

type DeepSeekResponse = {
  choices?: Array<{ message?: { content?: string } }>;
};

function normalizeBoolean(value: unknown) {
  return value === true || value === "true";
}

function normalizeAnalysis(review: NormalizedReview, raw: Partial<ReviewAnalysis>): ReviewAnalysis {
  const fallback = fallbackReviewAnalysis(review);

  return {
    language: raw.language || fallback.language,
    sentiment: raw.sentiment || fallback.sentiment,
    product_name: raw.product_name ?? review.product_name ?? null,
    product_model: raw.product_model ?? review.size_model ?? review.sku ?? null,
    issue_type: raw.issue_type || fallback.issue_type,
    issue_reason: raw.issue_reason ?? fallback.issue_reason,
    is_negative_review: normalizeBoolean(raw.is_negative_review) || fallback.is_negative_review,
    needs_public_reply:
      typeof raw.needs_public_reply === "boolean" ? raw.needs_public_reply : fallback.needs_public_reply,
    needs_private_message:
      typeof raw.needs_private_message === "boolean" ? raw.needs_private_message : fallback.needs_private_message,
    needs_after_sales_case:
      typeof raw.needs_after_sales_case === "boolean"
        ? raw.needs_after_sales_case
        : fallback.needs_after_sales_case,
    needs_feishu_alert:
      typeof raw.needs_feishu_alert === "boolean" ? raw.needs_feishu_alert : fallback.needs_feishu_alert,
    should_add_to_knowledge_base:
      typeof raw.should_add_to_knowledge_base === "boolean"
        ? raw.should_add_to_knowledge_base
        : fallback.should_add_to_knowledge_base,
    priority: raw.priority || fallback.priority,
    summary_cn: raw.summary_cn || fallback.summary_cn,
    suggested_solution: raw.suggested_solution || fallback.suggested_solution,
    public_reply_draft: raw.public_reply_draft || fallback.public_reply_draft,
    private_message_draft: raw.private_message_draft ?? fallback.private_message_draft,
    compliance_notes: Array.isArray(raw.compliance_notes) ? raw.compliance_notes : fallback.compliance_notes
  };
}

export async function analyzeReviewWithDeepSeek(review: NormalizedReview) {
  const apiKey = optionalEnv("DEEPSEEK_API_KEY");
  const model = optionalEnv("DEEPSEEK_MODEL", "deepseek-v4-pro");

  if (!apiKey) {
    console.error("AOS-ROE DeepSeek skipped: DEEPSEEK_API_KEY is not configured.");
    return { analysis: fallbackReviewAnalysis(review), source: "fallback" as const };
  }

  try {
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
            content:
              "You are a careful multilingual review operations assistant for AULEXMED. Return strict JSON only."
          },
          { role: "user", content: buildReviewAnalysisPrompt(review) }
        ],
        temperature: 0.55,
        max_tokens: 1400
      })
    });

    if (!response.ok) {
      console.error("AOS-ROE DeepSeek request failed", {
        status: response.status,
        message: await response.text().catch(() => "")
      });
      return { analysis: fallbackReviewAnalysis(review), source: "fallback" as const };
    }

    const data = (await response.json()) as DeepSeekResponse;
    const content = data.choices?.[0]?.message?.content || "";
    const parsed = extractJsonObject<Partial<ReviewAnalysis>>(content);

    if (!parsed) {
      console.error("AOS-ROE DeepSeek returned non-JSON content.");
      return { analysis: fallbackReviewAnalysis(review), source: "fallback" as const };
    }

    return { analysis: normalizeAnalysis(review, parsed), source: "deepseek" as const };
  } catch (error) {
    console.error("AOS-ROE DeepSeek analysis failed", error);
    return { analysis: fallbackReviewAnalysis(review), source: "fallback" as const };
  }
}
