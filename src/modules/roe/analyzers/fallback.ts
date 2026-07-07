import type { ReviewAnalysis, ReviewIssueType, ReviewSentiment } from "../types.js";

export function fallbackReviewAnalysis(
  starRating: number,
  reviewText?: string,
): ReviewAnalysis {
  const sentiment = starToSentiment(starRating);
  const issueType = detectIssueType(reviewText);

  const template = sentimentTemplate(sentiment, starRating);

  return {
    sentiment,
    issue_type: issueType,
    summary_cn: template.summaryCN,
    summary_en: template.summaryEN,
    reply_draft_cn: template.replyCN,
    reply_draft_en: template.replyEN,
    private_reply_draft: starRating <= 2
      ? template.privateReply
      : "",
    needs_after_sales_case: starRating <= 2,
    needs_human_review: starRating <= 2,
    risk_level: starRating <= 1 ? "critical" : starRating === 2 ? "high" : starRating === 3 ? "medium" : "low",
    ai_confidence: 0.3,
  };
}

function starToSentiment(stars: number): ReviewSentiment {
  if (stars >= 5) return "positive";
  if (stars === 4) return "positive";
  if (stars === 3) return "neutral";
  return "negative";
}

function detectIssueType(text?: string): ReviewIssueType {
  if (!text) return "none";
  const lower = text.toLowerCase();
  if (/(too\s*(small|big|tight|loose)|doesn'?t\s*fit|wrong\s*size)/i.test(lower)) return "size_fit";
  if (/(broken|damaged|torn|defect|crack)/i.test(lower)) return "product_damage";
  if (/(late|slow|shipping|delivery|arrived)/i.test(lower)) return "shipping";
  if (/(package|box|wrap)/i.test(lower)) return "packaging";
  if (/(service|support|response|rude|helpful)/i.test(lower)) return "customer_service";
  if (/(expensive|price|cost|cheap|worth)/i.test(lower)) return "price";
  if (/(not as|different|picture|photo|description)/i.test(lower)) return "description_mismatch";
  if (/(missing|part|piece|strap|pad|velcro)/i.test(lower)) return "missing_parts";
  if (/(quality|material|comfortable|durable|broke|fell apart)/i.test(lower)) return "product_quality";
  return "none";
}

function sentimentTemplate(sentiment: ReviewSentiment, stars: number) {
  if (sentiment === "positive" && stars >= 5) {
    return {
      summaryCN: "客户对产品非常满意，给出5星好评。",
      summaryEN: "Customer is very satisfied with the product, gave a 5-star review.",
      replyCN: "感谢您的支持与好评！我们很高兴产品能帮到您。如有任何使用问题，欢迎随时联系 support@aulexmed.com。",
      replyEN: "Thank you for your support and kind review! We're glad the product is helping you. If you ever need assistance, feel free to contact support@aulexmed.com.",
      privateReply: "",
    };
  }

  if (sentiment === "positive" && stars === 4) {
    return {
      summaryCN: "客户对产品基本满意，给出4星评价。",
      summaryEN: "Customer is generally satisfied, gave a 4-star review.",
      replyCN: "感谢您的好评！我们持续改进产品体验，如有建议欢迎告知。祝您使用愉快！",
      replyEN: "Thank you for your review! We're always working to improve our products. If you have any suggestions, we'd love to hear them. Have a great day!",
      privateReply: "",
    };
  }

  if (sentiment === "neutral") {
    return {
      summaryCN: "客户给出3星中等评价，可能需要跟进了解使用体验。",
      summaryEN: "Customer gave a 3-star neutral review, may need follow-up.",
      replyCN: "感谢您的反馈。我们很重视您的体验，如您在使用中遇到任何问题，请联系 support@aulexmed.com，我们会尽力协助。",
      replyEN: "Thank you for your feedback. We value your experience. If you're having any issues, please contact support@aulexmed.com and we'll do our best to help.",
      privateReply: "Dear customer, thank you for your review. We noticed you gave 3 stars — if there's anything we can do to improve your experience, please let us know at support@aulexmed.com. We're here to help.",
    };
  }

  return {
    summaryCN: "客户给出低分评价，表达了对产品的不满，需要优先处理。",
    summaryEN: "Customer gave a low rating expressing dissatisfaction, requires priority handling.",
    replyCN: "我们非常抱歉您对产品感到不满意。您的体验对我们非常重要。请通过 support@aulexmed.com 联系我们，我们希望能了解详情并为您提供帮助。",
    replyEN: "We're very sorry to hear you're not satisfied with the product. Your experience matters to us. Please contact support@aulexmed.com — we'd like to understand more and assist you.",
    privateReply: "Dear customer, we sincerely apologize for your experience. We take every review seriously and would like to make things right. Please reach out to our support team at support@aulexmed.com so we can address your concerns directly. Your satisfaction is our priority.",
  };
}
