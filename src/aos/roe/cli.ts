import { readFileSync } from "node:fs";
import { loadLocalEnv } from "./utils/env.ts";
import { collectTikTokReviewsFromFile, getTikTokManualTemplate } from "./connectors/tiktok/fileCollector.ts";
import { processReview } from "./services/reviewProcessor.ts";
import { buildDailySummary } from "./reports/dailySummary.ts";
import { createReviewDailySummary, hasSupabaseConfig } from "./db/supabase.ts";
import type { NormalizedReview } from "./types/review.ts";

type CliOptions = {
  source?: string;
  dryRun: boolean;
  limit?: number;
};

function getArg(name: string) {
  const prefix = `--${name}=`;
  const found = process.argv.find((arg) => arg.startsWith(prefix));
  return found ? found.slice(prefix.length) : undefined;
}

function hasFlag(name: string) {
  return process.argv.includes(`--${name}`);
}

function getOptions(): CliOptions {
  const limitValue = getArg("limit");
  return {
    source: getArg("source"),
    dryRun: hasFlag("dry-run") || process.argv[2] === "dry-run",
    limit: limitValue ? Number(limitValue) : undefined
  };
}

function printUsage() {
  console.log([
    "AOS-ROE v1",
    "",
    "Commands:",
    "  npm run aos:roe:collect -- --source=tmp/tiktok-reviews.json --dry-run",
    "  npm run aos:roe:analyze -- --source=tmp/tiktok-reviews.json --dry-run",
    "  npm run aos:roe:dry-run -- --source=tmp/tiktok-reviews.json",
    "",
    "JSON input can be an array or { \"reviews\": [...] }.",
    "",
    "Template:",
    JSON.stringify(getTikTokManualTemplate(), null, 2)
  ].join("\n"));
}

function loadReviews(options: CliOptions): NormalizedReview[] {
  if (!options.source) {
    printUsage();
    throw new Error("Missing --source. Stage 1 uses a JSON export/manual page capture file.");
  }

  const reviews = collectTikTokReviewsFromFile(options.source);
  return options.limit ? reviews.slice(0, options.limit) : reviews;
}

async function runCollect(options: CliOptions) {
  const reviews = loadReviews(options);
  console.log(`Collected ${reviews.length} TikTok review(s).`);
  console.log(JSON.stringify(reviews, null, 2));
}

async function runAnalyze(options: CliOptions) {
  const reviews = loadReviews(options);
  const results = [];

  for (const review of reviews) {
    results.push(await processReview(review, { dryRun: options.dryRun }));
  }

  const summary = buildDailySummary({
    platform: "tiktok",
    reviews: results.map((item) => ({
      star_rating: item.review.star_rating,
      shop_region: item.review.shop_region,
      analysis: item.analysis
    }))
  });

  if (!options.dryRun && hasSupabaseConfig()) {
    await createReviewDailySummary(summary);
  }

  console.log(
    JSON.stringify(
      {
        dryRun: options.dryRun,
        processed: results.length,
        duplicates: results.filter((item) => item.duplicate).length,
        summary,
        results
      },
      null,
      2
    )
  );
}

async function main() {
  loadLocalEnv();
  const command = process.argv[2] || "help";
  const options = getOptions();

  if (command === "help" || command === "--help" || hasFlag("help")) {
    printUsage();
    return;
  }

  if (command === "collect") {
    await runCollect(options);
    return;
  }

  if (command === "analyze" || command === "dry-run") {
    await runAnalyze({ ...options, dryRun: command === "dry-run" ? true : options.dryRun });
    return;
  }

  throw new Error(`Unknown AOS-ROE command: ${command}`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
