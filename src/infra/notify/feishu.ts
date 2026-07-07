import { getConfig } from "../../core/config/env.js";
import { logger } from "../../core/logging/logger.js";
import type { FeishuNotification } from "./types.js";

export async function sendFeishuNotification(
  notification: FeishuNotification,
): Promise<void> {
  const config = getConfig();

  try {
    const response = await fetch(config.FEISHU_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        msg_type: "interactive",
        card: {
          header: {
            title: { tag: "plain_text", content: notification.title },
            template: "red",
          },
          elements: [
            { tag: "markdown", content: notification.content },
            {
              tag: "note",
              elements: [
                {
                  tag: "plain_text",
                  content: `AOS · ${new Date().toISOString()}`,
                },
              ],
            },
          ],
        },
      }),
    });

    if (!response.ok) {
      logger.warn("Feishu notification failed", {
        status: response.status,
        title: notification.title,
      });
    }

    logger.debug("Feishu notification sent", { title: notification.title });
  } catch (error) {
    logger.warn("Feishu notification error", {
      error: error instanceof Error ? error.message : String(error),
    });
  }
}
