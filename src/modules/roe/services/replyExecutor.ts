import { DesktopOperator } from "../../operator/core/operator.js";
import { TikTokConnector } from "../../operator/platforms/tiktok/connector.js";
import type { ReviewCaseRecord } from "../types.js";
import { supabaseGet } from "../../../infra/database/client.js";
import { createReviewAction } from "../db/supabase.js";
import { logger } from "../../../core/logging/logger.js";
import type { Result } from "../../../core/types/index.js";
import { ok, err } from "../../../core/types/index.js";

export interface ReplyParams {
  caseId: string;
  language: "cn" | "en";
  dryRun: boolean;
  supervised: boolean;
}

export async function executeReply(params: ReplyParams): Promise<Result<string>> {
  logger.info("Starting reply execution", { caseId: params.caseId, dryRun: params.dryRun });

  const cases = await supabaseGet<ReviewCaseRecord>("review_cases", {
    id: `eq.${params.caseId}`,
    limit: "1",
  }).catch(() => []);

  const reviewCase = cases[0];
  if (!reviewCase) {
    return err(new Error(`Review case not found: ${params.caseId}`));
  }

  const replyText = params.language === "cn"
    ? reviewCase.reply_draft_cn
    : reviewCase.reply_draft_en;

  if (!replyText) {
    return err(new Error(`No ${params.language.toUpperCase()} reply draft for case ${params.caseId}`));
  }

  logger.info("Reply draft loaded", {
    caseId: params.caseId,
    platform: reviewCase.platform,
    starRating: reviewCase.star_rating,
    textPreview: replyText.slice(0, 80),
  });

  const operator = new DesktopOperator({
    dryRun: params.dryRun,
    supervised: params.supervised,
  });

  if (reviewCase.platform === "tiktok") {
    const tiktok = new TikTokConnector(operator);

    const result = await tiktok.replyToReview({
      reviewId: reviewCase.source_key,
      replyText,
      language: params.language,
    });

    if (!result.ok) {
      await createReviewAction(params.caseId, "error", {
        error: String(result.error),
      }, params.dryRun);
      return err(result.error);
    }

    await createReviewAction(params.caseId, "reply_drafted", {
      language: params.language,
      status: result.data.status,
    }, params.dryRun);

    const log = operator.getActionLog();
    logger.info("Reply workflow complete", {
      caseId: params.caseId,
      status: result.data.status,
      actions: log.length,
    });

    return ok(`Reply ${result.data.status}. ${log.length} actions logged. Screenshot: ${result.data.screenshotPath ?? "none"}`);
  }

  return err(new Error(`Unsupported platform: ${reviewCase.platform}`));
}
