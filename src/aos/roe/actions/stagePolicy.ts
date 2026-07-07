import type { NormalizedReview, ReviewAnalysis } from "../types/review.ts";

export function getStage1ActionPlan(review: NormalizedReview, analysis: ReviewAnalysis) {
  const actions = ["save_review_case", "save_ai_analysis", "save_public_reply_draft"];

  if (analysis.needs_private_message) {
    actions.push("save_private_message_draft");
  }

  if (analysis.needs_after_sales_case || review.star_rating <= 3) {
    actions.push("manual_review_required");
  }

  if (analysis.needs_feishu_alert) {
    actions.push("send_feishu_alert_or_dry_run_log");
  }

  return {
    stage: 1,
    safe_to_auto_send_public_reply: false,
    safe_to_auto_send_private_message: false,
    dangerous_actions_blocked: ["refund", "compensation", "order_edit", "automatic_private_message_send"],
    actions
  };
}
