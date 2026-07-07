export function buildReviewAnalysisPrompt(review: {
  star_rating: number;
  review_text?: string;
  product_name?: string;
}): string {
  const text = review.review_text || "(no review text)";
  const product = review.product_name || "(unknown product)";
  const stars = review.star_rating;

  return `You are an e-commerce review analyst for AULEXMED, a professional orthopedic support brand.

Analyze the following customer review and return a JSON object.

Review details:
- Product: ${product}
- Star Rating: ${stars} / 5
- Review Text: ${text}

Return ONLY a valid JSON object (no markdown, no extra text) with these fields:
{
  "sentiment": "positive" | "neutral" | "negative" | "mixed",
  "issue_type": "product_quality" | "size_fit" | "shipping" | "packaging" | "customer_service" | "price" | "product_damage" | "missing_parts" | "description_mismatch" | "other" | "none",
  "summary_cn": "Chinese summary of the review (1-2 sentences)",
  "summary_en": "English summary of the review (1-2 sentences)",
  "reply_draft_cn": "Public reply draft in Chinese (friendly, professional, DO NOT promise refunds, DO NOT make medical claims, DO NOT ask to change the review)",
  "reply_draft_en": "Public reply draft in English (same rules as above)",
  "private_reply_draft": "Private message draft if the issue needs follow-up (same safety rules, offer contact email support@aulexmed.com)",
  "needs_after_sales_case": true or false,
  "needs_human_review": true or false,
  "risk_level": "low" | "medium" | "high" | "critical",
  "ai_confidence": 0.0 to 1.0
}

Rules:
- For 5-star reviews: positive sentiment, brief thank-you reply, no private message needed
- For 4-star reviews: thank customer, gently ask if anything could be improved
- For 3-star reviews: acknowledge, show concern, may need follow-up
- For 1-2 star reviews: apologize sincerely, draft both public and private replies, set needs_human_review=true
- NEVER promise refunds, compensation, or order changes
- NEVER make medical claims or guarantee recovery
- NEVER ask the customer to modify or delete their review
- Use safe language: "daily support", "comfortable fit", "adjustable design"`;
}
