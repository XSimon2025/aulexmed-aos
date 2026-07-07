import type { NormalizedReview, ReviewAnalysis } from "../types.js";
import {
  findReviewCaseBySource,
  upsertReviewCase,
  updateReviewCaseAnalysis,
  createReviewAction,
  createReviewMessage,
} from "../db/supabase.js";
import { analyzeReview } from "../analyzers/deepseek.js";
import { shouldCreateMessages } from "../actions/stagePolicy.js";
import { sendFeishuNotification } from "../../../infra/notify/feishu.js";
import { logger } from "../../../core/logging/logger.js";
import type { Result } from "../../../core/types/index.js";
import { ok, err } from "../../../core/types/index.js";

export interface ProcessedReview {
  caseId: string | null;
  sourceKey: string;
  status: "skipped_duplicate" | "analyzed" | "dry_run";
  analysis?: ReviewAnalysis;
}

export interface ProcessOptions {
  dryRun: boolean;
  stage: number;
}

export async function processReview(
  review: NormalizedReview,
  options: ProcessOptions,
): Promise<Result<ProcessedReview>> {
  const { dryRun } = options;

  logger.info("Processing review", {
    platform: review.platform,
    sourceKey: review.source_key,
    starRating: review.star_rating,
    dryRun,
    stage: options.stage,
  });

  const existing = await findReviewCaseBySource(review.platform, review.source_key).catch(() => null);
  if (existing) {
    logger.debug("Duplicate review, skipping", { sourceKey: review.source_key });
    await createReviewAction(existing.id, "collected", { skipped_duplicate: true }, dryRun);
    return ok({ caseId: existing.id, sourceKey: review.source_key, status: "skipped_duplicate" });
  }

  const caseRecord = await upsertReviewCase(review, dryRun);
  const caseId = caseRecord?.id ?? null;

  if (dryRun) {
    logger.info("Dry run complete", { sourceKey: review.source_key });
    return ok({ caseId, sourceKey: review.source_key, status: "dry_run" });
  }

  await createReviewAction(caseId!, "collected", {}, dryRun);

  const analysisResult = await analyzeReview({
    star_rating: review.star_rating,
    review_text: review.review_text,
    product_name: review.product_name,
  });

  if (!analysisResult.ok) {
    await createReviewAction(caseId!, "error", { error: String(analysisResult.error) }, dryRun);
    return err(analysisResult.error);
  }

  const analysis = analysisResult.data;
  await updateReviewCaseAnalysis(caseId!, analysis, dryRun);
  await createReviewAction(caseId!, "analyzed", { sentiment: analysis.sentiment }, dryRun);

  const msgs = shouldCreateMessages(analysis);
  if (msgs.public) {
    if (analysis.reply_draft_cn) {
      await createReviewMessage(caseId!, "draft_public", analysis.reply_draft_cn, "cn", dryRun);
    }
    if (analysis.reply_draft_en) {
      await createReviewMessage(caseId!, "draft_public", analysis.reply_draft_en, "en", dryRun);
    }
  }
  if (msgs.private && analysis.private_reply_draft) {
    await createReviewMessage(caseId!, "draft_private", analysis.private_reply_draft, "en", dryRun);
  }

  if (analysis.risk_level === "high" || analysis.risk_level === "critical") {
    await sendFeishuNotification({
      title: `${analysis.risk_level.toUpperCase()} Risk Review`,
      content: [
        `**Platform**: ${review.platform}`,
        `**Rating**: ${"★".repeat(review.star_rating)}`,
        `**Sentiment**: ${analysis.sentiment}`,
        `**Issue**: ${analysis.issue_type}`,
        `**Review**: ${review.review_text?.slice(0, 200) ?? "(no text)"}`,
        `**Action**: Needs human review, reply drafts generated`,
      ].join("\n"),
    }).catch(() => {});

    await createReviewAction(caseId!, "feishu_notified", { risk_level: analysis.risk_level }, dryRun);
  }

  logger.info("Review processed", {
    caseId,
    sourceKey: review.source_key,
    sentiment: analysis.sentiment,
    riskLevel: analysis.risk_level,
  });

  return ok({
    caseId,
    sourceKey: review.source_key,
    status: "analyzed",
    analysis,
  });
}
