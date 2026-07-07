import {
  supabaseGet,
  supabasePost,
  supabasePatch,
} from "../../../infra/database/client.js";
import { logger } from "../../../core/logging/logger.js";
import type {
  ReviewCaseRecord,
  ReviewCaseAction,
  ReviewCaseMessage,
  ReviewDailySummary,
  ReviewCaseStatus,
  ReviewAnalysis,
} from "../types.js";
import type { NormalizedReview } from "../types.js";

export async function findReviewCaseBySource(
  platform: string,
  sourceKey: string,
): Promise<ReviewCaseRecord | null> {
  const rows = await supabaseGet<ReviewCaseRecord>("review_cases", {
    platform,
    source_key: `eq.${sourceKey}`,
    limit: "1",
  });
  return rows[0] ?? null;
}

export async function upsertReviewCase(
  review: NormalizedReview,
  dryRun: boolean,
): Promise<ReviewCaseRecord | null> {
  if (dryRun) {
    logger.debug("DRY RUN: skip upsertReviewCase", { sourceKey: review.source_key });
    return null;
  }

  const rows = await supabasePost<ReviewCaseRecord>("review_cases", {
    ...review,
    status: "new" as ReviewCaseStatus,
    on_conflict: "platform,source_key",
  });

  return rows[0] ?? null;
}

export async function updateReviewCaseAnalysis(
  caseId: string,
  analysis: ReviewAnalysis,
  dryRun: boolean,
): Promise<ReviewCaseRecord | null> {
  if (dryRun) {
    logger.debug("DRY RUN: skip updateReviewCaseAnalysis", { caseId });
    return null;
  }

  const newStatus: ReviewCaseStatus = analysis.needs_after_sales_case || analysis.needs_human_review
    ? "needs_human_review"
    : "ready_to_reply";

  const rows = await supabasePatch<ReviewCaseRecord>(
    "review_cases",
    {
      ...analysis,
      status: newStatus,
    },
    { id: `eq.${caseId}` },
  );

  return rows[0] ?? null;
}

export async function createReviewAction(
  caseId: string,
  actionType: string,
  actionData: Record<string, unknown> = {},
  dryRun: boolean,
): Promise<ReviewCaseAction | null> {
  if (dryRun) {
    logger.debug("DRY RUN: skip createReviewAction", { caseId, actionType });
    return null;
  }

  const rows = await supabasePost<ReviewCaseAction>("review_case_actions", {
    case_id: caseId,
    action_type: actionType,
    action_data: actionData,
  });

  return rows[0] ?? null;
}

export async function createReviewMessage(
  caseId: string,
  direction: ReviewCaseMessage["direction"],
  content: string,
  language: string,
  dryRun: boolean,
): Promise<ReviewCaseMessage | null> {
  if (dryRun) {
    logger.debug("DRY RUN: skip createReviewMessage", { caseId, direction });
    return null;
  }

  const rows = await supabasePost<ReviewCaseMessage>("review_case_messages", {
    case_id: caseId,
    direction,
    content,
    language,
  });

  return rows[0] ?? null;
}

export async function createReviewDailySummary(
  summary: Omit<ReviewDailySummary, "id" | "created_at">,
  dryRun: boolean,
): Promise<ReviewDailySummary | null> {
  if (dryRun) {
    logger.debug("DRY RUN: skip createReviewDailySummary", { platform: summary.platform, date: summary.date });
    return null;
  }

  const rows = await supabasePost<ReviewDailySummary>("review_daily_summaries", summary);
  return rows[0] ?? null;
}

export async function hasSupabaseConfig(): Promise<boolean> {
  try {
    const { getConfig } = await import("../../../core/config/env.js");
    const config = getConfig();
    return Boolean(config.SUPABASE_URL && config.SUPABASE_SERVICE_ROLE_KEY);
  } catch {
    return false;
  }
}
