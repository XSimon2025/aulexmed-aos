import { Hono } from "hono";
import { logger } from "../core/logging/logger.js";

const app = new Hono();

app.get("/health", (c) => {
  logger.debug("API health check");
  return c.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.notFound((c) => {
  return c.json({ error: "Not found" }, 404);
});

app.onError((err, c) => {
  logger.error("API error", { error: err.message });
  return c.json({ error: "Internal server error" }, 500);
});

export default app;
