import { DesktopOperator } from "../../core/operator.js";
import { logger } from "../../../../core/logging/logger.js";
import type { Result } from "../../../../core/types/index.js";
import { ok, err } from "../../../../core/types/index.js";

const TIKTOK_PROCESS = "ziniaobrowser";

export interface TikTokReplyInput {
  reviewId: string;
  replyText: string;
  language: "cn" | "en";
}

export interface TikTokReplyResult {
  status: "draft_pasted" | "paused_for_human" | "failed";
  screenshotPath?: string;
  detail: string;
}

export class TikTokConnector {
  private op: DesktopOperator;

  constructor(op: DesktopOperator) {
    this.op = op;
  }

  async focus(): Promise<void> {
    this.op.activateApp(TIKTOK_PROCESS);
    await this.op.wait(500);

    const win = this.op.findWindow(TIKTOK_PROCESS);
    if (win) {
      logger.info("TikTok window active", {
        title: win.title,
        size: `${win.size.width}x${win.size.height}`,
      });
    } else {
      logger.warn("TikTok window not found");
    }
  }

  async replyToReview(input: TikTokReplyInput): Promise<Result<TikTokReplyResult>> {
    try {
      await this.focus();
      await this.op.wait(500);

      const screenshotBefore = this.op.screenshot();
      logger.info("Starting TikTok reply workflow", {
        reviewId: input.reviewId,
        textLength: input.replyText.length,
      });

      this.op.pasteText(input.replyText);
      await this.op.wait(300);

      const screenshotAfter = this.op.screenshot();

      logger.info("TikTok reply draft pasted — PAUSED FOR HUMAN REVIEW", {
        reviewId: input.reviewId,
        language: input.language,
      });

      logger.warn(">>> HUMAN ACTION REQUIRED <<<");
      logger.warn("1. Verify the reply text is correct");
      logger.warn("2. Verify it's pasted in the correct reply box");
      logger.warn("3. Click Submit/Send ONLY after reviewing");
      logger.warn(`Screenshots: ${screenshotBefore}, ${screenshotAfter}`);

      return ok({
        status: "paused_for_human",
        screenshotPath: screenshotAfter,
        detail: "Reply draft pasted. Human review required before clicking Send.",
      });
    } catch (error) {
      return err(error instanceof Error ? error : new Error(String(error)));
    }
  }

  async screenshotWindow(): Promise<string> {
    const win = this.op.findWindow(TIKTOK_PROCESS);
    if (!win) return "";

    const path = `/tmp/aos-tiktok-${Date.now()}.png`;
    const { execSync } = await import("node:child_process");
    execSync(
      `screencapture -C -m -x -R${win.position.x},${win.position.y},${win.size.width},${win.size.height} "${path}"`,
      { timeout: 10000 },
    );
    return path;
  }
}
