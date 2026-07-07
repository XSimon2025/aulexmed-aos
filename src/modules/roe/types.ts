import type { Platform } from "../../core/types/index.js";

export type ReviewPlatform = Platform;

export type ReviewSentiment = "positive" | "neutral" | "negative" | "mixed";

export type ReviewIssueType =
  | "product_quality"
  | "size_fit"
  | "shipping"
  | "packaging"
  | "customer_service"
  | "price"
  | "product_damage"
  | "missing_parts"
  | "description_mismatch"
  | "other"
  | "none";

export type ReviewCaseStatus =
  | "new"
  | "analyzed"
  | "ready_to_reply"
  | "replied"
  | "needs_human_review"
  | "closed"
  | "archived"
  | "processing_failed";

export type ReviewActionType =
  | "collected"
  | "analyzed"
  | "reply_drafted"
  | "reply_sent"
  | "feishu_notified"
  | "status_changed"
  | "note_added"
  | "error";

export interface RawReviewInput {
  platform?: ReviewPlatform;
  reviewer_name?: string;
  star_rating?: number;
  review_text?: string;
  review_url?: string;
  reviewer_avatar?: string;
  order_id?: string;
  product_sku?: string;
  product_name?: string;
  review_date_raw?: string;
  raw_payload?: Record<string, unknown>;
  [key: string]: unknown;
}

export interface NormalizedReview {
  platform: ReviewPlatform;
  source_key: string;
  reviewer_name?: string;
  star_rating: number;
  review_text?: string;
  review_url?: string;
  reviewer_avatar?: string;
  order_id?: string;
  product_sku?: string;
  product_name?: string;
  review_date_raw?: string;
  review_date?: string;
  raw_payload?: Record<string, unknown>;
}

export interface ReviewAnalysis {
  sentiment: ReviewSentiment;
  issue_type: ReviewIssueType;
  summary_cn: string;
  summary_en: string;
  reply_draft_cn: string;
  reply_draft_en: string;
  private_reply_draft: string;
  needs_after_sales_case: boolean;
  needs_human_review: boolean;
  risk_level: "low" | "medium" | "high" | "critical";
  ai_confidence: number;
}

export interface ReviewCaseRecord extends NormalizedReview, Partial<ReviewAnalysis> {
  id: string;
  status: ReviewCaseStatus;
  created_at: string;
  updated_at: string;
}

export interface ReviewCaseAction {
  id: string;
  case_id: string;
  action_type: ReviewActionType;
  action_data: Record<string, unknown>;
  created_at: string;
}

export interface ReviewCaseMessage {
  id: string;
  case_id: string;
  direction: "draft_public" | "draft_private" | "sent_public" | "sent_private";
  content: string;
  language: string;
  sent_at?: string;
  created_at: string;
}

export interface ReviewDailySummary {
  id: string;
  platform: ReviewPlatform;
  date: string;
  stats: {
    total: number;
    by_rating: Record<number, number>;
    by_sentiment: Record<string, number>;
    high_risk: number;
    needs_after_sales: number;
  };
  report_text?: string;
  created_at: string;
}
