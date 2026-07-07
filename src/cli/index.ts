import { Command } from "commander";
import { loadConfig } from "../core/config/env.js";
import { logger } from "../core/logging/logger.js";
import { collectFromFile } from "../modules/roe/connectors/tiktok/fileCollector.js";
import { processReview } from "../modules/roe/services/reviewProcessor.js";
import { getROEStage } from "../modules/roe/utils/env.js";

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

program.parse();
