export type ReviewPlatform = "tiktok" | "temu" | "amazon";

export type ReviewSentiment = "positive" | "neutral" | "negative" | "mixed";

export type ReviewIssueType =
  | "none"
  | "size_fit"
  | "damaged"
  | "missing_parts"
  | "logistics"
  | "refund"
  | "usage"
  | "wrong_item"
  | "quality"
  | "other";

export type ReviewCaseStatus =
  | "new"
  | "analyzed"
  | "needs_human_review"
  | "ready_to_reply"
  | "public_replied"
  | "dm_drafted"
  | "follow_up"
  | "resolved"
  | "ignored";

export type ReviewActionType =
  | "collect"
  | "analyze"
  | "draft_public_reply"
  | "draft_private_message"
  | "feishu_notify"
  | "daily_summary"
  | "skip_duplicate"
  | "manual_review_required";

export type RawReviewInput = {
  platform?: ReviewPlatform;
  shop_region?: string | null;
  star_rating: number;
  review_content?: string | null;
  review_language?: string | null;
  review_date?: string | null;
  username?: string | null;
  product_name?: string | null;
  product_id?: string | null;
  order_id?: string | null;
  sku?: string | null;
  size_model?: string | null;
  has_public_reply?: boolean | null;
  public_reply_content?: string | null;
  can_open_review_detail?: boolean | null;
  can_open_order_detail?: boolean | null;
  needs_private_message?: boolean | null;
  external_review_id?: string | null;
  source_url?: string | null;
  raw_payload?: Record<string, unknown>;
};

export type NormalizedReview = Required<
  Pick<RawReviewInput, "platform" | "star_rating">
> &
  Omit<RawReviewInput, "platform" | "star_rating"> & {
    source_key: string;
  };

export type ReviewAnalysis = {
  language: string;
  sentiment: ReviewSentiment;
  product_name: string | null;
  product_model: string | null;
  issue_type: ReviewIssueType;
  issue_reason: string | null;
  is_negative_review: boolean;
  needs_public_reply: boolean;
  needs_private_message: boolean;
  needs_after_sales_case: boolean;
  needs_feishu_alert: boolean;
  should_add_to_knowledge_base: boolean;
  priority: "low" | "medium" | "high" | "urgent";
  summary_cn: string;
  suggested_solution: string;
  public_reply_draft: string;
  private_message_draft: string | null;
  compliance_notes: string[];
};

export type ReviewCaseRecord = NormalizedReview &
  Partial<ReviewAnalysis> & {
    id?: string;
    status?: ReviewCaseStatus;
    ai_source?: "deepseek" | "fallback";
    created_at?: string;
    updated_at?: string;
  };

export type ReviewDailySummary = {
  summary_date: string;
  platform: ReviewPlatform;
  shop_region: string | null;
  total_reviews: number;
  five_star_reply_count: number;
  four_star_reply_count: number;
  low_star_case_count: number;
  public_reply_draft_count: number;
  private_message_draft_count: number;
  pending_follow_up_count: number;
  top_issues: Array<{ issue_type: string; count: number }>;
  content_team_suggestions: string[];
  product_knowledge_suggestions: string[];
};
