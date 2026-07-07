import type { LogLevel } from "../types/index.js";

const LEVEL_RANK: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

function getLevel(): LogLevel {
  const raw = process.env["AOS_LOG_LEVEL"];
  if (raw === "debug" || raw === "info" || raw === "warn" || raw === "error") {
    return raw;
  }
  return "info";
}

function shouldLog(level: LogLevel): boolean {
  return LEVEL_RANK[level] >= LEVEL_RANK[getLevel()];
}

function format(level: LogLevel, message: string, meta?: Record<string, unknown>) {
  const entry = {
    ts: new Date().toISOString(),
    level,
    message,
    ...meta,
  };
  return JSON.stringify(entry);
}

export const logger = {
  debug(message: string, meta?: Record<string, unknown>) {
    if (shouldLog("debug")) process.stderr.write(format("debug", message, meta) + "\n");
  },
  info(message: string, meta?: Record<string, unknown>) {
    if (shouldLog("info")) process.stderr.write(format("info", message, meta) + "\n");
  },
  warn(message: string, meta?: Record<string, unknown>) {
    if (shouldLog("warn")) process.stderr.write(format("warn", message, meta) + "\n");
  },
  error(message: string, meta?: Record<string, unknown>) {
    if (shouldLog("error")) process.stderr.write(format("error", message, meta) + "\n");
  },
};
