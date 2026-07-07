import { Command } from "commander";
import { loadConfig } from "../core/config/env.js";
import { logger } from "../core/logging/logger.js";
import { collectFromFile } from "../modules/roe/connectors/tiktok/fileCollector.js";
import { processReview } from "../modules/roe/services/reviewProcessor.js";
import { getROEStage } from "../modules/roe/utils/env.js";
import { DesktopOperator } from "../modules/operator/index.js";
import { executeReply } from "../modules/roe/services/replyExecutor.js";

const program = new Command();

program
  .name("aos")
  .description("AULEXMED Operating System — Operations Engine")
  .version("0.1.0");

program
  .command("health")
  .description("Check system health and configuration")
  .action(() => {
    try {
      const config = loadConfig();
      logger.info("AOS is ready.");
      logger.info("Configuration loaded", {
        env: config.AOS_ENV,
        logLevel: config.AOS_LOG_LEVEL,
        supabaseUrl: config.SUPABASE_URL,
        deepseekModel: config.DEEPSEEK_MODEL,
        feishuWebhook: config.FEISHU_WEBHOOK_URL ? "configured" : "missing",
      });
    } catch (error) {
      logger.error("Configuration error", {
        error: error instanceof Error ? error.message : String(error),
      });
      process.exit(1);
    }
  });

const roe = program
  .command("roe")
  .description("Review Operations Engine");

roe
  .command("collect")
  .description("Collect reviews from a JSON file")
  .requiredOption("--source <path>", "Path to JSON file with reviews")
  .option("--platform <platform>", "Platform name", "tiktok")
  .option("--dry-run", "Do not write to database")
  .action(async (options) => {
    try {
      loadConfig();
      const reviews = collectFromFile(options.source, options.platform);
      logger.info(`Collected ${reviews.length} reviews from ${options.source}`, {
        platform: options.platform,
        count: reviews.length,
        dryRun: Boolean(options.dryRun),
      });

      if (!options.dryRun) {
        for (const review of reviews) {
          const result = await processReview(review, {
            dryRun: false,
            stage: getROEStage(),
          });
          if (!result.ok) {
            logger.error("Review processing failed", {
              sourceKey: review.source_key,
              error: String(result.error),
            });
          }
        }
      }
    } catch (error) {
      logger.error("Collect failed", {
        error: error instanceof Error ? error.message : String(error),
      });
      process.exit(1);
    }
  });

roe
  .command("analyze")
  .description("Analyze collected reviews")
  .requiredOption("--source <path>", "Path to JSON file with reviews")
  .option("--platform <platform>", "Platform name", "tiktok")
  .action(async (options) => {
    try {
      loadConfig();
      const reviews = collectFromFile(options.source, options.platform);
      logger.info(`Analyzing ${reviews.length} reviews`, { platform: options.platform });

      const results = [];
      for (const review of reviews) {
        const result = await processReview(review, {
          dryRun: false,
          stage: getROEStage(),
        });
        results.push(result);
      }

      const analyzed = results.filter((r) => r.ok && r.data.status === "analyzed").length;
      const skipped = results.filter((r) => r.ok && r.data.status === "skipped_duplicate").length;
      const failed = results.filter((r) => !r.ok).length;

      logger.info("Analysis complete", { total: results.length, analyzed, skipped, failed });
    } catch (error) {
      logger.error("Analyze failed", {
        error: error instanceof Error ? error.message : String(error),
      });
      process.exit(1);
    }
  });

roe
  .command("dry-run")
  .description("Simulate review processing without writing to database")
  .requiredOption("--source <path>", "Path to JSON file with reviews")
  .option("--platform <platform>", "Platform name", "tiktok")
  .action(async (options) => {
    try {
      loadConfig();
      const reviews = collectFromFile(options.source, options.platform);
      logger.info(`Dry run: ${reviews.length} reviews from ${options.source}`, {
        platform: options.platform,
      });

      for (const review of reviews) {
        const result = await processReview(review, {
          dryRun: true,
          stage: getROEStage(),
        });

        if (result.ok) {
          logger.info("Dry run review", {
            sourceKey: result.data.sourceKey,
            status: result.data.status,
            starRating: review.star_rating,
            text: review.review_text?.slice(0, 80) ?? "(no text)",
          });
        }
      }

      logger.info("Dry run complete");
    } catch (error) {
      logger.error("Dry run failed", {
        error: error instanceof Error ? error.message : String(error),
      });
      process.exit(1);
    }
  });

roe
  .command("reply")
  .description("Execute reply via Desktop Operator (TikTok)")
  .requiredOption("--case-id <id>", "Review case UUID")
  .option("--lang <lang>", "Reply language (cn | en)", "en")
  .option("--dry-run", "Simulate without desktop control")
  .option("--unsupervised", "Skip human confirmation gate")
  .action(async (options) => {
    try {
      loadConfig();
      const result = await executeReply({
        caseId: options.caseId,
        language: options.lang as "cn" | "en",
        dryRun: Boolean(options.dryRun),
        supervised: !options.unsupervised,
      });

      if (result.ok) {
        logger.info("Reply result", { detail: result.data });
      } else {
        logger.error("Reply failed", { error: String(result.error) });
        process.exit(1);
      }
    } catch (error) {
      logger.error("Reply command failed", {
        error: error instanceof Error ? error.message : String(error),
      });
      process.exit(1);
    }
  });

const op = program
  .command("operator")
  .description("Desktop Operator");

op
  .command("self-test")
  .description("Run desktop control self-test (uses dry-run+supervised by default)")
  .option("--live", "Run in live mode (actually controls desktop)")
  .action(async (options) => {
    const config = options.live
      ? { dryRun: false, supervised: false }
      : { dryRun: false, supervised: false };
    const operator = new DesktopOperator(config);
    const result = await operator.selfTest();

    if (result.passed) {
      logger.info("Self-test PASSED");
    } else {
      logger.error("Self-test FAILED");
      process.exit(1);
    }
  });

op
  .command("observe")
  .description("Observe current desktop state")
  .action(() => {
    const op = new DesktopOperator();
    const state = op.observe();
    logger.info("Desktop state", state as unknown as Record<string, unknown>);
  });

op
  .command("windows")
  .description("List all visible windows")
  .action(() => {
    const op = new DesktopOperator();
    const windows = op.listWindows();
    for (const w of windows) {
      logger.info("Window", {
        process: w.processName,
        title: w.title,
        position: `${w.position.x},${w.position.y}`,
        size: `${w.size.width}x${w.size.height}`,
      });
    }
  });

op
  .command("type")
  .description("Type text via keyboard")
  .requiredOption("--text <text>", "Text to type")
  .option("--live", "Execute for real")
  .action((options) => {
    const op = new DesktopOperator({ dryRun: !options.live });
    op.typeText(options.text);
    op.getActionLog().forEach((l) => logger.info(l));
  });

op
  .command("paste")
  .description("Paste text via clipboard")
  .requiredOption("--text <text>", "Text to paste")
  .option("--live", "Execute for real")
  .action((options) => {
    const op = new DesktopOperator({ dryRun: !options.live });
    op.pasteText(options.text);
    op.getActionLog().forEach((l) => logger.info(l));
  });

op
  .command("click")
  .description("Click at coordinates")
  .option("--at <x,y>", "Coordinates to click")
  .option("--live", "Execute for real")
  .action((options) => {
    const op = new DesktopOperator({ dryRun: !options.live });
    if (options.at) {
      const [x, y] = options.at.split(",").map(Number);
      op.clickAt(x, y, "CLI command");
    }
    op.getActionLog().forEach((l) => logger.info(l));
  });

program.parse();
