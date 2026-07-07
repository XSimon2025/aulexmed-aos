import type { NormalizedReview, ReviewAnalysis } from "../types/review.ts";
import { optionalEnv } from "../utils/env.ts";

function line(label: string, value?: string | number | boolean | null) {
  return `${label}: ${value === undefined || value === null || value === "" ? "Not provided" : value}`;
}

export function shouldNotifyFeishu(review: NormalizedReview, analysis: ReviewAnalysis) {
  if (analysis.needs_feishu_alert) return true;
  if (review.star_rating <= 2) return true;
  if (review.star_rating === 3 && analysis.issue_type !== "none") return true;

  const text = `${review.review_content || ""} ${analysis.issue_reason || ""}`.toLowerCase();
  return ["broken", "refund", "missing", "wrong size", "not working", "disappointed"].some((word) =>
    text.includes(word)
  );
}

export async function sendReviewFeishuAlert(input: {
  review: NormalizedReview;
  analysis: ReviewAnalysis;
  caseId?: string | null;
  dryRun?: boolean;
}) {
  const webhookUrl = optionalEnv("FEISHU_WEBHOOK_URL");
  const text = [
    "AULEXMED Review Alert - TikTok",
    "",
    line("Dry run", input.dryRun ? "yes" : "no"),
    line("Case ID", input.caseId),
    line("Star rating", input.review.star_rating),
    line("Username", input.review.username),
    line("Product", input.review.product_name),
    line("Order ID", input.review.order_id),
    line("Issue type", input.analysis.issue_type),
    line("Priority", input.analysis.priority),
    "",
    "AI Chinese summary:",
    input.analysis.summary_cn,
    "",
    "Suggested solution:",
    input.analysis.suggested_solution,
    "",
    "Public reply draft:",
    input.analysis.public_reply_draft,
    "",
    "Private message draft:",
    input.analysis.private_message_draft || "Not required",
    "",
    line("Needs human handling", input.analysis.needs_after_sales_case)
  ].join("\n");

  if (!webhookUrl) {
    console.error("AOS-ROE Feishu alert skipped: FEISHU_WEBHOOK_URL is not configured.");
    return { ok: false, skipped: true, text };
  }

  if (input.dryRun) {
    return { ok: true, dryRun: true, text };
  }

  const response = await fetch(webhookUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      msg_type: "text",
      content: { text }
    })
  });

  if (!response.ok) {
    return { ok: false, error: `Feishu webhook failed with status ${response.status}.`, text };
  }

  return { ok: true, text };
}
