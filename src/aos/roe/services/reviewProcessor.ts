import type { NormalizedReview, ReviewAnalysis } from "../types/review.ts";
import { analyzeReviewWithDeepSeek } from "../analyzers/deepseek.ts";
import {
  createReviewAction,
  createReviewMessage,
  findReviewCaseBySource,
  hasSupabaseConfig,
  updateReviewCaseAnalysis,
  upsertReviewCase
} from "../db/supabase.ts";
import { sendReviewFeishuAlert, shouldNotifyFeishu } from "./feishu.ts";
import { getStage1ActionPlan } from "../actions/stagePolicy.ts";

export type ProcessedReview = {
  review: NormalizedReview;
  analysis: ReviewAnalysis;
  caseId: string | null;
  duplicate: boolean;
  aiSource: "deepseek" | "fallback";
  actionPlan: ReturnType<typeof getStage1ActionPlan>;
};

export async function processReview(review: NormalizedReview, options: { dryRun?: boolean } = {}) {
  const dryRun = options.dryRun ?? true;
  const existing = hasSupabaseConfig()
    ? await findReviewCaseBySource(review.platform, review.source_key).catch((error) => {
        console.error("AOS-ROE duplicate lookup failed", error);
        return null;
      })
    : null;

  if (existing) {
    if (!dryRun) {
      await createReviewAction({
        review_case_id: existing.id ?? null,
        action_type: "skip_duplicate",
        action_payload: { source_key: review.source_key },
        dry_run: false
      });
    }

    return {
      review,
      analysis: existing as unknown as ReviewAnalysis,
      caseId: existing.id ?? null,
      duplicate: true,
      aiSource: (existing.ai_source as "deepseek" | "fallback") || "fallback",
      actionPlan: getStage1ActionPlan(review, existing as unknown as ReviewAnalysis)
    } satisfies ProcessedReview;
  }

  const savedCase = dryRun ? null : await upsertReviewCase(review);
  const { analysis, source } = await analyzeReviewWithDeepSeek(review);
  const caseId = savedCase?.id ?? null;
  const actionPlan = getStage1ActionPlan(review, analysis);

  if (!dryRun && caseId) {
    await updateReviewCaseAnalysis(caseId, analysis, source);
    await createReviewMessage({
      review_case_id: caseId,
      message_type: "public_reply_draft",
      language: analysis.language,
      body: analysis.public_reply_draft
    });

    if (analysis.private_message_draft) {
      await createReviewMessage({
        review_case_id: caseId,
        message_type: "private_message_draft",
        language: analysis.language,
        body: analysis.private_message_draft
      });
    }

    await createReviewAction({
      review_case_id: caseId,
      action_type: "analyze",
      action_payload: { ai_source: source, actionPlan },
      dry_run: false
    });
  }

  if (shouldNotifyFeishu(review, analysis)) {
    const result = await sendReviewFeishuAlert({ review, analysis, caseId, dryRun });
    if (!dryRun) {
      await createReviewAction({
        review_case_id: caseId,
        action_type: "feishu_notify",
        action_payload: { ok: result.ok, skipped: "skipped" in result ? result.skipped : false },
        dry_run: false
      });
    }
  }

  return {
    review,
    analysis,
    caseId,
    duplicate: false,
    aiSource: source,
    actionPlan
  } satisfies ProcessedReview;
}
