import type { Action, ActionResult } from "../types.js";
import { isBlocked, isDangerous } from "../safety/policy.js";
import { logger } from "../../../core/logging/logger.js";
import * as keyboard from "../desktop/keyboard.js";
import * as mouse from "../desktop/mouse.js";
import * as clipboard from "../desktop/clipboard.js";

export async function executeAction(action: Action): Promise<ActionResult> {
  if (isBlocked(action.type, action.description)) {
    logger.warn("Action blocked by safety policy", { action: action.description });
    return {
      success: false,
      error: `Blocked by safety policy: ${action.description}`,
      action,
      duration: 0,
    };
  }

  if (isDangerous(action.type, action.description)) {
    logger.info("Action requires human confirmation", { action: action.description });
    return {
      success: false,
      error: `Requires human confirmation: ${action.description}`,
      action,
      duration: 0,
    };
  }

  const start = Date.now();

  try {
    const payload = action.payload as Record<string, unknown>;

    switch (action.type) {
      case "key_press": {
        keyboard.pressKey(String(payload["key"] ?? ""));
        break;
      }
      case "key_combo": {
        keyboard.keyCombo(
          (payload["modifiers"] as string[] ?? []) as Parameters<typeof keyboard.keyCombo>[0],
          String(payload["key"] ?? ""),
        );
        break;
      }
      case "type_text": {
        keyboard.typeText(String(payload["text"] ?? ""));
        break;
      }
      case "paste_text": {
        clipboard.copyToClipboard(String(payload["text"] ?? ""));
        keyboard.cmdV();
        break;
      }
      case "mouse_move": {
        mouse.moveTo(Number(payload["x"]), Number(payload["y"]));
        break;
      }
      case "mouse_click": {
        if (payload["x"] !== undefined && payload["y"] !== undefined) {
          mouse.clickAt(Number(payload["x"]), Number(payload["y"]));
        } else {
          mouse.click();
        }
        break;
      }
      case "focus_window": {
        const { focusWindow } = await import("../desktop/window-manager.js");
        focusWindow(String(payload["processName"] ?? ""));
        break;
      }
      case "wait": {
        const ms = Number(payload["ms"] ?? 1000);
        await new Promise((resolve) => setTimeout(resolve, ms));
        break;
      }
      case "pause_human": {
        logger.info("Paused for human review");
        break;
      }
      default: {
        return {
          success: false,
          error: `Unknown action type: ${action.type}`,
          action,
          duration: Date.now() - start,
        };
      }
    }

    const duration = Date.now() - start;
    return { success: true, action, duration };
  } catch (error) {
    const duration = Date.now() - start;
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
      action,
      duration,
    };
  }
}
