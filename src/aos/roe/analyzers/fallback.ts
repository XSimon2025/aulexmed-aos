import type { NormalizedReview, ReviewAnalysis, ReviewIssueType } from "../types/review.ts";

const alertWords = [
  "broken",
  "refund",
  "missing",
  "wrong size",
  "not working",
  "disappointed",
  "damaged",
  "defective",
  "too small",
  "too large"
];

function detectIssue(text: string): ReviewIssueType {
  const lower = text.toLowerCase();
  if (lower.includes("size") || lower.includes("small") || lower.includes("large") || lower.includes("fit")) {
    return "size_fit";
  }
  if (lower.includes("broken") || lower.includes("damaged") || lower.includes("defective")) return "damaged";
  if (lower.includes("missing")) return "missing_parts";
  if (lower.includes("refund")) return "refund";
  if (lower.includes("shipping") || lower.includes("delivery") || lower.includes("late")) return "logistics";
  if (lower.includes("how") || lower.includes("wear") || lower.includes("use")) return "usage";
  return "none";
}

export function fallbackReviewAnalysis(review: NormalizedReview): ReviewAnalysis {
  const text = review.review_content || "";
  const issueType = detectIssue(text);
  const isLowStar = review.star_rating <= 3;
  const hasAlertWord = alertWords.some((word) => text.toLowerCase().includes(word));
  const needsPrivateMessage = review.star_rating <= 2 || (review.star_rating === 4 && issueType !== "none");

  return {
    language: review.review_language || "en",
    sentiment: review.star_rating >= 4 ? "positive" : review.star_rating === 3 ? "mixed" : "negative",
    product_name: review.product_name || null,
    product_model: review.size_model || review.sku || null,
    issue_type: issueType,
    issue_reason: issueType === "none" ? null : "Detected from review keywords; human review recommended.",
    is_negative_review: review.star_rating <= 3,
    needs_public_reply: !review.has_public_reply,
    needs_private_message: needsPrivateMessage,
    needs_after_sales_case: isLowStar || needsPrivateMessage,
    needs_feishu_alert: review.star_rating <= 2 || (review.star_rating === 3 && issueType !== "none") || hasAlertWord,
    should_add_to_knowledge_base: issueType !== "none",
    priority: review.star_rating <= 2 ? "high" : review.star_rating === 3 ? "medium" : "low",
    summary_cn:
      review.star_rating <= 2
        ? "低星评价，需要人工跟进客户体验、订单信息和具体问题。"
        : review.star_rating === 3
          ? "中性评价，需要确认是否存在产品使用或尺码问题。"
          : "正向评价，可生成自然公开回复。",
    suggested_solution:
      issueType === "none"
        ? "Generate a public reply and monitor only."
        : "Create a follow-up case. Ask for order details, photos or short video if relevant, and route to human support.",
    public_reply_draft:
      review.star_rating >= 5
        ? "Thank you so much for your kind feedback. We’re glad the product has been helpful for your daily support. Wishing you a wonderful day!"
        : review.star_rating === 4
          ? "Thank you for sharing your feedback. We’re glad to hear your experience was mostly positive, and we’d always appreciate hearing how we can keep improving."
          : "Thank you for sharing your experience. We’re sorry it wasn’t as smooth as expected. Our support team would like to review this and help you with the next step.",
    private_message_draft: needsPrivateMessage
      ? "Hi, thank you for your feedback. We’re sorry the experience did not meet your expectations. Could you please share a photo or short video of the issue and your order details? We’d like to review this carefully and help with the next step."
      : null,
    compliance_notes: ["Fallback analysis used because DeepSeek was unavailable or returned invalid JSON."]
  };
}
